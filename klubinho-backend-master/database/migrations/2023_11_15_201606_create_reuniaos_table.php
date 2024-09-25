<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        Schema::create('reuniaos', function (Blueprint $table) {
            $table->id();
            $table->string('titulo')->notNullable();
            $table->string('descricao')->nullable();
            $table->string('link')->nullable();
            $table->date('data_reuniao')->nullable();
            $table->time('hora_reuniao')->nullable();
            $table->string('livro')->nullable();
            $table->string('autor')->nullable();
            $table->unsignedBigInteger('club_id')->nullable();
            $table->foreign('club_id')->references('id')->on('clubs');
            $table->unsignedBigInteger('user_id')->nullable();
            $table->foreign('user_id')->references('id')->on('users');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reuniaos');
    }
};
