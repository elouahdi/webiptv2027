import db from '@/lib/db';
import type { Plan } from './plans';

const DEFAULT_PLANS: Plan[] = [
  {
    slug: '1-mois',
    name: '1 Mois',
    price: 17.99,
    originalPrice: null,
    savings: undefined,
    currency: 'EUR',
    duration: 'month',
    badge: null,
    featured: false,
    reviewCount: 1250,
    rating: 4.8,
    features: [
      'Activation instantanée',
      '45 000 chaînes & films',
      'Qualité HD / Full HD / 4K',
      'TV de rattrapage (Replay)',
      'Support 24h/7j',
    ],
    description: 'Abonnement 1 mois découverte sans engagement.',
    highlights: [],
    faq: [],
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
    reviewCount: 2100,
    rating: 4.9,
    features: [
      'Activation instantanée',
      '45 000 chaînes & films',
      'Qualité HD / Full HD / 4K',
      'TV de rattrapage (Replay)',
      'Support 24h/7j',
    ],
    description: 'Excellent rapport qualité-prix pour 3 mois.',
    highlights: [],
    faq: [],
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
    reviewCount: 3400,
    rating: 4.9,
    features: [
      'Activation instantanée',
      '45 000 chaînes & films',
      'Qualité HD / Full HD / 4K',
      'TV de rattrapage (Replay)',
      'Support 24h/7j',
    ],
    description: 'Notre offre la plus populaire pour toute une saison.',
    highlights: [],
    faq: [],
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
    reviewCount: 5600,
    rating: 4.95,
    features: [
      'Activation instantanée',
      '45 000 chaînes & films',
      'Qualité HD / Full HD / 4K',
      'TV de rattrapage (Replay)',
      'Support 24h/7j',
      '3 mois supplémentaires offerts',
    ],
    description: 'Notre meilleure offre: 15 mois au prix de 12.',
    highlights: [],
    faq: [],
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
    reviewCount: 8900,
    rating: 4.97,
    features: [
      'Activation instantanée',
      '45 000 chaînes & films',
      'Qualité HD / Full HD / 4K',
      'TV de rattrapage (Replay)',
      'Support 24h/7j',
    ],
    description: 'Offre VIP ultime pour les passionnés.',
    highlights: [],
    faq: [],
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
    reviewCount: 450,
    rating: 4.7,
    features: [
      '3 heures d\'accès complet',
      'Sans carte de crédit',
      'Activation immédiate',
    ],
    ctaText: 'Obtenir via WhatsApp',
    ctaHref: 'https://api.whatsapp.com/send?phone=212708245223&text=Bonjour, je souhaite un essai IPTV gratuit de 3h',
    description: 'Essayez gratuitement pendant 3 heures.',
    highlights: [],
    faq: [],
  },
];

async function ensurePlansExist() {
  const existing = await db.query<any>('SELECT COUNT(*) as count FROM plans');
  if (existing[0].count === 0) {
    // Insert default plans
    for (const plan of DEFAULT_PLANS) {
      const planId = await db.execute(
        `INSERT INTO plans (slug, name, subtitle, price, original_price, savings, currency, duration, badge, featured, visible, review_count, rating, description, cta_text, cta_href, sort_order) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          plan.slug,
          plan.name,
          plan.subtitle || null,
          plan.price,
          plan.originalPrice,
          plan.savings || null,
          plan.currency,
          plan.duration,
          plan.badge,
          plan.featured,
          true,
          plan.reviewCount,
          plan.rating,
          plan.description,
          plan.ctaText || null,
          plan.ctaHref || null,
          DEFAULT_PLANS.indexOf(plan),
        ]
      );

      const insertedId = (planId as any).insertId;
      
      // Insert features
      for (let i = 0; i < plan.features.length; i++) {
        await db.execute(
          'INSERT INTO plan_features (plan_id, feature, included, sort_order) VALUES (?, ?, ?, ?)',
          [insertedId, plan.features[i], true, i]
        );
      }
    }
  }
}

export async function getAllPlans(): Promise<Plan[]> {
  await ensurePlansExist();
  
  const plans = await db.query<any>(
    'SELECT * FROM plans WHERE visible = true ORDER BY sort_order'
  );
  
  const result: Plan[] = [];
  
  for (const plan of plans) {
    const features = await db.query<any>(
      'SELECT feature FROM plan_features WHERE plan_id = ? AND included = true ORDER BY sort_order',
      [plan.id]
    );
    
    result.push({
      slug: plan.slug,
      name: plan.name,
      subtitle: plan.subtitle,
      price: parseFloat(plan.price),
      originalPrice: plan.original_price ? parseFloat(plan.original_price) : null,
      savings: plan.savings || undefined,
      currency: plan.currency,
      duration: plan.duration,
      badge: plan.badge,
      featured: plan.featured,
      reviewCount: plan.review_count,
      rating: parseFloat(plan.rating),
      features: features.map((f: any) => f.feature),
      ctaText: plan.cta_text,
      ctaHref: plan.cta_href,
      description: plan.description,
      highlights: [], // Will be populated from settings
      faq: [], // Will be populated from settings
    });
  }
  
  return result;
}

export async function getPlanBySlug(slug: string): Promise<Plan | undefined> {
  const plans = await getAllPlans();
  return plans.find((plan) => plan.slug === slug);
}
