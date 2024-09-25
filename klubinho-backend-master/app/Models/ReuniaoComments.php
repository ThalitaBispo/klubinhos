<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReuniaoComments extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'club_id',
        'reuniao_id',
        'content',
    ];
}
