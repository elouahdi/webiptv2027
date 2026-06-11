'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { getAllPlansSync } from '@/lib/data/plans';
import type { PricingPlan } from '@/lib/cms/settings-storage';
import { cn } from '@/lib/utils/cn';
import { 
  CreditCard, 
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
  LockKeyhole
} from 'lucide-react';
import Link from 'next/link';
import { PublicThemeSwitcher } from '@/components/ui/PublicThemeSwitcher';
import { useTranslation } from '@/hooks/useTranslation';
import { getLocalizedPath } from '@/lib/i18n';

const packMapping: Record<string, string> = {
  '1mois': '1-mois',
  '3mois': '3-mois',
  '6mois': '6-mois',
  '12mois': '12-mois',
  '24mois': '24-mois'
};

const slugToPackKey: Record<string, string> = {
  '1-mois': '1mois',
  '3-mois': '3mois',
  '6-mois': '6mois',
  '12-mois': '12mois',
  '24-mois': '24mois',
  'essai-3h': '12mois',
};

const defaultPrices: Record<string, number> = {
  '1mois': 17.99,
  '3mois': 26.99,
  '6mois': 36.99,
  '12mois': 46.99,
  '24mois': 89.99
};

export default function CheckoutForm({ pricing }: { pricing: PricingPlan[] | null }) {
  const searchParams = useSearchParams();
  const { t, locale } = useTranslation();

  const packParam = searchParams.get('pack');
  const planParam = searchParams.get('plan');
  const prixParam = searchParams.get('prix');

  let packKey = '12mois';
  if (packParam && packMapping[packParam]) {
    packKey = packParam;
  } else if (planParam && slugToPackKey[planParam]) {
    packKey = slugToPackKey[planParam];
  }

  const planSlug = packMapping[packKey];
  const basePlan = useMemo(() => {
    if (pricing) {
      const fromSettings = pricing.find((p) => p.slug === planSlug);
      if (fromSettings) return fromSettings;
    }
    return getAllPlansSync().find((p) => p.slug === planSlug) || null;
  }, [pricing, planSlug]);
  const basePrice = prixParam ? parseFloat(prixParam) : (basePlan?.price ?? defaultPrices[packKey] ?? 46.99);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [device, setDevice] = useState<'tv' | 'box' | 'mobile' | 'mag' | ''>('');
  const [macAddress, setMacAddress] = useState('');
  
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [saveCard, setSaveCard] = useState(false);

  const [showPromoInput, setShowPromoInput] = useState(false);
  const [promoInput, setPromoInput] = useState('');
  const [promoApplied, setPromoApplied] = useState<'GOLD20' | 'VIP10' | null>(null);
  const [promoError, setPromoError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleMacChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const formatted = value.replace(/(.{2})/g, '$1:').replace(/:$/, '');
    setMacAddress(formatted.slice(0, 17));
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/[^0-9]/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    if (groups) {
      setCardNumber(groups.join(' ').slice(0, 19));
    } else {
      setCardNumber(cleaned);
    }
  };

  const getCardBrand = () => {
    const cleaned = cardNumber.replace(/\s+/g, '');
    if (cleaned.startsWith('4')) return 'visa';
    if (/^(5[1-5]|222[1-9]|22[3-9]|2[3-6]|27[0-1]|2720)/.test(cleaned)) return 'mastercard';
    return 'unknown';
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/[^0-9]/g, '');
    if (val.length > 2) {
      val = val.slice(0, 2) + '/' + val.slice(2, 4);
    }
    setCardExpiry(val.slice(0, 5));
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardCvc(e.target.value.replace(/[^0-9]/g, '').slice(0, 3));
  };

  const handleApplyPromo = () => {
    setPromoError('');
    const code = promoInput.trim().toUpperCase();
    if (code === 'GOLD20') {
      setPromoApplied('GOLD20');
      setPromoInput('');
    } else if (code === 'VIP10') {
      setPromoApplied('VIP10');
      setPromoInput('');
    } else {
      setPromoError(locale === 'en' ? 'Invalid promo code' : locale === 'de' ? 'Ungültiger Promo-Code' : locale === 'es' ? 'Código de promoción inválido' : 'Code promo invalide');
    }
  };

  const handleRemovePromo = () => {
    setPromoApplied(null);
    setPromoError('');
  };

  const discountPercent = promoApplied === 'GOLD20' ? 20 : promoApplied === 'VIP10' ? 10 : 0;
  const discountAmount = (basePrice * discountPercent) / 100;
  const totalPrice = basePrice - discountAmount;

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isEmailMatch = email.trim().toLowerCase() === confirmEmail.trim().toLowerCase() && email.trim() !== '';
  const isCardValid = cardNumber.replace(/\s/g, '').length === 16;
  const [expiryMonth] = cardExpiry.split('/');
  const isExpiryValid = cardExpiry.length === 5 && 
                        parseInt(expiryMonth, 10) >= 1 && 
                        parseInt(expiryMonth, 10) <= 12;
  const isCvcValid = cardCvc.length === 3;

  const isFormValid = 
    firstName.trim() !== '' &&
    lastName.trim() !== '' &&
    isEmailValid &&
    isEmailMatch &&
    device !== '' &&
    isCardValid &&
    isExpiryValid &&
    isCvcValid;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center p-[24px]">
        <div className="max-w-md w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-[20px] p-[32px] text-center shadow-lg">
          <div className="w-[64px] h-[64px] bg-[#059669]/10 text-[#059669] dark:text-[#00FF7F] rounded-full flex items-center justify-center mx-auto mb-[24px]">
            <CheckCircle className="w-[36px] h-[36px]" />
          </div>
          <h1 className="font-syne font-bold text-[24px] text-text-primary mb-[16px]">
            {locale === 'en' ? 'Order Successful' : locale === 'de' ? 'Bestellung erfolgreich' : locale === 'es' ? 'Pedido Exitoso' : 'Commande réussie'}
          </h1>
          <p className="text-text-secondary text-[14px] leading-relaxed mb-[24px]">
            {t('checkout.payment.success')}
          </p>
          <Link
            href={getLocalizedPath('/', locale)}
            className="inline-flex justify-center items-center w-full h-[48px] bg-gradient-to-r from-brand-from to-brand-to text-white font-bold rounded-[12px] hover:opacity-95 transition-opacity text-sm shadow-md"
          >
            {locale === 'en' ? 'Back to Home' : locale === 'de' ? 'Zurück zur Startseite' : locale === 'es' ? 'Volver al inicio' : "Retour à l'accueil"}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-base)] transition-colors duration-[300ms] font-sans antialiased text-text-primary pb-[64px]">
      <header className="w-full bg-[var(--bg-card)] border-b border-[var(--border)] sticky top-0 z-40 transition-colors duration-[300ms]">
        <div className="max-w-[1200px] mx-auto px-[24px] md:px-[40px] h-[80px] flex items-center justify-between">
          <Link href={getLocalizedPath('/', locale)} className="flex items-center gap-[12px] group">
            <div className="w-[32px] h-[32px] bg-gradient-to-br from-[#00F3FF] to-[#FF00E5] rounded-[12px] flex items-center justify-center shadow-lg shadow-[#00F3FF]/15 group-hover:scale-105 transition-transform duration-[300ms] relative overflow-hidden">
              <span className="text-white font-bold text-[16px] relative z-10">R</span>
            </div>
            <span className="font-syne font-bold text-[18px] text-text-primary tracking-tight group-hover:text-[var(--brand-from)] transition-colors duration-[300ms]">
              RegardezIPTV
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-[16px] text-[12px] font-semibold">
            <span className="flex items-center gap-[4px] text-[#059669] dark:text-[#00FF7F]">
              <CheckCircle className="w-[16px] h-[16px]" /> {locale === 'en' ? 'Cart' : locale === 'de' ? 'Warenkorb' : locale === 'es' ? 'Carrito' : 'Panier'}
            </span>
            <span className="text-text-muted">➔</span>
            <span className="flex items-center gap-[6px] text-[#00D4FF] font-bold">
              <span className="w-[20px] h-[20px] bg-[#00D4FF] text-white flex items-center justify-center rounded-full text-[10px]">2</span> 
              {t('checkout.steps.payment')}
            </span>
            <span className="text-text-muted">➔</span>
            <span className="flex items-center gap-[6px] text-text-muted">
              <span className="w-[20px] h-[20px] bg-[var(--bg-elevated)] border border-[var(--border)] text-text-muted flex items-center justify-center rounded-full text-[10px]">3</span> 
              {locale === 'en' ? 'Confirmation' : locale === 'de' ? 'Bestätigung' : locale === 'es' ? 'Confirmación' : 'Confirmation'}
            </span>
          </div>

          <div className="flex items-center gap-[16px]">
            <span className="hidden lg:flex items-center gap-[4px] text-[12px] text-text-secondary font-medium bg-[var(--bg-elevated)] px-[12px] py-[6px] rounded-full border border-[var(--border)]">
              <LockKeyhole className="w-[14px] h-[14px] text-[#059669] dark:text-[#00FF7F]" /> SSL 256-bit
            </span>
            <PublicThemeSwitcher />
          </div>
        </div>
      </header>

      <div className="md:hidden w-full bg-[var(--bg-card)] border-b border-[var(--border)] px-[16px] py-[12px] flex items-center justify-between text-[12px] font-semibold">
        <span className="flex items-center gap-[4px] text-[#059669] dark:text-[#00FF7F]">
          <CheckCircle className="w-[14px] h-[14px]" /> {locale === 'en' ? 'Cart' : locale === 'de' ? 'Warenkorb' : locale === 'es' ? 'Carrito' : 'Panier'}
        </span>
        <span className="text-[#00D4FF] font-bold">
          ➔ {t('checkout.steps.payment')}
        </span>
        <span className="text-text-muted">
          ➔ {locale === 'en' ? 'Confirmation' : locale === 'de' ? 'Bestätigung' : locale === 'es' ? 'Confirmación' : 'Confirmation'}
        </span>
      </div>

      <main className="max-w-[1200px] mx-auto px-[24px] md:px-[40px] mt-[32px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[32px] items-start">
          <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-[24px]">
            
            {/* SECTION 1: Personal Info */}
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[16px] p-[24px] shadow-sm transition-colors duration-[300ms]">
              <h2 className="text-[18px] font-bold text-text-primary mb-[16px] flex items-center gap-[8px] border-b border-[var(--border)] pb-[12px]">
                <span className="w-[24px] h-[24px] bg-[#00D4FF]/10 text-[#00D4FF] rounded-[8px] flex items-center justify-center text-[12px] font-bold">1</span>
                {locale === 'en' ? 'Personal Information' : locale === 'de' ? 'Persönliche Angaben' : locale === 'es' ? 'Información Personal' : 'Vos informations personnelles'}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]">
                <div>
                  <label htmlFor="firstname" className="block text-[12px] font-semibold text-text-secondary mb-[6px]">
                    {t('checkout.form.firstname')} <span className="text-[#FF00E5]">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstname"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full h-[44px] px-[14px] rounded-[12px] bg-[var(--bg-elevated)] border border-[var(--border)] text-text-primary text-[14px] focus:outline-none focus:border-[#00D4FF] transition-all duration-200"
                    placeholder={locale === 'en' ? 'John' : locale === 'de' ? 'Max' : locale === 'es' ? 'Juan' : 'Jean'}
                  />
                </div>

                <div>
                  <label htmlFor="lastname" className="block text-[12px] font-semibold text-text-secondary mb-[6px]">
                    {t('checkout.form.lastname')} <span className="text-[#FF00E5]">*</span>
                  </label>
                  <input
                    type="text"
                    id="lastname"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full h-[44px] px-[14px] rounded-[12px] bg-[var(--bg-elevated)] border border-[var(--border)] text-text-primary text-[14px] focus:outline-none focus:border-[#00D4FF] transition-all duration-200"
                    placeholder={locale === 'en' ? 'Doe' : locale === 'de' ? 'Mustermann' : locale === 'es' ? 'Pérez' : 'Dupont'}
                  />
                </div>
              </div>

              <div className="mt-[16px]">
                <label htmlFor="email" className="block text-[12px] font-semibold text-text-secondary mb-[6px]">
                  {t('checkout.form.email')} <span className="text-[#FF00E5]">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={cn(
                    "w-full h-[44px] px-[14px] rounded-[12px] bg-[var(--bg-elevated)] border text-text-primary text-[14px] focus:outline-none focus:border-[#00D4FF] transition-all duration-200",
                    email && !isEmailValid ? "border-[#FF00E5]/50 focus:border-[#FF00E5]" : "border-[var(--border)]"
                  )}
                  placeholder={t('checkout.form.email_placeholder')}
                />
                <p className="text-[11px] text-text-muted mt-[6px] italic font-medium">
                  {t('checkout.form.email_desc')}
                </p>
              </div>

              <div className="mt-[16px]">
                <label htmlFor="confirmEmail" className="block text-[12px] font-semibold text-text-secondary mb-[6px]">
                  {locale === 'en' ? 'Confirm Email Address' : locale === 'de' ? 'E-Mail-Adresse bestätigen' : locale === 'es' ? 'Confirmar Correo Electrónico' : "Confirmer l'adresse email"} <span className="text-[#FF00E5]">*</span>
                </label>
                <input
                  type="email"
                  id="confirmEmail"
                  required
                  value={confirmEmail}
                  onChange={(e) => setConfirmEmail(e.target.value)}
                  className={cn(
                    "w-full h-[44px] px-[14px] rounded-[12px] bg-[var(--bg-elevated)] border text-text-primary text-[14px] focus:outline-none focus:border-[#00D4FF] transition-all duration-200",
                    confirmEmail && !isEmailMatch ? "border-[#FF00E5]/50 focus:border-[#FF00E5]" : "border-[var(--border)]"
                  )}
                  placeholder={t('checkout.form.email_placeholder')}
                />
                {confirmEmail && !isEmailMatch && (
                  <p className="text-[11px] text-[#FF00E5] mt-[4px] font-medium">
                    {locale === 'en' ? 'Emails do not match' : locale === 'de' ? 'E-Mail-Adressen stimmen nicht überein' : locale === 'es' ? 'Los correos no coinciden' : 'Les adresses email ne correspondent pas.'}
                  </p>
                )}
              </div>

              <div className="mt-[16px]">
                <label htmlFor="phone" className="block text-[12px] font-semibold text-text-secondary mb-[6px]">
                  {locale === 'en' ? 'Phone' : locale === 'de' ? 'Telefonnummer' : locale === 'es' ? 'Teléfono' : 'Téléphone'} <span className="text-text-muted font-normal">({locale === 'en' ? 'Optional' : locale === 'de' ? 'Optional' : locale === 'es' ? 'Opcional' : 'Optionnel'})</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-[44px] px-[14px] rounded-[12px] bg-[var(--bg-elevated)] border border-[var(--border)] text-text-primary text-[14px] focus:outline-none focus:border-[#00D4FF] transition-all duration-200"
                  placeholder="+33 6 12 34 56 78"
                />
              </div>
            </div>

            {/* SECTION 2: Main Device */}
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[16px] p-[24px] shadow-sm transition-colors duration-[300ms]">
              <h2 className="text-[18px] font-bold text-text-primary mb-[16px] flex items-center gap-[8px] border-b border-[var(--border)] pb-[12px]">
                <span className="w-[24px] h-[24px] bg-[#00D4FF]/10 text-[#00D4FF] rounded-[8px] flex items-center justify-center text-[12px] font-bold">2</span>
                {t('checkout.form.device')}
              </h2>

              <p className="text-[12px] text-text-secondary mb-[16px]">
                {locale === 'en' ? 'Select your primary device type:' : locale === 'de' ? 'Wählen Sie Ihren Hauptgerätetyp:' : locale === 'es' ? 'Seleccione su tipo de dispositivo principal:' : "Sélectionnez le type d'appareil sur lequel vous utiliserez principalement votre abonnement :"}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-[12px]">
                <button
                  type="button"
                  onClick={() => setDevice('tv')}
                  className={cn(
                    "flex flex-col items-center justify-center p-[12px] rounded-[12px] border text-center transition-all duration-200",
                    device === 'tv' 
                      ? "border-[#00D4FF] bg-[#00D4FF]/5 text-[#00D4FF] font-semibold ring-1 ring-[#00D4FF]/35" 
                      : "border-[var(--border)] hover:border-border-active bg-transparent text-text-secondary"
                  )}
                >
                  <Tv className="w-[24px] h-[24px] mb-[8px]" />
                  <span className="text-[11px] leading-tight font-semibold">Smart TV</span>
                  <span className="text-[9px] text-text-muted mt-[2px] leading-none">LG, Samsung, Sony...</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDevice('box')}
                  className={cn(
                    "flex flex-col items-center justify-center p-[12px] rounded-[12px] border text-center transition-all duration-200",
                    device === 'box' 
                      ? "border-[#00D4FF] bg-[#00D4FF]/5 text-[#00D4FF] font-semibold ring-1 ring-[#00D4FF]/35" 
                      : "border-[var(--border)] hover:border-border-active bg-transparent text-text-secondary"
                  )}
                >
                  <Box className="w-[24px] h-[24px] mb-[8px]" />
                  <span className="text-[11px] leading-tight font-semibold">FireStick / Box</span>
                  <span className="text-[9px] text-text-muted mt-[2px] leading-none">Mi Box, Firestick...</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDevice('mobile')}
                  className={cn(
                    "flex flex-col items-center justify-center p-[12px] rounded-[12px] border text-center transition-all duration-200",
                    device === 'mobile' 
                      ? "border-[#00D4FF] bg-[#00D4FF]/5 text-[#00D4FF] font-semibold ring-1 ring-[#00D4FF]/35" 
                      : "border-[var(--border)] hover:border-border-active bg-transparent text-text-secondary"
                  )}
                >
                  <Laptop className="w-[24px] h-[24px] mb-[8px]" />
                  <span className="text-[11px] leading-tight font-semibold">Mobile / PC</span>
                  <span className="text-[9px] text-text-muted mt-[2px] leading-none">iOS, Android, Mac...</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDevice('mag')}
                  className={cn(
                    "flex flex-col items-center justify-center p-[12px] rounded-[12px] border text-center transition-all duration-200",
                    device === 'mag' 
                      ? "border-[#00D4FF] bg-[#00D4FF]/5 text-[#00D4FF] font-semibold ring-1 ring-[#00D4FF]/35" 
                      : "border-[var(--border)] hover:border-border-active bg-transparent text-text-secondary"
                  )}
                >
                  <Monitor className="w-[24px] h-[24px] mb-[8px]" />
                  <span className="text-[11px] leading-tight font-semibold">MAG Box</span>
                  <span className="text-[9px] text-text-muted mt-[2px] leading-none">MAG 250, 322...</span>
                </button>
              </div>

              {(device === 'tv' || device === 'mag') && (
                <div className="mt-[16px] p-[16px] bg-[var(--bg-base)] border border-[var(--border)] rounded-[12px] animate-in fade-in duration-200">
                  <label htmlFor="mac" className="block text-[12px] font-semibold text-text-secondary mb-[6px] flex items-center justify-between">
                    <span>{t('checkout.form.mac')}</span>
                    <span title="Example: 00:1A:79:AB:CD:EF" className="cursor-help text-text-muted hover:text-text-primary">
                      <HelpCircle className="w-[14px] h-[14px]" />
                    </span>
                  </label>
                  <input
                    type="text"
                    id="mac"
                    value={macAddress}
                    onChange={handleMacChange}
                    className="w-full h-[44px] px-[14px] rounded-[12px] bg-[var(--bg-card)] border border-[var(--border)] text-text-primary text-[14px] focus:outline-none focus:border-[#00D4FF] transition-all duration-200 font-mono tracking-wider"
                    placeholder="00:1A:79:XX:XX:XX"
                    maxLength={17}
                  />
                  <p className="text-[10px] text-text-secondary mt-[6px] leading-relaxed">
                    {locale === 'en' 
                      ? '💡 If you know your MAC address (from Smartone, NetIPTV, IBOP, etc.), type it here to receive a pre-activated account.' 
                      : locale === 'de' 
                        ? '💡 Wenn Sie Ihre MAC-Adresse kennen (von Smartone, NetIPTV, IBOP usw.), geben Sie sie hier ein, um Ihr Paket voraktiviert zu erhalten.' 
                        : locale === 'es' 
                          ? '💡 Si conoce su dirección MAC (de Smartone, NetIPTV, IBOP, etc.), ingrésela para recibir su cuenta preactivada.' 
                          : '💡 Si vous connaissez votre adresse MAC (visible dans votre application IPTV comme Smartone, NetIPTV, IBOP, etc.), saisissez-la pour recevoir votre abonnement pré-activé.'}
                  </p>
                </div>
              )}
            </div>

            {/* SECTION 3: Payment Details */}
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[16px] p-[24px] shadow-sm transition-colors duration-[300ms]">
              <h2 className="text-[18px] font-bold text-text-primary mb-[16px] flex items-center gap-[8px] border-b border-[var(--border)] pb-[12px]">
                <span className="w-[24px] h-[24px] bg-[#00D4FF]/10 text-[#00D4FF] rounded-[8px] flex items-center justify-center text-[12px] font-bold">3</span>
                {t('checkout.payment.title')}
              </h2>

              <div className="space-y-[16px]">
                <div>
                  <label htmlFor="cardnumber" className="block text-[12px] font-semibold text-text-secondary mb-[6px]">
                    {locale === 'en' ? 'Card number' : locale === 'de' ? 'Kartennummer' : locale === 'es' ? 'Número de tarjeta' : 'Numéro de carte'} <span className="text-[#FF00E5]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="cardnumber"
                      required
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      className="w-full h-[44px] pl-[40px] pr-[48px] rounded-[12px] bg-[var(--bg-elevated)] border border-[var(--border)] text-text-primary text-[14px] font-mono tracking-widest focus:outline-none focus:border-[#00D4FF] transition-all duration-200"
                      placeholder="4242 4242 4242 4242"
                      maxLength={19}
                    />
                    <div className="absolute left-[14px] top-1/2 -translate-y-1/2 text-text-muted">
                      <CreditCard className="w-[18px] h-[18px]" />
                    </div>
                    <div className="absolute right-[12px] top-1/2 -translate-y-1/2 flex items-center gap-[6px]">
                      {getCardBrand() === 'visa' && (
                        <span className="bg-[#1A3B8B] text-white px-[8px] py-[2px] rounded text-[10px] font-bold tracking-wider uppercase border border-[#1A3B8B]">
                          Visa
                        </span>
                      )}
                      {getCardBrand() === 'mastercard' && (
                        <span className="bg-[#EB001B] text-white px-[8px] py-[2px] rounded text-[10px] font-bold tracking-wider uppercase border border-[#EB001B]">
                          MC
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-[16px]">
                  <div>
                    <label htmlFor="expiry" className="block text-[12px] font-semibold text-text-secondary mb-[6px]">
                      {locale === 'en' ? 'Expiry date' : locale === 'de' ? 'Ablaufdatum' : locale === 'es' ? 'Fecha de caducidad' : "Date d'expiration"} <span className="text-[#FF00E5]">*</span>
                    </label>
                    <input
                      type="text"
                      id="expiry"
                      required
                      value={cardExpiry}
                      onChange={handleExpiryChange}
                      className="w-full h-[44px] px-[14px] rounded-[12px] bg-[var(--bg-elevated)] border border-[var(--border)] text-text-primary text-[14px] font-mono tracking-widest focus:outline-none focus:border-[#00D4FF] transition-all duration-200"
                      placeholder="MM/AA"
                      maxLength={5}
                    />
                  </div>

                  <div>
                    <label htmlFor="cvc" className="block text-[12px] font-semibold text-text-secondary mb-[6px] flex items-center justify-between">
                      <span>{locale === 'en' ? 'CVC Code' : locale === 'de' ? 'CVC-Code' : locale === 'es' ? 'Código CVC' : 'Code CVC'} <span className="text-[#FF00E5]">*</span></span>
                    </label>
                    <input
                      type="password"
                      id="cvc"
                      required
                      value={cardCvc}
                      onChange={handleCvcChange}
                      className="w-full h-[44px] px-[14px] rounded-[12px] bg-[var(--bg-elevated)] border border-[var(--border)] text-text-primary text-[14px] font-mono tracking-widest focus:outline-none focus:border-[#00D4FF] transition-all duration-200"
                      placeholder="•••"
                      maxLength={3}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-[10px] mt-[8px]">
                  <input
                    type="checkbox"
                    id="savecard"
                    checked={saveCard}
                    onChange={(e) => setSaveCard(e.target.checked)}
                    className="w-[16px] h-[16px] rounded border-[var(--border)] text-[#00D4FF] focus:ring-[#00D4FF]/40 cursor-pointer"
                  />
                  <label htmlFor="savecard" className="text-[12px] text-text-secondary select-none cursor-pointer">
                    {locale === 'en' ? 'Save this card for future purchases' : locale === 'de' ? 'Diese Karte für zukünftige Einkäufe speichern' : locale === 'es' ? 'Guardar esta tarjeta para compras futuras' : 'Enregistrer cette carte pour de futurs achats'}
                  </label>
                </div>
              </div>

              <div className="mt-[20px] p-[14px] rounded-[12px] border border-[var(--border)] bg-[var(--bg-elevated)]/60 flex items-start gap-[12px]">
                <ShieldCheck className="w-[20px] h-[20px] text-[#059669] dark:text-[#00FF7F] shrink-0 mt-[2px]" />
                <div className="text-[11px] text-text-secondary leading-relaxed">
                  <span className="font-bold text-text-primary">{locale === 'en' ? '100% Secured and simulated checkout.' : locale === 'de' ? '100% Sicherer und simulierter Checkout.' : locale === 'es' ? 'Pago 100% seguro y simulado.' : 'Paiement 100% sécurisé et simulé.'}</span> {t('checkout.payment.desc')}
                </div>
              </div>
            </div>

            {/* SECTION 4: Promo Code */}
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[16px] p-[24px] shadow-sm transition-colors duration-[300ms]">
              {!showPromoInput && !promoApplied ? (
                <button
                  type="button"
                  onClick={() => setShowPromoInput(true)}
                  className="text-[12px] font-semibold text-[#00D4FF] hover:text-[#00B8D9] flex items-center gap-[6px] transition-colors focus:outline-none"
                >
                  <Percent className="w-[14px] h-[14px]" /> {locale === 'en' ? 'Add a promo code' : locale === 'de' ? 'Rabattcode hinzufügen' : locale === 'es' ? 'Agregar código de promoción' : 'Ajouter un code promo'}
                </button>
              ) : (
                <div className="space-y-[12px] animate-in slide-in-from-top-1 duration-200">
                  <h3 className="text-[12px] font-bold text-text-primary">{locale === 'en' ? 'Add promo code' : locale === 'de' ? 'Promo-Code hinzufügen' : locale === 'es' ? 'Agregar código de promoción' : 'Ajouter un code promo'}</h3>
                  {promoApplied ? (
                    <div className="flex items-center justify-between bg-[#059669]/10 border border-[#059669]/25 text-[#059669] dark:text-[#00FF7F] px-[14px] py-[10px] rounded-[12px] text-[12px] font-medium">
                      <span className="flex items-center gap-[6px]">
                        <Check className="w-[16px] h-[16px]" /> Code <strong className="font-bold">{promoApplied}</strong> {locale === 'en' ? 'applied' : locale === 'de' ? 'angewendet' : locale === 'es' ? 'aplicado' : 'appliqué'} ({discountPercent}% {locale === 'en' ? 'discount' : locale === 'de' ? 'Rabatt' : locale === 'es' ? 'de descuento' : 'de réduction'})
                      </span>
                      <button
                        type="button"
                        onClick={handleRemovePromo}
                        className="text-[10px] font-bold text-[#FF00E5] hover:underline"
                      >
                        {locale === 'en' ? 'Remove' : locale === 'de' ? 'Entfernen' : locale === 'es' ? 'Eliminar' : 'Retirer'}
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-[8px]">
                      <input
                        type="text"
                        value={promoInput}
                        onChange={(e) => {
                          setPromoInput(e.target.value);
                          setPromoError('');
                        }}
                        className="flex-1 h-[40px] px-[12px] rounded-[8px] bg-[var(--bg-elevated)] border border-[var(--border)] text-text-primary text-[12px] focus:outline-none focus:border-[#00D4FF] uppercase"
                        placeholder="Ex: GOLD20, VIP10"
                      />
                      <button
                        type="button"
                        onClick={handleApplyPromo}
                        className="px-[16px] bg-[#334155] hover:bg-[#1e293b] dark:bg-[#2A2A3A] dark:hover:bg-[#3f3f5a] text-white text-[12px] font-bold rounded-[8px] transition-colors h-[40px]"
                      >
                        {locale === 'en' ? 'Apply' : locale === 'de' ? 'Anwenden' : locale === 'es' ? 'Aplicar' : 'Appliquer'}
                      </button>
                    </div>
                  )}

                  {promoError && (
                    <p className="text-[11px] text-[#FF00E5] font-semibold flex items-center gap-[4px]">
                      ⚠️ {promoError}
                    </p>
                  )}

                  {!promoApplied && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowPromoInput(false);
                        setPromoError('');
                      }}
                      className="text-[10px] font-semibold text-text-muted hover:underline block"
                    >
                      {locale === 'en' ? 'Cancel' : locale === 'de' ? 'Abbrechen' : locale === 'es' ? 'Cancelar' : 'Annuler'}
                    </button>
                  )}
                </div>
              )}
            </div>
            
            <div className="block lg:hidden">
              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className={cn(
                  "w-full h-[56px] rounded-[16px] text-white font-bold text-[14px] shadow-md transition-all duration-300 flex items-center justify-center gap-[8px]",
                  isFormValid && !isSubmitting
                    ? "bg-gradient-to-r from-[#00D4FF] to-[#FF00E5] hover:opacity-95 hover:scale-[1.01] hover:shadow-lg hover:shadow-[#00D4FF]/15 active:scale-[0.99]"
                    : "bg-[#cbd5e1] dark:bg-[#2a2a35] text-white cursor-not-allowed shadow-none"
                )}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-[20px] h-[20px] animate-spin" /> {t('checkout.form.processing')}
                  </>
                ) : (
                  <>
                    <Lock className="w-[16px] h-[16px]" /> {t('checkout.form.pay_now', { price: totalPrice.toFixed(2) })}
                  </>
                )}
              </button>
            </div>
          </form>

          {/* RIGHT COLUMN: SUMMARY */}
          <aside className="lg:col-span-5 lg:sticky lg:top-[112px]">
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[16px] p-[24px] shadow-sm space-y-[24px] transition-colors duration-[300ms]">
              <h2 className="text-[16px] font-bold text-text-primary border-b border-[var(--border)] pb-[12px]">
                {t('checkout.summary.title')}
              </h2>

              <div className="space-y-[16px]">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-[14px] font-bold text-text-primary">
                      {t('checkout.summary.plan', { name: t(`plans.${planSlug}.name`) || '12 Mois' })}
                    </h3>
                    <p className="text-[11px] text-text-muted mt-[2px] leading-relaxed max-w-[220px]">
                      {basePlan?.subtitle ? `+ ${basePlan.subtitle}` : 'VIP Access'}
                    </p>
                  </div>
                  <span className="text-[14px] font-bold text-text-primary">
                    {basePrice.toFixed(2)} €
                  </span>
                </div>

                {promoApplied && (
                  <div className="flex justify-between items-center text-[12px] font-semibold text-[#059669] dark:text-[#00FF7F]">
                    <span>{locale === 'en' ? 'Discount' : locale === 'de' ? 'Rabatt' : locale === 'es' ? 'Descuento' : 'Réduction'} ({discountPercent}%)</span>
                    <span>-{discountAmount.toFixed(2)} €</span>
                  </div>
                )}

                <div className="flex justify-between items-center text-[12px] text-text-secondary">
                  <span>TVA / Taxes</span>
                  <span className="text-text-muted font-medium">0.00 € ({locale === 'en' ? 'Included' : locale === 'de' ? 'Inklusive' : locale === 'es' ? 'Incluido' : 'Inclus'})</span>
                </div>

                <div className="h-[1px] bg-[var(--border)]" />

                <div className="flex justify-between items-center">
                  <span className="text-[14px] font-bold text-text-primary">{t('checkout.summary.total')}</span>
                  <span className="text-[20px] font-extrabold text-gradient">
                    {totalPrice.toFixed(2)} €
                  </span>
                </div>
              </div>

              <div className="bg-[var(--bg-elevated)] p-[16px] rounded-[12px] space-y-[10px] transition-colors duration-[300ms]">
                <div className="flex items-start gap-[8px] text-[11px] text-text-secondary font-semibold">
                  <Check className="w-[14px] h-[14px] text-[#059669] dark:text-[#00FF7F] mt-[2px] shrink-0" />
                  <span>{t('checkout.summary.setup')}</span>
                </div>
                <div className="flex items-start gap-[8px] text-[11px] text-text-secondary font-semibold">
                  <Check className="w-[14px] h-[14px] text-[#059669] dark:text-[#00FF7F] mt-[2px] shrink-0" />
                  <span>{locale === 'en' ? 'Full access to 45,000+ channels, movies & series in VOD' : locale === 'de' ? 'Voller Zugriff auf über 45.000 Kanäle, Filme & Serien in VOD' : locale === 'es' ? 'Acceso completo a más de 45.000 canales, películas y series en VOD' : 'Accès complet à 45 000+ chaînes, films & séries en VOD'}</span>
                </div>
                <div className="flex items-start gap-[8px] text-[11px] text-text-secondary font-semibold">
                  <Check className="w-[14px] h-[14px] text-[#059669] dark:text-[#00FF7F] mt-[2px] shrink-0" />
                  <span>{t('checkout.summary.servers')}</span>
                </div>
                <div className="flex items-start gap-[8px] text-[11px] text-text-secondary font-semibold">
                  <Check className="w-[14px] h-[14px] text-[#059669] dark:text-[#00FF7F] mt-[2px] shrink-0" />
                  <span>{t('checkout.summary.support')}</span>
                </div>
                <div className="flex items-start gap-[8px] text-[11px] text-text-secondary font-semibold">
                  <Check className="w-[14px] h-[14px] text-[#059669] dark:text-[#00FF7F] mt-[2px] shrink-0" />
                  <span>{t('checkout.summary.guarantee')}</span>
                </div>
              </div>

              <div className="hidden lg:block">
                <button
                  type="submit"
                  disabled={!isFormValid || isSubmitting}
                  className={cn(
                    "w-full h-[48px] rounded-[12px] text-white font-bold text-[12px] shadow-md transition-all duration-300 flex items-center justify-center gap-[8px]",
                    isFormValid && !isSubmitting
                      ? "bg-gradient-to-r from-[#00D4FF] to-[#FF00E5] hover:opacity-95 hover:scale-[1.01] hover:shadow-lg hover:shadow-[#00D4FF]/15 active:scale-[0.99]"
                      : "bg-[#cbd5e1] dark:bg-[#2a2a35] text-white cursor-not-allowed shadow-none"
                  )}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-[16px] h-[16px] animate-spin" /> {t('checkout.form.processing')}
                    </>
                  ) : (
                    <>
                      <Lock className="w-[16px] h-[16px]" /> {t('checkout.form.pay_now', { price: totalPrice.toFixed(2) })}
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center gap-[16px] border-t border-[var(--border)] pt-[16px]">
                <span className="text-[9px] text-text-muted font-bold tracking-wider uppercase">
                  🔒 SSL {locale === 'en' ? 'Secured' : locale === 'de' ? 'Gesichert' : locale === 'es' ? 'Seguro' : 'sécurisé'} 256-bit
                </span>
                <span className="text-[9px] text-text-muted font-bold tracking-wider uppercase">
                  🛡️ {locale === 'en' ? '7-Day Guarantee' : locale === 'de' ? '7-Tage-Garantie' : locale === 'es' ? 'Garantía de 7 días' : 'Garantie 7 jours'}
                </span>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <footer className="max-w-[1200px] mx-auto px-[24px] md:px-[40px] mt-[64px] pt-[32px] border-t border-[var(--border)] flex flex-col md:flex-row justify-between items-center gap-[16px] text-[12px] text-text-muted transition-colors duration-[300ms]">
        <div className="flex items-center gap-[16px]">
          <Link href={getLocalizedPath('/legal/cgu', locale)} className="hover:text-text-primary transition-colors">{t('footer.legal.cgu')}</Link>
          <span>•</span>
          <Link href={getLocalizedPath('/legal/politique-confidentialite', locale)} className="hover:text-text-primary transition-colors">{t('footer.legal.privacy')}</Link>
          <span>•</span>
          <Link href={getLocalizedPath('/legal/remboursement', locale)} className="hover:text-text-primary transition-colors">{t('footer.legal.refund')}</Link>
        </div>
        <div className="flex items-center gap-[6px]">
          <Lock className="w-[14px] h-[14px] text-[#059669] dark:text-[#00FF7F]" />
          <span>
            {locale === 'en' 
              ? `SSL encrypted secure payment. All rights reserved \u00a9 ${new Date().getFullYear()} RegardezIPTV` 
              : locale === 'de' 
                ? `SSL-verschlüsselte sichere Zahlung. Alle Rechte vorbehalten \u00a9 ${new Date().getFullYear()} RegardezIPTV` 
                : locale === 'es' 
                  ? `Pago seguro cifrado SSL. Todos los derechos reservados \u00a9 ${new Date().getFullYear()} RegardezIPTV` 
                  : `Paiement sécurisé crypté SSL. Tous droits réservés \u00a9 ${new Date().getFullYear()} RegardezIPTV`}
          </span>
        </div>
      </footer>
    </div>
  );
}
