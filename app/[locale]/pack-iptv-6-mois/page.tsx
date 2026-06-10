import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { WhatsappButton } from '@/components/ui/WhatsappButton';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { getPlanBySlugSync } from '@/lib/data/plans';
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
  Trophy,
  Gift,
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
    ? `${baseUrl}/pack-iptv-6-mois`
    : `${baseUrl}/${activeLocale}/pack-iptv-6-mois`;

  const titles: Record<string, string> = {
    fr: 'Abonnement IPTV 6 Mois | -66% | RegardezIPTV',
    en: 'IPTV Subscription 6 Months | -66% | RegardezIPTV',
    de: 'IPTV-Abonnement 6 Monate | -66% | RegardezIPTV',
    es: 'Suscripción IPTV 6 Meses | -66% | RegardezIPTV',
  };
  const descriptions: Record<string, string> = {
    fr: 'Abonnement IPTV 6 mois à 36,99€ au lieu de 107,94€. 45 000 chaînes HD/4K, serveurs premium, saison complète de sport. Économisez 66%.',
    en: '6-month IPTV subscription at €36.99 instead of €107.94. 45,000 HD/4K channels, premium servers, full sports season. Save 66%.',
    de: '6-monatiges IPTV-Abonnement für 36,99€ statt 107,94€. 45.000 HD/4K-Sender, Premium-Server, vollständige Sportsaison. Sparen Sie 66%.',
    es: 'Suscripción IPTV 6 meses a 36,99€ en lugar de 107,94€. 45.000 canales HD/4K, servidores premium, temporada completa de deporte. Ahorre 66%.',
  };

  return {
    title: titles[activeLocale] || titles.fr,
    description: descriptions[activeLocale] || descriptions.fr,
    alternates: {
      canonical,
      languages: {
        'x-default': `${baseUrl}/pack-iptv-6-mois`,
        'fr': `${baseUrl}/pack-iptv-6-mois`,
        'en': `${baseUrl}/en/pack-iptv-6-mois`,
        'de': `${baseUrl}/de/pack-iptv-6-mois`,
        'es': `${baseUrl}/es/pack-iptv-6-mois`,
      },
    },
  };
}

const bouquets = [
  {
    icon: '🏆',
    title: 'Sport Premium',
    channels: 'BeIN Sports 1-3, RMC Sport 1-2, Canal+ Sport, Eurosport, DAZN, ESPN',
  },
  {
    icon: '⚽',
    title: 'Football Complet',
    channels: 'Ligue 1, Premier League, Champions League, La Liga, Serie A, Bundesliga',
  },
  {
    icon: '🎬',
    title: 'Cinéma & Séries',
    channels: 'Canal+, OCS, 20 000 films & séries en VOD, nouvelles sorties chaque semaine',
  },
  {
    icon: '📺',
    title: 'Divertissement',
    channels: 'TF1, France 2/3/4/5, M6, TMC, W9, Arte, C8, NRJ12',
  },
  {
    icon: '🌍',
    title: 'International',
    channels: 'Chaînes arabes, turques, espagnoles, portugaises, anglaises, italiennes',
  },
  {
    icon: '🎵',
    title: 'Musique & Culture',
    channels: 'MTV, Trace Urban, Mezzo, MCM, Melody, RFM TV, BFM TV',
  },
];

const highlightIcons: Record<string, React.ElementType> = {
  Zap,
  Shield,
  Tv,
  Clock,
  Globe,
  Film,
  Trophy,
  Gift,
  Headphones,
};

export default async function PackIptv6MoisPage({ params }: PageProps) {
  const { locale } = await params;
  const activeLocale = locales.includes(locale as any) ? locale : 'fr';
  const { t } = getTranslations(activeLocale);

  const plan = getPlanBySlugSync('6-mois');
  if (!plan) notFound();

  const extraFaq = [
    {
      question: activeLocale === 'en' ? 'What are premium servers?' : activeLocale === 'de' ? 'Was sind Premium-Server?' : activeLocale === 'es' ? '¿Qué son los servidores premium?' : "Qu'est-ce que les serveurs premium ?",
      answer: activeLocale === 'en' ? "6-month subscribers get access to our dedicated high-performance servers with less load, guaranteeing instant channel switching and optimal image quality." : activeLocale === 'de' ? "6-Monats-Abonnenten erhalten Zugang zu unseren dedizierten Hochleistungsservern mit weniger Last, was sofortiges Umschalten und optimale Bildqualität garantiert." : activeLocale === 'es' ? "Los suscriptores de 6 meses acceden a nuestros servidores dedicados de alto rendimiento con menos carga, garantizando un cambio de canal instantáneo y calidad de imagen óptima." : "Les abonnés 6 mois accèdent à nos serveurs haute performance dédiés avec moins de charge, garantissant un zapping instantané et une qualité d'image optimale même aux heures de pointe.",
    },
    {
      question: activeLocale === 'en' ? 'Are 6 months enough for a football season?' : activeLocale === 'de' ? 'Reichen 6 Monate für eine Fußballsaison?' : activeLocale === 'es' ? '¿6 meses son suficientes para una temporada de fútbol?' : '6 mois suffisent-ils pour une saison de foot ?',
      answer: activeLocale === 'en' ? "Yes, 6 months perfectly cover half a season or a complete phase of Champions League/Europa League, as well as all the final phases of major competitions." : activeLocale === 'de' ? "Ja, 6 Monate decken perfekt eine halbe Saison oder eine vollständige Phase der Champions League/Europa League ab." : activeLocale === 'es' ? "Sí, 6 meses cubren perfectamente media temporada o una fase completa de la Champions League/Europa League." : "Oui, 6 mois couvrent parfaitement une demi-saison ou une phase complète de Champions League/Europa League, ainsi que toute la phase finale des grandes compétitions.",
    },
    {
      question: activeLocale === 'en' ? 'Can I upgrade to 12 months mid-subscription?' : activeLocale === 'de' ? 'Kann ich auf 12 Monate upgraden?' : activeLocale === 'es' ? '¿Puedo actualizar a 12 meses durante la suscripción?' : "Puis-je upgrader vers 12 mois en cours d'abonnement ?",
      answer: activeLocale === 'en' ? "Yes, contact our WhatsApp support. The price difference will be calculated pro-rata for your remaining subscription." : activeLocale === 'de' ? "Ja, kontaktieren Sie unseren WhatsApp-Support. Die Preisdifferenz wird anteilig für Ihr verbleibendes Abonnement berechnet." : activeLocale === 'es' ? "Sí, contacte a nuestro soporte de WhatsApp. La diferencia de precio se calculará prorrateada según su suscripción restante." : "Oui, contactez notre support WhatsApp. La différence de prix sera calculée au prorata de votre abonnement restant, sans perte de temps d'accès.",
    },
  ];

  const allFaq = [...plan.faq, ...extraFaq];

  const breadcrumbItems = [
    { label: t('plans.title'), href: getLocalizedPath('/nos-plans', activeLocale) },
    { label: activeLocale === 'en' ? 'IPTV Pack 6 Months' : activeLocale === 'de' ? 'IPTV-Paket 6 Monate' : activeLocale === 'es' ? 'Pack IPTV 6 Meses' : 'Pack IPTV 6 Mois', href: getLocalizedPath('/pack-iptv-6-mois', activeLocale) },
  ];

  const breadcrumbSchema = buildBreadcrumbSchema([
    { label: activeLocale === 'en' ? 'Home' : activeLocale === 'de' ? 'Startseite' : activeLocale === 'es' ? 'Inicio' : 'Accueil', url: activeLocale === 'fr' ? '/' : `/${activeLocale}` },
    { label: t('plans.title'), url: `${activeLocale === 'fr' ? '' : `/${activeLocale}`}/nos-plans` },
    { label: 'Pack IPTV 6 Mois', url: `${activeLocale === 'fr' ? '' : `/${activeLocale}`}/pack-iptv-6-mois` },
  ]);

  const checkoutHref = getLocalizedPath('/checkout?plan=6-mois', activeLocale);
  const orderLabel = activeLocale === 'en' ? 'Order Now — €36.99' : activeLocale === 'de' ? 'Jetzt bestellen — 36,99€' : activeLocale === 'es' ? 'Pedir ahora — 36,99€' : 'Commander maintenant — 36,99€';
  const whyChooseTitle = activeLocale === 'en' ? 'Why choose the 6 Month plan?' : activeLocale === 'de' ? 'Warum das 6-Monats-Paket wählen?' : activeLocale === 'es' ? '¿Por qué elegir el plan de 6 meses?' : "Pourquoi choisir l'abonnement 6 Mois ?";
  const includedTitle = activeLocale === 'en' ? 'What is included' : activeLocale === 'de' ? 'Was ist enthalten' : activeLocale === 'es' ? 'Qué incluye' : 'Ce qui est inclus';
  const bouquetsTitle = activeLocale === 'en' ? 'Included channel bouquets' : activeLocale === 'de' ? 'Enthaltene Senderpakete' : activeLocale === 'es' ? 'Bouquets de canales incluidos' : 'Bouquets de chaînes inclus';
  const paymentTitle = activeLocale === 'en' ? 'Secure Payment Methods' : activeLocale === 'de' ? 'Sichere Zahlungsmethoden' : activeLocale === 'es' ? 'Métodos de Pago Seguros' : 'Méthodes de paiement sécurisées';
  const faqTitle = activeLocale === 'en' ? 'Frequently Asked Questions — 6 Months' : activeLocale === 'de' ? 'Häufige Fragen — 6 Monate' : activeLocale === 'es' ? 'Preguntas Frecuentes — 6 Meses' : 'Questions fréquentes — Abonnement 6 Mois';
  const reviewsLabel = activeLocale === 'en' ? 'verified customer reviews' : activeLocale === 'de' ? 'verifizierte Kundenbewertungen' : activeLocale === 'es' ? 'opiniones verificadas' : 'avis clients vérifiés';
  const sslLabel = activeLocale === 'en' ? 'Secure SSL Payment' : activeLocale === 'de' ? 'Sichere SSL-Zahlung' : activeLocale === 'es' ? 'Pago seguro SSL' : 'Paiement sécurisé SSL';
  const activationLabel = activeLocale === 'en' ? 'Instant activation < 5 min' : activeLocale === 'de' ? 'Sofortige Aktivierung < 5 Min' : activeLocale === 'es' ? 'Activación instantánea < 5 min' : 'Activation instantanée < 5 min';
  const guaranteeLabel = activeLocale === 'en' ? '7-day money-back guarantee' : activeLocale === 'de' ? '7 Tage Geld-zurück-Garantie' : activeLocale === 'es' ? 'Garantía de devolución 7 días' : 'Garantie 7 jours satisfait/remboursé';
  const savingsLabel = activeLocale === 'en' ? `Save ${plan.savings}` : activeLocale === 'de' ? `Sparen Sie ${plan.savings}` : activeLocale === 'es' ? `Ahorre ${plan.savings}` : `Économisez ${plan.savings}`;

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
                {activeLocale === 'en' ? '🏆 Premium Servers — Ultra-Fast Zapping' : activeLocale === 'de' ? '🏆 Premium-Server — Ultraschnelles Umschalten' : activeLocale === 'es' ? '🏆 Servidores Premium — Zapping Ultrarrápido' : '🏆 Serveurs Premium — Zapping Ultra-Rapide'}
              </div>
              <h1 className="font-syne font-bold text-32 md:text-56 text-text-primary mb-16 tracking-tight">
                {activeLocale === 'en' ? 'IPTV Subscription 6 Months — Full Season' : activeLocale === 'de' ? 'IPTV-Abonnement 6 Monate — Vollständige Saison' : activeLocale === 'es' ? 'Suscripción IPTV 6 Meses — Temporada Completa' : 'Abonnement IPTV 6 Mois — Saison Complète'}
              </h1>
              <p className="text-lg md:text-xl text-cyan-700 dark:text-[var(--brand-from)] font-bold mb-16">
                {activeLocale === 'en' ? 'Cover a full season of sports, series and films with our premium servers. Save 66%.' : activeLocale === 'de' ? 'Decken Sie eine vollständige Saison Sport, Serien und Filme mit unseren Premium-Servern ab. Sparen Sie 66%.' : activeLocale === 'es' ? 'Cubra toda una temporada de deporte, series y películas con nuestros servidores premium. Ahorre 66%.' : 'Couvrez toute une saison de sport, séries et films avec nos serveurs premium. Économisez 66%.'}
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
                {plan.originalPrice && (
                  <span className="text-text-muted text-2xl line-through font-medium">
                    {plan.originalPrice}€
                  </span>
                )}
                <span className="font-syne font-bold text-48 md:text-64 text-text-primary tracking-tight">
                  {plan.price}€
                </span>
                {plan.savings && (
                  <div className="px-16 py-8 bg-green-500/10 dark:bg-green-500/20 text-green-700 dark:text-green-400 font-bold text-xs rounded-lg border border-green-500/20">
                    {savingsLabel}
                  </div>
                )}
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
                {activeLocale === 'en' ? "Premium sport, cinema, entertainment — 6 months full access for a complete season." : activeLocale === 'de' ? 'Sport, Kino, Entertainment — 6 Monate Vollzugang für eine komplette Saison.' : activeLocale === 'es' ? 'Deporte premium, cine, entretenimiento — 6 meses de acceso completo para toda una temporada.' : "Sport premium, cinéma, divertissement — 6 mois d'accès complet pour toute une saison."}
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
                    <p className="text-text-secondary text-xs mb-16 leading-relaxed">Visa, Mastercard, American Express.</p>
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
                    <p className="text-text-secondary text-xs mb-16 leading-relaxed">Bitcoin, Ethereum, USDT.</p>
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
