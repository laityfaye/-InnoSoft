<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Testimonial;

class TestimonialSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $testimonials = [
            [
                'name' => 'Jean Dupont',
                'role' => 'CEO, TechCorp',
                'content' => 'Service exceptionnel ! L\'équipe a su comprendre nos besoins et livrer un projet de qualité dans les délais. Nous recommandons vivement leurs services.',
                'rating' => 5,
                'is_approved' => true,
            ],
            [
                'name' => 'Marie Martin',
                'role' => 'Directrice Marketing, Digital Solutions',
                'content' => 'Une expertise remarquable et une approche professionnelle. Le site web développé a considérablement amélioré notre présence en ligne et notre conversion.',
                'rating' => 5,
                'is_approved' => true,
            ],
            [
                'name' => 'Pierre Durand',
                'role' => 'Fondateur, StartupXYZ',
                'content' => 'L\'équipe InnoSoft a transformé notre vision en réalité. Leur capacité à innover et à proposer des solutions créatives est impressionnante. Excellent travail !',
                'rating' => 5,
                'is_approved' => true,
            ],
            [
                'name' => 'Sophie Lambert',
                'role' => 'Responsable IT, EntrepriseABC',
                'content' => 'Professionnalisme, réactivité et qualité du code au rendez-vous. L\'application mobile développée répond parfaitement à nos attentes et celles de nos clients.',
                'rating' => 5,
                'is_approved' => true,
            ],
            [
                'name' => 'Mohamed Alami',
                'role' => 'Directeur Commercial',
                'content' => 'Un partenariat fructueux ! InnoSoft a su nous accompagner à chaque étape du projet, de la conception à la mise en production. Résultat : un produit final qui dépasse nos espérances.',
                'rating' => 5,
                'is_approved' => true,
            ],
            [
                'name' => 'Julie Bernard',
                'role' => 'Fondatrice, E-commerce Plus',
                'content' => 'La plateforme e-commerce développée par InnoSoft a révolutionné notre business. Interface intuitive, performance optimale et support réactif. Parfait !',
                'rating' => 5,
                'is_approved' => true,
            ],
        ];

        foreach ($testimonials as $testimonialData) {
            Testimonial::firstOrCreate(
                ['name' => $testimonialData['name'], 'content' => $testimonialData['content']],
                $testimonialData
            );
        }
    }
}

