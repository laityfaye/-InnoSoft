# Configuration CORS pour la Production

## Problème
Les requêtes depuis `https://www.innosft.com` vers `https://api.innosft.com` sont bloquées par la politique CORS.

## Solution

### 1. Configuration dans `config/cors.php`
Le fichier `config/cors.php` a été mis à jour pour inclure automatiquement :
- `https://www.innosft.com`
- `https://innosft.com`
- `https://api.innosft.com`
- Pattern pour tous les sous-domaines `*.innosft.com`

### 2. Configuration du fichier `.env` (sur le serveur)

Ajoutez ou modifiez ces variables dans le fichier `.env` du backend :

```env
# URL du frontend en production
FRONTEND_URL=https://www.innosft.com

# Origines CORS autorisées (séparées par des virgules)
CORS_ALLOWED_ORIGINS=https://www.innosft.com,https://innosft.com,https://api.innosft.com

# URL de l'application backend
APP_URL=https://api.innosft.com
APP_ENV=production
APP_DEBUG=false
```

### 3. Vérifier que le cache de configuration est vidé

Sur le serveur, exécutez :

```bash
cd backend
php artisan config:clear
php artisan cache:clear
php artisan route:clear
```

### 4. Redémarrer les services

Redémarrez PHP-FPM ou le serveur web :

```bash
# Pour PHP-FPM
sudo systemctl restart php8.2-fpm  # ou la version de PHP que vous utilisez

# Pour Nginx
sudo systemctl restart nginx

# Pour Apache
sudo systemctl restart apache2
```

### 5. Vérifier les logs en cas d'erreur 500

Si vous avez toujours des erreurs 500, vérifiez les logs Laravel :

```bash
cd backend
tail -f storage/logs/laravel.log
```

### 6. Vérifier la configuration Nginx/Apache

Assurez-vous que votre serveur web passe correctement les en-têtes HTTP. 

#### Pour Nginx :

```nginx
location / {
    try_files $uri $uri/ /index.php?$query_string;
    
    # Passer les en-têtes correctement
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

#### Pour Apache :

Assurez-vous que `mod_headers` est activé :

```bash
sudo a2enmod headers
sudo systemctl restart apache2
```

### 7. Test des en-têtes CORS

Testez avec curl pour voir si les en-têtes CORS sont présents :

```bash
curl -I -X OPTIONS https://api.innosft.com/api/projects \
  -H "Origin: https://www.innosft.com" \
  -H "Access-Control-Request-Method: GET"
```

Vous devriez voir ces en-têtes dans la réponse :
- `Access-Control-Allow-Origin: https://www.innosft.com`
- `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With`

### 8. Si le problème persiste

1. Vérifiez que le middleware `HandleCors` est bien dans le `Kernel.php`
2. Vérifiez que les permissions des fichiers sont correctes
3. Vérifiez les logs serveur (Nginx/Apache) et Laravel
4. Assurez-vous que le serveur web est configuré pour gérer les requêtes OPTIONS (preflight)

## Notes importantes

- Ne jamais utiliser `Access-Control-Allow-Origin: *` en production avec `supports_credentials: true`
- Toujours spécifier les origines exactes autorisées
- Le pattern `/^https?:\/\/.*\.innosft\.com$/` permet tous les sous-domaines
- Assurez-vous que `TrustProxies` est configuré correctement si vous êtes derrière un load balancer

