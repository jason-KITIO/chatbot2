# 🔑 Guide pour Obtenir votre Clé API Gemini

## Étape 1 : Créer un compte Google (si nécessaire)

Si vous n'avez pas de compte Google, créez-en un sur [accounts.google.com](https://accounts.google.com)

## Étape 2 : Accéder à Google AI Studio

1. Allez sur [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Connectez-vous avec votre compte Google

## Étape 3 : Créer une Clé API

1. Sur la page Google AI Studio, cliquez sur **"Get API Key"** ou **"Obtenir une clé API"**
2. Cliquez sur **"Create API Key"** (Créer une clé API)
3. Choisissez un projet Google Cloud (ou créez-en un nouveau)
4. Votre clé API sera générée et affichée

**⚠️ IMPORTANT** : Copiez la clé immédiatement car elle ne sera affichée qu'une seule fois !

## Étape 4 : Configurer le fichier .env

1. Dans le dossier `backend/`, copiez le fichier `env.example` vers `.env` :
   ```bash
   # Windows PowerShell
   Copy-Item env.example .env
   
   # Ou manuellement : renommez env.example en .env
   ```

2. Ouvrez le fichier `.env` avec un éditeur de texte

3. Remplacez `votre_cle_api_gemini_ici` par votre vraie clé API :
   ```
   GEMINI_API_KEY=AIzaSyD...votre_vraie_cle_ici...
   PORT=8000
   ```

4. **SAUVEGARDEZ** le fichier

## 🔒 Sécurité

- ❌ **NE COMMITEZ JAMAIS** le fichier `.env` dans Git (il est déjà dans `.gitignore`)
- ❌ **NE PARTAGEZ JAMAIS** votre clé API publiquement
- ✅ Gardez votre clé API privée et sécurisée
- ✅ Si vous partagez votre clé accidentellement, allez sur Google AI Studio et **révoquez-la** immédiatement

## ✅ Vérification

Pour vérifier que votre clé est bien configurée :

```bash
# Windows PowerShell (depuis le dossier backend)
Get-Content .env
```

Vous devriez voir :
```
GEMINI_API_KEY=AIzaSy...
PORT=8000
```

## 🎁 Quota Gratuit

Google Gemini offre un **quota gratuit généreux** pour commencer :
- Gemini 1.5 Flash : ~1500 requêtes/jour
- Gemini 1.5 Pro : ~50 requêtes/jour

C'est largement suffisant pour tester et développer ! 🎉

## ❓ Problèmes Courants

### "GEMINI_API_KEY n'est pas défini"
- Vérifiez que le fichier s'appelle bien `.env` (avec le point au début)
- Vérifiez qu'il est dans le dossier `backend/`
- Vérifiez qu'il n'y a pas d'espaces autour du `=`

### "Invalid API Key"
- Vérifiez que vous avez copié la clé complète (commence par `AIzaSy`)
- Vérifiez qu'il n'y a pas d'espaces ou de retours à la ligne dans la clé
- Vérifiez que la clé n'a pas été révoquée sur Google AI Studio

### La clé ne fonctionne pas
- Assurez-vous que l'API Gemini est activée pour votre projet Google Cloud
- Vérifiez votre quota sur [Google Cloud Console](https://console.cloud.google.com)


