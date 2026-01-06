<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('delivery_type')->default('pickup')->after('payment_method'); // 'pickup' ou 'delivery'
            $table->decimal('customer_latitude', 10, 8)->nullable()->after('delivery_type');
            $table->decimal('customer_longitude', 11, 8)->nullable()->after('customer_latitude');
            $table->decimal('store_latitude', 10, 8)->nullable()->after('customer_longitude');
            $table->decimal('store_longitude', 11, 8)->nullable()->after('store_latitude');
            $table->decimal('distance', 8, 2)->nullable()->after('store_longitude'); // Distance en kilomètres
            $table->decimal('delivery_fee', 15, 0)->default(0)->after('distance'); // Frais de livraison
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'delivery_type',
                'customer_latitude',
                'customer_longitude',
                'store_latitude',
                'store_longitude',
                'distance',
                'delivery_fee',
            ]);
        });
    }
};
