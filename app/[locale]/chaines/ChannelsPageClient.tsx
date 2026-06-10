'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Search,
  Trophy,
  Film,
  Tv,
  Globe2,
  Baby,
  Music2,
  Newspaper,
  BookOpen,
  ShoppingCart,
  ChevronRight,
  Star,
  Zap,
  Check,
} from 'lucide-react';
import { getLocalizedPath } from '@/lib/i18n';
import { useTranslation } from '@/hooks/useTranslation';

/* ─── CHANNEL DATA ──────────────────────────────────────────────── */
const categories = [
  { id: 'all', label: 'Tous', icon: Tv, color: 'from-[var(--brand-from)] to-[var(--brand-to)]' },
  { id: 'sport', label: 'Sport', icon: Trophy, color: 'from-orange-500 to-red-500' },
  { id: 'cinema', label: 'Cinéma & Séries', icon: Film, color: 'from-purple-500 to-violet-600' },
  { id: 'generaliste', label: 'Généraliste', icon: Tv, color: 'from-blue-500 to-cyan-500' },
  { id: 'international', label: 'International', icon: Globe2, color: 'from-green-500 to-emerald-600' },
  { id: 'jeunesse', label: 'Jeunesse', icon: Baby, color: 'from-yellow-500 to-amber-500' },
  { id: 'musique', label: 'Musique', icon: Music2, color: 'from-pink-500 to-rose-500' },
  { id: 'info', label: 'Info & Doc', icon: Newspaper, color: 'from-slate-500 to-gray-600' },
  { id: 'culture', label: 'Culture', icon: BookOpen, color: 'from-teal-500 to-cyan-600' },
];

const channels = [
  // SPORT
  { id: 1, name: 'BeIN Sports 1', cat: 'sport', country: '🇫🇷', hd: true, featured: true, emoji: '⚽' },
  { id: 2, name: 'BeIN Sports 2', cat: 'sport', country: '🇫🇷', hd: true, featured: false, emoji: '⚽' },
  { id: 3, name: 'BeIN Sports 3', cat: 'sport', country: '🇫🇷', hd: true, featured: false, emoji: '⚽' },
  { id: 4, name: 'RMC Sport 1', cat: 'sport', country: '🇫🇷', hd: true, featured: true, emoji: '🏆' },
  { id: 5, name: 'RMC Sport 2', cat: 'sport', country: '🇫🇷', hd: true, featured: false, emoji: '🏆' },
  { id: 6, name: 'Canal+ Sport', cat: 'sport', country: '🇫🇷', hd: true, featured: true, emoji: '🎽' },
  { id: 7, name: 'Eurosport 1', cat: 'sport', country: '🇪🇺', hd: true, featured: true, emoji: '🎿' },
  { id: 8, name: 'Eurosport 2', cat: 'sport', country: '🇪🇺', hd: true, featured: false, emoji: '🎿' },
  { id: 9, name: 'DAZN 1', cat: 'sport', country: '🌍', hd: true, featured: true, emoji: '🥊' },
  { id: 10, name: 'DAZN 2', cat: 'sport', country: '🌍', hd: true, featured: false, emoji: '🥊' },
  { id: 11, name: 'ESPN', cat: 'sport', country: '🇺🇸', hd: true, featured: true, emoji: '🏈' },
  { id: 12, name: 'Sky Sports', cat: 'sport', country: '🇬🇧', hd: true, featured: true, emoji: '⚽' },
  { id: 13, name: 'BT Sport 1', cat: 'sport', country: '🇬🇧', hd: true, featured: false, emoji: '🏉' },
  { id: 14, name: 'Sport+', cat: 'sport', country: '🇫🇷', hd: true, featured: false, emoji: '🏊' },
  { id: 15, name: 'L\'Equipe', cat: 'sport', country: '🇫🇷', hd: false, featured: false, emoji: '🏅' },
  { id: 16, name: 'Golf Channel', cat: 'sport', country: '🌍', hd: true, featured: false, emoji: '⛳' },
  // CINEMA
  { id: 17, name: 'Canal+', cat: 'cinema', country: '🇫🇷', hd: true, featured: true, emoji: '🎬' },
  { id: 18, name: 'Canal+ Cinéma', cat: 'cinema', country: '🇫🇷', hd: true, featured: true, emoji: '🎬' },
  { id: 19, name: 'Canal+ Séries', cat: 'cinema', country: '🇫🇷', hd: true, featured: false, emoji: '📺' },
  { id: 20, name: 'OCS Choc', cat: 'cinema', country: '🇫🇷', hd: true, featured: true, emoji: '🎥' },
  { id: 21, name: 'OCS City', cat: 'cinema', country: '🇫🇷', hd: true, featured: false, emoji: '🎥' },
  { id: 22, name: 'OCS Max', cat: 'cinema', country: '🇫🇷', hd: true, featured: false, emoji: '🎥' },
  { id: 23, name: 'TCM Cinéma', cat: 'cinema', country: '🇫🇷', hd: true, featured: false, emoji: '🎞️' },
  { id: 24, name: 'Ciné+ Club', cat: 'cinema', country: '🇫🇷', hd: true, featured: false, emoji: '🎞️' },
  { id: 25, name: 'Ciné+ Classic', cat: 'cinema', country: '🇫🇷', hd: false, featured: false, emoji: '🎞️' },
  { id: 26, name: 'HBO', cat: 'cinema', country: '🇺🇸', hd: true, featured: true, emoji: '🎭' },
  { id: 27, name: 'Paramount+', cat: 'cinema', country: '🌍', hd: true, featured: true, emoji: '⭐' },
  { id: 28, name: 'Netflix FR', cat: 'cinema', country: '🌍', hd: true, featured: true, emoji: '🍿' },
  { id: 29, name: 'Prime Video', cat: 'cinema', country: '🌍', hd: true, featured: true, emoji: '📦' },
  { id: 30, name: 'Disney+ FR', cat: 'cinema', country: '🌍', hd: true, featured: true, emoji: '🏰' },
  { id: 31, name: 'Apple TV+', cat: 'cinema', country: '🌍', hd: true, featured: false, emoji: '🍎' },
  { id: 32, name: 'Starzplay', cat: 'cinema', country: '🌍', hd: true, featured: false, emoji: '⭐' },
  // GENERALISTE
  { id: 33, name: 'TF1', cat: 'generaliste', country: '🇫🇷', hd: true, featured: true, emoji: '📡' },
  { id: 34, name: 'France 2', cat: 'generaliste', country: '🇫🇷', hd: true, featured: true, emoji: '📡' },
  { id: 35, name: 'France 3', cat: 'generaliste', country: '🇫🇷', hd: true, featured: false, emoji: '📡' },
  { id: 36, name: 'France 4', cat: 'generaliste', country: '🇫🇷', hd: false, featured: false, emoji: '📡' },
  { id: 37, name: 'France 5', cat: 'generaliste', country: '🇫🇷', hd: true, featured: false, emoji: '📡' },
  { id: 38, name: 'M6', cat: 'generaliste', country: '🇫🇷', hd: true, featured: true, emoji: '📺' },
  { id: 39, name: 'TMC', cat: 'generaliste', country: '🇫🇷', hd: true, featured: false, emoji: '📺' },
  { id: 40, name: 'TFX', cat: 'generaliste', country: '🇫🇷', hd: false, featured: false, emoji: '📺' },
  { id: 41, name: 'W9', cat: 'generaliste', country: '🇫🇷', hd: true, featured: false, emoji: '📺' },
  { id: 42, name: 'C8', cat: 'generaliste', country: '🇫🇷', hd: true, featured: false, emoji: '📺' },
  { id: 43, name: 'Arte', cat: 'generaliste', country: '🇫🇷', hd: true, featured: true, emoji: '🎭' },
  { id: 44, name: 'RTL9', cat: 'generaliste', country: '🇫🇷', hd: false, featured: false, emoji: '📺' },
  { id: 45, name: 'Chérie 25', cat: 'generaliste', country: '🇫🇷', hd: false, featured: false, emoji: '📺' },
  { id: 46, name: 'NT1', cat: 'generaliste', country: '🇫🇷', hd: false, featured: false, emoji: '📺' },
  { id: 47, name: 'RTL TVI', cat: 'generaliste', country: '🇧🇪', hd: true, featured: false, emoji: '📡' },
  { id: 48, name: 'VTM', cat: 'generaliste', country: '🇧🇪', hd: true, featured: false, emoji: '📡' },
  // INTERNATIONAL
  { id: 49, name: 'MBC 1', cat: 'international', country: '🇸🇦', hd: true, featured: true, emoji: '🌙' },
  { id: 50, name: 'MBC 2', cat: 'international', country: '🇸🇦', hd: true, featured: false, emoji: '🌙' },
  { id: 51, name: 'MBC Drama', cat: 'international', country: '🇸🇦', hd: true, featured: false, emoji: '🌙' },
  { id: 52, name: 'Al Jazeera', cat: 'international', country: '🇶🇦', hd: true, featured: true, emoji: '📰' },
  { id: 53, name: 'Al Arabiya', cat: 'international', country: '🇸🇦', hd: true, featured: false, emoji: '📰' },
  { id: 54, name: 'TRT 1', cat: 'international', country: '🇹🇷', hd: true, featured: true, emoji: '🌙' },
  { id: 55, name: 'TRT World', cat: 'international', country: '🇹🇷', hd: true, featured: false, emoji: '🌍' },
  { id: 56, name: 'CNN', cat: 'international', country: '🇺🇸', hd: true, featured: true, emoji: '📡' },
  { id: 57, name: 'BBC World', cat: 'international', country: '🇬🇧', hd: true, featured: true, emoji: '📻' },
  { id: 58, name: 'Telemundo', cat: 'international', country: '🇪🇸', hd: true, featured: false, emoji: '📺' },
  { id: 59, name: 'TVE Internacional', cat: 'international', country: '🇪🇸', hd: true, featured: false, emoji: '📺' },
  { id: 60, name: 'RTP Internacional', cat: 'international', country: '🇵🇹', hd: true, featured: false, emoji: '📺' },
  { id: 61, name: 'RAI 1', cat: 'international', country: '🇮🇹', hd: true, featured: true, emoji: '📺' },
  { id: 62, name: 'ARD', cat: 'international', country: '🇩🇪', hd: true, featured: true, emoji: '📺' },
  { id: 63, name: 'ZDF', cat: 'international', country: '🇩🇪', hd: true, featured: false, emoji: '📺' },
  // JEUNESSE
  { id: 64, name: 'Disney Channel', cat: 'jeunesse', country: '🌍', hd: true, featured: true, emoji: '🏰' },
  { id: 65, name: 'Disney Junior', cat: 'jeunesse', country: '🌍', hd: true, featured: false, emoji: '🏰' },
  { id: 66, name: 'Cartoon Network', cat: 'jeunesse', country: '🌍', hd: true, featured: true, emoji: '🎨' },
  { id: 67, name: 'Nickelodeon', cat: 'jeunesse', country: '🌍', hd: true, featured: true, emoji: '🟠' },
  { id: 68, name: 'Nickelodeon Jr', cat: 'jeunesse', country: '🌍', hd: false, featured: false, emoji: '🟠' },
  { id: 69, name: 'Gulli', cat: 'jeunesse', country: '🇫🇷', hd: true, featured: true, emoji: '🌟' },
  { id: 70, name: 'TiJi', cat: 'jeunesse', country: '🇫🇷', hd: false, featured: false, emoji: '🌈' },
  { id: 71, name: 'Piwi+', cat: 'jeunesse', country: '🇫🇷', hd: false, featured: false, emoji: '🌈' },
  { id: 72, name: 'Canal J', cat: 'jeunesse', country: '🇫🇷', hd: false, featured: false, emoji: '🎪' },
  { id: 73, name: 'Boomerang', cat: 'jeunesse', country: '🌍', hd: false, featured: false, emoji: '💫' },
  // MUSIQUE
  { id: 74, name: 'MTV France', cat: 'musique', country: '🇫🇷', hd: true, featured: true, emoji: '🎵' },
  { id: 75, name: 'MTV Hits', cat: 'musique', country: '🌍', hd: false, featured: false, emoji: '🎵' },
  { id: 76, name: 'Trace Urban', cat: 'musique', country: '🇫🇷', hd: true, featured: true, emoji: '🎤' },
  { id: 77, name: 'Trace Toca', cat: 'musique', country: '🌍', hd: false, featured: false, emoji: '🎤' },
  { id: 78, name: 'MCM', cat: 'musique', country: '🇫🇷', hd: false, featured: false, emoji: '🎶' },
  { id: 79, name: 'Mezzo', cat: 'musique', country: '🇫🇷', hd: true, featured: false, emoji: '🎻' },
  { id: 80, name: 'Melody', cat: 'musique', country: '🇫🇷', hd: false, featured: false, emoji: '🎹' },
  { id: 81, name: 'VH1', cat: 'musique', country: '🇺🇸', hd: false, featured: false, emoji: '🎸' },
  // INFO & DOC
  { id: 82, name: 'BFM TV', cat: 'info', country: '🇫🇷', hd: true, featured: true, emoji: '📰' },
  { id: 83, name: 'CNews', cat: 'info', country: '🇫🇷', hd: true, featured: true, emoji: '📰' },
  { id: 84, name: 'LCI', cat: 'info', country: '🇫🇷', hd: true, featured: false, emoji: '📰' },
  { id: 85, name: 'France Info', cat: 'info', country: '🇫🇷', hd: true, featured: false, emoji: '📻' },
  { id: 86, name: 'CNN International', cat: 'info', country: '🇺🇸', hd: true, featured: true, emoji: '🌐' },
  { id: 87, name: 'BBC News', cat: 'info', country: '🇬🇧', hd: true, featured: true, emoji: '📻' },
  { id: 88, name: 'Euronews', cat: 'info', country: '🇪🇺', hd: true, featured: false, emoji: '🌍' },
  { id: 89, name: 'National Geographic', cat: 'info', country: '🌍', hd: true, featured: true, emoji: '🌿' },
  { id: 90, name: 'Discovery Channel', cat: 'info', country: '🌍', hd: true, featured: true, emoji: '🔬' },
  { id: 91, name: 'RFI', cat: 'info', country: '🇫🇷', hd: false, featured: false, emoji: '📡' },
  // CULTURE
  { id: 92, name: 'Arte', cat: 'culture', country: '🇫🇷', hd: true, featured: true, emoji: '🎭' },
  { id: 93, name: 'Planète+', cat: 'culture', country: '🇫🇷', hd: true, featured: false, emoji: '🌍' },
  { id: 94, name: 'Histoire TV', cat: 'culture', country: '🇫🇷', hd: true, featured: false, emoji: '🏛️' },
  { id: 95, name: 'Voyage', cat: 'culture', country: '🇫🇷', hd: false, featured: false, emoji: '✈️' },
  { id: 96, name: 'Ushuaïa TV', cat: 'culture', country: '🇫🇷', hd: true, featured: true, emoji: '🌋' },
  { id: 97, name: 'Toute l\'Histoire', cat: 'culture', country: '🇫🇷', hd: false, featured: false, emoji: '📜' },
  { id: 98, name: 'Science TV', cat: 'culture', country: '🌍', hd: false, featured: false, emoji: '🧪' },
];

/* ─── HELPERS ───────────────────────────────────────────────────── */
function getCategoryMeta(id: string) {
  return categories.find((c) => c.id === id) || categories[0];
}

export default function ChannelsPageClient() {
  const { locale } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [showHDOnly, setShowHDOnly] = useState(false);

  const filtered = useMemo(() => {
    return channels.filter((ch) => {
      const matchCat = activeCategory === 'all' || ch.cat === activeCategory;
      const matchSearch = ch.name.toLowerCase().includes(search.toLowerCase());
      const matchHD = !showHDOnly || ch.hd;
      return matchCat && matchSearch && matchHD;
    });
  }, [activeCategory, search, showHDOnly]);

  const catMeta = getCategoryMeta(activeCategory);

  return (
    <main id="main-content" className="min-h-screen bg-bg-base">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative pt-[140px] pb-[80px] overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--brand-from)]/5 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-[10%] left-[5%] w-[500px] h-[500px] rounded-full blur-[130px] pointer-events-none opacity-60"
          style={{ background: 'radial-gradient(ellipse, rgba(0,243,255,0.12) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 right-[5%] w-[400px] h-[400px] rounded-full blur-[120px] pointer-events-none opacity-50"
          style={{ background: 'radial-gradient(ellipse, rgba(255,0,229,0.10) 0%, transparent 70%)' }} />

        <div className="max-w-7xl mx-auto px-[24px] md:px-[40px] relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-[8px] px-[16px] py-[8px] bg-[var(--brand-from)]/10 border border-[var(--brand-from)]/20 rounded-full mb-[24px]">
              <span className="w-[6px] h-[6px] rounded-full bg-[var(--brand-from)] animate-pulse" />
              <span className="text-[var(--brand-from)] text-xs font-bold uppercase tracking-widest">
                45 000+ Chaînes HD & 4K
              </span>
            </div>

            <h1 className="font-syne font-bold text-[40px] md:text-[64px] text-text-primary mb-[20px] leading-[1.1] tracking-tight">
              Liste des{' '}
              <span className="text-gradient">Chaînes IPTV</span>
            </h1>
            <p className="text-text-secondary text-base md:text-xl max-w-2xl mx-auto leading-relaxed mb-[40px]">
              Explorez notre catalogue complet de chaînes live HD/4K. Sport premium, cinéma, séries, international, jeunesse et bien plus — tout est inclus dans votre abonnement.
            </p>

            {/* Stats row */}
            <div className="flex flex-wrap justify-center gap-[12px] mb-[48px]">
              {[
                { label: '45 000+ Chaînes', icon: '📡' },
                { label: 'VOD Illimitée', icon: '🎬' },
                { label: 'HD & 4K', icon: '🖥️' },
                { label: 'Mise à jour quotidienne', icon: '🔄' },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-[8px] px-[16px] py-[8px] bg-bg-card/60 border border-border/50 rounded-full text-sm font-medium text-text-primary backdrop-blur-sm">
                  <span>{s.icon}</span>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <Link
              href={getLocalizedPath('/nos-plans', locale)}
              className="inline-flex items-center gap-[10px] px-[32px] py-[16px] bg-gradient-to-r from-[var(--brand-from)] to-[var(--brand-to)] text-white font-bold rounded-xl hover:shadow-[0_0_40px_rgba(0,243,255,0.3)] transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] text-base"
            >
              <ShoppingCart className="w-[18px] h-[18px]" />
              Acheter un abonnement
              <ChevronRight className="w-[16px] h-[16px]" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── BROWSER ──────────────────────────────────────────────── */}
      <section className="py-[64px]">
        <div className="max-w-7xl mx-auto px-[24px] md:px-[40px]">

          {/* Search + HD filter bar */}
          <div className="flex flex-col sm:flex-row gap-[12px] mb-[32px]">
            <div className="relative flex-1">
              <Search className="absolute left-[14px] top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-text-muted" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher une chaîne…"
                className="w-full pl-[44px] pr-[16px] py-[13px] bg-bg-card border border-border rounded-xl text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-[var(--brand-from)]/50 focus:ring-2 focus:ring-[var(--brand-from)]/10 transition-all duration-200"
              />
            </div>
            <button
              onClick={() => setShowHDOnly(!showHDOnly)}
              className={`flex items-center gap-[8px] px-[20px] py-[13px] rounded-xl border text-sm font-semibold transition-all duration-200 flex-shrink-0 ${
                showHDOnly
                  ? 'bg-gradient-to-r from-[var(--brand-from)] to-[var(--brand-to)] text-white border-transparent shadow-lg shadow-[var(--brand-from)]/20'
                  : 'bg-bg-card border-border text-text-secondary hover:border-[var(--brand-from)]/40'
              }`}
            >
              {showHDOnly && <Check className="w-[14px] h-[14px]" />}
              HD & 4K uniquement
            </button>
          </div>

          {/* Category tabs */}
          <div className="flex flex-wrap gap-[8px] mb-[40px]">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`inline-flex items-center gap-[8px] px-[16px] py-[9px] rounded-full text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? `bg-gradient-to-r ${cat.color} text-white shadow-md`
                      : 'bg-bg-card border border-border text-text-secondary hover:border-[var(--brand-from)]/30 hover:text-text-primary'
                  }`}
                >
                  <Icon className="w-[14px] h-[14px]" />
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Results count */}
          <div className="flex items-center justify-between mb-[24px]">
            <p className="text-text-muted text-sm">
              <span className="font-bold text-text-primary">{filtered.length}</span> chaînes
              {activeCategory !== 'all' && (
                <> dans <span className="font-semibold text-text-primary">{catMeta.label}</span></>
              )}
              {search && <> correspondant à <span className="font-semibold text-text-primary">"{search}"</span></>}
            </p>
            {(search || showHDOnly || activeCategory !== 'all') && (
              <button
                onClick={() => { setSearch(''); setShowHDOnly(false); setActiveCategory('all'); }}
                className="text-[var(--brand-from)] text-xs font-semibold hover:underline"
              >
                Réinitialiser les filtres
              </button>
            )}
          </div>

          {/* Channel grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeCategory}-${search}-${showHDOnly}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-[12px]"
            >
              {filtered.map((ch) => (
                <ChannelCard key={ch.id} channel={ch} />
              ))}
            </motion.div>
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="text-center py-[80px]">
              <p className="text-4xl mb-[16px]">📭</p>
              <p className="text-text-secondary text-base font-medium">Aucune chaîne trouvée</p>
              <p className="text-text-muted text-sm mt-[8px]">Essayez d'autres mots-clés ou catégories.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA PURCHASE ─────────────────────────────────────────── */}
      <section className="py-[80px] bg-bg-card relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(0,243,255,0.06) 0%, transparent 70%)' }} />

        <div className="max-w-4xl mx-auto px-[24px] md:px-[40px] relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-[8px] px-[16px] py-[7px] bg-success/10 border border-success/20 rounded-full mb-[24px]">
              <Zap className="w-[12px] h-[12px] text-success" />
              <span className="text-success text-xs font-bold uppercase tracking-widest">
                Activation en 2 minutes
              </span>
            </div>

            <h2 className="font-syne font-bold text-[32px] md:text-[48px] text-text-primary mb-[16px] tracking-tight">
              Prêt à accéder à toutes ces chaînes ?
            </h2>
            <p className="text-text-secondary text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-[40px]">
              Choisissez votre abonnement et profitez immédiatement de 45 000+ chaînes HD/4K. Garantie satisfait ou remboursé 7 jours.
            </p>

            {/* Features */}
            <div className="flex flex-wrap justify-center gap-[16px] mb-[40px]">
              {[
                '✅ 45 000+ chaînes & VOD',
                '✅ Qualité HD & 4K',
                '✅ Activation immédiate',
                '✅ Garantie 7 jours',
                '✅ Support 24h/7j',
              ].map((f) => (
                <span key={f} className="text-sm font-medium text-text-secondary">{f}</span>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-[16px]">
              <Link
                href={getLocalizedPath('/nos-plans', locale)}
                className="inline-flex items-center gap-[10px] px-[40px] py-[18px] bg-gradient-to-r from-[var(--brand-from)] to-[var(--brand-to)] text-white font-bold rounded-xl hover:shadow-[0_0_40px_rgba(0,243,255,0.35)] transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] text-lg"
              >
                <ShoppingCart className="w-[20px] h-[20px]" />
                Voir les abonnements
                <ChevronRight className="w-[18px] h-[18px]" />
              </Link>
              <Link
                href={getLocalizedPath('/essai-gratuit', locale)}
                className="inline-flex items-center gap-[10px] px-[32px] py-[18px] bg-bg-elevated border border-border text-text-primary font-bold rounded-xl hover:border-[var(--brand-from)]/40 transition-all duration-300 text-base"
              >
                Essai gratuit 3H
              </Link>
            </div>

            {/* Pricing tease */}
            <p className="mt-[28px] text-text-muted text-sm">
              À partir de <span className="font-bold text-text-primary text-base">17,99€/mois</span> • Sans engagement
            </p>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

/* ─── CHANNEL CARD ──────────────────────────────────────────────── */
function ChannelCard({ channel }: { channel: typeof channels[0] }) {
  const cat = getCategoryMeta(channel.cat);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.88 }}
      transition={{ duration: 0.2 }}
      className="group relative p-[16px] rounded-xl bg-bg-card border border-border hover:border-[var(--brand-from)]/30 hover:shadow-lg hover:shadow-[var(--brand-from)]/5 transition-all duration-300 hover:-translate-y-[2px] cursor-default"
    >
      {/* Featured star */}
      {channel.featured && (
        <div className="absolute top-[8px] right-[8px]">
          <Star className="w-[12px] h-[12px] text-amber-400 fill-amber-400" />
        </div>
      )}

      {/* Channel emoji / logo */}
      <div className={`w-[44px] h-[44px] rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-[12px] text-xl shadow-sm group-hover:scale-110 transition-transform duration-300`}>
        {channel.emoji}
      </div>

      {/* Name */}
      <p className="text-text-primary text-xs font-semibold leading-tight mb-[8px] line-clamp-2">
        {channel.name}
      </p>

      {/* Badges */}
      <div className="flex items-center gap-[4px] flex-wrap">
        <span className="text-[10px]">{channel.country}</span>
        {channel.hd && (
          <span className="px-[5px] py-[1px] bg-[var(--brand-from)]/10 text-[var(--brand-from)] text-[9px] font-bold rounded uppercase tracking-wide">
            HD
          </span>
        )}
      </div>
    </motion.div>
  );
}
