'use client';

import { useState, useEffect } from 'react';
import { Tv, Plus, Trash2, Eye, EyeOff, Star, GripVertical } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import { SaveBar, SectionHeader, SettingsSkeleton } from '@/components/admin/settings/SettingsUI';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/admin/ui/Card';
import { Button } from '@/components/admin/ui/Button';
import type { PricingPlan } from '@/lib/cms/settings-storage';

// IPTV Package manager — same data model as pricing but IPTV-focused UI
export default function IPTVPage() {
  const { settings, loading, saving, error, success, save } = useSettings();
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    if (settings?.pricing) {
      setPlans(structuredClone(settings.pricing).sort((a, b) => a.order - b.order));
      if (!selected && settings.pricing.length > 0) setSelected(settings.pricing[0].slug);
    }
  }, [settings]);

  const current = plans.find((p) => p.slug === selected);

  const update = (field: keyof PricingPlan, value: unknown) => {
    setPlans((prev) => prev.map((p) => p.slug === selected ? { ...p, [field]: value } : p));
  };

  const updateFeature = (idx: number, val: string) => {
    setPlans((prev) => prev.map((p) =>
      p.slug === selected ? { ...p, features: p.features.map((f, i) => i === idx ? val : f) } : p
    ));
  };

  const addPackage = () => {
    const slug = `iptv-${Date.now()}`;
    setPlans((prev) => [...prev, {
      slug, name: 'Nouveau Package', price: 0, originalPrice: null,
      currency: 'EUR', duration: 'month', badge: null, featured: false,
      visible: true, order: prev.length, promoPrice: null,
      features: ['45 000 chaînes', 'HD/4K', 'Support 24h/7j'],
      description: 'Description du package IPTV.',
    }]);
    setSelected(slug);
  };

  if (loading) return <div className="space-y-6"><SectionHeader icon={<Tv className="w-5 h-5 text-purple-400" />} title="Packages IPTV" description="Chargement…" /><SettingsSkeleton /></div>;

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={<Tv className="w-5 h-5 text-purple-400" />}
        title="Packages IPTV"
        description="Gérez les offres IPTV : durée, chaînes, prix, activation/désactivation."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Package list */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-admin-text-secondary uppercase tracking-wider">Packages ({plans.length})</p>
            <Button onClick={addPackage} className="text-xs h-8 px-3">
              <Plus className="w-3.5 h-3.5" /> Nouveau
            </Button>
          </div>
          {plans.map((plan) => (
            <button
              key={plan.slug}
              onClick={() => setSelected(plan.slug)}
              className={`w-full flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
                selected === plan.slug
                  ? 'border-purple-500/60 bg-purple-500/10'
                  : 'border-admin-border bg-admin-card hover:bg-admin-muted/50'
              }`}
            >
              <GripVertical className="w-4 h-4 text-admin-text-muted" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-admin-text truncate">{plan.name}</p>
                <p className="text-xs text-admin-text-muted mt-0.5">
                  {plan.price === 0 ? 'Gratuit' : `${plan.promoPrice ?? plan.price}€`}
                  {' · '}
                  {plan.features.length} fonctionnalités
                </p>
              </div>
              <div className="flex gap-1 shrink-0">
                {plan.featured && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
                {plan.visible ? <Eye className="w-3.5 h-3.5 text-green-400" /> : <EyeOff className="w-3.5 h-3.5 text-admin-text-muted" />}
              </div>
            </button>
          ))}
        </div>

        {/* Editor */}
        {current ? (
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Tv className="w-4 h-4 text-purple-400" />
                    {current.name}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 px-3 text-xs"
                    onClick={() => {
                      setPlans((p) => p.filter((x) => x.slug !== selected));
                      setSelected(plans.find((x) => x.slug !== selected)?.slug ?? null);
                    }}
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Supprimer
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Name & Duration */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-admin-text-secondary uppercase tracking-wider block mb-1.5">Nom du package</label>
                    <input className="w-full bg-admin-input border border-admin-border rounded-xl px-4 py-3 text-sm text-admin-text focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30 transition-colors"
                      value={current.name} onChange={(e) => update('name', e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-admin-text-secondary uppercase tracking-wider block mb-1.5">Durée</label>
                    <select className="w-full bg-admin-input border border-admin-border rounded-xl px-4 py-3 text-sm text-admin-text focus:outline-none focus:border-purple-500/60 transition-colors"
                      value={current.duration} onChange={(e) => update('duration', e.target.value)}>
                      <option value="hour">Heures</option>
                      <option value="month">Mois</option>
                      <option value="year">Année</option>
                      <option value="lifetime">À vie</option>
                    </select>
                  </div>
                </div>

                {/* Pricing row */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'Prix (€)', field: 'price', type: 'number' },
                    { label: 'Prix barré (€)', field: 'originalPrice', type: 'number', placeholder: 'Aucun' },
                    { label: 'Promo (€)', field: 'promoPrice', type: 'number', placeholder: 'Aucune' },
                  ].map(({ label, field, type, placeholder }) => (
                    <div key={field}>
                      <label className="text-xs font-medium text-admin-text-secondary uppercase tracking-wider block mb-1.5">{label}</label>
                      <input
                        type={type}
                        step="0.01"
                        className="w-full bg-admin-input border border-admin-border rounded-xl px-4 py-3 text-sm text-admin-text focus:outline-none focus:border-purple-500/60 transition-colors"
                        value={(current[field as keyof PricingPlan] as number | null) ?? ''}
                        placeholder={placeholder}
                        onChange={(e) => update(field as keyof PricingPlan, e.target.value ? parseFloat(e.target.value) : null)}
                      />
                    </div>
                  ))}
                </div>

                {/* Badge & Order */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-admin-text-secondary uppercase tracking-wider block mb-1.5">Badge</label>
                    <input className="w-full bg-admin-input border border-admin-border rounded-xl px-4 py-3 text-sm text-admin-text focus:outline-none focus:border-purple-500/60 transition-colors"
                      value={current.badge || ''} placeholder="ex: Populaire"
                      onChange={(e) => update('badge', e.target.value || null)} />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-admin-text-secondary uppercase tracking-wider block mb-1.5">Ordre</label>
                    <input type="number" className="w-full bg-admin-input border border-admin-border rounded-xl px-4 py-3 text-sm text-admin-text focus:outline-none focus:border-purple-500/60 transition-colors"
                      value={current.order} onChange={(e) => update('order', parseInt(e.target.value) || 0)} />
                  </div>
                </div>

                {/* Toggles */}
                <div className="flex items-center gap-6">
                  {[
                    { field: 'visible', label: 'Visible', icon: Eye },
                    { field: 'featured', label: 'Mis en avant', icon: Star },
                  ].map(({ field, label, icon: Icon }) => (
                    <label key={field} className="flex items-center gap-2 cursor-pointer">
                      <div className="relative">
                        <input type="checkbox" className="sr-only"
                          checked={!!current[field as keyof PricingPlan]}
                          onChange={(e) => update(field as keyof PricingPlan, e.target.checked)} />
                        <div className={`w-10 h-5 rounded-full transition-colors ${current[field as keyof PricingPlan] ? 'bg-purple-500' : 'bg-admin-muted border border-admin-border'}`}>
                          <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${current[field as keyof PricingPlan] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                        </div>
                      </div>
                      <Icon className="w-4 h-4 text-admin-text-muted" />
                      <span className="text-sm text-admin-text">{label}</span>
                    </label>
                  ))}
                </div>

                {/* Description */}
                <div>
                  <label className="text-xs font-medium text-admin-text-secondary uppercase tracking-wider block mb-1.5">Description</label>
                  <textarea
                    className="w-full bg-admin-input border border-admin-border rounded-xl px-4 py-3 text-sm text-admin-text focus:outline-none focus:border-purple-500/60 resize-none transition-colors"
                    rows={2} value={current.description}
                    onChange={(e) => update('description', e.target.value)} />
                </div>

                {/* Features (channels, etc.) */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-medium text-admin-text-secondary uppercase tracking-wider">Chaînes & Fonctionnalités</label>
                    <button
                      onClick={() => setPlans((prev) => prev.map((p) =>
                        p.slug === selected ? { ...p, features: [...p.features, 'Nouvelle chaîne/fonctionnalité'] } : p
                      ))}
                      className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 font-medium transition-colors"
                    >
                      <Plus className="w-3 h-3" /> Ajouter
                    </button>
                  </div>
                  <div className="space-y-2">
                    {current.features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 text-[10px] flex items-center justify-center font-bold shrink-0">{i + 1}</span>
                        <input
                          className="flex-1 bg-admin-input border border-admin-border rounded-lg px-3 py-2 text-sm text-admin-text focus:outline-none focus:border-purple-500/60 transition-colors"
                          value={feat} onChange={(e) => updateFeature(i, e.target.value)}
                        />
                        <button
                          onClick={() => setPlans((prev) => prev.map((p) =>
                            p.slug === selected ? { ...p, features: p.features.filter((_, fi) => fi !== i) } : p
                          ))}
                          className="w-7 h-7 flex items-center justify-center rounded-lg text-admin-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="lg:col-span-2 flex items-center justify-center h-48 rounded-2xl border border-dashed border-admin-border text-admin-text-muted text-sm">
            Sélectionnez un package
          </div>
        )}
      </div>

      <SaveBar saving={saving} success={success} error={error} onSave={() => save({ pricing: plans })} />
    </div>
  );
}
