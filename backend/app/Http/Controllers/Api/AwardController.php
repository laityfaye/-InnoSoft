<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Award;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class AwardController extends Controller
{
    /**
     * Display a listing of awards (public).
     */
    public function index()
    {
        $awards = Award::active()
            ->orderBy('order', 'asc')
            ->orderBy('year', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $awards,
        ]);
    }

    /**
     * Display the specified award (public).
     */
    public function show($id)
    {
        $award = Award::active()->find($id);

        if (!$award) {
            return response()->json([
                'success' => false,
                'message' => 'Récompense non trouvée',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $award,
        ]);
    }

    /**
     * Display a listing of all awards (admin only).
     */
    public function adminIndex()
    {
        $awards = Award::orderBy('order', 'asc')
            ->orderBy('year', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $awards,
        ]);
    }

    /**
     * Store a newly created award (admin only).
     */
    public function store(Request $request)
    {
        $data = $request->all();

        $validator = Validator::make($data, [
            'title' => 'required|string|max:255',
            'organization' => 'required|string|max:255',
            'year' => 'required|integer|min:1900|max:' . (date('Y') + 1),
            'description' => 'required|string|max:1000',
            'image' => 'nullable|string|max:500',
            'image_file' => 'nullable|file|mimes:jpeg,jpg,png,gif,webp,svg|max:5120', // 5MB max
            'icon_type' => 'nullable|string|in:trophy,award,medal,star,trending-up',
            'color' => 'nullable|string|max:100',
            'award_url' => 'nullable|url|max:500',
            'order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        // Gérer l'upload de fichier si présent
        if ($request->hasFile('image_file')) {
            $file = $request->file('image_file');
            $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $file->storeAs('awards', $filename, 'public');
            $data['image'] = config('app.url') . '/storage/awards/' . $filename;
        }

        // Set default values
        if (!isset($data['icon_type'])) {
            $data['icon_type'] = 'trophy';
        }
        if (!isset($data['color'])) {
            $data['color'] = 'from-yellow-500 to-orange-500';
        }
        if (!isset($data['order'])) {
            $data['order'] = 0;
        }
        if (!isset($data['is_active'])) {
            $data['is_active'] = true;
        }

        // Supprimer image_file des données avant la création
        unset($data['image_file']);

        $award = Award::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Récompense créée avec succès',
            'data' => $award,
        ], 201);
    }

    /**
     * Update the specified award (admin only).
     */
    public function update(Request $request, $id)
    {
        $award = Award::findOrFail($id);

        $data = $request->all();

        $validator = Validator::make($data, [
            'title' => 'sometimes|required|string|max:255',
            'organization' => 'sometimes|required|string|max:255',
            'year' => 'sometimes|required|integer|min:1900|max:' . (date('Y') + 1),
            'description' => 'sometimes|required|string|max:1000',
            'image' => 'nullable|string|max:500',
            'image_file' => 'nullable|file|mimes:jpeg,jpg,png,gif,webp,svg|max:5120', // 5MB max
            'icon_type' => 'nullable|string|in:trophy,award,medal,star,trending-up',
            'color' => 'nullable|string|max:100',
            'award_url' => 'nullable|url|max:500',
            'order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        // Gérer l'upload de fichier si présent
        if ($request->hasFile('image_file')) {
            // Supprimer l'ancienne image si elle existe et n'est pas une URL externe
            if ($award->image && !filter_var($award->image, FILTER_VALIDATE_URL)) {
                $oldFilename = basename(parse_url($award->image, PHP_URL_PATH));
                Storage::disk('public')->delete('awards/' . $oldFilename);
            }

            $file = $request->file('image_file');
            $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $file->storeAs('awards', $filename, 'public');
            $data['image'] = config('app.url') . '/storage/awards/' . $filename;
        }

        // Supprimer image_file des données avant la mise à jour
        unset($data['image_file']);

        $award->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Récompense mise à jour avec succès',
            'data' => $award,
        ]);
    }

    /**
     * Remove the specified award (admin only).
     */
    public function destroy($id)
    {
        $award = Award::findOrFail($id);

        // Supprimer l'image si elle existe et n'est pas une URL externe
        if ($award->image && !filter_var($award->image, FILTER_VALIDATE_URL)) {
            $filename = basename(parse_url($award->image, PHP_URL_PATH));
            Storage::disk('public')->delete('awards/' . $filename);
        }

        $award->delete();

        return response()->json([
            'success' => true,
            'message' => 'Récompense supprimée avec succès',
        ]);
    }
}

