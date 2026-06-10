'use client';

import { motion } from 'framer-motion';
import { CreditCard, Mail, Play } from 'lucide-react';
import { staggerContainer, fadeInUp } from '@/lib/utils/animations';
import { useTranslation } from '@/hooks/useTranslation';

export function HowItWorksSection() {
  const { t } = useTranslation();

  const steps = [
    {
      icon: CreditCard,
      number: '01',
      key: 'step_1',
    },
    {
      icon: Mail,
      number: '02',
      key: 'step_2',
    },
    {
      icon: Play,
      number: '03',
      key: 'step_3',
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
            {t('how_it_works.title')}
          </h2>
          <p className="text-text-secondary text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            {t('how_it_works.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-24 max-w-5xl mx-auto">
          {steps.map((step) => (
            <motion.div
              key={step.number}
              variants={fadeInUp}
              className="relative p-32 rounded-2xl card-glass card-hover pt-40"
            >
              <div className="absolute top-16 right-20 font-syne font-bold text-32 text-black/[0.04] dark:text-white/[0.04] select-none">
                {step.number}
              </div>
              <div className="w-[48px] h-[48px] bg-bg-elevated border border-border/60 rounded-xl flex items-center justify-center mb-24 shadow-sm">
                <step.icon className="w-[22px] h-[22px] text-[var(--brand-from)]" />
              </div>
              <h3 className="font-syne font-bold text-lg text-text-primary mb-12">
                {t(`how_it_works.${step.key}.title`).replace(/^\d+\.\s*/, '')}
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                {t(`how_it_works.${step.key}.desc`)}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
