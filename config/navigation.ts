export const NAV_LINKS = [
  { label: 'Accueil', href: '/' },
  { label: 'Plans', href: '/nos-plans' },
  { label: 'Chaînes', href: '/chaines' },
  { label: 'Sports', href: '/programme-sports' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
  { label: 'FAQ', href: '/faq' },
] as const;

export const FOOTER_LINKS = {
  about: [
    { label: 'À propos', href: '/' },
    { label: 'Contact', href: '/contact' },
    { label: 'Essai gratuit', href: '/essai-gratuit' },
  ],
  quick: [
    { label: 'Accueil', href: '/' },
    { label: 'Nos plans', href: '/nos-plans' },
    { label: 'Chaînes', href: '/chaines' },
    { label: 'Sports', href: '/programme-sports' },
    { label: 'Blog', href: '/blog' },
    { label: 'FAQ', href: '/faq' },
  ],
  plans: [
    { label: '1 Mois', href: '/nos-plans' },
    { label: '3 Mois', href: '/nos-plans' },
    { label: '6 Mois', href: '/nos-plans' },
    { label: '12 Mois', href: '/nos-plans' },
  ],
  legal: [
    { label: 'CGU', href: '/legal/cgu' },
    { label: 'Politique de confidentialité', href: '/legal/politique-confidentialite' },
    { label: 'Remboursement', href: '/legal/remboursement' },
  ],
} as const;
