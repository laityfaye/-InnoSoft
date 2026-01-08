<?php

namespace App;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'is_admin',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'is_admin' => 'boolean',
    ];

    /**
     * Relation avec les boutiques possédées
     */
    public function boutiques()
    {
        return $this->hasMany(Boutique::class, 'owner_id');
    }

    /**
     * Vérifier si l'utilisateur est propriétaire d'une boutique
     */
    public function isBoutiqueOwner()
    {
        return $this->boutiques()->exists();
    }
}
