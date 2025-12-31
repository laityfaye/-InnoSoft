<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\SocialLink;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SocialLinkController extends Controller
{
    /**
     * Display a listing of social links (public).
     */
    public function index()
    {
        $socialLinks = SocialLink::active()
            ->orderBy('order', 'asc')
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $socialLinks,
        ]);
    }

    /**
     * Display the specified social link (public).
     */
    public function show($id)
    {
        $socialLink = SocialLink::active()->find($id);

        if (!$socialLink) {
            return response()->json([
                'success' => false,
                'message' => 'Lien social non trouvé',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $socialLink,
        ]);
    }

    /**
     * Display a listing of all social links (admin only).
     */
    public function adminIndex()
    {
        $socialLinks = SocialLink::orderBy('order', 'asc')
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $socialLinks,
        ]);
    }

    /**
     * Store a newly created social link (admin only).
     */
    public function store(Request $request)
    {
        $data = $request->all();

        $validator = Validator::make($data, [
            'platform' => 'required|string|max:50',
            'name' => 'required|string|max:255',
            'url' => 'required|url|max:500',
            'icon_type' => 'nullable|string|max:50',
            'color_gradient' => 'nullable|string|max:255',
            'followers' => 'nullable|string|max:50',
            'order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        // Set default values
        if (!isset($data['icon_type'])) {
            $data['icon_type'] = 'lucide';
        }
        if (!isset($data['order'])) {
            $data['order'] = 0;
        }
        if (!isset($data['is_active'])) {
            $data['is_active'] = true;
        }

        $socialLink = SocialLink::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Lien social créé avec succès',
            'data' => $socialLink,
        ], 201);
    }

    /**
     * Update the specified social link (admin only).
     */
    public function update(Request $request, $id)
    {
        $socialLink = SocialLink::findOrFail($id);

        $data = $request->all();

        $validator = Validator::make($data, [
            'platform' => 'sometimes|required|string|max:50',
            'name' => 'sometimes|required|string|max:255',
            'url' => 'sometimes|required|url|max:500',
            'icon_type' => 'nullable|string|max:50',
            'color_gradient' => 'nullable|string|max:255',
            'followers' => 'nullable|string|max:50',
            'order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $socialLink->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Lien social mis à jour avec succès',
            'data' => $socialLink,
        ]);
    }

    /**
     * Remove the specified social link (admin only).
     */
    public function destroy($id)
    {
        $socialLink = SocialLink::findOrFail($id);
        $socialLink->delete();

        return response()->json([
            'success' => true,
            'message' => 'Lien social supprimé avec succès',
        ]);
    }
}

