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
        Schema::create('social_links', function (Blueprint $table) {
            $table->id();
            $table->string('platform'); // facebook, twitter, instagram, linkedin, youtube, github, etc.
            $table->string('name'); // Nom affiché
            $table->string('url');
            $table->string('icon_type')->default('lucide'); // lucide, custom
            $table->string('color_gradient')->nullable(); // Classe Tailwind pour le gradient
            $table->string('followers')->nullable(); // Nombre d'abonnés (ex: "12.5K")
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
        Schema::dropIfExists('social_links');
    }
};

