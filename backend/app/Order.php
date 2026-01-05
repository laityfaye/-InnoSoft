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
        'status',
        'subtotal',
        'total',
        'notes',
    ];

    protected $casts = [
        'subtotal' => 'decimal:0',
        'total' => 'decimal:0',
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

