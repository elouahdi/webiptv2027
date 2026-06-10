'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { fadeInUp } from '@/lib/utils/animations';
import { useTranslation } from '@/hooks/useTranslation';
import { getLocalizedPath } from '@/lib/i18n';

export function CtaBannerSection() {
  const { t, locale } = useTranslation();

  return (
    <section className="py-80 bg-gradient-to-r from-[var(--brand-from)] to-[var(--brand-to)] relative overflow-hidden">
      {/* Subtle light overlay */}
      <div className="absolute inset-0 bg-black/[0.05] pointer-events-none" />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeInUp}
        className="max-w-7xl mx-auto px-[24px] md:px-[40px]"
      >
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-8 px-16 py-8 bg-white/20 backdrop-blur-md rounded-full mb-32 hover:scale-[1.02] transition-transform duration-300">
            <Sparkles className="w-16 h-16 text-white" />
            <span className="text-white font-bold text-xs uppercase tracking-wider">
              {locale === 'en' ? 'Limited Offer' : locale === 'de' ? 'Limitiertes Angebot' : locale === 'es' ? 'Oferta limitada' : 'Offre limitée'}
            </span>
          </div>

          <h2 className="font-syne font-bold text-32 md:text-48 text-white mb-24 leading-tight">
            {t('cta_banner.title')}
          </h2>

          <p className="text-white/90 text-sm md:text-base mb-40 max-w-2xl mx-auto leading-relaxed">
            {t('cta_banner.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row gap-16 justify-center max-w-xs sm:max-w-none mx-auto">
            <Link
              href={getLocalizedPath('/nos-plans', locale)}
              className="inline-flex items-center justify-center gap-8 px-32 py-16 bg-white text-slate-950 font-bold rounded-xl hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.15)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-sm"
            >
              {locale === 'en' ? 'See our plans' : locale === 'de' ? 'Unsere Pakete ansehen' : locale === 'es' ? 'Ver nuestros planes' : 'Voir nos abonnements'}
              <ArrowRight className="w-18 h-18" />
            </Link>

            <Link
              href={getLocalizedPath('/essai-gratuit', locale)}
              className="inline-flex items-center justify-center gap-8 px-32 py-16 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-sm"
            >
              {t('nav.trial')}
            </Link>
          </div>

          <p className="text-white/85 text-xs font-semibold mt-24">
            {locale === 'en' 
              ? 'No commitment • Instant activation • 24/7 customer support' 
              : locale === 'de' 
                ? 'Ohne Bindung • Sofortige Aktivierung • 24/7 Kundensupport' 
                : locale === 'es' 
                  ? 'Sin compromiso • Activación instantánea • Soporte técnico 24/7' 
                  : 'Sans engagement • Activation instantanée • Support client 24h/7j'}
          </p>
        </div>
      </motion.div>
    </section>
  );
}
