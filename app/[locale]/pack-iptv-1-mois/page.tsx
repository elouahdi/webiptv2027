import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { WhatsappButton } from '@/components/ui/WhatsappButton';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { readSettings } from '@/lib/cms/settings-storage';
import { getPlanBySlugSync } from '@/lib/data/plans';
import type { Plan } from '@/lib/data/plans';
import { buildProductSchema, buildBreadcrumbSchema } from '@/lib/seo/schemas';
import { notFound } from 'next/navigation';
import { getTranslations, locales, getLocalizedPath } from '@/lib/i18n';
import { SITE_CONFIG } from '@/config/site';
import {
  CheckCircle,
  Star,
  Shield,
  Clock,
  CreditCard,
  Smartphone,
  Zap,
  Tv,
  Globe,
  Film,
  Users,
  Headphones,
} from 'lucide-react';
import Link from 'next/link';
import { FaqAccordion } from './FaqAccordion';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const activeLocale = locales.includes(locale as any) ? locale : 'fr';
  const baseUrl = SITE_CONFIG.url;
  const canonical = activeLocale === 'fr'
    ? `${baseUrl}/pack-iptv-1-mois`
    : `${baseUrl}/${activeLocale}/pack-iptv-1-mois`;

  const titles: Record<string, string> = {
    fr: 'Abonnement IPTV 1 Mois | Accès Immédiat | RegardezIPTV',
    en: 'IPTV Subscription 1 Month | Immediate Access | RegardezIPTV',
    de: 'IPTV-Abonnement 1 Monat | Sofortiger Zugang | RegardezIPTV',
    es: 'Suscripción IPTV 1 Mes | Acceso Inmediato | RegardezIPTV',
  };
  const descriptions: Record<string, string> = {
    fr: 'Découvrez notre abonnement IPTV 1 mois dès 17,99€. Plus de 45 000 chaînes HD/4K, VOD illimitée, compatible tous appareils. Activation immédiate.',
    en: 'Discover our 1-month IPTV subscription from €17.99. Over 45,000 HD/4K channels, unlimited VOD, compatible with all devices. Immediate activation.',
    de: 'Entdecken Sie unser 1-monatiges IPTV-Abonnement ab 17,99€. Über 45.000 HD/4K-Sender, unbegrenzte VOD, mit allen Geräten kompatibel.',
    es: 'Descubra nuestra suscripción IPTV de 1 mes desde 17,99€. Más de 45 000 canales HD/4K, VOD ilimitado, compatible con todos los dispositivos.',
  };

  return {
    title: titles[activeLocale] || titles.fr,
    description: descriptions[activeLocale] || descriptions.fr,
    alternates: {
      canonical,
      languages: {
        'x-default': `${baseUrl}/pack-iptv-1-mois`,
        'fr': `${baseUrl}/pack-iptv-1-mois`,
        'en': `${baseUrl}/en/pack-iptv-1-mois`,
        'de': `${baseUrl}/de/pack-iptv-1-mois`,
        'es': `${baseUrl}/es/pack-iptv-1-mois`,
      },
    },
  };
}

const bouquets = [
  {
    icon: '🏆',
    title: 'Sport Premium',
    channels: 'BeIN Sports, RMC Sport, Canal+ Sport, Eurosport, DAZN',
  },
  {
    icon: '🎬',
    title: 'Cinéma & Séries',
    channels: 'Canal+, OCS, Netflix-like VOD, Amazon-like content',
  },
  {
    icon: '📺',
    title: 'Divertissement',
    channels: 'TF1, France TV, M6, TMC, W9, Arte',
  },
  {
    icon: '🌍',
    title: 'International',
    channels: 'Chaînes arabes, turques, espagnoles, portugaises',
  },
  {
    icon: '👶',
    title: 'Jeunesse',
    channels: 'Disney Channel, Cartoon Network, Nickelodeon, Gulli',
  },
  {
    icon: '🎵',
    title: 'Musique & Culture',
    channels: 'MTV, Trace, Mezzo, Melody',
  },
];

const highlightIcons: Record<string, React.ElementType> = {
  Zap,
  Shield,
  Tv,
  Clock,
  Globe,
  Film,
  Users,
  Headphones,
};

export default async function PackIptv1MoisPage({ params }: PageProps) {
  const { locale } = await params;
  const activeLocale = locales.includes(locale as any) ? locale : 'fr';
  const { t } = getTranslations(activeLocale);

  const settings = await readSettings();
  const settingsPlan = settings.pricing.find((p) => p.slug === '1-mois');
  const defaultPlan = getPlanBySlugSync('1-mois');
  if (!defaultPlan) notFound();
  const plan: Plan = settingsPlan
    ? { ...defaultPlan, ...settingsPlan, reviewCount: settingsPlan.reviewCount ?? defaultPlan.reviewCount, rating: settingsPlan.rating ?? defaultPlan.rating, highlights: settingsPlan.highlights ?? defaultPlan.highlights, faq: settingsPlan.faq ?? defaultPlan.faq }
    : defaultPlan;

  const extraFaq = [
    {
      question: activeLocale === 'en' ? 'How do I activate my 1-month IPTV subscription?' : activeLocale === 'de' ? 'Wie aktiviere ich mein 1-monatiges IPTV-Abonnement?' : activeLocale === 'es' ? '¿Cómo activo mi suscripción IPTV de 1 mes?' : 'Comment activer mon abonnement IPTV 1 mois ?',
      answer: activeLocale === 'en' ? 'After payment, you receive your credentials by email in less than 5 minutes. Follow our simple installation guide to configure your device.' : activeLocale === 'de' ? 'Nach der Zahlung erhalten Sie Ihre Zugangsdaten innerhalb von 5 Minuten per E-Mail. Folgen Sie unserer einfachen Installationsanleitung.' : activeLocale === 'es' ? 'Después del pago, recibirá sus credenciales por correo electrónico en menos de 5 minutos.' : "Après paiement, vous recevez vos identifiants par email en moins de 5 minutes. Suivez notre guide d'installation simple pour configurer votre appareil.",
    },
    {
      question: activeLocale === 'en' ? 'Which devices are compatible?' : activeLocale === 'de' ? 'Welche Geräte sind kompatibel?' : activeLocale === 'es' ? '¿Qué dispositivos son compatibles?' : 'Quels appareils sont compatibles ?',
      answer: activeLocale === 'en' ? 'Smart TV Samsung/LG, Android TV, Firestick, MAG Box, iOS, Android, PC/Mac. All popular IPTV apps are supported.' : activeLocale === 'de' ? 'Smart TV Samsung/LG, Android TV, Firestick, MAG Box, iOS, Android, PC/Mac. Alle gängigen IPTV-Apps werden unterstützt.' : activeLocale === 'es' ? 'Smart TV Samsung/LG, Android TV, Firestick, MAG Box, iOS, Android, PC/Mac.' : 'Smart TV Samsung/LG, Android TV, Firestick, MAG Box, iOS, Android, PC/Mac. Toutes les applications IPTV populaires sont supportées.',
    },
    {
      question: activeLocale === 'en' ? 'Is there a commitment?' : activeLocale === 'de' ? 'Gibt es eine Bindung?' : activeLocale === 'es' ? '¿Hay compromiso?' : "Y a-t-il un engagement ?",
      answer: activeLocale === 'en' ? "No commitment. The 1-month subscription expires automatically without renewal." : activeLocale === 'de' ? "Keine Bindung. Das 1-Monats-Abonnement läuft automatisch aus." : activeLocale === 'es' ? "Sin compromiso. La suscripción de 1 mes expira automáticamente." : "Aucun engagement. L'abonnement 1 mois expire automatiquement sans renouvellement. Vous êtes libre de renouveler quand vous le souhaitez.",
    },
  ];

  const allFaq = [...plan.faq, ...extraFaq];

  const breadcrumbItems = [
    { label: t('plans.title'), href: getLocalizedPath('/nos-plans', activeLocale) },
    { label: activeLocale === 'en' ? 'IPTV Pack 1 Month' : activeLocale === 'de' ? 'IPTV-Paket 1 Monat' : activeLocale === 'es' ? 'Pack IPTV 1 Mes' : 'Pack IPTV 1 Mois', href: getLocalizedPath('/pack-iptv-1-mois', activeLocale) },
  ];

  const breadcrumbSchema = buildBreadcrumbSchema([
    { label: activeLocale === 'en' ? 'Home' : activeLocale === 'de' ? 'Startseite' : activeLocale === 'es' ? 'Inicio' : 'Accueil', url: activeLocale === 'fr' ? '/' : `/${activeLocale}` },
    { label: t('plans.title'), url: `${activeLocale === 'fr' ? '' : `/${activeLocale}`}/nos-plans` },
    { label: 'Pack IPTV 1 Mois', url: `${activeLocale === 'fr' ? '' : `/${activeLocale}`}/pack-iptv-1-mois` },
  ]);

  const checkoutHref = getLocalizedPath('/checkout?plan=1-mois', activeLocale);
  const orderLabel = activeLocale === 'en' ? 'Order Now — €17.99/month' : activeLocale === 'de' ? 'Jetzt bestellen — 17,99€/Monat' : activeLocale === 'es' ? 'Pedir ahora — 17,99€/mes' : 'Commander maintenant — 17,99€/mois';
  const whyChooseTitle = activeLocale === 'en' ? 'Why choose the 1 Month plan?' : activeLocale === 'de' ? 'Warum das 1-Monats-Paket wählen?' : activeLocale === 'es' ? '¿Por qué elegir el plan de 1 mes?' : "Pourquoi choisir l'abonnement 1 Mois ?";
  const includedTitle = activeLocale === 'en' ? 'What is included' : activeLocale === 'de' ? 'Was ist enthalten' : activeLocale === 'es' ? 'Qué incluye' : 'Ce qui est inclus';
  const bouquetsTitle = activeLocale === 'en' ? 'Included channel bouquets' : activeLocale === 'de' ? 'Enthaltene Senderpakete' : activeLocale === 'es' ? 'Bouquets de canales incluidos' : 'Bouquets de chaînes inclus';
  const paymentTitle = activeLocale === 'en' ? 'Secure Payment Methods' : activeLocale === 'de' ? 'Sichere Zahlungsmethoden' : activeLocale === 'es' ? 'Métodos de Pago Seguros' : 'Méthodes de paiement sécurisées';
  const faqTitle = activeLocale === 'en' ? 'Frequently Asked Questions — 1 Month' : activeLocale === 'de' ? 'Häufige Fragen — 1 Monat' : activeLocale === 'es' ? 'Preguntas Frecuentes — 1 Mes' : 'Questions fréquentes — Abonnement 1 Mois';
  const reviewsLabel = activeLocale === 'en' ? 'verified customer reviews' : activeLocale === 'de' ? 'verifizierte Kundenbewertungen' : activeLocale === 'es' ? 'opiniones verificadas' : 'avis clients vérifiés';
  const sslLabel = activeLocale === 'en' ? 'Secure SSL Payment' : activeLocale === 'de' ? 'Sichere SSL-Zahlung' : activeLocale === 'es' ? 'Pago seguro SSL' : 'Paiement sécurisé SSL';
  const activationLabel = activeLocale === 'en' ? 'Instant activation < 5 min' : activeLocale === 'de' ? 'Sofortige Aktivierung < 5 Min' : activeLocale === 'es' ? 'Activación instantánea < 5 min' : 'Activation instantanée < 5 min';
  const guaranteeLabel = activeLocale === 'en' ? '7-day money-back guarantee' : activeLocale === 'de' ? '7 Tage Geld-zurück-Garantie' : activeLocale === 'es' ? 'Garantía de devolución 7 días' : 'Garantie 7 jours satisfait/remboursé';

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="min-h-screen bg-bg-base pt-32">
        {/* Breadcrumb */}
        <div className="border-b border-border/40 bg-bg-card">
          <div className="max-w-7xl mx-auto px-[24px] md:px-[40px] py-16">
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </div>

        {/* Hero Section */}
        <div className="py-[64px] bg-gradient-to-br from-brand-from/[0.08] to-brand-to/[0.08] border-b border-border/40 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] pointer-events-none" />
          <div className="max-w-7xl mx-auto px-[24px] md:px-[40px]">
            <div className="max-w-4xl mx-auto text-center relative z-10">
              <div className="inline-block px-16 py-8 bg-gradient-to-r from-brand-from to-brand-to text-white font-bold text-xs uppercase tracking-wider rounded-full mb-16 shadow-sm shadow-brand-from/15">
                {activeLocale === 'en' ? '🔥 No commitment — Activation in 2 minutes' : activeLocale === 'de' ? '🔥 Ohne Bindung — Aktivierung in 2 Minuten' : activeLocale === 'es' ? '🔥 Sin compromiso — Activación en 2 minutos' : '🔥 Sans engagement — Activation en 2 minutes'}
              </div>
              <h1 className="font-syne font-bold text-32 md:text-56 text-text-primary mb-16 tracking-tight">
                {activeLocale === 'en' ? 'IPTV Subscription 1 Month — Try Without Commitment' : activeLocale === 'de' ? 'IPTV-Abonnement 1 Monat — Unverbindlich testen' : activeLocale === 'es' ? 'Suscripción IPTV 1 Mes — Pruebe Sin Compromiso' : 'Abonnement IPTV 1 Mois — Testez Sans Engagement'}
              </h1>
              <p className="text-lg md:text-xl text-cyan-700 dark:text-[var(--brand-from)] font-bold mb-16">
                {activeLocale === 'en' ? 'Instant access to over 45,000 HD and 4K channels, unlimited VOD movies and series.' : activeLocale === 'de' ? 'Sofortiger Zugang zu über 45.000 HD- und 4K-Sendern, unbegrenzte VOD-Filme und -Serien.' : activeLocale === 'es' ? 'Acceso instantáneo a más de 45.000 canales HD y 4K, películas y series en VOD ilimitado.' : 'Accès instantané à plus de 45 000 chaînes HD et 4K, films et séries en VOD illimitée.'}
              </p>
              <div className="flex items-center justify-center gap-12 mb-24">
                <div className="flex items-center gap-[2px]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-[14px] h-[14px] text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <span className="text-text-secondary text-sm font-medium">
                  4.95/5 — {plan.reviewCount.toLocaleString()} {reviewsLabel}
                </span>
              </div>
              <div className="flex items-center justify-center gap-16 mb-24">
                <span className="font-syne font-bold text-48 md:text-64 text-text-primary tracking-tight">
                  {plan.price}€
                </span>
              </div>
              <Link
                href={checkoutHref}
                className="inline-flex items-center gap-8 px-40 py-16 bg-gradient-to-r from-brand-from to-brand-to text-white font-bold text-lg rounded-xl hover:shadow-[0_0_25px_rgba(0,243,255,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              >
                {orderLabel}
              </Link>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="py-80 bg-bg-card border-b border-border/40">
          <div className="max-w-7xl mx-auto px-[24px] md:px-[40px]">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-syne font-bold text-24 md:text-32 text-text-primary mb-32 text-center tracking-tight">
                {includedTitle}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-12 p-16 bg-bg-base/40 rounded-xl border border-border/60">
                    <CheckCircle className="w-[20px] h-[20px] text-success flex-shrink-0" />
                    <span className="text-text-secondary text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bouquets Section */}
        <div className="py-80 bg-bg-base border-b border-border/40">
          <div className="max-w-7xl mx-auto px-[24px] md:px-[40px]">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-syne font-bold text-24 md:text-32 text-text-primary mb-12 text-center tracking-tight">
                {bouquetsTitle}
              </h2>
              <p className="text-text-secondary text-sm text-center mb-32 max-w-2xl mx-auto leading-relaxed">
                {activeLocale === 'en' ? "Over 45,000 channels organized by category, accessible from your first day of subscription." : activeLocale === 'de' ? 'Über 45.000 Sender nach Kategorien organisiert, ab dem ersten Tag zugänglich.' : activeLocale === 'es' ? 'Más de 45.000 canales organizados por categoría, accesibles desde el primer día.' : "Plus de 45 000 chaînes organisées par catégorie, accessibles dès votre premier jour d'abonnement."}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-24">
                {bouquets.map((bouquet, index) => (
                  <div key={index} className="p-24 rounded-2xl card-glass card-hover">
                    <div className="text-2xl mb-12">{bouquet.icon}</div>
                    <h3 className="font-bold text-text-primary text-base mb-8">{bouquet.title}</h3>
                    <p className="text-text-secondary text-xs leading-relaxed">{bouquet.channels}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Highlights */}
        <div className="py-80 bg-bg-card border-b border-border/40">
          <div className="max-w-7xl mx-auto px-[24px] md:px-[40px]">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-syne font-bold text-24 md:text-32 text-text-primary mb-32 text-center tracking-tight">
                {whyChooseTitle}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-24">
                {plan.highlights.map((highlight, index) => {
                  const IconComponent = highlightIcons[highlight.icon] || Zap;
                  const colorClasses = [
                    { bg: 'bg-brand-from/10', text: 'text-cyan-600 dark:text-brand-from' },
                    { bg: 'bg-brand-to/10', text: 'text-purple-600 dark:text-brand-to' },
                    { bg: 'bg-success/10', text: 'text-success' },
                  ];
                  const color = colorClasses[index % colorClasses.length];
                  return (
                    <div key={index} className="text-center">
                      <div className={`w-[48px] h-[48px] ${color.bg} rounded-2xl flex items-center justify-center mb-16 mx-auto shadow-sm`}>
                        <IconComponent className={`w-[24px] h-[24px] ${color.text}`} />
                      </div>
                      <h3 className="font-bold text-text-primary text-base mb-8">{highlight.title}</h3>
                      <p className="text-text-secondary text-xs leading-relaxed">{highlight.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods Section */}
        <div className="py-80 bg-bg-base border-b border-border/40">
          <div className="max-w-7xl mx-auto px-[24px] md:px-[40px]">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-syne font-bold text-24 md:text-32 text-text-primary mb-32 text-center tracking-tight">
                {paymentTitle}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-24 mb-48">
                <div className="p-24 rounded-2xl card-glass card-hover text-center flex flex-col justify-between">
                  <div>
                    <div className="w-[48px] h-[48px] bg-brand-from/10 rounded-xl flex items-center justify-center mb-16 mx-auto shadow-sm">
                      <CreditCard className="w-[24px] h-[24px] text-cyan-600 dark:text-brand-from" />
                    </div>
                    <h3 className="font-bold text-text-primary text-base mb-8">
                      {activeLocale === 'en' ? 'Credit Card' : activeLocale === 'de' ? 'Kreditkarte' : activeLocale === 'es' ? 'Tarjeta de Crédito' : 'Carte Bancaire'}
                    </h3>
                    <p className="text-text-secondary text-xs mb-16 leading-relaxed">
                      Visa, Mastercard, American Express.
                    </p>
                  </div>
                  <div className="flex justify-center gap-8">
                    <div className="px-8 py-4 bg-bg-elevated border border-border rounded text-[10px] text-text-secondary font-bold">VISA</div>
                    <div className="px-8 py-4 bg-bg-elevated border border-border rounded text-[10px] text-text-secondary font-bold">MC</div>
                    <div className="px-8 py-4 bg-bg-elevated border border-border rounded text-[10px] text-text-secondary font-bold">AMEX</div>
                  </div>
                </div>

                <div className="p-24 rounded-2xl card-glass card-hover text-center flex flex-col justify-between">
                  <div>
                    <div className="w-[48px] h-[48px] bg-brand-to/10 rounded-xl flex items-center justify-center mb-16 mx-auto shadow-sm">
                      <Smartphone className="w-[24px] h-[24px] text-purple-600 dark:text-brand-to" />
                    </div>
                    <h3 className="font-bold text-text-primary text-base mb-8">PayPal</h3>
                    <p className="text-text-secondary text-xs mb-16 leading-relaxed">
                      {activeLocale === 'en' ? 'Secure one-click payment.' : activeLocale === 'de' ? 'Sichere Ein-Klick-Zahlung.' : activeLocale === 'es' ? 'Pago seguro en un clic.' : 'Paiement sécurisé et rapide en un clic.'}
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <div className="px-12 py-4 bg-blue-500/10 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 rounded-lg text-xs font-bold border border-blue-500/20">
                      PayPal Express
                    </div>
                  </div>
                </div>

                <div className="p-24 rounded-2xl card-glass card-hover text-center flex flex-col justify-between">
                  <div>
                    <div className="w-[48px] h-[48px] bg-success/10 rounded-xl flex items-center justify-center mb-16 mx-auto shadow-sm">
                      <Shield className="w-[24px] h-[24px] text-success" />
                    </div>
                    <h3 className="font-bold text-text-primary text-base mb-8">
                      {activeLocale === 'en' ? 'Cryptocurrency' : activeLocale === 'de' ? 'Kryptowährung' : activeLocale === 'es' ? 'Criptomoneda' : 'Crypto-monnaies'}
                    </h3>
                    <p className="text-text-secondary text-xs mb-16 leading-relaxed">
                      Bitcoin, Ethereum, USDT. {activeLocale === 'en' ? '+5% discount.' : activeLocale === 'de' ? '+5% Rabatt.' : activeLocale === 'es' ? '+5% descuento.' : '5% de réduction.'}
                    </p>
                  </div>
                  <div className="flex justify-center gap-8">
                    <div className="px-8 py-4 bg-bg-elevated border border-border rounded text-[10px] text-text-secondary font-bold">BTC</div>
                    <div className="px-8 py-4 bg-bg-elevated border border-border rounded text-[10px] text-text-secondary font-bold">ETH</div>
                    <div className="px-8 py-4 bg-bg-elevated border border-border rounded text-[10px] text-text-secondary font-bold">USDT</div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <Link
                  href={checkoutHref}
                  className="inline-flex items-center gap-8 px-40 py-16 bg-gradient-to-r from-brand-from to-brand-to text-white font-bold text-lg rounded-xl hover:shadow-[0_0_25px_rgba(0,243,255,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                >
                  {orderLabel}
                </Link>
              </div>

              <div className="flex flex-wrap justify-center gap-16 mt-24">
                <div className="flex items-center gap-8 bg-bg-card px-12 py-4 rounded-lg border border-border/50 text-text-secondary text-xs font-semibold">
                  <Shield className="w-14 h-14 text-cyan-600 dark:text-brand-from" />
                  <span>{sslLabel}</span>
                </div>
                <div className="flex items-center gap-8 bg-bg-card px-12 py-4 rounded-lg border border-border/50 text-text-secondary text-xs font-semibold">
                  <Clock className="w-14 h-14 text-purple-600 dark:text-brand-to" />
                  <span>{activationLabel}</span>
                </div>
                <div className="flex items-center gap-8 bg-bg-card px-12 py-4 rounded-lg border border-border/50 text-text-secondary text-xs font-semibold">
                  <CheckCircle className="w-14 h-14 text-success" />
                  <span>{guaranteeLabel}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="py-80 bg-bg-card border-b border-border/40">
          <div className="max-w-7xl mx-auto px-[24px] md:px-[40px]">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-syne font-bold text-24 md:text-32 text-text-primary mb-32 text-center tracking-tight">
                {faqTitle}
              </h2>
              <FaqAccordion items={allFaq} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsappButton />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildProductSchema(plan)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
    </>
  );
}
