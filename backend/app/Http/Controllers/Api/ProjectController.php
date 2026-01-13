<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class ProjectController extends Controller
{
    /**
     * Display a listing of projects (public).
     */
    public function index(Request $request)
    {
        $category = $request->query('category', 'all');
        
        $query = Project::query();

        if ($category !== 'all') {
            $query->where('category', $category);
        }

        $projects = $query->orderBy('order', 'asc')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $projects,
        ]);
    }

    /**
     * Display the specified project (public).
     */
    public function show($id)
    {
        $project = Project::find($id);

        if (!$project) {
            return response()->json([
                'success' => false,
                'message' => 'Projet non trouvé',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $project,
        ]);
    }

    /**
     * Store a newly created project (admin only).
     */
    public function store(Request $request)
    {
        // Préparer les données pour la validation
        $data = $request->all();
        
        // Convertir tags de JSON string en tableau si nécessaire
        if (isset($data['tags']) && is_string($data['tags'])) {
            $decoded = json_decode($data['tags'], true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                $data['tags'] = $decoded;
            } else {
                $data['tags'] = [];
            }
        }

        $validator = Validator::make($data, [
            'title' => 'required|string|max:255',
            'category' => 'required|string|in:web,mobile,design',
            'description' => 'required|string',
            'image' => 'nullable|string|max:500',
            'image_file' => 'nullable|file|mimes:jpeg,jpg,png,gif,webp,mp4,webm,mov', // No size limit
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
            'link' => 'nullable|string|max:500',
            'order' => 'nullable|integer',
            'is_featured' => 'nullable|boolean',
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
            $path = $file->storeAs('projects', $filename, 'public');
            // Construire l'URL complète avec le domaine
            // Storage::url() retourne '/storage/projects/filename.jpg'
            // On ajoute l'URL de base pour avoir une URL complète
            $data['image'] = config('app.url') . '/storage/projects/' . $filename;
        }

        // Supprimer image_file des données avant la création
        unset($data['image_file']);

        $project = Project::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Projet créé avec succès',
            'data' => $project,
        ], 201);
    }

    /**
     * Update the specified project (admin only).
     */
    public function update(Request $request, $id)
    {
        $project = Project::findOrFail($id);

        // Préparer les données pour la validation
        $data = $request->all();
        
        // Convertir tags de JSON string en tableau si nécessaire
        if (isset($data['tags']) && is_string($data['tags'])) {
            $decoded = json_decode($data['tags'], true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                $data['tags'] = $decoded;
            } else {
                $data['tags'] = [];
            }
        }

        $validator = Validator::make($data, [
            'title' => 'sometimes|required|string|max:255',
            'category' => 'sometimes|required|string|in:web,mobile,design',
            'description' => 'sometimes|required|string',
            'image' => 'nullable|string|max:500',
            'image_file' => 'nullable|file|mimes:jpeg,jpg,png,gif,webp,mp4,webm,mov', // No size limit
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
            'link' => 'nullable|string|max:500',
            'order' => 'nullable|integer',
            'is_featured' => 'nullable|boolean',
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
            if ($project->image && !filter_var($project->image, FILTER_VALIDATE_URL)) {
                // Extraire le nom du fichier de l'URL
                $oldFilename = basename(parse_url($project->image, PHP_URL_PATH));
                Storage::disk('public')->delete('projects/' . $oldFilename);
            }

            $file = $request->file('image_file');
            $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('projects', $filename, 'public');
            // Construire l'URL complète avec le domaine
            $data['image'] = config('app.url') . '/storage/projects/' . $filename;
        }

        // Supprimer image_file des données avant la mise à jour
        unset($data['image_file']);

        $project->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Projet mis à jour avec succès',
            'data' => $project,
        ]);
    }

    /**
     * Remove the specified project (admin only).
     */
    public function destroy($id)
    {
        $project = Project::findOrFail($id);
        $project->delete();

        return response()->json([
            'success' => true,
            'message' => 'Projet supprimé avec succès',
        ]);
    }
}

