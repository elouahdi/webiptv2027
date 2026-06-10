import { Suspense } from 'react';
import CheckoutForm from './CheckoutForm';
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

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F7F8FA] dark:bg-[#0A0A0A] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#00D4FF]/30 border-t-[#00D4FF] rounded-full animate-spin"></div>
      </div>
    }>
      <CheckoutForm />
    </Suspense>
  );
}
