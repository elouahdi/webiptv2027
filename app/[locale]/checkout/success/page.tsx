import { CheckCircle, Home, Tv, Mail } from 'lucide-react';
import Link from 'next/link';
import { locales, getLocalizedPath, getTranslations } from '@/lib/i18n';
import { motion } from 'framer-motion';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const activeLocale = locales.includes(locale as any) ? locale : 'fr';
  const { t } = getTranslations(activeLocale);
  return {
    title: `${t('checkout.success.title')} | RegardezIPTV`,
    robots: { index: false, follow: false },
  };
}

export default async function CheckoutSuccessPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const activeLocale = locales.includes(locale as any) ? locale : 'fr';
  const { t } = getTranslations(activeLocale);

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Subtle background texture */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px',
        }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="max-w-lg w-full bg-[#12121A] border border-[#1E1E2E] rounded-2xl p-8 md:p-10 text-center shadow-2xl relative z-10"
      >
        {/* Success icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 400 }}
          className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/20"
        >
          <CheckCircle className="w-10 h-10 text-green-500" />
        </motion.div>

        <h1 className="font-sans font-bold text-2xl md:text-3xl text-white mb-3">
          {t('checkout.success.title')}
        </h1>
        <p className="text-slate-300 text-sm leading-relaxed mb-6">
          {t('checkout.success.subtitle')}
        </p>

        <div className="bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl p-5 mb-8 space-y-3 text-left">
          <div className="flex items-center gap-3 text-sm text-white">
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Mail className="w-4 h-4 text-blue-500" />
            </motion.div>
            <span>{locale === 'en' ? 'Confirmation email sent with your credentials.' : locale === 'de' ? 'Bestätigungs-E-Mail mit Ihren Zugangsdaten gesendet.' : locale === 'es' ? 'Correo de confirmación enviado con tus credenciales.' : 'Email de confirmation envoyé avec vos identifiants.'}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-white">
            <Tv className="w-4 h-4 text-blue-500" />
            <span>{t('checkout.success.activation')}</span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Link
            href={getLocalizedPath('/', activeLocale)}
            className="inline-flex items-center justify-center gap-3 w-full h-13 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all text-base shadow-lg hover:shadow-blue-500/30"
          >
            <Home className="w-5 h-5" />
            {t('checkout.success.back_home')}
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}