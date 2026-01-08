<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Boutique;
use App\BoutiqueProduct;
use App\BoutiqueOrder;
use App\BoutiqueOrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class BoutiqueController extends Controller
{
    /**
     * Liste toutes les boutiques actives (public).
     */
    public function index(Request $request)
    {
        $search = $request->query('search', '');
        
        $query = Boutique::with('owner')
            ->where('status', 'active')
            ->latest();

        if ($search) {
            $query->where(function($q) use ($search) {
                $q->whereRaw('LOWER(name) LIKE ?', ['%' . strtolower($search) . '%'])
                  ->orWhereRaw('LOWER(description) LIKE ?', ['%' . strtolower($search) . '%']);
            });
        }

        $boutiques = $query->get();

        return response()->json([
            'success' => true,
            'data' => $boutiques,
        ]);
    }

    /**
     * Afficher une boutique spécifique (public).
     */
    public function show($id)
    {
        $boutique = Boutique::with('owner', 'products')
            ->where('status', 'active')
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $boutique,
        ]);
    }

    /**
     * Afficher une boutique par slug (public).
     */
    public function showBySlug($slug)
    {
        $boutique = Boutique::with('owner', 'products')
            ->where('status', 'active')
            ->where('slug', $slug)
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'data' => $boutique,
        ]);
    }

    /**
     * Liste tous les produits d'une boutique (public).
     */
    public function products($id, Request $request)
    {
        $category = $request->query('category', 'all');
        $search = $request->query('search', '');
        
        $query = BoutiqueProduct::where('boutique_id', $id)
            ->where('status', 'active');

        if ($category !== 'all') {
            $query->where('category', $category);
        }

        if ($search) {
            $query->where(function($q) use ($search) {
                $q->whereRaw('LOWER(name) LIKE ?', ['%' . strtolower($search) . '%'])
                  ->orWhereRaw('LOWER(description) LIKE ?', ['%' . strtolower($search) . '%']);
            });
        }

        $products = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $products,
        ]);
    }

    /**
     * Afficher un produit spécifique (public).
     */
    public function showProduct($boutiqueId, $productId)
    {
        $product = BoutiqueProduct::where('boutique_id', $boutiqueId)
            ->where('id', $productId)
            ->where('status', 'active')
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'data' => $product,
        ]);
    }

    /**
     * Créer une commande pour une boutique (public).
     */
    public function createOrder(Request $request, $boutiqueId)
    {
        $validator = Validator::make($request->all(), [
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'customer_phone' => 'nullable|string|max:20',
            'shipping_address' => 'required|string|max:1000',
            'city' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:255',
            'payment_method' => 'nullable|string|in:cash,mobile_money,bank_transfer',
            'notes' => 'nullable|string|max:2000',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|integer|exists:boutique_products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        // Vérifier que la boutique existe et est active
        $boutique = Boutique::where('status', 'active')->findOrFail($boutiqueId);

        try {
            DB::beginTransaction();

            $data = $request->all();
            $subtotal = 0;
            $items = [];

            // Valider et calculer le total
            foreach ($data['items'] as $itemData) {
                $product = BoutiqueProduct::where('boutique_id', $boutiqueId)
                    ->where('id', $itemData['product_id'])
                    ->where('status', 'active')
                    ->firstOrFail();

                // Vérifier le stock
                if ($product->stock < $itemData['quantity']) {
                    DB::rollBack();
                    return response()->json([
                        'success' => false,
                        'message' => "Stock insuffisant pour le produit '{$product->name}'. Stock disponible: {$product->stock}",
                    ], 400);
                }

                $itemSubtotal = $product->price * $itemData['quantity'];
                $subtotal += $itemSubtotal;

                $items[] = [
                    'product' => $product,
                    'quantity' => $itemData['quantity'],
                    'price' => $product->price,
                    'subtotal' => $itemSubtotal,
                ];
            }

            // Créer la commande
            $order = BoutiqueOrder::create([
                'boutique_id' => $boutiqueId,
                'customer_name' => $data['customer_name'],
                'customer_email' => $data['customer_email'],
                'customer_phone' => $data['customer_phone'] ?? null,
                'shipping_address' => $data['shipping_address'],
                'city' => $data['city'] ?? null,
                'country' => $data['country'] ?? 'Sénégal',
                'payment_method' => $data['payment_method'] ?? 'cash',
                'status' => 'pending',
                'subtotal' => $subtotal,
                'total' => $subtotal,
                'notes' => $data['notes'] ?? null,
            ]);

            // Créer les items de la commande et mettre à jour le stock
            foreach ($items as $item) {
                BoutiqueOrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product']->id,
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['price'],
                    'total' => $item['subtotal'],
                ]);

                // Réduire le stock
                $item['product']->decrement('stock', $item['quantity']);
            }

            // Charger les relations pour la réponse
            $order->load(['items.product', 'boutique']);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Votre commande a été créée avec succès.',
                'data' => $order,
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            
            \Log::error('Erreur lors de la création de la commande: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Une erreur est survenue lors de la création de la commande.',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    // ==================== Méthodes pour les propriétaires de boutique ====================

    /**
     * Obtenir les informations de la boutique du propriétaire connecté.
     */
    public function myBoutique(Request $request)
    {
        $user = $request->user();
        $boutique = Boutique::with('owner')
            ->where('owner_id', $user->id)
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'data' => $boutique,
        ]);
    }

    /**
     * Mettre à jour les informations de la boutique du propriétaire connecté.
     */
    public function updateMyBoutique(Request $request)
    {
        $user = $request->user();
        $boutique = Boutique::where('owner_id', $user->id)->firstOrFail();

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string|max:2000',
            'email' => 'sometimes|required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:1000',
            'logo' => 'nullable|string|max:500',
            'logo_file' => 'nullable|file|mimes:jpeg,jpg,png,gif,webp|max:5120', // 5MB max
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $request->all();

        // Gérer l'upload du logo
        if ($request->hasFile('logo_file')) {
            // Supprimer l'ancien logo si il existe et n'est pas une URL externe
            if ($boutique->logo && !filter_var($boutique->logo, FILTER_VALIDATE_URL)) {
                $oldFilename = basename(parse_url($boutique->logo, PHP_URL_PATH));
                Storage::disk('public')->delete('boutiques/logos/' . $oldFilename);
            }

            $file = $request->file('logo_file');
            $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('boutiques/logos', $filename, 'public');
            $data['logo'] = config('app.url') . '/storage/boutiques/logos/' . $filename;
        }

        // Supprimer logo_file des données avant la mise à jour
        unset($data['logo_file']);

        $boutique->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Informations de la boutique mises à jour avec succès',
            'data' => $boutique,
        ]);
    }

    /**
     * Liste tous les produits de la boutique du propriétaire.
     */
    public function myProducts(Request $request)
    {
        $user = $request->user();
        $boutique = Boutique::where('owner_id', $user->id)->firstOrFail();
        
        $products = BoutiqueProduct::where('boutique_id', $boutique->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $products,
        ]);
    }

    /**
     * Créer un produit pour la boutique du propriétaire.
     */
    public function storeProduct(Request $request)
    {
        $user = $request->user();
        $boutique = Boutique::where('owner_id', $user->id)->firstOrFail();

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'category' => 'nullable|string|max:255',
            'image' => 'nullable|string|max:500',
            'image_file' => 'nullable|file|mimes:jpeg,jpg,png,gif,webp|max:5120',
            'status' => 'nullable|string|in:active,inactive',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $request->all();
        $data['boutique_id'] = $boutique->id;
        $data['status'] = $data['status'] ?? 'active';

        // Gérer l'upload d'image
        if ($request->hasFile('image_file')) {
            $file = $request->file('image_file');
            $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('boutiques/products', $filename, 'public');
            $data['image'] = config('app.url') . '/storage/boutiques/products/' . $filename;
        }

        unset($data['image_file']);

        $product = BoutiqueProduct::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Produit créé avec succès',
            'data' => $product,
        ], 201);
    }

    /**
     * Mettre à jour un produit.
     */
    public function updateProduct(Request $request, $productId)
    {
        $user = $request->user();
        $boutique = Boutique::where('owner_id', $user->id)->firstOrFail();
        
        $product = BoutiqueProduct::where('boutique_id', $boutique->id)
            ->findOrFail($productId);

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'sometimes|required|numeric|min:0',
            'stock' => 'sometimes|required|integer|min:0',
            'category' => 'nullable|string|max:255',
            'image' => 'nullable|string|max:500',
            'image_file' => 'nullable|file|mimes:jpeg,jpg,png,gif,webp|max:5120',
            'status' => 'nullable|string|in:active,inactive',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $request->all();

        // Gérer l'upload d'image
        if ($request->hasFile('image_file')) {
            // Supprimer l'ancienne image si elle existe
            if ($product->image && !filter_var($product->image, FILTER_VALIDATE_URL)) {
                $oldFilename = basename(parse_url($product->image, PHP_URL_PATH));
                Storage::disk('public')->delete('boutiques/products/' . $oldFilename);
            }

            $file = $request->file('image_file');
            $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('boutiques/products', $filename, 'public');
            $data['image'] = config('app.url') . '/storage/boutiques/products/' . $filename;
        }

        unset($data['image_file']);

        $product->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Produit mis à jour avec succès',
            'data' => $product,
        ]);
    }

    /**
     * Supprimer un produit.
     */
    public function destroyProduct(Request $request, $productId)
    {
        $user = $request->user();
        $boutique = Boutique::where('owner_id', $user->id)->firstOrFail();
        
        $product = BoutiqueProduct::where('boutique_id', $boutique->id)
            ->findOrFail($productId);

        // Supprimer l'image si elle existe
        if ($product->image && !filter_var($product->image, FILTER_VALIDATE_URL)) {
            $filename = basename(parse_url($product->image, PHP_URL_PATH));
            Storage::disk('public')->delete('boutiques/products/' . $filename);
        }

        $product->delete();

        return response()->json([
            'success' => true,
            'message' => 'Produit supprimé avec succès',
        ]);
    }

    /**
     * Liste toutes les commandes de la boutique du propriétaire.
     */
    public function myOrders(Request $request)
    {
        $user = $request->user();
        $boutique = Boutique::where('owner_id', $user->id)->firstOrFail();
        
        $status = $request->query('status', 'all');
        $query = BoutiqueOrder::with(['items.product'])
            ->where('boutique_id', $boutique->id);

        if ($status !== 'all') {
            $query->where('status', $status);
        }

        $orders = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $orders,
        ]);
    }

    /**
     * Afficher une commande spécifique.
     */
    public function showOrder(Request $request, $orderId)
    {
        $user = $request->user();
        $boutique = Boutique::where('owner_id', $user->id)->firstOrFail();
        
        $order = BoutiqueOrder::with(['items.product', 'boutique'])
            ->where('boutique_id', $boutique->id)
            ->findOrFail($orderId);

        return response()->json([
            'success' => true,
            'data' => $order,
        ]);
    }

    /**
     * Mettre à jour le statut d'une commande.
     */
    public function updateOrderStatus(Request $request, $orderId)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|string|in:pending,confirmed,processing,shipped,delivered,cancelled',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = $request->user();
        $boutique = Boutique::where('owner_id', $user->id)->firstOrFail();
        
        $order = BoutiqueOrder::where('boutique_id', $boutique->id)
            ->findOrFail($orderId);

        $order->update(['status' => $request->status]);

        return response()->json([
            'success' => true,
            'message' => 'Statut de la commande mis à jour avec succès',
            'data' => $order,
        ]);
    }
}
