'use client';

import { useState, useEffect } from 'react';
import { Bell, Eye, EyeOff, Calendar, Palette, ExternalLink } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import { SaveBar, SectionHeader, SettingsSkeleton } from '@/components/admin/settings/SettingsUI';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/admin/ui/Card';
import type { AnnouncementBar } from '@/lib/cms/settings-storage';

const PRESET_COLORS = [
  { bg: '#f59e0b', text: '#000000', label: 'Ambre' },
  { bg: '#10b981', text: '#ffffff', label: 'Vert' },
  { bg: '#3b82f6', text: '#ffffff', label: 'Bleu' },
  { bg: '#ef4444', text: '#ffffff', label: 'Rouge' },
  { bg: '#8b5cf6', text: '#ffffff', label: 'Violet' },
  { bg: '#ec4899', text: '#ffffff', label: 'Rose' },
  { bg: '#0f172a', text: '#f59e0b', label: 'Sombre/Or' },
  { bg: '#1e293b', text: '#ffffff', label: 'Ardoise' },
];

export default function AnnouncementPage() {
  const { settings, loading, saving, error, success, save } = useSettings();
  const [bar, setBar] = useState<AnnouncementBar>({
    enabled: false,
    text: '',
    backgroundColor: '#f59e0b',
    textColor: '#000000',
    expiresAt: null,
    ctaText: '',
    ctaHref: '',
  });

  useEffect(() => {
    if (settings?.announcement) setBar(settings.announcement);
  }, [settings]);

  const update = <K extends keyof AnnouncementBar>(field: K, value: AnnouncementBar[K]) =>
    setBar((prev) => ({ ...prev, [field]: value }));

  const isExpired = bar.expiresAt ? new Date(bar.expiresAt) < new Date() : false;

  if (loading) return <div className="space-y-6"><SectionHeader icon={<Bell className="w-5 h-5 text-red-400" />} title="Annonces & Bandeaux" description="Chargement…" /><SettingsSkeleton /></div>;

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={<Bell className="w-5 h-5 text-red-400" />}
        title="Annonces & Bandeaux"
        description="Affichez une barre d'annonce promotionnelle en haut de toutes les pages du site."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Settings */}
        <div className="space-y-5">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Bell className="w-4 h-4 text-red-400" />Configuration</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              {/* Enable Toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-admin-border bg-admin-muted">
                <div>
                  <p className="text-sm font-medium text-admin-text">Afficher le bandeau</p>
                  <p className="text-xs text-admin-text-muted mt-0.5">
                    {bar.enabled
                      ? isExpired
                        ? '⚠️ Expiré — le bandeau sera masqué'
                        : '✅ Visible sur toutes les pages'
                      : '❌ Masqué'}
                  </p>
                </div>
                <label className="relative cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={bar.enabled}
                    onChange={(e) => update('enabled', e.target.checked)}
                  />
                  <div className={`w-12 h-6 rounded-full transition-colors ${bar.enabled ? 'bg-green-500' : 'bg-admin-muted border border-admin-border'}`}>
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-md transition-transform ${bar.enabled ? 'translate-x-7' : 'translate-x-1'}`} />
                  </div>
                </label>
              </div>

              {/* Text */}
              <div>
                <label className="text-xs font-medium text-admin-text-secondary uppercase tracking-wider block mb-1.5">Texte du bandeau</label>
                <textarea
                  className="w-full bg-admin-input border border-admin-border rounded-xl px-4 py-3 text-sm text-admin-text focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 resize-none transition-colors"
                  rows={2}
                  value={bar.text}
                  placeholder="🎉 Offre spéciale : -20% sur tous les abonnements ce week-end !"
                  onChange={(e) => update('text', e.target.value)}
                />
              </div>

              {/* CTA */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-admin-text-secondary uppercase tracking-wider block mb-1.5">Texte bouton CTA</label>
                  <input
                    className="w-full bg-admin-input border border-admin-border rounded-xl px-4 py-3 text-sm text-admin-text focus:outline-none focus:border-amber-500/60 transition-colors"
                    value={bar.ctaText || ''}
                    placeholder="Voir les offres"
                    onChange={(e) => update('ctaText', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-admin-text-secondary uppercase tracking-wider block mb-1.5">Lien CTA</label>
                  <input
                    className="w-full bg-admin-input border border-admin-border rounded-xl px-4 py-3 text-sm text-admin-text focus:outline-none focus:border-amber-500/60 transition-colors"
                    value={bar.ctaHref || ''}
                    placeholder="/tarifs"
                    onChange={(e) => update('ctaHref', e.target.value)}
                  />
                </div>
              </div>

              {/* Expiry */}
              <div>
                <label className="text-xs font-medium text-admin-text-secondary uppercase tracking-wider block mb-1.5 flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" /> Date d&apos;expiration (optionnel)
                </label>
                <input
                  type="datetime-local"
                  className="w-full bg-admin-input border border-admin-border rounded-xl px-4 py-3 text-sm text-admin-text focus:outline-none focus:border-amber-500/60 transition-colors"
                  value={bar.expiresAt ? bar.expiresAt.slice(0, 16) : ''}
                  onChange={(e) => update('expiresAt', e.target.value ? new Date(e.target.value).toISOString() : null)}
                />
                {isExpired && (
                  <p className="text-xs text-amber-400 mt-1.5 flex items-center gap-1">
                    ⚠️ Cette date est déjà passée. Le bandeau sera masqué automatiquement.
                  </p>
                )}
                {bar.expiresAt && !isExpired && (
                  <p className="text-xs text-green-400 mt-1.5">
                    ✅ Expire le {new Date(bar.expiresAt).toLocaleString('fr-FR')}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Color Picker */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Palette className="w-4 h-4 text-pink-400" />Couleurs</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <div>
                <p className="text-xs font-medium text-admin-text-secondary uppercase tracking-wider mb-3">Couleurs prédéfinies</p>
                <div className="grid grid-cols-4 gap-2">
                  {PRESET_COLORS.map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => { update('backgroundColor', preset.bg); update('textColor', preset.text); }}
                      className={`h-10 rounded-lg border-2 transition-all hover:scale-105 text-xs font-bold ${
                        bar.backgroundColor === preset.bg ? 'border-white/50 scale-105' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: preset.bg, color: preset.text }}
                      title={preset.label}
                    >
                      {preset.label.split('/')[0]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-admin-text-secondary uppercase tracking-wider block mb-1.5">Couleur fond</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      className="w-10 h-10 rounded-lg border border-admin-border cursor-pointer bg-admin-input"
                      value={bar.backgroundColor}
                      onChange={(e) => update('backgroundColor', e.target.value)}
                    />
                    <input
                      className="flex-1 bg-admin-input border border-admin-border rounded-xl px-3 py-2 text-sm text-admin-text focus:outline-none focus:border-amber-500/60 transition-colors font-mono"
                      value={bar.backgroundColor}
                      onChange={(e) => update('backgroundColor', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-admin-text-secondary uppercase tracking-wider block mb-1.5">Couleur texte</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      className="w-10 h-10 rounded-lg border border-admin-border cursor-pointer bg-admin-input"
                      value={bar.textColor}
                      onChange={(e) => update('textColor', e.target.value)}
                    />
                    <input
                      className="flex-1 bg-admin-input border border-admin-border rounded-xl px-3 py-2 text-sm text-admin-text focus:outline-none focus:border-amber-500/60 transition-colors font-mono"
                      value={bar.textColor}
                      onChange={(e) => update('textColor', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Preview */}
        <div className="space-y-5">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Eye className="w-4 h-4 text-admin-text-muted" />Aperçu en direct</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Browser chrome mock */}
                <div className="rounded-xl border border-admin-border overflow-hidden shadow-lg">
                  <div className="bg-admin-muted px-4 py-2 flex items-center gap-2 border-b border-admin-border">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400/60" />
                      <div className="w-3 h-3 rounded-full bg-amber-400/60" />
                      <div className="w-3 h-3 rounded-full bg-green-400/60" />
                    </div>
                    <div className="flex-1 bg-admin-input rounded-lg px-3 py-1 text-xs text-admin-text-muted font-mono">
                      regardeziptv.fr
                    </div>
                  </div>

                  {/* Announcement bar preview */}
                  {bar.enabled && !isExpired ? (
                    <div
                      className="px-4 py-2.5 text-center text-sm font-medium flex items-center justify-center gap-3"
                      style={{ backgroundColor: bar.backgroundColor, color: bar.textColor }}
                    >
                      <span>{bar.text || 'Votre texte d\'annonce ici…'}</span>
                      {bar.ctaText && (
                        <span
                          className="px-3 py-0.5 rounded-full text-xs font-semibold border"
                          style={{ borderColor: bar.textColor, color: bar.textColor }}
                        >
                          {bar.ctaText}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="px-4 py-2.5 text-center text-xs text-admin-text-muted bg-admin-muted border-b border-admin-border flex items-center justify-center gap-2">
                      <EyeOff className="w-3.5 h-3.5" />
                      Bandeau désactivé ou expiré
                    </div>
                  )}

                  {/* Fake page content */}
                  <div className="bg-[#0a0a12] px-6 py-8 space-y-3">
                    <div className="h-3 bg-white/10 rounded-full w-3/4 mx-auto" />
                    <div className="h-2 bg-white/5 rounded-full w-1/2 mx-auto" />
                    <div className="h-2 bg-white/5 rounded-full w-2/3 mx-auto" />
                    <div className="h-8 bg-amber-500/30 rounded-lg w-32 mx-auto mt-4" />
                  </div>
                </div>

                {/* Status summary */}
                <div className="grid grid-cols-2 gap-3">
                  <div className={`p-3 rounded-xl border text-center ${bar.enabled && !isExpired ? 'border-green-500/30 bg-green-500/10' : 'border-admin-border bg-admin-muted'}`}>
                    <p className="text-xs text-admin-text-muted">Statut</p>
                    <p className={`text-sm font-semibold mt-0.5 ${bar.enabled && !isExpired ? 'text-green-400' : 'text-admin-text-secondary'}`}>
                      {bar.enabled && !isExpired ? '✅ Actif' : isExpired ? '⏰ Expiré' : '❌ Inactif'}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl border border-admin-border bg-admin-muted text-center">
                    <p className="text-xs text-admin-text-muted">Caractères</p>
                    <p className="text-sm font-semibold text-admin-text mt-0.5">{bar.text?.length ?? 0}</p>
                  </div>
                </div>

                {bar.ctaHref && (
                  <a
                    href={bar.ctaHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-amber-400 hover:text-amber-300 transition-colors font-medium"
                  >
                    <ExternalLink className="w-4 h-4" /> Tester le lien CTA
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <SaveBar saving={saving} success={success} error={error} onSave={() => save({ announcement: bar })} />
    </div>
  );
}
