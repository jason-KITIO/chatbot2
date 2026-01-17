# 🔀 Guide de Workflow Git pour le Backend Gemini

## 📍 Situation Actuelle

Vous êtes maintenant sur la branche **`feature/backend-gemini`** qui contient toutes les modifications pour intégrer le backend Python avec Gemini.

## ✅ Fichiers Modifiés/Créés

- ✅ `backend/` - Tout le code Python (FastAPI + Gemini)
- ✅ `hooks/useChatbot.ts` - Modifié pour utiliser l'API backend
- ✅ `services/apiService.ts` - Nouveau service pour communiquer avec le backend
- ✅ `next.config.ts` - Configuration pour l'URL de l'API
- ✅ `README_BACKEND.md` - Documentation complète

## 🚀 Prochaines Étapes

### 1. Tester le Backend (Recommandé avant de commit)

```bash
# Dans le dossier backend
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt

# Créer le fichier .env avec votre GEMINI_API_KEY
copy env.example .env
# Éditer .env et ajouter votre clé

# Démarrer le serveur
python main.py
```

### 2. Tester le Frontend

```bash
# Dans un autre terminal, à la racine
pnpm dev
```

### 3. Si tout fonctionne : Commiter les changements

```bash
git commit -m "feat: Ajout backend Python avec intégration Gemini pour chatbot d'orientation

- Backend FastAPI avec endpoints pour le chatbot
- Intégration Google Gemini 1.5 Pro
- Service de gestion de contexte avec chargement automatique des formations
- Frontend modifié pour communiquer avec le backend
- Documentation complète ajoutée"
```

### 4. Pousser la branche sur le remote

```bash
git push -u origin feature/backend-gemini
```

### 5. Si tout est OK : Merger dans master

```bash
# Revenir sur master
git checkout master

# Merger la branche
git merge feature/backend-gemini

# Pousser les changements
git push origin master
```

## ⚠️ Si Problème : Revenir en Arrière

### Option 1 : Annuler les modifications (sans commit)
```bash
# Revenir sur master
git checkout master

# Supprimer la branche (les modifications seront perdues si non commitées)
git branch -D feature/backend-gemini
```

### Option 2 : Garder la branche mais revenir à master
```bash
# Revenir sur master (les modifications restent sur la branche)
git checkout master
```

### Option 3 : Annuler un commit déjà fait
```bash
# Revenir au commit précédent (garder les fichiers modifiés)
git reset --soft HEAD~1

# Ou revenir complètement (perdre les modifications)
git reset --hard HEAD~1
```

## 📋 Commandes Utiles

```bash
# Voir les différences avec master
git diff master

# Voir l'historique des commits
git log --oneline --graph --all

# Voir les branches
git branch -a

# Renommer la branche actuelle
git branch -m nouvelle-nom-branche
```

## 🎯 Workflow Recommandé

1. ✅ **Tester** le backend et frontend
2. ✅ **Commit** les changements avec un message descriptif
3. ✅ **Push** la branche sur le remote
4. ✅ **Tester** en production/staging si possible
5. ✅ **Merge** dans master si tout est OK
6. ✅ **Tag** une version si nécessaire

---

**Bonne pratique** : Ne mergez jamais directement dans master sans avoir testé sur une branche de développement ! 🛡️

