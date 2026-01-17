# 🚀 Guide de Démarrage Rapide - Résolution des Problèmes

## ❌ Problème 1 : Erreur npm "exécution de scripts est désactivée"

**Erreur** : `Impossible de charger le fichier C:\Program Files\nodejs\npm.ps1, car l'exécution de scripts est désactivée`

### Solution 1 : Utiliser pnpm (Recommandé)

Le projet utilise **pnpm**, pas npm. Essayez :

```powershell
pnpm dev
```

### Solution 2 : Si pnpm n'est pas installé

Installez pnpm d'abord :

```powershell
npm install -g pnpm
```

Ou avec PowerShell (si npm fonctionne ailleurs) :

```powershell
iwr https://get.pnpm.io/install.ps1 -useb | iex
```

### Solution 3 : Changer la politique d'exécution PowerShell (si nécessaire)

Si vous devez absolument utiliser npm, ouvrez PowerShell **en tant qu'administrateur** et exécutez :

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Puis relancez `npm dev`.

---

## ❌ Problème 2 : Erreur "venv\Scripts\python.exe" - Mauvais répertoire

**Erreur** : `Le module «venv» n'a pas pu être chargé`

**Cause** : Vous êtes dans le mauvais répertoire (probablement à la racine du projet au lieu de `backend/`)

### Solution : Aller dans le bon répertoire

```powershell
# D'abord, assurez-vous d'être à la racine du projet
cd F:\LTWEBA\chatbot2

# Ensuite, allez dans le dossier backend
cd backend

# Maintenant vous pouvez démarrer le serveur
venv\Scripts\python.exe main.py
```

Ou utilisez le script que j'ai créé :

```powershell
cd F:\LTWEBA\chatbot2\backend
.\start_server.ps1
```

---

## ✅ Démarrage Complet (Étapes)

### Étape 1 : Démarrer le Backend (Terminal 1)

```powershell
# Ouvrir PowerShell et naviguer vers le backend
cd F:\LTWEBA\chatbot2\backend

# Démarrer le serveur
venv\Scripts\python.exe main.py
```

Vous devriez voir :
```
✅ Formations chargées depuis: data/formations.txt
INFO:     Started server process [...]
INFO:     Uvicorn running on http://0.0.0.0:8000
```

✅ **Laissez ce terminal ouvert !** Le serveur doit continuer de tourner.

---

### Étape 2 : Vérifier que le Backend fonctionne

Dans votre navigateur, ouvrez :
- `http://localhost:8000/docs` (Documentation de l'API)
- `http://localhost:8000/api/health` (Vérification de l'état)

Vous devriez voir une réponse JSON indiquant que tout fonctionne.

---

### Étape 3 : Démarrer le Frontend (Terminal 2)

Ouvrez un **nouveau terminal PowerShell** et :

```powershell
# Aller à la racine du projet
cd F:\LTWEBA\chatbot2

# Installer les dépendances (si pas encore fait)
pnpm install

# Démarrer le serveur de développement
pnpm dev
```

Si `pnpm` n'est pas disponible, essayez :

```powershell
# Installer pnpm d'abord
npm install -g pnpm

# Puis relancer
pnpm install
pnpm dev
```

Vous devriez voir :
```
  ▲ Next.js 16.0.8
  - Local:        http://localhost:3000
```

---

### Étape 4 : Tester le Chatbot

1. Ouvrez votre navigateur sur : `http://localhost:3000/chatbot`
2. Cliquez sur "Commencer"
3. Le chatbot devrait se connecter au backend et vous accueillir !

---

## 🔧 Commandes Utiles

### Backend

```powershell
# Démarrer le serveur
cd F:\LTWEBA\chatbot2\backend
venv\Scripts\python.exe main.py

# Ou avec le script
.\start_server.ps1

# Arrêter le serveur
# Appuyez sur CTRL+C dans le terminal où il tourne
```

### Frontend

```powershell
# Depuis la racine du projet
pnpm dev          # Démarrer le serveur de développement
pnpm build        # Construire pour la production
pnpm start        # Démarrer en mode production
```

---

## 🐛 Dépannage

### Le backend ne démarre pas

1. Vérifiez que vous êtes dans `backend/` : `Get-Location`
2. Vérifiez que l'environnement virtuel existe : `Test-Path venv`
3. Vérifiez que `.env` existe et contient `GEMINI_API_KEY`
4. Vérifiez les logs d'erreur dans le terminal

### Le frontend ne se connecte pas au backend

1. Vérifiez que le backend tourne sur `http://localhost:8000`
2. Vérifiez `next.config.ts` - `NEXT_PUBLIC_API_URL` devrait être `http://localhost:8000`
3. Ouvrez la console du navigateur (F12) pour voir les erreurs

### Erreur CORS

Si vous voyez des erreurs CORS, vérifiez que dans `backend/main.py`, la ligne CORS inclut :
```python
allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"]
```

---

## 📝 Résumé des Ports

- **Backend** : `http://localhost:8000`
- **Frontend** : `http://localhost:3000`
- **Documentation API** : `http://localhost:8000/docs`

---

**Bon développement ! 🎓**


