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
        Schema::create('conversations', function (Blueprint $table) {
            $table->id();
            $table->string('session_id')->nullable(); // Pour le chat anonyme
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade'); // Pour le chat avec compte
            $table->string('name')->nullable(); // Nom du visiteur (chat anonyme)
            $table->string('email')->nullable(); // Email du visiteur
            $table->enum('type', ['anonymous', 'authenticated'])->default('anonymous');
            $table->enum('status', ['active', 'closed', 'archived'])->default('active');
            $table->timestamp('last_message_at')->nullable();
            $table->timestamps();
            
            $table->index('session_id');
            $table->index('user_id');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('conversations');
    }
};

