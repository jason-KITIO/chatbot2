# 🚀 Guide de Démarrage Simple (Sans PowerShell)

## ⚠️ Situation Actuelle

- ✅ **Backend Python** : Configuré et prêt
- ❌ **Node.js/npm** : Non installé (nécessaire pour le frontend)
- ⚠️ **Scripts PowerShell** : Bloqués par la politique de sécurité

## 🎯 Solution Rapide : Utiliser les fichiers .bat

### Étape 1 : Démarrer le Backend (Terminal 1)

**Option A : Utiliser le script .bat**
```cmd
cd F:\LTWEBA\chatbot2\backend
start_server.bat
```

**Option B : Commande manuelle**
```cmd
cd F:\LTWEBA\chatbot2\backend
venv\Scripts\python.exe main.py
```

✅ Le serveur backend devrait démarrer sur `http://localhost:8000`

---

### Étape 2 : Installer Node.js (Une seule fois)

1. **Téléchargez Node.js** :
   - Allez sur : **https://nodejs.org/**
   - Téléchargez la version **LTS** (Long Term Support)
   - Exécutez l'installateur et suivez les instructions

2. **Vérifiez l'installation** :
   ```cmd
   node --version
   npm --version
   ```

3. **Installez pnpm** (optionnel mais recommandé) :
   ```cmd
   npm install -g pnpm
   ```

4. **Fermez et rouvrez votre terminal** pour que les changements prennent effet

---

### Étape 3 : Démarrer le Frontend (Terminal 2)

Une fois Node.js installé :

```cmd
cd F:\LTWEBA\chatbot2

REM Installer les dépendances (première fois seulement)
pnpm install

REM Démarrer le serveur de développement
pnpm dev
```

Ou si vous n'avez pas pnpm :
```cmd
npm install
npm run dev
```

✅ Le frontend devrait démarrer sur `http://localhost:3000`

---

### Étape 4 : Tester le Chatbot

1. Ouvrez votre navigateur : `http://localhost:3000/chatbot`
2. Cliquez sur "Commencer"
3. Posez une question sur les formations !

---

## 🐛 Dépannage

### Le backend ne démarre pas

Vérifiez que vous êtes dans le bon répertoire :
```cmd
cd F:\LTWEBA\chatbot2\backend
dir
```
Vous devriez voir `main.py`, `venv`, etc.

### Node.js toujours non reconnu après installation

1. Fermez **complètement** votre terminal
2. Rouvrez-le
3. Vérifiez avec `node --version`

Si ça ne fonctionne toujours pas, redémarrez votre ordinateur.

### Erreur "pnpm n'est pas reconnu"

Utilisez `npm` à la place :
```cmd
npm install
npm run dev
```

---

## 📝 Résumé des Commandes

### Backend
```cmd
cd F:\LTWEBA\chatbot2\backend
venv\Scripts\python.exe main.py
```

### Frontend (après installation de Node.js)
```cmd
cd F:\LTWEBA\chatbot2
pnpm install    (ou npm install)
pnpm dev        (ou npm run dev)
```

---

**Note** : Pour le moment, vous pouvez tester uniquement le backend en ouvrant `http://localhost:8000/docs` dans votre navigateur, même sans Node.js installé ! 🎉


