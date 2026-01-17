# 📦 Installation de Node.js (pour le Frontend)

## Pourquoi Node.js est nécessaire ?

Le frontend de votre chatbot utilise **Next.js**, qui nécessite **Node.js** et un gestionnaire de paquets (`npm` ou `pnpm`).

## 🚀 Installation de Node.js

### Option 1 : Installateur Officiel (Recommandé)

1. **Téléchargez Node.js** :
   - Allez sur : https://nodejs.org/
   - Téléchargez la version **LTS (Long Term Support)** - version recommandée
   - Choisissez le fichier `.msi` pour Windows

2. **Installez Node.js** :
   - Exécutez le fichier téléchargé
   - Suivez l'assistant d'installation (gardez les options par défaut)
   - ✅ Cochez "Automatically install the necessary tools"
   - L'installation inclut automatiquement `npm`

3. **Vérifiez l'installation** :
   ```powershell
   node --version
   npm --version
   ```
   Vous devriez voir les numéros de version.

### Option 2 : Via Chocolatey (si vous l'avez)

```powershell
choco install nodejs-lts
```

### Option 3 : Via winget (Windows 10/11)

```powershell
winget install OpenJS.NodeJS.LTS
```

## 📦 Installation de pnpm (Recommandé)

Une fois Node.js installé, installez `pnpm` (gestionnaire de paquets plus rapide) :

```powershell
npm install -g pnpm
```

Vérifiez l'installation :
```powershell
pnpm --version
```

## ✅ Après l'installation

1. **Fermez et rouvrez PowerShell** pour que les changements prennent effet

2. **Installez les dépendances du frontend** :
   ```powershell
   cd F:\LTWEBA\chatbot2
   pnpm install
   ```

3. **Démarrez le frontend** :
   ```powershell
   pnpm dev
   ```

## 🔧 Résolution du problème de politique PowerShell

Si vous avez toujours des erreurs "exécution de scripts est désactivée", vous avez deux options :

### Option A : Utiliser le fichier .bat à la place

Utilisez `start_all.bat` au lieu de `start_all.ps1` :
```cmd
start_all.bat
```

### Option B : Changer la politique PowerShell (une seule fois)

Ouvrez PowerShell **en tant qu'administrateur** et exécutez :

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Confirmez avec `Y` (Oui).

**Note** : Cela permet l'exécution de scripts PowerShell que vous créez localement, tout en bloquant les scripts non signés téléchargés depuis Internet (sécurité).

## 🎯 Prochaines Étapes

Une fois Node.js installé :

1. ✅ Backend : `cd backend; venv\Scripts\python.exe main.py`
2. ✅ Frontend : `cd F:\LTWEBA\chatbot2; pnpm dev`
3. ✅ Ouvrir : `http://localhost:3000/chatbot`

---

**Besoin d'aide ?** Consultez `GUIDE_DEMARRAGE.md` pour plus de détails.


