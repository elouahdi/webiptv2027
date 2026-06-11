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
  reviewCount?: number;
  rating?: number;
  highlights?: { icon: string; title: string; text: string; }[];
  faq?: { question: string; answer: string; }[];
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
      visible: true, order: 0, promoPrice: null, reviewCount: 1250, rating: 4.8,
      features: ['Activation instantanée', '45 000 chaînes & films', 'Qualité HD / Full HD / 4K', 'TV de rattrapage (Replay)', 'Support 24h/7j'],
      description: 'Abonnement 1 mois découverte sans engagement.',
    },
    {
      slug: '3-mois', name: '3 Mois', price: 26.99, originalPrice: 53.97,
      savings: '50%', currency: 'EUR', duration: 'month', badge: 'Populaire',
      featured: false, visible: true, order: 1, promoPrice: null, reviewCount: 2100, rating: 4.9,
      features: ['Activation instantanée', '45 000 chaînes & films', 'Qualité HD / Full HD / 4K', 'TV de rattrapage (Replay)', 'Support 24h/7j'],
      description: 'Excellent rapport qualité-prix pour 3 mois.',
    },
    {
      slug: '6-mois', name: '6 Mois', price: 36.99, originalPrice: 107.94,
      savings: '66%', currency: 'EUR', duration: 'month', badge: null,
      featured: false, visible: true, order: 2, promoPrice: null, reviewCount: 3400, rating: 4.9,
      features: ['Activation instantanée', '45 000 chaînes & films', 'Qualité HD / Full HD / 4K', 'TV de rattrapage (Replay)', 'Support 24h/7j'],
      description: 'Notre offre la plus populaire pour toute une saison.',
    },
    {
      slug: '12-mois', name: '12 Mois', subtitle: '+ 3 mois offerts',
      price: 46.99, originalPrice: 215.88, savings: '78%', currency: 'EUR',
      duration: 'month', badge: 'MEILLEURE OFFRE', featured: true,
      visible: true, order: 3, promoPrice: null, reviewCount: 5600, rating: 4.95,
      features: ['Activation instantanée', '45 000 chaînes & films', 'Qualité HD / Full HD / 4K', 'TV de rattrapage (Replay)', 'Support 24h/7j', '3 mois supplémentaires offerts'],
      description: 'Notre meilleure offre: 15 mois au prix de 12.',
    },
    {
      slug: '24-mois', name: '24 Mois', price: 89.99, originalPrice: 431.76,
      savings: '79%', currency: 'EUR', duration: 'month', badge: 'Meilleur Prix/Durée',
      featured: false, visible: true, order: 4, promoPrice: null, reviewCount: 8900, rating: 4.97,
      features: ['Activation instantanée', '45 000 chaînes & films', 'Qualité HD / Full HD / 4K', 'TV de rattrapage (Replay)', 'Support 24h/7j'],
      description: 'Offre VIP ultime pour les passionnés.',
    },
    {
      slug: 'essai-3h', name: 'Essai 3H', price: 0, originalPrice: null,
      currency: 'EUR', duration: 'hour', badge: 'GRATUIT', featured: false,
      visible: true, order: 5, promoPrice: null, reviewCount: 450, rating: 4.7,
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

// ─── Storage (MySQL with file fallback) ──────────────────────────────────────

import { promises as fs } from 'fs';
import path from 'path';

let cache: SiteSettings | null = null;
const SETTINGS_FILE = path.join(process.cwd(), 'data', 'cms', 'settings.json');

async function readFromDB(): Promise<SiteSettings | null> {
  try {
    const { query } = await import('@/lib/db');
    const [countResult] = await query<any>('SELECT COUNT(*) as count FROM settings WHERE setting_key = ?', ['site_settings']);
    const count = countResult?.count || 0;

    if (count === 0) {
      const { execute } = await import('@/lib/db');
      await execute(
        'INSERT INTO settings (setting_key, setting_value) VALUES (?, ?)',
        ['site_settings', JSON.stringify(DEFAULT_SETTINGS)]
      );
    }

    const rows = await query<any>('SELECT setting_value FROM settings WHERE setting_key = ?', ['site_settings']);
    if (rows?.length) {
      const raw = rows[0].setting_value;
      if (!raw) return null;
      // The mysql2 driver may already decode JSON columns to objects. Handle
      // both cases (string or object) defensively.
      if (typeof raw === 'string') {
        try { return JSON.parse(raw || '{}'); } catch (err) { return null; }
      }
      if (typeof raw === 'object') {
        return raw as SiteSettings;
      }
    }
  } catch {}
  return null;
}

async function readFromFile(): Promise<SiteSettings | null> {
  try {
    const raw = await fs.readFile(SETTINGS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function writeToDB(data: SiteSettings): Promise<boolean> {
  try {
    const { execute } = await import('@/lib/db');
    await execute(
      'UPDATE settings SET setting_value = ?, updated_at = NOW() WHERE setting_key = ?',
      [JSON.stringify(data), 'site_settings']
    );
    return true;
  } catch (err) {
    console.error('[settings-storage] writeToDB error:', err);
    return false;
  }
}

async function writeToFile(data: SiteSettings): Promise<boolean> {
  try {
    await fs.writeFile(SETTINGS_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch {
    return false;
  }
}

export async function readSettings({ bypassCache }: { bypassCache?: boolean } = {}): Promise<SiteSettings> {
  // Always prefer the DB as the source of truth. In-memory `cache` can become
  // stale across multiple Node/edge processes when running Next.js dev or in
  // clustered environments, so avoid returning it as the primary source.
  // `bypassCache` exists for callers that explicitly want to ignore DB/file reads.

  // Do not return `cache` here — prefer reading the DB/file every time to
  // avoid serving stale settings from an in-memory cache in other Next.js
  // server processes. Callers that explicitly want the process-local cache
  // can pass `bypassCache: false` and use `cache` afterwards, but default
  // behavior is to re-load from the DB/file.

  const fromDB = await readFromDB();
  if (fromDB) {
    cache = { ...DEFAULT_SETTINGS, ...fromDB };
    return structuredClone(cache);
  }

  const fromFile = await readFromFile();
  if (fromFile) {
    cache = { ...DEFAULT_SETTINGS, ...fromFile };
    return structuredClone(cache);
  }

  cache = structuredClone(DEFAULT_SETTINGS);
  return structuredClone(cache);
}

export async function writeSettings(data: Partial<SiteSettings>): Promise<SiteSettings> {
  const current = await readSettings();
  const next: SiteSettings = {
    ...current,
    ...data,
    updatedAt: new Date().toISOString(),
  };

  const wroteDB = await writeToDB(next);
  if (!wroteDB) {
    console.error('[settings-storage] writeToDB failed, falling back to file storage');
    await writeToFile(next);
    // Clear process cache so subsequent reads re-load from file/DB as available.
    cache = null;
    return next;
  }

  // After a successful DB write, re-load the settings from DB so the value we
  // return (and store in cache) exactly matches what's persisted. This helps
  // avoid cross-process inconsistencies where one process writes and another
  // still serves stale in-memory data.
  cache = null;
  const reloaded = await readSettings();
  return reloaded;
}

export function invalidateSettingsCache() {
  cache = null;
}
