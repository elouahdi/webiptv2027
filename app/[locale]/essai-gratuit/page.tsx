import Link from 'next/link';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { WhatsappButton } from '@/components/ui/WhatsappButton';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { getTranslations, locales } from '@/lib/i18n';
import { SITE_CONFIG } from '@/config/site';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const activeLocale = locales.includes(locale as any) ? locale : 'fr';
  const { t } = getTranslations(activeLocale);
  const baseUrl = SITE_CONFIG.url;
  
  const canonical = activeLocale === 'fr' 
    ? `${baseUrl}/essai-gratuit` 
    : `${baseUrl}/${activeLocale}/essai-gratuit`;

  return {
    title: t('nav.trial'),
    description: t('trial_page.subtitle'),
    alternates: {
      canonical,
      languages: {
        'x-default': `${baseUrl}/essai-gratuit`,
        'fr': `${baseUrl}/essai-gratuit`,
        'en': `${baseUrl}/en/essai-gratuit`,
        'de': `${baseUrl}/de/essai-gratuit`,
        'es': `${baseUrl}/es/essai-gratuit`,
      },
    },
  };
}

export default async function EssaiGratuitPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const activeLocale = locales.includes(locale as any) ? locale : 'fr';
  const { t } = getTranslations(activeLocale);

  const getStepText = (stepIndex: number) => {
    switch (stepIndex) {
      case 1:
        return locale === 'en' ? 'Click the WhatsApp button below' : locale === 'de' ? 'Klicken Sie auf den WhatsApp-Button unten' : locale === 'es' ? 'Haga clic en el botón de WhatsApp a continuación' : 'Cliquez sur le bouton WhatsApp ci-dessous';
      case 2:
        return locale === 'en' ? 'Send us a message containing "FREE TRIAL"' : locale === 'de' ? 'Senden Sie uns eine Nachricht mit "KOSTENLOSER TEST"' : locale === 'es' ? 'Envíenos un mensaje que contenga "PRUEBA GRATIS"' : 'Envoyez-nous un message contenant "ESSAI GRATUIT"';
      case 3:
        return locale === 'en' ? 'Receive your detailed connection credentials in a few minutes' : locale === 'de' ? 'Erhalten Sie Ihre detaillierten Zugangsdaten in wenigen Minuten' : locale === 'es' ? 'Reciba sus credenciales de conexión detalladas en unos minutos' : 'Recevez vos identifiants de connexion détaillés en quelques minutes';
      case 4:
        return locale === 'en' ? 'Enjoy 3 hours of full access to all our channels and VOD' : locale === 'de' ? 'Genießen Sie 3 Stunden vollen Zugriff auf alle Kanäle und VOD' : locale === 'es' ? 'Disfrute de 3 horas de acceso completo a todos nuestros canales y VOD' : "Profitez de 3 heures d'accès complet à toutes nos chaînes et VOD";
      default:
        return '';
    }
  };

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="min-h-screen bg-bg-base pt-32">
        <div className="border-b border-border/40 bg-bg-card">
          <div className="max-w-7xl mx-auto px-[24px] md:px-[40px] py-16">
            <Breadcrumb items={[{ label: t('nav.trial'), href: activeLocale === 'fr' ? '/essai-gratuit' : `/${activeLocale}/essai-gratuit` }]} />
          </div>
        </div>

        <div className="py-64 bg-bg-card border-b border-border/40">
          <div className="max-w-7xl mx-auto px-[24px] md:px-[40px] text-center">
            <h1 className="font-syne font-bold text-32 md:text-56 text-text-primary mb-16 tracking-tight">
              {t('trial_page.title')}
            </h1>
            <p className="text-text-secondary text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
              {t('trial_page.subtitle')}
            </p>
          </div>
        </div>

        <div className="py-80">
          <div className="max-w-4xl mx-auto px-[24px] md:px-[40px]">
            <div className="rounded-2xl card-glass p-32 mb-32">
              <h2 className="font-syne font-bold text-xl md:text-2xl text-text-primary mb-24">
                {locale === 'en' ? 'How to get your free trial?' : locale === 'de' ? 'Wie bekomme ich meinen kostenlosen Test?' : locale === 'es' ? '¿Cómo obtener su prueba gratis?' : 'Comment obtenir votre essai gratuit ?'}
              </h2>
              <ol className="flex flex-col gap-16 text-text-secondary">
                {[1, 2, 3, 4].map((stepNum) => (
                  <li key={stepNum} className="flex items-start gap-12 text-sm leading-relaxed">
                    <span className="flex-shrink-0 w-[28px] h-[28px] bg-gradient-to-br from-[var(--brand-from)] to-[var(--brand-to)] text-white rounded-full flex items-center justify-center font-bold text-xs shadow-sm shadow-brand-from/15">
                      {stepNum}
                    </span>
                    <span className="pt-[4px]">{getStepText(stepNum)}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="bg-gradient-to-r from-[var(--brand-from)] to-[var(--brand-to)] rounded-2xl p-32 text-center relative overflow-hidden shadow-lg shadow-brand-from/10">
              <div className="absolute inset-0 bg-black/[0.03] pointer-events-none" />
              <h2 className="font-syne font-bold text-24 md:text-32 text-white mb-12 relative z-10">
                {locale === 'en' ? 'Start your free trial now' : locale === 'de' ? 'Starten Sie jetzt Ihren kostenlosen Test' : locale === 'es' ? 'Comience su prueba gratis ahora' : 'Commencez votre essai gratuit maintenant'}
              </h2>
              <p className="text-white/95 mb-24 text-sm relative z-10">
                {t('trial_page.whatsapp_desc')}
              </p>
              <Link
                href={`https://api.whatsapp.com/send?phone=212708245223&text=${locale === 'en' ? 'FREE TRIAL' : locale === 'de' ? 'KOSTENLOSER TEST' : locale === 'es' ? 'PRUEBA GRATIS' : 'ESSAI GRATUIT'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-8 px-32 py-16 bg-white text-slate-950 font-bold rounded-xl hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.15)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-sm relative z-10"
              >
                {t('trial_page.whatsapp_btn')}
              </Link>
            </div>

            <div className="mt-48 grid grid-cols-1 md:grid-cols-3 gap-24">
              <div className="rounded-2xl card-glass card-hover p-24 text-center">
                <div className="w-[48px] h-[48px] bg-[var(--brand-from)]/10 rounded-full flex items-center justify-center mx-auto mb-16 shadow-sm">
                  <svg className="w-[22px] h-[22px] text-cyan-600 dark:text-[var(--brand-from)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-text-primary text-base mb-8">
                  {locale === 'en' ? '3 Hours' : locale === 'de' ? '3 Stunden' : locale === 'es' ? '3 Horas' : '3 Heures'}
                </h3>
                <p className="text-text-secondary text-xs">
                  {locale === 'en' ? 'Total duration of the free trial' : locale === 'de' ? 'Gesamtdauer des kostenlosen Tests' : locale === 'es' ? 'Duración total de la prueba gratis' : "Durée totale de l'essai gratuit"}
                </p>
              </div>

              <div className="rounded-2xl card-glass card-hover p-24 text-center">
                <div className="w-[48px] h-[48px] bg-[var(--brand-from)]/10 rounded-full flex items-center justify-center mx-auto mb-16 shadow-sm">
                  <svg className="w-[22px] h-[22px] text-cyan-600 dark:text-[var(--brand-from)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-text-primary text-base mb-8">
                  {locale === 'en' ? 'Full Access' : locale === 'de' ? 'Vollzugriff' : locale === 'es' ? 'Acceso Completo' : 'Accès Complet'}
                </h3>
                <p className="text-text-secondary text-xs">{t('plans.features_list.channels')}</p>
              </div>

              <div className="rounded-2xl card-glass card-hover p-24 text-center">
                <div className="w-[48px] h-[48px] bg-[var(--brand-from)]/10 rounded-full flex items-center justify-center mx-auto mb-16 shadow-sm">
                  <svg className="w-[22px] h-[22px] text-cyan-600 dark:text-[var(--brand-from)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="font-bold text-text-primary text-base mb-8">{t('hero.features.no_commitment')}</h3>
                <p className="text-text-secondary text-xs">{t('plans.features_list.no_card')}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsappButton />
    </>
  );
}
