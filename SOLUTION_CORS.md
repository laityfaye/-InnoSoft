# Solution au problème CORS

## Diagnostic du problème

L'erreur indique que la requête preflight (OPTIONS) ne reçoit pas les en-têtes CORS nécessaires :
```
Access to XMLHttpRequest at 'https://api.innosft.com/api/admin/login' from origin 'https://innosft.com' 
has been blocked by CORS policy: Response to preflight request doesn't pass access control check: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## Causes possibles

1. **Configuration Nginx intercepte OPTIONS** : La configuration actuelle (`nginx-config-final.conf`) intercepte les requêtes OPTIONS, mais l'utilisation de `if` avec `add_header` dans Nginx peut causer des problèmes connus.

2. **Laravel ne reçoit pas les requêtes OPTIONS** : Si Nginx intercepte les OPTIONS, Laravel ne peut pas les traiter avec son middleware `HandleCors`.

3. **Cache de configuration** : Laravel peut avoir mis en cache une ancienne configuration CORS.

## Solution recommandée

### Option 1 : Laisser Laravel gérer CORS (RECOMMANDÉ)

1. **Utiliser la configuration Nginx qui laisse Laravel gérer CORS** :
   ```bash
   sudo cp /home/tfksservice/innosoft/nginx-config-laravel-cors.conf /etc/nginx/sites-available/api.innosft.com
   sudo nginx -t
   sudo systemctl reload nginx
   ```

2. **Vérifier que la configuration CORS Laravel est correcte** :
   - Le fichier `backend/config/cors.php` autorise déjà `https://innosft.com`
   - Le middleware `HandleCors` est activé dans `Kernel.php`

3. **Vider le cache Laravel** :
   ```bash
   cd /home/tfksservice/innosoft/backend
   php artisan config:clear
   php artisan cache:clear
   php artisan route:clear
   ```

### Option 2 : Si Option 1 ne fonctionne pas

Si Laravel ne gère pas correctement CORS, vérifiez :

1. **Vérifier que le service provider CORS est enregistré** :
   Laravel 11+ devrait avoir `HandleCors` dans le middleware global.

2. **Vérifier le fichier .env** :
   S'assurer qu'il n'y a pas de configuration CORS dans `.env` qui pourrait surcharger `config/cors.php`.

3. **Tester avec curl** :
   ```bash
   curl -X OPTIONS \
     -H "Origin: https://innosft.com" \
     -H "Access-Control-Request-Method: POST" \
     -v \
     https://api.innosft.com/api/admin/login
   ```

## Fichiers de configuration

- `nginx-config-laravel-cors.conf` : Configuration qui laisse Laravel gérer CORS (RECOMMANDÉ)
- `nginx-config-final.conf` : Configuration actuelle qui intercepte OPTIONS dans Nginx
- `backend/config/cors.php` : Configuration CORS Laravel (autorise déjà `https://innosft.com`)

## Commandes utiles

```bash
# Test de la configuration Nginx
sudo nginx -t

# Recharger Nginx
sudo systemctl reload nginx

# Vider le cache Laravel
cd /home/tfksservice/innosoft/backend
php artisan config:clear
php artisan cache:clear

# Vérifier les logs Nginx
sudo tail -f /var/log/nginx/api-innosft-error.log
sudo tail -f /var/log/nginx/api-innosft-access.log

# Vérifier les logs Laravel
tail -f /home/tfksservice/innosoft/backend/storage/logs/laravel.log
```

