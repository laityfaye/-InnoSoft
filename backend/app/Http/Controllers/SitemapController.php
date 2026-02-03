<?php

namespace App\Http\Controllers;

use App\News;
use App\Project;
use App\Product;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Cache;

class SitemapController extends Controller
{
    /**
     * Génère le sitemap XML dynamique
     */
    public function index()
    {
        $baseUrl = config('app.url');
        // Utiliser l'URL frontend depuis l'env, sinon utiliser l'URL de base
        // Note: En production, définir FRONTEND_URL dans le fichier .env
        $frontendUrl = env('FRONTEND_URL') ?: $baseUrl;
        
        // Cache le sitemap pendant 24 heures
        $sitemap = Cache::remember('sitemap', 86400, function () use ($frontendUrl) {
            $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
            $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"' . "\n";
            $xml .= '        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"' . "\n";
            $xml .= '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">' . "\n";
            
            // Pages statiques principales
            $staticPages = [
                ['url' => '/', 'priority' => '1.0', 'changefreq' => 'weekly'],
                ['url' => '/services', 'priority' => '0.9', 'changefreq' => 'monthly'],
                ['url' => '/about', 'priority' => '0.8', 'changefreq' => 'monthly'],
                ['url' => '/portfolio', 'priority' => '0.9', 'changefreq' => 'weekly'],
                ['url' => '/p/', 'priority' => '0.95', 'changefreq' => 'weekly'],
                ['url' => '/products', 'priority' => '0.8', 'changefreq' => 'weekly'],
                ['url' => '/blog', 'priority' => '0.9', 'changefreq' => 'daily'],
                ['url' => '/contact', 'priority' => '0.7', 'changefreq' => 'monthly'],
            ];
            
            foreach ($staticPages as $page) {
                $xml .= $this->generateUrlEntry(
                    $frontendUrl . $page['url'],
                    $page['priority'],
                    $page['changefreq']
                );
            }
            
            // Articles de blog publiés
            $news = News::published()
                ->orderBy('published_at', 'desc')
                ->get();
            
            foreach ($news as $article) {
                $lastmod = $article->updated_at ? $article->updated_at->format('Y-m-d') : date('Y-m-d');
                $xml .= $this->generateUrlEntry(
                    $frontendUrl . '/blog/' . $article->slug,
                    '0.8',
                    'monthly',
                    $lastmod
                );
            }
            
            // Projets (optionnel - si vous avez des pages dédiées)
            // $projects = Project::where('is_featured', true)->get();
            // foreach ($projects as $project) {
            //     $xml .= $this->generateUrlEntry(
            //         $frontendUrl . '/portfolio/' . $project->id,
            //         '0.7',
            //         'monthly'
            //     );
            // }
            
            $xml .= '</urlset>';
            return $xml;
        });
        
        return response($sitemap, 200)
            ->header('Content-Type', 'application/xml; charset=utf-8');
    }
    
    /**
     * Génère une entrée URL pour le sitemap
     */
    private function generateUrlEntry($url, $priority, $changefreq, $lastmod = null)
    {
        $lastmod = $lastmod ?: date('Y-m-d');
        
        $entry = "  <url>\n";
        $entry .= "    <loc>" . htmlspecialchars($url, ENT_XML1, 'UTF-8') . "</loc>\n";
        $entry .= "    <lastmod>{$lastmod}</lastmod>\n";
        $entry .= "    <changefreq>{$changefreq}</changefreq>\n";
        $entry .= "    <priority>{$priority}</priority>\n";
        $entry .= "  </url>\n";
        
        return $entry;
    }
}

