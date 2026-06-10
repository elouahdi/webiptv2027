// ─── Types ────────────────────────────────────────────────────────────────────

export interface PricingPlan {
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
  visible: boolean;
  order: number;
  promoPrice?: number | null;
  features: string[];
  description: string;
  ctaText?: string;
  ctaHref?: string;
}

export interface HeroContent {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
  badgeText: string;
}

export interface AboutContent {
  title: string;
  description: string;
  stat1Label: string;
  stat1Value: string;
  stat2Label: string;
  stat2Value: string;
  stat3Label: string;
  stat3Value: string;
}

export interface FeatureItem {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface FooterContent {
  companyDescription: string;
  whatsappUrl: string;
  email: string;
  phone: string;
  address: string;
  businessHours?: string;
}

export interface SiteMetaPage {
  key: string;
  title: string;
  description: string;
  keywords: string;
  ogImageUrl: string;
}

export interface ContactInfo {
  phone: string;
  phone2: string;
  email: string;
  whatsappUrl: string;
  address: string;
  businessHours: string;
}

export interface AnnouncementBar {
  enabled: boolean;
  text: string;
  backgroundColor: string;
  textColor: string;
  expiresAt: string | null;
  ctaText?: string;
  ctaHref?: string;
}

export interface SiteSettings {
  pricing: PricingPlan[];
  hero: HeroContent;
  about: AboutContent;
  features: FeatureItem[];
  footer: FooterContent;
  seoPages: SiteMetaPage[];
  contact: ContactInfo;
  announcement: AnnouncementBar;
  updatedAt: string;
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULT_SETTINGS: SiteSettings = {
  pricing: [
    {
      slug: '1-mois', name: '1 Mois', price: 17.99, originalPrice: null,
      currency: 'EUR', duration: 'month', badge: null, featured: false,
      visible: true, order: 0, promoPrice: null,
      features: ['Activation instantanée', '45 000 chaînes & films', 'Qualité HD / Full HD / 4K', 'TV de rattrapage (Replay)', 'Support 24h/7j'],
      description: 'Abonnement 1 mois découverte sans engagement.',
    },
    {
      slug: '3-mois', name: '3 Mois', price: 26.99, originalPrice: 53.97,
      savings: '50%', currency: 'EUR', duration: 'month', badge: 'Populaire',
      featured: false, visible: true, order: 1, promoPrice: null,
      features: ['Activation instantanée', '45 000 chaînes & films', 'Qualité HD / Full HD / 4K', 'TV de rattrapage (Replay)', 'Support 24h/7j'],
      description: 'Excellent rapport qualité-prix pour 3 mois.',
    },
    {
      slug: '6-mois', name: '6 Mois', price: 36.99, originalPrice: 107.94,
      savings: '66%', currency: 'EUR', duration: 'month', badge: null,
      featured: false, visible: true, order: 2, promoPrice: null,
      features: ['Activation instantanée', '45 000 chaînes & films', 'Qualité HD / Full HD / 4K', 'TV de rattrapage (Replay)', 'Support 24h/7j'],
      description: 'Notre offre la plus populaire pour toute une saison.',
    },
    {
      slug: '12-mois', name: '12 Mois', subtitle: '+ 3 mois offerts',
      price: 46.99, originalPrice: 215.88, savings: '78%', currency: 'EUR',
      duration: 'month', badge: 'MEILLEURE OFFRE', featured: true,
      visible: true, order: 3, promoPrice: null,
      features: ['Activation instantanée', '45 000 chaînes & films', 'Qualité HD / Full HD / 4K', 'TV de rattrapage (Replay)', 'Support 24h/7j', '3 mois supplémentaires offerts'],
      description: 'Notre meilleure offre: 15 mois au prix de 12.',
    },
    {
      slug: '24-mois', name: '24 Mois', price: 89.99, originalPrice: 431.76,
      savings: '79%', currency: 'EUR', duration: 'month', badge: 'Meilleur Prix/Durée',
      featured: false, visible: true, order: 4, promoPrice: null,
      features: ['Activation instantanée', '45 000 chaînes & films', 'Qualité HD / Full HD / 4K', 'TV de rattrapage (Replay)', 'Support 24h/7j'],
      description: 'Offre VIP ultime pour les passionnés.',
    },
    {
      slug: 'essai-3h', name: 'Essai 3H', price: 0, originalPrice: null,
      currency: 'EUR', duration: 'hour', badge: 'GRATUIT', featured: false,
      visible: true, order: 5, promoPrice: null,
      ctaText: 'Obtenir via WhatsApp',
      ctaHref: 'https://api.whatsapp.com/send?phone=212708245223&text=Bonjour, je souhaite un essai IPTV gratuit de 3h',
      features: ["3 heures d'accès complet", 'Sans carte de crédit', 'Activation immédiate'],
      description: 'Essayez gratuitement pendant 3 heures.',
    },
  ],
  hero: {
    title: 'Le meilleur IPTV premium en France',
    subtitle: "45 000 chaînes HD & 4K. Sport, Films, Séries. Activation en moins de 5 minutes. Essai gratuit disponible.",
    ctaText: 'Voir les offres',
    ctaHref: '/tarifs',
    badgeText: '⭐ 4.9/5 · 140 000+ abonnés satisfaits',
  },
  about: {
    title: 'Pourquoi choisir RegardezIPTV ?',
    description: "Depuis 2020, nous offrons le meilleur service IPTV premium en France. Notre infrastructure dédiée garantit une qualité d'image exceptionnelle et une stabilité de 99.9%.",
    stat1Label: 'Abonnés actifs',
    stat1Value: '140K+',
    stat2Label: 'Chaînes disponibles',
    stat2Value: '45K+',
    stat3Label: 'Disponibilité',
    stat3Value: '99.9%',
  },
  features: [
    { id: 'feat-1', icon: 'Zap', title: 'Activation instantanée', description: 'Votre accès IPTV est prêt en moins de 5 minutes après paiement, 24h/24.' },
    { id: 'feat-2', icon: 'Tv', title: '45 000 chaînes HD & 4K', description: 'Sport, cinéma, séries, chaînes internationales — tout en HD et 4K.' },
    { id: 'feat-3', icon: 'Shield', title: 'Stabilité 99.9%', description: 'Infrastructure dédiée avec redondance pour un service toujours disponible.' },
    { id: 'feat-4', icon: 'Headphones', title: 'Support 24h/7j', description: 'Notre équipe est disponible à toute heure sur WhatsApp.' },
  ],
  footer: {
    companyDescription: 'Le service IPTV premium #1 en France. 45 000 chaînes HD & 4K, activation instantanée.',
    whatsappUrl: 'https://api.whatsapp.com/send?phone=212708245223',
    email: 'contact@regardeziptv.fr',
    phone: '+212 708 245 223',
    address: 'France',
    businessHours: 'Lun–Dim: 8h–22h',
  },
  seoPages: [
    { key: 'home', title: 'RegardezIPTV - Meilleur IPTV Premium France', description: "Le meilleur IPTV premium en France. 45 000 chaînes HD & 4K. Activation instantanée.", keywords: 'iptv, iptv france, abonnement iptv, iptv premium', ogImageUrl: '' },
    { key: 'tarifs', title: 'Tarifs IPTV - Abonnements & Prix | RegardezIPTV', description: 'Découvrez nos offres IPTV à partir de 17,99€. Abonnements 1, 3, 6, 12 et 24 mois.', keywords: 'prix iptv, tarif iptv, abonnement iptv pas cher', ogImageUrl: '' },
    { key: 'blog', title: 'Blog IPTV - Guides & Actualités | RegardezIPTV', description: 'Guides, tutoriels et actualités sur le monde de la télévision en streaming.', keywords: 'blog iptv, guide iptv, tutoriel iptv', ogImageUrl: '' },
  ],
  contact: {
    phone: '+212 708 245 223',
    phone2: '',
    email: 'contact@regardeziptv.fr',
    whatsappUrl: 'https://api.whatsapp.com/send?phone=212708245223',
    address: 'France',
    businessHours: 'Lun–Dim: 8h00–22h00',
  },
  announcement: {
    enabled: false,
    text: '🎉 Offre spéciale : -20% sur tous les abonnements ce week-end !',
    backgroundColor: '#f59e0b',
    textColor: '#000000',
    expiresAt: null,
    ctaText: 'Voir les offres',
    ctaHref: '/tarifs',
  },
  updatedAt: new Date().toISOString(),
};

// ─── MySQL-based storage ─────────────────────────────────────────────────────

let cache: SiteSettings | null = null;

async function ensureSettingsExist() {
  // Check if settings exist in database
  const db = (await import('@/lib/db')).default;
  try {
    const [countResult] = await db.query<any>('SELECT COUNT(*) as count FROM settings WHERE setting_key = ?', ['site_settings']);
    const count = countResult?.count || 0;
    
    if (count === 0) {
      // Insert default settings
      await db.execute(
        'INSERT INTO settings (setting_key, setting_value) VALUES (?, ?)',
        ['site_settings', JSON.stringify(DEFAULT_SETTINGS)]
      );
    }
  } catch (error: any) {
    // If duplicate entry error, settings already exist, ignore
    if (error.code !== 'ER_DUP_ENTRY') {
      throw error;
    }
  }
}

export async function readSettings(): Promise<SiteSettings> {
  if (cache) return structuredClone(cache);
  
  await ensureSettingsExist();
  
  const db = (await import('@/lib/db')).default;
  const result = await db.query<any>('SELECT setting_value FROM settings WHERE setting_key = ?', ['site_settings']);
  const rows = Array.isArray(result) ? result : [result];
  
  if (!rows || rows.length === 0) {
    cache = structuredClone(DEFAULT_SETTINGS);
    return cache;
  }
  
  const stored = JSON.parse(rows[0]?.setting_value || '{}');
  cache = { ...DEFAULT_SETTINGS, ...stored };
  return structuredClone(cache as SiteSettings);
}

export async function writeSettings(data: Partial<SiteSettings>): Promise<SiteSettings> {
  const current = await readSettings();
  const next: SiteSettings = {
    ...current,
    ...data,
    updatedAt: new Date().toISOString(),
  };
  
  const db = (await import('@/lib/db')).default;
  await db.execute(
    'UPDATE settings SET setting_value = ?, updated_at = NOW() WHERE setting_key = ?',
    [JSON.stringify(next), 'site_settings']
  );
  
  cache = structuredClone(next);
  return next;
}

export function invalidateSettingsCache() {
  cache = null;
}
