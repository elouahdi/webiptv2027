'use client';

import { useState, useMemo } from 'react';
import { useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Search,
  ShoppingCart,
  ChevronRight,
  Zap,
  ExternalLink,
  X,
  Monitor,
  Smartphone,
  Tv,
  Box,
  Filter,
  BookOpen,
  Star,
  Sparkles,
} from 'lucide-react';
import { getLocalizedPath } from '@/lib/i18n';
import { useTranslation } from '@/hooks/useTranslation';

interface IPTVApp {
  id: string;
  name: string;
  logo: string;
  category: 'smartphone' | 'smart_tv' | 'computer' | 'box';
  platforms: string[];
  price_type: 'free' | 'paid';
  price_amount: string;
  description: string;
  steps: string[];
  guide_slug?: string;
}

const APPS: IPTVApp[] = [
  {
    id: 'gse-smart-iptv', name: 'GSE Smart IPTV', logo: '📱', category: 'smartphone',
    platforms: ['iOS', 'Android'], price_type: 'free', price_amount: '',
    description: 'Application IPTV la plus populaire au monde. Support M3U, Xtream Codes, et EPG intégré.',
    steps: ['Télécharger sur App Store ou Google Play', 'Ouvrir l\'application', 'Cliquer sur "+" en haut à droite', 'Ajouter votre playlist M3U ou vos identifiants Xtream Codes', 'Patienter pendant le chargement des chaînes'],
    guide_slug: 'gse-smart-iptv-guide-complet',
  },
  {
    id: 'iptv-smarters-pro', name: 'IPTV Smarters Pro', logo: '📺', category: 'smartphone',
    platforms: ['iOS', 'Android'], price_type: 'paid', price_amount: '3,49€',
    description: 'Interface moderne, multi-playlists, EPG intégré, support VOD.',
    steps: ['Télécharger IPTV Smarters Pro', 'Ouvrir l\'application', 'Sélectionner "Xtream Codes API"', 'Entrer vos identifiants RegardezIPTV', 'Profiter de vos chaînes et VOD'],
  },
  {
    id: 'tivimate', name: 'Tivimate', logo: '🖥️', category: 'smartphone',
    platforms: ['Android', 'Android TV', 'Fire Stick'], price_type: 'paid', price_amount: '4,99€/an',
    description: 'Meilleure application IPTV pour Android TV. Interface TV fluide, EPG avancé.',
    steps: ['Installer Tivimate depuis Google Play Store', 'Ouvrir l\'application', 'Aller dans Paramètres > Playlists', 'Ajouter une nouvelle playlist', 'Entrer l\'URL M3U fournie par RegardezIPTV'],
    guide_slug: 'tivimate-guide-installation',
  },
  {
    id: 'xciptv', name: 'XCIPTV', logo: '📲', category: 'smartphone',
    platforms: ['Android'], price_type: 'free', price_amount: '',
    description: 'Application simple et légère. Support Xtream Codes et M3U.',
    steps: ['Télécharger l\'APK XCIPTV', 'Installer l\'application', 'Entrer l\'URL de votre service IPTV', 'Se connecter avec vos identifiants'],
  },
  {
    id: 'ott-navigator', name: 'OTT Navigator', logo: '🧭', category: 'smartphone',
    platforms: ['Android', 'Android TV', 'Fire Stick'], price_type: 'free', price_amount: '',
    description: 'Très personnalisable, support M3U et Xtream Codes, interface épurée.',
    steps: ['Installer OTT Navigator depuis Google Play', 'Ouvrir l\'application', 'Ajouter une source (M3U ou API)', 'Personnaliser l\'interface selon vos goûts'],
  },
  {
    id: 'iptv-extreme', name: 'IPTV Extreme', logo: '🔴', category: 'smartphone',
    platforms: ['Android'], price_type: 'free', price_amount: '',
    description: 'Application complète avec EPG, enregistrement, chromecast intégré.',
    steps: ['Télécharger IPTV Extreme', 'Installer l\'application', 'Ajouter votre playlist M3U', 'Configurer l\'EPG'],
  },
  {
    id: 'iptv-pro', name: 'IPTV Pro', logo: '💎', category: 'smartphone',
    platforms: ['Android'], price_type: 'paid', price_amount: '3,99€',
    description: 'Version pro avec support multi-playlists, EPG avancé, pas de pubs.',
    steps: ['Acheter IPTV Pro sur Google Play', 'Installer l\'application', 'Ajouter votre playlist M3U', 'Configurer l\'EPG et les favoris'],
  },
  {
    id: 'kodi', name: 'Kodi', logo: '🎮', category: 'smartphone',
    platforms: ['iOS', 'Android', 'Windows', 'Mac', 'Linux'], price_type: 'free', price_amount: '',
    description: 'Centre multimédia complet. Ajoutez PVR IPTV Simple Client pour lire vos playlists.',
    steps: ['Télécharger Kodi sur votre appareil', 'Installer l\'application', 'Aller dans Add-ons > PVR', 'Installer PVR IPTV Simple Client', 'Configurer avec votre URL M3U'],
  },
  {
    id: 'smart-iptv', name: 'Smart IPTV (SIPTV)', logo: '📺', category: 'smart_tv',
    platforms: ['Samsung', 'LG'], price_type: 'paid', price_amount: '5,49€',
    description: 'Application légère et fiable pour Samsung et LG. Upload facile via le site web.',
    steps: ['Installer Smart IPTV sur votre TV', 'Ouvrir l\'application', 'Noter l\'adresse MAC affichée', 'Aller sur siptv.app', 'Uploader votre playlist M3U avec l\'adresse MAC'],
  },
  {
    id: 'ss-iptv', name: 'SS IPTV', logo: '📡', category: 'smart_tv',
    platforms: ['Samsung', 'LG'], price_type: 'free', price_amount: '',
    description: 'Navigation simple, support M3U, activation rapide.',
    steps: ['Installer SS IPTV depuis le store TV', 'Ouvrir l\'application', 'Aller dans Paramètres > Contenu', 'Ajouter l\'URL M3U de RegardezIPTV'],
    guide_slug: 'configurer-code-iptv-ss-iptv',
  },
  {
    id: 'net-iptv', name: 'Net IPTV', logo: '🌐', category: 'smart_tv',
    platforms: ['Samsung', 'LG'], price_type: 'paid', price_amount: '',
    description: 'Alternative moderne à Smart IPTV, interface élégante.',
    steps: ['Installer Net IPTV sur votre Smart TV', 'Ouvrir l\'application', 'Uploader votre playlist via netiptv.eu', 'Redémarrer l\'application'],
  },
  {
    id: 'ibo-player', name: 'IBO Player', logo: '🎯', category: 'smart_tv',
    platforms: ['Samsung', 'LG'], price_type: 'paid', price_amount: '',
    description: 'Interface élégante, support multi-playlists, EPG intégré.',
    steps: ['Installer IBO Player sur votre Smart TV', 'Ouvrir l\'application', 'Noter l\'adresse MAC', 'Uploader votre playlist sur iboproplayer.com'],
  },
  {
    id: 'duplex-iptv', name: 'Duplex IPTV', logo: '🔄', category: 'smart_tv',
    platforms: ['Samsung', 'LG'], price_type: 'paid', price_amount: '',
    description: 'Support 4K, EPG avancé, interface personnalisable.',
    steps: ['Installer Duplex IPTV depuis le store TV', 'Ouvrir l\'application', 'Ajouter votre playlist M3U', 'Configurer l\'EPG dans les paramètres'],
  },
  {
    id: 'flix-iptv', name: 'Flix IPTV', logo: '🍿', category: 'smart_tv',
    platforms: ['Samsung', 'LG', 'Android TV'], price_type: 'paid', price_amount: '2€/mois',
    description: 'Interface style Netflix, multi-playlists, support 4K, EPG complet.',
    steps: ['Installer Flix IPTV sur votre TV', 'Ouvrir l\'application', 'Activer sur flixiptv.eu', 'Uploader votre playlist M3U'],
    guide_slug: 'flix-iptv-guide-installation',
  },
  {
    id: 'smart-one-iptv', name: 'Smart One IPTV', logo: '1️⃣', category: 'smart_tv',
    platforms: ['Samsung', 'LG', 'Android TV'], price_type: 'paid', price_amount: '',
    description: 'Application premium avec interface moderne, VOD, séries intégrées.',
    steps: ['Installer Smart One IPTV', 'Ouvrir l\'application', 'Activer via smartone.app', 'Ajouter votre playlist M3U'],
    guide_slug: 'smart-one-iptv-guide-complet',
  },
  {
    id: 'set-iptv', name: 'SET IPTV', logo: '⚙️', category: 'smart_tv',
    platforms: ['Samsung', 'LG'], price_type: 'paid', price_amount: '',
    description: 'Simple d\'utilisation, idéal pour les débutants.',
    steps: ['Installer SET IPTV sur votre Smart TV', 'Ouvrir l\'application', 'Uploader votre playlist via setiptv.com'],
  },
  {
    id: 'royal-iptv', name: 'Royal IPTV', logo: '👑', category: 'smart_tv',
    platforms: ['Samsung', 'LG'], price_type: 'paid', price_amount: '',
    description: 'Interface premium, support 4K, VOD intégré.',
    steps: ['Installer Royal IPTV sur votre TV', 'Ouvrir l\'application', 'Uploader votre playlist M3U via le portail web'],
  },
  {
    id: 'nano-iptv', name: 'Nano IPTV', logo: '🔬', category: 'smart_tv',
    platforms: ['Samsung', 'LG'], price_type: 'paid', price_amount: '',
    description: 'Ultra léger, idéal pour les TV anciennes, installation rapide.',
    steps: ['Installer Nano IPTV sur votre Smart TV', 'Ouvrir l\'application', 'Ajouter votre playlist M3U'],
  },
  {
    id: 'vlc', name: 'VLC Media Player', logo: '🟠', category: 'computer',
    platforms: ['Windows', 'Mac', 'Linux'], price_type: 'free', price_amount: '',
    description: 'Lecteur multimédia universel. Support M3U natif, gratuit et open source.',
    steps: ['Télécharger VLC sur videolan.org', 'Installer le logiciel', 'Ouvrir VLC', 'Fichier > Ouvrir un flux réseau', 'Coller l\'URL M3U de RegardezIPTV'],
  },
  {
    id: 'myiptv-player', name: 'MyIPTV Player', logo: '💻', category: 'computer',
    platforms: ['Windows'], price_type: 'free', price_amount: '',
    description: 'Application Windows Store avec EPG, enregistrement, interface intuitive.',
    steps: ['Ouvrir le Microsoft Store', 'Rechercher MyIPTV Player', 'Installer l\'application', 'Ajouter votre playlist M3U', 'Configurer l\'EPG'],
  },
  {
    id: 'iptvnator', name: 'IPTVnator', logo: '🎯', category: 'computer',
    platforms: ['Windows', 'Mac', 'Linux'], price_type: 'free', price_amount: '',
    description: 'Application open source, interface moderne, support M3U et API.',
    steps: ['Télécharger IPTVnator sur GitHub', 'Installer l\'application', 'Ouvrir et ajouter une playlist', 'Entrer l\'URL M3U de RegardezIPTV'],
  },
  {
    id: 'progtv', name: 'ProgTV', logo: '📡', category: 'computer',
    platforms: ['Windows', 'Android'], price_type: 'free', price_amount: '',
    description: 'Application complète avec télécommande, EPG, enregistrement.',
    steps: ['Télécharger ProgTV sur progtv.net', 'Installer l\'application', 'Ajouter votre playlist M3U', 'Configurer l\'EPG'],
  },
  {
    id: 'perfect-player', name: 'Perfect Player', logo: '▶️', category: 'box',
    platforms: ['Android TV', 'Fire Stick', 'Formuler'], price_type: 'free', price_amount: '',
    description: 'Léger, support M3U et Xtream Codes, interface style télécommande.',
    steps: ['Installer Perfect Player depuis Google Play', 'Ouvrir l\'application', 'Aller dans Paramètres > Général', 'Ajouter l\'URL M3U de RegardezIPTV'],
  },
  {
    id: 'televizo', name: 'Televizo', logo: '📺', category: 'box',
    platforms: ['Android TV', 'Fire Stick'], price_type: 'paid', price_amount: '',
    description: 'Simple et efficace, EPG support, interface fluide pour box Android.',
    steps: ['Télécharger Televizo sur Google Play', 'Installer l\'application', 'Ajouter une playlist M3U', 'Configurer l\'EPG'],
  },
  {
    id: 'mytvonline', name: 'MyTVOnline', logo: '🌐', category: 'box',
    platforms: ['Formuler'], price_type: 'free', price_amount: '',
    description: 'Application native Formuler, interface TV premium, EPG avancé.',
    steps: ['MyTVOnline est préinstallé sur Formuler', 'Ouvrir l\'application', 'Ajouter votre portail Xtream Codes', 'Entrer vos identifiants RegardezIPTV'],
  },
  {
    id: 'tivimate-box', name: 'Tivimate (Box)', logo: '🖥️', category: 'box',
    platforms: ['Android TV', 'Fire Stick'], price_type: 'paid', price_amount: '4,99€/an',
    description: 'La référence sur Android TV. Interface TV parfaite pour box et Fire Stick.',
    steps: ['Installer Tivimate depuis Google Play ou APK', 'Ouvrir l\'application', 'Ajouter une playlist M3U', 'Configurer l\'EPG et les favoris'],
    guide_slug: 'tivimate-guide-installation',
  },
];

const CATEGORIES = [
  { id: 'all', label: 'Tous', icon: Filter },
  { id: 'smartphone', label: 'Mobile', icon: Smartphone },
  { id: 'smart_tv', label: 'Smart TV', icon: Tv },
  { id: 'computer', label: 'Ordinateur', icon: Monitor },
  { id: 'box', label: 'Box Android', icon: Box },
] as const;

const PRICE_FILTERS = [
  { id: 'all', label: 'Tous les prix' },
  { id: 'free', label: 'Gratuit' },
  { id: 'paid', label: 'Payant' },
] as const;

export default function InstallationGuideClient() {
  const { locale, t } = useTranslation();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activePrice, setActivePrice] = useState<string>('all');
  const [expandedApp, setExpandedApp] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [apiApps, setApiApps] = useState<IPTVApp[]>([]);

  useEffect(() => {
    fetch("/api/cms/applications").then(r => r.json()).then(data => {
      if (Array.isArray(data) && data.length > 0) setApiApps(data);
    }).catch(() => {});
  }, []);

  const allApps = apiApps.length > 0 ? apiApps : APPS;


  const toggleSteps = (id: string) => { setExpandedApp(expandedApp === id ? null : id); };

  const filteredApps = useMemo(() => {
    return allApps.filter((app) => {
      const q = search.toLowerCase();
      const matchSearch = !q || app.name.toLowerCase().includes(q) || app.description.toLowerCase().includes(q) || app.platforms.some(p => p.toLowerCase().includes(q));
      const matchCategory = activeCategory === 'all' || app.category === activeCategory;
      const matchPrice = activePrice === 'all' || app.price_type === activePrice;
      return matchSearch && matchCategory && matchPrice;
    });
  }, [search, activeCategory, activePrice]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: allApps.length };
    CATEGORIES.slice(1).forEach(cat => {
      counts[cat.id] = allApps.filter(a => a.category === cat.id).length;
    });
    return counts;
  }, []);

  return (
    <main id="main-content" className="min-h-screen bg-bg-base">

      {/* ── HERO ────────────────────────────────────────── */}
      <section className="relative pt-[80px] md:pt-[120px] pb-[48px] md:pb-[72px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--brand-from)]/8 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-[10%] right-[5%] w-[400px] h-[400px] rounded-full blur-[120px] pointer-events-none opacity-30" style={{ background: 'radial-gradient(ellipse, rgba(0,243,255,0.15) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[10%] left-[5%] w-[350px] h-[350px] rounded-full blur-[100px] pointer-events-none opacity-20" style={{ background: 'radial-gradient(ellipse, rgba(255,0,229,0.10) 0%, transparent 70%)' }} />
        
        <div className="max-w-7xl mx-auto px-[16px] md:px-[40px] relative z-10">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-[8px] px-[14px] py-[7px] bg-[var(--brand-from)]/10 border border-[var(--brand-from)]/20 rounded-full mb-[20px] backdrop-blur-sm">
              <BookOpen className="w-[14px] h-[14px] text-[var(--brand-from)]" />
              <span className="text-[var(--brand-from)] text-[11px] md:text-xs font-bold uppercase tracking-widest">{t('installation_guide.badge')}</span>
            </div>
            <h1 className="font-syne font-bold text-[36px] md:text-[56px] lg:text-[64px] text-text-primary mb-[16px] leading-[1.1] tracking-tight">
              {t('installation_guide.title')}
            </h1>
            <p className="text-text-secondary text-[15px] md:text-lg max-w-2xl mx-auto leading-relaxed mb-[40px] px-[8px]">
              {t('installation_guide.subtitle')}
            </p>
            
            {/* Quick stats */}
            <div className="flex flex-wrap justify-center gap-[10px] md:gap-[16px]">
              {[
                { icon: '📱', label: '27+ Apps', sub: 'testées et approuvées' },
                { icon: '🎯', label: 'Tous appareils', sub: 'TV, Mobile, PC, Box' },
                { icon: '⚡', label: 'Guides pas à pas', sub: 'installation en 5 min' },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-[10px] px-[16px] py-[12px] bg-bg-card/60 border border-border/50 rounded-2xl backdrop-blur-sm">
                  <span className="text-2xl">{stat.icon}</span>
                  <div className="text-left">
                    <p className="text-text-primary text-sm font-bold">{stat.label}</p>
                    <p className="text-text-muted text-[11px]">{stat.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FILTRES ─────────────────────────────────────── */}
      <div className="sticky top-[60px] md:top-[70px] z-30 bg-bg-base/95 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-[16px] md:px-[40px] py-[12px]">
          <div className="flex items-center gap-[12px]">
            {/* Search */}
            <div className="relative flex-1 max-w-[400px]">
              <Search className="absolute left-[12px] top-1/2 -translate-y-1/2 w-[16px] h-[16px] text-text-muted" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('installation_guide.search_placeholder')}
                className="w-full pl-[38px] pr-[32px] py-[11px] bg-bg-card border border-border rounded-xl text-text-primary placeholder:text-text-muted text-[14px] focus:outline-none focus:border-[var(--brand-from)]/50 transition-all"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-[10px] top-1/2 -translate-y-1/2 w-[22px] h-[22px] rounded-full bg-bg-elevated flex items-center justify-center text-text-muted hover:text-text-primary">
                  <X className="w-[12px] h-[12px]" />
                </button>
              )}
            </div>

            {/* Mobile filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden w-[40px] h-[40px] rounded-xl bg-bg-card border border-border flex items-center justify-center text-text-secondary active:scale-95 touch-manipulation"
            >
              <Filter className="w-[18px] h-[18px]" />
            </button>

            {/* Desktop category tabs */}
            <div className="hidden md:flex items-center gap-[6px]">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`inline-flex items-center gap-[6px] px-[14px] py-[8px] rounded-full text-[13px] font-semibold transition-all duration-200 ${
                      activeCategory === cat.id
                        ? 'bg-gradient-to-r from-[var(--brand-from)] to-[var(--brand-to)] text-white shadow-lg shadow-[var(--brand-from)]/20'
                        : 'bg-bg-card border border-border text-text-secondary hover:border-[var(--brand-from)]/30 hover:text-text-primary'
                    }`}
                  >
                    {Icon && <Icon className="w-[14px] h-[14px]" />}
                    {cat.label}
                    <span className={`text-[11px] ml-[2px] ${activeCategory === cat.id ? 'text-white/70' : 'text-text-muted'}`}>
                      ({categoryCounts[cat.id]})
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Desktop price filter */}
            <div className="hidden md:flex items-center gap-[4px] ml-auto">
              {PRICE_FILTERS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setActivePrice(f.id)}
                  className={`px-[12px] py-[7px] rounded-full text-[12px] font-medium transition-all ${
                    activePrice === f.id
                      ? 'bg-success/15 text-success border border-success/30'
                      : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile filters panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="md:hidden overflow-hidden"
              >
                <div className="py-[12px] space-y-[12px]">
                  <p className="text-text-muted text-[11px] font-bold uppercase tracking-wider">Catégories</p>
                  <div className="flex flex-wrap gap-[6px]">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => { setActiveCategory(cat.id); setShowFilters(false); }}
                        className={`px-[12px] py-[7px] rounded-full text-[12px] font-semibold transition-all ${
                          activeCategory === cat.id
                            ? 'bg-gradient-to-r from-[var(--brand-from)] to-[var(--brand-to)] text-white'
                            : 'bg-bg-card border border-border text-text-secondary'
                        }`}
                      >
                        {cat.label} ({categoryCounts[cat.id]})
                      </button>
                    ))}
                  </div>
                  <p className="text-text-muted text-[11px] font-bold uppercase tracking-wider">Prix</p>
                  <div className="flex gap-[6px]">
                    {PRICE_FILTERS.map((f) => (
                      <button
                        key={f.id}
                        onClick={() => { setActivePrice(f.id); setShowFilters(false); }}
                        className={`px-[12px] py-[7px] rounded-full text-[12px] font-semibold transition-all ${
                          activePrice === f.id
                            ? 'bg-success/15 text-success border border-success/30'
                            : 'bg-bg-card border border-border text-text-secondary'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── RÉSULTATS ────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-[16px] md:px-[40px] py-[24px] md:py-[40px] pb-[80px] md:pb-[100px]">
        <div className="flex items-center justify-between mb-[24px]">
          <p className="text-text-muted text-[13px]">
            <span className="font-bold text-text-primary">{filteredApps.length}</span> application{filteredApps.length > 1 ? 's' : ''} trouvée{filteredApps.length > 1 ? 's' : ''}
          </p>
          {(search || activeCategory !== 'all' || activePrice !== 'all') && (
            <button
              onClick={() => { setSearch(''); setActiveCategory('all'); setActivePrice('all'); }}
              className="text-[var(--brand-from)] text-[12px] font-semibold hover:underline"
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeCategory}-${activePrice}-${search}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[14px] md:gap-[18px]"
          >
            {filteredApps.map((app, index) => {
              const isExpanded = expandedApp === app.id;
              return (
                <motion.div
                  key={app.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                  className={`group relative p-[20px] md:p-[24px] rounded-2xl bg-bg-card border transition-all duration-300 hover:shadow-xl ${
                    isExpanded ? 'border-[var(--brand-from)]/40 shadow-lg shadow-[var(--brand-from)]/5' : 'border-border hover:border-[var(--brand-from)]/20'
                  }`}
                >
                  {/* Subtle gradient bg on hover */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[var(--brand-from)]/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-start gap-[12px] md:gap-[16px] mb-[16px]">
                      <div className="w-[52px] h-[52px] md:w-[56px] md:h-[56px] rounded-2xl bg-bg-elevated flex items-center justify-center text-[28px] md:text-[32px] flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform duration-300">
                        {app.logo}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-syne font-bold text-[16px] md:text-[17px] text-text-primary mb-[6px] leading-tight">
                          {app.name}
                        </h3>
                        <div className="flex flex-wrap gap-[5px]">
                          {app.platforms.slice(0, 3).map((p) => (
                            <span key={p} className="px-[7px] py-[2px] bg-bg-elevated text-text-muted text-[10px] rounded-md font-medium">
                              {p}
                            </span>
                          ))}
                          {app.platforms.length > 3 && (
                            <span className="px-[7px] py-[2px] bg-bg-elevated text-text-muted text-[10px] rounded-md font-medium">
                              +{app.platforms.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Badges row */}
                    <div className="flex items-center gap-[8px] mb-[14px]">
                      <span className={`inline-flex items-center gap-[4px] px-[10px] py-[3px] rounded-full text-[11px] font-bold ${
                        app.price_type === 'free' ? 'bg-success/10 text-success' : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        {app.price_type === 'free' ? '🆓 Gratuit' : `💰 ${app.price_amount || 'Payant'}`}
                      </span>
                      <span className="px-[10px] py-[3px] bg-[var(--brand-from)]/10 text-[var(--brand-from)] text-[11px] font-semibold rounded-full">
                        {app.category === 'smartphone' ? '📱 Mobile' : app.category === 'smart_tv' ? '📺 TV' : app.category === 'computer' ? '💻 PC' : '📦 Box'}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-text-secondary text-[13px] md:text-[14px] leading-relaxed mb-[16px]">{app.description}</p>

                    {/* Steps toggle button */}
                    <button
                      onClick={() => toggleSteps(app.id)}
                      className={`w-full flex items-center justify-between px-[16px] py-[12px] rounded-xl text-[13px] md:text-[14px] font-semibold transition-all duration-200 ${
                        isExpanded
                          ? 'bg-[var(--brand-from)]/10 text-[var(--brand-from)]'
                          : 'bg-bg-elevated text-text-secondary hover:text-text-primary hover:bg-[var(--brand-from)]/5'
                      }`}
                    >
                      <span className="flex items-center gap-[8px]">
                        <span className={`transition-transform duration-300 text-[11px] ${isExpanded ? 'rotate-90' : ''}`}>▶</span>
                        {isExpanded ? 'Masquer les étapes' : 'Voir les étapes d\'installation'}
                      </span>
                      <span className="text-text-muted text-[11px]">{app.steps.length} étapes</span>
                    </button>

                    {/* Expandable steps */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-[16px] pt-[16px] border-t border-border/50">
                            <ol className="space-y-[12px]">
                              {app.steps.map((step, i) => (
                                <li key={i} className="flex gap-[12px] text-[13px] text-text-secondary leading-relaxed">
                                  <span className="w-[24px] h-[24px] rounded-full bg-[var(--brand-from)]/15 text-[var(--brand-from)] text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-[1px]">
                                    {i + 1}
                                  </span>
                                  <span className="pt-[2px]">{step}</span>
                                </li>
                              ))}
                            </ol>
                            {app.guide_slug && (
                              <Link
                                href={`/blog/${app.guide_slug}`}
                                className="inline-flex items-center gap-[8px] mt-[18px] px-[16px] py-[10px] bg-[var(--brand-from)]/10 text-[var(--brand-from)] rounded-xl text-[13px] font-semibold hover:bg-[var(--brand-from)]/20 transition-all"
                              >
                                <BookOpen className="w-[14px] h-[14px]" />
                                Guide complet dédié
                                <ExternalLink className="w-[12px] h-[12px]" />
                              </Link>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {filteredApps.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-[100px]">
            <p className="text-5xl mb-[20px]">🔍</p>
            <p className="text-text-secondary text-[16px] font-medium mb-[8px]">Aucune application trouvée</p>
            <p className="text-text-muted text-[14px]">Essayez d'autres filtres ou mots-clés</p>
            <button
              onClick={() => { setSearch(''); setActiveCategory('all'); setActivePrice('all'); }}
              className="mt-[20px] px-[20px] py-[10px] bg-[var(--brand-from)] text-white font-semibold rounded-xl text-[14px] active:scale-95 touch-manipulation"
            >
              Réinitialiser les filtres
            </button>
          </motion.div>
        )}
      </div>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className="py-[60px] md:py-[80px] bg-bg-card relative overflow-hidden border-t border-border/30">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, rgba(0,243,255,0.06) 0%, transparent 70%)' }} />
        <div className="max-w-4xl mx-auto px-[16px] md:px-[40px] relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-[8px] px-[14px] py-[6px] bg-success/10 border border-success/20 rounded-full mb-[20px]">
              <Zap className="w-[12px] h-[12px] text-success" />
              <span className="text-success text-[11px] md:text-xs font-bold uppercase tracking-widest">{t('installation_guide.activation_badge')}</span>
            </div>
            <h2 className="font-syne font-bold text-[28px] md:text-[48px] text-text-primary mb-[12px] md:mb-[16px] tracking-tight">
              {t('installation_guide.cta_title')}
            </h2>
            <p className="text-text-secondary text-sm md:text-lg max-w-2xl mx-auto leading-relaxed mb-[32px] md:mb-[40px] px-[8px]">
              {t('installation_guide.cta_subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-[12px] md:gap-[16px]">
              <Link
                href={getLocalizedPath('/nos-plans', locale)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-[10px] px-[32px] md:px-[40px] py-[16px] md:py-[18px] bg-gradient-to-r from-[var(--brand-from)] to-[var(--brand-to)] text-white font-bold rounded-xl hover:shadow-[0_0_40px_rgba(0,243,255,0.35)] transition-all duration-300 active:scale-[0.97] touch-manipulation text-base md:text-lg"
              >
                <ShoppingCart className="w-[20px] h-[20px]" />
                {t('installation_guide.cta_plans')}
                <ChevronRight className="w-[18px] h-[18px]" />
              </Link>
              <Link
                href={getLocalizedPath('/essai-gratuit', locale)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-[10px] px-[28px] md:px-[32px] py-[16px] md:py-[18px] bg-bg-elevated border border-border text-text-primary font-bold rounded-xl hover:border-[var(--brand-from)]/40 transition-all duration-300 active:scale-[0.97] touch-manipulation text-sm md:text-base"
              >
                {t('installation_guide.cta_trial')}
              </Link>
            </div>
            <p className="mt-[24px] text-text-muted text-sm">
              {t('installation_guide.price_from')} <span className="font-bold text-text-primary text-base">{t('installation_guide.price_value')}</span> • {t('installation_guide.no_commitment')}
            </p>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
