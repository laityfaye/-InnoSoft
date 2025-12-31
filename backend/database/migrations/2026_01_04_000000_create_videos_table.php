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
        Schema::create('videos', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('video_type')->default('youtube'); // youtube, vimeo, direct
            $table->string('video_url')->nullable(); // URL YouTube/Vimeo ou ID
            $table->string('video_file')->nullable(); // Fichier vidéo uploadé
            $table->string('thumbnail')->nullable(); // Image de prévisualisation
            $table->integer('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->boolean('is_featured')->default(false); // Vidéo principale à afficher
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('videos');
    }
};

