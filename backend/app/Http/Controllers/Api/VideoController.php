<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Video;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class VideoController extends Controller
{
    /**
     * Display a listing of videos (public).
     */
    public function index()
    {
        $videos = Video::active()
            ->orderBy('is_featured', 'desc')
            ->orderBy('order', 'asc')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $videos,
        ]);
    }

    /**
     * Get featured video (public).
     */
    public function featured()
    {
        $video = Video::active()
            ->featured()
            ->orderBy('order', 'asc')
            ->orderBy('created_at', 'desc')
            ->first();

        if (!$video) {
            // Si aucune vidéo principale, retourner la première vidéo active
            $video = Video::active()
                ->orderBy('order', 'asc')
                ->orderBy('created_at', 'desc')
                ->first();
        }

        return response()->json([
            'success' => true,
            'data' => $video,
        ]);
    }

    /**
     * Display the specified video (public).
     */
    public function show($id)
    {
        $video = Video::active()->find($id);

        if (!$video) {
            return response()->json([
                'success' => false,
                'message' => 'Vidéo non trouvée',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $video,
        ]);
    }

    /**
     * Display a listing of all videos (admin only).
     */
    public function adminIndex()
    {
        $videos = Video::orderBy('is_featured', 'desc')
            ->orderBy('order', 'asc')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $videos,
        ]);
    }

    /**
     * Store a newly created video (admin only).
     */
    public function store(Request $request)
    {
        $data = $request->all();

        $validator = Validator::make($data, [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'video_type' => 'required|string|in:youtube,vimeo,direct',
            'video_url' => 'nullable|string|max:500',
            'video_file' => 'nullable|file|mimes:mp4,webm,quicktime', // No size limit
            'thumbnail' => 'nullable|string|max:500',
            'thumbnail_file' => 'nullable|file|mimes:jpeg,jpg,png,gif,webp|max:5120', // 5MB max
            'order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
            'is_featured' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        // Gérer l'upload de fichier vidéo si présent
        if ($request->hasFile('video_file')) {
            $file = $request->file('video_file');
            $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $file->storeAs('videos', $filename, 'public');
            $data['video_file'] = config('app.url') . '/storage/videos/' . $filename;
        }

        // Gérer l'upload de thumbnail si présent
        if ($request->hasFile('thumbnail_file')) {
            $file = $request->file('thumbnail_file');
            $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $file->storeAs('videos/thumbnails', $filename, 'public');
            $data['thumbnail'] = config('app.url') . '/storage/videos/thumbnails/' . $filename;
        }

        // Extraire l'ID de YouTube ou Vimeo si c'est une URL complète
        if ($data['video_type'] === 'youtube' && isset($data['video_url'])) {
            $url = $data['video_url'];
            // Extraire l'ID YouTube de différentes formats d'URL
            if (preg_match('/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/', $url, $matches)) {
                $data['video_url'] = $matches[1];
            } elseif (preg_match('/^[a-zA-Z0-9_-]{11}$/', $url)) {
                // C'est déjà un ID YouTube
                $data['video_url'] = $url;
            }
        } elseif ($data['video_type'] === 'vimeo' && isset($data['video_url'])) {
            $url = $data['video_url'];
            // Extraire l'ID Vimeo
            if (preg_match('/vimeo\.com\/(?:.*\/)?(\d+)/', $url, $matches)) {
                $data['video_url'] = $matches[1];
            } elseif (preg_match('/^\d+$/', $url)) {
                // C'est déjà un ID Vimeo
                $data['video_url'] = $url;
            }
        }

        // Set default values
        if (!isset($data['order'])) {
            $data['order'] = 0;
        }
        if (!isset($data['is_active'])) {
            $data['is_active'] = true;
        }
        if (!isset($data['is_featured'])) {
            $data['is_featured'] = false;
        }

        // Si c'est la première vidéo ou si is_featured est true, désactiver les autres featured
        if (isset($data['is_featured']) && $data['is_featured']) {
            Video::where('is_featured', true)->update(['is_featured' => false]);
        }

        // Supprimer les fichiers des données avant la création
        unset($data['thumbnail_file']);

        $video = Video::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Vidéo créée avec succès',
            'data' => $video,
        ], 201);
    }

    /**
     * Update the specified video (admin only).
     */
    public function update(Request $request, $id)
    {
        $video = Video::findOrFail($id);

        $data = $request->all();

        $validator = Validator::make($data, [
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'video_type' => 'sometimes|required|string|in:youtube,vimeo,direct',
            'video_url' => 'nullable|string|max:500',
            'video_file' => 'nullable|file|mimes:mp4,webm,quicktime', // No size limit
            'thumbnail' => 'nullable|string|max:500',
            'thumbnail_file' => 'nullable|file|mimes:jpeg,jpg,png,gif,webp|max:5120', // 5MB max
            'order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
            'is_featured' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        // Gérer l'upload de fichier vidéo si présent
        if ($request->hasFile('video_file')) {
            // Supprimer l'ancienne vidéo si elle existe et n'est pas une URL externe
            if ($video->video_file && !filter_var($video->video_file, FILTER_VALIDATE_URL)) {
                $oldFilename = basename(parse_url($video->video_file, PHP_URL_PATH));
                Storage::disk('public')->delete('videos/' . $oldFilename);
            }

            $file = $request->file('video_file');
            $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $file->storeAs('videos', $filename, 'public');
            $data['video_file'] = config('app.url') . '/storage/videos/' . $filename;
        }

        // Gérer l'upload de thumbnail si présent
        if ($request->hasFile('thumbnail_file')) {
            // Supprimer l'ancienne thumbnail si elle existe et n'est pas une URL externe
            if ($video->thumbnail && !filter_var($video->thumbnail, FILTER_VALIDATE_URL)) {
                $oldFilename = basename(parse_url($video->thumbnail, PHP_URL_PATH));
                Storage::disk('public')->delete('videos/thumbnails/' . $oldFilename);
            }

            $file = $request->file('thumbnail_file');
            $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $file->storeAs('videos/thumbnails', $filename, 'public');
            $data['thumbnail'] = config('app.url') . '/storage/videos/thumbnails/' . $filename;
        }

        // Extraire l'ID de YouTube ou Vimeo si c'est une URL complète
        if (isset($data['video_type']) && $data['video_type'] === 'youtube' && isset($data['video_url'])) {
            $url = $data['video_url'];
            if (preg_match('/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/', $url, $matches)) {
                $data['video_url'] = $matches[1];
            } elseif (preg_match('/^[a-zA-Z0-9_-]{11}$/', $url)) {
                $data['video_url'] = $url;
            }
        } elseif (isset($data['video_type']) && $data['video_type'] === 'vimeo' && isset($data['video_url'])) {
            $url = $data['video_url'];
            if (preg_match('/vimeo\.com\/(?:.*\/)?(\d+)/', $url, $matches)) {
                $data['video_url'] = $matches[1];
            } elseif (preg_match('/^\d+$/', $url)) {
                $data['video_url'] = $url;
            }
        }

        // Si is_featured est true, désactiver les autres featured
        if (isset($data['is_featured']) && $data['is_featured'] && !$video->is_featured) {
            Video::where('is_featured', true)->where('id', '!=', $id)->update(['is_featured' => false]);
        }

        // Supprimer les fichiers des données avant la mise à jour
        unset($data['thumbnail_file']);

        $video->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Vidéo mise à jour avec succès',
            'data' => $video,
        ]);
    }

    /**
     * Remove the specified video (admin only).
     */
    public function destroy($id)
    {
        $video = Video::findOrFail($id);

        // Supprimer le fichier vidéo si présent et n'est pas une URL externe
        if ($video->video_file && !filter_var($video->video_file, FILTER_VALIDATE_URL)) {
            $filename = basename(parse_url($video->video_file, PHP_URL_PATH));
            Storage::disk('public')->delete('videos/' . $filename);
        }

        // Supprimer la thumbnail si présente et n'est pas une URL externe
        if ($video->thumbnail && !filter_var($video->thumbnail, FILTER_VALIDATE_URL)) {
            $filename = basename(parse_url($video->thumbnail, PHP_URL_PATH));
            Storage::disk('public')->delete('videos/thumbnails/' . $filename);
        }

        $video->delete();

        return response()->json([
            'success' => true,
            'message' => 'Vidéo supprimée avec succès',
        ]);
    }
}

