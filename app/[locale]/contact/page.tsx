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
    ? `${baseUrl}/contact` 
    : `${baseUrl}/${activeLocale}/contact`;

  return {
    title: t('nav.contact'),
    description: t('contact_page.subtitle'),
    alternates: {
      canonical,
      languages: {
        'x-default': `${baseUrl}/contact`,
        'fr': `${baseUrl}/contact`,
        'en': `${baseUrl}/en/contact`,
        'de': `${baseUrl}/de/contact`,
        'es': `${baseUrl}/es/contact`,
      },
    },
  };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const activeLocale = locales.includes(locale as any) ? locale : 'fr';
  const { t } = getTranslations(activeLocale);

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="min-h-screen bg-bg-base pt-32">
        <div className="border-b border-border/40 bg-bg-card">
          <div className="max-w-7xl mx-auto px-[24px] md:px-[40px] py-16">
            <Breadcrumb items={[{ label: t('nav.contact'), href: activeLocale === 'fr' ? '/contact' : `/${activeLocale}/contact` }]} />
          </div>
        </div>

        <div className="py-64 bg-bg-card border-b border-border/40">
          <div className="max-w-7xl mx-auto px-[24px] md:px-[40px] text-center">
            <h1 className="font-syne font-bold text-32 md:text-56 text-text-primary mb-16 tracking-tight">
              {t('contact_page.title')}
            </h1>
            <p className="text-text-secondary text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
              {t('contact_page.subtitle')}
            </p>
          </div>
        </div>

        <div className="py-80">
          <div className="max-w-4xl mx-auto px-[24px] md:px-[40px]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-32">
              <div className="rounded-2xl card-glass card-hover p-32 flex flex-col justify-between">
                <div>
                  <h2 className="font-syne font-bold text-xl md:text-2xl text-text-primary mb-16">
                    💬 {t('contact_page.whatsapp_title')}
                  </h2>
                  <p className="text-text-secondary text-sm leading-relaxed mb-24">
                    {t('contact_page.whatsapp_desc')}
                  </p>
                </div>
                <Link
                  href="https://api.whatsapp.com/send?phone=212708245223"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-8 w-full px-24 py-16 bg-[#25D366] text-white font-bold rounded-xl hover:bg-[#128C7E] transition-all hover:scale-[1.02] active:scale-[0.98] duration-300 text-sm shadow-md shadow-[#25D366]/10"
                >
                  {activeLocale === 'en' ? 'Contact on WhatsApp' : activeLocale === 'de' ? 'Über WhatsApp kontaktieren' : activeLocale === 'es' ? 'Contactar en WhatsApp' : 'Contacter sur WhatsApp'}
                </Link>
              </div>

              <div className="rounded-2xl card-glass card-hover p-32 flex flex-col justify-between">
                <div>
                  <h2 className="font-syne font-bold text-xl md:text-2xl text-text-primary mb-16">
                    ✉️ {t('contact_page.email_title')}
                  </h2>
                  <p className="text-text-secondary text-sm leading-relaxed mb-24">
                    {t('contact_page.email_desc')}
                  </p>
                </div>
                <Link
                  href="mailto:contact@regardeziptv.fr"
                  className="inline-flex items-center justify-center gap-8 w-full px-24 py-16 bg-gradient-to-r from-[var(--brand-from)] to-[var(--brand-to)] text-white font-bold rounded-xl hover:shadow-[0_0_20px_rgba(0,243,255,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-sm"
                >
                  {activeLocale === 'en' ? 'Send an email' : activeLocale === 'de' ? 'E-Mail senden' : activeLocale === 'es' ? 'Enviar un correo electrónico' : 'Envoyer un email'}
                </Link>
              </div>
            </div>

            <div className="mt-48 text-center bg-bg-card/40 py-16 px-24 border border-border/40 rounded-xl max-w-sm mx-auto">
              <p className="text-text-muted text-xs font-semibold">
                {activeLocale === 'en' 
                  ? '⏱️ Average response time: < 30 minutes' 
                  : activeLocale === 'de' 
                    ? '⏱️ Durchschnittliche Antwortzeit: < 30 Minuten' 
                    : activeLocale === 'es' 
                      ? '⏱️ Tiempo de respuesta promedio: < 30 minutos' 
                      : '⏱️ Temps de réponse moyen : < 30 minutes'}
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsappButton />
    </>
  );
}
