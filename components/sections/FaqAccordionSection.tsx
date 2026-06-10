'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { fadeInUp, accordionContent } from '@/lib/utils/animations';
import { useTranslation } from '@/hooks/useTranslation';
import { getLocalizedPath } from '@/lib/i18n';
import Link from 'next/link';

export function FaqAccordionSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { t, locale } = useTranslation();

  const faqKeys = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'];

  const toggleIndex = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-80 bg-bg-base relative">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeInUp}
        className="max-w-7xl mx-auto px-[24px] md:px-[40px]"
      >
        <div className="text-center mb-64">
          <h2 className="font-syne font-bold text-32 md:text-48 text-text-primary mb-16 tracking-tight">
            {t('faq.title')}
          </h2>
          <p className="text-text-secondary text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            {t('faq.subtitle')}
          </p>
        </div>

        <div className="max-w-3xl mx-auto flex flex-col gap-16">
          {faqKeys.map((key, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={key}
                variants={fadeInUp}
                className={`rounded-2xl border transition-all duration-300 ${
                  isOpen
                    ? 'bg-bg-elevated border-[var(--brand-from)]/40 shadow-sm'
                    : 'card-glass hover:border-border-active'
                } overflow-hidden`}
              >
                <button
                  onClick={() => toggleIndex(index)}
                  className="w-full px-24 py-16 flex items-center justify-between text-left transition-colors"
                  aria-expanded={isOpen}
                  aria-controls={`faq-content-${index}`}
                >
                  <div className="flex items-center gap-12">
                    <HelpCircle className="w-[20px] h-[20px] text-[var(--brand-from)] flex-shrink-0" />
                    <span className="font-bold text-sm md:text-base text-text-primary">
                      {t(`faq.items.${key}.q`)}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-[20px] h-[20px] text-text-muted transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-[var(--brand-from)]' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      id={`faq-content-${index}`}
                      variants={accordionContent}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="px-24 pb-20"
                    >
                      <div className="pt-16 border-t border-border/40 text-text-secondary text-sm leading-relaxed">
                        {t(`faq.items.${key}.a`)}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center mt-48">
          <Link
            href={getLocalizedPath('/faq', locale)}
            className="inline-flex items-center gap-8 text-cyan-700 dark:text-[var(--brand-from)] font-bold hover:underline text-sm"
          >
            {locale === 'en' ? 'See all FAQs' : locale === 'de' ? 'Alle FAQs ansehen' : locale === 'es' ? 'Ver todas las preguntas frecuentes' : 'Voir toutes les questions fréquentes'}
            <ChevronDown className="w-16 h-16 -rotate-90" />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
