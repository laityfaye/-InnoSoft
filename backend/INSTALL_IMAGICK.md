# Installation de l'extension Imagick pour PNG

Pour générer des QR codes en format PNG haute résolution, l'extension PHP Imagick est nécessaire.

## Installation

### Sur Ubuntu/Debian :
```bash
sudo apt-get update
sudo apt-get install php-imagick
sudo systemctl restart apache2  # ou nginx, ou php-fpm selon votre configuration
```

### Sur CentOS/RHEL :
```bash
sudo yum install php-imagick
sudo systemctl restart httpd  # ou nginx, ou php-fpm
```

### Sur Windows :

1. Téléchargez la DLL appropriée pour votre version de PHP depuis [PECL](https://pecl.php.net/package/imagick)
2. Extrayez la DLL dans le répertoire `ext` de votre installation PHP
3. Ajoutez cette ligne dans votre fichier `php.ini` :
   ```
   extension=imagick
   ```
4. Redémarrez votre serveur web (Apache/IIS)

## Vérification

Après l'installation, vérifiez que l'extension est bien chargée :

```bash
php -m | grep imagick
```

Ou créez un fichier `phpinfo.php` et recherchez "imagick" dans la sortie.

## Alternative : Format SVG

Si vous ne pouvez pas installer Imagick, le système génère automatiquement un fichier SVG qui :
- ✅ Est vectoriel (qualité parfaite à n'importe quelle taille)
- ✅ Peut être converti en PNG avec des outils en ligne (CloudConvert, Convertio, etc.)
- ✅ Est idéal pour l'impression professionnelle
- ✅ Fonctionne sans extension supplémentaire

## Conversion SVG vers PNG (si nécessaire)

Si vous avez téléchargé un SVG et souhaitez le convertir en PNG :

1. **Outils en ligne :**
   - [CloudConvert](https://cloudconvert.com/svg-to-png)
   - [Convertio](https://convertio.co/svg-png/)
   - [Online-Convert](https://image.online-convert.com/convert-to-png)

2. **Logiciels :**
   - Adobe Illustrator
   - Inkscape (gratuit)
   - GIMP (gratuit)

3. **En ligne de commande (si ImageMagick est installé) :**
   ```bash
   convert input.svg -resize 2000x2000 output.png
   ```

