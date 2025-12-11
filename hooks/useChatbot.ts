import { useState, useCallback } from 'react';
import { ChatState, Message, ProfilUtilisateur } from '@/types/chatbot';
import { questionsOrientations, genererReponseBot, recommanderFilieres } from '@/services/chatbotService';

export const useChatbot = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    etapeActuelle: 'accueil',
    profilUtilisateur: {
      niveau: '',
      domainePrefere: '',
      competences: [],
      objectifs: []
    },
    filieresRecommandees: [],
    isLoading: false
  });

  const ajouterMessage = useCallback((contenu: string, type: 'user' | 'bot', options?: string[]) => {
    const nouveauMessage: Message = {
      id: Date.now().toString(),
      contenu,
      type,
      timestamp: new Date(),
      options
    };

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, nouveauMessage]
    }));
  }, []);

  const traiterReponseUtilisateur = useCallback((reponse: string) => {
    ajouterMessage(reponse, 'user');
    
    setChatState(prev => {
      const nouvelEtat = { ...prev, isLoading: true };
      
      switch (prev.etapeActuelle) {
        case 'accueil':
          nouvelEtat.etapeActuelle = 'niveau';
          setTimeout(() => {
            const question = questionsOrientations.find(q => q.id === 'niveau');
            if (question) {
              ajouterMessage(question.question, 'bot', question.options);
            }
            setChatState(current => ({ ...current, isLoading: false }));
          }, 1000);
          break;
          
        case 'niveau':
          nouvelEtat.profilUtilisateur.niveau = reponse;
          nouvelEtat.etapeActuelle = 'domaine';
          setTimeout(() => {
            ajouterMessage(genererReponseBot('niveau'), 'bot');
            const question = questionsOrientations.find(q => q.id === 'domaine');
            if (question) {
              ajouterMessage(question.question, 'bot', question.options);
            }
            setChatState(current => ({ ...current, isLoading: false }));
          }, 1000);
          break;
          
        case 'domaine':
          nouvelEtat.profilUtilisateur.domainePrefere = reponse;
          nouvelEtat.etapeActuelle = 'objectifs';
          setTimeout(() => {
            ajouterMessage(genererReponseBot('domaine'), 'bot');
            const question = questionsOrientations.find(q => q.id === 'objectifs');
            if (question) {
              ajouterMessage(question.question, 'bot', question.options);
            }
            setChatState(current => ({ ...current, isLoading: false }));
          }, 1000);
          break;
          
        case 'objectifs':
          nouvelEtat.profilUtilisateur.objectifs = [reponse];
          nouvelEtat.etapeActuelle = 'recommandations';
          const recommandations = recommanderFilieres(nouvelEtat.profilUtilisateur);
          nouvelEtat.filieresRecommandees = recommandations;
          
          setTimeout(() => {
            ajouterMessage(genererReponseBot('recommandations'), 'bot');
            recommandations.forEach(filiere => {
              ajouterMessage(
                `📚 **${filiere.nom}** (${filiere.niveau})\n${filiere.description}\n⏱️ Durée: ${filiere.duree}\n💼 Débouchés: ${filiere.debouches.join(', ')}`,
                'bot'
              );
            });
            setChatState(current => ({ ...current, etapeActuelle: 'libre', isLoading: false }));
          }, 1500);
          break;
          

          
        case 'libre':
          setTimeout(() => {
            ajouterMessage(
              "Merci pour votre question ! Voici ma réponse basée sur votre profil et les filières recommandées.",
              'bot'
            );
            ajouterMessage(
              "Suggestions :",
              'bot',
              ['Autre question', 'Plus d\'informations', 'Recommencer']
            );
            setChatState(current => ({ ...current, isLoading: false }));
          }, 1000);
          break;
      }
      
      return nouvelEtat;
    });
  }, [ajouterMessage]);

  const demarrerChat = useCallback(() => {
    setIsStarted(true);
    setChatState({
      messages: [{
        id: '1',
        contenu: genererReponseBot('accueil'),
        type: 'bot',
        timestamp: new Date(),
        options: ['Commencer']
      }],
      etapeActuelle: 'accueil',
      profilUtilisateur: {
        niveau: '',
        domainePrefere: '',
        competences: [],
        objectifs: []
      },
      filieresRecommandees: [],
      isLoading: false
    });
  }, []);

  const reinitialiserChat = useCallback(() => {
    setIsStarted(false);
    setChatState({
      messages: [],
      etapeActuelle: 'accueil',
      profilUtilisateur: {
        niveau: '',
        domainePrefere: '',
        competences: [],
        objectifs: []
      },
      filieresRecommandees: [],
      isLoading: false
    });
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