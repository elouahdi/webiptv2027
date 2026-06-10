import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { WhatsappButton } from '@/components/ui/WhatsappButton';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { getPlanBySlugSync, getAllPlansSync } from '@/lib/data/plans';
import { buildProductSchema } from '@/lib/seo/schemas';
import { notFound } from 'next/navigation';
import { CreditCard, Smartphone, Shield, Clock, CheckCircle, Star } from 'lucide-react';
import Link from 'next/link';
import { getTranslations, locales, getLocalizedPath } from '@/lib/i18n';
import { SITE_CONFIG } from '@/config/site';

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  return getAllPlansSync().flatMap((plan) => 
    locales.map((locale) => ({
      locale,
      slug: plan.slug,
    }))
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { locale, slug } = await params;
  const activeLocale = locales.includes(locale as any) ? locale : 'fr';
  const { t } = getTranslations(activeLocale);
  const plan = getPlanBySlugSync(slug);
  
  if (!plan) return {};

  const baseUrl = SITE_CONFIG.url;
  const canonical = activeLocale === 'fr'
    ? `${baseUrl}/nos-plans/${plan.slug}`
    : `${baseUrl}/${activeLocale}/nos-plans/${plan.slug}`;

  return {
    title: `${t('plans.title')} - ${t(`plans.${plan.slug}.name`)} | RegardezIPTV`,
    description: t(`plans.${plan.slug}.description`),
    alternates: {
      canonical,
      languages: {
        'x-default': `${baseUrl}/nos-plans/${plan.slug}`,
        'fr': `${baseUrl}/nos-plans/${plan.slug}`,
        'en': `${baseUrl}/en/nos-plans/${plan.slug}`,
        'de': `${baseUrl}/de/nos-plans/${plan.slug}`,
        'es': `${baseUrl}/es/nos-plans/${plan.slug}`,
      },
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const activeLocale = locales.includes(locale as any) ? locale : 'fr';
  const { t } = getTranslations(activeLocale);

  const plan = getPlanBySlugSync(slug);
  if (!plan) notFound();

  const getTranslatedFeature = (feature: string) => {
    const lower = feature.toLowerCase();
    if (lower.includes('activation')) return t('plans.features_list.activation');
    if (lower.includes('chaînes') || lower.includes('channels') || lower.includes('kanäle') || lower.includes('canales')) return t('plans.features_list.channels');
    if (lower.includes('qualité') || lower.includes('quality') || lower.includes('qualität') || lower.includes('calidad')) return t('plans.features_list.quality');
    if (lower.includes('mises à jour') || lower.includes('updates') || lower.includes('aktualisierungen') || lower.includes('actualizaciones')) return t('plans.features_list.updates');
    if (lower.includes('rattrapage') || lower.includes('replay') || lower.includes('catch-up') || lower.includes('diferido')) return t('plans.features_list.replay');
    if (lower.includes('support') || lower.includes('soporte')) return t('plans.features_list.support');
    if (lower.includes('supplémentaires') || lower.includes('extra') || lower.includes('adicionales')) return t('plans.features_list.extra_months');
    if (lower.includes('heures') || lower.includes('hours') || lower.includes('stunden') || lower.includes('horas')) return t('plans.features_list.trial_hours');
    if (lower.includes('carte') || lower.includes('card') || lower.includes('kreditkarte') || lower.includes('tarjeta')) return t('plans.features_list.no_card');
    return feature;
  };

  const getTranslatedPlan = (plan: any) => {
    return {
      ...plan,
      name: t(`plans.${plan.slug}.name`),
      description: t(`plans.${plan.slug}.description`),
      badge: t(`plans.${plan.slug}.badge`) || null,
      features: plan.features.map(getTranslatedFeature),
    };
  };

  const translatedPlan = getTranslatedPlan(plan);
  const planName = translatedPlan.name;
  const planBadge = translatedPlan.badge;
  const planSubtitle = plan.slug === '12-mois' ? t('plans.12-mois.subtitle') : plan.slug === '24-mois' ? '+ 6 mois offerts' : '';

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="min-h-screen bg-bg-base pt-32">
        <div className="border-b border-border/40 bg-bg-card">
          <div className="max-w-7xl mx-auto px-[24px] md:px-[40px] py-16">
            <Breadcrumb 
              items={[
                { label: t('plans.title'), href: getLocalizedPath('/nos-plans', activeLocale) },
                { label: planName, href: getLocalizedPath(`/nos-plans/${plan.slug}`, activeLocale) }
              ]} 
            />
          </div>
        </div>

        {/* Product Header */}
        <div className="py-[64px] bg-gradient-to-br from-brand-from/[0.08] to-brand-to/[0.08] border-b border-border/40 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] pointer-events-none" />
          <div className="max-w-7xl mx-auto px-[24px] md:px-[40px]">
            <div className="max-w-4xl mx-auto text-center relative z-10">
              {planBadge && (
                <div className="inline-block px-16 py-8 bg-gradient-to-r from-brand-from to-brand-to text-white font-bold text-xs uppercase tracking-wider rounded-full mb-16 shadow-sm shadow-brand-from/15">
                  {planBadge}
                </div>
              )}
              <h1 className="font-syne font-bold text-32 md:text-56 text-text-primary mb-16 tracking-tight">
                {activeLocale === 'en' ? `IPTV Subscription ${planName}` : activeLocale === 'de' ? `IPTV-Abonnement ${planName}` : activeLocale === 'es' ? `Suscripción IPTV ${planName}` : `Abonnement ${planName}`}
              </h1>
              {planSubtitle && (
                <p className="text-lg md:text-xl text-cyan-700 dark:text-[var(--brand-from)] font-bold mb-16">
                  {planSubtitle}
                </p>
              )}
              <div className="flex items-center justify-center gap-12 mb-24">
                <div className="flex items-center gap-[2px]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-[14px] h-[14px] text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <span className="text-text-secondary text-sm font-medium">
                  {plan.reviewCount > 0 
                    ? `${plan.reviewCount.toLocaleString()} ${activeLocale === 'en' ? 'verified customer reviews' : activeLocale === 'de' ? 'verifizierte Kundenbewertungen' : activeLocale === 'es' ? 'opiniones de clientes verificadas' : 'avis clients vérifiés'}`
                    : ''}
                </span>
              </div>
              <div className="flex items-center justify-center gap-16 mb-24">
                {plan.originalPrice && (
                  <span className="text-text-muted text-2xl line-through font-medium">
                    {plan.originalPrice}€
                  </span>
                )}
                <span className="font-syne font-bold text-48 md:text-64 text-text-primary tracking-tight">
                  {plan.price === 0 
                    ? activeLocale === 'en' ? 'FREE' : activeLocale === 'de' ? 'GRATIS' : activeLocale === 'es' ? 'GRATIS' : 'GRATUIT' 
                    : `${plan.price}€`}
                </span>
                {plan.savings && (
                  <div className="px-16 py-8 bg-green-500/10 dark:bg-green-500/20 text-green-700 dark:text-green-400 font-bold text-xs rounded-lg border border-green-500/20">
                    {activeLocale === 'en' ? `Save ${plan.savings}` : activeLocale === 'de' ? `Sparen Sie ${plan.savings}` : activeLocale === 'es' ? `Ahorre ${plan.savings}` : `Économisez ${plan.savings}`}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="py-80 bg-bg-card border-b border-border/40">
          <div className="max-w-7xl mx-auto px-[24px] md:px-[40px]">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-syne font-bold text-24 md:text-32 text-text-primary mb-32 text-center tracking-tight">
                {activeLocale === 'en' ? 'What is included' : activeLocale === 'de' ? 'Was enthalten ist' : activeLocale === 'es' ? 'Qué está incluido' : 'Ce qui est inclus'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                {translatedPlan.features.map((feature: string, index: number) => (
                  <div key={index} className="flex items-center gap-12 p-16 bg-bg-base/40 rounded-xl border border-border/60">
                    <CheckCircle className="w-[20px] h-[20px] text-success flex-shrink-0" />
                    <span className="text-text-secondary text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods Section */}
        <div className="py-80 bg-bg-base border-b border-border/40">
          <div className="max-w-7xl mx-auto px-[24px] md:px-[40px]">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-syne font-bold text-24 md:text-32 text-text-primary mb-32 text-center tracking-tight">
                {activeLocale === 'en' ? 'Secure Payment Methods' : activeLocale === 'de' ? 'Sichere Zahlungsmethoden' : activeLocale === 'es' ? 'Métodos de Pago Seguros' : 'Méthodes de paiement sécurisées'}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-24 mb-48">
                {/* Card Payment */}
                <div className="p-24 rounded-2xl card-glass card-hover text-center flex flex-col justify-between">
                  <div>
                    <div className="w-[48px] h-[48px] bg-brand-from/10 rounded-xl flex items-center justify-center mb-16 mx-auto shadow-sm">
                      <CreditCard className="w-[24px] h-[24px] text-cyan-600 dark:text-brand-from" />
                    </div>
                    <h3 className="font-bold text-text-primary text-base mb-8">
                      {activeLocale === 'en' ? 'Credit Card' : activeLocale === 'de' ? 'Kreditkarte' : activeLocale === 'es' ? 'Tarjeta de Crédito' : 'Carte Bancaire'}
                    </h3>
                    <p className="text-text-secondary text-xs mb-16 leading-relaxed">
                      {activeLocale === 'en' 
                        ? 'Visa, Mastercard, American Express. 100% secure and immediate processing.' 
                        : activeLocale === 'de' 
                          ? 'Visa, Mastercard, American Express. 100% sichere und sofortige Verarbeitung.' 
                          : activeLocale === 'es' 
                            ? 'Visa, Mastercard, American Express. Procesamiento 100% seguro e inmediato.' 
                            : 'Visa, Mastercard, American Express. Traitement 100% sécurisé et immédiat.'}
                    </p>
                  </div>
                  <div className="flex justify-center gap-8">
                    <div className="px-8 py-4 bg-bg-elevated border border-border rounded text-[10px] text-text-secondary font-bold">VISA</div>
                    <div className="px-8 py-4 bg-bg-elevated border border-border rounded text-[10px] text-text-secondary font-bold">MC</div>
                    <div className="px-8 py-4 bg-bg-elevated border border-border rounded text-[10px] text-text-secondary font-bold">AMEX</div>
                  </div>
                </div>

                {/* PayPal */}
                <div className="p-24 rounded-2xl card-glass card-hover text-center flex flex-col justify-between">
                  <div>
                    <div className="w-[48px] h-[48px] bg-brand-to/10 rounded-xl flex items-center justify-center mb-16 mx-auto shadow-sm">
                      <Smartphone className="w-[24px] h-[24px] text-purple-600 dark:text-brand-to" />
                    </div>
                    <h3 className="font-bold text-text-primary text-base mb-8">PayPal</h3>
                    <p className="text-text-secondary text-xs mb-16 leading-relaxed">
                      {activeLocale === 'en' 
                        ? 'Secure and fast payment in one click with your account or card.' 
                        : activeLocale === 'de' 
                          ? 'Sichere und schnelle Zahlung mit einem Klick über Ihr Konto oder Ihre Karte.' 
                          : activeLocale === 'es' 
                            ? 'Pago seguro y rápido en un clic con su cuenta o tarjeta.' 
                            : 'Paiement sécurisé et rapide en un clic avec votre compte ou carte.'}
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <div className="px-12 py-4 bg-blue-500/10 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 rounded-lg text-xs font-bold border border-blue-500/20">
                      PayPal Express
                    </div>
                  </div>
                </div>

                {/* Cryptocurrency */}
                <div className="p-24 rounded-2xl card-glass card-hover text-center flex flex-col justify-between">
                  <div>
                    <div className="w-[48px] h-[48px] bg-success/10 rounded-xl flex items-center justify-center mb-16 mx-auto shadow-sm">
                      <Shield className="w-[24px] h-[24px] text-success" />
                    </div>
                    <h3 className="font-bold text-text-primary text-base mb-8">
                      {activeLocale === 'en' ? 'Cryptocurrencies' : activeLocale === 'de' ? 'Kryptowährungen' : activeLocale === 'es' ? 'Criptomonedas' : 'Crypto-monnaies'}
                    </h3>
                    <p className="text-text-secondary text-xs mb-16 leading-relaxed">
                      {activeLocale === 'en' 
                        ? 'Bitcoin, Ethereum, USDT. Guaranteed anonymity and 5% additional discount.' 
                        : activeLocale === 'de' 
                          ? 'Bitcoin, Ethereum, USDT. Garantierte Anonymität und 5% zusätzlicher Rabatt.' 
                          : activeLocale === 'es' 
                            ? 'Bitcoin, Ethereum, USDT. Anonimato garantizado y 5% de descuento adicional.' 
                            : 'Bitcoin, Ethereum, USDT. Anonymat garanti et 5% de réduction additionnelle.'}
                    </p>
                  </div>
                  <div className="flex justify-center gap-8">
                    <div className="px-8 py-4 bg-bg-elevated border border-border rounded text-[10px] text-text-secondary font-bold">BTC</div>
                    <div className="px-8 py-4 bg-bg-elevated border border-border rounded text-[10px] text-text-secondary font-bold">ETH</div>
                    <div className="px-8 py-4 bg-bg-elevated border border-border rounded text-[10px] text-text-secondary font-bold">USDT</div>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <div className="text-center">
                {plan.slug === 'essai-3h' ? (
                  <Link
                    href={getLocalizedPath('/essai-gratuit', activeLocale)}
                    className="inline-flex items-center gap-8 px-40 py-16 bg-gradient-to-r from-brand-from to-brand-to text-white font-bold text-lg rounded-xl hover:shadow-[0_0_25px_rgba(0,243,255,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                  >
                    {t('plans.trial_cta')}
                  </Link>
                ) : (
                  <Link
                    href={getLocalizedPath(`/checkout?plan=${plan.slug}`, activeLocale)}
                    className="inline-flex items-center gap-8 px-40 py-16 bg-gradient-to-r from-brand-from to-brand-to text-white font-bold text-lg rounded-xl hover:shadow-[0_0_25px_rgba(0,243,255,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                  >
                    {activeLocale === 'en' ? 'Order Now' : activeLocale === 'de' ? 'Jetzt bestellen' : activeLocale === 'es' ? 'Comprar ahora' : 'Commander maintenant'}
                  </Link>
                )}
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap justify-center gap-16 mt-24">
                <div className="flex items-center gap-8 bg-bg-card px-12 py-4 rounded-lg border border-border/50 text-text-secondary text-xs font-semibold">
                  <Shield className="w-14 h-14 text-cyan-600 dark:text-brand-from" />
                  <span>{activeLocale === 'en' ? 'Secure SSL Payment' : activeLocale === 'de' ? 'Sichere SSL-Zahlung' : activeLocale === 'es' ? 'Pago seguro SSL' : 'Paiement sécurisé SSL'}</span>
                </div>
                <div className="flex items-center gap-8 bg-bg-card px-12 py-4 rounded-lg border border-border/50 text-text-secondary text-xs font-semibold">
                  <Clock className="w-14 h-14 text-purple-600 dark:text-brand-to" />
                  <span>{t('checkout.summary.setup')}</span>
                </div>
                <div className="flex items-center gap-8 bg-bg-card px-12 py-4 rounded-lg border border-border/50 text-text-secondary text-xs font-semibold">
                  <CheckCircle className="w-14 h-14 text-success" />
                  <span>{t('checkout.summary.guarantee')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="py-80 bg-bg-card">
          <div className="max-w-7xl mx-auto px-[24px] md:px-[40px]">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-syne font-bold text-24 md:text-32 text-text-primary mb-32 text-center tracking-tight">
                {t('features.title')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-24">
                <div className="text-center">
                  <div className="w-[48px] h-[48px] bg-brand-from/10 rounded-2xl flex items-center justify-center mb-16 mx-auto shadow-sm">
                    <Clock className="w-[24px] h-[24px] text-cyan-600 dark:text-brand-from" />
                  </div>
                  <h3 className="font-bold text-text-primary text-base mb-8">{t('plans.features_list.activation')}</h3>
                  <p className="text-text-secondary text-xs leading-relaxed">
                    {locale === 'en' 
                      ? 'Your credentials and installation guide are sent to your email immediately after confirmation.' 
                      : locale === 'de' 
                        ? 'Ihre Zugangsdaten und die Installationsanleitung werden Ihnen sofort nach der Bestätigung per E-Mail zugesandt.' 
                        : locale === 'es' 
                          ? 'Sus credenciales y la guía de instalación se envían a su correo electrónico inmediatamente después de la confirmación.' 
                          : "Vos identifiants et le guide d'installation vous sont envoyés par email immédiatement après confirmation."}
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-[48px] h-[48px] bg-brand-to/10 rounded-2xl flex items-center justify-center mb-16 mx-auto shadow-sm">
                    <Shield className="w-[24px] h-[24px] text-purple-600 dark:text-brand-to" />
                  </div>
                  <h3 className="font-bold text-text-primary text-base mb-8">{t('plans.features_list.support')}</h3>
                  <p className="text-text-secondary text-xs leading-relaxed">
                    {locale === 'en' 
                      ? 'Have a question or need help with installation? Our team of experts is available via email and WhatsApp.' 
                      : locale === 'de' 
                        ? 'Haben Sie Fragen oder benötigen Sie Hilfe bei der Installation? Unser Expertenteam steht Ihnen per E-Mail und WhatsApp zur Verfügung.' 
                        : locale === 'es' 
                          ? '¿Tiene alguna pregunta o necesita ayuda con la instalación? Nuestro equipo de expertos está disponible por correo y WhatsApp.' 
                          : "Une question ou besoin d'aide pour l'installation ? Notre équipe d'experts est disponible par email et WhatsApp."}
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-[48px] h-[48px] bg-success/10 rounded-2xl flex items-center justify-center mb-16 mx-auto shadow-sm">
                    <CheckCircle className="w-[24px] h-[24px] text-success" />
                  </div>
                  <h3 className="font-bold text-text-primary text-base mb-8">
                    {locale === 'en' ? 'Refund Guarantee' : locale === 'de' ? 'Rückerstattungsgarantie' : locale === 'es' ? 'Garantía de Reembolso' : 'Garantie Remboursement'}
                  </h3>
                  <p className="text-text-secondary text-xs leading-relaxed">
                    {t('guarantee.desc_2')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsappButton />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildProductSchema(translatedPlan)),
        }}
      />
    </>
  );
}
