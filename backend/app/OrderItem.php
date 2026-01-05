<?php

namespace App;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'product_id',
        'product_name',
        'product_price',
        'quantity',
        'subtotal',
    ];

    protected $casts = [
        'product_price' => 'decimal:0',
        'quantity' => 'integer',
        'subtotal' => 'decimal:0',
    ];

    /**
     * Relation avec la commande
     */
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * Relation avec le produit
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Boot method pour calculer automatiquement le subtotal
     */
    protected static function boot()
    {
        parent::boot();

        static::saving(function ($item) {
            if ($item->product_price && $item->quantity) {
                $item->subtotal = $item->product_price * $item->quantity;
            }
        });
    }
}

