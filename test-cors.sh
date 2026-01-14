#!/bin/bash
# Script de test pour vérifier la configuration CORS

echo "=== Test de la requête OPTIONS (preflight) ==="
echo ""

# Test de la requête OPTIONS vers l'endpoint de login
curl -X OPTIONS \
  -H "Origin: https://innosft.com" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type,Authorization" \
  -v \
  https://api.innosft.com/api/admin/login 2>&1 | grep -i "access-control"

echo ""
echo "=== Test de la requête POST ==="
echo ""

# Test d'une requête POST réelle (sans authentification, pour voir les en-têtes)
curl -X POST \
  -H "Origin: https://innosft.com" \
  -H "Content-Type: application/json" \
  -v \
  https://api.innosft.com/api/admin/login 2>&1 | grep -i "access-control"

echo ""
echo "=== Vérification de la configuration Nginx ==="
echo ""

# Vérifier quelle configuration est active
if [ -f /etc/nginx/sites-enabled/api.innosft.com ]; then
    echo "Configuration active: /etc/nginx/sites-enabled/api.innosft.com"
    echo "Vérification de la gestion OPTIONS:"
    grep -A 5 "if (\$request_method = 'OPTIONS')" /etc/nginx/sites-enabled/api.innosft.com 2>/dev/null || echo "Pas de gestion OPTIONS trouvée"
else
    echo "Fichier de configuration non trouvé dans sites-enabled"
fi

echo ""
echo "=== Vérification des logs Nginx (dernières lignes) ==="
sudo tail -20 /var/log/nginx/api-innosft-access.log 2>/dev/null || echo "Impossible de lire les logs"

