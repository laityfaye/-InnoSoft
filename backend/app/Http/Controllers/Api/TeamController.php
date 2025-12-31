<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\TeamMember;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class TeamController extends Controller
{
    /**
     * Display a listing of team members (public).
     */
    public function index()
    {
        $members = TeamMember::active()
            ->orderBy('order', 'asc')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $members,
        ]);
    }

    /**
     * Display the specified team member (public).
     */
    public function show($id)
    {
        $member = TeamMember::active()->find($id);

        if (!$member) {
            return response()->json([
                'success' => false,
                'message' => 'Membre de l\'équipe non trouvé',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $member,
        ]);
    }

    /**
     * Display a listing of all team members (admin only).
     */
    public function adminIndex()
    {
        $members = TeamMember::orderBy('order', 'asc')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $members,
        ]);
    }

    /**
     * Store a newly created team member (admin only).
     */
    public function store(Request $request)
    {
        $data = $request->all();

        $validator = Validator::make($data, [
            'name' => 'required|string|max:255',
            'role' => 'required|string|max:255',
            'bio' => 'required|string|max:1000',
            'image' => 'nullable|string|max:500',
            'image_file' => 'nullable|file|mimes:jpeg,jpg,png,gif,webp|max:5120', // 5MB max
            'email' => 'nullable|email|max:255',
            'linkedin' => 'nullable|url|max:255',
            'github' => 'nullable|url|max:255',
            'twitter' => 'nullable|url|max:255',
            'website' => 'nullable|url|max:255',
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
            $file->storeAs('team', $filename, 'public');
            $data['image'] = config('app.url') . '/storage/team/' . $filename;
        }

        // Set default values
        if (!isset($data['order'])) {
            $data['order'] = 0;
        }
        if (!isset($data['is_active'])) {
            $data['is_active'] = true;
        }

        // Supprimer image_file des données avant la création
        unset($data['image_file']);

        $member = TeamMember::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Membre de l\'équipe créé avec succès',
            'data' => $member,
        ], 201);
    }

    /**
     * Update the specified team member (admin only).
     */
    public function update(Request $request, $id)
    {
        $member = TeamMember::findOrFail($id);

        $data = $request->all();

        $validator = Validator::make($data, [
            'name' => 'sometimes|required|string|max:255',
            'role' => 'sometimes|required|string|max:255',
            'bio' => 'sometimes|required|string|max:1000',
            'image' => 'nullable|string|max:500',
            'image_file' => 'nullable|file|mimes:jpeg,jpg,png,gif,webp|max:5120', // 5MB max
            'email' => 'nullable|email|max:255',
            'linkedin' => 'nullable|url|max:255',
            'github' => 'nullable|url|max:255',
            'twitter' => 'nullable|url|max:255',
            'website' => 'nullable|url|max:255',
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
            if ($member->image && !filter_var($member->image, FILTER_VALIDATE_URL)) {
                $oldFilename = basename(parse_url($member->image, PHP_URL_PATH));
                Storage::disk('public')->delete('team/' . $oldFilename);
            }

            $file = $request->file('image_file');
            $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $file->storeAs('team', $filename, 'public');
            $data['image'] = config('app.url') . '/storage/team/' . $filename;
        }

        // Supprimer image_file des données avant la mise à jour
        unset($data['image_file']);

        $member->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Membre de l\'équipe mis à jour avec succès',
            'data' => $member,
        ]);
    }

    /**
     * Remove the specified team member (admin only).
     */
    public function destroy($id)
    {
        $member = TeamMember::findOrFail($id);

        // Supprimer l'image si elle existe et n'est pas une URL externe
        if ($member->image && !filter_var($member->image, FILTER_VALIDATE_URL)) {
            $filename = basename(parse_url($member->image, PHP_URL_PATH));
            Storage::disk('public')->delete('team/' . $filename);
        }

        $member->delete();

        return response()->json([
            'success' => true,
            'message' => 'Membre de l\'équipe supprimé avec succès',
        ]);
    }
}

