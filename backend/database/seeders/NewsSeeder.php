<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\News;
use Illuminate\Support\Str;
use Carbon\Carbon;

class NewsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $newsArticles = [
            [
                'title' => 'Les Tendances du Développement Web en 2025',
                'excerpt' => 'Découvrez les dernières innovations et tendances qui façonnent le développement web moderne. De l\'intelligence artificielle aux frameworks émergents, explorez l\'avenir du développement web.',
                'content' => 'Le développement web évolue à une vitesse fulgurante, et 2025 apporte son lot de nouveautés passionnantes. Dans cet article, nous explorons les tendances qui définissent l\'avenir du développement web.

**L\'Intelligence Artificielle dans le Développement**

L\'IA transforme la façon dont nous créons des applications. Des outils comme GitHub Copilot et ChatGPT assistent les développeurs dans leur travail quotidien, accélérant le processus de développement tout en maintenant la qualité du code.

**Les Frameworks Modernes**

React, Vue.js et Angular continuent d\'évoluer, mais de nouveaux frameworks émergent également. Svelte et Solid.js gagnent en popularité grâce à leurs performances exceptionnelles et leur simplicité.

**Le Serverless et le Edge Computing**

Le développement serverless devient la norme, permettant de créer des applications plus rapides et plus économiques. Le edge computing rapproche les données des utilisateurs, réduisant la latence.

**La Sécurité Avant Tout**

Avec l\'augmentation des cyberattaques, la sécurité devient une priorité absolue. Les développeurs doivent intégrer les meilleures pratiques de sécurité dès le début du processus de développement.

**Conclusion**

Le développement web en 2025 est marqué par l\'innovation, la performance et la sécurité. Rester à jour avec ces tendances est essentiel pour créer des applications modernes et compétitives.',
                'category' => 'Développement',
                'author' => 'InnoSoft Team',
                'read_time' => 8,
                'is_published' => true,
                'published_at' => Carbon::now()->subDays(5),
                'image' => 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
                'order' => 0,
            ],
            [
                'title' => 'Comment Optimiser les Performances de Votre Application',
                'excerpt' => 'Techniques avancées pour améliorer la vitesse et l\'efficacité de vos applications web et mobiles. Découvrez les meilleures pratiques pour des performances optimales.',
                'content' => 'L\'optimisation des performances est cruciale pour le succès d\'une application. Dans cet article, nous partageons des techniques éprouvées pour améliorer les performances.

**1. Optimisation des Images**

Les images représentent souvent la plus grande partie du poids d\'une page. Utilisez des formats modernes comme WebP ou AVIF, et implémentez le lazy loading pour charger les images uniquement quand elles sont nécessaires.

**2. Code Splitting et Lazy Loading**

Divisez votre code JavaScript en chunks plus petits et chargez-les à la demande. Cela réduit le temps de chargement initial et améliore l\'expérience utilisateur.

**3. Mise en Cache**

Implémentez une stratégie de cache efficace. Utilisez le cache du navigateur, le cache CDN, et le cache applicatif pour réduire les requêtes serveur.

**4. Optimisation des Requêtes Base de Données**

Évitez les requêtes N+1, utilisez l\'eager loading, et optimisez vos index de base de données. Une base de données bien optimisée est la clé de performances rapides.

**5. Compression et Minification**

Minifiez votre CSS et JavaScript, et utilisez la compression Gzip ou Brotli pour réduire la taille des fichiers transférés.

**6. Monitoring et Analytics**

Utilisez des outils comme Lighthouse, WebPageTest, ou New Relic pour identifier les goulots d\'étranglement et mesurer les améliorations.

**Conclusion**

L\'optimisation des performances est un processus continu. Testez régulièrement, mesurez les résultats, et itérez pour maintenir des performances optimales.',
                'category' => 'Performance',
                'author' => 'InnoSoft Team',
                'read_time' => 10,
                'is_published' => true,
                'published_at' => Carbon::now()->subDays(10),
                'image' => 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
                'order' => 1,
            ],
            [
                'title' => 'L\'Intelligence Artificielle dans le Développement',
                'excerpt' => 'Explorez comment l\'IA transforme la façon dont nous créons et maintenons les applications. Découvrez les outils et techniques qui révolutionnent le développement logiciel.',
                'content' => 'L\'intelligence artificielle révolutionne le développement logiciel, offrant de nouvelles possibilités et améliorant la productivité des développeurs.

**Les Assistants IA pour le Code**

Des outils comme GitHub Copilot, Amazon CodeWhisperer, et Tabnine utilisent l\'IA pour suggérer du code en temps réel. Ils apprennent de millions de lignes de code pour proposer des solutions pertinentes.

**Génération Automatique de Code**

L\'IA peut générer du code à partir de descriptions en langage naturel. Des outils comme ChatGPT et Claude peuvent créer des fonctions complètes, des composants React, ou même des applications entières.

**Débogage Intelligent**

L\'IA aide à identifier et corriger les bugs plus rapidement. Elle peut analyser le code, détecter les erreurs potentielles, et suggérer des corrections.

**Tests Automatisés**

L\'IA peut générer des tests unitaires et d\'intégration, améliorant la couverture de tests et réduisant le temps de développement.

**Optimisation du Code**

Les outils IA peuvent analyser le code et suggérer des optimisations pour améliorer les performances, la lisibilité, et la maintenabilité.

**L\'Avenir du Développement**

L\'IA ne remplace pas les développeurs, mais elle les rend plus productifs. Les développeurs peuvent se concentrer sur la résolution de problèmes complexes pendant que l\'IA gère les tâches répétitives.

**Conclusion**

L\'IA est un outil puissant qui transforme le développement logiciel. Adopter ces technologies maintenant vous donnera un avantage concurrentiel significatif.',
                'category' => 'IA',
                'author' => 'InnoSoft Team',
                'read_time' => 7,
                'is_published' => true,
                'published_at' => Carbon::now()->subDays(15),
                'image' => 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
                'order' => 2,
            ],
            [
                'title' => 'Meilleures Pratiques de Sécurité Web en 2025',
                'excerpt' => 'Protégez vos applications web contre les menaces modernes. Découvrez les meilleures pratiques de sécurité essentielles pour tout développeur web en 2025.',
                'content' => 'La sécurité web est plus importante que jamais. Avec l\'augmentation des cyberattaques, il est crucial d\'implémenter les meilleures pratiques de sécurité.

**1. Authentification et Autorisation**

Utilisez des mécanismes d\'authentification robustes :
- Mots de passe forts avec validation
- Authentification à deux facteurs (2FA)
- OAuth 2.0 et JWT pour les API
- Gestion sécurisée des sessions

**2. Protection contre les Injections**

Protégez-vous contre les injections SQL, XSS, et autres :
- Utilisez des requêtes préparées
- Validez et sanitisez toutes les entrées utilisateur
- Utilisez des Content Security Policies (CSP)
- Échappez les données avant l\'affichage

**3. HTTPS et Chiffrement**

Toujours utiliser HTTPS pour toutes les communications. Chiffrez les données sensibles en transit et au repos.

**4. Gestion des Dépendances**

Maintenez vos dépendances à jour :
- Utilisez des outils comme Dependabot ou Snyk
- Vérifiez régulièrement les vulnérabilités connues
- Évitez les dépendances non maintenues

**5. Gestion des Erreurs**

Ne révélez jamais d\'informations sensibles dans les messages d\'erreur. Loggez les erreurs de manière sécurisée sans exposer de données confidentielles.

**6. Rate Limiting**

Implémentez le rate limiting pour protéger contre les attaques par force brute et DDoS.

**7. Validation des Entrées**

Validez toutes les entrées côté serveur, même si vous avez une validation côté client. Ne faites jamais confiance aux données du client.

**8. Mise à Jour Régulière**

Maintenez votre stack technologique à jour avec les dernières versions de sécurité.

**Conclusion**

La sécurité est un processus continu, pas un état final. Restez informé des nouvelles menaces et mettez régulièrement à jour vos pratiques de sécurité.',
                'category' => 'Sécurité',
                'author' => 'InnoSoft Team',
                'read_time' => 9,
                'is_published' => true,
                'published_at' => Carbon::now()->subDays(20),
                'image' => 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800',
                'order' => 3,
            ],
        ];

        foreach ($newsArticles as $article) {
            // Générer le slug automatiquement si non fourni
            if (!isset($article['slug'])) {
                $article['slug'] = Str::slug($article['title']);
                
                // S'assurer que le slug est unique
                $originalSlug = $article['slug'];
                $count = 1;
                while (News::where('slug', $article['slug'])->exists()) {
                    $article['slug'] = $originalSlug . '-' . $count;
                    $count++;
                }
            }

            News::firstOrCreate(
                ['slug' => $article['slug']],
                $article
            );
        }
    }
}

