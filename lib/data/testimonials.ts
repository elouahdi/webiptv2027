export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  avatar?: string;
}

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Marie Dupont',
    location: 'Paris, France',
    rating: 5,
    text: 'Service exceptionnel ! J\'ai testé plusieurs fournisseurs IPTV avant de trouver RegardezIPTV. La qualité 4K est parfaite et aucun buffering même pendant les matches de football.',
  },
  {
    id: '2',
    name: 'Ahmed Benali',
    location: 'Lyon, France',
    rating: 5,
    text: 'Installation ultra simple sur ma Fire TV Stick. Le support a répondu en 3 minutes quand j\'avais une question. Sérieux et professionnel, je recommande à 100%.',
  },
  {
    id: '3',
    name: 'Sophie Martin',
    location: 'Marseille, France',
    rating: 5,
    text: 'Le catalogue de chaînes est incroyable. Toutes les chaînes françaises, belges, suisses et beaucoup de chaînes internationales. Prix imbattable pour cette qualité.',
  },
  {
    id: '4',
    name: 'Karim Lefevre',
    location: 'Bruxelles, Belgique',
    rating: 5,
    text: 'J\'utilise ce service depuis 6 mois sur ma Smart TV Samsung. Aucun problème, activation immédiate après paiement. Le pack 12 mois est vraiment avantageux.',
  },
  {
    id: '5',
    name: 'Isabelle Moreau',
    location: 'Nice, France',
    rating: 5,
    text: 'VOD à jour avec les derniers films et séries. Mes enfants adorent. Le service client est vraiment réactif via WhatsApp. Merci pour votre professionnalisme !',
  },
];

// Synchronous exports for client-side components (use cached data)
export function getAllTestimonialsSync(): Testimonial[] {
  return DEFAULT_TESTIMONIALS;
}

export function getTestimonialByIdSync(id: string): Testimonial | undefined {
  return DEFAULT_TESTIMONIALS.find((t) => t.id === id);
}
