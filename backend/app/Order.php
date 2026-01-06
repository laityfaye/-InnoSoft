<?php

namespace App;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_number',
        'customer_name',
        'customer_email',
        'customer_phone',
        'shipping_address',
        'city',
        'country',
        'payment_method',
        'delivery_type',
        'customer_latitude',
        'customer_longitude',
        'store_latitude',
        'store_longitude',
        'distance',
        'delivery_fee',
        'status',
        'subtotal',
        'total',
        'notes',
    ];

    protected $casts = [
        'subtotal' => 'decimal:0',
        'total' => 'decimal:0',
        'customer_latitude' => 'decimal:8',
        'customer_longitude' => 'decimal:8',
        'store_latitude' => 'decimal:8',
        'store_longitude' => 'decimal:8',
        'distance' => 'decimal:2',
        'delivery_fee' => 'decimal:0',
    ];

    /**
     * Relation avec les items de la commande
     */
    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Générer un numéro de commande unique
     */
    public static function generateOrderNumber()
    {
        $prefix = 'CMD-';
        $date = now()->format('Ymd');
        $random = strtoupper(substr(uniqid(), -6));
        
        return $prefix . $date . '-' . $random;
    }

    /**
     * Boot method pour générer automatiquement le numéro de commande
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($order) {
            if (empty($order->order_number)) {
                $order->order_number = self::generateOrderNumber();
            }
        });
    }
}

