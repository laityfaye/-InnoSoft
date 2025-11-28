<?php

namespace App;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'category',
        'description',
        'image',
        'tags',
        'link',
        'order',
        'is_featured',
    ];

    protected $casts = [
        'tags' => 'array',
        'order' => 'integer',
        'is_featured' => 'boolean',
    ];

    /**
     * Accessor pour s'assurer que l'URL de l'image est complète
     */
    public function getImageAttribute($value)
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
            return config('app.url') . '/storage/projects/' . $value;
        }

        // Sinon, construire l'URL complète avec le domaine
        return config('app.url') . '/' . ltrim($value, '/');
    }
}
