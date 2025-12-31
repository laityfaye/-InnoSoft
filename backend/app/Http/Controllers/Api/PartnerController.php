<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Partner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class PartnerController extends Controller
{
    /**
     * Display a listing of partners (public).
     */
    public function index()
    {
        $partners = Partner::where('is_active', true)
            ->orderBy('order', 'asc')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $partners,
        ]);
    }

    /**
     * Display all partners (admin only - includes inactive).
     */
    public function adminIndex()
    {
        $partners = Partner::orderBy('order', 'asc')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $partners,
        ]);
    }

    /**
     * Display the specified partner (public).
     */
    public function show($id)
    {
        $partner = Partner::where('is_active', true)->find($id);

        if (!$partner) {
            return response()->json([
                'success' => false,
                'message' => 'Partenaire non trouvé',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $partner,
        ]);
    }

    /**
     * Store a newly created partner (admin only).
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'website' => 'nullable|url|max:255',
            'order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $validator->validated();

        // Handle logo upload
        if ($request->hasFile('logo')) {
            $logo = $request->file('logo');
            $logoName = time() . '_' . $logo->getClientOriginalName();
            $logoPath = $logo->storeAs('partners', $logoName, 'public');
            $data['logo'] = '/storage/' . $logoPath;
        }

        $partner = Partner::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Partenaire créé avec succès',
            'data' => $partner,
        ], 201);
    }

    /**
     * Update the specified partner (admin only).
     */
    public function update(Request $request, $id)
    {
        $partner = Partner::find($id);

        if (!$partner) {
            return response()->json([
                'success' => false,
                'message' => 'Partenaire non trouvé',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'website' => 'nullable|url|max:255',
            'order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $validator->validated();

        // Handle logo upload
        if ($request->hasFile('logo')) {
            // Delete old logo if exists
            if ($partner->logo && strpos($partner->logo, '/storage/partners/') !== false) {
                $oldLogo = str_replace('/storage/', '', $partner->logo);
                Storage::disk('public')->delete($oldLogo);
            }

            $logo = $request->file('logo');
            $logoName = time() . '_' . $logo->getClientOriginalName();
            $logoPath = $logo->storeAs('partners', $logoName, 'public');
            $data['logo'] = '/storage/' . $logoPath;
        }

        $partner->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Partenaire mis à jour avec succès',
            'data' => $partner,
        ]);
    }

    /**
     * Remove the specified partner (admin only).
     */
    public function destroy($id)
    {
        $partner = Partner::find($id);

        if (!$partner) {
            return response()->json([
                'success' => false,
                'message' => 'Partenaire non trouvé',
            ], 404);
        }

        // Delete logo if exists
        if ($partner->logo && strpos($partner->logo, '/storage/partners/') !== false) {
            $logo = str_replace('/storage/', '', $partner->logo);
            Storage::disk('public')->delete($logo);
        }

        $partner->delete();

        return response()->json([
            'success' => true,
            'message' => 'Partenaire supprimé avec succès',
        ]);
    }
}

