<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Certification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class CertificationController extends Controller
{
    /**
     * Display a listing of certifications (public).
     */
    public function index()
    {
        $certifications = Certification::active()
            ->orderBy('order', 'asc')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $certifications,
        ]);
    }

    /**
     * Display the specified certification (public).
     */
    public function show($id)
    {
        $certification = Certification::active()->find($id);

        if (!$certification) {
            return response()->json([
                'success' => false,
                'message' => 'Certification non trouvée',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $certification,
        ]);
    }

    /**
     * Display a listing of all certifications (admin only).
     */
    public function adminIndex()
    {
        $certifications = Certification::orderBy('order', 'asc')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $certifications,
        ]);
    }

    /**
     * Store a newly created certification (admin only).
     */
    public function store(Request $request)
    {
        $data = $request->all();

        $validator = Validator::make($data, [
            'name' => 'required|string|max:255',
            'description' => 'required|string|max:1000',
            'image' => 'nullable|string|max:500',
            'image_file' => 'nullable|file|mimes:jpeg,jpg,png,gif,webp,svg|max:5120', // 5MB max
            'icon_type' => 'nullable|string|in:award,shield,check-circle,star',
            'color' => 'nullable|string|max:100',
            'issuer' => 'nullable|string|max:255',
            'issued_date' => 'nullable|date',
            'expiry_date' => 'nullable|date|after_or_equal:issued_date',
            'certificate_url' => 'nullable|url|max:500',
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
            $file->storeAs('certifications', $filename, 'public');
            $data['image'] = config('app.url') . '/storage/certifications/' . $filename;
        }

        // Set default values
        if (!isset($data['icon_type'])) {
            $data['icon_type'] = 'award';
        }
        if (!isset($data['color'])) {
            $data['color'] = 'from-blue-500 to-blue-600';
        }
        if (!isset($data['order'])) {
            $data['order'] = 0;
        }
        if (!isset($data['is_active'])) {
            $data['is_active'] = true;
        }

        // Supprimer image_file des données avant la création
        unset($data['image_file']);

        $certification = Certification::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Certification créée avec succès',
            'data' => $certification,
        ], 201);
    }

    /**
     * Update the specified certification (admin only).
     */
    public function update(Request $request, $id)
    {
        $certification = Certification::findOrFail($id);

        $data = $request->all();

        $validator = Validator::make($data, [
            'name' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string|max:1000',
            'image' => 'nullable|string|max:500',
            'image_file' => 'nullable|file|mimes:jpeg,jpg,png,gif,webp,svg|max:5120', // 5MB max
            'icon_type' => 'nullable|string|in:award,shield,check-circle,star',
            'color' => 'nullable|string|max:100',
            'issuer' => 'nullable|string|max:255',
            'issued_date' => 'nullable|date',
            'expiry_date' => 'nullable|date|after_or_equal:issued_date',
            'certificate_url' => 'nullable|url|max:500',
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
            if ($certification->image && !filter_var($certification->image, FILTER_VALIDATE_URL)) {
                $oldFilename = basename(parse_url($certification->image, PHP_URL_PATH));
                Storage::disk('public')->delete('certifications/' . $oldFilename);
            }

            $file = $request->file('image_file');
            $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $file->storeAs('certifications', $filename, 'public');
            $data['image'] = config('app.url') . '/storage/certifications/' . $filename;
        }

        // Supprimer image_file des données avant la mise à jour
        unset($data['image_file']);

        $certification->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Certification mise à jour avec succès',
            'data' => $certification,
        ]);
    }

    /**
     * Remove the specified certification (admin only).
     */
    public function destroy($id)
    {
        $certification = Certification::findOrFail($id);

        // Supprimer l'image si elle existe et n'est pas une URL externe
        if ($certification->image && !filter_var($certification->image, FILTER_VALIDATE_URL)) {
            $filename = basename(parse_url($certification->image, PHP_URL_PATH));
            Storage::disk('public')->delete('certifications/' . $filename);
        }

        $certification->delete();

        return response()->json([
            'success' => true,
            'message' => 'Certification supprimée avec succès',
        ]);
    }
}

