'use client';

import { useState, useEffect } from 'react';
import { Phone, MessageCircle, Mail, MapPin, Clock, ExternalLink } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import { SaveBar, SectionHeader, SettingsSkeleton } from '@/components/admin/settings/SettingsUI';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/admin/ui/Card';
import type { ContactInfo } from '@/lib/cms/settings-storage';

function Field({ label, value, onChange, placeholder, icon: Icon, type = 'text' }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; icon?: React.ElementType; type?: string;
}) {
  return (
    <div>
      <label className="text-xs font-medium text-admin-text-secondary uppercase tracking-wider block mb-1.5">{label}</label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-admin-text-muted" />}
        <input
          type={type}
          className={`w-full bg-admin-input border border-admin-border rounded-xl py-3 text-sm text-admin-text focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-colors ${Icon ? 'pl-10 pr-4' : 'px-4'}`}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}

export default function ContactPage() {
  const { settings, loading, saving, error, success, save } = useSettings();
  const [contact, setContact] = useState<ContactInfo>({
    phone: '', phone2: '', email: '', whatsappUrl: '',
    address: '', businessHours: '',
  });

  useEffect(() => {
    if (settings?.contact) setContact(settings.contact);
  }, [settings]);

  const update = (field: keyof ContactInfo, value: string) =>
    setContact((prev) => ({ ...prev, [field]: value }));

  if (loading) return <div className="space-y-6"><SectionHeader icon={<Phone className="w-5 h-5 text-teal-400" />} title="Contact & Infos" description="Chargement…" /><SettingsSkeleton /></div>;

  const waPhone = contact.whatsappUrl?.match(/phone=(\d+)/)?.[1] ?? '';

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={<Phone className="w-5 h-5 text-teal-400" />}
        title="Contact & Informations Business"
        description="Gérez vos coordonnées, liens WhatsApp, email et horaires affichés sur le site."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Info */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Phone className="w-4 h-4 text-teal-400" />Coordonnées</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            <Field
              label="Téléphone principal"
              value={contact.phone}
              onChange={(v) => update('phone', v)}
              placeholder="+212 708 245 223"
              icon={Phone}
            />
            <Field
              label="Téléphone secondaire (optionnel)"
              value={contact.phone2}
              onChange={(v) => update('phone2', v)}
              placeholder="+33 6 XX XX XX XX"
              icon={Phone}
            />
            <Field
              label="Email"
              value={contact.email}
              onChange={(v) => update('email', v)}
              placeholder="contact@regardeziptv.fr"
              icon={Mail}
              type="email"
            />
            <Field
              label="Adresse"
              value={contact.address}
              onChange={(v) => update('address', v)}
              placeholder="Paris, France"
              icon={MapPin}
            />
            <Field
              label="Horaires d'ouverture"
              value={contact.businessHours}
              onChange={(v) => update('businessHours', v)}
              placeholder="Lun–Dim: 8h00–22h00"
              icon={Clock}
            />
          </CardContent>
        </Card>

        {/* WhatsApp */}
        <div className="space-y-5">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><MessageCircle className="w-4 h-4 text-green-400" />WhatsApp</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Field
                label="URL WhatsApp complète"
                value={contact.whatsappUrl}
                onChange={(v) => update('whatsappUrl', v)}
                placeholder="https://api.whatsapp.com/send?phone=212708245223&text=Bonjour"
                icon={MessageCircle}
              />
              <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-xs space-y-1.5">
                <p className="text-green-300 font-semibold">Format recommandé :</p>
                <code className="text-green-200 text-[11px] break-all">
                  https://api.whatsapp.com/send?phone=<span className="text-amber-300">{'{code pays + numéro}'}</span>&amp;text=<span className="text-amber-300">{'{message pré-rempli}'}</span>
                </code>
                {waPhone && (
                  <p className="text-green-400 mt-2">
                    ✅ Numéro détecté : <strong>+{waPhone}</strong>
                  </p>
                )}
              </div>
              {contact.whatsappUrl && (
                <a
                  href={contact.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-green-400 hover:text-green-300 transition-colors font-medium"
                >
                  <ExternalLink className="w-4 h-4" />
                  Tester le lien WhatsApp
                </a>
              )}
            </CardContent>
          </Card>

          {/* Preview Card */}
          <Card>
            <CardHeader><CardTitle>Aperçu</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                {[
                  { icon: Phone, label: contact.phone || '—' },
                  { icon: Mail, label: contact.email || '—' },
                  { icon: MapPin, label: contact.address || '—' },
                  { icon: Clock, label: contact.businessHours || '—' },
                  { icon: MessageCircle, label: waPhone ? `+${waPhone}` : '—', color: 'text-green-400' },
                ].map(({ icon: Icon, label, color }, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 shrink-0 ${color ?? 'text-admin-text-muted'}`} />
                    <span className="text-admin-text-secondary truncate">{label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <SaveBar saving={saving} success={success} error={error} onSave={() => save({ contact })} />
    </div>
  );
}
