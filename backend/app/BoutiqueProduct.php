<?php

namespace App;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BoutiqueProduct extends Model
{
    use HasFactory;

    protected $fillable = [
        'boutique_id',
        'name',
        'description',
        'price',
        'stock',
        'image',
        'category',
        'status',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'stock' => 'integer',
    ];

    /**
     * Relation avec la boutique
     */
    public function boutique()
    {
        return $this->belongsTo(Boutique::class);
    }

    /**
     * Relation avec les items de commande
     */
    public function orderItems()
    {
        return $this->hasMany(BoutiqueOrderItem::class, 'product_id');
    }

    /**
     * Scope pour les produits actifs
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope pour les produits en stock
     */
    public function scopeInStock($query)
    {
        return $query->where('stock', '>', 0);
    }

    /**
     * Accessor pour formater l'URL de l'image
     */
    public function getImageAttribute($value)
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

        return config('app.url') . '/storage/boutiques/products/' . $value;
    }

    /**
     * Vérifier si le produit est en stock
     */
    public function isInStock()
    {
        return $this->stock > 0;
    }

    /**
     * Vérifier si le produit est disponible (actif et en stock)
     */
    public function isAvailable()
    {
        return $this->status === 'active' && $this->isInStock();
    }
}
