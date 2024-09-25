<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;

class UsersSeeder extends Seeder
{
    public function run(): void
    {
        User::firstOrCreate([
            'name' => 'Admin',
            'last_name' => 'klubinho',
            'email' => 'admin@klubinho.com.br',
            'password' => bcrypt('admin'),
            'phone_number' => '11999999999',
            'birthday_date' => '1990-01-01',
            'role' => 'admin',
        ]);
    }
}
