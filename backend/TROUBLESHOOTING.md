# Guide de Dépannage - Connexion Admin

## Problèmes de Connexion

### 1. Vérifier que les migrations sont exécutées

```bash
cd backend
php artisan migrate
php artisan db:seed --class=AdminUserSeeder
```

### 2. Vérifier que l'utilisateur admin existe

```bash
php artisan tinker
```

Puis :
```php
$user = App\User::where('email', 'admin@innosoft.com')->first();
if ($user) {
    echo "User exists: " . $user->name . "\n";
    echo "Is admin: " . ($user->is_admin ? 'Yes' : 'No') . "\n";
} else {
    echo "User not found!\n";
}
```

### 3. Vérifier que le serveur backend est démarré

```bash
cd backend
php artisan serve
```

Le serveur doit être accessible sur `http://localhost:8000`

### 4. Vérifier l'URL de l'API dans le frontend

Dans `frontend/src/services/api.ts`, l'URL par défaut est :
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
```

Vous pouvez créer un fichier `.env` dans `frontend/` avec :
```
VITE_API_URL=http://localhost:8000/api
```

### 5. Vérifier les erreurs dans la console du navigateur

Ouvrez la console du navigateur (F12) et vérifiez :
- Les erreurs CORS
- Les erreurs de réseau
- Les erreurs de réponse de l'API

### 6. Tester l'endpoint de login directement

Utilisez curl ou Postman pour tester :

```bash
curl -X POST http://localhost:8000/api/admin/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"email":"admin@innosoft.com","password":"admin123"}'
```

### 7. Vérifier la configuration CORS

Dans `backend/config/cors.php`, vérifiez que :
- `allowed_origins` contient l'URL de votre frontend
- `supports_credentials` est à `true`

### 8. Vérifier les logs Laravel

```bash
cd backend
tail -f storage/logs/laravel.log
```

### 9. Créer un utilisateur admin manuellement

Si le seeder ne fonctionne pas :

```bash
php artisan tinker
```

```php
use App\User;
use Illuminate\Support\Facades\Hash;

$user = new User();
$user->name = 'Administrateur';
$user->email = 'admin@innosoft.com';
$user->password = Hash::make('admin123');
$user->is_admin = true;
$user->save();

echo "User created successfully!\n";
```

### 10. Vérifier la configuration de la base de données

Dans `backend/.env`, vérifiez :
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=innosoft
DB_USERNAME=root
DB_PASSWORD=
```

### Erreurs courantes

#### "Les identifiants fournis sont incorrects"
- Vérifiez que l'utilisateur existe dans la base de données
- Vérifiez que le mot de passe est correct
- Vérifiez que `is_admin` est à `true`

#### "Accès non autorisé"
- L'utilisateur existe mais `is_admin` est à `false`
- Mettez à jour : `$user->is_admin = true; $user->save();`

#### Erreur CORS
- Vérifiez que le frontend est sur un port autorisé dans `cors.php`
- Vérifiez que `supports_credentials` est à `true`

#### "Network Error" ou "Failed to fetch"
- Vérifiez que le serveur backend est démarré
- Vérifiez l'URL de l'API dans le frontend
- Vérifiez qu'il n'y a pas de firewall bloquant

#### Erreur 500
- Vérifiez les logs Laravel
- Vérifiez que les migrations sont exécutées
- Vérifiez que Sanctum est correctement installé

## Commandes utiles

```bash
# Nettoyer le cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear

# Réinstaller Sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate

# Vérifier les routes
php artisan route:list | grep admin
```

