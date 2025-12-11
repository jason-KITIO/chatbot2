export interface Filiere {
  id: string;
  nom: string;
  description: string;
  duree: string;
  debouches: string[];
  prerequis: string[];
  niveau: 'Licence' | 'Master' | 'Doctorat';
}

export interface Message {
  id: string;
  contenu: string;
  type: 'user' | 'bot';
  timestamp: Date;
  options?: string[];
}

export interface ChatState {
  messages: Message[];
  etapeActuelle: string;
  profilUtilisateur: ProfilUtilisateur;
  filieresRecommandees: Filiere[];
  isLoading: boolean;
}

export interface ProfilUtilisateur {
  niveau: string;
  domainePrefere: string;
  competences: string[];
  objectifs: string[];
}

export interface QuestionReponse {
  id: string;
  question: string;
  options: string[];
  etapeSuivante: string;
  action?: (reponse: string) => void;
}