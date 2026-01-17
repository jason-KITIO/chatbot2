"""
Backend FastAPI pour le chatbot d'orientation IUC
Utilise Google Gemini pour répondre aux questions sur les formations
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict
import os
from dotenv import load_dotenv

from services.gemini_service import GeminiService
from services.context_manager import ContextManager
from db import init_db

# Charger les variables d'environnement
load_dotenv()

app = FastAPI(title="IUC Chatbot API", version="1.0.0")

# Configuration CORS pour permettre les requêtes depuis le frontend Next.js
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # Ajoutez votre URL de production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialiser les services
init_db()  # Initialiser la DB
gemini_service = GeminiService()
context_manager = ContextManager()

# Modèles Pydantic pour les requêtes/réponses
class Message(BaseModel):
    role: str  # "user" ou "assistant"
    content: str

class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None
    history: Optional[List[Message]] = []

class ChatResponse(BaseModel):
    response: str
    conversation_id: str
    suggestions: Optional[List[str]] = None

class HealthResponse(BaseModel):
    status: str
    message: str

@app.get("/", response_model=HealthResponse)
async def root():
    """Endpoint de santé pour vérifier que l'API fonctionne"""
    return {
        "status": "healthy",
        "message": "IUC Chatbot API is running"
    }

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Endpoint principal pour les conversations avec le chatbot
    """
    try:
        # Obtenir ou créer un ID de conversation
        conversation_id = request.conversation_id or context_manager.create_conversation()
        
        # Ajouter le message de l'utilisateur à l'historique
        context_manager.add_message(conversation_id, "user", request.message)
        
        # Construire le contexte avec les formations
        system_prompt = context_manager.get_system_prompt()
        
        # Obtenir l'historique de la conversation
        conversation_history = context_manager.get_conversation_history(conversation_id)
        
        # Générer la réponse avec Gemini
        response = await gemini_service.generate_response(
            user_message=request.message,
            system_prompt=system_prompt,
            conversation_history=conversation_history
        )
        
        # Ajouter la réponse du bot à l'historique
        context_manager.add_message(conversation_id, "assistant", response)
        
        # Générer des suggestions si nécessaire
        suggestions = await gemini_service.generate_suggestions(
            user_message=request.message,
            response=response
        )
        
        return ChatResponse(
            response=response,
            conversation_id=conversation_id,
            suggestions=suggestions
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la génération de la réponse: {str(e)}")

@app.post("/api/chat/start")
async def start_conversation():
    """
    Démarrer une nouvelle conversation
    """
    conversation_id = context_manager.create_conversation()
    
    # Message de bienvenue
    welcome_message = (
        "Bonjour ! Je suis votre assistant d'orientation à l'Université IUC. "
        "Je suis là pour vous aider à découvrir les filières et formations qui correspondent "
        "le mieux à votre profil et à vos aspirations. "
        "Pouvez-vous me parler de votre parcours académique et de vos centres d'intérêt ?"
    )
    
    context_manager.add_message(conversation_id, "assistant", welcome_message)
    
    return {
        "conversation_id": conversation_id,
        "welcome_message": welcome_message
    }

@app.delete("/api/chat/{conversation_id}")
async def delete_conversation(conversation_id: str):
    """
    Supprimer une conversation
    """
    context_manager.delete_conversation(conversation_id)
    return {"message": "Conversation supprimée"}

@app.get("/api/health")
async def health_check():
    """
    Vérification de l'état de l'API et des services
    """
    try:
        # Vérifier que Gemini est configuré
        gemini_status = gemini_service.check_health()
        context_status = context_manager.check_health()
        
        return {
            "status": "healthy",
            "services": {
                "gemini": gemini_status,
                "context_manager": context_status
            }
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e)
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

