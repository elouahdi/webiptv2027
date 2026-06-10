'use client';

import { motion } from 'framer-motion';
import { Tv, Zap, Globe, Headphones } from 'lucide-react';
import { staggerContainer, fadeInUp } from '@/lib/utils/animations';
import { useTranslation } from '@/hooks/useTranslation';

export function FeaturesSection() {
  const { t } = useTranslation();

  const features = [
    {
      icon: Tv,
      key: 'channels',
    },
    {
      icon: Zap,
      key: 'servers',
    },
    {
      icon: Globe,
      key: 'compatibility',
    },
    {
      icon: Headphones,
      key: 'support',
    },
  ];

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
            {t('features.title')}
          </h2>
          <p className="text-text-secondary text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            {t('features.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-24">
          {features.map((feature) => (
            <motion.div
              key={feature.key}
              variants={fadeInUp}
              className="p-32 rounded-2xl card-glass card-hover"
            >
              <div className="w-[48px] h-[48px] bg-gradient-to-br from-[var(--brand-from)] to-[var(--brand-to)] rounded-xl flex items-center justify-center mb-24 shadow-md shadow-brand-from/10">
                <feature.icon className="w-[24px] h-[24px] text-white" />
              </div>
              <h3 className="font-syne font-bold text-lg text-text-primary mb-12">
                {t(`features.items.${feature.key}.title`)}
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                {t(`features.items.${feature.key}.description`)}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
