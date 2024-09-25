<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('integrantes_club', function (Blueprint $table) {
            $table->rename('club_integrantes');
        });
    }


    public function down(): void
    {
        Schema::table('club_integrantes', function (Blueprint $table) {
            $table->rename('integrantes_club');
        });
    }
};
