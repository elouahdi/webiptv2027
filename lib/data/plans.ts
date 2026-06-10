export interface Plan {
  slug: string;
  name: string;
  subtitle?: string;
  price: number;
  originalPrice: number | null;
  savings?: string;
  currency: string;
  duration: string;
  badge: string | null;
  featured: boolean;
  reviewCount: number;
  rating: number;
  features: string[];
  ctaText?: string;
  ctaHref?: string;
  description: string;
  highlights: {
    icon: string;
    title: string;
    text: string;
  }[];
  faq: {
    question: string;
    answer: string;
  }[];
}

const DEFAULT_PLANS: Plan[] = [
  {
    slug: '1-mois',
    name: '1 Mois',
    price: 17.99,
    originalPrice: null,
    currency: 'EUR',
    duration: 'month',
    badge: null,
    featured: false,
    reviewCount: 8430,
    rating: 4.95,
    features: [
      'Activation instantanée',
      '45 000 chaînes & films',
      'Qualité HD / Full HD / 4K',
      'Mises à jour automatiques',
      'TV de rattrapage (Replay)',
      'Support 24h/7j',
    ],
    description: "Notre abonnement 1 mois est parfait pour découvrir notre service IPTV premium sans engagement. Accès immédiat à 45 000 chaînes HD et 4K, activation en moins de 5 minutes.",
    highlights: [
      {
        icon: 'Zap',
        title: 'Activation Instantanée',
        text: 'Votre accès est prêt en moins de 5 minutes après paiement, 24h/24.',
      },
      {
        icon: 'Shield',
        title: 'Sans Engagement',
        text: "Aucun renouvellement automatique. Vous choisissez quand vous revenez.",
      },
      {
        icon: 'Tv',
        title: '45 000 Chaînes',
        text: 'Sport, cinéma, séries, chaînes internationales — tout en HD et 4K.',
      },
    ],
    faq: [
      {
        question: 'Puis-je renouveler après 1 mois ?',
        answer: 'Oui, contactez-nous sur WhatsApp avant expiration et nous renouvelons en quelques minutes.',
      },
      {
        question: "L'abonnement 1 mois inclut-il le sport ?",
        answer: 'Oui, BeIN Sports, RMC Sport et toutes les chaînes sport sont incluses dès le premier mois.',
      },
    ],
  },
  {
    slug: '3-mois',
    name: '3 Mois',
    price: 26.99,
    originalPrice: 53.97,
    savings: '50%',
    currency: 'EUR',
    duration: 'month',
    badge: 'Populaire',
    featured: false,
    reviewCount: 23967,
    rating: 4.95,
    features: [
      'Activation instantanée',
      '45 000 chaînes & films',
      'Qualité HD / Full HD / 4K',
      'Mises à jour automatiques',
      'TV de rattrapage (Replay)',
      'Support 24h/7j',
    ],
    description: "L'abonnement 3 mois offre un excellent rapport qualité-prix pour profiter de toute une saison de sport ou de séries sans interruption. Idéal pour les utilisateurs réguliers.",
    highlights: [
      {
        icon: 'TrendingDown',
        title: 'Économie de 5€',
        text: 'Par rapport à 3 mois séparés, vous économisez immédiatement sur votre abonnement.',
      },
      {
        icon: 'Repeat',
        title: 'Stabilité 3 Mois',
        text: 'Profitez de 3 mois sans vous soucier du renouvellement mensuel.',
      },
      {
        icon: 'Star',
        title: 'Support Prioritaire',
        text: 'Les abonnés 3 mois bénéficient d\'une assistance prioritaire sur WhatsApp.',
      },
    ],
    faq: [
      {
        question: 'Le plan 3 mois est-il renouvelable ?',
        answer: 'Oui, contactez-nous avant expiration. Les clients fidèles reçoivent souvent des réductions exclusives.',
      },
      {
        question: 'Puis-je changer d\'application pendant les 3 mois ?',
        answer: 'Oui, un changement d\'application est possible, contactez notre support WhatsApp.',
      },
    ],
  },
  {
    slug: '6-mois',
    name: '6 Mois',
    price: 36.99,
    originalPrice: 107.94,
    savings: '66%',
    currency: 'EUR',
    duration: 'month',
    badge: null,
    featured: false,
    reviewCount: 40167,
    rating: 4.95,
    features: [
      'Activation instantanée',
      '45 000 chaînes & films',
      'Qualité HD / Full HD / 4K',
      'Mises à jour automatiques',
      'TV de rattrapage (Replay)',
      'Support 24h/7j',
    ],
    description: "Notre abonnement 6 mois est notre offre la plus populaire. Idéal pour toute une saison de foot, de séries ou de films — avec accès aux chaînes sport premium inclus.",
    highlights: [
      {
        icon: 'Trophy',
        title: 'Saison Complète',
        text: 'Couvrez toute une saison de Ligue 1, Premier League, Champions League sans interruption.',
      },
      {
        icon: 'Zap',
        title: 'Serveurs Premium',
        text: 'Les abonnés 6 mois accèdent à nos serveurs haute performance, zapping ultra-rapide.',
      },
      {
        icon: 'Gift',
        title: 'Meilleur Rapport Prix',
        text: 'À seulement 6,67€/mois, c\'est notre meilleur rapport qualité-prix sans bonus.',
      },
    ],
    faq: [
      {
        question: 'BeIN Sports et RMC sont-ils inclus ?',
        answer: 'Oui, toutes les chaînes sport premium sont incluses : BeIN Sports 1-3, RMC Sport 1-2, DAZN.',
      },
      {
        question: 'Combien d\'appareils puis-je connecter ?',
        answer: '1 connexion simultanée par défaut. Des connexions multi-écrans sont disponibles sur demande.',
      },
    ],
  },
  {
    slug: '12-mois',
    name: '12 Mois',
    subtitle: '+ 3 mois offerts',
    price: 46.99,
    originalPrice: 215.88,
    savings: '78%',
    currency: 'EUR',
    duration: 'month',
    badge: 'MEILLEURE OFFRE',
    featured: true,
    reviewCount: 57267,
    rating: 4.95,
    features: [
      'Activation instantanée',
      '45 000 chaînes & films',
      'Qualité HD / Full HD / 4K',
      'Mises à jour automatiques',
      'TV de rattrapage (Replay)',
      'Support 24h/7j',
      '3 mois supplémentaires offerts',
    ],
    description: "Notre meilleure offre : 12 mois d'abonnement IPTV premium avec 3 mois offerts, soit 15 mois au prix de 12 à seulement 46,99€. Le choix de nos clients les plus satisfaits.",
    highlights: [
      {
        icon: 'Gift',
        title: '3 Mois Offerts',
        text: 'Vous payez 12 mois et profitez de 15 mois — une valeur de 15€ offerte automatiquement.',
      },
      {
        icon: 'Crown',
        title: 'Accès VIP Complet',
        text: 'Tous les bouquets sport, cinéma, adultes et internationaux sont débloqués sans supplément.',
      },
      {
        icon: 'ShieldCheck',
        title: 'Garantie 7 Jours',
        text: 'Remboursement intégral garanti dans les 7 jours si vous n\'êtes pas satisfait, sans question.',
      },
    ],
    faq: [
      {
        question: 'Comment fonctionnent les 3 mois offerts ?',
        answer: 'Votre abonnement est activé pour 15 mois dès le premier jour. Aucune action requise de votre part.',
      },
      {
        question: 'Puis-je utiliser cet abonnement sur Smart TV ?',
        answer: 'Oui, compatible Samsung, LG, Android TV, Firestick, MAG Box, iOS, Android et PC.',
      },
      {
        question: 'Y a-t-il un renouvellement automatique ?',
        answer: 'Non. Vous serez notifié avant expiration et choisissez librement de renouveler ou non.',
      },
    ],
  },
  {
    slug: '24-mois',
    name: '24 Mois',
    price: 89.99,
    originalPrice: 431.76,
    savings: '79%',
    currency: 'EUR',
    duration: 'month',
    badge: 'Meilleur Prix/Durée',
    featured: false,
    reviewCount: 12500,
    rating: 4.95,
    features: [
      'Activation instantanée',
      '45 000 chaînes & films',
      'Qualité HD / Full HD / 4K',
      'Mises à jour automatiques',
      'TV de rattrapage (Replay)',
      'Support 24h/7j',
    ],
    description: "L'abonnement 24 mois est notre offre VIP ultime : 30 mois au prix de 24, ligne dédiée prioritaire et accès à l'intégralité de notre catalogue. Pour les vrais passionnés.",
    highlights: [
      {
        icon: 'Crown',
        title: 'Ligne VIP Dédiée',
        text: 'Serveur exclusif réservé aux abonnés longue durée — zapping instantané garanti.',
      },
      {
        icon: 'Gift',
        title: '6 Mois Offerts',
        text: '30 mois au prix de 24 — vous économisez l\'équivalent de 6 mois d\'abonnement.',
      },
      {
        icon: 'Headphones',
        title: 'Support Dédié',
        text: 'Numéro WhatsApp prioritaire avec temps de réponse garanti sous 30 minutes.',
      },
    ],
    faq: [
      {
        question: 'La ligne VIP est-elle vraiment différente ?',
        answer: 'Oui, nos abonnés 24 mois sont sur un serveur séparé avec bande passante dédiée et moins de charge.',
      },
      {
        question: 'Que se passe-t-il si j\'ai un problème ?',
        answer: 'Votre ticket est traité en priorité absolue, résolution garanti en moins de 2 heures.',
      },
    ],
  },
  {
    slug: 'essai-3h',
    name: 'Essai 3H',
    price: 0,
    originalPrice: null,
    currency: 'EUR',
    duration: 'hour',
    badge: 'GRATUIT',
    featured: false,
    reviewCount: 0,
    rating: 0,
    ctaText: 'Obtenir via WhatsApp',
    ctaHref: 'https://api.whatsapp.com/send?phone=212708245223&text=Bonjour, je souhaite un essai IPTV gratuit de 3h',
    features: [
      '3 heures d\'accès complet',
      'Sans carte de crédit',
      'Activation immédiate',
    ],
    description: "Essayez notre service IPTV gratuitement pendant 3 heures. Accès complet à toutes les chaînes et fonctionnalités, sans engagement et sans carte de crédit.",
    highlights: [
      {
        icon: 'Clock',
        title: '3 Heures Gratuites',
        text: 'Testez toutes les fonctionnalités pendant 3 heures, sans aucun engagement.',
      },
      {
        icon: 'Shield',
        title: 'Sans Carte de Crédit',
        text: 'Aucune information de paiement requise pour l\'essai gratuit.',
      },
      {
        icon: 'Zap',
        title: 'Accès Complet',
        text: 'Accès à toutes les chaînes, VOD et fonctionnalités pendant la période d\'essai.',
      },
    ],
    faq: [
      {
        question: 'L\'essai est-il vraiment gratuit ?',
        answer: 'Oui, 100% gratuit. Aucune carte de crédit requise et aucun engagement.',
      },
      {
        question: 'Que se passe-t-il après les 3 heures ?',
        answer: 'Votre accès expire automatiquement. Vous pouvez choisir de souscrire à un abonnement si vous êtes satisfait.',
      },
    ],
  },
];

// Synchronous exports for client-side components (use cached data)
export function getAllPlansSync(): Plan[] {
  return DEFAULT_PLANS;
}

export function getPlanBySlugSync(slug: string): Plan | undefined {
  return DEFAULT_PLANS.find((plan) => plan.slug === slug);
}
