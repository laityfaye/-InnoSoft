# Configuration Email - InnoSoft Creation

## Configuration Gmail

L'application utilise Gmail pour l'envoi d'emails via SMTP.

### Paramètres SMTP Gmail

- **Host**: `smtp.gmail.com`
- **Port**: `587`
- **Encryption**: `tls`
- **Username**: `innosoftcreation@gmail.com`
- **Password**: `jbpz apuv wfca cflk` (mot de passe d'application)
- **From Address**: `innosoftcreation@gmail.com`
- **From Name**: `InnoSoft Creation`

### Configuration dans .env

Si vous souhaitez personnaliser ces paramètres, ajoutez les variables suivantes dans votre fichier `.env` :

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=innosoftcreation@gmail.com
MAIL_PASSWORD=jbpz apuv wfca cflk
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=innosoftcreation@gmail.com
MAIL_FROM_NAME="InnoSoft Creation"
QUEUE_CONNECTION=database
```

### Note importante

Les valeurs par défaut sont déjà configurées dans `config/mail.php`, donc même sans fichier `.env`, l'application utilisera ces paramètres Gmail.

## Système de Queue (File d'attente)

Les emails sont envoyés de manière **asynchrone** via une queue pour éviter de ralentir la plateforme. Les emails sont mis en file d'attente et traités en arrière-plan.

### Configuration de la Queue

La queue est configurée pour utiliser la base de données (`database` driver) par défaut. Cela signifie que les jobs sont stockés dans la table `jobs` de la base de données.

### Installation et Configuration

1. **Exécuter les migrations** pour créer les tables nécessaires :

```bash
cd backend
php artisan migrate
```

Cela créera les tables `jobs` et `failed_jobs` dans votre base de données.

2. **Démarrer le worker de queue** :

Pour que les emails soient effectivement envoyés, vous devez démarrer le worker Laravel qui traite les jobs en file d'attente :

```bash
cd backend
php artisan queue:work
```

Pour le développement, vous pouvez utiliser :

```bash
php artisan queue:listen
```

### Worker en Production

En production, il est recommandé d'utiliser un gestionnaire de processus comme **Supervisor** pour maintenir le worker actif en permanence.

#### Configuration Supervisor (optionnel)

Créez un fichier `/etc/supervisor/conf.d/laravel-worker.conf` :

```ini
[program:laravel-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /chemin/vers/votre/projet/backend/artisan queue:work --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=1
redirect_stderr=true
stdout_logfile=/chemin/vers/votre/projet/backend/storage/logs/worker.log
stopwaitsecs=3600
```

Puis redémarrez Supervisor :

```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start laravel-worker:*
```

### Vérification des Jobs

Pour voir les jobs en attente :

```bash
php artisan queue:work --once
```

Pour voir les jobs échoués :

```bash
php artisan queue:failed
```

Pour réessayer un job échoué :

```bash
php artisan queue:retry {id}
```

### Utilisation dans l'application

L'email `innosoftcreation@gmail.com` est utilisé pour :
- L'envoi des emails de contact depuis les formulaires (via queue)
- L'affichage dans le footer du site
- L'affichage dans la page de contact
- L'affichage dans le composant QuickContact

### Test de l'envoi d'email

1. Assurez-vous que le worker est démarré : `php artisan queue:work`
2. Utilisez le formulaire de contact sur le site ou envoyez une requête POST à l'endpoint `/api/contact`
3. L'email sera mis en queue et envoyé en arrière-plan sans ralentir la réponse de l'API

