# Correction complète des erreurs CORS

## Problèmes identifiés

1. **Fichier .bak actif** : Le fichier `/etc/nginx/sites-enabled/api.innosft.com.bak` cause un conflit
2. **Variable non définie** : La configuration utilise `$cors_allow_origin` qui n'est pas définie
3. **Configuration en double** : Plusieurs configurations pour le même serveur

## Solution étape par étape

### Étape 1 : Supprimer le fichier .bak

```bash
sudo rm /etc/nginx/sites-enabled/api.innosft.com.bak
```

### Étape 2 : Sauvegarder la configuration actuelle

```bash
sudo cp /etc/nginx/sites-available/api.innosft.com /etc/nginx/sites-available/api.innosft.com.backup-$(date +%Y%m%d)
```

### Étape 3 : Remplacer la configuration

Utilisez le contenu du fichier `nginx-config-complete-fix.conf` pour remplacer complètement `/etc/nginx/sites-available/api.innosft.com`

**OU** modifiez manuellement le bloc `location /` dans `/etc/nginx/sites-available/api.innosft.com` :

Remplacez :
```nginx
location / {
    if ($request_method = 'OPTIONS') {
        add_header 'Access-Control-Allow-Origin' $cors_allow_origin;  # ← PROBLÈME ICI
        ...
    }
    ...
}
```

Par :
```nginx
location / {
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
    
    try_files $uri $uri/ /index.php?$query_string;
}
```

Et ajoutez les en-têtes CORS dans le bloc `location ~ \.php$` :

```nginx
location ~ \.php$ {
    fastcgi_pass unix:/var/run/php/php8.4-fpm.sock;
    fastcgi_index index.php;
    fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
    include fastcgi_params;
    fastcgi_hide_header X-Powered-By;
    fastcgi_read_timeout 3600;
    fastcgi_send_timeout 3600;
    
    # Ajouter les en-têtes CORS
    add_header 'Access-Control-Allow-Origin' 'https://innosft.com' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE, PATCH' always;
    add_header 'Access-Control-Allow-Headers' 'Authorization,Content-Type,Accept,Origin,X-Requested-With' always;
    add_header 'Access-Control-Allow-Credentials' 'true' always;
}
```

### Étape 4 : Tester et recharger

```bash
sudo nginx -t
sudo systemctl reload nginx
```

### Étape 5 : Vérifier que le conflit est résolu

```bash
sudo nginx -t
```

Vous ne devriez plus voir l'avertissement "conflicting server name".

### Étape 6 : Vider les caches Laravel

```bash
cd ~/innosoft/backend
sudo php artisan config:clear
sudo php artisan route:clear
sudo php artisan cache:clear
```

### Étape 7 : Tester une requête OPTIONS

```bash
curl -X OPTIONS https://api.innosft.com/api/admin/login \
  -H "Origin: https://innosft.com" \
  -H "Access-Control-Request-Method: POST" \
  -v
```

Vous devriez voir les en-têtes CORS dans la réponse (status 204).

## Points importants

- Utilisez `'https://innosft.com'` (avec apostrophes) au lieu de `$cors_allow_origin`
- Ajoutez `always` après chaque `add_header` pour s'assurer qu'ils sont toujours ajoutés
- Les en-têtes doivent être dans le bloc `location ~ \.php$` pour les réponses PHP normales
- Les en-têtes doivent être dans le bloc `if ($request_method = 'OPTIONS')` pour les requêtes preflight

