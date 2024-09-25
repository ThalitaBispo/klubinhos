<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Club extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'nick_club',
        'description',
        'banner',
        'user_id',
        'banner_imagem'
    ];

    public static $rules = [
        'nick_club' => 'unique:clubs,nick_club',
    ];
}
