
import { Syne, Inter, JetBrains_Mono } from 'next/font/google';
import '../globals.css';
import { SITE_CONFIG } from '@/config/site';
import { buildOrganizationSchema, buildWebSiteSchema } from '@/lib/seo/schemas';
import { getTranslations, locales, messages, type Locale } from '@/lib/i18n';
import { TranslationProvider } from '@/components/providers/TranslationProvider';
import { ThemeProvider } from '@/components/ui/ThemeProvider';

const syne = Syne({
  variable: '--font-syne',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
});

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const activeLocale = locales.includes(locale as any) ? locale : 'fr';
  const { t } = getTranslations(activeLocale);
  const baseUrl = SITE_CONFIG.url;
  
  const canonical = activeLocale === 'fr' ? baseUrl : `${baseUrl}/${activeLocale}`;
  
  const languages: Record<string, string> = {
    'x-default': baseUrl,
    'fr': baseUrl,
    'en': `${baseUrl}/en`,
    'de': `${baseUrl}/de`,
    'es': `${baseUrl}/es`,
  };

  return {
    title: {
      default: `${t('hero.title_1')} - RegardezIPTV`,
      template: `%s | RegardezIPTV`,
    },
    description: t('hero.subtitle'),
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title: `${t('hero.title_1')} - RegardezIPTV`,
      description: t('hero.subtitle'),
      url: canonical,
      siteName: 'RegardezIPTV',
      images: [
        {
          url: SITE_CONFIG.ogImage,
          width: 1200,
          height: 630,
          alt: 'RegardezIPTV',
        },
      ],
      locale: activeLocale === 'fr' ? 'fr_FR' : activeLocale === 'en' ? 'en_US' : activeLocale === 'de' ? 'de_DE' : 'es_ES',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${t('hero.title_1')} - RegardezIPTV`,
      description: t('hero.subtitle'),
      images: [SITE_CONFIG.ogImage],
      creator: '@regardezemission',
    },
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const activeLocale = (locales.includes(locale as Locale) ? locale : 'fr') as Locale;
  const dictionary = messages[activeLocale];

  return (
    <>
      <head>
        <script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildOrganizationSchema()) }}
          suppressHydrationWarning
        />
        <script
          id="website-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildWebSiteSchema()) }}
          suppressHydrationWarning
        />
      </head>
      <div className={`${syne.variable} ${inter.variable} ${jetbrainsMono.variable} min-h-screen bg-bg-base text-text-primary antialiased`}>
        <TranslationProvider locale={activeLocale} dictionary={dictionary}>
          <ThemeProvider>
            <a href="#main" className="skip-to-main">
              {activeLocale === 'en' ? 'Skip to main content' : activeLocale === 'de' ? 'Zum Hauptinhalt springen' : activeLocale === 'es' ? 'Saltar al contenido principal' : 'Aller au contenu principal'}
            </a>
            <div id="main">{children}</div>
          </ThemeProvider>
        </TranslationProvider>
      </div>
    </>
  );
}
