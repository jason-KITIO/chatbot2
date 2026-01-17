# Backend Chatbot IUC - API Python avec Gemini

Backend FastAPI pour le chatbot d'orientation de l'Université IUC utilisant Google Gemini.

## 🚀 Installation

### Prérequis
- Python 3.9 ou supérieur
- Clé API Google Gemini

### Étapes d'installation

1. **Créer un environnement virtuel** (recommandé):
```bash
python -m venv venv
source venv/bin/activate  # Sur Windows: venv\Scripts\activate
```

2. **Installer les dépendances**:
```bash
pip install -r requirements.txt
```

3. **Configurer les variables d'environnement**:
```bash
cp .env.example .env
# Éditez .env et ajoutez votre GEMINI_API_KEY
```

4. **Ajouter votre document de formations**:
Placez votre document contenant toutes les formations IUC dans:
- `data/formations.txt` ou
- `data/formations.md` ou
- `data/formations.json`

Le système chargera automatiquement ce document pour fournir le contexte à Gemini.

## 🏃 Lancer le serveur

```bash
python main.py
```

Ou avec uvicorn directement:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Le serveur sera accessible sur: `http://localhost:8000`

## 📚 Documentation API

Une fois le serveur lancé, accédez à:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## 🔌 Endpoints principaux

### `POST /api/chat/start`
Démarrer une nouvelle conversation

### `POST /api/chat`
Envoyer un message au chatbot
```json
{
  "message": "Bonjour, je suis intéressé par l'informatique",
  "conversation_id": "uuid-optionnel"
}
```

### `GET /api/health`
Vérifier l'état de l'API

## 🎯 Fonctionnalités

- ✅ Intégration Google Gemini 1.5 Pro
- ✅ Gestion de contexte conversationnel
- ✅ Chargement automatique des formations depuis un document
- ✅ Système de suggestions de questions
- ✅ CORS configuré pour Next.js
- ✅ Gestion d'erreurs robuste

## 📝 Format du document de formations

Vous pouvez fournir vos formations dans différents formats:

### Format texte simple (.txt ou .md):
```
# Licence en Informatique
Description: Formation en développement logiciel
Durée: 3 ans
Prérequis: Baccalauréat scientifique
Débouchés: Développeur, Analyste, Chef de projet IT

# Master en Gestion
...
```

### Format JSON (.json):
```json
{
  "formations": [
    {
      "nom": "Licence en Informatique",
      "description": "...",
      "duree": "3 ans",
      "prerequis": [...],
      "debouches": [...]
    }
  ]
}
```

## 🔧 Configuration

Le modèle Gemini est configuré avec:
- **Temperature**: 0.7 (équilibré)
- **Max tokens**: 2048
- **Modèle**: gemini-1.5-pro (peut être changé en gemini-1.5-flash pour plus de rapidité)

Modifiez ces paramètres dans `services/gemini_service.py` si nécessaire.

