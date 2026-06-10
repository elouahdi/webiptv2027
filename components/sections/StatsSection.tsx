'use client';

import { motion } from 'framer-motion';
import { Users, Tv, Star, Clock } from 'lucide-react';
import { CounterNumber } from '@/components/ui/CounterNumber';
import { staggerContainer, fadeInUp } from '@/lib/utils/animations';
import { useTranslation } from '@/hooks/useTranslation';

export function StatsSection() {
  const { t, locale } = useTranslation();

  const stats = [
    {
      icon: Users,
      value: 15000,
      suffix: '+',
      label: t('stats.clients.label'),
    },
    {
      icon: Tv,
      value: 45000,
      suffix: '+',
      label: t('stats.channels.label'),
    },
    {
      icon: Star,
      value: 4.9,
      suffix: '/5',
      label: locale === 'en' ? 'Average rating' : locale === 'de' ? 'Durchschnittsbewertung' : locale === 'es' ? 'Calificación promedio' : 'Note moyenne',
    },
    {
      icon: Clock,
      value: 99.9,
      suffix: '%',
      label: t('stats.uptime.label'),
    },
  ];

  return (
    <section className="py-80 bg-bg-card relative">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="max-w-7xl mx-auto px-[24px] md:px-[40px]"
      >
        <motion.div variants={fadeInUp} className="text-center mb-64">
          <h2 className="font-syne font-bold text-32 md:text-48 text-text-primary mb-16 tracking-tight">
            {locale === 'en' ? 'Our Key Stats' : locale === 'de' ? 'Unsere Kennzahlen' : locale === 'es' ? 'Nuestras Cifras Clave' : 'Nos chiffres clés'}
          </h2>
          <p className="text-text-secondary text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            {locale === 'en' 
              ? 'Unrivaled performance and concrete results that speak for themselves.' 
              : locale === 'de' 
                ? 'Unübertroffene Leistung und konkrete Ergebnisse, die für sich sprechen.' 
                : locale === 'es' 
                  ? 'Rendimiento inigualable y resultados concretos que hablan por sí mismos.' 
                  : "Des performances inégalées et des résultats concrets qui parlent d'eux-mêmes."}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-24">
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={fadeInUp}
              className="text-center p-32 rounded-2xl card-glass card-hover"
            >
              <div className="w-[48px] h-[48px] bg-gradient-to-br from-[var(--brand-from)] to-[var(--brand-to)] rounded-xl flex items-center justify-center mx-auto mb-24 shadow-md shadow-brand-from/10">
                <stat.icon className="w-[24px] h-[24px] text-white" />
              </div>
              <div className="font-syne font-bold text-32 md:text-40 mb-12 text-gradient tracking-tight">
                <CounterNumber end={stat.value} duration={2000} />
                {stat.suffix}
              </div>
              <p className="text-text-secondary text-sm font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
