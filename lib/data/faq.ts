export interface FAQ {
  question: string;
  answer: string;
  category: string;
}

const DEFAULT_FAQS: FAQ[] = [
  {
    question: 'Comment fonctionne l\'abonnement IPTV ?',
    answer: 'Après votre achat, vous recevez instantanément vos identifiants de connexion par email. Vous les entrez dans l\'application IPTV de votre choix (Smarters Pro, TiviMate, GSE Smart IPTV, etc.) sur votre appareil, et vous accédez immédiatement à toutes les chaînes et VOD.',
    category: 'Général',
  },
  {
    question: 'Sur quels appareils puis-je utiliser mon abonnement ?',
    answer: 'Notre service est compatible avec Smart TV (Samsung, LG), Android TV, Fire TV Stick, iPhone/iPad, PC/Mac, MAG Box, Kodi, et Android Box. Nous fournissons des guides d\'installation détaillés pour chaque appareil.',
    category: 'Compatibilité',
  },
  {
    question: 'Quelle est la qualité des chaînes ?',
    answer: 'Nous proposons des chaînes en HD, Full HD et 4K selon le contenu. La qualité dépend également de votre connexion internet. Nous recommandons une connexion minimale de 10 Mbps pour le HD et 25 Mbps pour la 4K.',
    category: 'Qualité',
  },
  {
    question: 'Puis-je tester le service avant d\'acheter ?',
    answer: 'Oui, nous proposons un essai gratuit de 3 heures sans engagement. Contactez-nous via WhatsApp pour obtenir votre essai. Aucune carte bancaire n\'est requise.',
    category: 'Essai',
  },
  {
    question: 'Le service est-il stable et sans coupures ?',
    answer: 'Nos serveurs sont optimisés pour garantir une disponibilité de 99.9%. Nous utilisons des technologies anti-buffering avancées et des serveurs redondants pour assurer une expérience fluide sans interruptions.',
    category: 'Stabilité',
  },
  {
    question: 'Comment fonctionne la garantie de remboursement ?',
    answer: 'Nous offrons une garantie satisfait ou remboursé de 7 jours. Si le service ne répond pas à vos attentes, contactez notre support et nous vous rembourserons intégralement, sans questions.',
    category: 'Garantie',
  },
  {
    question: 'Puis-je utiliser mon abonnement sur plusieurs appareils ?',
    answer: 'Chaque abonnement est valide pour une connexion simultanée. Si vous souhaitez utiliser le service sur plusieurs appareils en même temps, vous pouvez acheter des connexions supplémentaires à prix réduit.',
    category: 'Utilisation',
  },
  {
    question: 'Comment contacter le support client ?',
    answer: 'Notre support est disponible 24h/24 et 7j/7 via WhatsApp au +212 708 245 223. Nous répondons généralement en moins de 5 minutes. Vous pouvez aussi nous contacter par email à contact@regardez-iptv.fr.',
    category: 'Support',
  },
];

// Synchronous exports for client-side components (use cached data)
export function getAllFAQsSync(): FAQ[] {
  return DEFAULT_FAQS;
}

export function getFAQByCategorySync(category: string): FAQ[] {
  return DEFAULT_FAQS.filter((faq) => faq.category === category);
}
