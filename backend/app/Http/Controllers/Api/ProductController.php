<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    /**
     * Display a listing of products (public).
     */
    public function index(Request $request)
    {
        $category = $request->query('category', 'all');
        $search = $request->query('search', '');
        
        $query = Product::query();

        if ($category !== 'all') {
            $query->where('category', $category);
        }

        if ($search) {
            $query->where(function($q) use ($search) {
                $q->whereRaw('LOWER(name) LIKE ?', ['%' . strtolower($search) . '%'])
                  ->orWhereRaw('LOWER(description) LIKE ?', ['%' . strtolower($search) . '%']);
            });
        }

        $products = $query->orderBy('order', 'asc')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $products,
        ]);
    }

    /**
     * Display the specified product (public).
     */
    public function show($id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Produit non trouvé',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $product,
        ]);
    }

    /**
     * Store a newly created product (admin only).
     */
    public function store(Request $request)
    {
        $data = $request->all();

        $validator = Validator::make($data, [
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'category' => 'required|string|in:hardware,software,accessories,services',
            'rating' => 'nullable|numeric|min:0|max:5',
            'stock' => 'required|integer|min:0',
            'image' => 'nullable|string|max:500',
            'images' => 'nullable|array',
            'images.*' => 'nullable|string|max:500',
            'image_file' => 'nullable|file|mimes:jpeg,jpg,png,gif,webp|max:5120', // 5MB max
            'image_files' => 'nullable|array',
            'image_files.*' => 'nullable|file|mimes:jpeg,jpg,png,gif,webp|max:5120', // 5MB max par fichier
            'is_featured' => 'nullable|boolean',
            'order' => 'nullable|integer',
            'discount_percentage' => 'nullable|numeric|min:0|max:100',
            'promotion_price' => 'nullable|numeric|min:0',
            'promotion_start_date' => 'nullable|date',
            'promotion_end_date' => 'nullable|date|after_or_equal:promotion_start_date',
            'is_on_promotion' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        // Gérer l'upload de fichiers multiples si présents
        $uploadedImages = [];
        
        // Upload d'une seule image (rétrocompatibilité)
        if ($request->hasFile('image_file')) {
            $file = $request->file('image_file');
            $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('products', $filename, 'public');
            $uploadedImages[] = config('app.url') . '/storage/products/' . $filename;
            $data['image'] = $uploadedImages[0]; // Garder pour rétrocompatibilité
        }

        // Upload de plusieurs images
        if ($request->hasFile('image_files')) {
            foreach ($request->file('image_files') as $file) {
                if ($file && $file->isValid()) {
                    $filename = time() . '_' . uniqid() . '_' . rand(1000, 9999) . '.' . $file->getClientOriginalExtension();
                    $path = $file->storeAs('products', $filename, 'public');
                    $uploadedImages[] = config('app.url') . '/storage/products/' . $filename;
                }
            }
        }

        // Combiner les images uploadées avec les images fournies en URL
        $allImages = [];
        if (!empty($uploadedImages)) {
            $allImages = array_merge($allImages, $uploadedImages);
        }
        if (!empty($data['images']) && is_array($data['images'])) {
            $allImages = array_merge($allImages, $data['images']);
        }

        // Si on a des images, les stocker
        if (!empty($allImages)) {
            $data['images'] = array_unique($allImages); // Éviter les doublons
            // Si image n'est pas défini, utiliser la première image
            if (empty($data['image'])) {
                $data['image'] = $allImages[0];
            }
        }

        // Supprimer les champs de fichiers des données avant la création
        unset($data['image_file'], $data['image_files']);

        $product = Product::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Produit créé avec succès',
            'data' => $product,
        ], 201);
    }

    /**
     * Update the specified product (admin only).
     */
    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $data = $request->all();

        $validator = Validator::make($data, [
            'name' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'price' => 'sometimes|required|numeric|min:0',
            'category' => 'sometimes|required|string|in:hardware,software,accessories,services',
            'rating' => 'nullable|numeric|min:0|max:5',
            'stock' => 'sometimes|required|integer|min:0',
            'image' => 'nullable|string|max:500',
            'images' => 'nullable|array',
            'images.*' => 'nullable|string|max:500',
            'image_file' => 'nullable|file|mimes:jpeg,jpg,png,gif,webp|max:5120', // 5MB max
            'image_files' => 'nullable|array',
            'image_files.*' => 'nullable|file|mimes:jpeg,jpg,png,gif,webp|max:5120', // 5MB max par fichier
            'is_featured' => 'nullable|boolean',
            'order' => 'nullable|integer',
            'discount_percentage' => 'nullable|numeric|min:0|max:100',
            'promotion_price' => 'nullable|numeric|min:0',
            'promotion_start_date' => 'nullable|date',
            'promotion_end_date' => 'nullable|date|after_or_equal:promotion_start_date',
            'is_on_promotion' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        // Gérer l'upload de fichiers multiples si présents
        $uploadedImages = [];
        
        // Upload d'une seule image (rétrocompatibilité)
        if ($request->hasFile('image_file')) {
            // Supprimer l'ancienne image si elle existe et n'est pas une URL externe
            if ($product->image && !filter_var($product->image, FILTER_VALIDATE_URL)) {
                $oldFilename = basename(parse_url($product->image, PHP_URL_PATH));
                Storage::disk('public')->delete('products/' . $oldFilename);
            }

            $file = $request->file('image_file');
            $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('products', $filename, 'public');
            $uploadedImages[] = config('app.url') . '/storage/products/' . $filename;
            $data['image'] = $uploadedImages[0]; // Garder pour rétrocompatibilité
        }

        // Upload de plusieurs images
        if ($request->hasFile('image_files')) {
            foreach ($request->file('image_files') as $file) {
                if ($file && $file->isValid()) {
                    $filename = time() . '_' . uniqid() . '_' . rand(1000, 9999) . '.' . $file->getClientOriginalExtension();
                    $path = $file->storeAs('products', $filename, 'public');
                    $uploadedImages[] = config('app.url') . '/storage/products/' . $filename;
                }
            }
        }

        // Gérer les images : si images est fourni, l'utiliser, sinon combiner avec les uploads
        if (isset($data['images'])) {
            if (is_array($data['images'])) {
                $allImages = array_merge($uploadedImages, $data['images']);
                $data['images'] = array_unique(array_filter($allImages)); // Éviter les doublons et valeurs vides
            }
        } elseif (!empty($uploadedImages)) {
            // Si on upload mais qu'on ne fournit pas images, utiliser les uploads + les images existantes
            $existingImages = $product->images ?? [];
            $data['images'] = array_unique(array_merge($existingImages, $uploadedImages));
        }

        // Si image n'est pas défini mais qu'on a des images, utiliser la première
        if (empty($data['image']) && !empty($data['images']) && is_array($data['images'])) {
            $data['image'] = $data['images'][0];
        }

        // Supprimer les champs de fichiers des données avant la mise à jour
        unset($data['image_file'], $data['image_files']);

        $product->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Produit mis à jour avec succès',
            'data' => $product,
        ]);
    }

    /**
     * Remove the specified product (admin only).
     */
    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        
        // Supprimer l'image si elle existe et n'est pas une URL externe
        if ($product->image && !filter_var($product->image, FILTER_VALIDATE_URL)) {
            $filename = basename(parse_url($product->image, PHP_URL_PATH));
            Storage::disk('public')->delete('products/' . $filename);
        }
        
        $product->delete();

        return response()->json([
            'success' => true,
            'message' => 'Produit supprimé avec succès',
        ]);
    }
}

