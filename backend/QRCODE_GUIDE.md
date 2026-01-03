# 📱 Guide du Code QR - Campagne Marketing

Ce guide explique comment utiliser le système de génération de code QR pour votre campagne marketing.

## 🎯 Utilisation

Le code QR généré redirige automatiquement vers votre plateforme (`https://innosft.com`) pour permettre aux clients de vous découvrir facilement.

## 🔗 Endpoints Disponibles

### 1. Générer un QR Code PNG (Image)
**URL :** `GET /api/qrcode`

Affiche directement le QR code en format PNG (500x500 pixels).

**Exemple d'utilisation :**
```
https://api.innosft.com/api/qrcode
```

Ou en local :
```
http://localhost:8000/api/qrcode
```

### 2. Générer un QR Code SVG (Vectoriel)
**URL :** `GET /api/qrcode/svg`

Génère un QR code en format SVG (vectoriel, plus léger et scalable).

**Exemple d'utilisation :**
```
https://api.innosft.com/api/qrcode/svg
```

### 3. Télécharger le QR Code (Haute Résolution)
**URL :** `GET /api/qrcode/download`

Télécharge le QR code en haute résolution (2000x2000 pixels) pour l'impression.

- **Format PNG** : Si Imagick est disponible (haute résolution)
- **Format SVG** : Si Imagick n'est pas disponible (vectoriel, qualité parfaite)

**Exemple d'utilisation :**
```
https://api.innosft.com/api/qrcode/download
```

**Note :** Le SVG est vectoriel, ce qui signifie qu'il peut être agrandi à n'importe quelle taille sans perte de qualité - parfait pour l'impression professionnelle !

### 4. Informations du QR Code
**URL :** `GET /api/qrcode/info`

Retourne les informations JSON sur le QR code (URL cible, liens vers les différents formats).

**Exemple de réponse :**
```json
{
  "url": "https://innosft.com",
  "qr_code_png": "https://api.innosft.com/api/qrcode",
  "qr_code_svg": "https://api.innosft.com/api/qrcode/svg",
  "download_png": "https://api.innosft.com/api/qrcode/download"
}
```

## 🔧 Configuration

Le QR code redirige automatiquement vers l'URL définie dans votre fichier `.env` :

```env
FRONTEND_URL=https://innosft.com
```

Si `FRONTEND_URL` n'est pas défini, il utilise `APP_URL`. Si aucun des deux n'est défini, il utilise par défaut `https://innosft.com`.

## 📋 Cas d'Usage pour la Campagne

### 1. Intégration dans des Flyers
```html
<img src="https://api.innosft.com/api/qrcode" alt="Scannez pour découvrir InnoSoft" />
```

### 2. Intégration dans des Emails
```html
<a href="https://innosft.com">
  <img src="https://api.innosft.com/api/qrcode" alt="Découvrez InnoSoft Creation" />
</a>
```

### 3. Affichage sur Site Web
```html
<div class="qr-code">
  <img src="https://api.innosft.com/api/qrcode" alt="QR Code - InnoSoft Creation" />
  <p>Scannez pour découvrir notre plateforme</p>
</div>
```

### 4. Téléchargement pour l'Impression (Haute Résolution)
Téléchargez le QR code en haute résolution (2000x2000px) pour une qualité d'impression professionnelle :
```
https://api.innosft.com/api/qrcode/download
```

**Formats disponibles :**
- **PNG 2000x2000px** : Si Imagick est installé (haute résolution raster)
- **SVG 2000x2000px** : Format vectoriel (recommandé pour l'impression - qualité infinie)

**Avantages du SVG pour l'impression :**
- ✅ Qualité parfaite à n'importe quelle taille d'impression
- ✅ Fichier léger
- ✅ Pas de pixellisation même en grand format
- ✅ Idéal pour les flyers, brochures, affiches grand format

## ✨ Caractéristiques

- **Taille affichage :** 500x500 pixels
- **Taille téléchargement :** 2000x2000 pixels (haute résolution pour l'impression)
- **Correction d'erreur :** Niveau H (High) - permet la lecture même si le QR code est partiellement endommagé
- **Format :** PNG (si Imagick disponible) ou SVG (toujours disponible, recommandé)
- **URL cible :** Configuration via variable d'environnement

## 🚀 Test Rapide

1. Démarrez le serveur Laravel :
```bash
cd backend
php artisan serve
```

2. Ouvrez votre navigateur et accédez à :
```
http://localhost:8000/api/qrcode
```

3. Scannez le QR code avec votre téléphone - il devrait rediriger vers votre plateforme !

## 📱 Test du QR Code

Pour tester que le QR code fonctionne correctement :

1. **Générer le QR code :** Ouvrez `http://localhost:8000/api/qrcode` dans votre navigateur
2. **Scanner :** Utilisez l'application caméra de votre téléphone ou une application de scan QR
3. **Vérifier :** Le scan devrait ouvrir votre plateforme (`https://innosft.com`)

## 🎨 Personnalisation (Futur)

Pour l'instant, le QR code utilise les paramètres par défaut. Des options de personnalisation (couleurs, logo au centre, etc.) pourront être ajoutées ultérieurement si nécessaire.

---

**Note :** Assurez-vous que la variable `FRONTEND_URL` dans votre `.env` pointe vers l'URL correcte de votre plateforme en production.

