import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { WhatsappButton } from '@/components/ui/WhatsappButton';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { PlansSection } from '@/components/sections/PlansSection';
import { GuaranteeSection } from '@/components/sections/GuaranteeSection';
import { buildProductSchema } from '@/lib/seo/schemas';
import { getAllPlansSync } from '@/lib/data/plans';
import { getTranslations, locales } from '@/lib/i18n';
import { SITE_CONFIG } from '@/config/site';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const activeLocale = locales.includes(locale as any) ? locale : 'fr';
  const { t } = getTranslations(activeLocale);
  const baseUrl = SITE_CONFIG.url;
  
  const canonical = activeLocale === 'fr' 
    ? `${baseUrl}/nos-plans` 
    : `${baseUrl}/${activeLocale}/nos-plans`;

  return {
    title: t('plans.title'),
    description: t('plans.subtitle'),
    alternates: {
      canonical,
      languages: {
        'x-default': `${baseUrl}/nos-plans`,
        'fr': `${baseUrl}/nos-plans`,
        'en': `${baseUrl}/en/nos-plans`,
        'de': `${baseUrl}/de/nos-plans`,
        'es': `${baseUrl}/es/nos-plans`,
      },
    },
  };
}

export default async function NosPlansPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const activeLocale = locales.includes(locale as any) ? locale : 'fr';
  const { t } = getTranslations(activeLocale);

  const getTranslatedPlan = (plan: any) => {
    return {
      ...plan,
      name: t(`plans.${plan.slug}.name`),
      description: t(`plans.${plan.slug}.description`),
      badge: t(`plans.${plan.slug}.badge`) || null,
      features: plan.features.map((feature: string) => {
        const lower = feature.toLowerCase();
        if (lower.includes('activation')) return t('plans.features_list.activation');
        if (lower.includes('chaînes') || lower.includes('channels') || lower.includes('kanäle') || lower.includes('canales')) return t('plans.features_list.channels');
        if (lower.includes('qualité') || lower.includes('quality') || lower.includes('qualität') || lower.includes('calidad')) return t('plans.features_list.quality');
        if (lower.includes('mises à jour') || lower.includes('updates') || lower.includes('aktualisierungen') || lower.includes('actualizaciones')) return t('plans.features_list.updates');
        if (lower.includes('rattrapage') || lower.includes('replay') || lower.includes('catch-up') || lower.includes('diferido')) return t('plans.features_list.replay');
        if (lower.includes('support') || lower.includes('soporte')) return t('plans.features_list.support');
        if (lower.includes('supplémentaires') || lower.includes('extra') || lower.includes('adicionales')) return t('plans.features_list.extra_months');
        if (lower.includes('heures') || lower.includes('hours') || lower.includes('stunden') || lower.includes('horas')) return t('plans.features_list.trial_hours');
        if (lower.includes('carte') || lower.includes('card') || lower.includes('kreditkarte') || lower.includes('tarjeta')) return t('plans.features_list.no_card');
        return feature;
      }),
    };
  };

  const featuredPlan = getAllPlansSync().find((p) => p.featured) || getAllPlansSync()[3];
  const translatedFeaturedPlan = getTranslatedPlan(featuredPlan);

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="min-h-screen bg-bg-base pt-32">
        <div className="border-b border-border/40 bg-bg-card">
          <div className="max-w-7xl mx-auto px-[24px] md:px-[40px] py-16">
            <Breadcrumb items={[{ label: t('plans.title'), href: activeLocale === 'fr' ? '/nos-plans' : `/${activeLocale}/nos-plans` }]} />
          </div>
        </div>
        
        <div className="py-64 bg-bg-card border-b border-border/40">
          <div className="max-w-7xl mx-auto px-[24px] md:px-[40px] text-center">
            <h1 className="font-syne font-bold text-32 md:text-56 text-text-primary mb-16 tracking-tight">
              {t('plans.title')}
            </h1>
            <p className="text-text-secondary text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
              {t('plans.subtitle')}
            </p>
          </div>
        </div>

        <PlansSection />
        <GuaranteeSection />
      </main>
      <Footer />
      <WhatsappButton />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildProductSchema(translatedFeaturedPlan)),
        }}
      />
    </>
  );
}
