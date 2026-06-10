import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { WhatsappButton } from '@/components/ui/WhatsappButton';
import ChannelsPageClient from './ChannelsPageClient';
import { locales } from '@/lib/i18n';
import { SITE_CONFIG } from '@/config/site';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const activeLocale = locales.includes(locale as any) ? locale : 'fr';
  const baseUrl = SITE_CONFIG.url;
  const canonical = `${baseUrl}${activeLocale === 'fr' ? '' : `/${activeLocale}`}/chaines`;

  const titles: Record<string, string> = {
    fr: 'Liste Chaînes IPTV 2026 | 45 000 Chaînes HD & 4K | RegardezIPTV',
    en: 'IPTV Channel List 2026 | 45,000 HD & 4K Channels | RegardezIPTV',
    de: 'IPTV-Kanalliste 2026 | 45.000 HD & 4K-Kanäle | RegardezIPTV',
    es: 'Lista Canales IPTV 2026 | 45.000 Canales HD y 4K | RegardezIPTV',
  };

  const descriptions: Record<string, string> = {
    fr: 'Découvrez la liste complète de nos 45 000+ chaînes IPTV live en HD et 4K : sport premium (BeIN, RMC, Canal+), cinéma, séries, chaînes françaises, internationales, jeunesse et bien plus.',
    en: 'Browse our complete list of 45,000+ live IPTV channels in HD and 4K: premium sport (BeIN, RMC, Canal+), cinema, series, French and international channels, kids, and much more.',
    de: 'Entdecken Sie unsere vollständige Liste mit 45.000+ Live-IPTV-Kanälen in HD und 4K: Sport-Premium, Kino, Serien, französische und internationale Kanäle, Kinder und mehr.',
    es: 'Descubra la lista completa de nuestros 45.000+ canales IPTV en directo HD y 4K: sport premium, cine, series, canales franceses e internacionales, infantiles y mucho más.',
  };

  const title = titles[activeLocale] || titles.fr;
  const description = descriptions[activeLocale] || descriptions.fr;

  return {
    title,
    description,
    keywords: [
      'liste chaînes iptv',
      'chaînes iptv france',
      'bein sports iptv',
      'canal+ iptv',
      'iptv 4k chaînes',
      'chaînes sport iptv',
      'iptv cinema',
      'chaînes françaises iptv',
      'catalogue iptv',
      '45000 chaînes iptv',
    ],
    alternates: {
      canonical,
      languages: {
        fr: `${baseUrl}/chaines`,
        en: `${baseUrl}/en/chaines`,
        de: `${baseUrl}/de/chaines`,
        es: `${baseUrl}/es/chaines`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'RegardezIPTV',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-snippet': -1,
        'max-image-preview': 'large',
      },
    },
  };
}

export default function ChannelsPage() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <ChannelsPageClient />
      <Footer />
      <WhatsappButton />

      {/* JSON-LD: ItemList of channels */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Chaînes IPTV RegardezIPTV',
            description: 'Catalogue de 45 000+ chaînes IPTV HD et 4K disponibles avec nos abonnements.',
            numberOfItems: 45000,
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'BeIN Sports 1 HD' },
              { '@type': 'ListItem', position: 2, name: 'Canal+ HD' },
              { '@type': 'ListItem', position: 3, name: 'TF1 HD' },
              { '@type': 'ListItem', position: 4, name: 'RMC Sport 1 HD' },
              { '@type': 'ListItem', position: 5, name: 'Eurosport HD' },
            ],
          }),
        }}
      />
    </>
  );
}
