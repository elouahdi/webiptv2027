'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, RefreshCw, Headphones } from 'lucide-react';
import { fadeInUp } from '@/lib/utils/animations';
import { useTranslation } from '@/hooks/useTranslation';

export function GuaranteeSection() {
  const { t, locale } = useTranslation();

  const guarantees = [
    {
      icon: ShieldCheck,
      title: locale === 'en' ? '7-Day Guarantee' : locale === 'de' ? '7-Tage-Garantie' : locale === 'es' ? 'Garantía de 7 días' : 'Garantie 7 jours',
      description: locale === 'en' 
        ? 'Money-back guarantee. Test our service risk-free for 7 days.' 
        : locale === 'de' 
          ? 'Geld-zurück-Garantie. Testen Sie unseren Service 7 Tage risikofrei.' 
          : locale === 'es' 
            ? 'Satisfecho o reembolsado. Pruebe nuestro servicio sin riesgo durante 7 días.' 
            : 'Satisfait ou remboursé. Testez notre service sans risque pendant 7 jours.',
    },
    {
      icon: RefreshCw,
      title: t('plans.features_list.activation'),
      description: locale === 'en' 
        ? 'Receive your credentials in less than 5 minutes after payment.' 
        : locale === 'de' 
          ? 'Erhalten Sie Ihre Zugangsdaten in weniger als 5 Minuten nach der Zahlung.' 
          : locale === 'es' 
            ? 'Reciba sus credenciales en menos de 5 minutos después del pago.' 
            : 'Recevez vos identifiants en moins de 5 minutes après votre paiement.',
    },
    {
      icon: Headphones,
      title: t('plans.features_list.support'),
      description: locale === 'en' 
        ? 'Our technical team is available at any time to help you.' 
        : locale === 'de' 
          ? 'Unser technisches Team steht Ihnen jederzeit zur Verfügung.' 
          : locale === 'es' 
            ? 'Nuestro equipo técnico está disponible en cualquier momento para ayudarle.' 
            : 'Notre équipe technique est disponible à tout moment pour vous aider.',
    },
  ];

  return (
    <section className="py-80 bg-bg-base relative">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="max-w-7xl mx-auto px-[24px] md:px-[40px]"
      >
        <motion.div variants={fadeInUp} className="text-center mb-64">
          <h2 className="font-syne font-bold text-32 md:text-48 text-text-primary mb-16 tracking-tight">
            {locale === 'en' ? 'Our Commitment' : locale === 'de' ? 'Unsere Verpflichtung' : locale === 'es' ? 'Nuestro Compromiso' : "Notre engagement"}
          </h2>
          <p className="text-text-secondary text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            {locale === 'en' 
              ? 'Your satisfaction is our absolute priority. We make every effort to offer you an impeccable service.' 
              : locale === 'de' 
                ? 'Ihre Zufriedenheit ist unsere absolute Priorität. Wir setzen alles daran, Ihnen einen einwandfreien Service zu bieten.' 
                : locale === 'es' 
                  ? 'Su satisfacción es nuestra prioridad absoluta. Hacemos todo lo posible para ofrecerle un servicio impecable.' 
                  : "Votre satisfaction est notre priorité absolue. Nous mettons tout en œuvre pour vous offrir un service irréprochable."}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-32 max-w-5xl mx-auto">
          {guarantees.map((guarantee) => (
            <motion.div
              key={guarantee.title}
              variants={fadeInUp}
              className="text-center p-32 rounded-2xl card-glass card-hover"
            >
              <div className="w-[64px] h-[64px] bg-gradient-to-br from-[var(--brand-from)] to-[var(--brand-to)] rounded-full flex items-center justify-center mx-auto mb-24 shadow-md shadow-brand-from/15">
                <guarantee.icon className="w-[32px] h-[32px] text-white" />
              </div>
              <h3 className="font-syne font-bold text-lg md:text-xl text-text-primary mb-12">
                {guarantee.title}
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                {guarantee.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div variants={fadeInUp} className="text-center mt-48">
          <div className="inline-flex items-center gap-8 px-24 py-12 bg-black/[0.03] dark:bg-white/[0.05] border border-black/[0.05] dark:border-white/[0.08] rounded-full">
            <span className="text-cyan-700 dark:text-[var(--brand-from)] text-sm font-bold tracking-wide">
              {locale === 'en' ? '🔒 100% Satisfaction Guaranteed' : locale === 'de' ? '🔒 100% Zufriedenheit Garantiert' : locale === 'es' ? '🔒 100% Satisfacción Garantizada' : '🔒 100% Satisfaction Garantie'}
            </span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
