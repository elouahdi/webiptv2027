'use client';

import { useState, useEffect } from 'react';
import { Layout, Plus, Trash2 } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import { SaveBar, SectionHeader, SettingsSkeleton } from '@/components/admin/settings/SettingsUI';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/admin/ui/Card';
import type { HeroContent, AboutContent, FeatureItem, FooterContent } from '@/lib/cms/settings-storage';

function Field({ label, value, onChange, placeholder, multiline }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; multiline?: boolean;
}) {
  return (
    <div>
      <label className="text-xs font-medium text-admin-text-secondary uppercase tracking-wider block mb-1.5">{label}</label>
      {multiline ? (
        <textarea
          className="w-full bg-admin-input border border-admin-border rounded-xl px-4 py-3 text-sm text-admin-text focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 resize-none transition-colors"
          rows={3}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          className="w-full bg-admin-input border border-admin-border rounded-xl px-4 py-3 text-sm text-admin-text focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-colors"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}

export default function ContentPage() {
  const { settings, loading, saving, error, success, save } = useSettings();
  const [hero, setHero] = useState<HeroContent>({
    title: '', subtitle: '', ctaText: '', ctaHref: '', badgeText: '',
  });
  const [about, setAbout] = useState<AboutContent>({
    title: '', description: '',
    stat1Label: '', stat1Value: '', stat2Label: '', stat2Value: '', stat3Label: '', stat3Value: '',
  });
  const [features, setFeatures] = useState<FeatureItem[]>([]);
  const [footer, setFooter] = useState<FooterContent>({
    companyDescription: '', whatsappUrl: '', email: '', phone: '', address: '', businessHours: '',
  });
  const [activeTab, setActiveTab] = useState<'hero' | 'about' | 'features' | 'footer'>('hero');

  useEffect(() => {
    if (settings) {
      setHero(settings.hero);
      setAbout(settings.about);
      setFeatures(structuredClone(settings.features));
      setFooter(settings.footer);
    }
  }, [settings]);

  const updateFeature = (id: string, field: keyof FeatureItem, value: string) =>
    setFeatures((prev) => prev.map((f) => (f.id === id ? { ...f, [field]: value } : f)));

  const addFeature = () => setFeatures((prev) => [
    ...prev,
    { id: `feat-${Date.now()}`, icon: 'Star', title: 'Nouvelle fonctionnalité', description: 'Description.' },
  ]);

  const removeFeature = (id: string) => setFeatures((prev) => prev.filter((f) => f.id !== id));

  const handleSave = () => save({ hero, about, features, footer });

  const tabs = [
    { id: 'hero', label: '🚀 Hero' },
    { id: 'about', label: 'ℹ️ About' },
    { id: 'features', label: '✨ Features' },
    { id: 'footer', label: '🔗 Footer' },
  ] as const;

  if (loading) return <div className="space-y-6"><SectionHeader icon={<Layout className="w-5 h-5 text-blue-400" />} title="Contenu du Site" description="Chargement…" /><SettingsSkeleton /></div>;

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={<Layout className="w-5 h-5 text-blue-400" />}
        title="Contenu du Site"
        description="Modifiez tous les textes visibles sur le site : hero, about, features, footer."
      />

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-admin-muted rounded-xl border border-admin-border w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-admin-card text-admin-text shadow-sm border border-admin-border'
                : 'text-admin-text-secondary hover:text-admin-text'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Hero Section */}
      {activeTab === 'hero' && (
        <Card>
          <CardHeader><CardTitle>Section Hero (Accueil)</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            <Field label="Titre principal" value={hero.title} onChange={(v) => setHero({ ...hero, title: v })} placeholder="Le meilleur IPTV premium…" />
            <Field label="Sous-titre" value={hero.subtitle} onChange={(v) => setHero({ ...hero, subtitle: v })} multiline />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Texte du bouton CTA" value={hero.ctaText} onChange={(v) => setHero({ ...hero, ctaText: v })} placeholder="Voir les offres" />
              <Field label="Lien du bouton CTA" value={hero.ctaHref} onChange={(v) => setHero({ ...hero, ctaHref: v })} placeholder="/tarifs" />
            </div>
            <Field label="Badge (étoiles / reviews)" value={hero.badgeText} onChange={(v) => setHero({ ...hero, badgeText: v })} placeholder="⭐ 4.9/5 · 140 000+ abonnés" />
          </CardContent>
        </Card>
      )}

      {/* About Section */}
      {activeTab === 'about' && (
        <Card>
          <CardHeader><CardTitle>Section About</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            <Field label="Titre" value={about.title} onChange={(v) => setAbout({ ...about, title: v })} />
            <Field label="Description" value={about.description} onChange={(v) => setAbout({ ...about, description: v })} multiline />
            <div className="border-t border-admin-border pt-5">
              <p className="text-xs font-medium text-admin-text-secondary uppercase tracking-wider mb-4">Statistiques (3 chiffres clés)</p>
              <div className="grid grid-cols-3 gap-4">
                {([
                  ['stat1Value', 'stat1Label', 'Stat 1'],
                  ['stat2Value', 'stat2Label', 'Stat 2'],
                  ['stat3Value', 'stat3Label', 'Stat 3'],
                ] as const).map(([valKey, labelKey, title]) => (
                  <div key={valKey} className="space-y-3 p-4 rounded-xl bg-admin-muted border border-admin-border">
                    <p className="text-xs font-semibold text-admin-text-muted">{title}</p>
                    <input
                      className="w-full bg-admin-input border border-admin-border rounded-lg px-3 py-2 text-sm text-admin-text focus:outline-none focus:border-amber-500/60 transition-colors"
                      placeholder="ex: 140K+"
                      value={about[valKey]}
                      onChange={(e) => setAbout({ ...about, [valKey]: e.target.value })}
                    />
                    <input
                      className="w-full bg-admin-input border border-admin-border rounded-lg px-3 py-2 text-sm text-admin-text focus:outline-none focus:border-amber-500/60 transition-colors"
                      placeholder="ex: Abonnés actifs"
                      value={about[labelKey]}
                      onChange={(e) => setAbout({ ...about, [labelKey]: e.target.value })}
                    />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Features Section */}
      {activeTab === 'features' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Section Features</CardTitle>
              <button
                onClick={addFeature}
                className="flex items-center gap-1.5 text-sm text-amber-400 hover:text-amber-300 transition-colors font-medium"
              >
                <Plus className="w-4 h-4" /> Ajouter
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {features.map((feat, idx) => (
                <div key={feat.id} className="p-4 rounded-xl border border-admin-border bg-admin-muted space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-admin-text-muted">Fonctionnalité #{idx + 1}</span>
                    <button
                      onClick={() => removeFeature(feat.id)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-admin-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs text-admin-text-muted block mb-1">Icône (Lucide)</label>
                      <input
                        className="w-full bg-admin-input border border-admin-border rounded-lg px-3 py-2 text-sm text-admin-text focus:outline-none focus:border-amber-500/60 transition-colors"
                        value={feat.icon}
                        placeholder="ex: Zap, Shield…"
                        onChange={(e) => updateFeature(feat.id, 'icon', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-admin-text-muted block mb-1">Titre</label>
                      <input
                        className="w-full bg-admin-input border border-admin-border rounded-lg px-3 py-2 text-sm text-admin-text focus:outline-none focus:border-amber-500/60 transition-colors"
                        value={feat.title}
                        onChange={(e) => updateFeature(feat.id, 'title', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-admin-text-muted block mb-1">Description</label>
                      <input
                        className="w-full bg-admin-input border border-admin-border rounded-lg px-3 py-2 text-sm text-admin-text focus:outline-none focus:border-amber-500/60 transition-colors"
                        value={feat.description}
                        onChange={(e) => updateFeature(feat.id, 'description', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Footer Section */}
      {activeTab === 'footer' && (
        <Card>
          <CardHeader><CardTitle>Section Footer</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            <Field label="Description de la société" value={footer.companyDescription} onChange={(v) => setFooter({ ...footer, companyDescription: v })} multiline />
            <div className="grid grid-cols-2 gap-4">
              <Field label="URL WhatsApp" value={footer.whatsappUrl} onChange={(v) => setFooter({ ...footer, whatsappUrl: v })} />
              <Field label="Email" value={footer.email} onChange={(v) => setFooter({ ...footer, email: v })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Téléphone" value={footer.phone} onChange={(v) => setFooter({ ...footer, phone: v })} />
              <Field label="Adresse" value={footer.address} onChange={(v) => setFooter({ ...footer, address: v })} />
            </div>
          </CardContent>
        </Card>
      )}

      <SaveBar saving={saving} success={success} error={error} onSave={handleSave} />
    </div>
  );
}
