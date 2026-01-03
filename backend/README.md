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

7. **Démarrer le worker de queue** (nécessaire pour l'envoi d'emails) :
```bash
php artisan queue:work
```

> **Important** : Le worker de queue doit être démarré pour que les emails soient envoyés. Les emails sont traités de manière asynchrone pour ne pas ralentir la plateforme. Voir `MAIL_CONFIGURATION.md` pour plus de détails.

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

### QR Code (Campagne)
- `GET /api/qrcode` - Générer un QR code PNG qui redirige vers la plateforme
- `GET /api/qrcode/svg` - Générer un QR code SVG (vectoriel)
- `GET /api/qrcode/download` - Télécharger le QR code en PNG
- `GET /api/qrcode/info` - Obtenir les informations et URLs du QR code

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

