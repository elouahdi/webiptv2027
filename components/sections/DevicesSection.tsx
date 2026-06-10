'use client';

import { motion } from 'framer-motion';
import { Tv, Smartphone, Monitor, Flame } from 'lucide-react';
import { staggerContainer, fadeInUp } from '@/lib/utils/animations';
import { useTranslation } from '@/hooks/useTranslation';

export function DevicesSection() {
  const { t, locale } = useTranslation();

  const devices = [
    { key: 'tv', icon: Tv },
    { key: 'stick', icon: Flame },
    { key: 'mobile', icon: Smartphone },
    { key: 'pc', icon: Monitor },
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
            {t('devices.title')}
          </h2>
          <p className="text-text-secondary text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            {t('devices.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-24">
          {devices.map((device) => (
            <motion.div
              key={device.key}
              variants={fadeInUp}
              className="p-32 rounded-2xl card-glass card-hover text-center"
            >
              <div className="w-[64px] h-[64px] bg-gradient-to-br from-[var(--brand-from)] to-[var(--brand-to)] rounded-2xl flex items-center justify-center mx-auto mb-24 shadow-md shadow-brand-from/15">
                <device.icon className="w-[32px] h-[32px] text-white" />
              </div>
              <h3 className="font-syne font-bold text-lg text-text-primary mb-8">
                {t(`devices.${device.key}`).split('(')[0].trim()}
              </h3>
              <p className="text-text-secondary text-sm">
                {t(`devices.${device.key}`).includes('(') 
                  ? t(`devices.${device.key}`).substring(t(`devices.${device.key}`).indexOf('(') + 1, t(`devices.${device.key}`).indexOf(')'))
                  : ''}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div variants={fadeInUp} className="text-center mt-48">
          <p className="text-text-muted text-sm font-medium">
            {locale === 'en' 
              ? 'And many others: Apple TV, Chromecast, MAG, Firestick, Enigma2, Formuler...' 
              : locale === 'de' 
                ? 'Und viele andere: Apple TV, Chromecast, MAG, Firestick, Enigma2, Formuler...' 
                : locale === 'es' 
                  ? 'Y muchos otros: Apple TV, Chromecast, MAG, Firestick, Enigma2, Formuler...' 
                  : "Et bien d'autres encore : Apple TV, Chromecast, MAG, Firestick, Enigma2, Formuler..."}
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
