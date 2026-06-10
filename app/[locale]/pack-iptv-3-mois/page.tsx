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
  Users,
  Headphones,
  TrendingDown,
  Repeat,
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
    ? `${baseUrl}/pack-iptv-3-mois`
    : `${baseUrl}/${activeLocale}/pack-iptv-3-mois`;

  const titles: Record<string, string> = {
    fr: 'Abonnement IPTV 3 Mois | -50% | RegardezIPTV',
    en: 'IPTV Subscription 3 Months | -50% | RegardezIPTV',
    de: 'IPTV-Abonnement 3 Monate | -50% | RegardezIPTV',
    es: 'Suscripción IPTV 3 Meses | -50% | RegardezIPTV',
  };
  const descriptions: Record<string, string> = {
    fr: 'Abonnement IPTV 3 mois à seulement 26,99€ au lieu de 53,97€. 45 000 chaînes HD/4K, VOD illimitée, support prioritaire. Économisez 50%.',
    en: '3-month IPTV subscription at only €26.99 instead of €53.97. 45,000 HD/4K channels, unlimited VOD, priority support. Save 50%.',
    de: '3-monatiges IPTV-Abonnement für nur 26,99€ statt 53,97€. 45.000 HD/4K-Sender, unbegrenzte VOD, Prioritätssupport. Sparen Sie 50%.',
    es: 'Suscripción IPTV 3 meses a solo 26,99€ en lugar de 53,97€. 45.000 canales HD/4K, VOD ilimitado, soporte prioritario. Ahorre 50%.',
  };

  return {
    title: titles[activeLocale] || titles.fr,
    description: descriptions[activeLocale] || descriptions.fr,
    alternates: {
      canonical,
      languages: {
        'x-default': `${baseUrl}/pack-iptv-3-mois`,
        'fr': `${baseUrl}/pack-iptv-3-mois`,
        'en': `${baseUrl}/en/pack-iptv-3-mois`,
        'de': `${baseUrl}/de/pack-iptv-3-mois`,
        'es': `${baseUrl}/es/pack-iptv-3-mois`,
      },
    },
  };
}

const bouquets = [
  {
    icon: '🏆',
    title: 'Sport Premium',
    channels: 'BeIN Sports 1-3, RMC Sport, Canal+ Sport, Eurosport, DAZN',
  },
  {
    icon: '🎬',
    title: 'Cinéma & Séries',
    channels: 'Canal+, OCS, 20 000 films & séries en VOD, nouvelles sorties',
  },
  {
    icon: '📺',
    title: 'Divertissement',
    channels: 'TF1, France 2/3/4/5, M6, TMC, W9, Arte, C8',
  },
  {
    icon: '🌍',
    title: 'International',
    channels: 'Chaînes arabes, turques, espagnoles, portugaises, anglaises',
  },
  {
    icon: '👶',
    title: 'Jeunesse',
    channels: 'Disney Channel, Cartoon Network, Nickelodeon, Gulli, TF1 Séries',
  },
  {
    icon: '🎵',
    title: 'Musique & Culture',
    channels: 'MTV, Trace Urban, Mezzo, MCM, Melody, RFM TV',
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
  TrendingDown,
  Repeat,
  Star,
};

export default async function PackIptv3MoisPage({ params }: PageProps) {
  const { locale } = await params;
  const activeLocale = locales.includes(locale as any) ? locale : 'fr';
  const { t } = getTranslations(activeLocale);

  const plan = getPlanBySlugSync('3-mois');
  if (!plan) notFound();

  const extraFaq = [
    {
      question: activeLocale === 'en' ? 'Why choose 3 months instead of 1 month?' : activeLocale === 'de' ? 'Warum 3 Monate statt 1 Monat wählen?' : activeLocale === 'es' ? '¿Por qué elegir 3 meses en lugar de 1 mes?' : 'Pourquoi choisir 3 mois au lieu de 1 mois ?',
      answer: activeLocale === 'en' ? "The 3-month subscription saves you 50% compared to 3 separate monthly subscriptions. Ideal for following a full season of football or series." : activeLocale === 'de' ? "Das 3-Monats-Abonnement spart Ihnen 50% gegenüber 3 separaten Monatsabonnements. Ideal für eine vollständige Fußballsaison." : activeLocale === 'es' ? "La suscripción de 3 meses le ahorra un 50% en comparación con 3 suscripciones mensuales separadas." : "L'abonnement 3 mois vous fait économiser 50% par rapport à 3 abonnements mensuels séparés. Idéal pour suivre une saison complète de football ou de séries sans interruption.",
    },
    {
      question: activeLocale === 'en' ? 'Is priority support really different?' : activeLocale === 'de' ? 'Ist der Prioritätssupport wirklich anders?' : activeLocale === 'es' ? '¿El soporte prioritario es realmente diferente?' : 'Le support prioritaire est-il vraiment différent ?',
      answer: activeLocale === 'en' ? "Yes, 3-month subscribers get a guaranteed response time of 2 hours on WhatsApp, compared to 6 hours for monthly subscriptions." : activeLocale === 'de' ? "Ja, 3-Monats-Abonnenten erhalten eine garantierte Antwortzeit von 2 Stunden auf WhatsApp." : activeLocale === 'es' ? "Sí, los suscriptores de 3 meses tienen un tiempo de respuesta garantizado de 2 horas en WhatsApp." : "Oui, les abonnés 3 mois bénéficient d'un temps de réponse garanti sous 2 heures sur WhatsApp, contre 6 heures pour les abonnements mensuels.",
    },
    {
      question: activeLocale === 'en' ? 'Can I share my subscription?' : activeLocale === 'de' ? 'Kann ich mein Abonnement teilen?' : activeLocale === 'es' ? '¿Puedo compartir mi suscripción?' : 'Puis-je partager mon abonnement ?',
      answer: activeLocale === 'en' ? "The subscription includes 1 simultaneous connection by default. For multi-screen connections, contact our WhatsApp support." : activeLocale === 'de' ? "Das Abonnement umfasst standardmäßig 1 gleichzeitige Verbindung. Für Multi-Screen-Verbindungen wenden Sie sich an unseren Support." : activeLocale === 'es' ? "La suscripción incluye 1 conexión simultánea por defecto. Para conexiones multi-pantalla, contacte a nuestro soporte." : "L'abonnement inclut 1 connexion simultanée par défaut. Pour des connexions multi-écrans, contactez notre support WhatsApp.",
    },
  ];

  const allFaq = [...plan.faq, ...extraFaq];

  const breadcrumbItems = [
    { label: t('plans.title'), href: getLocalizedPath('/nos-plans', activeLocale) },
    { label: activeLocale === 'en' ? 'IPTV Pack 3 Months' : activeLocale === 'de' ? 'IPTV-Paket 3 Monate' : activeLocale === 'es' ? 'Pack IPTV 3 Meses' : 'Pack IPTV 3 Mois', href: getLocalizedPath('/pack-iptv-3-mois', activeLocale) },
  ];

  const breadcrumbSchema = buildBreadcrumbSchema([
    { label: activeLocale === 'en' ? 'Home' : activeLocale === 'de' ? 'Startseite' : activeLocale === 'es' ? 'Inicio' : 'Accueil', url: activeLocale === 'fr' ? '/' : `/${activeLocale}` },
    { label: t('plans.title'), url: `${activeLocale === 'fr' ? '' : `/${activeLocale}`}/nos-plans` },
    { label: 'Pack IPTV 3 Mois', url: `${activeLocale === 'fr' ? '' : `/${activeLocale}`}/pack-iptv-3-mois` },
  ]);

  const checkoutHref = getLocalizedPath('/checkout?plan=3-mois', activeLocale);
  const orderLabel = activeLocale === 'en' ? 'Order Now — €26.99' : activeLocale === 'de' ? 'Jetzt bestellen — 26,99€' : activeLocale === 'es' ? 'Pedir ahora — 26,99€' : 'Commander maintenant — 26,99€';
  const whyChooseTitle = activeLocale === 'en' ? 'Why choose the 3 Month plan?' : activeLocale === 'de' ? 'Warum das 3-Monats-Paket wählen?' : activeLocale === 'es' ? '¿Por qué elegir el plan de 3 meses?' : "Pourquoi choisir l'abonnement 3 Mois ?";
  const includedTitle = activeLocale === 'en' ? 'What is included' : activeLocale === 'de' ? 'Was ist enthalten' : activeLocale === 'es' ? 'Qué incluye' : 'Ce qui est inclus';
  const bouquetsTitle = activeLocale === 'en' ? 'Included channel bouquets' : activeLocale === 'de' ? 'Enthaltene Senderpakete' : activeLocale === 'es' ? 'Bouquets de canales incluidos' : 'Bouquets de chaînes inclus';
  const paymentTitle = activeLocale === 'en' ? 'Secure Payment Methods' : activeLocale === 'de' ? 'Sichere Zahlungsmethoden' : activeLocale === 'es' ? 'Métodos de Pago Seguros' : 'Méthodes de paiement sécurisées';
  const faqTitle = activeLocale === 'en' ? 'Frequently Asked Questions — 3 Months' : activeLocale === 'de' ? 'Häufige Fragen — 3 Monate' : activeLocale === 'es' ? 'Preguntas Frecuentes — 3 Meses' : 'Questions fréquentes — Abonnement 3 Mois';
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
                {activeLocale === 'en' ? '⭐ Most Popular — Save 50%' : activeLocale === 'de' ? '⭐ Am beliebtesten — Sparen Sie 50%' : activeLocale === 'es' ? '⭐ El más popular — Ahorre 50%' : '⭐ Le plus populaire — Économisez 50%'}
              </div>
              <div className="inline-block px-16 py-8 bg-green-500/10 dark:bg-green-500/20 text-green-700 dark:text-green-400 font-bold text-xs rounded-full mb-16 ml-8 border border-green-500/20">
                {t('plans.3-mois.badge') || 'Populaire'}
              </div>
              <h1 className="font-syne font-bold text-32 md:text-56 text-text-primary mb-16 tracking-tight">
                {activeLocale === 'en' ? 'IPTV Subscription 3 Months — The Most Popular' : activeLocale === 'de' ? 'IPTV-Abonnement 3 Monate — Am beliebtesten' : activeLocale === 'es' ? 'Suscripción IPTV 3 Meses — El Más Popular' : 'Abonnement IPTV 3 Mois — Le Plus Populaire'}
              </h1>
              <p className="text-lg md:text-xl text-cyan-700 dark:text-[var(--brand-from)] font-bold mb-16">
                {activeLocale === 'en' ? '3 months premium access to 45,000 HD/4K channels with priority support. Save 50%.' : activeLocale === 'de' ? '3 Monate Premium-Zugang zu 45.000 HD/4K-Sendern mit Prioritätssupport. Sparen Sie 50%.' : activeLocale === 'es' ? '3 meses de acceso premium a 45.000 canales HD/4K con soporte prioritario. Ahorre 50%.' : "3 mois d'accès premium à 45 000 chaînes HD/4K avec support prioritaire. Économisez 50%."}
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
                {activeLocale === 'en' ? "Over 45,000 channels, 3 months of uninterrupted access for a full season." : activeLocale === 'de' ? '45.000+ Sender, 3 Monate ununterbrochenen Zugang für eine vollständige Saison.' : activeLocale === 'es' ? 'Más de 45.000 canales, 3 meses de acceso ininterrumpido para toda una temporada.' : "Plus de 45 000 chaînes organisées par catégorie, 3 mois d'accès ininterrompu pour toute une saison."}
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
