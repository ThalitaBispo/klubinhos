<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Calendar extends Model
{
    use HasFactory;

    protected $fillable = [
        'titulo',
        'descricao',
        'data_evento',
        'hora_evento',
        'fim_evento',
        'club_id'
    ];
}
