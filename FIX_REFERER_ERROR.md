# 🔧 Correction de l'erreur RefererNotAllowedMapError

## Problème

Vous voyez cette erreur dans la console :
```
Google Maps JavaScript API error: RefererNotAllowedMapError
Your site URL to be authorized: http://localhost:3000/checkout
```

## Solution rapide (2 minutes)

### Étape 1 : Ouvrir Google Cloud Console

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Sélectionnez votre projet
3. Menu latéral → **"APIs et services"** → **"Identifiants"**

### Étape 2 : Modifier votre clé API

1. Cliquez sur votre clé API : `AIzaSyDl_uQC8fuD0RORvcGYAVAwKMD9xwgLw1g`

### Étape 3 : Ajouter localhost aux restrictions

1. Dans **"Restrictions d'application"**, cliquez sur **"Restreindre la clé"**
2. Sélectionnez **"Applications Web"**
3. Dans **"Référents de sites Web autorisés"**, ajoutez :

```
http://localhost:*
http://localhost:3000/*
http://localhost:5173/*
https://innosft.com/*
http://innosft.com/*
https://www.innosft.com/*
http://www.innosft.com/*
```

**Important :**
- `http://localhost:*` autorise tous les ports (recommandé)
- `http://localhost:3000/*` autorise spécifiquement le port 3000
- `http://localhost:5173/*` autorise le port 5173 (port par défaut de Vite)

### Étape 4 : Enregistrer

1. Cliquez sur **"Enregistrer"** en bas de la page
2. **Attendez 5-10 minutes** pour que les changements soient propagés

### Étape 5 : Tester

1. Videz le cache de votre navigateur : `Ctrl+Shift+R` (Windows) ou `Cmd+Shift+R` (Mac)
2. Rechargez la page de checkout
3. L'erreur devrait disparaître

## Si ça ne fonctionne toujours pas

1. **Vérifiez que vous avez bien enregistré** les changements dans Google Cloud Console
2. **Attendez un peu plus** (parfois jusqu'à 15 minutes)
3. **Vérifiez que vous n'avez pas de restrictions trop strictes** - utilisez `http://localhost:*` pour autoriser tous les ports
4. **Testez dans un navigateur en navigation privée** pour éviter les problèmes de cache

## Notes

- Les restrictions prennent du temps à être propagées (5-15 minutes)
- Vous pouvez avoir plusieurs domaines dans les restrictions
- Pour le développement, `http://localhost:*` est la solution la plus simple

