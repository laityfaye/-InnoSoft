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
        Schema::create('boutique_requests', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Nom du demandeur
            $table->string('email');
            $table->string('phone')->nullable();
            $table->string('boutique_name'); // Nom de la boutique souhaitée
            $table->text('description')->nullable(); // Description de la boutique
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->text('admin_notes')->nullable(); // Notes de l'administrateur
            $table->timestamp('processed_at')->nullable(); // Date de traitement
            $table->foreignId('processed_by')->nullable()->constrained('users')->nullOnDelete(); // Admin qui a traité
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('boutique_requests');
    }
};
