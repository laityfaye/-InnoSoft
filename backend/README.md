# InnoSoft Creation - Backend API

API RESTful Laravel pour la plateforme InnoSoft Creation.

## Installation

1. Installer les dépendances Composer :
```bash
composer install
```

2. Copier le fichier d'environnement :
```bash
cp .env.example .env
```

3. Générer la clé d'application :
```bash
php artisan key:generate
```

4. Configurer la base de données dans `.env`

5. Exécuter les migrations :
```bash
php artisan migrate
```

6. Démarrer le serveur :
```bash
php artisan serve
```

## API Endpoints

### Services
- `GET /api/services` - Liste tous les services
- `GET /api/services/{id}` - Détails d'un service

### Projets
- `GET /api/projects` - Liste tous les projets
- `GET /api/projects?category=web` - Filtrer par catégorie
- `GET /api/projects/{id}` - Détails d'un projet

### Contact
- `POST /api/contact` - Envoyer un message de contact

## Structure

```
app/
├── Http/
│   ├── Controllers/
│   │   └── Api/
│   │       ├── ContactController.php
│   │       ├── ProjectController.php
│   │       └── ServiceController.php
│   └── Middleware/
│       └── Cors.php
└── Mail/
    └── ContactFormMail.php
```

