<?php

namespace App;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Award extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'organization',
        'year',
        'description',
        'image',
        'icon_type',
        'color',
        'award_url',
        'order',
        'is_active',
    ];

    protected $casts = [
        'year' => 'integer',
        'order' => 'integer',
        'is_active' => 'boolean',
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
            return config('app.url') . '/storage/awards/' . $value;
        }

        // Sinon, construire l'URL complète avec le domaine
        return config('app.url') . '/' . ltrim($value, '/');
    }

    /**
     * Scope pour les récompenses actives
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}

