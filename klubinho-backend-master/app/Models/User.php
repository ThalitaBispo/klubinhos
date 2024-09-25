<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Hash;
use Illuminate\Support\Facades\Auth;
use App\Models\Post;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    protected $fillable = [
        'name',
        'last_name',
        'phone_number',
        'email',
        'password',
        'birthday_date',
        'bio',
        'imagem',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }

    public function posts(){
        return $this->hasMany(Post::class);
    }

    // find user id by token
    public static function findIdByToken($token){
        // token for string to token for object
        $token = explode(' ', $token)[1];
        $user = User::where('id', Auth::user()->id)->first();
        return $user->id;
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

}
