# Extraire les coordonnées depuis le lien Google Maps

## Votre lien de partage
https://share.google/erNi7FbNEewPH3DlH

## Méthode pour obtenir les coordonnées

### Étape 1 : Ouvrir le lien
1. Ouvrez le lien dans votre navigateur : https://share.google/erNi7FbNEewPH3DlH
2. Google Maps s'ouvrira avec l'emplacement

### Étape 2 : Obtenir les coordonnées
1. **Cliquez droit** sur le marqueur rouge (ou l'emplacement exact)
2. Cliquez sur **"Coordonnées"** ou **"What's here?"**
3. Les coordonnées s'affichent en bas de l'écran ou dans la barre de recherche
4. **Copiez les deux nombres** (format: latitude, longitude)

### Étape 3 : Alternative - Depuis l'URL
Si l'URL complète contient les coordonnées (après redirection), elle ressemblera à :
```
https://www.google.com/maps/@14.XXXXX,-16.XXXXX,15z
```

Les coordonnées sont les deux nombres après le `@` :
- Premier nombre = Latitude
- Deuxième nombre = Longitude

## Mettre à jour les coordonnées

Une fois que vous avez les coordonnées exactes, mettez-les à jour dans :

### Frontend : `frontend/src/pages/Checkout.tsx`
```typescript
const STORE_LOCATION = {
  latitude: VOTRE_LATITUDE, // Exemple: 14.7886
  longitude: VOTRE_LONGITUDE, // Exemple: -16.9261
  name: 'InnoSoft Creation',
  address: 'Votre adresse complète',
}
```

### Backend : Fichier `.env`
```env
STORE_LATITUDE=VOTRE_LATITUDE
STORE_LONGITUDE=VOTRE_LONGITUDE
STORE_ADDRESS="Votre adresse complète, Thiès, Sénégal"
```

## Vérification

Après avoir mis à jour :
1. Redémarrez le serveur frontend
2. Rechargez la page de checkout
3. Cliquez sur "Obtenir ma position"
4. La ligne devrait maintenant être entre votre position et le magasin (tous les deux à Thiès)

