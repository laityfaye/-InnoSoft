# Configuration du Domaine pour Google Maps

## Ajouter votre domaine à la clé API Google Maps

### Étape 1 : Accéder à Google Cloud Console

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Connectez-vous avec votre compte Google
3. Sélectionnez le projet où vous avez créé votre clé API

### Étape 2 : Modifier les restrictions de la clé API

1. Dans le menu latéral, allez dans **"APIs et services"** > **"Identifiants"**
2. Cliquez sur votre clé API (celle qui commence par `AIzaSyDl_uQC8fuD0RORvcGYAVAwKMD9xwgLw1g`)
3. La page de détails de la clé s'ouvre

### Étape 3 : Configurer les restrictions d'application

1. Dans la section **"Restrictions d'application"**, cliquez sur **"Restreindre la clé"**
2. Sélectionnez **"Applications Web"**
3. Dans **"Référents de sites Web autorisés"**, cliquez sur **"Ajouter un élément"**
4. Ajoutez les domaines suivants (un par ligne) :

```
https://innosft.com/*
http://innosft.com/*
https://www.innosft.com/*
http://www.innosft.com/*
```

**Important :**
- Utilisez `https://innosft.com/*` pour autoriser toutes les pages sous votre domaine
- Ajoutez aussi la version `http://` si vous l'utilisez
- Ajoutez les versions avec et sans `www.` si vous utilisez les deux

### Étape 4 : Configurer les restrictions d'API (Recommandé)

1. Dans la section **"Restrictions d'API"**, cliquez sur **"Restreindre la clé"**
2. Cochez uniquement **"Maps JavaScript API"**
3. Cela empêchera l'utilisation de votre clé pour d'autres APIs Google

### Étape 5 : Enregistrer

1. Cliquez sur **"Enregistrer"** en bas de la page
2. Attendez quelques secondes que les changements soient appliqués

## Configuration pour le développement local

Pour que la clé fonctionne aussi en développement local, ajoutez aussi :

```
http://localhost:*
http://localhost:3000/*
http://localhost:5173/*
http://127.0.0.1:*
```

**Note :** 
- `http://localhost:*` autorise tous les ports (recommandé pour le développement)
- Si vous utilisez un port spécifique (comme 3000 ou 5173 pour Vite), vous pouvez l'ajouter spécifiquement
- `http://127.0.0.1:*` est une alternative à localhost

Dans la liste des référents autorisés.

## Vérification

Après avoir enregistré :

1. Attendez 5-10 minutes pour que les changements soient propagés
2. Testez votre site sur https://innosft.com/
3. La carte Google Maps devrait s'afficher correctement

## Dépannage

### Erreur "RefererNotAllowedMapError"

Cette erreur signifie que votre domaine/URL n'est pas autorisé dans les restrictions de la clé API.

**Solutions :**
1. Vérifiez que vous avez bien ajouté votre domaine avec `/*` à la fin
2. Vérifiez que vous avez ajouté les versions `http://` et `https://`
3. **Pour le développement local**, assurez-vous d'avoir ajouté `http://localhost:*` ou le port spécifique (ex: `http://localhost:3000/*`)
4. Attendez 5-10 minutes après avoir enregistré pour que les changements soient propagés
5. Videz le cache de votre navigateur (Ctrl+Shift+R ou Cmd+Shift+R)

### La carte ne s'affiche pas en production

1. Vérifiez que votre clé API est bien dans le fichier `.env` de production
2. Vérifiez que le fichier `.env` est bien déployé sur votre serveur
3. Vérifiez les restrictions dans Google Cloud Console
4. Vérifiez la console du navigateur (F12) pour les erreurs

## Notes importantes

- Les restrictions prennent quelques minutes à être appliquées
- Vous pouvez avoir plusieurs domaines dans les restrictions
- Pour le développement, gardez `localhost` dans les restrictions
- Pour la production, n'incluez que vos domaines réels pour la sécurité

