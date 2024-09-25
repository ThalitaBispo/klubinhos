<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('calendar', function (Blueprint $table) {
            $table->id();
            $table->string('titulo')->notNullable();
            $table->string('descricao')->nullable();
            $table->date('data_evento')->nullable();
            $table->time('hora_evento')->nullable();
            $table->time('fim_evento')->nullable();
            $table->foreign('club_id')->references('id')->on('clubs');
            $table->unsignedBigInteger('club_id')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('calendar');
    }
};
