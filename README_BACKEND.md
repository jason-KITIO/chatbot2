# 🎓 Chatbot d'Orientation IUC - Guide Complet

Ce projet est un chatbot intelligent pour l'orientation académique à l'Université IUC, utilisant **Google Gemini** pour fournir des recommandations personnalisées de filières basées sur le profil des étudiants.

## 📋 Architecture

Le projet est composé de deux parties principales :

1. **Frontend** (Next.js + TypeScript) : Interface utilisateur moderne et réactive
2. **Backend** (Python + FastAPI + Gemini) : API intelligente avec modèle conversationnel

## 🚀 Installation et Configuration

### Prérequis

- **Node.js** 18+ et **pnpm** (ou npm/yarn)
- **Python** 3.9+
- **Clé API Google Gemini** (obtenez-la sur [Google AI Studio](https://makersuite.google.com/app/apikey))

### 1. Configuration du Backend Python

```bash
# Aller dans le dossier backend
cd backend

# Créer un environnement virtuel
python -m venv venv

# Activer l'environnement virtuel
# Sur Windows:
venv\Scripts\activate
# Sur Linux/Mac:
source venv/bin/activate

# Installer les dépendances
pip install -r requirements.txt

# Configurer la clé API
# Copier le fichier d'exemple
copy env.example .env  # Windows
# ou
cp env.example .env    # Linux/Mac

# Éditer .env et ajouter votre GEMINI_API_KEY
```

### 2. Ajouter votre Document de Formations

Placez votre document contenant toutes les formations IUC dans l'un de ces emplacements :

- `backend/data/formations.txt`
- `backend/data/formations.md`
- `backend/data/formations.json`

**Format recommandé (Markdown)** :

```markdown
# Licence en Informatique

**Description** : Formation complète en développement logiciel, systèmes informatiques et technologies web.

**Durée** : 3 ans

**Niveau d'entrée** : Baccalauréat (toutes séries acceptées, préférence scientifique)

**Prérequis recommandés** :
- Mathématiques
- Logique et raisonnement
- Intérêt pour la technologie

**Débouchés professionnels** :
- Développeur Full-Stack
- Analyste programmeur
- Chef de projet IT
- Administrateur système

**Programme** :
- Programmation (Python, Java, JavaScript)
- Bases de données
- Réseaux et sécurité
- Projet de fin d'études

---

# Master en Gestion d'Entreprise
...
```

### 3. Démarrer le Backend

```bash
# Dans le dossier backend, avec l'environnement virtuel activé
python main.py

# Ou avec uvicorn directement
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Le serveur sera accessible sur `http://localhost:8000`

### 4. Configuration du Frontend

```bash
# À la racine du projet
pnpm install

# Démarrer le serveur de développement
pnpm dev
```

Le frontend sera accessible sur `http://localhost:3000`

## 🔧 Configuration Avancée

### Variables d'Environnement

**Backend** (`.env` dans `backend/`) :
```env
GEMINI_API_KEY=votre_cle_api_ici
PORT=8000
```

**Frontend** (`.env.local` à la racine) :
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Modifier le Modèle Gemini

Dans `backend/services/gemini_service.py`, vous pouvez changer :

- **Modèle** : `gemini-1.5-pro` (plus puissant) ou `gemini-1.5-flash` (plus rapide)
- **Temperature** : 0.0-1.0 (0.7 par défaut, plus élevé = plus créatif)
- **Max tokens** : Nombre maximum de tokens dans la réponse

## 📚 Utilisation

1. **Démarrer le backend** : `cd backend && python main.py`
2. **Démarrer le frontend** : `pnpm dev`
3. **Ouvrir** : `http://localhost:3000/chatbot`
4. **Commencer** : Cliquez sur "Commencer" et discutez avec le chatbot !

## 🎯 Fonctionnalités

✅ **Conversation naturelle** avec Gemini 1.5 Pro  
✅ **Recommandations personnalisées** basées sur le profil de l'étudiant  
✅ **Contexte des formations** chargé automatiquement depuis votre document  
✅ **Historique de conversation** maintenu pendant la session  
✅ **Suggestions de questions** générées automatiquement  
✅ **Interface moderne** et responsive  

## 🔍 API Endpoints

### `POST /api/chat/start`
Démarrer une nouvelle conversation

**Réponse** :
```json
{
  "conversation_id": "uuid",
  "welcome_message": "Bonjour ! Je suis votre assistant..."
}
```

### `POST /api/chat`
Envoyer un message

**Requête** :
```json
{
  "message": "Je suis intéressé par l'informatique",
  "conversation_id": "uuid-optionnel",
  "history": []
}
```

**Réponse** :
```json
{
  "response": "Excellente question ! L'informatique...",
  "conversation_id": "uuid",
  "suggestions": ["Quels sont les prérequis ?", "..."]
}
```

### `GET /api/health`
Vérifier l'état de l'API

## 🐛 Dépannage

### Le backend ne démarre pas
- Vérifiez que Python 3.9+ est installé
- Vérifiez que toutes les dépendances sont installées : `pip install -r requirements.txt`
- Vérifiez que `GEMINI_API_KEY` est défini dans `.env`

### Le frontend ne peut pas se connecter au backend
- Vérifiez que le backend est démarré sur le port 8000
- Vérifiez `NEXT_PUBLIC_API_URL` dans `.env.local`
- Vérifiez les logs du backend pour les erreurs CORS

### Gemini ne répond pas correctement
- Vérifiez que votre clé API est valide
- Vérifiez que le document de formations est bien chargé (regardez les logs au démarrage)
- Ajustez la température dans `gemini_service.py` si les réponses sont trop créatives

## 📝 Notes Importantes

1. **Fine-tuning vs RAG** : Ce système utilise le **RAG (Retrieval Augmented Generation)** plutôt que le fine-tuning. Le document des formations est injecté dans le contexte de chaque requête. C'est plus flexible et ne nécessite pas de réentraîner le modèle.

2. **Coûts** : Gemini 1.5 Pro est payant après un certain quota gratuit. Pour réduire les coûts, utilisez `gemini-1.5-flash` qui est plus rapide et moins cher.

3. **Sécurité** : Ne commitez jamais votre fichier `.env` avec votre clé API !

## 🚀 Déploiement

### Backend
- **Heroku** : Ajoutez `Procfile` avec `web: uvicorn main:app --host 0.0.0.0 --port $PORT`
- **Railway** : Configuration automatique détectée
- **Docker** : Créez un `Dockerfile` basé sur Python

### Frontend
- **Vercel** : Déploiement automatique depuis GitHub
- **Netlify** : Configuration Next.js standard

N'oubliez pas de mettre à jour `NEXT_PUBLIC_API_URL` avec l'URL de votre backend déployé !

## 📞 Support

Pour toute question ou problème, vérifiez :
1. Les logs du backend (dans le terminal)
2. La console du navigateur (F12)
3. La documentation de l'API : `http://localhost:8000/docs`

---

**Bon développement ! 🎓**

