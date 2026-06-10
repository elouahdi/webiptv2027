'use client';

import { motion } from 'framer-motion';
import { Check, Star, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import type { Plan } from '@/lib/data/plans';
import { useTranslation } from '@/hooks/useTranslation';
import { getLocalizedPath } from '@/lib/i18n';

interface PricingCardProps {
  plan: Plan;
  featured?: boolean;
}

export function PricingCard({ plan, featured = false }: PricingCardProps) {
  const { t, locale } = useTranslation();

  const getTranslatedFeature = (feature: string) => {
    const lower = feature.toLowerCase();
    if (lower.includes('activation')) return t('plans.features_list.activation');
    if (lower.includes('chaînes') || lower.includes('channels') || lower.includes('kanäle') || lower.includes('canales')) return t('plans.features_list.channels');
    if (lower.includes('qualité') || lower.includes('quality') || lower.includes('qualität') || lower.includes('calidad')) return t('plans.features_list.quality');
    if (lower.includes('mises à jour') || lower.includes('updates') || lower.includes('aktualisierungen') || lower.includes('actualizaciones')) return t('plans.features_list.updates');
    if (lower.includes('rattrapage') || lower.includes('replay') || lower.includes('catch-up') || lower.includes('diferido')) return t('plans.features_list.replay');
    if (lower.includes('support') || lower.includes('soporte')) return t('plans.features_list.support');
    if (lower.includes('supplémentaires') || lower.includes('extra') || lower.includes('adicionales')) return t('plans.features_list.extra_months');
    if (lower.includes('heures') || lower.includes('hours') || lower.includes('stunden') || lower.includes('horas')) return t('plans.features_list.trial_hours');
    if (lower.includes('carte') || lower.includes('card') || lower.includes('kreditkarte') || lower.includes('tarjeta')) return t('plans.features_list.no_card');
    return feature;
  };

  const durationLabel = () => {
    if (!plan.duration) return '';
    if (plan.duration === 'month') {
      return locale === 'en' ? '/month' : locale === 'de' ? '/Monat' : locale === 'es' ? '/mes' : '/mois';
    }
    if (plan.duration === 'hour') {
      return locale === 'en' ? '/hour' : locale === 'de' ? '/Stunde' : locale === 'es' ? '/hora' : '/heure';
    }
    return `/${plan.duration}`;
  };

  const planName = t(`plans.${plan.slug}.name`);
  const planBadge = t(`plans.${plan.slug}.badge`);

  /* ── Star renderer: yellow filled / half / empty ── */
  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => {
      const filled = i < Math.floor(rating);
      const half = !filled && i < rating;
      return (
        <span key={i} className="relative inline-block w-[12px] h-[12px]">
          {/* Empty base */}
          <Star className="w-[12px] h-[12px] absolute inset-0 text-amber-200 dark:text-amber-900/60 fill-amber-200 dark:fill-amber-900/60" />
          {/* Filled or half overlay */}
          {(filled || half) && (
            <span
              className="absolute inset-0 overflow-hidden"
              style={{ width: half ? '55%' : '100%' }}
            >
              <Star className="w-[12px] h-[12px] text-amber-400 fill-amber-400" />
            </span>
          )}
        </span>
      );
    });
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      className={cn(
        'relative p-32 rounded-2xl border transition-all duration-300 flex flex-col justify-between w-full h-full card-hover',
        featured
          ? 'bg-gradient-to-b from-[var(--brand-from)]/[0.08] to-[var(--brand-to)]/[0.08] border-[var(--brand-from)] shadow-[0_12px_32px_-8px_rgba(0,243,255,0.2)]'
          : 'card-glass'
      )}
    >
      {featured && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-4 px-12 py-4 bg-gradient-to-r from-[var(--brand-from)] to-[var(--brand-to)] text-white text-xs font-bold rounded-full shadow-md shadow-brand-from/15 uppercase tracking-wider">
            <Star className="w-12 h-12 fill-white" />
            {planBadge || 'MEILLEURE OFFRE'}
          </span>
        </div>
      )}

      <div>
        <div className="mb-24">
          <h3 className="font-syne font-bold text-xl text-text-primary mb-8">
            {planName}
          </h3>
          <div className="flex items-baseline gap-4">
            <span className="font-syne font-bold text-40 md:text-48 text-text-primary tracking-tight">
              {plan.price === 0 ? '0' : plan.price}
            </span>
            {plan.price > 0 && <span className="text-text-secondary font-medium">€</span>}
            {plan.duration && (
              <span className="text-text-muted text-sm font-medium">{durationLabel()}</span>
            )}
          </div>
          {!featured && planBadge && (
            <span className="inline-block mt-8 px-8 py-4 bg-[var(--brand-from)]/10 dark:bg-[var(--brand-from)]/20 text-cyan-700 dark:text-[var(--brand-from)] text-xs font-bold rounded-lg">
              {planBadge}
            </span>
          )}
        </div>

        <ul className="flex flex-col gap-12 mb-24">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-12">
              <Check className="w-16 h-16 text-success flex-shrink-0 mt-[2px]" />
              <span className="text-sm text-text-secondary leading-relaxed">{getTranslatedFeature(feature)}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        {plan.slug === 'essai-3h' ? (
          <a
            href={getLocalizedPath('/essai-gratuit', locale)}
            className="flex items-center justify-center gap-8 w-full py-12 text-center font-bold rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-sm bg-bg-elevated hover:bg-border border border-border hover:border-border-active text-text-primary"
          >
            <ShoppingCart className="w-[15px] h-[15px]" />
            {t('plans.cta_choose')}
          </a>
        ) : (
          <Link
            href={getLocalizedPath(`/checkout?plan=${plan.slug}`, locale)}
            className={cn(
              'flex items-center justify-center gap-8 w-full py-12 text-center font-bold rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-sm',
              featured
                ? 'bg-gradient-to-r from-[var(--brand-from)] to-[var(--brand-to)] text-white hover:shadow-[0_0_20px_rgba(0,243,255,0.3)] shadow-lg shadow-brand-from/10'
                : 'bg-bg-elevated hover:bg-border border border-border hover:border-border-active text-text-primary'
            )}
          >
            <ShoppingCart className="w-[15px] h-[15px]" />
            {t('plans.cta_order')}
          </Link>
        )}

        {plan.reviewCount > 0 && (
          <div className="mt-14 flex items-center justify-center gap-[6px]">
            <div className="flex items-center gap-[2px]">
              {renderStars(plan.rating)}
            </div>
            <span className="text-[11px] font-bold text-amber-500">{plan.rating}</span>
            <span className="text-[10px] text-text-muted font-medium">
              ({plan.reviewCount.toLocaleString('fr-FR')} avis)
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
