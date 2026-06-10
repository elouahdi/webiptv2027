'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Play, ArrowRight, Check, Star, ShoppingCart, Tablet } from 'lucide-react';
import { fadeInUp, staggerContainer } from '@/lib/utils/animations';
import { useTranslation } from '@/hooks/useTranslation';
import { getLocalizedPath } from '@/lib/i18n';

export function HeroSection() {
  const { t, locale } = useTranslation();

  const featuresKeys = [
    { key: 'activation', fallback: 'Activation instantanée' },
    { key: 'no_commitment', fallback: 'Sans engagement' },
    { key: 'support', fallback: 'Support 24h/7j' },
    { key: 'guarantee', fallback: 'Garantie 7 jours' },
  ];

  return (
    <section className="relative min-h-[95vh] flex items-center justify-center pt-[140px] pb-96 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--brand-from)]/5 via-transparent to-transparent pointer-events-none" />
      
      {/* Premium blobs */}
      <div className="absolute top-[10%] left-[5%] w-[450px] h-[450px] bg-[var(--brand-from)]/10 dark:bg-[var(--brand-from)]/8 rounded-full blur-[120px] animate-float pointer-events-none" />
      <div className="absolute bottom-[10%] right-[5%] w-[450px] h-[450px] bg-[var(--brand-to)]/10 dark:bg-[var(--brand-to)]/8 rounded-full blur-[120px] animate-float pointer-events-none" style={{ animationDelay: '3s' }} />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="max-w-7xl mx-auto px-[24px] md:px-[40px] relative z-10 w-full"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-48 lg:gap-64 items-center">
          
          {/* Left Column: Text & Conversion Content */}
          <motion.div 
            variants={fadeInUp} 
            className="lg:col-span-6 text-center lg:text-left flex flex-col items-center lg:items-start"
          >
            {/* Promo Badge */}
            <div className="inline-flex items-center gap-8 px-16 py-8 bg-gradient-to-r from-[var(--brand-from)]/10 to-[var(--brand-to)]/10 border border-[var(--brand-from)]/20 rounded-full mb-24 hover:scale-[1.02] transition-transform duration-300">
              <span className="w-8 h-8 bg-gradient-to-r from-[var(--brand-from)] to-[var(--brand-to)] rounded-full animate-pulse" />
              <span className="text-xs md:text-sm font-semibold text-text-primary tracking-wide">
                {t('hero.badge')}
              </span>
            </div>

            {/* Stars rating indicator */}
            <div className="flex items-center gap-8 mb-16 justify-center lg:justify-start">
              <div className="flex items-center gap-[2px]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-[13px] h-[13px] text-amber-400 fill-amber-400" />
                ))}
              </div>
              <span className="text-[13px] text-text-secondary font-medium">
                <strong className="text-text-primary">4.95/5</strong> (+98 200 clients satisfaits)
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="font-syne font-bold text-40 md:text-56 lg:text-64 xl:text-72 text-text-primary mb-20 leading-[1.1] tracking-tight">
              {t('hero.title_1')}{' '}
              <span className="block text-gradient bg-gradient-to-r from-[var(--brand-from)] to-[var(--brand-to)] bg-clip-text text-transparent">
                {t('hero.title_gradient')}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base md:text-lg text-text-secondary mb-32 max-w-xl leading-relaxed">
              {t('hero.subtitle')}
            </p>

            {/* Call to Actions */}
            <div className="flex flex-col sm:flex-row gap-16 justify-center lg:justify-start mb-48 w-full sm:w-auto">
              <Link
                href={getLocalizedPath('/nos-plans', locale)}
                className="inline-flex items-center justify-center gap-8 px-32 py-16 bg-gradient-to-r from-[var(--brand-from)] to-[var(--brand-to)] text-white font-bold rounded-xl hover:shadow-[0_0_30px_rgba(0,243,255,0.3)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-sm"
              >
                <ShoppingCart className="w-16 h-16" />
                {t('hero.cta_plans')}
                <ArrowRight className="w-16 h-16" />
              </Link>
              <Link
                href={getLocalizedPath('/essai-gratuit', locale)}
                className="inline-flex items-center justify-center gap-8 px-32 py-16 bg-bg-elevated hover:bg-border border border-border hover:border-border-active text-text-primary font-bold rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-sm"
              >
                <Play className="w-16 h-16 text-[var(--brand-from)]" />
                {t('hero.cta_trial')}
              </Link>
            </div>

            {/* Trust points grid */}
            <div className="grid grid-cols-2 gap-12 text-xs md:text-sm text-text-muted font-medium w-full max-w-md">
              {featuresKeys.map((item) => (
                <div key={item.key} className="flex items-center gap-8 bg-bg-card/40 px-12 py-8 rounded-lg border border-border/20">
                  <Check className="w-14 h-14 text-success flex-shrink-0" />
                  <span>{t(`hero.features.${item.key}`)}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Multi-Device Visual Mockups */}
          <motion.div
            variants={fadeInUp}
            className="lg:col-span-6 relative w-full aspect-[4/3] sm:aspect-square flex items-center justify-center mt-32 lg:mt-0 lg:-translate-y-16"
          >
            {/* Glowing background radial blur */}
            <div className="absolute inset-0 bg-gradient-radial from-[var(--brand-from)]/20 via-[var(--brand-to)]/5 to-transparent blur-3xl opacity-80 scale-110 pointer-events-none" />

            {/* Device 1: Smart TV (Background Base) */}
            <div className="relative w-full sm:w-[92%] aspect-[16/9] rounded-2xl bg-black border-[3px] border-zinc-800 dark:border-zinc-700 shadow-[0_32px_64px_rgba(0,0,0,0.85)] overflow-hidden transition-transform duration-500 hover:scale-[1.01] z-10">
              {/* Bezel glass glare */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-white/[0.06] pointer-events-none z-20" />
              
              {/* AI Generated IPTV UI screen */}
              <img
                src="/uploads/general/hero_showcase.png"
                alt="IPTV Smart TV Interface"
                className="w-full h-full object-cover object-center"
                loading="eager"
              />

              {/* Glassmorphic live match status card */}
              <div className="absolute bottom-[8px] left-[8px] right-[8px] bg-black/60 backdrop-blur-md border border-white/10 rounded-lg p-[8px] flex items-center justify-between z-20">
                <div className="flex items-center gap-6">
                  <span className="w-6 h-6 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-[9px] font-bold text-white uppercase tracking-wider">DIRECT 4K</span>
                  <span className="text-[10px] font-medium text-white/95 truncate max-w-[100px] sm:max-w-none">
                    Real Madrid vs Barcelona
                  </span>
                </div>
                <div className="text-[9px] text-white/60 font-mono">
                  UHD 60 FPS
                </div>
              </div>
            </div>

            {/* Device 2: iPad/Tablet (Overlapping Bottom-Left) */}
            <div className="absolute bottom-[-6px] left-[1%] w-[46%] aspect-[4/3] rounded-xl bg-zinc-950 border-[3px] border-zinc-800/80 shadow-[0_20px_48px_rgba(0,0,0,0.7)] overflow-hidden hidden sm:flex flex-col z-20 -rotate-3 transition-all duration-500 hover:rotate-0 hover:scale-105">
              {/* Glare glass */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none z-10" />
              
              {/* Tablet Header */}
              <div className="h-[22px] bg-zinc-900 border-b border-white/5 flex items-center justify-between px-[8px] text-[8px] font-bold text-zinc-400">
                <div className="flex items-center gap-4">
                  <Tablet className="w-8 h-8 text-[var(--brand-from)]" />
                  <span>Films & Séries VOD</span>
                </div>
                <div className="flex items-center gap-[2px]">
                  <span className="w-4 h-4 rounded-full bg-emerald-500" />
                  <span>Connexion Stable</span>
                </div>
              </div>

              {/* Tablet Screen content */}
              <div className="flex-1 p-[8px] bg-zinc-950 flex gap-[6px]">
                {/* Categories */}
                <div className="w-[30%] border-r border-white/5 flex flex-col gap-[3px] pr-[4px]">
                  {['Sport Premium', 'Cinéma VOD', 'Séries TV', 'Jeunesse'].map((c, i) => (
                    <div
                      key={c}
                      className={`text-[8px] p-[4px] rounded font-semibold truncate ${
                        i === 1 ? 'bg-gradient-to-r from-[var(--brand-from)]/20 to-[var(--brand-to)]/20 text-white border border-[var(--brand-from)]/30' : 'text-zinc-500'
                      }`}
                    >
                      {c}
                    </div>
                  ))}
                </div>
                {/* Simple grid mockup */}
                <div className="flex-1 grid grid-cols-2 gap-[4px]">
                  {[
                    { t: 'SPIDERMAN', c: 'from-red-950/60 to-zinc-900' },
                    { t: 'DUNE 2', c: 'from-amber-950/60 to-zinc-900' },
                    { t: 'WEDNESDAY', c: 'from-purple-950/60 to-zinc-900' },
                    { t: 'AVATAR', c: 'from-cyan-950/60 to-zinc-900' },
                  ].map((item) => (
                    <div
                      key={item.t}
                      className={`rounded bg-gradient-to-br ${item.c} border border-white/5 p-[4px] flex flex-col justify-between`}
                    >
                      <span className="text-[6px] font-extrabold text-white/90 truncate">{item.t}</span>
                      <div className="flex justify-between items-center mt-[6px]">
                        <span className="text-[5px] text-white/40">★ 4.9</span>
                        <Play className="w-6 h-6 text-white fill-white" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Device 3: iPhone/Smartphone (Floating Bottom-Right) */}
            <div className="absolute bottom-[-20px] right-[2%] w-[26%] sm:w-[23%] aspect-[9/19] rounded-[24px] bg-zinc-950 border-[3px] border-zinc-800/90 shadow-[0_24px_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col z-30 rotate-3 animate-float transition-all duration-500 hover:rotate-0 hover:scale-105">
              {/* Dynamic Island */}
              <div className="absolute top-[5px] left-1/2 -translate-x-1/2 w-[38%] h-[10px] bg-black rounded-full z-20" />
              
              {/* Phone Glare */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.02] to-white/[0.04] pointer-events-none z-10" />

              {/* Phone Title */}
              <div className="pt-[18px] pb-[4px] bg-zinc-900 border-b border-white/5 flex flex-col items-center px-[8px]">
                <span className="text-[8px] font-extrabold text-white uppercase tracking-wider">RegardezIPTV</span>
                <span className="text-[5px] text-zinc-500 mt-[1px]">Sélection Chaînes</span>
              </div>

              {/* Channels List */}
              <div className="flex-1 p-[4px] bg-zinc-950 flex flex-col gap-[4px] overflow-hidden">
                {[
                  { n: 'CANAL+ HD', s: 'LIVE' },
                  { n: 'beIN SPORTS 1', s: 'LIVE' },
                  { n: 'RMC SPORT 1', s: 'LIVE' },
                  { n: 'DAZN UHD', s: 'LIVE' },
                  { n: 'TF1 4K', s: 'OK' },
                ].map((ch) => (
                  <div
                    key={ch.n}
                    className="p-[4px] rounded bg-white/5 border border-white/5 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-[3px] min-w-0">
                      <span className="w-8 h-8 rounded bg-gradient-to-br from-cyan-500 to-indigo-500 flex items-center justify-center text-[4px] font-extrabold text-white flex-shrink-0">
                        {ch.n.substring(0, 2)}
                      </span>
                      <span className="text-[6px] font-bold text-white truncate">{ch.n}</span>
                    </div>
                    <span className={`text-[4px] px-[2px] py-[0.5px] rounded border font-bold ${
                      ch.s === 'LIVE' ? 'bg-red-500/15 border-red-500/20 text-red-400 animate-pulse' : 'bg-emerald-500/15 border-emerald-500/20 text-emerald-400'
                    }`}>
                      {ch.s}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>

        </div>
      </motion.div>
    </section>
  );
}
