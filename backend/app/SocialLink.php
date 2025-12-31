<?php

namespace App;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SocialLink extends Model
{
    use HasFactory;

    protected $fillable = [
        'platform',
        'name',
        'url',
        'icon_type',
        'color_gradient',
        'followers',
        'order',
        'is_active',
    ];

    protected $casts = [
        'order' => 'integer',
        'is_active' => 'boolean',
    ];

    /**
     * Scope pour les liens actifs
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}

