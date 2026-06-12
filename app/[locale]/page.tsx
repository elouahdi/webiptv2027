import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { WhatsappButton } from '@/components/ui/WhatsappButton';
import { HeroSection } from '@/components/sections/HeroSection';
import { DeviceCarousel } from '@/components/sections/DeviceCarousel';
import { SeriesCarousel } from '@/components/sections/SeriesCarousel';
import { FeaturesSection } from '@/components/sections/FeaturesSection';
import { StatsSection } from '@/components/sections/StatsSection';
import { PlansSection } from '@/components/sections/PlansSection';
import { ChannelsBouquetsSection } from '@/components/sections/ChannelsBouquetsSection';
import { TechnicalSpecsSection } from '@/components/sections/TechnicalSpecsSection';
import { DevicesSection } from '@/components/sections/DevicesSection';
import { HowItWorksSection } from '@/components/sections/HowItWorksSection';
import { GuaranteeSection } from '@/components/sections/GuaranteeSection';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { BlogPreviewSection } from '@/components/sections/BlogPreviewSection';
import { FaqAccordionSection } from '@/components/sections/FaqAccordionSection';
import { CtaBannerSection } from '@/components/sections/CtaBannerSection';
import { getPublicBlogPosts } from '@/lib/cms/blog-public';
import { buildOrganizationSchema, buildWebSiteSchema } from '@/lib/seo/schemas';
import { getTranslations, locales } from '@/lib/i18n';
import { SITE_CONFIG } from '@/config/site';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const activeLocale = locales.includes(locale as any) ? locale : 'fr';
  const { t } = getTranslations(activeLocale);
  const baseUrl = SITE_CONFIG.url;

  const canonical = activeLocale === 'fr' ? baseUrl : `${baseUrl}/${activeLocale}`;

  return {
    title: t('seo.home_title'),
    description: t('seo.home_description'),
    keywords: [
      'abonnement iptv',
      'iptv france',
      'iptv premium',
      'iptv 4k',
      'meilleur iptv',
      'iptv hd',
      'abonnement iptv pas cher',
      'iptv 45000 chaînes',
      'regarder iptv france',
      'abonnement streaming tv',
    ],
    alternates: {
      canonical,
      languages: {
        'x-default': baseUrl,
        'fr': baseUrl,
        'en': `${baseUrl}/en`,
        'de': `${baseUrl}/de`,
        'es': `${baseUrl}/es`,
      },
    },
    openGraph: {
      title: t('seo.home_title'),
      description: t('seo.home_description'),
      url: canonical,
      siteName: 'RegardezIPTV',
      type: 'website',
      locale: activeLocale === 'fr' ? 'fr_FR' : activeLocale === 'en' ? 'en_GB' : activeLocale,
    },
    twitter: {
      card: 'summary_large_image',
      title: t('seo.home_title'),
      description: t('seo.home_description'),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  // Validate locale but no need to store the result — layout handles the provider
  void (locales.includes(locale as any) ? locale : 'fr');
  const { posts: blogPosts } = await getPublicBlogPosts({ limit: 3 });

  const previewPosts = blogPosts.map((item) => ({
    slug: item.post.slug,
    title: item.post.title,
    excerpt: item.post.excerpt,
    publishedAt: item.post.publishedAt || item.post.createdAt,
    readTime: item.post.readTime,
    category: item.category?.name,
  }));

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main id="main-content" className="min-h-screen">
        <HeroSection />
        <DeviceCarousel />
        <SeriesCarousel />
        <FeaturesSection />
        <StatsSection />
        <PlansSection />
        <ChannelsBouquetsSection />
        <DevicesSection />
        <HowItWorksSection />
        <TechnicalSpecsSection />
        <GuaranteeSection />
        <TestimonialsSection />
        <BlogPreviewSection posts={previewPosts} />
        <FaqAccordionSection />
        <CtaBannerSection />
      </main>
      <Footer />
      <WhatsappButton />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            buildOrganizationSchema(),
            buildWebSiteSchema(),
          ]),
        }}
      />
    </>
  );
}
