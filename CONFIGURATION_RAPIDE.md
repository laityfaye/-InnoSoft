# Configuration Rapide - Google Maps

## Étapes rapides pour configurer Google Maps

### 1. Obtenir une clé API (5 minutes)

1. Allez sur https://console.cloud.google.com/
2. Créez un nouveau projet (ou utilisez un existant)
3. Activez "Maps JavaScript API" dans la bibliothèque d'APIs
4. Créez une clé API dans "Identifiants"
5. **Copiez la clé** (vous ne pourrez plus la voir après)

### 2. Configurer dans le projet (2 minutes)

1. Dans le dossier `frontend`, créez un fichier `.env`
2. Ajoutez ce contenu (remplacez `VOTRE_CLE_API` par votre clé) :

```env
VITE_API_URL=http://localhost:8000/api
VITE_GOOGLE_MAPS_API_KEY=VOTRE_CLE_API
```

### 3. Redémarrer le serveur

```bash
# Arrêtez le serveur (Ctrl+C)
# Puis redémarrez :
cd frontend
npm run dev
```

### 4. Vérifier

Ouvrez la page de checkout - la carte devrait s'afficher !

---

## Guide détaillé

Pour un guide complet avec captures d'écran et dépannage, consultez `GUIDE_GOOGLE_MAPS.md`

## Important

- Le fichier `.env` ne doit **jamais** être commité dans Git
- La clé API est gratuite jusqu'à 200$ de crédit par mois (largement suffisant)
- Pour le développement, autorisez `localhost` dans les restrictions de la clé

