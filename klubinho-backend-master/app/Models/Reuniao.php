<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reuniao extends Model
{
    use HasFactory;

    protected $fillable = [
        'titulo',
        'descricao',
        'link',
        'data_reuniao',
        'hora_reuniao',
        'livro',
        'autor',
        'club_id',
        'user_id',
        'participants_name'
    ];
}