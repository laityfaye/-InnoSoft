<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Order;
use App\OrderItem;
use App\Product;
use App\Mail\OrderConfirmationMail;
use App\Mail\NewOrderNotificationMail;
use App\Mail\LowStockNotificationMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class OrderController extends Controller
{
    /**
     * Store a newly created order.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'customer_phone' => 'nullable|string|max:20',
            'shipping_address' => 'required|string|max:1000',
            'city' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:255',
            'payment_method' => 'nullable|string|in:cash,mobile_money,bank_transfer',
            'delivery_type' => 'nullable|string|in:pickup,delivery',
            'customer_latitude' => 'nullable|numeric|between:-90,90',
            'customer_longitude' => 'nullable|numeric|between:-180,180',
            'notes' => 'nullable|string|max:2000',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|integer|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            DB::beginTransaction();

            $data = $request->all();
            $subtotal = 0;
            $items = [];

            // Valider et calculer le total
            foreach ($data['items'] as $itemData) {
                $product = Product::findOrFail($itemData['product_id']);

                // Vérifier le stock
                if ($product->stock < $itemData['quantity']) {
                    DB::rollBack();
                    return response()->json([
                        'success' => false,
                        'message' => "Stock insuffisant pour le produit '{$product->name}'. Stock disponible: {$product->stock}",
                    ], 400);
                }

                // Obtenir le prix actuel (promotionnel si en promotion)
                $currentPrice = $product->getCurrentPrice();
                $itemSubtotal = $currentPrice * $itemData['quantity'];
                $subtotal += $itemSubtotal;

                $items[] = [
                    'product' => $product,
                    'quantity' => $itemData['quantity'],
                    'price' => $currentPrice,
                    'subtotal' => $itemSubtotal,
                ];
            }

            // Gérer la livraison et calculer les frais
            $deliveryType = $data['delivery_type'] ?? 'pickup';
            $deliveryFee = 0;
            $distance = null;
            $storeLatitude = config('store.latitude');
            $storeLongitude = config('store.longitude');
            $customerLatitude = $data['customer_latitude'] ?? null;
            $customerLongitude = $data['customer_longitude'] ?? null;

            // Si livraison, calculer la distance et les frais
            if ($deliveryType === 'delivery' && $customerLatitude && $customerLongitude && $storeLatitude && $storeLongitude) {
                $distance = $this->calculateDistance(
                    $customerLatitude,
                    $customerLongitude,
                    $storeLatitude,
                    $storeLongitude
                );
                
                // Calculer les frais de livraison (250 F par km)
                $feePerKm = config('store.delivery_fee_per_km', 250);
                $deliveryFee = round($distance * $feePerKm);
            }

            // Créer la commande
            $order = Order::create([
                'customer_name' => $data['customer_name'],
                'customer_email' => $data['customer_email'],
                'customer_phone' => $data['customer_phone'] ?? null,
                'shipping_address' => $data['shipping_address'],
                'city' => $data['city'] ?? null,
                'country' => $data['country'] ?? 'Sénégal',
                'payment_method' => $data['payment_method'] ?? 'cash',
                'delivery_type' => $deliveryType,
                'customer_latitude' => $customerLatitude,
                'customer_longitude' => $customerLongitude,
                'store_latitude' => $storeLatitude,
                'store_longitude' => $storeLongitude,
                'distance' => $distance,
                'delivery_fee' => $deliveryFee,
                'status' => 'pending',
                'subtotal' => $subtotal,
                'total' => $subtotal + $deliveryFee,
                'notes' => $data['notes'] ?? null,
            ]);

            // Créer les items de la commande et mettre à jour le stock
            foreach ($items as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product']->id,
                    'product_name' => $item['product']->name,
                    'product_price' => $item['price'],
                    'quantity' => $item['quantity'],
                    'subtotal' => $item['subtotal'],
                ]);

                // Réduire le stock
                $item['product']->decrement('stock', $item['quantity']);
                
                // Recharger le produit pour avoir le stock à jour
                $item['product']->refresh();
                
                // Vérifier si le stock est faible (≤ 1) et envoyer une notification
                if ($item['product']->stock <= 1) {
                    try {
                        $adminEmail = config('mail.admin.address', config('mail.from.address'));
                        Mail::to($adminEmail)->queue(
                            new LowStockNotificationMail($item['product'])
                        );
                    } catch (\Exception $lowStockMailException) {
                        // Si la queue échoue, essayer l'envoi synchrone
                        \Log::warning('Erreur lors de la mise en queue de l\'email stock faible, envoi synchrone: ' . $lowStockMailException->getMessage());
                        try {
                            $adminEmail = config('mail.admin.address', config('mail.from.address'));
                            Mail::to($adminEmail)->send(
                                new LowStockNotificationMail($item['product'])
                            );
                        } catch (\Exception $syncLowStockMailException) {
                            // Log l'erreur mais ne pas faire échouer la commande
                            \Log::error('Erreur lors de l\'envoi de l\'email stock faible: ' . $syncLowStockMailException->getMessage());
                        }
                    }
                }
            }

            // Charger les relations pour la réponse
            $order->load('items.product');

            DB::commit();

            // Envoyer l'email de confirmation au client
            try {
                Mail::to($order->customer_email)->queue(
                    new OrderConfirmationMail($order)
                );
            } catch (\Exception $mailException) {
                // Si la queue échoue, essayer l'envoi synchrone
                \Log::warning('Erreur lors de la mise en queue de l\'email de confirmation, envoi synchrone: ' . $mailException->getMessage());
                try {
                    Mail::to($order->customer_email)->send(
                        new OrderConfirmationMail($order)
                    );
                } catch (\Exception $syncMailException) {
                    // Log l'erreur mais ne pas faire échouer la commande
                    \Log::error('Erreur lors de l\'envoi de l\'email de confirmation: ' . $syncMailException->getMessage());
                }
            }

            // Envoyer une notification à l'administrateur
            try {
                $adminEmail = config('mail.admin.address', config('mail.from.address'));
                Mail::to($adminEmail)->queue(
                    new NewOrderNotificationMail($order)
                );
            } catch (\Exception $adminMailException) {
                // Si la queue échoue, essayer l'envoi synchrone
                \Log::warning('Erreur lors de la mise en queue de l\'email admin, envoi synchrone: ' . $adminMailException->getMessage());
                try {
                    $adminEmail = config('mail.admin.address', config('mail.from.address'));
                    Mail::to($adminEmail)->send(
                        new NewOrderNotificationMail($order)
                    );
                } catch (\Exception $syncAdminMailException) {
                    // Log l'erreur mais ne pas faire échouer la commande
                    \Log::error('Erreur lors de l\'envoi de l\'email admin: ' . $syncAdminMailException->getMessage());
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Votre commande a été créée avec succès. Un email de confirmation vous a été envoyé.',
                'data' => $order,
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            
            \Log::error('Erreur lors de la création de la commande: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Une erreur est survenue lors de la création de la commande.',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Display the specified order (public).
     */
    public function show($id)
    {
        $order = Order::with('items.product')->find($id);

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Commande non trouvée',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $order,
        ]);
    }

    /**
     * Calculer la distance entre deux points GPS en utilisant la formule de Haversine
     * 
     * @param float $lat1 Latitude du premier point
     * @param float $lon1 Longitude du premier point
     * @param float $lat2 Latitude du deuxième point
     * @param float $lon2 Longitude du deuxième point
     * @return float Distance en kilomètres
     */
    private function calculateDistance($lat1, $lon1, $lat2, $lon2)
    {
        $earthRadius = 6371; // Rayon de la Terre en kilomètres

        $dLat = deg2rad($lat2 - $lat1);
        $dLon = deg2rad($lon2 - $lon1);

        $a = sin($dLat / 2) * sin($dLat / 2) +
             cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
             sin($dLon / 2) * sin($dLon / 2);

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));
        $distance = $earthRadius * $c;

        return round($distance, 2);
    }
}

