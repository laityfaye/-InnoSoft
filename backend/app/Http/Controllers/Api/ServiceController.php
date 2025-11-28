<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    /**
     * Display a listing of services.
     */
    public function index()
    {
        $services = [
            [
                'id' => 'web',
                'title' => 'Développement Web',
                'description' => 'Création de sites web et applications web modernes, performantes et sécurisées.',
                'icon' => 'code',
                'features' => [
                    'Sites web responsive et modernes',
                    'Applications web complexes (SPA, PWA)',
                    'E-commerce et plateformes de vente',
                    'Intégration API et systèmes tiers',
                    'Optimisation SEO et performance',
                ],
            ],
            [
                'id' => 'mobile',
                'title' => 'Applications Mobile',
                'description' => 'Développement d\'applications mobiles natives et cross-platform de qualité professionnelle.',
                'icon' => 'smartphone',
                'features' => [
                    'Applications iOS et Android natives',
                    'Solutions cross-platform (React Native, Flutter)',
                    'Applications hybrides et PWA',
                    'Intégration de services cloud',
                    'Publication sur les stores',
                ],
            ],
            [
                'id' => 'design',
                'title' => 'Infographie & Communication Visuelle',
                'description' => 'Création visuelle impactante pour renforcer votre identité de marque.',
                'icon' => 'palette',
                'features' => [
                    'Design 2D et 3D',
                    'Identité visuelle et branding',
                    'Supports de communication',
                    'Animations et vidéos',
                    'UI/UX Design',
                ],
            ],
            [
                'id' => 'hardware',
                'title' => 'Matériel Électronique',
                'description' => 'Vente et configuration de matériel informatique professionnel et serveurs.',
                'icon' => 'server',
                'features' => [
                    'Ordinateurs et serveurs',
                    'Équipements réseau',
                    'Accessoires et périphériques',
                    'Configuration et installation',
                    'Maintenance et support',
                ],
            ],
        ];

        return response()->json([
            'success' => true,
            'data' => $services,
        ]);
    }

    /**
     * Display the specified service.
     */
    public function show($id)
    {
        $services = [
            'web' => [
                'id' => 'web',
                'title' => 'Développement Web',
                'description' => 'Création de sites web et applications web modernes, performantes et sécurisées.',
                'icon' => 'code',
                'features' => [
                    'Sites web responsive et modernes',
                    'Applications web complexes (SPA, PWA)',
                    'E-commerce et plateformes de vente',
                    'Intégration API et systèmes tiers',
                    'Optimisation SEO et performance',
                ],
            ],
            // Add other services...
        ];

        if (!isset($services[$id])) {
            return response()->json([
                'success' => false,
                'message' => 'Service not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $services[$id],
        ]);
    }
}

