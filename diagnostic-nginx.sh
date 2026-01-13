#!/bin/bash
# Script de diagnostic pour trouver les configurations Nginx en conflit

echo "=== Recherche des configurations pour api.innosft.com ==="
echo ""
echo "Dans /etc/nginx/sites-enabled/:"
sudo grep -r "api.innosft.com" /etc/nginx/sites-enabled/ 2>/dev/null | grep -v "^Binary"
echo ""
echo "Dans /etc/nginx/sites-available/:"
sudo grep -r "api.innosft.com" /etc/nginx/sites-available/ 2>/dev/null | grep -v "^Binary"
echo ""
echo "Dans /etc/nginx/conf.d/:"
sudo grep -r "api.innosft.com" /etc/nginx/conf.d/ 2>/dev/null | grep -v "^Binary"
echo ""
echo "=== Fichiers de configuration actifs ==="
ls -la /etc/nginx/sites-enabled/ | grep -E "\.(conf|site)"
echo ""
echo "=== Test de la configuration Nginx ==="
sudo nginx -T 2>&1 | grep -A 50 "server_name api.innosft.com"

