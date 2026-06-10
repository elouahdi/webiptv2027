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
    ? `${baseUrl}/pack-iptv-24-mois`
    : `${baseUrl}/${activeLocale}/pack-iptv-24-mois`;

  const titles: Record<string, string> = {
    fr: 'Abonnement IPTV 24 Mois | VIP Exclusif | RegardezIPTV',
    en: 'IPTV Subscription 24 Months | VIP Exclusive | RegardezIPTV',
    de: 'IPTV-Abonnement 24 Monate | VIP Exklusiv | RegardezIPTV',
    es: 'Suscripción IPTV 24 Meses | VIP Exclusivo | RegardezIPTV',
  };
  const descriptions: Record<string, string> = {
    fr: 'Abonnement IPTV 24 mois VIP exclusif à 89,99€. Ligne dédiée, support prioritaire, 6 mois offerts. 45 000 chaînes HD/4K. Économisez 79%.',
    en: 'Exclusive VIP 24-month IPTV subscription at €89.99. Dedicated line, priority support, 6 free months. 45,000 HD/4K channels. Save 79%.',
    de: 'Exklusives VIP 24-Monats-IPTV-Abonnement für 89,99€. Dedizierte Leitung, Prioritätssupport, 6 Monate gratis. 45.000 HD/4K-Sender. Sparen Sie 79%.',
    es: 'Suscripción IPTV VIP exclusiva de 24 meses a 89,99€. Línea dedicada, soporte prioritario, 6 meses gratis. 45.000 canales HD/4K. Ahorre 79%.',
  };

  return {
    title: titles[activeLocale] || titles.fr,
    description: descriptions[activeLocale] || descriptions.fr,
    alternates: {
      canonical,
      languages: {
        'x-default': `${baseUrl}/pack-iptv-24-mois`,
        'fr': `${baseUrl}/pack-iptv-24-mois`,
        'en': `${baseUrl}/en/pack-iptv-24-mois`,
        'de': `${baseUrl}/de/pack-iptv-24-mois`,
        'es': `${baseUrl}/es/pack-iptv-24-mois`,
      },
    },
  };
}

const bouquets = [
  {
    icon: '🏆',
    title: 'Sport VIP Complet',
    channels: 'BeIN Sports 1-3, RMC Sport 1-2, Canal+ Sport, Eurosport, DAZN, ESPN, BT Sport',
  },
  {
    icon: '⚽',
    title: 'Football Intégral',
    channels: 'Ligue 1, Premier League, Champions League, La Liga, Serie A, Bundesliga, Ligue des Nations',
  },
  {
    icon: '🎬',
    title: 'Cinéma & Séries',
    channels: 'Canal+, OCS, 20 000 films & séries en VOD, Ciné+, TCM, TF1 Séries Films',
  },
  {
    icon: '📺',
    title: 'Divertissement',
    channels: 'TF1, France 2/3/4/5, M6, TMC, W9, Arte, C8, NRJ12, Gulli, Chérie 25',
  },
  {
    icon: '🌍',
    title: 'International',
    channels: 'Chaînes arabes, turques, espagnoles, portugaises, anglaises, italiennes, africaines',
  },
  {
    icon: '🎵',
    title: 'Musique & Culture',
    channels: 'MTV, Trace Urban, Mezzo, MCM, Melody, RFM TV, BFM Business, LCI',
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
  Headphones,
};

export default async function PackIptv24MoisPage({ params }: PageProps) {
  const { locale } = await params;
  const activeLocale = locales.includes(locale as any) ? locale : 'fr';
  const { t } = getTranslations(activeLocale);

  const plan = getPlanBySlugSync('24-mois');
  if (!plan) notFound();

  const vipPerks = [
    {
      icon: '🖥️',
      title: activeLocale === 'en' ? 'Dedicated VIP Line' : activeLocale === 'de' ? 'Dedizierte VIP-Leitung' : activeLocale === 'es' ? 'Línea VIP Dedicada' : 'Ligne VIP Dédiée',
      description: activeLocale === 'en' ? 'Exclusive server reserved for long-term subscribers — guaranteed instant zapping.' : activeLocale === 'de' ? 'Exklusiver Server für Langzeitabonnenten — garantiertes sofortiges Umschalten.' : activeLocale === 'es' ? 'Servidor exclusivo reservado para suscriptores de larga duración — zapping instantáneo garantizado.' : "Serveur exclusif réservé aux abonnés longue durée — zapping instantané garanti.",
    },
    {
      icon: '🎁',
      title: activeLocale === 'en' ? '6 Free Months' : activeLocale === 'de' ? '6 Monate Gratis' : activeLocale === 'es' ? '6 Meses Gratis' : '6 Mois Offerts',
      description: activeLocale === 'en' ? "30 months for the price of 24 — you save the equivalent of 6 months' subscription." : activeLocale === 'de' ? "30 Monate zum Preis von 24 — Sie sparen das Äquivalent von 6 Monatsabonnements." : activeLocale === 'es' ? "30 meses al precio de 24 — ahorra el equivalente a 6 meses de suscripción." : "30 mois au prix de 24 — vous économisez l'équivalent de 6 mois d'abonnement.",
    },
    {
      icon: '📞',
      title: activeLocale === 'en' ? 'Support under 30 min' : activeLocale === 'de' ? 'Support unter 30 Min' : activeLocale === 'es' ? 'Soporte en menos de 30 min' : 'Support sous 30 min',
      description: activeLocale === 'en' ? 'Priority WhatsApp number with guaranteed response time under 30 minutes, 24/7.' : activeLocale === 'de' ? 'Prioritäts-WhatsApp-Nummer mit garantierter Antwortzeit unter 30 Minuten, 24/7.' : activeLocale === 'es' ? 'Número de WhatsApp prioritario con tiempo de respuesta garantizado en menos de 30 minutos, 24/7.' : 'Numéro WhatsApp prioritaire avec temps de réponse garanti sous 30 minutes, 24h/7j.',
    },
    {
      icon: '📶',
      title: activeLocale === 'en' ? 'Dedicated Bandwidth' : activeLocale === 'de' ? 'Dedizierte Bandbreite' : activeLocale === 'es' ? 'Ancho de Banda Dedicado' : 'Bande Passante Dédiée',
      description: activeLocale === 'en' ? 'Dedicated network infrastructure for 4K Ultra HD quality without buffering.' : activeLocale === 'de' ? 'Dedizierte Netzwerkinfrastruktur für 4K Ultra HD-Qualität ohne Pufferung.' : activeLocale === 'es' ? 'Infraestructura de red dedicada para calidad 4K Ultra HD sin almacenamiento en búfer.' : 'Infrastructure réseau dédiée pour une qualité 4K Ultra HD sans buffering.',
    },
  ];

  const extraFaq = [
    {
      question: activeLocale === 'en' ? 'How is the VIP line different?' : activeLocale === 'de' ? 'Wie unterscheidet sich die VIP-Leitung?' : activeLocale === 'es' ? '¿En qué se diferencia la línea VIP?' : 'En quoi la ligne VIP est-elle différente ?',
      answer: activeLocale === 'en' ? "24-month subscribers are hosted on a separate server with dedicated bandwidth, guaranteeing instant channel switching and 4K Ultra HD image quality even at peak hours." : activeLocale === 'de' ? "24-Monats-Abonnenten werden auf einem separaten Server mit dedizierter Bandbreite gehostet, was sofortiges Umschalten und 4K Ultra HD-Bildqualität auch zu Spitzenzeiten garantiert." : activeLocale === 'es' ? "Los suscriptores de 24 meses están alojados en un servidor separado con ancho de banda dedicado, garantizando el cambio instantáneo de canales y calidad de imagen 4K Ultra HD incluso en horas pico." : "Les abonnés 24 mois sont hébergés sur un serveur séparé avec bande passante dédiée, garantissant un zapping instantané et une qualité d'image 4K Ultra HD même aux heures de pointe.",
    },
    {
      question: activeLocale === 'en' ? 'How does dedicated support work?' : activeLocale === 'de' ? 'Wie funktioniert der dedizierte Support?' : activeLocale === 'es' ? '¿Cómo funciona el soporte dedicado?' : 'Comment fonctionne le support dédié ?',
      answer: activeLocale === 'en' ? "You receive a priority WhatsApp number with guaranteed response time under 30 minutes, 24/7. Your tickets are treated with absolute priority." : activeLocale === 'de' ? "Sie erhalten eine Prioritäts-WhatsApp-Nummer mit garantierter Antwortzeit unter 30 Minuten, 24/7. Ihre Tickets werden mit absoluter Priorität behandelt." : activeLocale === 'es' ? "Recibirá un número de WhatsApp prioritario con tiempo de respuesta garantizado en menos de 30 minutos, 24/7. Sus tickets se procesan con prioridad absoluta." : "Vous recevez un numéro WhatsApp prioritaire avec temps de réponse garanti sous 30 minutes, 24h/24 et 7j/7. Vos tickets sont traités en priorité absolue.",
    },
    {
      question: activeLocale === 'en' ? 'Are the 6 free months automatic?' : activeLocale === 'de' ? 'Sind die 6 Gratismonate automatisch?' : activeLocale === 'es' ? '¿Son automáticos los 6 meses gratuitos?' : 'Les 6 mois offerts sont-ils automatiques ?',
      answer: activeLocale === 'en' ? "Yes, your subscription is configured for 30 months from activation. No additional steps, the 6 bonus months are automatically included." : activeLocale === 'de' ? "Ja, Ihr Abonnement wird ab der Aktivierung für 30 Monate konfiguriert. Keine weiteren Schritte, die 6 Bonus-Monate sind automatisch enthalten." : activeLocale === 'es' ? "Sí, su suscripción se configura por 30 meses desde la activación. Sin pasos adicionales, los 6 meses de bonificación se incluyen automáticamente." : "Oui, votre abonnement est configuré pour 30 mois dès l'activation. Aucune démarche supplémentaire, les 6 mois bonus sont inclus automatiquement.",
    },
    {
      question: activeLocale === 'en' ? 'Can I pay in installments?' : activeLocale === 'de' ? 'Kann ich in Raten zahlen?' : activeLocale === 'es' ? '¿Puedo pagar a plazos?' : 'Puis-je payer en plusieurs fois ?',
      answer: activeLocale === 'en' ? "Yes, we offer payment in 2 or 3 installments at no extra charge for the 24-month subscription. Contact us on WhatsApp before ordering to benefit from this." : activeLocale === 'de' ? "Ja, wir bieten Zahlung in 2 oder 3 Raten ohne Aufpreis für das 24-Monats-Abonnement an. Kontaktieren Sie uns auf WhatsApp vor der Bestellung." : activeLocale === 'es' ? "Sí, ofrecemos pago en 2 o 3 cuotas sin cargo adicional para la suscripción de 24 meses. Contáctenos en WhatsApp antes de pedir." : "Oui, nous proposons le paiement en 2 ou 3 fois sans frais pour l'abonnement 24 mois. Contactez-nous sur WhatsApp avant de commander pour en bénéficier.",
    },
  ];

  const allFaq = [...plan.faq, ...extraFaq];

  const breadcrumbItems = [
    { label: t('plans.title'), href: getLocalizedPath('/nos-plans', activeLocale) },
    { label: activeLocale === 'en' ? 'IPTV Pack 24 Months' : activeLocale === 'de' ? 'IPTV-Paket 24 Monate' : activeLocale === 'es' ? 'Pack IPTV 24 Meses' : 'Pack IPTV 24 Mois', href: getLocalizedPath('/pack-iptv-24-mois', activeLocale) },
  ];

  const breadcrumbSchema = buildBreadcrumbSchema([
    { label: activeLocale === 'en' ? 'Home' : activeLocale === 'de' ? 'Startseite' : activeLocale === 'es' ? 'Inicio' : 'Accueil', url: activeLocale === 'fr' ? '/' : `/${activeLocale}` },
    { label: t('plans.title'), url: `${activeLocale === 'fr' ? '' : `/${activeLocale}`}/nos-plans` },
    { label: 'Pack IPTV 24 Mois', url: `${activeLocale === 'fr' ? '' : `/${activeLocale}`}/pack-iptv-24-mois` },
  ]);

  const checkoutHref = getLocalizedPath('/checkout?plan=24-mois', activeLocale);
  const orderLabel = activeLocale === 'en' ? 'Order Now — €89.99' : activeLocale === 'de' ? 'Jetzt bestellen — 89,99€' : activeLocale === 'es' ? 'Pedir ahora — 89,99€' : 'Commander maintenant — 89,99€';
  const whyChooseTitle = activeLocale === 'en' ? 'Why choose the 24 Month plan?' : activeLocale === 'de' ? 'Warum das 24-Monats-Paket wählen?' : activeLocale === 'es' ? '¿Por qué elegir el plan de 24 meses?' : "Pourquoi choisir l'abonnement 24 Mois ?";
  const includedTitle = activeLocale === 'en' ? 'What is included' : activeLocale === 'de' ? 'Was ist enthalten' : activeLocale === 'es' ? 'Qué incluye' : 'Ce qui est inclus';
  const bouquetsTitle = activeLocale === 'en' ? 'Included channel bouquets' : activeLocale === 'de' ? 'Enthaltene Senderpakete' : activeLocale === 'es' ? 'Bouquets de canales incluidos' : 'Bouquets de chaînes inclus';
  const paymentTitle = activeLocale === 'en' ? 'Secure Payment Methods' : activeLocale === 'de' ? 'Sichere Zahlungsmethoden' : activeLocale === 'es' ? 'Métodos de Pago Seguros' : 'Méthodes de paiement sécurisées';
  const faqTitle = activeLocale === 'en' ? 'Frequently Asked Questions — 24 Months' : activeLocale === 'de' ? 'Häufige Fragen — 24 Monate' : activeLocale === 'es' ? 'Preguntas Frecuentes — 24 Meses' : 'Questions fréquentes — Abonnement 24 Mois';
  const reviewsLabel = activeLocale === 'en' ? 'verified customer reviews' : activeLocale === 'de' ? 'verifizierte Kundenbewertungen' : activeLocale === 'es' ? 'opiniones verificadas' : 'avis clients vérifiés';
  const sslLabel = activeLocale === 'en' ? 'Secure SSL Payment' : activeLocale === 'de' ? 'Sichere SSL-Zahlung' : activeLocale === 'es' ? 'Pago seguro SSL' : 'Paiement sécurisé SSL';
  const activationLabel = activeLocale === 'en' ? 'Instant activation < 5 min' : activeLocale === 'de' ? 'Sofortige Aktivierung < 5 Min' : activeLocale === 'es' ? 'Activación instantánea < 5 min' : 'Activation instantanée < 5 min';
  const installmentLabel = activeLocale === 'en' ? 'Pay in 3 installments, no fees' : activeLocale === 'de' ? 'In 3 Raten ohne Gebühren zahlen' : activeLocale === 'es' ? 'Pago en 3 cuotas sin comisiones' : 'Paiement en 3 fois sans frais';
  const savingsLabel = activeLocale === 'en' ? `Save ${plan.savings}` : activeLocale === 'de' ? `Sparen Sie ${plan.savings}` : activeLocale === 'es' ? `Ahorre ${plan.savings}` : `Économisez ${plan.savings}`;
  const vipPerksTitle = activeLocale === 'en' ? 'Exclusive VIP benefits' : activeLocale === 'de' ? 'Exklusive VIP-Vorteile' : activeLocale === 'es' ? 'Beneficios VIP exclusivos' : 'Avantages VIP exclusifs';
  const vipPerksSubtitle = activeLocale === 'en' ? "The 24-month subscription gives you access to a premium experience that other plans can't offer." : activeLocale === 'de' ? "Das 24-Monats-Abonnement gibt Ihnen Zugang zu einem Premium-Erlebnis, das andere Pakete nicht bieten können." : activeLocale === 'es' ? "La suscripción de 24 meses le da acceso a una experiencia premium que otros planes no pueden ofrecer." : "L'abonnement 24 mois vous donne accès à une expérience premium que les autres formules ne peuvent pas offrir.";

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

        {/* Hero Section — VIP with Crown */}
        <div className="py-[64px] bg-gradient-to-br from-brand-from/[0.08] to-brand-to/[0.08] border-b border-border/40 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] pointer-events-none" />
          <div className="max-w-7xl mx-auto px-[24px] md:px-[40px]">
            <div className="max-w-4xl mx-auto text-center relative z-10">
              {/* Crown icon */}
              <div className="flex justify-center mb-16">
                <div className="w-[64px] h-[64px] bg-gradient-to-br from-brand-from/20 to-brand-to/20 rounded-2xl flex items-center justify-center border border-brand-from/20">
                  <Crown className="w-[32px] h-[32px] text-cyan-600 dark:text-brand-from" />
                </div>
              </div>
              <div className="inline-block px-16 py-8 bg-gradient-to-r from-brand-from to-brand-to text-white font-bold text-xs uppercase tracking-wider rounded-full mb-16 shadow-sm shadow-brand-from/15">
                {activeLocale === 'en' ? '👑 VIP Exclusive — 6 free months + Dedicated support' : activeLocale === 'de' ? '👑 VIP Exklusiv — 6 Monate gratis + Dedizierter Support' : activeLocale === 'es' ? '👑 VIP Exclusivo — 6 meses gratis + Soporte dedicado' : '👑 VIP Exclusif — 6 mois offerts + Support dédié'}
              </div>
              <h1 className="font-syne font-bold text-32 md:text-56 text-text-primary mb-16 tracking-tight">
                {activeLocale === 'en' ? 'IPTV Subscription 24 Months — Exclusive VIP Offer' : activeLocale === 'de' ? 'IPTV-Abonnement 24 Monate — Exklusives VIP-Angebot' : activeLocale === 'es' ? 'Suscripción IPTV 24 Meses — Oferta VIP Exclusiva' : 'Abonnement IPTV 24 Mois — Offre VIP Exclusive'}
              </h1>
              <p className="text-lg md:text-xl text-cyan-700 dark:text-[var(--brand-from)] font-bold mb-16">
                {activeLocale === 'en' ? '30 months at the price of 24 — Dedicated VIP line, guaranteed priority support, full access to all channels.' : activeLocale === 'de' ? '30 Monate zum Preis von 24 — Dedizierte VIP-Leitung, garantierter Prioritätssupport, vollständiger Zugang zu allen Sendern.' : activeLocale === 'es' ? '30 meses al precio de 24 — Línea VIP dedicada, soporte prioritario garantizado, acceso completo a todos los canales.' : '30 mois au prix de 24 — Ligne VIP dédiée, support prioritaire garanti, accès intégral à toutes les chaînes.'}
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
              <p className="mt-16 text-text-muted text-xs">
                💳 {installmentLabel}
              </p>
            </div>
          </div>
        </div>

        {/* VIP Perks Section */}
        <div className="py-80 bg-bg-card border-b border-border/40">
          <div className="max-w-7xl mx-auto px-[24px] md:px-[40px]">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-syne font-bold text-24 md:text-32 text-text-primary mb-12 text-center tracking-tight">
                {vipPerksTitle}
              </h2>
              <p className="text-text-secondary text-sm text-center mb-32 max-w-2xl mx-auto leading-relaxed">
                {vipPerksSubtitle}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
                {vipPerks.map((perk, index) => (
                  <div key={index} className="flex gap-16 p-24 rounded-2xl card-glass card-hover">
                    <div className="text-2xl flex-shrink-0">{perk.icon}</div>
                    <div>
                      <h3 className="font-bold text-text-primary text-base mb-8">{perk.title}</h3>
                      <p className="text-text-secondary text-xs leading-relaxed">{perk.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="py-80 bg-bg-base border-b border-border/40">
          <div className="max-w-7xl mx-auto px-[24px] md:px-[40px]">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-syne font-bold text-24 md:text-32 text-text-primary mb-32 text-center tracking-tight">
                {includedTitle}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-12 p-16 bg-bg-card/40 rounded-xl border border-border/60">
                    <CheckCircle className="w-[20px] h-[20px] text-success flex-shrink-0" />
                    <span className="text-text-secondary text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bouquets Section */}
        <div className="py-80 bg-bg-card border-b border-border/40">
          <div className="max-w-7xl mx-auto px-[24px] md:px-[40px]">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-syne font-bold text-24 md:text-32 text-text-primary mb-12 text-center tracking-tight">
                {bouquetsTitle}
              </h2>
              <p className="text-text-secondary text-sm text-center mb-32 max-w-2xl mx-auto leading-relaxed">
                {activeLocale === 'en' ? "Full access to our entire catalog — no additional bouquets required." : activeLocale === 'de' ? 'Vollständiger Zugang zu unserem gesamten Katalog — keine zusätzlichen Pakete erforderlich.' : activeLocale === 'es' ? 'Acceso completo a todo nuestro catálogo — no se requieren bouquets adicionales.' : "Accès intégral à l'ensemble de notre catalogue — aucun bouquet supplémentaire requis."}
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
        <div className="py-80 bg-bg-base border-b border-border/40">
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
        <div className="py-80 bg-bg-card border-b border-border/40">
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
                  <span>{installmentLabel}</span>
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
