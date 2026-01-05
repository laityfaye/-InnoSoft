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
        Schema::table('products', function (Blueprint $table) {
            $table->decimal('discount_percentage', 5, 2)->nullable()->after('price'); // Pourcentage de réduction (0-100)
            $table->decimal('promotion_price', 15, 0)->nullable()->after('discount_percentage'); // Prix promotionnel calculé
            $table->dateTime('promotion_start_date')->nullable()->after('promotion_price'); // Date de début de promotion
            $table->dateTime('promotion_end_date')->nullable()->after('promotion_start_date'); // Date de fin de promotion
            $table->boolean('is_on_promotion')->default(false)->after('promotion_end_date'); // Indicateur si le produit est en promotion
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn([
                'discount_percentage',
                'promotion_price',
                'promotion_start_date',
                'promotion_end_date',
                'is_on_promotion',
            ]);
        });
    }
};
