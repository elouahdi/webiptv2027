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
  Gift,
  Crown,
  ShieldCheck,
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
    ? `${baseUrl}/pack-iptv-12-mois`
    : `${baseUrl}/${activeLocale}/pack-iptv-12-mois`;

  const titles: Record<string, string> = {
    fr: 'Abonnement IPTV 12 Mois | Meilleure Offre | RegardezIPTV',
    en: 'IPTV Subscription 12 Months | Best Offer | RegardezIPTV',
    de: 'IPTV-Abonnement 12 Monate | Bestes Angebot | RegardezIPTV',
    es: 'Suscripción IPTV 12 Meses | Mejor Oferta | RegardezIPTV',
  };
  const descriptions: Record<string, string> = {
    fr: 'Notre meilleure offre : abonnement IPTV 12 mois + 3 mois offerts à 46,99€. 45 000 chaînes HD/4K, accès VIP complet, garantie 7 jours. -78%.',
    en: 'Our best offer: 12-month IPTV subscription + 3 free months at €46.99. 45,000 HD/4K channels, full VIP access, 7-day guarantee. -78%.',
    de: 'Unser bestes Angebot: 12 Monate IPTV-Abonnement + 3 Monate gratis für 46,99€. 45.000 HD/4K-Sender, vollständiger VIP-Zugang, 7 Tage Garantie. -78%.',
    es: 'Nuestra mejor oferta: suscripción IPTV 12 meses + 3 meses gratis a 46,99€. 45.000 canales HD/4K, acceso VIP completo, garantía 7 días. -78%.',
  };

  return {
    title: titles[activeLocale] || titles.fr,
    description: descriptions[activeLocale] || descriptions.fr,
    alternates: {
      canonical,
      languages: {
        'x-default': `${baseUrl}/pack-iptv-12-mois`,
        'fr': `${baseUrl}/pack-iptv-12-mois`,
        'en': `${baseUrl}/en/pack-iptv-12-mois`,
        'de': `${baseUrl}/de/pack-iptv-12-mois`,
        'es': `${baseUrl}/es/pack-iptv-12-mois`,
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
    title: 'Football VIP',
    channels: 'Ligue 1, Premier League, Champions League, La Liga, Serie A, Bundesliga',
  },
  {
    icon: '🎬',
    title: 'Cinéma & Séries',
    channels: 'Canal+, OCS, 20 000 films & séries en VOD, exclusivités et premières',
  },
  {
    icon: '📺',
    title: 'Divertissement',
    channels: 'TF1, France 2/3/4/5, M6, TMC, W9, Arte, C8, NRJ12, Gulli',
  },
  {
    icon: '🌍',
    title: 'International',
    channels: 'Chaînes arabes, turques, espagnoles, portugaises, anglaises, italiennes',
  },
  {
    icon: '👶',
    title: 'Jeunesse',
    channels: 'Disney Channel, Cartoon Network, Nickelodeon, Gulli, TF1 Séries Films',
  },
];

const highlightIcons: Record<string, React.ElementType> = {
  Zap,
  Shield,
  Tv,
  Clock,
  Globe,
  Gift,
  Crown,
  ShieldCheck,
  Headphones,
};

export default async function PackIptv12MoisPage({ params }: PageProps) {
  const { locale } = await params;
  const activeLocale = locales.includes(locale as any) ? locale : 'fr';
  const { t } = getTranslations(activeLocale);

  const plan = getPlanBySlugSync('12-mois');
  if (!plan) notFound();

  const extraFaq = [
    {
      question: activeLocale === 'en' ? 'How do the 3 free months work?' : activeLocale === 'de' ? 'Wie funktionieren die 3 kostenlosen Monate?' : activeLocale === 'es' ? '¿Cómo funcionan los 3 meses gratuitos?' : 'Comment fonctionnent les 3 mois offerts ?',
      answer: activeLocale === 'en' ? "From activation, your subscription is configured for 15 months. The 3 bonus months are added automatically, no action required on your part." : activeLocale === 'de' ? "Ab der Aktivierung wird Ihr Abonnement für 15 Monate konfiguriert. Die 3 Bonus-Monate werden automatisch hinzugefügt, ohne weiteres Zutun." : activeLocale === 'es' ? "Desde la activación, su suscripción se configura por 15 meses. Los 3 meses de bonificación se añaden automáticamente, sin ninguna acción requerida." : "Dès l'activation, votre abonnement est configuré pour 15 mois. Les 3 mois bonus sont ajoutés automatiquement, aucune action requise de votre part.",
    },
    {
      question: activeLocale === 'en' ? 'Is the 7-day guarantee real?' : activeLocale === 'de' ? 'Ist die 7-Tage-Garantie echt?' : activeLocale === 'es' ? '¿La garantía de 7 días es real?' : 'La garantie 7 jours est-elle réelle ?',
      answer: activeLocale === 'en' ? "Yes, full refund guaranteed within the first 7 days if you are not satisfied, no questions asked. Contact us on WhatsApp and the refund is processed within 24h." : activeLocale === 'de' ? "Ja, vollständige Rückerstattung garantiert innerhalb der ersten 7 Tage, wenn Sie nicht zufrieden sind, keine Fragen gestellt." : activeLocale === 'es' ? "Sí, reembolso completo garantizado dentro de los primeros 7 días si no está satisfecho, sin preguntas." : "Oui, remboursement intégral garanti dans les 7 premiers jours si vous n'êtes pas satisfait, sans question posée. Contactez-nous sur WhatsApp et le remboursement est traité sous 24h.",
    },
    {
      question: activeLocale === 'en' ? 'Can I use it on Smart TV and phone?' : activeLocale === 'de' ? 'Kann ich es auf Smart TV und Telefon nutzen?' : activeLocale === 'es' ? '¿Puedo usarlo en Smart TV y teléfono?' : 'Puis-je utiliser sur Smart TV et téléphone ?',
      answer: activeLocale === 'en' ? "Yes, compatible with Samsung, LG, Android TV, Firestick, MAG Box, iOS, Android and PC/Mac. 1 simultaneous connection included, multi-screen available on request." : activeLocale === 'de' ? "Ja, kompatibel mit Samsung, LG, Android TV, Firestick, MAG Box, iOS, Android und PC/Mac. 1 gleichzeitige Verbindung inklusive." : activeLocale === 'es' ? "Sí, compatible con Samsung, LG, Android TV, Firestick, MAG Box, iOS, Android y PC/Mac. 1 conexión simultánea incluida." : "Oui, compatible Samsung, LG, Android TV, Firestick, MAG Box, iOS, Android et PC/Mac. 1 connexion simultanée incluse, multi-écrans disponible sur demande.",
    },
    {
      question: activeLocale === 'en' ? 'Which sports bouquets are included?' : activeLocale === 'de' ? 'Welche Sportpakete sind enthalten?' : activeLocale === 'es' ? '¿Qué paquetes de deporte están incluidos?' : 'Quels bouquets sport sont inclus ?',
      answer: activeLocale === 'en' ? "All: BeIN Sports 1-3, RMC Sport 1-2, Canal+ Sport, Eurosport, DAZN, ESPN. All Ligue 1, Premier League, Champions League matches." : activeLocale === 'de' ? "Alle: BeIN Sports 1-3, RMC Sport 1-2, Canal+ Sport, Eurosport, DAZN, ESPN. Alle Ligue 1, Premier League, Champions League Spiele." : activeLocale === 'es' ? "Todos: BeIN Sports 1-3, RMC Sport 1-2, Canal+ Sport, Eurosport, DAZN, ESPN. Todos los partidos de Ligue 1, Premier League, Champions League." : "Tous : BeIN Sports 1-3, RMC Sport 1-2, Canal+ Sport, Eurosport, DAZN, ESPN. Tous les matchs de Ligue 1, Premier League, Champions League sans exception.",
    },
  ];

  const allFaq = [...plan.faq, ...extraFaq];

  const breadcrumbItems = [
    { label: t('plans.title'), href: getLocalizedPath('/nos-plans', activeLocale) },
    { label: activeLocale === 'en' ? 'IPTV Pack 12 Months' : activeLocale === 'de' ? 'IPTV-Paket 12 Monate' : activeLocale === 'es' ? 'Pack IPTV 12 Meses' : 'Pack IPTV 12 Mois', href: getLocalizedPath('/pack-iptv-12-mois', activeLocale) },
  ];

  const breadcrumbSchema = buildBreadcrumbSchema([
    { label: activeLocale === 'en' ? 'Home' : activeLocale === 'de' ? 'Startseite' : activeLocale === 'es' ? 'Inicio' : 'Accueil', url: activeLocale === 'fr' ? '/' : `/${activeLocale}` },
    { label: t('plans.title'), url: `${activeLocale === 'fr' ? '' : `/${activeLocale}`}/nos-plans` },
    { label: 'Pack IPTV 12 Mois', url: `${activeLocale === 'fr' ? '' : `/${activeLocale}`}/pack-iptv-12-mois` },
  ]);

  const checkoutHref = getLocalizedPath('/checkout?plan=12-mois', activeLocale);
  const orderLabel = activeLocale === 'en' ? 'Order Now — €46.99' : activeLocale === 'de' ? 'Jetzt bestellen — 46,99€' : activeLocale === 'es' ? 'Pedir ahora — 46,99€' : 'Commander maintenant — 46,99€';
  const whyChooseTitle = activeLocale === 'en' ? 'Why choose the 12 Month plan?' : activeLocale === 'de' ? 'Warum das 12-Monats-Paket wählen?' : activeLocale === 'es' ? '¿Por qué elegir el plan de 12 meses?' : "Pourquoi choisir l'abonnement 12 Mois ?";
  const includedTitle = activeLocale === 'en' ? 'What is included' : activeLocale === 'de' ? 'Was ist enthalten' : activeLocale === 'es' ? 'Qué incluye' : 'Ce qui est inclus';
  const bouquetsTitle = activeLocale === 'en' ? 'Included channel bouquets' : activeLocale === 'de' ? 'Enthaltene Senderpakete' : activeLocale === 'es' ? 'Bouquets de canales incluidos' : 'Bouquets de chaînes inclus';
  const paymentTitle = activeLocale === 'en' ? 'Secure Payment Methods' : activeLocale === 'de' ? 'Sichere Zahlungsmethoden' : activeLocale === 'es' ? 'Métodos de Pago Seguros' : 'Méthodes de paiement sécurisées';
  const faqTitle = activeLocale === 'en' ? 'Frequently Asked Questions — 12 Months' : activeLocale === 'de' ? 'Häufige Fragen — 12 Monate' : activeLocale === 'es' ? 'Preguntas Frecuentes — 12 Meses' : 'Questions fréquentes — Abonnement 12 Mois';
  const reviewsLabel = activeLocale === 'en' ? 'verified customer reviews' : activeLocale === 'de' ? 'verifizierte Kundenbewertungen' : activeLocale === 'es' ? 'opiniones verificadas' : 'avis clients vérifiés';
  const sslLabel = activeLocale === 'en' ? 'Secure SSL Payment' : activeLocale === 'de' ? 'Sichere SSL-Zahlung' : activeLocale === 'es' ? 'Pago seguro SSL' : 'Paiement sécurisé SSL';
  const activationLabel = activeLocale === 'en' ? 'Instant activation < 5 min' : activeLocale === 'de' ? 'Sofortige Aktivierung < 5 Min' : activeLocale === 'es' ? 'Activación instantánea < 5 min' : 'Activation instantanée < 5 min';
  const guaranteeLabel = activeLocale === 'en' ? '7-day money-back guarantee' : activeLocale === 'de' ? '7 Tage Geld-zurück-Garantie' : activeLocale === 'es' ? 'Garantía de devolución 7 días' : 'Garantie 7 jours satisfait/remboursé';
  const savingsLabel = activeLocale === 'en' ? `Save ${plan.savings}` : activeLocale === 'de' ? `Sparen Sie ${plan.savings}` : activeLocale === 'es' ? `Ahorre ${plan.savings}` : `Économisez ${plan.savings}`;
  const freeMonthsLabel = activeLocale === 'en' ? '+ 3 free months' : activeLocale === 'de' ? '+ 3 Monate gratis' : activeLocale === 'es' ? '+ 3 meses gratis' : '+ 3 mois offerts';
  const clientChoiceLabel = activeLocale === 'en' ? `Choice of ${plan.reviewCount.toLocaleString()} customers` : activeLocale === 'de' ? `Wahl von ${plan.reviewCount.toLocaleString()} Kunden` : activeLocale === 'es' ? `Elección de ${plan.reviewCount.toLocaleString()} clientes` : `Choix de ${plan.reviewCount.toLocaleString()} clients`;

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

        {/* Hero Section — Featured with extra emphasis */}
        <div className="py-[64px] bg-gradient-to-br from-brand-from/[0.12] to-brand-to/[0.12] border-b border-brand-from/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-from/5 to-transparent pointer-events-none" />
          <div className="max-w-7xl mx-auto px-[24px] md:px-[40px]">
            <div className="max-w-4xl mx-auto text-center relative z-10">
              <div className="inline-block px-16 py-8 bg-gradient-to-r from-brand-from to-brand-to text-white font-bold text-xs uppercase tracking-wider rounded-full mb-16 shadow-sm shadow-brand-from/15">
                {activeLocale === 'en' ? '🏅 BEST OFFER — 3 months free + 7-day guarantee' : activeLocale === 'de' ? '🏅 BESTES ANGEBOT — 3 Monate gratis + 7-Tage-Garantie' : activeLocale === 'es' ? '🏅 MEJOR OFERTA — 3 meses gratis + Garantía 7 días' : '🏅 MEILLEURE OFFRE — 3 mois offerts + Garantie 7j'}
              </div>
              <h1 className="font-syne font-bold text-32 md:text-56 text-text-primary mb-8 tracking-tight">
                {activeLocale === 'en' ? 'IPTV Subscription 12 Months — Our Best Offer' : activeLocale === 'de' ? 'IPTV-Abonnement 12 Monate — Unser Bestes Angebot' : activeLocale === 'es' ? 'Suscripción IPTV 12 Meses — Nuestra Mejor Oferta' : 'Abonnement IPTV 12 Mois — Notre Meilleure Offre'}
              </h1>
              <p className="text-lg md:text-xl text-cyan-700 dark:text-[var(--brand-from)] font-bold mb-16">
                {freeMonthsLabel}
              </p>
              <p className="text-base text-text-secondary mb-16 max-w-2xl mx-auto leading-relaxed">
                {activeLocale === 'en' ? '15 months at the price of 12 — Full VIP access to 45,000 channels, 7-day money-back guarantee.' : activeLocale === 'de' ? '15 Monate zum Preis von 12 — Vollständiger VIP-Zugang zu 45.000 Sendern, 7-Tage-Geld-zurück-Garantie.' : activeLocale === 'es' ? '15 meses al precio de 12 — Acceso VIP completo a 45.000 canales, garantía de devolución 7 días.' : '15 mois au prix de 12 — Accès VIP complet à 45 000 chaînes, garantie satisfait ou remboursé 7 jours.'}
              </p>
              <div className="inline-flex items-center gap-8 bg-bg-card/80 border border-border/50 rounded-full px-16 py-8 mb-24">
                <CheckCircle className="w-4 h-4 text-success" />
                <span className="text-text-secondary text-xs font-semibold">{clientChoiceLabel}</span>
              </div>
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
              <p className="mt-16 text-text-muted text-xs">
                ✅ {guaranteeLabel} — {activeLocale === 'en' ? 'No questions asked' : activeLocale === 'de' ? 'Keine Fragen gestellt' : activeLocale === 'es' ? 'Sin preguntas' : 'Sans question posée'}
              </p>
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
                {activeLocale === 'en' ? "Full VIP access to all bouquets without extras — sports, cinema, international and more." : activeLocale === 'de' ? 'Vollständiger VIP-Zugang zu allen Paketen ohne Extras — Sport, Kino, International und mehr.' : activeLocale === 'es' ? 'Acceso VIP completo a todos los bouquets sin extras — deporte, cine, internacional y más.' : "Accès VIP complet à tous les bouquets sans supplément — sport, cinéma, international et plus encore."}
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
