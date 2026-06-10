'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ArrowRight, Calendar, Clock, Tv, Search, Activity, Trophy } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';
import { getLocalizedPath } from '@/lib/i18n';
import { SPORTS_MATCHES, getLocalizedDateString, SportMatch } from '@/lib/data/sports';

export function SportsGuideClient() {
  const { t, locale } = useTranslation();
  const [viewMode, setViewMode] = useState<'guide' | 'livescores'>('guide');
  const [activeTab, setActiveTab] = useState<'today' | 'tomorrow' | 'week'>('today');
  const [activeSport, setActiveSport] = useState<'all' | 'football' | 'basketball' | 'motorsport' | 'tennis'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [liveScores, setLiveScores] = useState<Record<string, { home: number; away: number; minute: string }>>({});

  // Simulate real-time score updates for native live guide
  useEffect(() => {
    setLiveScores({
      'f1': { home: 1, away: 1, minute: '74\'' },
      'f2': { home: 0, away: 0, minute: '12\'' },
      'b1': { home: 98, away: 96, minute: 'Q4 2:14' },
      't1': { home: 2, away: 1, minute: 'Set 4' },
    });

    const interval = setInterval(() => {
      setLiveScores((prev) => {
        const next = { ...prev };
        if (Math.random() > 0.85 && next['f1']) {
          next['f1'] = { ...next['f1'], home: next['f1'].home + 1 };
        }
        if (Math.random() > 0.88 && next['f2']) {
          next['f2'] = { ...next['f2'], away: next['f2'].away + 1 };
        }
        if (next['b1']) {
          const homeInc = Math.random() > 0.5 ? Math.floor(Math.random() * 3) : 0;
          const awayInc = Math.random() > 0.5 ? Math.floor(Math.random() * 3) : 0;
          next['b1'] = {
            ...next['b1'],
            home: next['b1'].home + homeInc,
            away: next['b1'].away + awayInc,
          };
        }
        return next;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getSportEmoji = (sport: string) => {
    switch (sport) {
      case 'football': return '⚽';
      case 'basketball': return '🏀';
      case 'motorsport': return '🏎️';
      case 'tennis': return '🎾';
      default: return '🏆';
    }
  };

  const getFilteredMatches = () => {
    return SPORTS_MATCHES.filter((match) => {
      if (activeTab === 'today' && match.dayOffset !== 0) return false;
      if (activeTab === 'tomorrow' && match.dayOffset !== 1) return false;
      if (activeTab === 'week' && match.dayOffset > 6) return false;
      if (activeSport !== 'all' && match.sport !== activeSport) return false;

      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          match.homeTeam.toLowerCase().includes(q) || 
          match.awayTeam.toLowerCase().includes(q) || 
          match.league.toLowerCase().includes(q)
        );
      }

      return true;
    });
  };

  const isMatchLive = (match: SportMatch) => {
    return match.dayOffset === 0 && (match.id === 'f1' || match.id === 't1');
  };

  const filteredMatches = getFilteredMatches();

  return (
    <div className="w-full">
      {/* Mode Toggle (Guide vs Live Scores) */}
      <div className="flex justify-center mb-48">
        <div className="flex bg-bg-card p-4 rounded-xl border border-border/80 shadow-md">
          <button
            onClick={() => setViewMode('guide')}
            className={`flex items-center gap-8 px-24 py-12 rounded-lg text-xs font-bold transition-all duration-300 ${
              viewMode === 'guide'
                ? 'bg-gradient-to-r from-[var(--brand-from)] to-[var(--brand-to)] text-white shadow-md'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Trophy className="w-14 h-14" />
            {locale === 'en' ? 'TV Guide & Channels' : locale === 'de' ? 'TV-Programm & Kanäle' : locale === 'es' ? 'Guía de TV y Canales' : 'Guide TV & Chaînes'}
          </button>
          <button
            onClick={() => setViewMode('livescores')}
            className={`flex items-center gap-8 px-24 py-12 rounded-lg text-xs font-bold transition-all duration-300 ${
              viewMode === 'livescores'
                ? 'bg-gradient-to-r from-[var(--brand-from)] to-[var(--brand-to)] text-white shadow-md'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Activity className="w-14 h-14" />
            {locale === 'en' ? 'Real-Time Live Scores' : locale === 'de' ? 'Echtzeit-Live-Scores' : locale === 'es' ? 'Marcadores en Tiempo Real' : 'Scores en Direct (Temps Réel)'}
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === 'guide' ? (
          <motion.div
            key="guide-mode"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Search and Filter Row */}
            <div className="flex flex-col lg:flex-row gap-16 justify-between items-center mb-32">
              {/* Search */}
              <div className="relative w-full lg:max-w-md">
                <Search className="w-18 h-18 text-text-muted absolute left-16 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={locale === 'en' ? 'Search team, league, sport...' : locale === 'de' ? 'Team, Liga, Sport suchen...' : locale === 'es' ? 'Buscar equipo, liga, deporte...' : 'Rechercher une équipe, ligue, sport...'}
                  className="w-full pl-44 pr-16 py-12 bg-bg-card border border-border hover:border-border-active focus:border-[var(--brand-from)] text-sm rounded-xl focus:outline-none text-text-primary placeholder:text-text-muted transition-colors"
                />
              </div>

              {/* Day selection tabs */}
              <div className="flex bg-bg-card p-4 rounded-xl border border-border/80 w-full lg:w-auto">
                {(['today', 'tomorrow', 'week'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 lg:flex-initial px-20 py-10 rounded-lg text-xs font-bold transition-all duration-300 ${
                      activeTab === tab
                        ? 'bg-text-primary text-bg-base shadow-sm'
                        : 'text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    {tab === 'today' ? t('sports.today') : tab === 'tomorrow' ? t('sports.tomorrow') : t('sports.week')}
                  </button>
                ))}
              </div>
            </div>

            {/* Sport Category Buttons */}
            <div className="flex flex-wrap gap-8 mb-40 justify-center lg:justify-start">
              {(['all', 'football', 'basketball', 'motorsport', 'tennis'] as const).map((sport) => (
                <button
                  key={sport}
                  onClick={() => setActiveSport(sport)}
                  className={`px-16 py-8 rounded-full border text-xs font-bold transition-all duration-200 ${
                    activeSport === sport
                      ? 'bg-text-primary text-bg-base border-text-primary'
                      : 'bg-bg-card/40 border-border/50 text-text-secondary hover:text-text-primary hover:border-border-active'
                  }`}
                >
                  <span className="mr-6">{getSportEmoji(sport)}</span>
                  {sport === 'all' 
                    ? t('sports.all') 
                    : sport === 'football' 
                      ? t('sports.football') 
                      : sport === 'basketball' 
                        ? t('sports.basketball') 
                        : sport === 'motorsport' 
                          ? t('sports.motorsport') 
                          : t('sports.tennis')}
                </button>
              ))}
            </div>

            {/* Matches Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
              {filteredMatches.length > 0 ? (
                filteredMatches.map((match) => {
                  const liveData = liveScores[match.id];
                  const isLive = isMatchLive(match);
                  const formattedDate = getLocalizedDateString(match.dayOffset, locale);

                  return (
                    <div
                      key={match.id}
                      className="p-24 rounded-2xl border card-glass card-hover flex flex-col justify-between"
                    >
                      {/* Card Header */}
                      <div className="flex justify-between items-center mb-16 pb-12 border-b border-border/20">
                        <div className="flex items-center gap-6">
                          <span className="text-sm">{getSportEmoji(match.sport)}</span>
                          <span className="text-[11px] font-extrabold uppercase tracking-wider text-text-muted">
                            {match.league}
                          </span>
                        </div>
                        
                        {isLive ? (
                          <span className="inline-flex items-center gap-6 px-8 py-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded text-[9px] font-extrabold uppercase animate-pulse">
                            <span className="w-6 h-6 rounded-full bg-red-500" />
                            {t('sports.live') || 'EN DIRECT'}
                          </span>
                        ) : (
                          <span className="text-[10px] text-text-muted font-bold flex items-center gap-4">
                            <Calendar className="w-12 h-12" />
                            {formattedDate}
                          </span>
                        )}
                      </div>

                      {/* Scoreboard */}
                      <div className="py-16 flex items-center justify-between gap-12">
                        <div className="w-[40%] text-center flex flex-col items-center">
                          <div className="w-48 h-48 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center mb-8 shadow-sm">
                            <span className="text-xl font-syne font-bold text-text-primary">{match.homeTeam.charAt(0)}</span>
                          </div>
                          <span className="text-sm font-bold text-text-primary truncate max-w-full leading-tight">{match.homeTeam}</span>
                        </div>

                        <div className="flex-1 text-center flex flex-col items-center justify-center">
                          {isLive && liveData ? (
                            <div className="flex flex-col items-center">
                              <span className="font-mono font-bold text-24 md:text-28 tracking-wider text-gradient bg-gradient-to-r from-[var(--brand-from)] to-[var(--brand-to)] bg-clip-text text-transparent">
                                {liveData.home} - {liveData.away}
                              </span>
                              <span className="text-[10px] font-bold text-success mt-4 bg-success/10 px-6 py-2 rounded">
                                {liveData.minute}
                              </span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center">
                              <span className="font-mono font-bold text-20 md:text-24 text-text-primary flex items-center gap-4 bg-white/5 px-12 py-6 rounded-xl border border-white/5">
                                <Clock className="w-14 h-14 text-[var(--brand-from)]" />
                                {match.time}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="w-[40%] text-center flex flex-col items-center">
                          <div className="w-48 h-48 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center mb-8 shadow-sm">
                            <span className="text-xl font-syne font-bold text-text-primary">{match.awayTeam.charAt(0)}</span>
                          </div>
                          <span className="text-sm font-bold text-text-primary truncate max-w-full leading-tight">{match.awayTeam}</span>
                        </div>
                      </div>

                      {/* Card Footer */}
                      <div className="mt-16 pt-16 border-t border-border/20 flex flex-col sm:flex-row justify-between items-center gap-12">
                        <div className="flex items-center gap-6 text-xs text-text-muted">
                          <Tv className="w-14 h-14 text-text-muted" />
                          <span>{t('sports.channel') || 'Chaîne :'} <strong className="text-text-secondary">{match.tvChannel}</strong></span>
                        </div>

                        <Link
                          href={getLocalizedPath('/nos-plans', locale)}
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-6 px-16 py-8 bg-success hover:bg-success/90 text-bg-base font-extrabold text-[11px] rounded-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-sm shadow-success/15 uppercase tracking-wide"
                        >
                          <Play className="w-12 h-12 fill-current" />
                          {t('sports.watch_live') || 'Regarder en Direct 4K'}
                          <ArrowRight className="w-12 h-12" />
                        </Link>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full py-64 text-center rounded-2xl border border-dashed border-border/60 bg-bg-card/25 flex flex-col items-center justify-center">
                  <span className="text-24 mb-16">🔍</span>
                  <p className="text-text-secondary text-sm">
                    {t('sports.no_matches') || 'Aucun match prévu dans cette catégorie pour le moment.'}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="livescores-mode"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl border border-border/60 bg-bg-card/50 p-8 shadow-2xl relative overflow-hidden"
          >
            {/* Embedded Real-Time ScoreAxis Widget */}
            <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-r from-[var(--brand-from)] to-[var(--brand-to)] z-10" />
            <iframe
              src="https://www.scoreaxis.com/widget/live-match-list?autoHeight=1&theme=dark&textColor=ffffff&bodyBackground=151515&borderColor=333333&headerBackground=151515&inst=sports-guide"
              width="100%"
              height="750"
              style={{ border: 'none', borderRadius: '12px', background: '#151515' }}
              title="Real-Time Sports Live Scores"
              loading="lazy"
            ></iframe>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trial Promo Banner at Bottom */}
      <div className="mt-64 p-32 rounded-2xl bg-gradient-to-r from-[var(--brand-from)]/15 via-[var(--brand-to)]/10 to-transparent border border-[var(--brand-from)]/25 flex flex-col md:flex-row items-center justify-between gap-24 relative overflow-hidden shadow-lg shadow-brand-from/5">
        <div className="relative z-10 text-center md:text-left">
          <div className="inline-flex items-center gap-6 px-12 py-4 bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-[10px] font-extrabold uppercase rounded-full mb-12">
            <span className="w-6 h-6 rounded-full bg-emerald-500 animate-pulse" />
            Promo exclusive
          </div>
          <h4 className="font-syne font-bold text-lg md:text-xl text-text-primary mb-6">
            {locale === 'en' ? 'Want to watch tonight\'s matches?' : locale === 'de' ? 'Möchten Sie die Spiele von heute Abend sehen?' : locale === 'es' ? '¿Quieres ver los partidos de esta noche?' : 'Vous voulez regarder les matchs de ce soir ?'}
          </h4>
          <p className="text-xs text-text-secondary max-w-xl">
            {locale === 'en' ? 'Get immediate access to over 45,000 global TV channels, premium sports bouquets, and VOD.' : locale === 'de' ? 'Erhalten Sie sofortigen Zugang zu über 45.000 globalen Sendern, Premium-Sportbouquets und VOD.' : locale === 'es' ? 'Obtenga acceso inmediato a más de 45.000 canales globales, paquetes de deportes premium y VOD.' : 'Accédez immédiatement à plus de 45 000 chaînes mondiales, bouquets sports premium et milliers de films/séries.'}
          </p>
        </div>

        <Link
          href={getLocalizedPath('/essai-gratuit', locale)}
          className="relative z-10 w-full md:w-auto inline-flex items-center justify-center gap-8 px-24 py-12 bg-gradient-to-r from-[var(--brand-from)] to-[var(--brand-to)] text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:shadow-[0_0_20px_rgba(0,243,255,0.25)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
        >
          {t('sports.trial_cta') || "Commencer l'essai gratuit 3H"}
          <ArrowRight className="w-14 h-14" />
        </Link>
      </div>
    </div>
  );
}
