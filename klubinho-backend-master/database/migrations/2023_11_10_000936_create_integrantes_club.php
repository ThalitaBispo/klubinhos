<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('integrantes_club', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade')->notNullable();
            $table->foreignId('club_id')->constrained('clubs')->onDelete('cascade')->notNullable();
            $table->enum('role', ['admin', 'user'])->default('user');
            $table->timestamps();
        });
    }


    public function down(): void
    {
        Schema::dropIfExists('integrantes_club');
    }
};
