'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, Trash2 } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import { SaveBar, SectionHeader, SettingsSkeleton } from '@/components/admin/settings/SettingsUI';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/admin/ui/Card';
import { Button } from '@/components/admin/ui/Button';
import type { SiteMetaPage } from '@/lib/cms/settings-storage';

const PAGE_LABELS: Record<string, string> = {
  home: '🏠 Accueil',
  tarifs: '💰 Tarifs',
  blog: '📝 Blog',
  contact: '📞 Contact',
  about: 'ℹ️ À propos',
  'programme-sports': '⚽ Sports',
};

export default function SEOPage() {
  const { settings, loading, saving, error, success, save } = useSettings();
  const [pages, setPages] = useState<SiteMetaPage[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    if (settings?.seoPages) {
      setPages(structuredClone(settings.seoPages));
      if (!selected && settings.seoPages.length > 0) setSelected(settings.seoPages[0].key);
    }
  }, [settings]);

  const current = pages.find((p) => p.key === selected);

  const update = (field: keyof SiteMetaPage, value: string) => {
    setPages((prev) => prev.map((p) => p.key === selected ? { ...p, [field]: value } : p));
  };

  const addPage = () => {
    const key = `page-${Date.now()}`;
    setPages((prev) => [...prev, { key, title: 'Nouvelle Page', description: '', keywords: '', ogImageUrl: '' }]);
    setSelected(key);
  };

  const removePage = (key: string) => {
    setPages((prev) => prev.filter((p) => p.key !== key));
    setSelected(pages.find((p) => p.key !== key)?.key ?? null);
  };

  if (loading) return <div className="space-y-6"><SectionHeader icon={<Search className="w-5 h-5 text-amber-400" />} title="SEO & Meta" description="Chargement…" /><SettingsSkeleton /></div>;

  const charCount = (text: string) => text?.length ?? 0;

  const SEOQuality = ({ text, min, max }: { text: string; min: number; max: number }) => {
    const len = charCount(text);
    const ok = len >= min && len <= max;
    const warn = len > 0 && (len < min || len > max);
    return (
      <span className={`text-xs ml-2 ${ok ? 'text-green-400' : warn ? 'text-amber-400' : 'text-admin-text-muted'}`}>
        {len}/{max} {ok ? '✓' : warn ? '⚠' : ''}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={<Search className="w-5 h-5 text-amber-400" />}
        title="SEO & Meta Manager"
        description="Gérez les titres, descriptions, mots-clés et images OG pour chaque page du site."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Page List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-admin-text-secondary uppercase tracking-wider">Pages ({pages.length})</p>
            <Button onClick={addPage} className="text-xs h-8 px-3">
              <Plus className="w-3.5 h-3.5" /> Ajouter
            </Button>
          </div>
          {pages.map((page) => {
            const titleLen = page.title?.length ?? 0;
            const descLen = page.description?.length ?? 0;
            const titleOk = titleLen >= 30 && titleLen <= 60;
            const descOk = descLen >= 100 && descLen <= 160;
            const score = (titleOk ? 1 : 0) + (descOk ? 1 : 0) + (page.keywords ? 1 : 0);
            return (
              <button
                key={page.key}
                onClick={() => setSelected(page.key)}
                className={`w-full flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
                  selected === page.key
                    ? 'border-amber-500/60 bg-amber-500/10'
                    : 'border-admin-border bg-admin-card hover:bg-admin-muted/50'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-admin-text truncate">
                    {PAGE_LABELS[page.key] ?? `📄 ${page.key}`}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={`${page.key}-score-${i}`}
                        className={`h-1.5 flex-1 rounded-full ${
                          i < score ? (score === 3 ? 'bg-green-500' : score >= 2 ? 'bg-amber-500' : 'bg-red-500') : 'bg-admin-muted'
                        }`}
                      />
                    ))}
                    <span className="text-[10px] text-admin-text-muted ml-1">{score}/3</span>
                  </div>
                </div>
              </button>
            );
          })}

          {/* SEO Tips */}
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 space-y-1 mt-4">
            <p className="font-semibold text-blue-200">💡 Conseils SEO</p>
            <p>Titre: 30–60 caractères</p>
            <p>Description: 100–160 caractères</p>
            <p>Mots-clés: séparés par des virgules</p>
          </div>
        </div>

        {/* SEO Editor */}
        {current ? (
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-amber-400" />
                    {PAGE_LABELS[current.key] ?? current.key}
                  </CardTitle>
                  {!Object.keys(PAGE_LABELS).includes(current.key) && (
                    <Button
                      variant="ghost"
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 px-3 text-xs"
                      onClick={() => removePage(current.key)}
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Supprimer
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Clé de page (si custom) */}
                {!Object.keys(PAGE_LABELS).includes(current.key) && (
                  <div>
                    <label className="text-xs font-medium text-admin-text-secondary uppercase tracking-wider block mb-1.5">
                      Clé de page (slug, ex: &apos;contact&apos;)
                    </label>
                    <input
                      className="w-full bg-admin-input border border-admin-border rounded-xl px-4 py-3 text-sm text-admin-text focus:outline-none focus:border-amber-500/60 transition-colors"
                      value={current.key}
                      onChange={(e) => update('key', e.target.value)}
                    />
                  </div>
                )}

                {/* Title */}
                <div>
                  <label className="text-xs font-medium text-admin-text-secondary uppercase tracking-wider block mb-1.5 flex items-center">
                    Titre de la page
                    <SEOQuality text={current.title} min={30} max={60} />
                  </label>
                  <input
                    className="w-full bg-admin-input border border-admin-border rounded-xl px-4 py-3 text-sm text-admin-text focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-colors"
                    value={current.title}
                    placeholder="ex: RegardezIPTV - Meilleur IPTV Premium France"
                    onChange={(e) => update('title', e.target.value)}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="text-xs font-medium text-admin-text-secondary uppercase tracking-wider block mb-1.5 flex items-center">
                    Meta Description
                    <SEOQuality text={current.description} min={100} max={160} />
                  </label>
                  <textarea
                    className="w-full bg-admin-input border border-admin-border rounded-xl px-4 py-3 text-sm text-admin-text focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 resize-none transition-colors"
                    rows={3}
                    value={current.description}
                    placeholder="Description de la page pour les moteurs de recherche…"
                    onChange={(e) => update('description', e.target.value)}
                  />
                </div>

                {/* Keywords */}
                <div>
                  <label className="text-xs font-medium text-admin-text-secondary uppercase tracking-wider block mb-1.5">
                    Mots-clés (séparés par virgules)
                  </label>
                  <input
                    className="w-full bg-admin-input border border-admin-border rounded-xl px-4 py-3 text-sm text-admin-text focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-colors"
                    value={current.keywords}
                    placeholder="iptv, iptv france, abonnement iptv, iptv premium"
                    onChange={(e) => update('keywords', e.target.value)}
                  />
                </div>

                {/* OG Image */}
                <div>
                  <label className="text-xs font-medium text-admin-text-secondary uppercase tracking-wider block mb-1.5">
                    OG Image URL (partage réseaux sociaux)
                  </label>
                  <input
                    className="w-full bg-admin-input border border-admin-border rounded-xl px-4 py-3 text-sm text-admin-text focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-colors"
                    value={current.ogImageUrl}
                    placeholder="https://votre-site.fr/og-image.jpg"
                    onChange={(e) => update('ogImageUrl', e.target.value)}
                  />
                </div>

                {/* Preview */}
                {current.title && (
                  <div className="p-4 rounded-xl bg-white border border-admin-border/30">
                    <p className="text-[11px] text-admin-text-muted mb-2 font-mono">APERÇU GOOGLE</p>
                    <p className="text-blue-600 text-base font-medium hover:underline cursor-pointer truncate">
                      {current.title}
                    </p>
                    <p className="text-green-700 text-xs mt-0.5">
                      {process.env.NEXT_PUBLIC_SITE_URL || 'https://www.regardeziptv.fr'}/
                      {current.key === 'home' ? '' : current.key}
                    </p>
                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                      {current.description || 'Aucune description définie.'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="lg:col-span-2 flex items-center justify-center h-48 rounded-2xl border border-dashed border-admin-border text-admin-text-muted text-sm">
            Sélectionnez une page
          </div>
        )}
      </div>

      <SaveBar saving={saving} success={success} error={error} onSave={() => save({ seoPages: pages })} />
    </div>
  );
}
