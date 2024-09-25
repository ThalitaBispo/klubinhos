<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('comments_post', function (Blueprint $table) {
            $table->id();
            //atributos para a tabela de comentarios de um post
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade')->notNullable();
            $table->foreignId('post_id')->constrained('posts')->onDelete('cascade')->notNullable();
            $table->string('content')->notNullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('comments_post');
    }
};
