'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Search,
  ShoppingCart,
  ChevronRight,
  X,
  ChevronLeft,
  Zap,
} from 'lucide-react';
import { getLocalizedPath } from '@/lib/i18n';
import { useTranslation } from '@/hooks/useTranslation';

interface Channel {
  id: string;
  name: string;
  country: string;
  logo: string;
  categories: string[];
  languages: string[];
  is_nsfw: boolean;
}

interface CountryGroup {
  code: string;
  name: string;
  flag: string;
  channels: Channel[];
}

function getFlagEmoji(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return '🌍';
  const codePoints = countryCode.toUpperCase().split('').map((c) => 127397 + c.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

function getCountryName(code: string): string {
  const names: Record<string, string> = {
    FR: 'France', US: 'USA', GB: 'UK', DE: 'Deutschland', ES: 'España',
    IT: 'Italia', MA: 'Maroc', DZ: 'Algérie', TN: 'Tunisie', SA: 'Arabia Saudita',
    AE: 'UAE', QA: 'Qatar', EG: 'Égypte', TR: 'Türkiye', PT: 'Portugal',
    BE: 'Belgique', NL: 'Nederland', CH: 'Suisse', CA: 'Canada', AU: 'Australia',
    JP: '日本', CN: '中国', IN: 'India', BR: 'Brasil', MX: 'México',
    LB: 'Liban', IQ: 'Irak', SY: 'Syrie', JO: 'Jordanie', KW: 'Koweït',
    LY: 'Libye', PK: 'Pakistan', ID: 'Indonesia', MY: 'Malaysia',
    TH: 'Thailand', KR: '한국', RU: 'Россия', PL: 'Polska',
    SE: 'Sverige', NO: 'Norge', DK: 'Danmark', FI: 'Suomi',
    GR: 'Ελλάδα', AT: 'Österreich', IE: 'Ireland', NZ: 'New Zealand',
    AO: 'Angola', ZA: 'South Africa', NG: 'Nigéria', KE: 'Kenya',
    CI: "Côte d'Ivoire", CM: 'Cameroun', SN: 'Sénégal', GH: 'Ghana',
    IL: 'ישראל', IR: 'Iran', AR: 'Argentina', CO: 'Colombia', PE: 'Perú',
    CL: 'Chile', VE: 'Venezuela', EC: 'Ecuador', UY: 'Uruguay',
    SG: 'Singapore', HK: 'Hong Kong', TW: 'Taiwan',
  };
  return names[code.toUpperCase()] || code;
}

const PRIORITY_COUNTRIES = ['FR', 'GB', 'DE', 'ES', 'IT', 'PT', 'BE', 'NL', 'CH', 'AT', 'IE', 'SE', 'NO', 'DK', 'FI', 'GR', 'RO', 'HU', 'CZ', 'SK', 'BG', 'HR', 'SI', 'EE', 'LV', 'LT', 'LU', 'MT', 'CY', 'IS', 'TR', 'PL', 'RU', 'UA', 'RS', 'MA', 'DZ', 'TN', 'SA', 'AE', 'QA', 'EG', 'LB', 'US', 'CA', 'JP', 'KR', 'CN', 'IN', 'BR', 'MX', 'AR', 'AU', 'NZ'];

export default function ChannelsPageClient() {
  const { locale, t } = useTranslation();
  const [allChannels, setAllChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadChannels = async () => {
      try {
        const res = await fetch('/api/channels');
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data: Channel[] = await res.json();
        const filtered = data.filter((ch) => !ch.is_nsfw && ch.country && ch.name);
        setAllChannels(filtered);
        setLoading(false);
      } catch (err: any) {
        setError(t('channels_page.error'));
        setLoading(false);
      }
    };
    loadChannels();
  }, [t]);

  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [showSearch]);

  const countryGroups = useMemo<CountryGroup[]>(() => {
    const map: Record<string, Channel[]> = {};
    allChannels.forEach((ch) => {
      const code = ch.country.toUpperCase();
      if (!map[code]) map[code] = [];
      map[code].push(ch);
    });
    const groups = Object.entries(map).map(([code, channels]) => ({
      code, name: getCountryName(code), flag: getFlagEmoji(code), channels,
    }));
    groups.sort((a, b) => {
      const ai = PRIORITY_COUNTRIES.indexOf(a.code);
      const bi = PRIORITY_COUNTRIES.indexOf(b.code);
      if (ai !== -1 && bi !== -1) return ai - bi;
      if (ai !== -1) return -1;
      if (bi !== -1) return 1;
      return a.name.localeCompare(b.name);
    });
    return groups;
  }, [allChannels]);

  const globalSearchResults = useMemo(() => {
    if (!search.trim()) return null;
    const q = search.toLowerCase().trim();
    const words = q.split(/\s+/);
    const matchingChannels = allChannels.filter((ch) => {
      const name = ch.name.toLowerCase();
      const country = (getCountryName(ch.country) || '').toLowerCase();
      return words.every((w) => name.includes(w) || country.includes(w));
    }).slice(0, 50);
    const matchingCountries = countryGroups.filter((g) => {
      const name = g.name.toLowerCase();
      return words.every((w) => name.includes(w));
    });
    return { channels: matchingChannels, countries: matchingCountries };
  }, [search, allChannels, countryGroups]);

  const localChannels = useMemo(() => {
    if (!selectedCountry) return [];
    const group = countryGroups.find((g) => g.code === selectedCountry);
    return group?.channels || [];
  }, [selectedCountry, countryGroups]);

  const handleCountryClick = (code: string) => {
    setSelectedCountry(code);
    setSearch('');
    setShowSearch(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setSelectedCountry(null);
    setSearch('');
  };

  const totalChannels = allChannels.length || 10000;
  const showGlobalSearch = search.trim().length > 0 && globalSearchResults !== null;
  const showCountryList = !showGlobalSearch && !selectedCountry;
  const showLocalChannels = !showGlobalSearch && selectedCountry;

  return (
    <main id="main-content" className="min-h-screen bg-bg-base">

      {/* ── HERO SECTION ──────────────────────────────────── */}
      {!selectedCountry && !showGlobalSearch && (
        <section className="relative pt-[100px] md:pt-[140px] pb-[40px] md:pb-[80px] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--brand-from)]/5 via-transparent to-transparent pointer-events-none" />
          <div className="max-w-7xl mx-auto px-[16px] md:px-[40px] relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-4xl mx-auto"
            >
              <div className="inline-flex items-center gap-[8px] px-[14px] py-[6px] bg-[var(--brand-from)]/10 border border-[var(--brand-from)]/20 rounded-full mb-[20px]">
                <span className="w-[6px] h-[6px] rounded-full bg-[var(--brand-from)] animate-pulse" />
                <span className="text-[var(--brand-from)] text-[11px] md:text-xs font-bold uppercase tracking-widest">
                  {t('channels_page.badge')}
                </span>
              </div>

              <h1 className="font-syne font-bold text-[32px] md:text-[64px] text-text-primary mb-[16px] md:mb-[20px] leading-[1.1] tracking-tight">
                {t('channels_page.title_1')}{' '}
                <span className="text-gradient">{t('channels_page.title_gradient')}</span>
              </h1>
              <p className="text-text-secondary text-sm md:text-xl max-w-2xl mx-auto leading-relaxed mb-[32px] md:mb-[40px] px-[8px]">
                {t('channels_page.subtitle')}
              </p>

              <div className="flex flex-wrap justify-center gap-[8px] md:gap-[12px] mb-[32px] md:mb-[48px]">
                <div className="flex items-center gap-[6px] px-[12px] md:px-[16px] py-[6px] md:py-[8px] bg-bg-card/60 border border-border/50 rounded-full text-[11px] md:text-sm font-medium text-text-primary backdrop-blur-sm">
                  <span>🌍</span>
                  <span>{countryGroups.length || '180+'} {t('channels_page.stats_countries')}</span>
                </div>
                <div className="flex items-center gap-[6px] px-[12px] md:px-[16px] py-[6px] md:py-[8px] bg-bg-card/60 border border-border/50 rounded-full text-[11px] md:text-sm font-medium text-text-primary backdrop-blur-sm">
                  <span>📡</span>
                  <span>{totalChannels}+ {t('channels_page.stats_channels')}</span>
                </div>
                <div className="flex items-center gap-[6px] px-[12px] md:px-[16px] py-[6px] md:py-[8px] bg-bg-card/60 border border-border/50 rounded-full text-[11px] md:text-sm font-medium text-text-primary backdrop-blur-sm">
                  <span>🖥️</span>
                  <span>{t('channels_page.stats_hd')}</span>
                </div>
                <div className="flex items-center gap-[6px] px-[12px] md:px-[16px] py-[6px] md:py-[8px] bg-bg-card/60 border border-border/50 rounded-full text-[11px] md:text-sm font-medium text-text-primary backdrop-blur-sm">
                  <span>🔄</span>
                  <span>{t('channels_page.stats_update')}</span>
                </div>
              </div>

              <Link
                href={getLocalizedPath('/nos-plans', locale)}
                className="inline-flex items-center gap-[10px] px-[28px] md:px-[32px] py-[14px] md:py-[16px] bg-gradient-to-r from-[var(--brand-from)] to-[var(--brand-to)] text-white font-bold rounded-xl hover:shadow-[0_0_40px_rgba(0,243,255,0.3)] transition-all duration-300 active:scale-[0.97] touch-manipulation text-sm md:text-base"
              >
                <ShoppingCart className="w-[18px] h-[18px]" />
                {t('channels_page.cta_buy')}
                <ChevronRight className="w-[16px] h-[16px]" />
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* ── SEARCH BAR ────────────────────────────────────── */}
      <div className="sticky top-[60px] md:top-[70px] z-40 bg-bg-base/95 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-[16px] md:px-[40px] py-[10px]">
          <div className="flex items-center gap-[10px]">
            {selectedCountry && !showGlobalSearch ? (
              <>
                <button
                  onClick={handleBack}
                  className="flex items-center gap-[6px] text-text-primary hover:text-[var(--brand-from)] transition-colors active:scale-95 touch-manipulation flex-shrink-0"
                >
                  <ChevronLeft className="w-[20px] h-[20px]" />
                  <span className="text-sm font-semibold hidden sm:inline">{t('channels_page.back')}</span>
                </button>
                <div className="flex items-center gap-[8px] flex-1 min-w-0">
                  <span className="text-xl flex-shrink-0">{getFlagEmoji(selectedCountry)}</span>
                  <span className="font-syne font-bold text-[16px] md:text-[18px] text-text-primary truncate">
                    {getCountryName(selectedCountry)}
                  </span>
                  <span className="text-text-muted text-xs flex-shrink-0">({localChannels.length})</span>
                </div>
              </>
            ) : showGlobalSearch ? (
              <div className="flex-1 min-w-0">
                <span className="font-syne font-bold text-[16px] md:text-[18px] text-text-primary">
                  🔍 {t('channels_page.countries_found')}: "{search}"
                </span>
              </div>
            ) : (
              <div className="flex-1 min-w-0">
                <h2 className="font-syne font-bold text-[16px] md:text-[20px] text-text-primary">
                  🌍 {t('channels_page.browse_countries')}
                </h2>
              </div>
            )}

            <div className="flex items-center gap-[8px] flex-shrink-0">
              {!showSearch ? (
                <button
                  onClick={() => setShowSearch(true)}
                  className="w-[40px] h-[40px] rounded-xl bg-bg-card border border-border flex items-center justify-center text-text-secondary hover:text-[var(--brand-from)] hover:border-[var(--brand-from)]/30 transition-all active:scale-95 touch-manipulation"
                  aria-label={t('channels_page.search_placeholder')}
                >
                  <Search className="w-[18px] h-[18px]" />
                </button>
              ) : (
                <div className="flex items-center gap-[8px]">
                  <div className="relative w-[180px] sm:w-[220px] md:w-[280px]">
                    <Search className="absolute left-[12px] top-1/2 -translate-y-1/2 w-[16px] h-[16px] text-text-muted" />
                    <input
                      ref={searchInputRef}
                      type="search"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder={t('channels_page.search_placeholder')}
                      className="w-full pl-[38px] pr-[32px] py-[10px] bg-bg-card border border-border rounded-xl text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-[var(--brand-from)]/50"
                    />
                    {search && (
                      <button
                        onClick={() => setSearch('')}
                        className="absolute right-[8px] top-1/2 -translate-y-1/2 w-[20px] h-[20px] rounded-full bg-bg-elevated flex items-center justify-center text-text-muted active:scale-90 touch-manipulation"
                      >
                        <X className="w-[12px] h-[12px]" />
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => { setShowSearch(false); setSearch(''); }}
                    className="w-[32px] h-[32px] rounded-lg bg-bg-card border border-border flex items-center justify-center text-text-muted hover:text-text-primary active:scale-90 touch-manipulation"
                  >
                    <X className="w-[16px] h-[16px]" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── CONTENT ───────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-[16px] md:px-[40px] py-[16px] md:py-[24px] pb-[100px] md:pb-[60px]">

        {loading && (
          <div className="flex flex-col items-center justify-center py-[100px] gap-[20px]">
            <div className="w-[50px] h-[50px] border-[3px] border-[var(--brand-from)] border-t-transparent rounded-full animate-spin" />
            <p className="text-text-secondary text-[15px] font-medium">{t('channels_page.loading')}</p>
          </div>
        )}

        {error && (
          <div className="text-center py-[100px]">
            <p className="text-5xl mb-[20px]">⚠️</p>
            <p className="text-text-secondary text-[15px] mb-[24px]">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-[24px] py-[12px] bg-[var(--brand-from)] text-white font-bold rounded-xl active:scale-95 touch-manipulation"
            >
              {t('channels_page.retry')}
            </button>
          </div>
        )}

        {/* ── RECHERCHE GLOBALE ──────────────────────────── */}
        {!loading && !error && showGlobalSearch && (
          <div className="space-y-[24px]">
            {globalSearchResults.countries.length > 0 && (
              <div>
                <p className="text-text-muted text-[11px] font-bold uppercase tracking-wider mb-[10px] px-[4px]">
                  🌍 {t('channels_page.countries_found')} ({globalSearchResults.countries.length})
                </p>
                <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-[10px]">
                  {globalSearchResults.countries.map((g) => (
                    <motion.button
                      key={g.code}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      onClick={() => handleCountryClick(g.code)}
                      className="p-[14px] rounded-xl bg-bg-card border border-border hover:border-[var(--brand-from)]/40 active:scale-[0.97] touch-manipulation text-left transition-all"
                    >
                      <div className="text-2xl mb-[6px]">{g.flag}</div>
                      <p className="text-text-primary text-[12px] font-semibold leading-tight line-clamp-1">{g.name}</p>
                      <span className="text-text-muted text-[10px]">{g.channels.length} {t('channels_page.channels_count')}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {globalSearchResults.channels.length > 0 && (
              <div>
                <p className="text-text-muted text-[11px] font-bold uppercase tracking-wider mb-[10px] px-[4px]">
                  📡 {t('channels_page.channels_found')} ({globalSearchResults.channels.length})
                </p>
                <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-[10px]">
                  {globalSearchResults.channels.map((ch) => (
                    <motion.div
                      key={ch.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-[14px] rounded-xl bg-bg-card border border-border active:scale-[0.97] touch-manipulation transition-all"
                    >
                      <div className="w-[40px] h-[40px] rounded-xl bg-bg-elevated flex items-center justify-center mb-[10px] overflow-hidden">
                        {ch.logo ? (
                          <img src={ch.logo} alt={ch.name} className="w-full h-full object-contain" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                        ) : (
                          <span className="text-lg">{getFlagEmoji(ch.country)}</span>
                        )}
                      </div>
                      <p className="text-text-primary text-[12px] font-semibold leading-tight line-clamp-2 mb-[4px]">{ch.name}</p>
                      <span className="text-text-muted text-[10px]">{getFlagEmoji(ch.country)} {getCountryName(ch.country)}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {globalSearchResults.countries.length === 0 && globalSearchResults.channels.length === 0 && (
              <div className="text-center py-[80px]">
                <p className="text-4xl mb-[16px]">🔍</p>
                <p className="text-text-secondary text-[15px] font-medium">{t('channels_page.no_results')}</p>
                <p className="text-text-muted text-[13px] mt-[6px]">{t('channels_page.no_results_hint')}</p>
              </div>
            )}
          </div>
        )}

        {/* ── LISTE DES PAYS ─────────────────────────────── */}
        {!loading && !error && showCountryList && (
          <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-[10px]">
            {countryGroups.map((group) => (
              <motion.button
                key={group.code}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => handleCountryClick(group.code)}
                className="p-[14px] rounded-xl bg-bg-card border border-border hover:border-[var(--brand-from)]/40 hover:shadow-lg active:scale-[0.97] touch-manipulation text-left transition-all"
              >
                <div className="text-3xl mb-[8px]">{group.flag}</div>
                <p className="text-text-primary text-[13px] font-semibold leading-tight mb-[4px] line-clamp-1">{group.name}</p>
                <span className="inline-block px-[6px] py-[2px] bg-[var(--brand-from)]/10 text-[var(--brand-from)] text-[10px] font-bold rounded">
                  {group.channels.length}
                </span>
              </motion.button>
            ))}
          </div>
        )}

        {/* ── CHAÎNES D'UN PAYS ──────────────────────────── */}
        {!loading && !error && showLocalChannels && (
          <div>
            {localChannels.length === 0 ? (
              <div className="text-center py-[80px]">
                <p className="text-4xl mb-[16px]">📭</p>
                <p className="text-text-secondary text-[15px]">{t('channels_page.no_channels')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-[10px]">
                {localChannels.map((ch, i) => (
                  <motion.div
                    key={ch.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.01, 0.3) }}
                    className="p-[14px] rounded-xl bg-bg-card border border-border active:scale-[0.97] touch-manipulation transition-all hover:border-[var(--brand-from)]/20"
                  >
                    <div className="w-[44px] h-[44px] rounded-xl bg-bg-elevated flex items-center justify-center mb-[10px] overflow-hidden">
                      {ch.logo ? (
                        <img src={ch.logo} alt={ch.name} className="w-full h-full object-contain" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      ) : (
                        <span className="text-xl">{getFlagEmoji(ch.country)}</span>
                      )}
                    </div>
                    <p className="text-text-primary text-[12px] font-semibold leading-tight line-clamp-2 mb-[4px]">{ch.name}</p>
                    {ch.categories?.[0] && (
                      <span className="inline-block px-[5px] py-[1px] bg-[var(--brand-from)]/10 text-[var(--brand-from)] text-[9px] font-bold rounded">
                        {ch.categories[0]}
                      </span>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── CTA ───────────────────────────────────────────── */}
      {!selectedCountry && !showGlobalSearch && (
        <section className="py-[60px] md:py-[80px] bg-bg-card relative overflow-hidden">
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
                <span className="text-success text-[11px] md:text-xs font-bold uppercase tracking-widest">{t('channels_page.activation_badge')}</span>
              </div>
              <h2 className="font-syne font-bold text-[28px] md:text-[48px] text-text-primary mb-[12px] md:mb-[16px] tracking-tight">
                {t('channels_page.cta_title')}
              </h2>
              <p className="text-text-secondary text-sm md:text-lg max-w-2xl mx-auto leading-relaxed mb-[32px] md:mb-[40px] px-[8px]">
                {t('channels_page.cta_subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-[12px] md:gap-[16px]">
                <Link
                  href={getLocalizedPath('/nos-plans', locale)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-[10px] px-[32px] md:px-[40px] py-[16px] md:py-[18px] bg-gradient-to-r from-[var(--brand-from)] to-[var(--brand-to)] text-white font-bold rounded-xl hover:shadow-[0_0_40px_rgba(0,243,255,0.35)] transition-all duration-300 active:scale-[0.97] touch-manipulation text-base md:text-lg"
                >
                  <ShoppingCart className="w-[20px] h-[20px]" />
                  {t('channels_page.cta_plans')}
                  <ChevronRight className="w-[18px] h-[18px]" />
                </Link>
                <Link
                  href={getLocalizedPath('/essai-gratuit', locale)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-[10px] px-[28px] md:px-[32px] py-[16px] md:py-[18px] bg-bg-elevated border border-border text-text-primary font-bold rounded-xl hover:border-[var(--brand-from)]/40 transition-all duration-300 active:scale-[0.97] touch-manipulation text-sm md:text-base"
                >
                  {t('channels_page.cta_trial')}
                </Link>
              </div>
              <p className="mt-[24px] text-text-muted text-sm">
                {t('channels_page.price_from')} <span className="font-bold text-text-primary text-base">{t('channels_page.price_value')}</span> • {t('channels_page.no_commitment')}
              </p>
            </motion.div>
          </div>
        </section>
      )}
    </main>
  );
}
