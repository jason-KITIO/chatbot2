# 📚 Explication Complète de l'Architecture

## 🎯 Objectif

Transformer votre chatbot d'orientation IUC d'un système basé sur des règles fixes (questions/réponses prédéfinies) en un **chatbot intelligent** utilisant **Google Gemini** qui peut :
- Comprendre le contexte de chaque étudiant
- Recommander des filières adaptées à leur profil
- Répondre de manière naturelle et conversationnelle
- Utiliser vos formations réelles comme base de connaissances

---

## 🏗️ Architecture Globale

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  chatbot.tsx │→ │ useChatbot.ts│→ │ apiService.ts │  │
│  │  (UI)        │  │  (Hook)      │  │  (API calls) │  │
│  └──────────────┘  └──────────────┘  └──────┬───────┘  │
└──────────────────────────────────────────────┼──────────┘
                                               │ HTTP
                                               │ POST/GET
                                               ▼
┌─────────────────────────────────────────────────────────┐
│              BACKEND (Python + FastAPI)                  │
│  ┌──────────────────────────────────────────────────┐   │
│  │              main.py (FastAPI)                   │   │
│  │  - /api/chat/start  (démarrer conversation)      │   │
│  │  - /api/chat        (envoyer message)            │   │
│  │  - /api/health      (vérifier état)              │   │
│  └──────────────┬───────────────────┬───────────────┘   │
│                 │                   │                    │
│        ┌────────▼────────┐  ┌──────▼──────────┐         │
│        │ GeminiService   │  │ ContextManager   │         │
│        │                 │  │                  │         │
│        │ - Appelle Gemini│  │ - Charge les     │         │
│        │ - Génère réponse│  │   formations     │         │
│        │ - Suggestions   │  │ - Gère l'historique│       │
│        └─────────────────┘  │ - Crée le prompt │         │
│                             └──────────────────┘         │
└─────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Google Gemini   │
                    │  1.5 Pro API     │
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Document        │
                    │  Formations IUC  │
                    │  (data/*.txt/md) │
                    └──────────────────┘
```

---

## 📁 Fichiers Créés/Modifiés

### 🆕 NOUVEAUX FICHIERS (Backend Python)

#### 1. `backend/main.py` - **Le serveur API principal**
**Rôle** : Point d'entrée de votre backend, expose les endpoints REST

**Ce qu'il fait** :
- Crée une application FastAPI
- Configure CORS pour permettre les requêtes depuis Next.js
- Définit 3 endpoints principaux :
  - `POST /api/chat/start` : Démarrer une nouvelle conversation
  - `POST /api/chat` : Envoyer un message et recevoir une réponse
  - `GET /api/health` : Vérifier que l'API fonctionne
- Gère les erreurs et retourne des réponses JSON structurées

**Exemple de flux** :
```
Utilisateur tape "Je suis intéressé par l'informatique"
  ↓
Frontend envoie POST /api/chat avec le message
  ↓
main.py reçoit la requête
  ↓
Demande à GeminiService de générer une réponse
  ↓
Retourne la réponse au frontend
```

---

#### 2. `backend/services/gemini_service.py` - **Le service Gemini**
**Rôle** : Interface avec l'API Google Gemini

**Ce qu'il fait** :
- Configure la connexion à Gemini avec votre clé API
- Configure les paramètres du modèle :
  - **Temperature** : 0.7 (équilibre créativité/précision)
  - **Max tokens** : 2048 (longueur max des réponses)
  - **Safety settings** : Filtres de sécurité activés
- **`generate_response()`** : 
  - Prend le message de l'utilisateur
  - Ajoute le contexte des formations (via ContextManager)
  - Ajoute l'historique de conversation
  - Envoie tout à Gemini
  - Retourne la réponse générée
- **`generate_suggestions()`** : Génère 3 suggestions de questions suivantes

**Pourquoi c'est important** :
- C'est ici que la "magie" se passe : Gemini analyse le profil de l'étudiant et vos formations pour faire des recommandations intelligentes
- Le modèle est configuré spécifiquement pour un chatbot d'orientation (pas trop créatif, mais assez pour être naturel)

---

#### 3. `backend/services/context_manager.py` - **Le gestionnaire de contexte**
**Rôle** : Charge vos formations et gère les conversations

**Ce qu'il fait** :

**a) Chargement des formations** (`load_formations()`) :
- Cherche automatiquement votre document de formations dans `data/formations.txt`, `.md`, ou `.json`
- Charge le contenu en mémoire
- Si aucun fichier trouvé, utilise un message par défaut

**b) Création du prompt système** (`get_system_prompt()`) :
- Crée un "prompt système" qui dit à Gemini :
  - Qui il est (assistant d'orientation IUC)
  - Quelles sont les formations disponibles (votre document)
  - Comment il doit se comporter (uniquement questions d'orientation, être bienveillant, etc.)
  - Ce prompt est injecté dans CHAQUE requête à Gemini

**c) Gestion des conversations** :
- `create_conversation()` : Crée un ID unique pour chaque conversation
- `add_message()` : Stocke les messages (user + assistant) en mémoire
- `get_conversation_history()` : Récupère l'historique pour maintenir le contexte
- `delete_conversation()` : Nettoie une conversation terminée

**Pourquoi c'est important** :
- C'est ici que vos formations sont intégrées au système
- Le prompt système garantit que Gemini ne répond QUE sur les formations IUC
- L'historique permet des conversations naturelles (Gemini se souvient de ce qui a été dit)

---

#### 4. `backend/requirements.txt` - **Dépendances Python**
Liste des packages nécessaires :
- `fastapi` : Framework web pour créer l'API
- `uvicorn` : Serveur ASGI pour exécuter FastAPI
- `google-generativeai` : SDK officiel pour Gemini
- `python-dotenv` : Pour charger les variables d'environnement (.env)
- `pydantic` : Validation des données (déjà inclus avec FastAPI)

---

#### 5. `backend/env.example` - **Template de configuration**
Fichier exemple pour créer votre `.env` avec votre clé API Gemini

---

### 🔄 FICHIERS MODIFIÉS (Frontend)

#### 1. `hooks/useChatbot.ts` - **Le hook React modifié**
**AVANT** : Logique basée sur des règles fixes (switch/case avec questions prédéfinies)

**MAINTENANT** : 
- Appelle l'API backend au lieu de générer des réponses locales
- `demarrerChat()` : Appelle `POST /api/chat/start` pour initialiser
- `traiterReponseUtilisateur()` : Appelle `POST /api/chat` avec le message
- Gère l'ID de conversation pour maintenir le contexte
- Gère les erreurs (si le backend n'est pas disponible)

**Changements clés** :
```typescript
// AVANT : Logique locale
switch (etape) {
  case 'niveau': // Questions fixes
}

// MAINTENANT : Appel API
const response = await apiService.sendMessage(message, conversationId);
ajouterMessage(response.response, 'bot', response.suggestions);
```

---

#### 2. `services/apiService.ts` - **NOUVEAU : Service API**
**Rôle** : Interface TypeScript pour communiquer avec le backend Python

**Ce qu'il fait** :
- `startConversation()` : Démarre une conversation
- `sendMessage()` : Envoie un message et récupère la réponse
- `deleteConversation()` : Supprime une conversation
- `checkHealth()` : Vérifie que le backend fonctionne
- Gère les erreurs HTTP et les transforme en messages d'erreur lisibles

**Pourquoi c'est important** :
- Centralise toute la communication avec le backend
- Facilite les changements futurs (changer l'URL, ajouter auth, etc.)
- Type-safe avec TypeScript

---

#### 3. `next.config.ts` - **Configuration Next.js modifiée**
Ajout de la variable d'environnement `NEXT_PUBLIC_API_URL` pour pointer vers le backend (par défaut `http://localhost:8000`)

---

## 🔄 Flux de Données Complet

### Scénario : Un étudiant demande "Quelles formations en informatique proposez-vous ?"

```
1. UTILISATEUR
   └─> Tape dans l'interface : "Quelles formations en informatique proposez-vous ?"
       │
       ▼
2. FRONTEND (chatbot.tsx)
   └─> useChatbot.ts → envoyerMessage()
       │
       ▼
3. FRONTEND (apiService.ts)
   └─> POST http://localhost:8000/api/chat
       Body: {
         "message": "Quelles formations...",
         "conversation_id": "abc-123",
         "history": [...]
       }
       │
       ▼
4. BACKEND (main.py)
   └─> Reçoit la requête
       │
       ├─> ContextManager.get_system_prompt()
       │   └─> Retourne le prompt avec vos formations
       │
       ├─> ContextManager.get_conversation_history()
       │   └─> Retourne les messages précédents
       │
       └─> GeminiService.generate_response()
           │
           ▼
5. GEMINI SERVICE
   └─> Construit le prompt complet :
       """
       Tu es un assistant d'orientation IUC...
       
       FORMATIONS DISPONIBLES:
       [Votre document de formations]
       
       Historique:
       Utilisateur: Bonjour
       Assistant: Bonjour ! Je suis...
       
       Utilisateur: Quelles formations en informatique proposez-vous ?
       Assistant:
       """
       │
       ▼
6. GOOGLE GEMINI API
   └─> Analyse le prompt
       └─> Génère une réponse basée sur :
           - Le contexte des formations
           - L'historique de conversation
           - Les instructions du prompt système
       │
       ▼
7. RETOUR
   └─> Gemini retourne : "L'IUC propose plusieurs formations en informatique..."
       │
       ▼
8. BACKEND (main.py)
   └─> Formate la réponse JSON :
       {
         "response": "L'IUC propose...",
         "conversation_id": "abc-123",
         "suggestions": ["Quels sont les prérequis ?", ...]
       }
       │
       ▼
9. FRONTEND (apiService.ts)
   └─> Reçoit la réponse
       │
       ▼
10. FRONTEND (useChatbot.ts)
    └─> Ajoute le message dans l'état React
        │
        ▼
11. FRONTEND (chatbot.tsx)
    └─> Affiche la réponse dans l'interface
        │
        ▼
12. UTILISATEUR
    └─> Voit la réponse et peut continuer la conversation
```

---

## 🎯 Différences Clés : Avant vs Après

### ❌ AVANT (Système basé sur règles)
- Questions fixes prédéfinies
- Réponses scriptées
- Pas de compréhension du contexte
- Logique en dur dans le code
- Impossible de répondre à des questions non prévues

### ✅ MAINTENANT (Système avec Gemini)
- Conversation naturelle et libre
- Réponses générées intelligemment
- Comprend le contexte et le profil de l'étudiant
- Utilise vos formations réelles comme base de connaissances
- Peut répondre à n'importe quelle question sur les formations
- Suggestions automatiques de questions

---

## 🔐 Sécurité et Configuration

### Variables d'environnement nécessaires :

**Backend** (`.env` dans `backend/`) :
```env
GEMINI_API_KEY=votre_cle_api_ici
```

**Frontend** (`.env.local` à la racine) :
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Sécurité :
- ✅ CORS configuré pour n'accepter que les requêtes depuis votre frontend
- ✅ Clé API stockée dans `.env` (ne JAMAIS commiter)
- ✅ Safety settings Gemini activés (filtre contenu inapproprié)
- ✅ Validation des données avec Pydantic

---

## 📊 Avantages de cette Architecture

1. **Séparation des responsabilités** :
   - Frontend = Interface utilisateur
   - Backend = Logique métier + IA
   - Gemini = Intelligence conversationnelle

2. **Scalabilité** :
   - Facile d'ajouter de nouvelles fonctionnalités
   - Peut gérer plusieurs conversations simultanément
   - Peut être déployé séparément

3. **Maintenabilité** :
   - Code organisé et modulaire
   - Facile à déboguer
   - Documentation complète

4. **Flexibilité** :
   - Peut changer de modèle IA facilement
   - Peut ajouter d'autres sources de données
   - Peut intégrer une base de données plus tard

---

## 🚀 Prochaines Étapes Possibles

1. **Base de données** : Stocker les conversations et profils d'étudiants
2. **Authentification** : Identifier les utilisateurs
3. **Analytics** : Suivre quelles formations sont les plus demandées
4. **Multi-langues** : Support de plusieurs langues
5. **Fine-tuning** : Entraîner un modèle spécifique (plus complexe, nécessite plus de données)

---

**En résumé** : Vous avez maintenant un système où Gemini utilise vos formations réelles pour donner des conseils personnalisés, au lieu d'un système de questions/réponses fixes ! 🎓✨


