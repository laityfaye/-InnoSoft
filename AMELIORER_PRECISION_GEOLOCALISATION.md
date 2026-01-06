# Améliorer la précision de la géolocalisation

## Problème

Quand vous cliquez sur "Obtenir ma position", le navigateur utilise parfois une position approximative basée sur votre adresse IP (qui peut pointer vers Dakar) au lieu de la position GPS précise de votre appareil (Thiès).

## Solutions

### 1. Activer le GPS sur votre appareil

#### Sur téléphone/tablette :
- **Android** : Paramètres → Localisation → Activez "Localisation" et "Améliorer la précision"
- **iPhone/iPad** : Réglages → Confidentialité → Services de localisation → Activez "Services de localisation"

#### Sur ordinateur :
- **Windows** : Paramètres → Confidentialité → Localisation → Activez "Service de localisation"
- **Mac** : Préférences Système → Confidentialité → Services de localisation → Activez "Services de localisation"

### 2. Autoriser la géolocalisation dans le navigateur

1. **Chrome/Edge** :
   - Cliquez sur l'icône de cadenas dans la barre d'adresse
   - Sélectionnez "Autoriser" pour la localisation
   - Cochez "Utiliser la localisation précise" si disponible

2. **Firefox** :
   - Cliquez sur l'icône de cadenas → Autorisations
   - Localisation → Autoriser
   - Cochez "Utiliser la localisation précise"

3. **Safari** :
   - Safari → Préférences → Sites Web → Localisation
   - Autorisez pour votre site

### 3. Vérifier la précision dans la console

J'ai ajouté des logs de debug. Après avoir cliqué sur "Obtenir ma position" :

1. Ouvrez la **console du navigateur** (F12)
2. Regardez les messages :
   - **📍 Position du client** : Vos coordonnées GPS
   - **accuracy** : La précision en mètres
   - **source** : GPS ou Réseau/IP

**Si la précision est > 1000 mètres**, cela signifie que le GPS n'est pas utilisé et que la position est basée sur l'adresse IP.

### 4. Forcer l'utilisation du GPS

J'ai déjà amélioré le code pour :
- ✅ Forcer `enableHighAccuracy: true` (demande le GPS)
- ✅ Désactiver le cache (`maximumAge: 0`) - toujours obtenir une nouvelle position
- ✅ Augmenter le timeout à 20 secondes pour laisser le temps au GPS

### 5. Vérifier que vous êtes à l'extérieur

Le GPS fonctionne mieux :
- ✅ À l'extérieur
- ✅ Avec une vue dégagée du ciel
- ❌ Moins bien à l'intérieur (les murs bloquent le signal)

### 6. Utiliser votre adresse si le GPS ne fonctionne pas

Si le GPS ne donne pas une position précise, vous pouvez :
1. Remplir votre **adresse de livraison** dans le formulaire
2. Cliquer sur **"Utiliser mon adresse"**
3. Le système géocodera votre adresse pour obtenir les coordonnées exactes

## Vérification

Après avoir activé le GPS :

1. **Redémarrez le navigateur** (fermez et rouvrez)
2. Allez sur la page de checkout
3. Cliquez sur **"Obtenir ma position"**
4. Dans la console (F12), vérifiez :
   - La précision devrait être < 100 mètres (idéalement < 50 mètres)
   - La source devrait être "GPS"
   - Les coordonnées devraient correspondre à votre position réelle à Thiès

## Si le problème persiste

1. **Vérifiez les coordonnées du magasin** - Assurez-vous qu'elles sont correctes (voir `CORRIGER_COORDONNEES_MAGASIN.md`)
2. **Testez sur un autre appareil** - Pour voir si c'est un problème d'appareil
3. **Testez sur mobile** - Les téléphones ont généralement un GPS plus précis
4. **Utilisez l'adresse de livraison** - Comme solution de secours

## Notes importantes

- La première fois, le GPS peut prendre 10-20 secondes pour se verrouiller
- Le GPS consomme plus de batterie mais donne une position beaucoup plus précise
- Sur ordinateur, le GPS peut être moins précis que sur mobile
- Si vous êtes à l'intérieur, la position peut être basée sur le Wi-Fi ou l'adresse IP (moins précis)

