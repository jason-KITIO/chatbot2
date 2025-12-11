import { Filiere, QuestionReponse, ProfilUtilisateur } from '@/types/chatbot';

export const filieres: Filiere[] = [
  {
    id: '1',
    nom: 'Informatique',
    description: 'Formation en développement logiciel et systèmes informatiques',
    duree: '3 ans',
    debouches: ['Développeur', 'Analyste', 'Chef de projet IT'],
    prerequis: ['Mathématiques', 'Logique'],
    niveau: 'Licence'
  },
  {
    id: '2',
    nom: 'Gestion',
    description: 'Formation en management et administration des entreprises',
    duree: '3 ans',
    debouches: ['Manager', 'Consultant', 'Entrepreneur'],
    prerequis: ['Économie', 'Communication'],
    niveau: 'Licence'
  },
  {
    id: '3',
    nom: 'Marketing Digital',
    description: 'Formation spécialisée en marketing numérique',
    duree: '2 ans',
    debouches: ['Digital Marketer', 'Community Manager', 'E-commerce Manager'],
    prerequis: ['Communication', 'Créativité'],
    niveau: 'Master'
  }
];

export const questionsOrientations: QuestionReponse[] = [
  {
    id: 'niveau',
    question: 'Quel est votre niveau d\'études actuel ?',
    options: ['Baccalauréat', 'Licence', 'Master'],
    etapeSuivante: 'domaine'
  },
  {
    id: 'domaine',
    question: 'Quel domaine vous intéresse le plus ?',
    options: ['Technologie', 'Business', 'Communication', 'Sciences'],
    etapeSuivante: 'objectifs'
  },
  {
    id: 'objectifs',
    question: 'Quels sont vos objectifs professionnels ?',
    options: ['Créer une entreprise', 'Travailler en équipe', 'Résoudre des problèmes techniques', 'Gérer des projets'],
    etapeSuivante: 'recommandations'
  }
];

export const recommanderFilieres = (profil: ProfilUtilisateur): Filiere[] => {
  return filieres.filter(filiere => {
    if (profil.domainePrefere === 'Technologie' && filiere.nom === 'Informatique') return true;
    if (profil.domainePrefere === 'Business' && filiere.nom === 'Gestion') return true;
    if (profil.domainePrefere === 'Communication' && filiere.nom === 'Marketing Digital') return true;
    return false;
  });
};

export const genererReponseBot = (etape: string, reponse?: string): string => {
  switch (etape) {
    case 'accueil':
      return 'Bonjour ! Je suis votre assistant d\'orientation à l\'IUC. Je vais vous aider à choisir la filière qui vous convient le mieux. Commençons !';
    case 'niveau':
      return 'Parfait ! Maintenant, parlons de vos centres d\'intérêt.';
    case 'domaine':
      return 'Excellent choix ! Parlons maintenant de vos objectifs professionnels.';
    case 'recommandations':
      return 'Basé sur vos réponses, voici les filières que je vous recommande :';
    default:
      return 'Je peux vous aider à choisir votre filière à l\'IUC.';
  }
};