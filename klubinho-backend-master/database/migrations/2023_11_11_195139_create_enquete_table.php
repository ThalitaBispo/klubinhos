<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        Schema::create('enquetes', function (Blueprint $table) {
            $table->id();
            $table->string('title')->notNullable();
            $table->string('description')->nullable();
            $table->foreignId('user_id')->constrained('users');
            $table->foreignId('club_id')->constrained('clubs');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('enquetes');
    }
};
