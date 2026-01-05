<?php

namespace App;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price',
        'image',
        'images',
        'category',
        'rating',
        'stock',
        'is_featured',
        'order',
        'discount_percentage',
        'promotion_price',
        'promotion_start_date',
        'promotion_end_date',
        'is_on_promotion',
    ];

    protected $casts = [
        'price' => 'decimal:0',
        'rating' => 'decimal:1',
        'stock' => 'integer',
        'is_featured' => 'boolean',
        'order' => 'integer',
        'images' => 'array', // Cast JSON to array
        'discount_percentage' => 'decimal:2',
        'promotion_price' => 'decimal:0',
        'promotion_start_date' => 'datetime',
        'promotion_end_date' => 'datetime',
        'is_on_promotion' => 'boolean',
    ];

    /**
     * Accessor pour s'assurer que l'URL de l'image est complète
     */
    public function getImageAttribute($value)
    {
        if (!$value) {
            return null;
        }

        return $this->formatImageUrl($value);
    }

    /**
     * Accessor pour formater les URLs des images multiples
     */
    public function getImagesAttribute($value)
    {
        if (!$value) {
            // Si images est vide mais image existe, retourner un tableau avec l'image unique
            if ($this->attributes['image'] ?? null) {
                return [$this->image];
            }
            return [];
        }

        // Si c'est déjà un tableau, formater chaque URL
        if (is_array($value)) {
            return array_map([$this, 'formatImageUrl'], $value);
        }

        // Si c'est une chaîne JSON, la décoder
        $decoded = json_decode($value, true);
        if (is_array($decoded)) {
            return array_map([$this, 'formatImageUrl'], $decoded);
        }

        return [];
    }

    /**
     * Formater une URL d'image
     */
    private function formatImageUrl($value)
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
            return config('app.url') . '/storage/products/' . $value;
        }

        // Sinon, construire l'URL complète avec le domaine
        return config('app.url') . '/' . ltrim($value, '/');
    }

    /**
     * Vérifier si le produit est actuellement en promotion
     */
    public function isCurrentlyOnPromotion()
    {
        if (!$this->is_on_promotion) {
            return false;
        }

        $now = now();
        $startDate = $this->promotion_start_date ? \Carbon\Carbon::parse($this->promotion_start_date) : null;
        $endDate = $this->promotion_end_date ? \Carbon\Carbon::parse($this->promotion_end_date) : null;

        // Si aucune date n'est définie, considérer que la promotion est active si is_on_promotion est true
        if (!$startDate && !$endDate) {
            return $this->is_on_promotion;
        }

        // Vérifier si on est dans la période de promotion
        if ($startDate && $now->lt($startDate)) {
            return false; // La promotion n'a pas encore commencé
        }

        if ($endDate && $now->gt($endDate)) {
            return false; // La promotion est terminée
        }

        return true;
    }

    /**
     * Obtenir le prix actuel (promotionnel si en promotion, sinon prix normal)
     */
    public function getCurrentPrice()
    {
        if ($this->isCurrentlyOnPromotion() && $this->promotion_price) {
            return $this->promotion_price;
        }

        return $this->price;
    }

    /**
     * Calculer le prix promotionnel à partir du pourcentage de réduction
     */
    public function calculatePromotionPrice()
    {
        if (!$this->discount_percentage || $this->discount_percentage <= 0) {
            return null;
        }

        $discount = $this->price * ($this->discount_percentage / 100);
        return max(0, $this->price - $discount);
    }

    /**
     * Boot method pour calculer automatiquement le prix promotionnel
     */
    protected static function boot()
    {
        parent::boot();

        static::saving(function ($product) {
            // Si un pourcentage de réduction est défini, calculer le prix promotionnel
            if ($product->discount_percentage && $product->discount_percentage > 0) {
                $calculatedPrice = $product->calculatePromotionPrice();
                if ($calculatedPrice !== null) {
                    $product->promotion_price = round($calculatedPrice, 0);
                }
            } elseif (!$product->discount_percentage || $product->discount_percentage == 0) {
                // Si pas de réduction, réinitialiser le prix promotionnel
                $product->promotion_price = null;
                $product->is_on_promotion = false;
            }
        });
    }
}

