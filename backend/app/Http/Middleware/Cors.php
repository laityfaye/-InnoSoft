<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class Cors
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Récupérer l'origine de la requête
        $origin = $request->headers->get('Origin');
        
        // Liste des origines autorisées
        $allowedOrigins = [
            'http://localhost:3000',
            'http://localhost:5173',
            'https://www.innosft.com',
            'https://innosft.com',
            'https://api.innosft.com',
        ];
        
        // Ajouter les origines depuis .env si définies
        if (env('FRONTEND_URL')) {
            $allowedOrigins[] = env('FRONTEND_URL');
        }
        
        if (env('CORS_ALLOWED_ORIGINS')) {
            $additionalOrigins = explode(',', env('CORS_ALLOWED_ORIGINS'));
            $allowedOrigins = array_merge($allowedOrigins, $additionalOrigins);
        }
        
        // Vérifier si l'origine est autorisée ou si c'est un pattern autorisé
        $isAllowed = false;
        if ($origin) {
            // Vérifier les origines exactes
            if (in_array($origin, $allowedOrigins)) {
                $isAllowed = true;
            }
            // Vérifier les patterns (domaines *.innosft.com)
            if (!$isAllowed && preg_match('/^https?:\/\/.*\.innosft\.com$/', $origin)) {
                $isAllowed = true;
            }
        }
        
        // Si l'origine n'est pas spécifiée (requêtes non-CORS), autoriser quand même
        if (!$origin) {
            $isAllowed = true;
            $origin = '*';
        }

        $response = $next($request);

        // Définir les en-têtes CORS
        if ($isAllowed) {
            $response->headers->set('Access-Control-Allow-Origin', $origin === '*' ? '*' : $origin);
        }
        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
        $response->headers->set('Access-Control-Allow-Credentials', 'true');
        $response->headers->set('Access-Control-Max-Age', '86400');

        // Répondre aux requêtes OPTIONS (preflight)
        if ($request->getMethod() === 'OPTIONS') {
            return response('', 200, $response->headers->all());
        }

        return $response;
    }
}

