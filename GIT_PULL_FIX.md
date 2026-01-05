# Solution pour résoudre l'erreur Git Pull

## Problème
Les fichiers de cache Laravel dans `backend/storage/framework/cache/` causent un conflit lors du `git pull` et ont des permissions qui empêchent leur suppression.

## Solution recommandée : Utiliser git stash

Exécutez ces commandes dans l'ordre :

```bash
# 1. Sauvegarder temporairement les changements (même les fichiers de cache)
git stash

# 2. Faire le pull
git pull origin amél

# 3. Supprimer le stash car ce sont juste des fichiers de cache (pas besoin de les réappliquer)
git stash drop
```

## Alternative : Utiliser sudo (si vous avez les droits)

Si vous avez les droits sudo et préférez supprimer les fichiers :

```bash
# 1. Supprimer les fichiers de cache avec sudo
sudo rm -rf backend/storage/framework/cache/data/*

# 2. Corriger les permissions du dossier cache
sudo chown -R tfksservice:tfksservice backend/storage/framework/cache/

# 3. Faire le pull
git pull origin amél
```

## Solution avec git reset (RECOMMANDÉ si stash échoue)

```bash
# 1. Retirer les fichiers de cache du suivi Git (sans les supprimer physiquement)
git rm --cached backend/storage/framework/cache/data/52/ac/52acebe9de48b9434598fa65d2ec8d0e111e90b0
git rm --cached backend/storage/framework/cache/data/70/d5/70d5789fb8fa04f157e2f175d8e9158bc3d2b5c6

# 2. Faire le pull
git pull origin amél
```

## Solution alternative : Utiliser git reset --hard (ATTENTION : supprime tous les changements locaux)

```bash
# ⚠️ ATTENTION : Cette commande supprime TOUS les changements locaux non commités
# Assurez-vous d'avoir sauvegardé tout ce qui est important avant

# 1. Réinitialiser les fichiers de cache
git reset --hard HEAD

# 2. Faire le pull
git pull origin amél
```

## Solution avec sudo (si vous avez les droits root)

```bash
# 1. Supprimer les fichiers de cache avec sudo
sudo rm -rf backend/storage/framework/cache/data/*

# 2. Corriger les permissions du dossier cache
sudo chown -R tfksservice:tfksservice backend/storage/framework/cache/
sudo chmod -R 775 backend/storage/framework/cache/

# 3. Vérifier le statut Git
git status

# 4. Si Git montre encore des changements, les commiter ou les réinitialiser
# Option A : Commiter les suppressions (recommandé)
git add backend/storage/framework/cache/data/
git commit -m "Remove cache files from tracking"

# Option B : Forcer Git à ignorer ces changements
git checkout -- backend/storage/framework/cache/data/

# 5. Faire le pull
git pull origin amél
```

## Solution finale : Commiter les changements puis pull

Si rien d'autre ne fonctionne, commitez les changements :

```bash
# 1. Voir ce que Git considère comme modifié
git status

# 2. Ajouter tous les changements (y compris les suppressions de cache)
git add -A

# 3. Commiter
git commit -m "Remove cache files and prepare for pull"

# 4. Faire le pull
git pull origin amél

# 5. Résoudre les conflits si nécessaire
```

## Solution pour branches divergentes

Si Git indique que les branches ont divergé :

```bash
# 1. Configurer Git pour utiliser merge (recommandé)
git config pull.rebase false

# 2. Faire le pull avec merge
git pull origin amél

# 3. Si des conflits apparaissent, les résoudre puis :
git add .
git commit -m "Merge remote changes"
```

## Alternative : Utiliser rebase (pour un historique linéaire)

```bash
# 1. Configurer Git pour utiliser rebase
git config pull.rebase true

# 2. Faire le pull avec rebase
git pull origin amél

# 3. Si des conflits apparaissent, les résoudre puis :
git add .
git rebase --continue
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

