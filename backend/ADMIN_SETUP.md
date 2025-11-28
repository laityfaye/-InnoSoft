# Configuration Admin - InnoSoft Creation

## Installation et Configuration

### 1. Exécuter les migrations

```bash
cd backend
php artisan migrate
```

### 2. Créer un utilisateur admin

Exécutez le seeder pour créer un utilisateur admin par défaut :

```bash
php artisan db:seed --class=AdminUserSeeder
```

**Identifiants par défaut :**
- Email: `admin@innosoft.com`
- Mot de passe: `admin123`

⚠️ **Important :** Changez le mot de passe après la première connexion !

### 3. Créer un utilisateur admin manuellement (optionnel)

Vous pouvez aussi créer un utilisateur admin via Tinker :

```bash
php artisan tinker
```

Puis exécutez :

```php
$user = new App\User();
$user->name = 'Votre Nom';
$user->email = 'votre@email.com';
$user->password = Hash::make('votre_mot_de_passe');
$user->is_admin = true;
$user->save();
```

## Accès au Dashboard Admin

1. Démarrez le serveur backend :
```bash
cd backend
php artisan serve
```

2. Démarrez le serveur frontend :
```bash
cd frontend
npm run dev
```

3. Accédez à la page de connexion admin :
```
http://localhost:3000/admin/login
```

## Fonctionnalités du Dashboard

### Gestion des Témoignages

- **Voir tous les témoignages** : Approuvés et en attente
- **Approuver un témoignage** : Cliquez sur le bouton ✓ pour approuver
- **Rejeter un témoignage** : Cliquez sur le bouton ✗ pour rejeter
- **Supprimer un témoignage** : Cliquez sur le bouton 🗑️ pour supprimer

### Gestion des Projets

- **Voir tous les projets** : Liste de tous les projets du portfolio
- **Ajouter un projet** : Cliquez sur "Ajouter un projet"
- **Modifier un projet** : Cliquez sur "Modifier" sur un projet
- **Supprimer un projet** : Cliquez sur l'icône 🗑️

## API Endpoints

### Authentification
- `POST /api/admin/login` - Connexion admin
- `GET /api/admin/me` - Informations de l'utilisateur connecté
- `POST /api/admin/logout` - Déconnexion

### Témoignages (Admin)
- `GET /api/admin/testimonials` - Liste tous les témoignages
- `PUT /api/admin/testimonials/{id}` - Modifier un témoignage
- `DELETE /api/admin/testimonials/{id}` - Supprimer un témoignage
- `POST /api/admin/testimonials/{id}/approve` - Approuver un témoignage
- `POST /api/admin/testimonials/{id}/reject` - Rejeter un témoignage

### Projets (Admin)
- `POST /api/admin/projects` - Créer un projet
- `PUT /api/admin/projects/{id}` - Modifier un projet
- `DELETE /api/admin/projects/{id}` - Supprimer un projet

## Sécurité

- Tous les endpoints admin sont protégés par `auth:sanctum`
- Seuls les utilisateurs avec `is_admin = true` peuvent se connecter
- Les tokens sont stockés dans `localStorage` côté frontend
- Les tokens expirent après déconnexion

## Notes

- Les témoignages soumis par les clients ne sont pas automatiquement approuvés
- L'administrateur doit approuver chaque témoignage avant qu'il ne soit visible publiquement
- Les projets peuvent être créés, modifiés et supprimés uniquement par l'administrateur

