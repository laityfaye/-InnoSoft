<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Project;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $projects = [
            [
                'title' => 'Plateforme E-commerce Moderne',
                'category' => 'web',
                'description' => 'Une plateforme e-commerce complète développée avec React et Node.js, intégrant des fonctionnalités de paiement sécurisé, gestion de stocks, et système de recommandations.',
                'image' => 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
                'tags' => ['React', 'Node.js', 'MongoDB', 'Stripe'],
                'link' => 'https://example.com/project1',
                'order' => 0,
                'is_featured' => true,
            ],
            [
                'title' => 'Application Mobile de Livraison',
                'category' => 'mobile',
                'description' => 'Application mobile native iOS et Android pour un service de livraison rapide, avec géolocalisation en temps réel et système de notifications push.',
                'image' => 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800',
                'tags' => ['React Native', 'Firebase', 'Maps API'],
                'link' => 'https://example.com/project2',
                'order' => 1,
                'is_featured' => true,
            ],
            [
                'title' => 'Site Vitrine Entreprise',
                'category' => 'web',
                'description' => 'Site web moderne et responsive pour une entreprise de services, avec système de gestion de contenu intégré et optimisation SEO avancée.',
                'image' => 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800',
                'tags' => ['Vue.js', 'Laravel', 'WordPress'],
                'link' => 'https://example.com/project3',
                'order' => 2,
                'is_featured' => false,
            ],
            [
                'title' => 'Design Identité Visuelle',
                'category' => 'design',
                'description' => 'Création complète de l\'identité visuelle d\'une startup tech : logo, charte graphique, design de produits digitaux et supports de communication.',
                'image' => 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
                'tags' => ['Logo Design', 'Branding', 'UI/UX'],
                'link' => 'https://example.com/project4',
                'order' => 3,
                'is_featured' => false,
            ],
            [
                'title' => 'Dashboard Analytique',
                'category' => 'web',
                'description' => 'Tableau de bord interactif pour visualiser et analyser des données métier en temps réel, avec graphiques dynamiques et export de rapports.',
                'image' => 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
                'tags' => ['React', 'D3.js', 'Python', 'PostgreSQL'],
                'link' => 'https://example.com/project5',
                'order' => 4,
                'is_featured' => true,
            ],
            [
                'title' => 'App Fitness & Bien-être',
                'category' => 'mobile',
                'description' => 'Application mobile de suivi fitness avec intégration de capteurs, plans d\'entraînement personnalisés et communauté d\'utilisateurs.',
                'image' => 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
                'tags' => ['Flutter', 'Firebase', 'Health API'],
                'link' => 'https://example.com/project6',
                'order' => 5,
                'is_featured' => false,
            ],
        ];

        foreach ($projects as $projectData) {
            Project::firstOrCreate(
                ['title' => $projectData['title']],
                $projectData
            );
        }
    }
}

