'use client';

import { motion } from 'framer-motion';
import { PricingCard } from '@/components/ui/PricingCard';
import { getAllPlansSync } from '@/lib/data/plans';
import { staggerContainer, fadeInUp } from '@/lib/utils/animations';
import { useTranslation } from '@/hooks/useTranslation';

export function PlansSection() {
  const { t, locale } = useTranslation();

  return (
    <section className="py-80 bg-bg-base relative">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="max-w-7xl mx-auto px-[24px] md:px-[40px]"
      >
        <motion.div variants={fadeInUp} className="text-center mb-64">
          <h2 className="font-syne font-bold text-32 md:text-48 text-text-primary mb-16 tracking-tight">
            {t('plans.title')}
          </h2>
          <p className="text-text-secondary text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            {t('plans.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-32 max-w-6xl mx-auto items-stretch">
          {getAllPlansSync().map((plan) => (
            <motion.div
              key={plan.slug}
              variants={fadeInUp}
              className="flex h-full"
            >
              <PricingCard plan={plan} featured={plan.featured} />
            </motion.div>
          ))}
        </div>

        <motion.div variants={fadeInUp} className="text-center mt-64 bg-bg-card/40 p-24 rounded-2xl border border-border/40 max-w-2xl mx-auto">
          <p className="text-text-secondary text-sm mb-12">
            {locale === 'en' 
              ? 'All our plans include: 45,000 channels, unlimited VOD (movies & series), instant activation, 24/7 VIP support.' 
              : locale === 'de' 
                ? 'Alle unsere Pakete beinhalten: 45.000 Kanäle, unbegrenztes VOD (Filme & Serien), sofortige Aktivierung, 24/7 VIP-Support.' 
                : locale === 'es' 
                  ? 'Todos nuestros planes incluyen: 45.000 canales, VOD ilimitado (películas y series), activación instantánea, soporte VIP 24/7.' 
                  : 'Tous nos plans incluent : 45 000 chaînes, VOD illimitée (films et séries), activation instantanée, support VIP 24h/7j.'}
          </p>
          <p className="text-gradient font-bold">
            {locale === 'en' 
              ? '7-Day Money-Back Guarantee without conditions' 
              : locale === 'de' 
                ? '7-Tage Geld-zurück-Garantie ohne Bedingungen' 
                : locale === 'es' 
                  ? 'Garantía de devolución de 7 días sin condiciones' 
                  : 'Garantie de remboursement de 7 jours sans conditions'}
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
