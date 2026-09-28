import {
  BookOpen,
  Bookmark,
  Megaphone,
  ShieldCheck,
  Upload,
  Users,
} from "lucide-react";

export const SITE = {
  name: "EMIMOOD",
  tagline: "Partage de documents universitaires",
  description:
    "Retrouvez, partagez et organisez les cours, TD et examens de votre classe au même endroit.",
};

export const AUTH_LINKS = {
  login: "/login",
  register: "/register",
  dashboard: "/dashboard",
};

export const NAV_LINKS = [
  { href: "/#fonctionnalites", label: "Fonctionnalités" },
  { href: "/#comment-ca-marche", label: "Comment ça marche" },
  { href: "/#roles", label: "Rôles" },
];

export const HERO = {
  badge: "Pour les étudiants, par les étudiants",
  title: "Tous les documents de votre classe, enfin organisés",
  subtitle:
    "Cours, TD, examens et corrigés validés par un modérateur, accessibles à tout moment et classés par matière.",
  primaryCta: "Créer un compte",
  secondaryCta: "Se connecter",
};

export const FEATURES = [
  {
    icon: BookOpen,
    title: "Documents par matière",
    description:
      "Accédez aux cours, TD et examens de votre classe, classés par matière et par type.",
  },
  {
    icon: Upload,
    title: "Vos propres documents",
    description:
      "Gardez vos fichiers en privé ou proposez-les à la validation pour les partager.",
  },
  {
    icon: Bookmark,
    title: "Sauvegardes et favoris",
    description:
      "Enregistrez les documents publics dans votre espace personnel pour les retrouver vite.",
  },
  {
    icon: ShieldCheck,
    title: "Contenu modéré",
    description:
      "Chaque document public est vérifié par un modérateur avant d'être publié.",
  },
  {
    icon: Megaphone,
    title: "Annonces ciblées",
    description:
      "Recevez les informations importantes de votre classe et de l'administration.",
  },
  {
    icon: Users,
    title: "Entraide entre étudiants",
    description:
      "Partagez vos ressources et profitez de celles des autres pour progresser ensemble.",
  },
];

export const STEPS = [
  {
    title: "Rejoignez votre classe",
    description:
      "Créez votre compte avec le code d'invitation fourni pour votre classe.",
  },
  {
    title: "Partagez et organisez",
    description:
      "Consultez les documents publics, ajoutez les vôtres et sauvegardez vos favoris.",
  },
  {
    title: "Restez informé",
    description:
      "Suivez les annonces et les notifications pour ne rien manquer.",
  },
];

export const ROLES = [
  {
    title: "Étudiant",
    description: "Pour accéder aux ressources de sa classe.",
    points: [
      "Documents publics de sa classe",
      "Espace personnel privé",
      "Proposition de documents à la validation",
    ],
  },
  {
    title: "Modérateur",
    description: "Pour animer et garder le contenu de sa classe fiable.",
    points: [
      "Validation ou rejet des documents proposés",
      "Publication de cours et d'annonces",
      "Gestion des étudiants de sa classe",
    ],
  },
  {
    title: "Administrateur",
    description: "Pour superviser l'ensemble de la plateforme.",
    points: [
      "Création des classes et années universitaires",
      "Assignation des modérateurs",
      "Annonces globales pour tous les utilisateurs",
    ],
  },
];

export const CTA = {
  title: "Prêt à rejoindre votre classe ?",
  description:
    "Créez votre compte en quelques minutes avec votre code d'invitation.",
  button: "Commencer maintenant",
};

export const FOOTER_COLUMNS = [
  {
    title: "Plateforme",
    links: NAV_LINKS,
  },
  {
    title: "Compte",
    links: [
      { href: AUTH_LINKS.login, label: "Connexion" },
      { href: AUTH_LINKS.register, label: "Créer un compte" },
    ],
  },
];
