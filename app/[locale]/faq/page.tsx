import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { WhatsappButton } from '@/components/ui/WhatsappButton';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { FaqAccordionSection } from '@/components/sections/FaqAccordionSection';
import { buildFAQSchema } from '@/lib/seo/schemas';
import { getTranslations, locales } from '@/lib/i18n';
import { SITE_CONFIG } from '@/config/site';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const activeLocale = locales.includes(locale as any) ? locale : 'fr';
  const { t } = getTranslations(activeLocale);
  const baseUrl = SITE_CONFIG.url;
  
  const canonical = activeLocale === 'fr' 
    ? `${baseUrl}/faq` 
    : `${baseUrl}/${activeLocale}/faq`;

  return {
    title: t('nav.faq'),
    description: t('faq.subtitle'),
    alternates: {
      canonical,
      languages: {
        'x-default': `${baseUrl}/faq`,
        'fr': `${baseUrl}/faq`,
        'en': `${baseUrl}/en/faq`,
        'de': `${baseUrl}/de/faq`,
        'es': `${baseUrl}/es/faq`,
      },
    },
  };
}

export default async function FaqPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const activeLocale = locales.includes(locale as any) ? locale : 'fr';
  const { t } = getTranslations(activeLocale);

  const faqKeys = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'];
  const translatedFaqItems = faqKeys.map((key) => ({
    question: t(`faq.items.${key}.q`),
    answer: t(`faq.items.${key}.a`),
    category: 'Général',
  }));

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="min-h-screen bg-bg-base pt-32">
        <div className="border-b border-border/40 bg-bg-card">
          <div className="max-w-7xl mx-auto px-[24px] md:px-[40px] py-16">
            <Breadcrumb items={[{ label: t('nav.faq'), href: activeLocale === 'fr' ? '/faq' : `/${activeLocale}/faq` }]} />
          </div>
        </div>

        <div className="py-64 bg-bg-card border-b border-border/40">
          <div className="max-w-7xl mx-auto px-[24px] md:px-[40px] text-center">
            <h1 className="font-syne font-bold text-32 md:text-56 text-text-primary mb-16 tracking-tight">
              {t('faq.title')}
            </h1>
            <p className="text-text-secondary text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
              {t('faq.subtitle')}
            </p>
          </div>
        </div>

        <FaqAccordionSection />
      </main>
      <Footer />
      <WhatsappButton />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildFAQSchema(translatedFaqItems)),
        }}
      />
    </>
  );
}
