'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { getAllPlansSync } from '@/lib/data/plans';
import type { PricingPlan } from '@/lib/cms/settings-storage';
import { cn } from '@/lib/utils/cn';
import {
  Lock,
  CheckCircle,
  Check,
  Percent,
  Monitor,
  Laptop,
  Box,
  ShieldCheck,
  Tv,
  HelpCircle,
  Loader2,
  LockKeyhole,
  MessageCircle,
  Building,
  Zap,
  Clock,
  Users,
  ChevronDown,
  ChevronUp,
  Copy,
  Bitcoin,
  CreditCard,
  Wallet,
  ExternalLink,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import { PublicThemeSwitcher } from '@/components/ui/PublicThemeSwitcher';
import { useTranslation } from '@/hooks/useTranslation';
import { getLocalizedPath } from '@/lib/i18n';
import { motion, AnimatePresence } from 'framer-motion';

const packMapping: Record<string, string> = {
  '1mois': '1-mois',
  '3mois': '3-mois',
  '6mois': '6-mois',
  '12mois': '12-mois',
  '24mois': '24-mois',
};

const slugToPackKey: Record<string, string> = {
  '1-mois': '1mois',
  '3-mois': '3mois',
  '6-mois': '6mois',
  '12-mois': '12mois',
  '24-mois': '24mois',
  'essai-3h': '12mois',
};

const packLabels: Record<string, { fr: string; en: string; de: string; es: string }> = {
  '1mois':  { fr: '1 Mois',   en: '1 Month',   de: '1 Monat',   es: '1 Mes'    },
  '3mois':  { fr: '3 Mois',   en: '3 Months',  de: '3 Monate',  es: '3 Meses'  },
  '6mois':  { fr: '6 Mois',   en: '6 Months',  de: '6 Monate',  es: '6 Meses'  },
  '12mois': { fr: '12 Mois',  en: '12 Months', de: '12 Monate', es: '12 Meses' },
  '24mois': { fr: '24 Mois',  en: '24 Months', de: '24 Monate', es: '24 Meses' },
};

const defaultPrices: Record<string, number> = {
  '1mois': 17.99,
  '3mois': 26.99,
  '6mois': 36.99,
  '12mois': 46.99,
  '24mois': 89.99,
};

const originalPrices: Record<string, number> = {
  '1mois': 19.99,
  '3mois': 32.99,
  '6mois': 45.99,
  '12mois': 59.99,
  '24mois': 99.99,
};

type PaymentMethod = 'whatsapp' | 'transfer' | 'stripe' | 'paypal' | 'crypto';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handle = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      type="button"
      onClick={handle}
      className="ml-2 p-1 rounded-md hover:bg-white/10 transition-colors text-text-muted hover:text-text-primary"
      title="Copier"
    >
      {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
    </button>
  );
}

function WhatsAppPanel({ locale }: { locale: string }) {
  const steps = {
    fr: [
      'Confirmez votre commande ci-dessous',
      'Notre équipe vous contacte sur WhatsApp sous 5 min',
      'Vous effectuez le paiement selon vos préférences',
      'Activation immédiate de votre abonnement IPTV',
    ],
    en: [
      'Confirm your order below',
      'Our team contacts you on WhatsApp within 5 min',
      'You make the payment as agreed',
      'Immediate activation of your IPTV subscription',
    ],
    de: [
      'Bestätigen Sie Ihre Bestellung unten',
      'Unser Team kontaktiert Sie innerhalb von 5 Min. per WhatsApp',
      'Sie führen die Zahlung durch',
      'Sofortige Aktivierung Ihres IPTV-Abonnements',
    ],
    es: [
      'Confirma tu pedido a continuación',
      'Nuestro equipo te contacta por WhatsApp en 5 min',
      'Realizas el pago según lo acordado',
      'Activación inmediata de tu suscripción IPTV',
    ],
  };
  const currentSteps = steps[locale as keyof typeof steps] || steps.fr;
  const title   = locale === 'en' ? 'How it works' : locale === 'de' ? 'So funktioniert es' : locale === 'es' ? 'Cómo funciona' : 'Comment ça marche';
  const contact = locale === 'en' ? 'Our WhatsApp' : locale === 'de' ? 'Unser WhatsApp' : locale === 'es' ? 'Nuestro WhatsApp' : 'Notre WhatsApp';
  const note    = locale === 'en' ? 'Available 24/7 — Average response: 3 min' : locale === 'de' ? 'Verfügbar 24/7 — Ø Antwortzeit: 3 Min.' : locale === 'es' ? 'Disponible 24/7 — Respuesta media: 3 min' : 'Disponible 24/7 — Réponse moyenne : 3 min';

  return (
    <div className="mt-4 overflow-hidden">
      <div className="p-5 rounded-xl border border-green-500/20 bg-green-500/5 space-y-4">
        <p className="text-xs font-bold text-green-400 flex items-center gap-2">
          <MessageCircle className="w-5 h-5" /> {title}
        </p>
        <div className="space-y-2.5">
          {currentSteps.map((step, i) => (
            <div key={i} className="flex items-start gap-3 text-xs text-text-secondary">
              <span className="w-5 h-5 rounded-full bg-green-500/20 text-green-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
              <span>{step}</span>
            </div>
          ))}
        </div>
        <div className="pt-3 border-t border-green-500/10 flex items-center justify-between flex-wrap gap-2">
          <div>
            <p className="text-[10px] text-text-muted mb-0.5">{contact}</p>
            <div className="flex items-center gap-1">
              <span className="text-xl font-mono font-bold text-green-400">+33 7 XX XX XX XX</span>
              <CopyButton text="+33 7 XX XX XX XX" />
            </div>
          </div>
          <span className="text-[10px] text-green-500/70 bg-green-500/10 px-2 py-1 rounded-full">{note}</span>
        </div>
      </div>
    </div>
  );
}

function TransferPanel({ locale, email }: { locale: string; email: string }) {
  const emailPrefix = email.split('@')[0] || 'CLIENT';
  const ref = `IPTV-${emailPrefix.toUpperCase().slice(0, 10)}`;
  const title    = locale === 'en' ? 'Bank details' : locale === 'de' ? 'Bankverbindung' : locale === 'es' ? 'Datos bancarios' : 'Coordonnées bancaires';
  const refLabel = locale === 'en' ? 'Reference' : locale === 'de' ? 'Verwendungszweck' : locale === 'es' ? 'Referencia' : 'Référence';
  const noteText = locale === 'en' ? '⚠️ Activation within 24–48h after transfer confirmed.' : locale === 'de' ? '⚠️ Aktivierung innerhalb von 24–48 Std. nach Eingang der Überweisung.' : locale === 'es' ? '⚠️ Activación en 24–48h tras confirmar la transferencia.' : '⚠️ Activation sous 24–48h après réception du virement.';

  const rows = [
    { label: 'IBAN',          value: 'FR76 3000 6000 0112 3456 7890 189' },
    { label: 'BIC / SWIFT',   value: 'BNPAFRPPXXX' },
    { label: locale === 'en' ? 'Beneficiary' : locale === 'de' ? 'Begünstigter' : locale === 'es' ? 'Beneficiario' : 'Bénéficiaire', value: 'RegardezIPTV SAS' },
    { label: refLabel,        value: ref },
  ];

  return (
    <div className="mt-4 overflow-hidden">
      <div className="p-5 rounded-xl border border-blue-500/20 bg-blue-500/5 space-y-4">
        <p className="text-xs font-bold text-blue-400 flex items-center gap-2">
          <Building className="w-5 h-5" /> {title}
        </p>
        <div className="space-y-2">
          {rows.map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between bg-bg-base rounded-lg px-3 py-4.5">
              <span className="text-[10px] text-text-muted shrink-0 mr-3">{label}</span>
              <div className="flex items-center gap-1 min-w-0">
                <span className="text-xs font-mono text-text-primary truncate">{value}</span>
                <CopyButton text={value} />
              </div>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-amber-400/80 leading-relaxed">{noteText}</p>
      </div>
    </div>
  );
}

function StripePanel({ locale }: { locale: string }) {
  const title   = locale === 'en' ? 'Pay by card (Stripe)' : locale === 'de' ? 'Per Karte bezahlen (Stripe)' : locale === 'es' ? 'Pagar con tarjeta (Stripe)' : 'Payer par carte (Stripe)';
  const desc    = locale === 'en' ? 'You will be redirected to Stripe\'s secure payment page.' : locale === 'de' ? 'Sie werden zur sicheren Stripe-Zahlungsseite weitergeleitet.' : locale === 'es' ? 'Serás redirigido a la página segura de pago de Stripe.' : 'Vous serez redirigé vers la page de paiement sécurisée Stripe.';
  const btnText = locale === 'en' ? 'Continue to Stripe' : locale === 'de' ? 'Weiter zu Stripe' : locale === 'es' ? 'Continuar con Stripe' : 'Continuer vers Stripe';
  const badge   = locale === 'en' ? 'Coming soon — Integration in progress' : locale === 'de' ? 'Demnächst — Integration in Kürze' : locale === 'es' ? 'Próximamente — Integración en proceso' : 'Bientôt disponible — Intégration en cours';

  return (
    <div className="mt-4 overflow-hidden">
      <div className="p-5 rounded-xl border border-violet-500/20 bg-violet-500/5 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-violet-400 flex items-center gap-2">
            <CreditCard className="w-5 h-5" /> {title}
          </p>
          <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> {badge}
          </span>
        </div>
        <p className="text-xs text-text-muted">{desc}</p>
        <div className="flex items-center gap-3">
          {['VISA', 'MC', 'AMEX', 'CB'].map((card) => (
            <span key={card} className="text-[10px] font-bold bg-bg-base border border-border text-text-secondary px-2 py-1 rounded">{card}</span>
          ))}
        </div>
        <button
          type="button"
          disabled
          className="w-full h-10 rounded-xl bg-violet-600/30 text-violet-300 text-xs font-bold flex items-center justify-center gap-2 cursor-not-allowed opacity-60"
        >
          <ExternalLink className="w-5 h-5" /> {btnText}
        </button>
        <p className="text-[10px] text-text-muted flex items-center gap-1">
          <ShieldCheck className="w-3 h-3" /> Powered by Stripe · PCI DSS compliant
        </p>
      </div>
    </div>
  );
}

function PayPalPanel({ locale }: { locale: string }) {
  const title   = locale === 'en' ? 'Pay with PayPal' : locale === 'de' ? 'Mit PayPal bezahlen' : locale === 'es' ? 'Pagar con PayPal' : 'Payer avec PayPal';
  const desc    = locale === 'en' ? 'Fast and secure payment with your PayPal account or card.' : locale === 'de' ? 'Schnelle und sichere Zahlung mit Ihrem PayPal-Konto oder Karte.' : locale === 'es' ? 'Pago rápido y seguro con tu cuenta PayPal o tarjeta.' : 'Paiement rapide et sécurisé avec votre compte PayPal ou carte.';
  const btnText = locale === 'en' ? 'Continue with PayPal' : locale === 'de' ? 'Weiter mit PayPal' : locale === 'es' ? 'Continuar con PayPal' : 'Continuer avec PayPal';
  const badge   = locale === 'en' ? 'Coming soon' : locale === 'de' ? 'Demnächst' : locale === 'es' ? 'Próximamente' : 'Bientôt disponible';

  return (
    <div className="mt-4 overflow-hidden">
      <div className="p-5 rounded-xl border border-blue-400/20 bg-blue-400/5 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-blue-300 flex items-center gap-2">
            <Wallet className="w-5 h-5" /> {title}
          </p>
          <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> {badge}
          </span>
        </div>
        <p className="text-xs text-text-muted">{desc}</p>
        <button
          type="button"
          disabled
          className="w-full h-10 rounded-xl bg-bg-base/40 text-blue-200 text-xs font-bold flex items-center justify-center gap-2 cursor-not-allowed opacity-60"
        >
          <ExternalLink className="w-5 h-5" /> {btnText}
        </button>
        <p className="text-[10px] text-text-muted flex items-center gap-1">
          <ShieldCheck className="w-3 h-3" /> PayPal Buyer Protection included
        </p>
      </div>
    </div>
  );
}

function CryptoPanel({ locale }: { locale: string }) {
  const [selectedCoin, setSelectedCoin] = useState<'BTC' | 'ETH' | 'USDT'>('USDT');
  const title   = locale === 'en' ? 'Pay with Crypto' : locale === 'de' ? 'Mit Krypto bezahlen' : locale === 'es' ? 'Pagar con cripto' : 'Payer en Crypto';
  const addrLabel = locale === 'en' ? 'Wallet address' : locale === 'de' ? 'Wallet-Adresse' : locale === 'es' ? 'Dirección de wallet' : 'Adresse du wallet';
  const noteText  = locale === 'en' ? 'Send the exact amount. Activation after 1 network confirmation.' : locale === 'de' ? 'Genauer Betrag erforderlich. Aktivierung nach 1 Netzwerkbestätigung.' : locale === 'es' ? 'Envía el importe exacto. Activación tras 1 confirmación de red.' : 'Envoyez le montant exact. Activation après 1 confirmation réseau.';
  const badge     = locale === 'en' ? 'Coming soon' : locale === 'de' ? 'Demnächst' : locale === 'es' ? 'Próximamente' : 'Bientôt disponible';

  const addresses: Record<string, string> = {
    BTC:  'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    ETH:  '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    USDT: 'TRx7NkNmJQzrp3LkXbHv8rSQdx5NqVr8Lf',
  };

  return (
    <div className="mt-4 overflow-hidden">
      <div className="p-5 rounded-xl border border-orange-500/20 bg-orange-500/5 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-orange-400 flex items-center gap-2">
            <Bitcoin className="w-5 h-5" /> {title}
          </p>
          <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> {badge}
          </span>
        </div>

        <div className="flex gap-2">
          {(['BTC', 'ETH', 'USDT'] as const).map((coin) => (
            <button
              key={coin}
              type="button"
              onClick={() => setSelectedCoin(coin)}
              className={cn(
                'flex-1 h-8 rounded-lg text-xs font-bold transition-all duration-200',
                selectedCoin === coin
                  ? 'bg-orange-500/30 text-orange-300 border border-orange-500/40'
                  : 'bg-bg-base text-text-muted border border-border hover:border-slate-500'
              )}
            >
              {coin}
            </button>
          ))}
        </div>

        <div>
          <p className="text-[10px] text-text-muted mb-1.5">{addrLabel} ({selectedCoin})</p>
          <div className="flex items-center bg-bg-base border border-border rounded-lg px-3 py-4.5">
            <span className="text-[11px] font-mono text-text-primary truncate flex-1">{addresses[selectedCoin]}</span>
            <CopyButton text={addresses[selectedCoin]} />
          </div>
        </div>

        <p className="text-[10px] text-amber-400/80 leading-relaxed">{noteText}</p>
      </div>
    </div>
  );
}

function PaymentCard({
  icon: Icon,
  label,
  sublabel,
  selected,
  onClick,
  accentColor = 'blue',
}: {
  icon: any;
  label: string;
  sublabel?: string;
  selected: boolean;
  onClick: () => void;
  accentColor?: 'green' | 'blue' | 'violet' | 'paypal' | 'orange';
}) {
  const colors: Record<string, string> = {
    green:  selected ? 'border-green-500 bg-green-500/10 text-green-400'   : 'border-border hover:border-green-500/40 text-text-secondary',
    blue:   selected ? 'border-blue-500 bg-blue-500/10 text-blue-400'     : 'border-border hover:border-blue-500/40 text-text-secondary',
    violet: selected ? 'border-violet-500 bg-violet-500/10 text-violet-400' : 'border-border hover:border-violet-500/40 text-text-secondary',
    paypal: selected ? 'border-blue-300 bg-blue-300/10 text-blue-200'     : 'border-border hover:border-blue-300/40 text-text-secondary',
    orange: selected ? 'border-orange-500 bg-orange-500/10 text-orange-400' : 'border-border hover:border-orange-500/40 text-text-secondary',
  };
  const glowColors: Record<string, string> = {
    green: 'bg-green-500', blue: 'bg-blue-500', violet: 'bg-violet-500', paypal: 'bg-blue-300', orange: 'bg-orange-500',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'relative flex flex-col items-center justify-center p-4 h-[100px] w-full rounded-xl border transition-all duration-300 overflow-hidden',
        colors[accentColor]
      )}
    >
      {selected && (
        <div className={cn('absolute inset-0 blur-xl', glowColors[accentColor])} />
      )}
      <Icon className="w-6 h-6 mb-2 relative z-10" />
      <span className="text-xs font-bold relative z-10 leading-tight text-center">{label}</span>
      {sublabel && <span className="text-[10px] text-text-muted mt-0.5 relative z-10">{sublabel}</span>}
      {selected && (
        <div className={cn('absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full flex items-center justify-center', glowColors[accentColor])}>
          <Check className="w-2 h-2 text-text-primary" />
        </div>
      )}
    </button>
  );
}

function OrderSummary({
  packKey,
  basePrice,
  originalPrice,
  totalPrice,
  discountAmount,
  discountPercent,
  isPromoApplied,
  locale,
}: {
  packKey: string;
  basePrice: number;
  originalPrice: number;
  totalPrice: number;
  discountAmount: number;
  discountPercent: number;
  isPromoApplied: boolean;
  locale: string;
}) {
  const lang = (['fr', 'en', 'de', 'es'].includes(locale) ? locale : 'fr') as 'fr' | 'en' | 'de' | 'es';
  const packLabel = packLabels[packKey]?.[lang] ?? '12 Mois';

  const labels = {
    fr: { summary: 'Résumé de la commande', pack: `Pack IPTV — ${packLabel}`, sub: 'Accès VIP · Toutes chaînes incluses', discount: 'Réduction', taxes: 'Taxes', included: 'Inclus', total: 'Total' },
    en: { summary: 'Order Summary', pack: `IPTV Pack — ${packLabel}`, sub: 'VIP Access · All channels included', discount: 'Discount', taxes: 'Taxes', included: 'Included', total: 'Total' },
    de: { summary: 'Bestellübersicht', pack: `IPTV-Paket — ${packLabel}`, sub: 'VIP-Zugang · Alle Kanäle inklusive', discount: 'Rabatt', taxes: 'Steuern', included: 'Inklusive', total: 'Gesamt' },
    es: { summary: 'Resumen del pedido', pack: `Pack IPTV — ${packLabel}`, sub: 'Acceso VIP · Todos los canales incluidos', discount: 'Descuento', taxes: 'Impuestos', included: 'Incluido', total: 'Total' },
  };
  const l = labels[lang];

  const trustItems = [
    { icon: Zap,        text: locale === 'en' ? '⚡ Instant activation within 5 min' : locale === 'de' ? '⚡ Sofortige Aktivierung in 5 Min.' : locale === 'es' ? '⚡ Activación instantánea en 5 min' : '⚡ Activation immédiate en moins de 5 min' },
    { icon: Clock,      text: locale === 'en' ? '24/7 Support via WhatsApp' : locale === 'de' ? '24/7 WhatsApp-Support' : locale === 'es' ? 'Soporte 24/7 por WhatsApp' : 'Support 24/7 via WhatsApp' },
    { icon: ShieldCheck,text: locale === 'en' ? '7-day money-back guarantee' : locale === 'de' ? '7-Tage Geld-zurück-Garantie' : locale === 'es' ? 'Garantía de reembolso 7 días' : 'Garantie satisfait ou remboursé 7j' },
    { icon: Users,      text: locale === 'en' ? '45,000+ channels & VOD' : locale === 'de' ? '45.000+ Kanäle & VOD' : locale === 'es' ? '45.000+ canales y VOD' : '45 000+ chaînes & VOD' },
  ];

  return (
    <>
      <h2 className="text-xl font-bold text-text-primary border-b border-border pb-3 mb-4">{l.summary}</h2>

      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-text-primary">{l.pack}</h3>
            <p className="text-[10px] text-text-muted mt-0.5">{l.sub}</p>
          </div>
          <div className="text-right shrink-0 ml-3">
            <span className="text-xs text-text-muted line-through block">{originalPrice.toFixed(2)} €</span>
            <span className="text-xl font-bold text-text-primary">{basePrice.toFixed(2)} €</span>
          </div>
        </div>

        {discountPercent > 0 && (
          <div className="flex justify-between items-center text-xs font-semibold text-green-400">
            <span>{l.discount} ({discountPercent}%)</span>
            <span>−{discountAmount.toFixed(2)} €</span>
          </div>
        )}

        <div className="flex justify-between items-center text-xs text-text-muted">
          <span>{l.taxes}</span>
          <span>{l.included} 0.00 €</span>
        </div>

        <div className="h-px bg-bg-base" />

        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-text-primary">{l.total}</span>
          <span className="text-xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            {totalPrice.toFixed(2)} €
          </span>
        </div>
      </div>

      <div className="bg-bg-base p-4 rounded-xl mt-5 space-y-2.5">
        {trustItems.map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-start gap-2 text-[10px] text-text-secondary font-medium">
            <Icon className="w-3 h-3 text-green-500 mt-0.5 shrink-0" />
            <span>{text}</span>
          </div>
        ))}
      </div>
    </>
  );
}

export default function CheckoutForm({ pricing }: { pricing: PricingPlan[] | null }) {
  const searchParams = useSearchParams();
  const { t, locale } = useTranslation();

  const packParam = searchParams.get('pack');
  const planParam = searchParams.get('plan');
  const prixParam = searchParams.get('prix');

  let packKey = '12mois';
  if (packParam && packMapping[packParam]) packKey = packParam;
  else if (planParam && slugToPackKey[planParam]) packKey = slugToPackKey[planParam];

  const planSlug = packMapping[packKey];
  const basePlan = useMemo(() => {
    if (pricing) {
      const fromSettings = pricing.find((p) => p.slug === planSlug);
      if (fromSettings) return fromSettings;
    }
    return getAllPlansSync().find((p) => p.slug === planSlug) || null;
  }, [pricing, planSlug]);

  const basePrice    = prixParam ? parseFloat(prixParam) : (basePlan?.price ?? defaultPrices[packKey] ?? 46.99);
  const originalPrice = originalPrices[packKey] || defaultPrices[packKey];

  const [firstName,    setFirstName]    = useState('');
  const [lastName,     setLastName]     = useState('');
  const [email,        setEmail]        = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [phone,        setPhone]        = useState('');
  const [device,       setDevice]       = useState<'tv' | 'box' | 'mobile' | 'mag' | ''>('');
  const [macAddress,   setMacAddress]   = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('whatsapp');

  const [showPromoInput, setShowPromoInput] = useState(false);
  const [promoInput,     setPromoInput]     = useState('');
  const [promoApplied,   setPromoApplied]   = useState<'GOLD20' | 'VIP10' | null>(null);
  const [promoError,     setPromoError]     = useState('');
  const [isSubmitting,   setIsSubmitting]   = useState(false);
  const [isSuccess,      setIsSuccess]      = useState(false);
  const [showSummaryMobile, setShowSummaryMobile] = useState(false);

  const handleMacChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value    = e.target.value.replace(/[^a-fA-F0-9]/g, '').toUpperCase();
    const formatted = value.replace(/(.{2})/g, '$1:').replace(/:$/, '');
    setMacAddress(formatted.slice(0, 17));
  };

  const handleApplyPromo = () => {
    setPromoError('');
    const code = promoInput.trim().toUpperCase();
    if (code === 'GOLD20')      { setPromoApplied('GOLD20'); setPromoInput(''); }
    else if (code === 'VIP10')  { setPromoApplied('VIP10');  setPromoInput(''); }
    else setPromoError(locale === 'en' ? 'Invalid promo code' : locale === 'de' ? 'Ungültiger Promo-Code' : locale === 'es' ? 'Código inválido' : 'Code promo invalide');
  };

  const handleRemovePromo = () => { setPromoApplied(null); setPromoError(''); };

  const discountPercent = promoApplied === 'GOLD20' ? 20 : promoApplied === 'VIP10' ? 10 : 0;
  const discountAmount  = (basePrice * discountPercent) / 100;
  const totalPrice      = basePrice - discountAmount;

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isEmailMatch = email.trim().toLowerCase() === confirmEmail.trim().toLowerCase() && email.trim() !== '';
  const isStep1Valid = firstName.trim() !== '' && lastName.trim() !== '' && isEmailValid && isEmailMatch;
  const canSubmit = isStep1Valid;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isStep1Valid) return;
    setIsSubmitting(true);
    setTimeout(() => { setIsSubmitting(false); setIsSuccess(true); }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-bg-base border border-border rounded-2xl p-8 text-center shadow-2xl">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h1 className="font-sans font-bold text-2xl text-text-primary mb-4">
            {locale === 'en' ? 'Order Confirmed!' : locale === 'de' ? 'Bestellung bestätigt!' : locale === 'es' ? '¡Pedido confirmado!' : 'Commande confirmée !'}
          </h1>
          <p className="text-text-secondary text-xl leading-relaxed mb-6">{t('checkout.payment.success')}</p>
          <Link href={getLocalizedPath('/', locale)} className="inline-flex justify-center items-center w-full h-24 bg-gradient-to-r from-blue-500 to-purple-600 text-text-primary font-semibold rounded-xl hover:opacity-90 transition-opacity text-xl shadow-lg">
            {locale === 'en' ? 'Back to Home' : locale === 'de' ? 'Zurück zur Startseite' : locale === 'es' ? 'Volver al inicio' : "Retour à l'accueil"}
          </Link>
        </div>
      </div>
    );
  }

  const summaryProps = { packKey, basePrice, originalPrice, totalPrice, discountAmount, discountPercent, isPromoApplied: !!promoApplied, locale };

  return (
    <div className="min-h-screen font-sans antialiased text-text-primary relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)`,
          backgroundSize: '24px 24px',
        }} />
      </div>

      <header className="w-full bg-bg-card border-b border-border sticky top-0 z-40 backdrop-blur-lg bg-opacity-90">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
          <Link href={getLocalizedPath('/', locale)} className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
              <span className="text-text-primary font-bold text-lg">R</span>
            </div>
            <span className="font-bold text-xl text-text-primary tracking-tight group-hover:text-blue-400 transition-colors">RegardezIPTV</span>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <span className="flex items-center gap-2 text-green-500"><CheckCircle className="w-4 h-4" /> {locale === 'en' ? 'Cart' : locale === 'de' ? 'Warenkorb' : locale === 'es' ? 'Carrito' : 'Panier'}</span>
            <span className="text-text-muted">→</span>
            <span className="flex items-center gap-2 text-blue-400 font-semibold">
              <span className="w-6 h-6 bg-blue-500 text-text-primary flex items-center justify-center rounded-full text-sm">2</span>
              {locale === 'en' ? 'Payment' : locale === 'de' ? 'Zahlung' : locale === 'es' ? 'Pago' : 'Paiement'}
            </span>
            <span className="text-text-muted">→</span>
            <span className="flex items-center gap-2 text-text-muted">
              <span className="w-6 h-6 bg-bg-elevated border border-border text-text-muted flex items-center justify-center rounded-full text-sm">3</span>
              {locale === 'en' ? 'Confirmation' : locale === 'de' ? 'Bestätigung' : locale === 'es' ? 'Confirmación' : 'Confirmation'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden lg:flex items-center gap-2 text-xs text-text-secondary font-medium bg-bg-elevated px-4 py-2 rounded-full border border-border">
              <LockKeyhole className="w-3 h-3 text-green-500" /> {locale === 'en' ? 'SSL Secure' : locale === 'de' ? 'SSL-sicher' : locale === 'es' ? 'SSL seguro' : 'SSL sécurisé'}
            </span>
            <PublicThemeSwitcher />
          </div>
        </div>
      </header>

      <div className="md:hidden w-full bg-bg-card border-b border-border px-4 py-3 flex items-center justify-between text-sm font-medium">
        <span className="flex items-center gap-2 text-green-500"><CheckCircle className="w-4 h-4" /> {locale === 'en' ? 'Cart' : locale === 'de' ? 'Warenkorb' : locale === 'es' ? 'Carrito' : 'Panier'}</span>
        <span className="text-blue-400 font-semibold">→ {locale === 'en' ? 'Payment' : locale === 'de' ? 'Zahlung' : locale === 'es' ? 'Pago' : 'Paiement'}</span>
        <span className="text-text-muted">→ {locale === 'en' ? 'Confirm' : locale === 'de' ? 'Bestätigung' : locale === 'es' ? 'Confirmación' : 'Confirmation'}</span>
      </div>

      <main className="max-w-[1200px] mx-auto px-6 md:px-10 pt-12 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-8">
            <div className="bg-bg-elevated border border-border rounded-2xl p-4 mb-8">
              <div className="flex items-center gap-4 flex-wrap justify-center">
                {[
                  { n: 1, label: locale === 'en' ? 'Your Pack' : locale === 'de' ? 'Ihr Paket' : locale === 'es' ? 'Tu pack' : 'Votre pack', status: 'completed' },
                  { n: 2, label: locale === 'en' ? 'Your Info' : locale === 'de' ? 'Ihre Info' : locale === 'es' ? 'Tu info' : 'Vos infos', status: 'completed' },
                  { n: 3, label: locale === 'en' ? 'Payment' : locale === 'de' ? 'Zahlung' : locale === 'es' ? 'Pago' : 'Paiement', status: 'active' },
                ].map(({ n, label, status }, i, arr) => (
                  <div key={n} className="flex items-center gap-3">
                    <div className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center text-base font-bold transition-all',
                      status === 'completed' ? 'bg-green-500 text-white' : status === 'active' ? 'bg-blue-500 text-white' : 'bg-bg-card border border-border text-text-muted'
                    )}>
                      {status === 'completed' ? <Check className="w-5 h-5" /> : n}
                    </div>
                    <span className={cn('text-base font-medium transition-all', status === 'active' ? 'text-text-primary' : status === 'completed' ? 'text-text-muted' : 'text-text-muted')}>{label}</span>
                    {i < arr.length - 1 && <span className="text-text-muted text-xl mx-3">→</span>}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-bg-card border border-border rounded-2xl p-8 shadow-xl">
              <h2 className="text-lg font-bold text-text-primary mb-6 flex items-center gap-3">
                <span className="w-8 h-8 bg-blue-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">1</span>
                {locale === 'en' ? 'Personal Information' : locale === 'de' ? 'Persönliche Angaben' : locale === 'es' ? 'Información Personal' : 'Informations personnelles'}
              </h2>

              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-text-secondary">{locale === 'en' ? 'First Name' : locale === 'de' ? 'Vorname' : locale === 'es' ? 'Nombre' : 'Prénom'} <span className="text-pink-500">*</span></label>
                    <input type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full h-12 px-4 rounded-lg bg-bg-elevated border border-border text-text-primary text-base focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-text-secondary">{locale === 'en' ? 'Last Name' : locale === 'de' ? 'Nachname' : locale === 'es' ? 'Apellido' : 'Nom'} <span className="text-pink-500">*</span></label>
                    <input type="text" required value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full h-12 px-4 rounded-lg bg-bg-elevated border border-border text-text-primary text-base focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all" />
                  </div>
                </div>

                <div className="h-px bg-border" />

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-text-secondary">{locale === 'en' ? 'Email Address' : locale === 'de' ? 'E-Mail' : locale === 'es' ? 'Correo electrónico' : 'Adresse e-mail'} <span className="text-pink-500">*</span></label>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full h-12 px-4 rounded-lg bg-bg-elevated border border-border text-text-primary text-base focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all" />
                  <p className="text-xs text-text-muted">{locale === 'en' ? 'Your access credentials will be sent here.' : locale === 'de' ? 'Ihre Zugangsdaten werden hier gesendet.' : locale === 'es' ? 'Tus credenciales serán enviadas aquí.' : 'Vos identifiants de connexion y seront envoyés.'}</p>
                </div>

                <div className="h-px bg-border" />

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-text-secondary">{locale === 'en' ? 'Confirm Email' : locale === 'de' ? 'E-Mail bestätigen' : locale === 'es' ? 'Confirmar correo' : "Confirmer l'e-mail"} <span className="text-pink-500">*</span></label>
                  <input type="email" required value={confirmEmail} onChange={(e) => setConfirmEmail(e.target.value)} className="w-full h-12 px-4 rounded-lg bg-bg-elevated border border-border text-text-primary text-base focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all" />
                  {confirmEmail && !isEmailMatch && <p className="text-xs text-pink-500 font-medium">{locale === 'en' ? 'Emails do not match' : locale === 'de' ? 'E-Mail-Adressen stimmen nicht überein' : locale === 'es' ? 'Los correos no coinciden' : 'Les adresses e-mail ne correspondent pas'}</p>}
                </div>

                <div className="h-px bg-border" />

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-text-secondary">{locale === 'en' ? 'Phone' : locale === 'de' ? 'Telefon' : locale === 'es' ? 'Teléfono' : 'Téléphone'} <span className="text-text-muted font-normal ml-1">({locale === 'en' ? 'Optional' : locale === 'de' ? 'Optional' : locale === 'es' ? 'Opcional' : 'Optionnel'})</span></label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full h-12 px-4 rounded-lg bg-bg-elevated border border-border text-text-primary text-base focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all" />
                </div>
              </div>
            </div>

            <div className="h-px bg-border my-8" />

            <div className="bg-bg-card border border-border rounded-2xl p-8 shadow-xl">
              <h2 className="text-lg font-bold text-text-primary mb-6 flex items-center gap-3">
                <span className="w-8 h-8 bg-blue-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">2</span>
                {locale === 'en' ? 'Primary Device' : locale === 'de' ? 'Hauptgerät' : locale === 'es' ? 'Dispositivo principal' : 'Appareil principal'}
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {[
                  { type: 'tv',     icon: Tv,      label: 'Smart TV',       sub: 'LG, Samsung…' },
                  { type: 'box',    icon: Box,     label: 'FireStick / Box', sub: 'Mi Box, Fire…' },
                  { type: 'mobile', icon: Laptop,  label: 'Mobile / PC',    sub: 'iOS, Android…' },
                  { type: 'mag',    icon: Monitor, label: 'MAG Box',        sub: 'MAG 250, 322…' },
                ].map((item) => (
                  <button key={item.type} type="button" onClick={() => setDevice(item.type as any)} className={cn('flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all duration-300',
                      device === item.type ? 'border-blue-500 bg-blue-500/10 text-blue-400 shadow-lg shadow-blue-500/10' : 'border-border hover:border-slate-600 text-text-secondary')}>
                    <item.icon className="w-6 h-6 mb-2" />
                    <span className="text-sm font-bold leading-tight">{item.label}</span>
                    <span className="text-xs text-text-muted mt-1">{item.sub}</span>
                  </button>
                ))}
              </div>

              {(device === 'tv' || device === 'mag') && (
                <div className="p-5 bg-bg-elevated border border-border rounded-xl">
                  <label className="block text-sm font-semibold text-text-secondary mb-2 flex items-center justify-between">
                    <span>{locale === 'en' ? 'MAC Address' : locale === 'de' ? 'MAC-Adresse' : locale === 'es' ? 'Dirección MAC' : 'Adresse MAC'}</span>
                    <HelpCircle className="w-4 h-4 text-text-muted" />
                  </label>
                  <input type="text" value={macAddress} onChange={handleMacChange} className="w-full h-12 px-4 rounded-lg bg-bg-card border border-border text-text-primary text-base focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-mono tracking-wider" placeholder="00:1A:79:XX:XX:XX" maxLength={17} />
                  <p className="text-xs text-text-muted mt-2">{locale === 'en' ? '💡 Optional — provide it to receive a pre-activated account.' : locale === 'de' ? '💡 Optional — für ein voraktiviertes Konto.' : locale === 'es' ? '💡 Opcional — para recibir una cuenta preactivada.' : '💡 Optionnel — renseignez-la pour recevoir un compte pré-activé.'}</p>
                </div>
              )}
            </div>

            <div className="h-px bg-border my-8" />

            <div className="bg-bg-card border border-border rounded-2xl p-8 shadow-xl">
              <h2 className="text-lg font-bold text-text-primary mb-6 flex items-center gap-3">
                <span className="w-8 h-8 bg-blue-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">3</span>
                {locale === 'en' ? 'Payment Method' : locale === 'de' ? 'Zahlungsmethode' : locale === 'es' ? 'Método de pago' : 'Mode de paiement'}
              </h2>

              <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 mb-6">
                <PaymentCard icon={MessageCircle} label="WhatsApp" sublabel={locale === 'en' ? 'Instant' : 'Instantané'} selected={paymentMethod === 'whatsapp'} onClick={() => setPaymentMethod('whatsapp')} accentColor="green" />
                <PaymentCard icon={Building}      label={locale === 'en' ? 'Transfer' : locale === 'de' ? 'Überweisung' : locale === 'es' ? 'Transferencia' : 'Virement'} sublabel="IBAN" selected={paymentMethod === 'transfer'} onClick={() => setPaymentMethod('transfer')} accentColor="blue" />
                <PaymentCard icon={CreditCard}    label="Stripe"  sublabel="Bientôt" selected={paymentMethod === 'stripe'}   onClick={() => setPaymentMethod('stripe')}   accentColor="violet" />
                <PaymentCard icon={Wallet}        label="PayPal"  sublabel="Bientôt" selected={paymentMethod === 'paypal'}   onClick={() => setPaymentMethod('paypal')}   accentColor="paypal" />
                <PaymentCard icon={Bitcoin}       label="Crypto"  sublabel="Bientôt" selected={paymentMethod === 'crypto'}   onClick={() => setPaymentMethod('crypto')}   accentColor="orange" />
              </div>

              <div className="h-px bg-border mb-6" />

              {paymentMethod === 'whatsapp' && <WhatsAppPanel locale={locale} />}
              {paymentMethod === 'transfer' && <TransferPanel locale={locale} email={email} />}
              {paymentMethod === 'stripe'   && <StripePanel locale={locale} />}
              {paymentMethod === 'paypal'   && <PayPalPanel locale={locale} />}
              {paymentMethod === 'crypto'   && <CryptoPanel locale={locale} />}
            </div>

            <div className="h-px bg-border my-8" />

            <div className="bg-bg-card border border-border rounded-2xl p-8 shadow-xl">
              {!showPromoInput && !promoApplied ? (
                <button type="button" onClick={() => setShowPromoInput(true)} className="text-sm font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-2 transition-colors">
                  <Percent className="w-4 h-4" /> {locale === 'en' ? 'Add promo code' : locale === 'de' ? 'Rabattcode hinzufügen' : locale === 'es' ? 'Agregar código promo' : 'Ajouter un code promo'}
                </button>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-text-primary">{locale === 'en' ? 'Promo Code' : locale === 'de' ? 'Promo-Code' : locale === 'es' ? 'Código promocional' : 'Code promo'}</h3>
                  {promoApplied ? (
                    <div className="flex items-center justify-between bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-xl text-sm font-medium">
                      <span className="flex items-center gap-2"><Check className="w-4 h-4" /> {promoApplied} — {discountPercent}% {locale === 'en' ? 'off' : locale === 'de' ? 'Rabatt' : locale === 'es' ? 'dto.' : 'de réduction'}</span>
                      <button type="button" onClick={handleRemovePromo} className="text-xs text-pink-400 hover:underline font-bold">{locale === 'en' ? 'Remove' : locale === 'de' ? 'Entfernen' : locale === 'es' ? 'Eliminar' : 'Retirer'}</button>
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <input type="text" value={promoInput} onChange={(e) => { setPromoInput(e.target.value); setPromoError(''); }} className="flex-1 h-12 px-4 rounded-lg bg-bg-elevated border border-border text-text-primary text-sm focus:outline-none focus:border-blue-500 uppercase" placeholder="GOLD20 · VIP10" />
                      <button type="button" onClick={handleApplyPromo} className="px-6 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition-colors h-12">{locale === 'en' ? 'Apply' : locale === 'de' ? 'Anwenden' : locale === 'es' ? 'Aplicar' : 'Appliquer'}</button>
                    </div>
                  )}
                  {promoError && <p className="text-xs text-pink-500 font-semibold">⚠️ {promoError}</p>}
                  {!promoApplied && (
                    <button type="button" onClick={() => { setShowPromoInput(false); setPromoError(''); }} className="text-xs text-text-muted hover:underline">{locale === 'en' ? 'Cancel' : locale === 'de' ? 'Abbrechen' : locale === 'es' ? 'Cancelar' : 'Annuler'}</button>
                  )}
                </div>
              )}
            </div>

            <div className="block lg:hidden">
              <button type="submit" disabled={!canSubmit || isSubmitting} className={cn('w-full h-20 rounded-xl text-text-primary font-bold text-2xl shadow-lg transition-all flex items-center justify-center gap-3 disabled:cursor-not-allowed',
                  canSubmit && !isSubmitting ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-blue-500/30 hover:shadow-lg' : 'bg-bg-base text-text-muted')}>
                {isSubmitting ? <><Loader2 className="w-6 h-6 animate-spin" /> {locale === 'en' ? 'Processing…' : locale === 'de' ? 'Verarbeitung…' : locale === 'es' ? 'Procesando…' : 'Traitement…'}</> : <><Lock className="w-6 h-6" /> {locale === 'en' ? 'Confirm Order' : locale === 'de' ? 'Bestellen' : locale === 'es' ? 'Confirmar pedido' : 'Confirmer la commande'}</>}
              </button>
            </div>
          </form>

          <aside className="lg:col-span-5 lg:sticky lg:top-24">
            <div className="lg:hidden mb-4">
              <button type="button" onClick={() => setShowSummaryMobile(!showSummaryMobile)} className="w-full flex items-center justify-between bg-bg-base border border-border rounded-xl px-4 py-3">
                <span className="text-xl font-semibold text-text-primary">{locale === 'en' ? 'Order Summary' : locale === 'de' ? 'Bestellübersicht' : locale === 'es' ? 'Resumen del pedido' : 'Résumé de commande'}</span>
                {showSummaryMobile ? <ChevronUp className="w-5 h-5 text-text-muted" /> : <ChevronDown className="w-5 h-5 text-text-muted" />}
              </button>
              {showSummaryMobile && (
                <div className="bg-bg-base border-x border-b border-border rounded-b-xl p-4 overflow-hidden">
                  <OrderSummary {...summaryProps} />
                </div>
              )}
            </div>

            <div className="hidden lg:block bg-bg-base border border-border rounded-2xl p-6 shadow-xl space-y-5">
              <OrderSummary {...summaryProps} />

              <button type="submit" onClick={handleSubmit} disabled={!canSubmit || isSubmitting} className={cn('w-full h-20 rounded-xl text-text-primary font-bold text-2xl shadow-lg transition-all flex items-center justify-center gap-3 disabled:cursor-not-allowed',
                  canSubmit && !isSubmitting ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-blue-500/30 hover:shadow-lg' : 'bg-bg-base text-text-muted')}>
                {isSubmitting ? <><Loader2 className="w-6 h-6 animate-spin" /> {locale === 'en' ? 'Processing…' : locale === 'de' ? 'Verarbeitung…' : locale === 'es' ? 'Procesando…' : 'Traitement…'}</> : <><Lock className="w-6 h-6" /> {locale === 'en' ? 'Confirm my order' : locale === 'de' ? 'Bestellung bestätigen' : locale === 'es' ? 'Confirmar mi pedido' : 'Confirmer ma commande'}</>}
              </button>

              <div className="flex items-center justify-center gap-4 border-t border-border pt-4">
                <span className="text-[10px] text-text-muted font-bold tracking-wide uppercase flex items-center gap-1"><Lock className="w-3 h-3 text-green-500" /> SSL {locale === 'en' ? 'Secure' : locale === 'de' ? 'Sicher' : locale === 'es' ? 'Seguro' : 'Sécurisé'}</span>
                <span className="text-[10px] text-text-muted font-bold tracking-wide uppercase flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-green-500" /> {locale === 'en' ? '7-Day Guarantee' : locale === 'de' ? '7-Tage-Garantie' : locale === 'es' ? 'Garantía 7 días' : 'Garantie 7 jours'}</span>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <footer className="max-w-[1200px] mx-auto px-6 md:px-10 pt-12 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-text-muted pb-8">
        <div className="flex items-center gap-4 flex-wrap justify-center">
          <Link href={getLocalizedPath('/legal/cgu', locale)} className="hover:text-text-primary transition-colors">{t('footer.legal.cgu')}</Link>
          <span>•</span>
          <Link href={getLocalizedPath('/legal/politique-confidentialite', locale)} className="hover:text-text-primary transition-colors">{t('footer.legal.privacy')}</Link>
          <span>•</span>
          <Link href={getLocalizedPath('/legal/remboursement', locale)} className="hover:text-text-primary transition-colors">{t('footer.legal.refund')}</Link>
        </div>
        <div className="flex items-center gap-2">
          <Lock className="w-3 h-3 text-green-500" />
          <span>{locale === 'en' ? `SSL encrypted secure payment. © ${new Date().getFullYear()} RegardezIPTV` : locale === 'de' ? `SSL-verschlüsselte Zahlung. © ${new Date().getFullYear()} RegardezIPTV` : locale === 'es' ? `Pago seguro cifrado SSL. © ${new Date().getFullYear()} RegardezIPTV` : `Paiement sécurisé SSL. © ${new Date().getFullYear()} RegardezIPTV`}</span>
        </div>
      </footer>
    </div>
  );
}
