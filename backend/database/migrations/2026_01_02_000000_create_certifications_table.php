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
        Schema::create('certifications', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description');
            $table->string('image')->nullable();
            $table->string('icon_type')->default('award'); // award, shield, check-circle, star
            $table->string('color')->default('from-blue-500 to-blue-600'); // gradient color
            $table->string('issuer')->nullable(); // Organisme émetteur
            $table->date('issued_date')->nullable(); // Date d'obtention
            $table->date('expiry_date')->nullable(); // Date d'expiration
            $table->string('certificate_url')->nullable(); // Lien vers le certificat
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
        Schema::dropIfExists('certifications');
    }
};

