'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { staggerContainer, fadeInUp } from '@/lib/utils/animations';
import { useTranslation } from '@/hooks/useTranslation';

export function TestimonialsSection() {
  const { t } = useTranslation();

  const testimonialsKeys = ['t1', 't2', 't3'];

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
            {t('testimonials.title')}
          </h2>
          <p className="text-text-secondary text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            {t('testimonials.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-24">
          {testimonialsKeys.map((key) => {
            const name = t(`testimonials.items.${key}.name`);
            return (
              <motion.div
                key={key}
                variants={fadeInUp}
                className="p-32 rounded-2xl card-glass card-hover flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-4 mb-16">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-[14px] h-[14px] text-amber-400 fill-amber-400"
                      />
                    ))}
                  </div>
                  
                  <div className="relative mb-24">
                    <Quote className="w-24 h-24 text-[var(--brand-from)]/10 absolute -top-[8px] -left-[8px]" />
                    <p className="text-text-secondary text-sm relative z-10 pl-16 leading-relaxed italic">
                      "{t(`testimonials.items.${key}.text`)}"
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-12 pt-16 border-t border-border/40">
                  <div className="w-40 h-40 bg-gradient-to-br from-[var(--brand-from)] to-[var(--brand-to)] rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md shadow-brand-from/10">
                    {name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-text-primary">{name}</p>
                    <p className="text-xs text-text-muted">{t(`testimonials.items.${key}.location`)}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
