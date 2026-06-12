import { Suspense } from 'react';
import CheckoutForm from './CheckoutForm';
import { readSettings } from '@/lib/cms/settings-storage';
import { getTranslations, locales } from '@/lib/i18n';
import { SITE_CONFIG } from '@/config/site';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const activeLocale = locales.includes(locale as any) ? locale : 'fr';
  const { t } = getTranslations(activeLocale);
  const baseUrl = SITE_CONFIG.url;
  
  const canonical = activeLocale === 'fr' 
    ? `${baseUrl}/checkout` 
    : `${baseUrl}/${activeLocale}/checkout`;

  return {
    title: `${t('checkout.title')} | RegardezIPTV`,
    description: t('checkout.subtitle'),
    robots: {
      index: false,
      follow: false,
    },
    alternates: {
      canonical,
      languages: {
        'x-default': `${baseUrl}/checkout`,
        'fr': `${baseUrl}/checkout`,
        'en': `${baseUrl}/en/checkout`,
        'de': `${baseUrl}/de/checkout`,
        'es': `${baseUrl}/es/checkout`,
      },
    },
  };
}

export default async function CheckoutPage() {
  let pricing: any[] | null = null;
  try {
    const settings = await readSettings();
    pricing = settings.pricing || null;
  } catch {}

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    }>
      <CheckoutForm pricing={pricing} />
    </Suspense>
  );
}
