# Guide de Configuration Google Maps

Ce guide vous explique comment configurer Google Maps pour afficher la carte dans la page de checkout.

## Étape 1 : Obtenir une clé API Google Maps

### 1.1 Créer un compte Google Cloud

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Connectez-vous avec votre compte Google
3. Si vous n'avez pas de compte, créez-en un gratuitement

### 1.2 Créer un projet

1. Cliquez sur le sélecteur de projet en haut de la page
2. Cliquez sur "Nouveau projet"
3. Donnez un nom à votre projet (ex: "InnoSoft Maps")
4. Cliquez sur "Créer"
5. Attendez quelques secondes que le projet soit créé

### 1.3 Activer l'API Maps JavaScript

1. Dans le menu latéral, allez dans "APIs et services" > "Bibliothèque"
2. Recherchez "Maps JavaScript API"
3. Cliquez dessus
4. Cliquez sur "Activer"
5. Attendez quelques instants que l'API soit activée

### 1.4 Créer une clé API

1. Dans le menu latéral, allez dans "APIs et services" > "Identifiants"
2. Cliquez sur "Créer des identifiants" > "Clé API"
3. Une clé API sera générée automatiquement
4. **Important** : Copiez cette clé immédiatement, vous ne pourrez plus la voir après
5. (Recommandé) Cliquez sur "Restreindre la clé" pour la sécurité :
   - Dans "Restrictions d'application", sélectionnez "Applications Web"
   - Ajoutez votre domaine (ex: `localhost` pour le développement, votre domaine pour la production)
   - Dans "Restrictions d'API", sélectionnez "Maps JavaScript API"
   - Cliquez sur "Enregistrer"

## Étape 2 : Configurer la clé API dans le projet

### 2.1 Créer le fichier .env

1. Allez dans le dossier `frontend` de votre projet
2. Créez un nouveau fichier nommé `.env` (sans extension)
3. Ajoutez le contenu suivant :

```env
VITE_API_URL=http://localhost:8000/api
VITE_GOOGLE_MAPS_API_KEY=votre_cle_api_ici
```

**Remplacez `votre_cle_api_ici` par la clé API que vous avez copiée à l'étape 1.4**

### 2.2 Exemple de fichier .env

```env
# URL de l'API backend
VITE_API_URL=http://localhost:8000/api

# Clé API Google Maps (obtenue depuis Google Cloud Console)
VITE_GOOGLE_MAPS_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## Étape 3 : Redémarrer le serveur de développement

Après avoir créé/modifié le fichier `.env`, vous devez redémarrer le serveur de développement :

1. Arrêtez le serveur (Ctrl+C dans le terminal)
2. Redémarrez-le avec :
   ```bash
   cd frontend
   npm run dev
   ```

**Important** : Les variables d'environnement ne sont chargées qu'au démarrage, donc un redémarrage est nécessaire.

## Étape 4 : Vérifier que ça fonctionne

1. Ouvrez votre application dans le navigateur
2. Allez sur la page de checkout
3. Vous devriez voir la carte Google Maps s'afficher
4. Le message d'avertissement "Google Maps n'est pas configuré" ne devrait plus apparaître

## Dépannage

### La carte ne s'affiche pas

1. **Vérifiez que le fichier .env existe** dans le dossier `frontend`
2. **Vérifiez que la clé API est correcte** (sans espaces, sans guillemets)
3. **Vérifiez que vous avez redémarré le serveur** après avoir créé/modifié le .env
4. **Vérifiez la console du navigateur** (F12) pour voir les erreurs éventuelles
5. **Vérifiez que l'API est activée** dans Google Cloud Console

### Erreur "This API key is not authorized"

1. Vérifiez que l'API "Maps JavaScript API" est bien activée dans Google Cloud Console
2. Vérifiez que votre clé API n'a pas de restrictions trop strictes
3. Pour le développement local, assurez-vous que `localhost` est autorisé dans les restrictions

### Erreur "RefererNotAllowedMapError"

1. Allez dans Google Cloud Console > Identifiants
2. Cliquez sur votre clé API
3. Dans "Restrictions d'application", ajoutez `http://localhost:*` pour le développement
4. Pour la production, ajoutez votre domaine complet

## Coûts

**Important** : Google Maps propose un crédit gratuit de 200$ par mois, ce qui couvre généralement :
- 28 000 chargements de carte par mois
- 40 000 requêtes de géocodage par mois

Pour la plupart des sites, cela est largement suffisant. Au-delà, Google facture selon l'utilisation.

## Sécurité

1. **Ne commitez jamais votre fichier .env** dans Git (il est déjà dans .gitignore)
2. **Restreignez votre clé API** aux domaines autorisés
3. **Limitez les APIs** que votre clé peut utiliser
4. **Surveillez l'utilisation** dans Google Cloud Console pour détecter les abus

## Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs dans la console du navigateur (F12)
2. Vérifiez les erreurs dans Google Cloud Console
3. Consultez la [documentation officielle de Google Maps](https://developers.google.com/maps/documentation/javascript)

