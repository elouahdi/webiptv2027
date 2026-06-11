'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PricingCard } from '@/components/ui/PricingCard';
import { staggerContainer, fadeInUp } from '@/lib/utils/animations';
import { useTranslation } from '@/hooks/useTranslation';
import { getAllPlansSync } from '@/lib/data/plans';
import type { PricingPlan } from '@/lib/cms/settings-storage';

const DEFAULT_RATINGS: Record<string, { reviewCount: number; rating: number }> = {
  '1-mois': { reviewCount: 1250, rating: 4.8 },
  '3-mois': { reviewCount: 2100, rating: 4.9 },
  '6-mois': { reviewCount: 3400, rating: 4.9 },
  '12-mois': { reviewCount: 5600, rating: 4.95 },
  '24-mois': { reviewCount: 8900, rating: 4.97 },
  'essai-3h': { reviewCount: 450, rating: 4.7 },
};

export function PlansSection() {
  const { t, locale } = useTranslation();
  const [plans, setPlans] = useState<(PricingPlan & { reviewCount: number; rating: number })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/public/settings')
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (cancelled) return;
        if (data?.pricing) {
          const sorted = (data.pricing as PricingPlan[])
            .filter((p) => p.visible !== false)
            .sort((a, b) => a.order - b.order)
            .map((p) => {
              const fallback = DEFAULT_RATINGS[p.slug] || { reviewCount: 0, rating: 0 };
              return { ...p, reviewCount: p.reviewCount ?? fallback.reviewCount, rating: p.rating ?? fallback.rating };
            });
          setPlans(sorted);
        }
      })
      .catch(() => {
        if (cancelled) return;
        const fallback = getAllPlansSync().map((p) => ({
          ...p,
          visible: true,
          order: 0,
          promoPrice: null,
        }));
        setPlans(fallback);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

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

        {loading ? (
          <div className="flex justify-center py-32">
            <div className="w-8 h-8 border-2 border-brand-from border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-32 max-w-6xl mx-auto items-stretch">
            {plans.map((plan) => (
              <motion.div
                key={plan.slug}
                variants={fadeInUp}
                className="flex h-full"
              >
                <PricingCard plan={plan} featured={plan.featured} />
              </motion.div>
            ))}
          </div>
        )}

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
