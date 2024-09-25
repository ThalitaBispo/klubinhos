<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::rename('comments_post', 'comments');
    }

    public function down(): void
    {
        Schema::rename('comments', 'comments_post');
    }
};
