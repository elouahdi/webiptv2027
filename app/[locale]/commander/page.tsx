'use client';

import { useState } from 'react';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { WhatsappButton } from '@/components/ui/WhatsappButton';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { CheckCircle, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useTranslation } from '@/hooks/useTranslation';
import { getLocalizedPath } from '@/lib/i18n';

const APPLICATIONS = [
  'IPTV GSE (iOS)',
  'IPTV Smarters Pro',
  'Smart TV',
  'SMART IPTV',
  'NET IPTV',
  'SET IPTV',
  'Mag or STBEMU',
  'TiviMate IPTV',
  'SmartOne IPTV',
  'MYTVOnline',
];

export default function CommanderPage() {
  const { t, locale } = useTranslation();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    application: '',
    macAddress: '',
  });

  const formatMacAddress = (value: string) => {
    const cleaned = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const formatted = cleaned.replace(/(.{2})/g, '$1:').replace(/:$/, '');
    return formatted.slice(0, 17);
  };

  const handleMacAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatMacAddress(e.target.value);
    setFormData({ ...formData, macAddress: formatted });
  };

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = locale === 'en' ? 'First name is required' : locale === 'de' ? 'Vorname ist erforderlich' : locale === 'es' ? 'El nombre es obligatorio' : 'Prénom est requis';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = locale === 'en' ? 'Last name is required' : locale === 'de' ? 'Nachname ist erforderlich' : locale === 'es' ? 'El apellido es obligatorio' : 'Nom est requis';
    }

    if (!formData.email.trim()) {
      newErrors.email = locale === 'en' ? 'Email is required' : locale === 'de' ? 'E-Mail ist erforderlich' : locale === 'es' ? 'El correo es obligatorio' : 'Email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = locale === 'en' ? 'Invalid email' : locale === 'de' ? 'Ungültige E-Mail-Adresse' : locale === 'es' ? 'Correo electrónico no válido' : 'Email invalide';
    }

    if (!formData.application) {
      newErrors.application = locale === 'en' ? 'Application is required' : locale === 'de' ? 'Anwendung ist erforderlich' : locale === 'es' ? 'La aplicación es obligatoria' : 'Application est requise';
    }

    const requiresMac = formData.application && !['IPTV GSE (iOS)', 'IPTV Smarters Pro'].includes(formData.application);
    if (requiresMac && !formData.macAddress.trim()) {
      newErrors.macAddress = locale === 'en' ? 'MAC address is required for this application' : locale === 'de' ? 'MAC-Adresse ist für diese Anwendung erforderlich' : locale === 'es' ? 'La dirección MAC es obligatoria para esta aplicación' : 'Adresse MAC est requise pour cette application';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleWhatsAppSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const message = `Bonjour, je souhaite commander:
📦 Plan: Abonnement 12 Mois + 3 Mois Offerts
💰 Prix: €46.99
👤 Prénom: ${formData.firstName}
👤 Nom: ${formData.lastName}
📧 Email: ${formData.email}
📱 Application: ${formData.application}
📺 Adresse MAC: ${formData.macAddress || 'Non requis'}`;

    const whatsappUrl = `https://api.whatsapp.com/send?phone=212708245223&text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const breadcrumbLabel = locale === 'en' ? 'Order' : locale === 'de' ? 'Bestellen' : locale === 'es' ? 'Comprar' : 'Commander';

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="min-h-screen bg-bg-base pt-32">
        <div className="border-b border-border/40 bg-bg-card">
          <div className="max-w-7xl mx-auto px-[24px] md:px-[40px] py-16">
            <Breadcrumb 
              items={[
                { label: breadcrumbLabel, href: getLocalizedPath('/commander', locale) }
              ]} 
            />
          </div>
        </div>

        <div className="py-80">
          <div className="max-w-7xl mx-auto px-[24px] md:px-[40px]">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-32">
                {/* Left Column - Order Form */}
                <div>
                  <div className="card-glass rounded-2xl p-32">
                    <h2 className="font-syne font-bold text-2xl text-text-primary mb-24">
                      {locale === 'en' ? 'Billing Details' : locale === 'de' ? 'Rechnungsdetails' : locale === 'es' ? 'Detalles de facturación' : 'Détails de facturation'}
                    </h2>

                    <div className="flex flex-col gap-20">
                      {/* Prénom */}
                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-8">
                          {t('checkout.form.firstname')} *
                        </label>
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          className={cn(
                            'w-full px-16 py-12 bg-bg-base border rounded-xl text-text-primary focus:outline-none transition-colors border-border focus:border-brand-from'
                          )}
                          placeholder={t('checkout.form.firstname')}
                        />
                        {errors.firstName && (
                          <p className="text-red-500 text-xs mt-4 font-semibold">{errors.firstName}</p>
                        )}
                      </div>

                      {/* Nom */}
                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-8">
                          {t('checkout.form.lastname')} *
                        </label>
                        <input
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          className={cn(
                            'w-full px-16 py-12 bg-bg-base border rounded-xl text-text-primary focus:outline-none transition-colors border-border focus:border-brand-from'
                          )}
                          placeholder={t('checkout.form.lastname')}
                        />
                        {errors.lastName && (
                          <p className="text-red-500 text-xs mt-4 font-semibold">{errors.lastName}</p>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-8">
                          {t('checkout.form.email')} *
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className={cn(
                            'w-full px-16 py-12 bg-bg-base border rounded-xl text-text-primary focus:outline-none transition-colors border-border focus:border-brand-from'
                          )}
                          placeholder={t('checkout.form.email_placeholder')}
                        />
                        {errors.email && (
                          <p className="text-red-500 text-xs mt-4 font-semibold">{errors.email}</p>
                        )}
                      </div>

                      {/* Application */}
                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-8">
                          {locale === 'en' ? 'Choose your application *' : locale === 'de' ? 'Wählen Sie Ihre Anwendung *' : locale === 'es' ? 'Elija su aplicación *' : 'Choisissez votre application *'}
                        </label>
                        <select
                          value={formData.application}
                          onChange={(e) => setFormData({ ...formData, application: e.target.value })}
                          className={cn(
                            'w-full px-16 py-12 bg-bg-base border rounded-xl text-text-primary focus:outline-none transition-colors border-border focus:border-brand-from'
                          )}
                        >
                          <option value="">{locale === 'en' ? 'Select an application' : locale === 'de' ? 'Wählen Sie eine Anwendung' : locale === 'es' ? 'Seleccione una aplicación' : 'Sélectionnez une application'}</option>
                          {APPLICATIONS.map((app) => (
                            <option key={app} value={app}>
                              {app}
                            </option>
                          ))}
                        </select>
                        {errors.application && (
                          <p className="text-red-500 text-xs mt-4 font-semibold">{errors.application}</p>
                        )}
                      </div>

                      {/* MAC Address */}
                      {formData.application && !['IPTV GSE (iOS)', 'IPTV Smarters Pro'].includes(formData.application) && (
                        <div>
                          <label className="block text-sm font-medium text-text-secondary mb-8">
                            {locale === 'en' ? 'MAC Address *' : locale === 'de' ? 'MAC-Adresse *' : locale === 'es' ? 'Dirección MAC *' : 'Adresse MAC *'}
                          </label>
                          <input
                            type="text"
                            value={formData.macAddress}
                            onChange={handleMacAddressChange}
                            className={cn(
                              'w-full px-16 py-12 bg-bg-base border rounded-xl text-text-primary focus:outline-none transition-colors border-border focus:border-brand-from'
                            )}
                            placeholder="XX:XX:XX:XX:XX:XX"
                          />
                          {errors.macAddress && (
                            <p className="text-red-500 text-xs mt-4 font-semibold">{errors.macAddress}</p>
                          )}
                          <p className="text-text-muted text-xs mt-4">
                            {locale === 'en' ? 'Required for this application' : locale === 'de' ? 'Erforderlich für diese Anwendung' : locale === 'es' ? 'Requerido para esta aplicación' : 'Requis pour cette application'}
                          </p>
                        </div>
                      )}

                      {/* WhatsApp CTA Button */}
                      <button
                        onClick={handleWhatsAppSubmit}
                        className="w-full py-16 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold text-base rounded-xl transition-all duration-300 flex items-center justify-center gap-8 shadow-md shadow-[#25D366]/10 hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <MessageCircle className="w-20 h-20" />
                        {locale === 'en' ? 'Pay via WhatsApp' : locale === 'de' ? 'Per WhatsApp bezahlen' : locale === 'es' ? 'Pagar por WhatsApp' : 'Payer via WhatsApp'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Column - Order Summary */}
                <div>
                  <div className="card-glass rounded-2xl p-24 sticky top-[120px]">
                    <div className="inline-block px-12 py-4 bg-gradient-to-r from-brand-from to-brand-to text-white font-bold text-xs uppercase tracking-wider rounded-full mb-16 shadow-sm shadow-brand-from/10">
                      🎁 {locale === 'en' ? 'LIMITED OFFER' : locale === 'de' ? 'LIMITIERTES ANGEBOT' : locale === 'es' ? 'OFERTA LIMITADA' : 'OFFRE LIMITÉE'}
                    </div>

                    <h3 className="font-syne font-bold text-2xl text-text-primary mb-8 tracking-tight">
                      {t('plans.12-mois.name')}
                    </h3>

                    <div className="mb-16">
                      <span className="inline-block px-12 py-4 bg-gradient-to-r from-brand-from to-brand-to text-white text-xs font-bold rounded-lg uppercase tracking-wider">
                        {t('plans.12-mois.subtitle')}
                      </span>
                    </div>

                    <div className="mb-8">
                      <span className="font-syne font-bold text-40 md:text-48 text-text-primary tracking-tight">
                        €46.99
                      </span>
                    </div>

                    <p className="text-text-secondary text-xs font-medium mb-24">
                      {locale === 'en' ? 'equivalent to 15 months of service for the price of 12' : locale === 'de' ? 'entspricht 15 Monaten Service zum Preis von 12' : locale === 'es' ? 'equivalente a 15 meses de servicio al precio de 12' : 'soit 15 mois de service au prix de 12'}
                    </p>

                    <div className="border-t border-border/40 mb-24"></div>

                    <div className="flex flex-col gap-12 mb-24">
                      {[
                        t('plans.features_list.channels'),
                        t('checkout.summary.setup'),
                        locale === 'en' ? 'Stable servers with 99.9% uptime' : locale === 'de' ? 'Stabile Server mit 99,9% Betriebszeit' : locale === 'es' ? 'Servidores estables con 99.9% de tiempo de actividad' : 'Serveurs stables avec uptime 99.9%',
                        t('plans.features_list.support'),
                        t('plans.features_list.replay'),
                        t('devices.title'),
                        t('checkout.summary.guarantee'),
                      ].map((feature, index) => (
                        <div key={index} className="flex items-center gap-12 text-text-secondary">
                          <CheckCircle className="w-[18px] h-[18px] text-success flex-shrink-0" />
                          <span className="text-sm font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-border/40 mb-24"></div>

                    <div className="flex flex-wrap gap-8">
                      <div className="px-12 py-4 bg-bg-elevated/60 rounded-lg text-[10px] text-text-secondary font-bold border border-border/40">
                        {locale === 'en' ? '🔒 Secure SSL Payment' : locale === 'de' ? '🔒 Sichere SSL-Zahlung' : locale === 'es' ? '🔒 Pago Seguro SSL' : '🔒 Paiement Sécurisé SSL'}
                      </div>
                      <div className="px-12 py-4 bg-bg-elevated/60 rounded-lg text-[10px] text-text-secondary font-bold border border-border/40">
                        {locale === 'en' ? '✅ Immediate Activation' : locale === 'de' ? '✅ Sofortige Aktivierung' : locale === 'es' ? '✅ Activación Inmediata' : '✅ Activation Immédiate'}
                      </div>
                      <div className="px-12 py-4 bg-bg-elevated/60 rounded-lg text-[10px] text-text-secondary font-bold border border-border/40">
                        {locale === 'en' ? '🔄 7-Day Refund' : locale === 'de' ? '🔄 7 Tage Rückerstattung' : locale === 'es' ? '🔄 Reembolso de 7 Días' : '🔄 Remboursement 7J'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsappButton />
    </>
  );
}
