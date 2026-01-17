"""
Gestionnaire de contexte pour les conversations et les formations (persisté avec SQLite via SQLModel)
"""

import os
import json
import uuid
from typing import List, Dict, Optional
from pathlib import Path
from datetime import datetime

from sqlmodel import select
from db import get_session
from models import Conversation, Message


class ContextManager:
    def __init__(self):
        """Initialiser le gestionnaire de contexte"""
        self.formations_data: Optional[str] = None
        self.load_formations()

    def load_formations(self):
        """
        Charger le document des formations depuis un fichier
        Le fichier peut être en .txt, .md, ou .json
        """
        # Chercher le fichier des formations dans différents emplacements possibles
        possible_paths = [
            "data/formations.txt",
            "data/formations.md",
            "data/formations.json",
            "../data/formations.txt",
            "../data/formations.md",
            "../data/formations.json",
        ]

        for path in possible_paths:
            file_path = Path(path)
            if file_path.exists():
                try:
                    with open(file_path, "r", encoding="utf-8") as f:
                        if path.endswith(".json"):
                            data = json.load(f)
                            # Convertir le JSON en texte lisible
                            self.formations_data = json.dumps(data, indent=2, ensure_ascii=False)
                        else:
                            self.formations_data = f.read()
                    print(f"✅ Formations chargées depuis: {path}")
                    return
                except Exception as e:
                    print(f"⚠️ Erreur lors du chargement de {path}: {e}")

        # Si aucun fichier n'est trouvé, utiliser un exemple par défaut
        print("⚠️ Aucun fichier de formations trouvé. Utilisation d'un contexte par défaut.")
        self.formations_data = """
        # Formations de l'Université IUC

        L'Institut Universitaire de la Cote propose diverses formations adaptées aux besoins des étudiants.
        Veuillez placer votre document de formations dans le dossier data/formations.txt ou data/formations.md
        """

    def get_system_prompt(self) -> str:
        """
        Générer le prompt système avec les instructions et le contexte des formations
        """
        system_prompt = f"""Tu es un assistant d'orientation académique spécialisé pour l'Université IUC.
Tu as pour mission d'aider les nouveaux étudiants à découvrir les filières et formations qui correspondent le mieux à leur profil, leur background académique et leurs aspirations professionnelles.

CONTEXTE DES FORMATIONS DISPONIBLES:
{self.formations_data}

INSTRUCTIONS IMPORTANTES:
1. Tu dois UNIQUEMENT répondre aux questions concernant les formations, filières, cursus et orientation académique de l'Université IUC
2. Si on te pose une question qui n'est pas liée à l'orientation académique ou aux formations IUC, redirige poliment la conversation vers ces sujets
3. Pose des questions pertinentes pour mieux comprendre le profil de l'étudiant (niveau d'études, domaines d'intérêt, compétences, objectifs professionnels)
4. Recommande des filières spécifiques en te basant sur les informations fournies dans le contexte des formations
5. Sois bienveillant, professionnel et encourageant
6. Utilise les informations exactes du contexte des formations - ne crée pas de formations fictives
7. Si une information n'est pas dans le contexte, dis-le clairement

STYLE DE COMMUNICATION:
- Sois chaleureux et accueillant
- Utilise un langage clair et accessible
- Structure tes réponses de manière organisée avec des sauts de ligne
- IMPORTANT : N'utilise PAS de markdown (pas de **gras**, pas de # titres, pas de `code`, pas d'astérisques pour les listes)
- Utilise des emojis avec modération UNIQUEMENT si cela ajoute de la clarté
- Formate tes réponses en texte simple et naturel

Commence par accueillir l'utilisateur et lui demander des informations sur son parcours académique et ses intérêts.
Tu dois suivre le fil de la discussion et garder une conversation coherente et viter de dire bonjour plusieurs fois par exemple"""

        return system_prompt

    def create_conversation(self) -> str:
        """Créer une nouvelle conversation et retourner son ID"""
        conversation_id = str(uuid.uuid4())
        with get_session() as session:
            convo = Conversation(id=conversation_id)
            session.add(convo)
            session.commit()
        return conversation_id

    def add_message(self, conversation_id: str, role: str, content: str):
        """Ajouter un message à une conversation"""
        with get_session() as session:
            msg = Message(id=str(uuid.uuid4()), conversation_id=conversation_id, role=role, content=content, timestamp=datetime.utcnow())
            session.add(msg)
            session.commit()

    def get_conversation_history(self, conversation_id: str) -> List[Dict[str, str]]:
        """Obtenir l'historique d'une conversation"""
        with get_session() as session:
            statement = select(Message).where(Message.conversation_id == conversation_id).order_by(Message.timestamp)
            results = session.exec(statement).all()
            return [{"role": r.role, "content": r.content} for r in results]

    def delete_conversation(self, conversation_id: str):
        """Supprimer une conversation et ses messages"""
        with get_session() as session:
            # supprimer messages
            statement = select(Message).where(Message.conversation_id == conversation_id)
            messages = session.exec(statement).all()
            for m in messages:
                session.delete(m)
            # supprimer conversation si présente
            statement2 = select(Conversation).where(Conversation.id == conversation_id)
            convos = session.exec(statement2).all()
            for c in convos:
                session.delete(c)
            session.commit()

    def check_health(self) -> str:
        """Vérifier que le gestionnaire de contexte est opérationnel"""
        if self.formations_data:
            return "operational"
        return "warning: no formations data loaded"

