<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reuniao_comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade')->notNullable();
            $table->foreignId('club_id')->constrained('clubs')->onDelete('cascade')->notNullable();
            $table->foreignId('reuniao_id')->constrained('reuniaos')->onDelete('cascade')->notNullable();
            $table->string('content')->notNullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reuniao_comments');
    }
};
