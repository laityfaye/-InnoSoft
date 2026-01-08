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
        Schema::create('boutiques', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Nom de la boutique
            $table->string('slug')->unique(); // Slug pour URL
            $table->text('description')->nullable();
            $table->foreignId('owner_id')->constrained('users')->onDelete('cascade'); // Propriétaire
            $table->string('email');
            $table->string('phone')->nullable();
            $table->text('address')->nullable();
            $table->string('logo')->nullable(); // Chemin vers le logo
            $table->enum('status', ['active', 'inactive', 'suspended'])->default('active');
            $table->string('temp_password')->nullable(); // Mot de passe temporaire (hashé)
            $table->timestamp('temp_password_expires_at')->nullable(); // Expiration du mot de passe temporaire
            $table->boolean('password_changed')->default(false); // Si le propriétaire a changé son mot de passe
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('boutiques');
    }
};
