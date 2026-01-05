# Solution pour résoudre l'erreur Git Pull

## Problème
Les fichiers de cache Laravel dans `backend/storage/framework/cache/` causent un conflit lors du `git pull`.

## Solution immédiate (sur le serveur)

Exécutez ces commandes dans l'ordre :

```bash
# 1. Supprimer les fichiers de cache qui causent le conflit
rm -rf backend/storage/framework/cache/data/*

# 2. Faire le pull
git pull origin amél

# 3. Vérifier que tout est à jour
git status
```

## Alternative : Utiliser git stash

Si vous préférez sauvegarder les changements locaux (même si ce sont juste des fichiers de cache) :

```bash
# 1. Sauvegarder temporairement les changements
git stash

# 2. Faire le pull
git pull origin amél

# 3. Appliquer les changements sauvegardés (optionnel, généralement pas nécessaire pour le cache)
git stash pop
```

## Prévention future

Le fichier `.gitignore` a été mis à jour pour ignorer les fichiers de cache Laravel. 

**Important :** Si ces fichiers sont déjà suivis par Git, vous devez les retirer du suivi :

```bash
# Sur le serveur, après le pull réussi
git rm -r --cached backend/storage/framework/cache/data/
git commit -m "Remove cache files from git tracking"
git push origin amél
```

## Note

Les fichiers de cache Laravel sont générés automatiquement et ne doivent jamais être versionnés. Ils seront recréés automatiquement par Laravel.

