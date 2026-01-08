<?php

namespace App;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BoutiqueOrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'product_id',
        'quantity',
        'unit_price',
        'total',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'unit_price' => 'decimal:2',
        'total' => 'decimal:2',
    ];

    /**
     * Relation avec la commande
     */
    public function order()
    {
        return $this->belongsTo(BoutiqueOrder::class, 'order_id');
    }

    /**
     * Relation avec le produit
     */
    public function product()
    {
        return $this->belongsTo(BoutiqueProduct::class, 'product_id');
    }

    /**
     * Boot method pour calculer automatiquement le total
     */
    protected static function boot()
    {
        parent::boot();

        static::saving(function ($item) {
            if (!isset($item->total) || $item->isDirty(['quantity', 'unit_price'])) {
                $item->total = $item->quantity * $item->unit_price;
            }
        });
    }
}
