<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\News;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class NewsController extends Controller
{
    /**
     * Display a listing of news articles (public).
     */
    public function index(Request $request)
    {
        $category = $request->query('category', 'all');
        $limit = $request->query('limit', null);
        
        $query = News::published();

        if ($category !== 'all') {
            $query->where('category', $category);
        }

        $query->orderBy('order', 'asc')
              ->orderBy('published_at', 'desc')
              ->orderBy('created_at', 'desc');

        if ($limit) {
            $news = $query->limit((int)$limit)->get();
        } else {
            $news = $query->get();
        }

        return response()->json([
            'success' => true,
            'data' => $news,
        ]);
    }

    /**
     * Display the specified news article (public).
     * Accepts either ID or slug.
     */
    public function show($id)
    {
        // Try to find by slug first, then by ID
        $news = News::published()->where('slug', $id)->first();
        
        if (!$news) {
            // If not found by slug, try by ID
            $news = News::published()->find($id);
        }

        if (!$news) {
            return response()->json([
                'success' => false,
                'message' => 'Article non trouvé',
            ], 404);
        }

        // Increment views
        $news->increment('views');

        return response()->json([
            'success' => true,
            'data' => $news,
        ]);
    }

    /**
     * Display a listing of all news articles (admin only).
     */
    public function adminIndex()
    {
        $news = News::orderBy('order', 'asc')
                    ->orderBy('created_at', 'desc')
                    ->get();

        return response()->json([
            'success' => true,
            'data' => $news,
        ]);
    }

    /**
     * Store a newly created news article (admin only).
     */
    public function store(Request $request)
    {
        $data = $request->all();

        $validator = Validator::make($data, [
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:news,slug',
            'excerpt' => 'required|string|max:500',
            'content' => 'required|string',
            'image' => 'nullable|string|max:500',
            'image_file' => 'nullable|file|mimes:jpeg,jpg,png,gif,webp|max:5120', // 5MB max
            'category' => 'nullable|string|max:100',
            'author' => 'nullable|string|max:255',
            'read_time' => 'nullable|integer|min:1|max:120',
            'is_published' => 'nullable|boolean',
            'published_at' => 'nullable|date',
            'order' => 'nullable|integer',
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
            $file->storeAs('news', $filename, 'public');
            $data['image'] = config('app.url') . '/storage/news/' . $filename;
        }

        // Générer le slug si non fourni
        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['title']);
            
            // Ensure uniqueness
            $originalSlug = $data['slug'];
            $count = 1;
            while (News::where('slug', $data['slug'])->exists()) {
                $data['slug'] = $originalSlug . '-' . $count;
                $count++;
            }
        }

        // Set default values
        if (!isset($data['read_time'])) {
            $data['read_time'] = 5;
        }
        if (!isset($data['category'])) {
            $data['category'] = 'Général';
        }
        if (!isset($data['is_published'])) {
            $data['is_published'] = false;
        }
        if (!isset($data['order'])) {
            $data['order'] = 0;
        }

        // Supprimer image_file des données avant la création
        unset($data['image_file']);

        $news = News::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Article créé avec succès',
            'data' => $news,
        ], 201);
    }

    /**
     * Update the specified news article (admin only).
     */
    public function update(Request $request, $id)
    {
        $news = News::findOrFail($id);

        $data = $request->all();

        $validator = Validator::make($data, [
            'title' => 'sometimes|required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:news,slug,' . $id,
            'excerpt' => 'sometimes|required|string|max:500',
            'content' => 'sometimes|required|string',
            'image' => 'nullable|string|max:500',
            'image_file' => 'nullable|file|mimes:jpeg,jpg,png,gif,webp|max:5120', // 5MB max
            'category' => 'nullable|string|max:100',
            'author' => 'nullable|string|max:255',
            'read_time' => 'nullable|integer|min:1|max:120',
            'is_published' => 'nullable|boolean',
            'published_at' => 'nullable|date',
            'order' => 'nullable|integer',
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
            if ($news->image && !filter_var($news->image, FILTER_VALIDATE_URL)) {
                $oldFilename = basename(parse_url($news->image, PHP_URL_PATH));
                Storage::disk('public')->delete('news/' . $oldFilename);
            }

            $file = $request->file('image_file');
            $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $file->storeAs('news', $filename, 'public');
            $data['image'] = config('app.url') . '/storage/news/' . $filename;
        }

        // Générer le slug si le titre a changé et qu'aucun slug n'est fourni
        if (isset($data['title']) && $news->title !== $data['title'] && empty($data['slug'])) {
            $data['slug'] = Str::slug($data['title']);
            
            // Ensure uniqueness (excluding current record)
            $originalSlug = $data['slug'];
            $count = 1;
            while (News::where('slug', $data['slug'])->where('id', '!=', $id)->exists()) {
                $data['slug'] = $originalSlug . '-' . $count;
                $count++;
            }
        }

        // Supprimer image_file des données avant la mise à jour
        unset($data['image_file']);

        $news->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Article mis à jour avec succès',
            'data' => $news,
        ]);
    }

    /**
     * Remove the specified news article (admin only).
     */
    public function destroy($id)
    {
        $news = News::findOrFail($id);

        // Supprimer l'image si elle existe et n'est pas une URL externe
        if ($news->image && !filter_var($news->image, FILTER_VALIDATE_URL)) {
            $filename = basename(parse_url($news->image, PHP_URL_PATH));
            Storage::disk('public')->delete('news/' . $filename);
        }

        $news->delete();

        return response()->json([
            'success' => true,
            'message' => 'Article supprimé avec succès',
        ]);
    }
}

