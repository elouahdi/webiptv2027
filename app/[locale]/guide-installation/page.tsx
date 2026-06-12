import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { WhatsappButton } from '@/components/ui/WhatsappButton';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { locales, getLocalizedPath } from '@/lib/i18n';
import { SITE_CONFIG } from '@/config/site';
import InstallationGuideClient from './InstallationGuideClient';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const activeLocale = locales.includes(locale as any) ? locale : 'fr';
  const baseUrl = SITE_CONFIG.url;
  
  const canonical = activeLocale === 'fr' 
    ? `${baseUrl}/guide-installation` 
    : `${baseUrl}/${activeLocale}/guide-installation`;

  // Localized SEO Titles and Descriptions
  const seoData = {
    fr: {
      title: "Guide Installation IPTV 2026 | Configurer IPTV sur tous vos appareils | RegardezIPTV",
      description: "Guide complet pour installer et configurer IPTV sur Smart TV, smartphone, PC, Android box. Tutoriels pour GSE Smart IPTV, SS IPTV, VLC, Tivimate, Smart IPTV et plus."
    },
    en: {
      title: "IPTV Installation Guide 2026 | Set up IPTV on All Your Devices | RegardezIPTV",
      description: "Complete guide to install and configure IPTV on Smart TV, smartphone, PC, Android box. Tutorials for GSE Smart IPTV, SS IPTV, VLC, Tivimate, Smart IPTV and more."
    },
    es: {
      title: "Guía de Instalación IPTV 2026 | Configurar IPTV en todos sus dispositivos | RegardezIPTV",
      description: "Guía completa para instalar y configurar IPTV en Smart TV, smartphone, PC, Android box. Tutoriales para GSE Smart IPTV, SS IPTV, VLC, Tivimate, Smart IPTV y más."
    },
    de: {
      title: "IPTV Installationsanleitung 2026 | IPTV auf all Ihren Geräten einrichten | RegardezIPTV",
      description: "Vollständige Anleitung zur Installation und Konfiguration von IPTV auf Smart TV, Smartphone, PC, Android-Box. Anleitungen für GSE Smart IPTV, SS IPTV, VLC, Tivimate, Smart IPTV und mehr."
    }
  };

  const currentSeo = seoData[activeLocale as keyof typeof seoData] || seoData.fr;

  return {
    title: currentSeo.title,
    description: currentSeo.description,
    alternates: {
      canonical,
      languages: {
        'x-default': `${baseUrl}/guide-installation`,
        'fr': `${baseUrl}/guide-installation`,
        'en': `${baseUrl}/en/guide-installation`,
        'de': `${baseUrl}/de/guide-installation`,
        'es': `${baseUrl}/es/guide-installation`,
      },
    },
  };
}

export default async function GuideInstallationPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const activeLocale = locales.includes(locale as any) ? locale : 'fr';

  const breadcrumbLabel = activeLocale === 'en' 
    ? 'Installation Guide' 
    : activeLocale === 'de' 
      ? 'Installationsanleitung' 
      : activeLocale === 'es' 
        ? 'Guía de Instalación' 
        : 'Guide d\'installation';

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="min-h-screen bg-bg-base pt-[60px] md:pt-[70px]">
        <div className="border-b border-border/40 bg-bg-card/30">
          <div className="max-w-7xl mx-auto px-[16px] md:px-[40px] py-4 md:py-8">
            <Breadcrumb 
              items={[
                { 
                  label: breadcrumbLabel, 
                  href: getLocalizedPath('/guide-installation', activeLocale) 
                }
              ]} 
            />
          </div>
        </div>

        <InstallationGuideClient />
      </main>
      <Footer />
      <WhatsappButton />
    </>
  );
}
