# Configuration de la Livraison

Ce document explique comment configurer la fonctionnalité de livraison avec géolocalisation.

## Configuration Backend

### 1. Coordonnées du magasin

Modifiez le fichier `.env` du backend pour ajouter les coordonnées GPS de votre magasin :

```env
STORE_NAME="InnoSoft Creation"
STORE_ADDRESS="Votre adresse complète"
STORE_LATITUDE=14.6928
STORE_LONGITUDE=-16.9250
STORE_GOOGLE_MAPS_URL="https://share.google/erNi7FbNEewPH3DlH"
DELIVERY_FEE_PER_KM=250
```

**Comment obtenir les coordonnées GPS :**
1. Ouvrez Google Maps et recherchez votre adresse
2. Cliquez droit sur le marqueur et sélectionnez les coordonnées
3. Copiez la latitude et la longitude dans votre fichier `.env`

### 2. Frais de livraison

Le coût par kilomètre est configurable via la variable `DELIVERY_FEE_PER_KM` (par défaut 250 FCFA/km).

## Configuration Frontend

### 1. Clé API Google Maps (Optionnel)

> **Note importante :** La clé API Google Maps est **optionnelle**. Si elle n'est pas configurée :
> - La géolocalisation fonctionnera toujours
> - Le calcul de distance fonctionnera toujours
> - Seule l'affichage de la carte sera désactivé

Pour activer l'affichage de la carte, ajoutez votre clé API Google Maps dans le fichier `.env` du frontend :

```env
VITE_GOOGLE_MAPS_API_KEY=votre_cle_api_google_maps
```

**Comment obtenir une clé API Google Maps :**
1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Activez l'API "Maps JavaScript API"
4. Créez des identifiants (clé API)
5. Restreignez la clé API pour la sécurité (optionnel mais recommandé)

**Créer le fichier .env dans le dossier frontend :**
```bash
cd frontend
# Créez un fichier .env avec le contenu suivant :
# VITE_API_URL=http://localhost:8000/api
# VITE_GOOGLE_MAPS_API_KEY=votre_cle_api_google_maps
```

Ou créez manuellement le fichier `frontend/.env` avec :
```env
VITE_API_URL=http://localhost:8000/api
VITE_GOOGLE_MAPS_API_KEY=votre_cle_api_google_maps
```

### 2. Coordonnées du magasin dans le frontend

Modifiez le fichier `frontend/src/pages/Checkout.tsx` pour mettre à jour les coordonnées du magasin :

```typescript
const STORE_LOCATION = {
  latitude: 14.6928, // Remplacez par votre latitude
  longitude: -16.9250, // Remplacez par votre longitude
  name: 'InnoSoft Creation',
  address: 'Votre adresse',
}
```

## Fonctionnalités

### Retrait sur place
- Le client peut choisir de récupérer sa commande directement au magasin
- Aucun frais supplémentaire

### Livraison à domicile
- Le client doit autoriser l'accès à sa géolocalisation
- La distance entre le client et le magasin est calculée automatiquement
- Les frais de livraison sont calculés : distance (km) × 250 FCFA
- La carte Google Maps affiche le magasin, la position du client et la distance

## Migration de la base de données

Les nouveaux champs ont été ajoutés à la table `orders` :
- `delivery_type` : 'pickup' ou 'delivery'
- `customer_latitude` : Latitude du client
- `customer_longitude` : Longitude du client
- `store_latitude` : Latitude du magasin
- `store_longitude` : Longitude du magasin
- `distance` : Distance en kilomètres
- `delivery_fee` : Frais de livraison en FCFA

La migration a été exécutée automatiquement. Si vous devez la réexécuter :

```bash
cd backend
php artisan migrate
```

## Notes importantes

1. **Géolocalisation** : Le client doit autoriser l'accès à sa position pour utiliser la livraison, ou peut utiliser son adresse de livraison
2. **Clé API Google Maps** : Optionnelle - Si non configurée, seule la carte ne s'affichera pas, mais toutes les autres fonctionnalités fonctionneront
3. **Coordonnées** : Vérifiez que les coordonnées du magasin sont correctes dans les deux fichiers (backend `.env` et frontend `Checkout.tsx`)
4. **Fonctionnement sans Google Maps** : Même sans clé API, les clients peuvent :
   - Utiliser la géolocalisation du navigateur
   - Calculer la distance et les frais de livraison
   - Choisir entre retrait et livraison

