"""
Service pour interagir avec l'API Google Gemini
"""

import google.generativeai as genai
import os
from typing import List, Dict, Optional
import json

class GeminiService:
    def __init__(self):
        """Initialiser le service Gemini"""
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY n'est pas défini dans les variables d'environnement")
        
        genai.configure(api_key=api_key)
        
        # Configuration du modèle avec des paramètres adaptés pour un chatbot d'orientation
        generation_config = {
            "temperature": 0.7,  # Équilibré entre créativité et précision
            "top_p": 0.95,
            "top_k": 40,
            "max_output_tokens": 2048,
        }
        
        safety_settings = [
            {
                "category": "HARM_CATEGORY_HARASSMENT",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
                "category": "HARM_CATEGORY_HATE_SPEECH",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
                "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
                "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
            },
        ]
        
        # Utiliser les nouveaux modèles Gemini disponibles
        # Les anciens modèles (gemini-1.5-*) ne sont plus disponibles
        # Options: models/gemini-2.5-flash (rapide) ou models/gemini-2.5-pro (plus puissant)
        model_name = "models/gemini-2.5-flash"  # Modèle rapide et efficace
        # Alternative: "models/gemini-2.5-pro" pour plus de puissance
        
        self.model = genai.GenerativeModel(
            model_name=model_name,
            generation_config=generation_config,
            safety_settings=safety_settings
        )
        print(f"✅ Modèle Gemini configuré: {model_name}")
    
    async def generate_response(
        self,
        user_message: str,
        system_prompt: str,
        conversation_history: List[Dict[str, str]]
    ) -> str:
        """
        Générer une réponse à partir du message de l'utilisateur
        
        Args:
            user_message: Message de l'utilisateur
            system_prompt: Prompt système avec les instructions et le contexte des formations
            conversation_history: Historique de la conversation
        
        Returns:
            Réponse générée par Gemini
        """
        try:
            # Construire le prompt complet
            prompt_parts = [system_prompt]
            
            # Ajouter l'historique de conversation
            for msg in conversation_history[-10:]:  # Limiter à 10 derniers messages pour le contexte
                role = "Utilisateur" if msg["role"] == "user" else "Assistant"
                prompt_parts.append(f"{role}: {msg['content']}")
            
            # Ajouter le message actuel
            prompt_parts.append(f"Utilisateur: {user_message}")
            prompt_parts.append("Assistant:")
            
            # Générer la réponse
            full_prompt = "\n".join(prompt_parts)
            response = self.model.generate_content(full_prompt)
            
            # Nettoyer le markdown de la réponse
            cleaned_response = self._clean_markdown(response.text.strip())
            
            return cleaned_response
        
        except Exception as e:
            raise Exception(f"Erreur lors de la génération de la réponse Gemini: {str(e)}")
    
    async def generate_suggestions(
        self,
        user_message: str,
        response: str
    ) -> Optional[List[str]]:
        """
        Générer des suggestions de questions suivantes basées sur la conversation
        
        Args:
            user_message: Message de l'utilisateur
            response: Réponse générée
        
        Returns:
            Liste de suggestions ou None
        """
        try:
            # Générer des suggestions seulement dans certains contextes
            suggestion_prompt = f"""
            Basé sur cette conversation:
            Utilisateur: {user_message}
            Assistant: {response}
            
            Génère 3 suggestions de questions que l'utilisateur pourrait poser ensuite.
            Réponds UNIQUEMENT avec un JSON array de 3 strings, sans autre texte.
            Exemple: ["Question 1", "Question 2", "Question 3"]
            """
            
            suggestion_response = self.model.generate_content(suggestion_prompt)
            suggestions_text = suggestion_response.text.strip()
            
            # Nettoyer et parser le JSON
            suggestions_text = suggestions_text.replace("```json", "").replace("```", "").strip()
            suggestions = json.loads(suggestions_text)
            
            return suggestions[:3] if isinstance(suggestions, list) else None
        
        except Exception as e:
            # En cas d'erreur, retourner None (les suggestions sont optionnelles)
            return None
    
    def _clean_markdown(self, text: str) -> str:
        """
        Nettoie le markdown d'un texte pour un affichage plus propre
        """
        if not text:
            return text
        
        import re
        
        # Supprimer les ** pour le gras
        text = re.sub(r'\*\*(.+?)\*\*', r'\1', text)
        # Supprimer les * pour l'italique (mais pas les listes)
        text = re.sub(r'(?<!\*)\*([^*]+?)\*(?!\*)', r'\1', text)
        # Supprimer les # pour les titres
        text = re.sub(r'^#{1,6}\s+', '', text, flags=re.MULTILINE)
        # Supprimer les ` pour le code inline
        text = re.sub(r'`([^`]+?)`', r'\1', text)
        # Nettoyer les espaces multiples et les sauts de ligne excessifs
        text = re.sub(r'\n{3,}', '\n\n', text)
        text = re.sub(r'[ \t]+', ' ', text)
        
        return text.strip()
    
    def check_health(self) -> str:
        """Vérifier que le service Gemini est opérationnel"""
        try:
            # Test simple
            test_response = self.model.generate_content("Test")
            return "operational"
        except Exception as e:
            return f"error: {str(e)}"

