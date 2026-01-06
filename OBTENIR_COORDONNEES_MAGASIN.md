# Comment obtenir les coordonnées GPS exactes de votre magasin

## Méthode 1 : Depuis Google Maps (Recommandé)

### Sur ordinateur :

1. Allez sur [Google Maps](https://www.google.com/maps)
2. Recherchez votre adresse exacte (ex: "InnoSoft Creation, Thiès")
3. **Cliquez droit** sur le marqueur rouge qui indique votre adresse
4. Cliquez sur **"Coordonnées"** ou **"What's here?"**
5. Les coordonnées s'affichent en bas de l'écran (format: latitude, longitude)
6. **Copiez les deux nombres** (ex: 14.7886, -16.9261)

### Sur mobile :

1. Ouvrez l'application Google Maps
2. Recherchez votre adresse
3. **Appuyez longuement** sur l'emplacement exact de votre magasin
4. Les coordonnées s'affichent dans la barre de recherche en haut
5. **Copiez les coordonnées**

## Méthode 2 : Depuis le lien de partage Google Maps

Si vous avez un lien de partage Google Maps (comme `https://share.google/erNi7FbNEewPH3DlH`) :

1. Ouvrez le lien dans votre navigateur
2. Google Maps s'ouvre avec l'emplacement
3. **Cliquez droit** sur le marqueur
4. Cliquez sur **"Coordonnées"**
5. **Copiez les coordonnées**

## Méthode 3 : Utiliser l'URL de Google Maps

Si l'URL contient les coordonnées (format: `@latitude,longitude,zoom`) :

Exemple : `https://www.google.com/maps/@14.7886,-16.9261,15z`

Les coordonnées sont : **14.7886** (latitude) et **-16.9261** (longitude)

## Mettre à jour les coordonnées

### Dans le Frontend :

Modifiez le fichier `frontend/src/pages/Checkout.tsx` :

```typescript
const STORE_LOCATION = {
  latitude: 14.7886, // Remplacez par votre latitude
  longitude: -16.9261, // Remplacez par votre longitude
  name: 'InnoSoft Creation',
  address: 'Votre adresse complète',
}
```

### Dans le Backend :

Ajoutez dans votre fichier `.env` du backend :

```env
STORE_LATITUDE=14.7886
STORE_LONGITUDE=-16.9261
STORE_ADDRESS="Votre adresse complète, Thiès, Sénégal"
```

## Vérification

Après avoir mis à jour les coordonnées :

1. **Redémarrez le serveur de développement** (frontend)
2. Allez sur la page de checkout
3. Obtenez votre position
4. Vérifiez que :
   - La carte est centrée sur votre magasin
   - La distance affichée est correcte
   - Les marqueurs sont aux bons endroits

## Important

- Les coordonnées doivent être **très précises** pour un calcul de distance fiable
- Une différence de 0.01° peut représenter environ 1 km d'écart
- Utilisez au moins 4 décimales pour la précision (ex: 14.7886, pas 14.79)

## Coordonnées approximatives de Thiès

- **Centre-ville de Thiès** : ~14.7886, -16.9261
- **Gare de Thiès** : ~14.7900, -16.9250
- **Aéroport de Thiès** : ~14.8000, -16.9000

**Note** : Ces coordonnées sont approximatives. Utilisez la méthode 1 pour obtenir les coordonnées exactes de votre adresse.

