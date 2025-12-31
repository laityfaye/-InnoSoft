<?php

namespace App;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Video extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'video_type',
        'video_url',
        'video_file',
        'thumbnail',
        'order',
        'is_active',
        'is_featured',
    ];

    protected $casts = [
        'order' => 'integer',
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
    ];

    /**
     * Accessor pour s'assurer que l'URL de la vidéo est complète
     */
    public function getVideoUrlAttribute($value)
    {
        if (!$value) {
            return null;
        }

        // Si c'est déjà une URL complète, la retourner telle quelle
        if (filter_var($value, FILTER_VALIDATE_URL)) {
            return $value;
        }

        // Si c'est un ID YouTube, construire l'URL embed
        $videoType = $this->getAttribute('video_type');
        if ($videoType === 'youtube') {
            return 'https://www.youtube.com/embed/' . $value;
        }

        // Si c'est un ID Vimeo, construire l'URL embed
        if ($videoType === 'vimeo') {
            return 'https://player.vimeo.com/video/' . $value;
        }

        return $value;
    }

    /**
     * Accessor pour s'assurer que l'URL de la thumbnail est complète
     */
    public function getThumbnailAttribute($value)
    {
        if (!$value) {
            return null;
        }

        // Si c'est déjà une URL complète (http:// ou https://), la retourner telle quelle
        if (filter_var($value, FILTER_VALIDATE_URL)) {
            return $value;
        }

        // Si c'est un chemin relatif commençant par /storage/
        if (strpos($value, '/storage/') === 0) {
            return config('app.url') . $value;
        }

        // Si c'est juste un nom de fichier, construire le chemin complet
        if (strpos($value, 'http') !== 0 && strpos($value, '/') !== 0) {
            return config('app.url') . '/storage/videos/' . $value;
        }

        // Sinon, construire l'URL complète avec le domaine
        return config('app.url') . '/' . ltrim($value, '/');
    }

    /**
     * Accessor pour le fichier vidéo
     */
    public function getVideoFileAttribute($value)
    {
        if (!$value) {
            return null;
        }

        // Si c'est déjà une URL complète, la retourner telle quelle
        if (filter_var($value, FILTER_VALIDATE_URL)) {
            return $value;
        }

        // Si c'est un chemin relatif commençant par /storage/
        if (strpos($value, '/storage/') === 0) {
            return config('app.url') . $value;
        }

        // Si c'est juste un nom de fichier, construire le chemin complet
        if (strpos($value, 'http') !== 0 && strpos($value, '/') !== 0) {
            return config('app.url') . '/storage/videos/' . $value;
        }

        return config('app.url') . '/' . ltrim($value, '/');
    }

    /**
     * Scope pour les vidéos actives
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope pour la vidéo principale
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }
}

