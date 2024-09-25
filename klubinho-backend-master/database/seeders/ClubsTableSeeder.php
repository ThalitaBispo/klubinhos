<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Club;


class ClubsTableSeeder extends Seeder
{
    public function run(): void
    {
        Club::firstOrCreate([
            'name' => 'Club Test',
            'nick_club' => 'clubTest',
            'description' => 'esse é um club teste para verificar se está tudo ok',
            'banner' => 'https://via.placeholder.com/150',
        ]);
    }
}
