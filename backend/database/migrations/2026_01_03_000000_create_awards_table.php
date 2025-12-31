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
        Schema::create('awards', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('organization');
            $table->year('year');
            $table->text('description');
            $table->string('image')->nullable();
            $table->string('icon_type')->default('trophy'); // trophy, award, medal, star, trending-up
            $table->string('color')->default('from-yellow-500 to-orange-500'); // gradient color
            $table->string('award_url')->nullable(); // Lien vers la récompense
            $table->integer('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('awards');
    }
};

