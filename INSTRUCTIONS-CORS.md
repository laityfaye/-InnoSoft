# Instructions pour résoudre les erreurs CORS

## Problème
Les erreurs CORS persistent après modification de la configuration Nginx.

## Avertissement Nginx détecté
L'avertissement `conflicting server name "api.innosft.com"` indique qu'il y a plusieurs configurations pour le même serveur. Il faut vérifier qu'il n'y a qu'un seul fichier de configuration actif.

## Étapes à suivre sur le serveur

### 1. Trouver tous les fichiers de configuration Nginx contenant api.innosft.com
```bash
sudo grep -r "api.innosft.com" /etc/nginx/sites-enabled/
sudo grep -r "api.innosft.com" /etc/nginx/conf.d/
```

### 2. Vérifier le fichier de configuration actuel
Le fichier de configuration se trouve généralement dans :
- `/etc/nginx/sites-available/api.innosft.com` ou similaire
- `/etc/nginx/sites-enabled/api.innosft.com` ou similaire

### 3. Vérifier que la configuration a bien été appliquée
Dans le bloc `location /`, vous devriez avoir :
```nginx
if ($request_method = 'OPTIONS') {
    add_header 'Access-Control-Allow-Origin' 'https://innosft.com' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE, PATCH' always;
    add_header 'Access-Control-Allow-Headers' 'Authorization,Content-Type,Accept,Origin,X-Requested-With' always;
    add_header 'Access-Control-Allow-Credentials' 'true' always;
    add_header 'Access-Control-Max-Age' 86400 always;
    add_header 'Content-Type' 'text/plain; charset=utf-8' always;
    add_header 'Content-Length' 0 always;
    return 204;
}
```

**IMPORTANT :** Il ne doit PAS y avoir de variable `$cors_allow_origin` non définie.

### 4. Vider le cache Laravel (avec sudo si nécessaire)
```bash
cd ~/innosoft/backend
sudo php artisan config:clear
sudo php artisan cache:clear
sudo php artisan route:clear
sudo php artisan view:clear
```

### 5. Vérifier que PHP-FPM fonctionne correctement
```bash
sudo systemctl status php8.4-fpm
```

### 6. Vérifier les logs Nginx pour voir ce qui se passe
```bash
sudo tail -f /var/log/nginx/api-innosft-error.log
```

### 7. Tester une requête OPTIONS manuellement
```bash
curl -X OPTIONS https://api.innosft.com/api/videos/featured \
  -H "Origin: https://innosft.com" \
  -H "Access-Control-Request-Method: GET" \
  -v
```

Cette commande devrait retourner les en-têtes CORS appropriés.

## Solution alternative : Laisser Laravel gérer les CORS

Si la gestion dans Nginx ne fonctionne pas, on peut laisser Laravel gérer complètement les CORS en supprimant la gestion des OPTIONS dans Nginx :

Dans le bloc `location /`, supprimer la section `if ($request_method = 'OPTIONS')` et laisser seulement :
```nginx
location / {
    try_files $uri $uri/ /index.php?$query_string;
}
```

Et supprimer les en-têtes CORS du bloc `location ~ \.php$`.

Laravel gérera alors les CORS via le middleware `HandleCors` qui est déjà configuré dans `backend/config/cors.php`.

