<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Award;

class AwardSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $awards = [
            [
                'title' => 'Meilleure Startup Tech 2023',
                'organization' => 'Tech Awards Morocco',
                'year' => 2023,
                'description' => 'Reconnu pour l\'innovation et l\'excellence technologique dans le développement de solutions innovantes.',
                'icon_type' => 'trophy',
                'color' => 'from-yellow-500 to-orange-500',
                'order' => 0,
                'is_active' => true,
            ],
            [
                'title' => 'Excellence en Design',
                'organization' => 'Design Awards',
                'year' => 2023,
                'description' => 'Prix pour l\'excellence en design UI/UX et la création d\'expériences utilisateur exceptionnelles.',
                'icon_type' => 'award',
                'color' => 'from-purple-500 to-pink-500',
                'order' => 1,
                'is_active' => true,
            ],
            [
                'title' => 'Top Developer',
                'organization' => 'Developer Community',
                'year' => 2022,
                'description' => 'Reconnu par la communauté des développeurs pour nos contributions et notre expertise technique.',
                'icon_type' => 'medal',
                'color' => 'from-blue-500 to-cyan-500',
                'order' => 2,
                'is_active' => true,
            ],
            [
                'title' => 'Innovation Award',
                'organization' => 'Tech Innovation Summit',
                'year' => 2023,
                'description' => 'Prix de l\'innovation technologique pour nos solutions disruptives et notre approche novatrice.',
                'icon_type' => 'star',
                'color' => 'from-green-500 to-emerald-500',
                'order' => 3,
                'is_active' => true,
            ],
        ];

        foreach ($awards as $award) {
            Award::firstOrCreate(
                ['title' => $award['title'], 'year' => $award['year']],
                $award
            );
        }
    }
}

