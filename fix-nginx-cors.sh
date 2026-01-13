#!/bin/bash
# Script pour corriger la configuration CORS Nginx

echo "=== Étape 1: Sauvegarder et supprimer le fichier .bak de sites-enabled ==="
if [ -f "/etc/nginx/sites-enabled/api.innosft.com.bak" ]; then
    echo "Déplacement du fichier .bak hors de sites-enabled..."
    sudo mv /etc/nginx/sites-enabled/api.innosft.com.bak /tmp/api.innosft.com.bak.backup
    echo "✓ Fichier .bak déplacé"
else
    echo "Aucun fichier .bak trouvé dans sites-enabled"
fi

echo ""
echo "=== Étape 2: Vérifier la configuration actuelle ==="
echo "Fichier principal: /etc/nginx/sites-available/api.innosft.com"
echo ""
echo "La configuration doit être modifiée manuellement."
echo "Option 1: Laisser Laravel gérer les CORS (recommandé)"
echo "Option 2: Utiliser une valeur fixe dans Nginx"

