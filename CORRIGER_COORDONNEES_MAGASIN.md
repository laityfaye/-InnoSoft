# 🔧 Corriger les coordonnées du magasin

## Problème actuel

Quand vous cliquez sur "Obtenir ma position", la carte trace une ligne entre Dakar et Thiès alors que vous êtes à Thiès. Cela signifie que les coordonnées du magasin ne sont pas correctes.

## Solution : Obtenir les coordonnées exactes

### Méthode 1 : Depuis votre lien Google Maps (Recommandé)

1. **Ouvrez votre lien** : https://share.google/erNi7FbNEewPH3DlH
2. Google Maps s'ouvre avec l'emplacement de votre magasin
3. **Cliquez droit** sur le marqueur rouge (ou l'emplacement exact)
4. Cliquez sur **"Coordonnées"** ou **"What's here?"**
5. Les coordonnées s'affichent (format: `latitude, longitude`)
6. **Copiez les deux nombres** (ex: `14.7886, -16.9261`)

### Méthode 2 : Depuis l'URL complète

Après avoir ouvert le lien, regardez l'URL complète dans la barre d'adresse. Elle devrait ressembler à :
```
https://www.google.com/maps/@14.XXXXX,-16.XXXXX,15z
```

Les coordonnées sont les deux nombres après le `@` :
- **14.XXXXX** = Latitude
- **-16.XXXXX** = Longitude

## Mettre à jour les coordonnées

### Étape 1 : Frontend

Modifiez le fichier `frontend/src/pages/Checkout.tsx` (ligne ~42) :

```typescript
const STORE_LOCATION = {
  latitude: 14.XXXXX, // Remplacez par la latitude exacte de votre magasin
  longitude: -16.XXXXX, // Remplacez par la longitude exacte de votre magasin
  name: 'InnoSoft Creation',
  address: 'Votre adresse complète, Thiès, Sénégal',
}
```

### Étape 2 : Backend

Ajoutez dans votre fichier `.env` du backend :

```env
STORE_LATITUDE=14.XXXXX
STORE_LONGITUDE=-16.XXXXX
STORE_ADDRESS="Votre adresse complète, Thiès, Sénégal"
```

### Étape 3 : Redémarrer

1. **Redémarrez le serveur frontend** (arrêtez avec Ctrl+C puis relancez `npm run dev`)
2. **Rechargez la page** de checkout dans votre navigateur

## Vérification

1. Ouvrez la **console du navigateur** (F12)
2. Cliquez sur **"Obtenir ma position"**
3. Dans la console, vous verrez :
   - 📍 Position du client (votre position actuelle)
   - 🏪 Position du magasin (les coordonnées configurées)
   - 📏 Distance calculée

4. Vérifiez que :
   - Les deux positions sont proches (toutes les deux à Thiès)
   - La distance est correcte (quelques kilomètres, pas 55 km)
   - La carte affiche les deux points au bon endroit

## Exemple de coordonnées pour Thiès

- **Centre-ville de Thiès** : ~14.7886, -16.9261
- **Gare de Thiès** : ~14.7900, -16.9250

**⚠️ Important** : Utilisez les coordonnées **exactes** de votre adresse, pas des approximations !

## Si le problème persiste

1. Vérifiez que vous avez bien redémarré le serveur
2. Vérifiez la console du navigateur pour voir les coordonnées
3. Vérifiez que les coordonnées dans le code correspondent à celles de votre magasin
4. Essayez de vider le cache du navigateur (Ctrl+Shift+R)

