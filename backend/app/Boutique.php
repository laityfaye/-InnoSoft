<?php

namespace App;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Boutique extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'owner_id',
        'email',
        'phone',
        'address',
        'logo',
        'status',
        'temp_password',
        'temp_password_expires_at',
        'password_changed',
    ];

    protected $casts = [
        'temp_password_expires_at' => 'datetime',
        'password_changed' => 'boolean',
    ];

    protected $hidden = [
        'temp_password',
    ];

    /**
     * Relation avec le propriétaire
     */
    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    /**
     * Relation avec les produits
     */
    public function products()
    {
        return $this->hasMany(BoutiqueProduct::class);
    }

    /**
     * Relation avec les commandes
     */
    public function orders()
    {
        return $this->hasMany(BoutiqueOrder::class);
    }

    /**
     * Scope pour les boutiques actives
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Générer un slug unique à partir du nom
     */
    public static function generateSlug($name)
    {
        $slug = Str::slug($name);
        $originalSlug = $slug;
        $counter = 1;

        while (static::where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $counter;
            $counter++;
        }

        return $slug;
    }

    /**
     * Boot method pour générer automatiquement le slug
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($boutique) {
            if (empty($boutique->slug)) {
                $boutique->slug = static::generateSlug($boutique->name);
            }
        });

        static::updating(function ($boutique) {
            if ($boutique->isDirty('name') && empty($boutique->slug)) {
                $boutique->slug = static::generateSlug($boutique->name);
            }
        });
    }

    /**
     * Accessor pour formater l'URL du logo
     */
    public function getLogoAttribute($value)
    {
        if (!$value) {
            return null;
        }

        if (filter_var($value, FILTER_VALIDATE_URL)) {
            return $value;
        }

        if (strpos($value, '/storage/') === 0) {
            return config('app.url') . $value;
        }

        return config('app.url') . '/storage/boutiques/' . $value;
    }
}
