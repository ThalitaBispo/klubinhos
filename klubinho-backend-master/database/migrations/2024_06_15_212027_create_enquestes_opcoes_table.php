<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        Schema::create('enquetes_opcoes', function (Blueprint $table) {
            $table->id();
            $table->string('titulo')->nullable();
            $table->string('description')->nullable();
            $table->foreignId('enquete_id')->constrained('enquetes');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('enquetes_opcoes');
    }
};
