<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Video;

class VideoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $videos = [
            [
                'title' => 'InnoSoft Creation - Notre Histoire',
                'description' => 'Découvrez notre parcours, nos valeurs et notre vision pour l\'avenir. Une présentation complète de notre entreprise et de nos services.',
                'video_type' => 'youtube',
                'video_url' => 'dQw4w9WgXcQ', // Exemple YouTube ID - remplacez par votre vraie vidéo
                'thumbnail' => 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200',
                'order' => 0,
                'is_active' => true,
                'is_featured' => true,
            ],
            [
                'title' => 'Nos Services en Détail',
                'description' => 'Une présentation détaillée de tous nos services : développement web, applications mobiles, et solutions sur mesure.',
                'video_type' => 'youtube',
                'video_url' => 'dQw4w9WgXcQ', // Exemple YouTube ID
                'thumbnail' => 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200',
                'order' => 1,
                'is_active' => true,
                'is_featured' => false,
            ],
            [
                'title' => 'Témoignages Clients',
                'description' => 'Découvrez ce que nos clients disent de nous et de nos réalisations.',
                'video_type' => 'vimeo',
                'video_url' => '123456789', // Exemple Vimeo ID
                'thumbnail' => 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200',
                'order' => 2,
                'is_active' => true,
                'is_featured' => false,
            ],
        ];

        foreach ($videos as $videoData) {
            Video::firstOrCreate(
                ['title' => $videoData['title']],
                $videoData
            );
        }
    }
}

