<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EnquetesOpcoes extends Model
{
    use HasFactory;

    protected $fillable = [
        'enquete_id',
        'titulo',
        'description',
    ];
}
