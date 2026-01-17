import { useState, useCallback, useRef } from 'react';
import { ChatState, Message, ProfilUtilisateur } from '@/types/chatbot';
import { apiService, ChatMessage } from '@/services/apiService';

export const useChatbot = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    etapeActuelle: 'libre', // Mode libre pour les conversations avec Gemini
    profilUtilisateur: {
      niveau: '',
      domainePrefere: '',
      competences: [],
      objectifs: []
    },
    filieresRecommandees: [],
    isLoading: false,
    isTyping: false
  });

  // Ref pour contrôler/annuler la saisie progressive
  const typingRef = useRef<{ abort: boolean } | null>(null);

  const ajouterMessage = useCallback((contenu: string, type: 'user' | 'bot', options?: string[]) => {
    const nouveauMessage: Message = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      contenu,
      type,
      timestamp: new Date(),
      options
    };

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, nouveauMessage]
    }));

    return nouveauMessage;
  }, []);

  const traiterReponseUtilisateur = useCallback(async (reponse: string) => {
    // Ajouter le message de l'utilisateur immédiatement
    ajouterMessage(reponse, 'user');

    // Activer le loading
    setChatState(prev => ({ ...prev, isLoading: true }));

    // Retirer les suggestions présentes sur les anciens messages du bot
    setChatState(prev => ({
      ...prev,
      messages: prev.messages.map(m => (m.type === 'bot' ? { ...m, options: [] } : m))
    }));

    try {
      // Construire l'historique pour l'API
      const history: ChatMessage[] = chatState.messages
        .filter(msg => msg.type === 'user' || msg.type === 'bot')
        .map(msg => ({
          role: msg.type,
          content: msg.contenu
        }));

      // Envoyer le message au backend
      const response = await apiService.sendMessage(
        reponse,
        conversationId || undefined,
        history
      );

      // Mettre à jour l'ID de conversation si nécessaire
      if (response.conversation_id && response.conversation_id !== conversationId) {
        setConversationId(response.conversation_id);
      }

      // Préparer texte complet et suggestions
      const fullText = response.response || '';
      const suggestions = response.suggestions || [];

      // Créer le message initial vide (les suggestions seront ajoutées après la saisie)
      const botMessage = ajouterMessage('', 'bot');

      // Marquer que la saisie est en cours
      setChatState(prev => ({ ...prev, isTyping: true }));

      // Commencer la saisie progressive
      typingRef.current = { abort: false };

      const speed = 18; // ms par caractère
      let idx = 0;

      const finalize = (text: string) => {
        // Mettre à jour le message final et ajouter les suggestions
        setChatState(prev => ({
          ...prev,
          messages: prev.messages.map(m =>
            m.id === botMessage.id ? { ...m, contenu: text, options: suggestions } : m
          ),
          isLoading: false,
          isTyping: false
        }));

        typingRef.current = null;
      };

      const interval = setInterval(() => {
        if (!typingRef.current || typingRef.current.abort) {
          clearInterval(interval);
          // si aborté, afficher le texte complet et ajouter les suggestions
          finalize(fullText);
          return;
        }

        idx += 1;
        const partial = fullText.slice(0, idx);

        // Mettre à jour le message en cours
        setChatState(prev => ({
          ...prev,
          messages: prev.messages.map(m => (m.id === botMessage.id ? { ...m, contenu: partial } : m))
        }));

        if (idx >= fullText.length) {
          clearInterval(interval);
          finalize(fullText);
        }
      }, speed);
    } catch (error) {
      // En cas d'erreur, afficher un message d'erreur
      const errorMessage = error instanceof Error
        ? error.message
        : 'Une erreur est survenue lors de la communication avec le serveur.';

      ajouterMessage(
        `❌ Désolé, une erreur s'est produite: ${errorMessage}\n\nVeuillez réessayer ou vérifier que le serveur backend est bien démarré.`,
        'bot'
      );

      setChatState(prev => ({ ...prev, isLoading: false, isTyping: false }));
    }
  }, [ajouterMessage, conversationId, chatState.messages]);

  const demarrerChat = useCallback(async () => {
    setIsStarted(true);
    setChatState(prev => ({ ...prev, isLoading: true }));

    try {
      // Démarrer une nouvelle conversation avec le backend
      const response = await apiService.startConversation();
      
      setConversationId(response.conversation_id);
      
      // Ajouter le message de bienvenue (sans suggestion 'Commencer')
      ajouterMessage(response.welcome_message, 'bot');
      
      setChatState(prev => ({ ...prev, isLoading: false }));
    } catch (error) {
      // En cas d'erreur, afficher un message d'erreur mais permettre quand même de continuer
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Impossible de se connecter au serveur.';
      
      ajouterMessage(
        `⚠️ ${errorMessage}\n\nAssurez-vous que le serveur backend Python est démarré sur http://localhost:8000`,
        'bot'
      );
      
      setChatState(prev => ({ ...prev, isLoading: false }));
    }
  }, [ajouterMessage]);

  const reinitialiserChat = useCallback(async () => {
    // Supprimer la conversation côté serveur si elle existe
    if (conversationId) {
      try {
        await apiService.deleteConversation(conversationId);
      } catch (error) {
        console.error('Erreur lors de la suppression de la conversation:', error);
      }
    }

    setIsStarted(false);
    setConversationId(null);
    setChatState({
      messages: [],
      etapeActuelle: 'libre',
      profilUtilisateur: {
        niveau: '',
        domainePrefere: '',
        competences: [],
        objectifs: []
      },
      filieresRecommandees: [],
      isLoading: false,
      isTyping: false
    });
  }, [conversationId]);

  // Permet d'arrêter la saisie progressive et d'afficher immédiatement le texte complet
  const stopBotResponse = useCallback(() => {
    if (typingRef.current) {
      typingRef.current.abort = true;
    }
  }, []);

  const envoyerMessage = useCallback((message: string) => {
    if (message.trim()) {
      traiterReponseUtilisateur(message.trim());
    }
  }, [traiterReponseUtilisateur]);

  return {
    isStarted,
    chatState,
    demarrerChat,
    traiterReponseUtilisateur,
    envoyerMessage,
    reinitialiserChat
  };
};