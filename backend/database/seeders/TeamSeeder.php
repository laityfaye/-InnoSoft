<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\TeamMember;

class TeamSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $teamMembers = [
            [
                'name' => 'Ahmed Benali',
                'role' => 'CEO & Fondateur',
                'bio' => 'Expert en stratégie digitale avec 15 ans d\'expérience dans le développement de solutions innovantes pour les entreprises.',
                'image' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
                'email' => 'ahmed@innosoft.com',
                'linkedin' => 'https://linkedin.com/in/ahmed-benali',
                'github' => 'https://github.com/ahmed-benali',
                'twitter' => 'https://twitter.com/ahmed_benali',
                'website' => 'https://ahmed-benali.com',
                'order' => 0,
                'is_active' => true,
            ],
            [
                'name' => 'Sarah Amrani',
                'role' => 'Lead Developer',
                'bio' => 'Spécialiste en développement full-stack et architecture. Passionnée par les technologies modernes et les meilleures pratiques.',
                'image' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
                'email' => 'sarah@innosoft.com',
                'linkedin' => 'https://linkedin.com/in/sarah-amrani',
                'github' => 'https://github.com/sarah-amrani',
                'order' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'Youssef El Fassi',
                'role' => 'Designer UI/UX',
                'bio' => 'Créateur d\'expériences utilisateur exceptionnelles. Expert en design thinking et interfaces modernes.',
                'image' => 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
                'email' => 'youssef@innosoft.com',
                'linkedin' => 'https://linkedin.com/in/youssef-elfassi',
                'github' => 'https://github.com/youssef-elfassi',
                'order' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'Fatima Zahra',
                'role' => 'Project Manager',
                'bio' => 'Gestionnaire de projets agiles et méthodologies modernes. Spécialisée dans la coordination d\'équipes et la livraison de projets réussis.',
                'image' => 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
                'email' => 'fatima@innosoft.com',
                'linkedin' => 'https://linkedin.com/in/fatima-zahra',
                'order' => 3,
                'is_active' => true,
            ],
        ];

        foreach ($teamMembers as $member) {
            TeamMember::firstOrCreate(
                ['email' => $member['email']],
                $member
            );
        }
    }
}

