'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, GripVertical, Eye, EyeOff, Star, DollarSign, Tag } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import { SaveBar, SectionHeader, SettingsSkeleton } from '@/components/admin/settings/SettingsUI';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/admin/ui/Card';
import { Input } from '@/components/admin/ui/Input';
import { Button } from '@/components/admin/ui/Button';
import type { PricingPlan } from '@/lib/cms/settings-storage';

export default function PricingPage() {
  const { settings, loading, saving, error, success, save } = useSettings();
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  useEffect(() => {
    if (settings?.pricing) {
      setPlans(structuredClone(settings.pricing).sort((a, b) => a.order - b.order));
      if (!selectedPlan && settings.pricing.length > 0) {
        setSelectedPlan(settings.pricing[0].slug);
      }
    }
  }, [settings]);

  const updatePlan = (slug: string, field: keyof PricingPlan, value: unknown) => {
    setPlans((prev) =>
      prev.map((p) => (p.slug === slug ? { ...p, [field]: value } : p))
    );
  };

  const updateFeature = (slug: string, index: number, value: string) => {
    setPlans((prev) =>
      prev.map((p) =>
        p.slug === slug
          ? { ...p, features: p.features.map((f, i) => (i === index ? value : f)) }
          : p
      )
    );
  };

  const addFeature = (slug: string) => {
    setPlans((prev) =>
      prev.map((p) =>
        p.slug === slug ? { ...p, features: [...p.features, 'Nouvelle fonctionnalité'] } : p
      )
    );
  };

  const removeFeature = (slug: string, index: number) => {
    setPlans((prev) =>
      prev.map((p) =>
        p.slug === slug ? { ...p, features: p.features.filter((_, i) => i !== index) } : p
      )
    );
  };

  const addPlan = () => {
    const slug = `plan-${Date.now()}`;
    const newPlan: PricingPlan = {
      slug,
      name: 'Nouveau Forfait',
      price: 0,
      originalPrice: null,
      currency: 'EUR',
      duration: 'month',
      badge: null,
      featured: false,
      visible: true,
      order: plans.length,
      promoPrice: null,
      features: ['Fonctionnalité 1'],
      description: 'Description du forfait.',
    };
    setPlans((prev) => [...prev, newPlan]);
    setSelectedPlan(slug);
  };

  const removePlan = (slug: string) => {
    setPlans((prev) => prev.filter((p) => p.slug !== slug));
    setSelectedPlan(plans.find((p) => p.slug !== slug)?.slug ?? null);
  };

  const currentPlan = plans.find((p) => p.slug === selectedPlan);

  if (loading) return <div className="space-y-6"><SectionHeader icon={<DollarSign className="w-5 h-5 text-green-400" />} title="Gestion des Prix" description="Chargement…" /><SettingsSkeleton /></div>;

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={<DollarSign className="w-5 h-5 text-green-400" />}
        title="Gestion des Prix"
        description="Modifiez les forfaits, prix, promotions et visibilité. Cliquez Enregistrer pour publier."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — Plan List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-admin-text-secondary uppercase tracking-wider">Forfaits ({plans.length})</p>
            <Button onClick={addPlan} className="text-xs h-8 px-3">
              <Plus className="w-3.5 h-3.5" /> Ajouter
            </Button>
          </div>
          {plans.map((plan) => (
            <button
              key={plan.slug}
              onClick={() => setSelectedPlan(plan.slug)}
              className={`w-full flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
                selectedPlan === plan.slug
                  ? 'border-amber-500/60 bg-amber-500/10'
                  : 'border-admin-border bg-admin-card hover:border-admin-border/80 hover:bg-admin-muted/50'
              }`}
            >
              <GripVertical className="w-4 h-4 text-admin-text-muted shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-admin-text truncate">{plan.name}</p>
                <p className="text-xs text-admin-text-muted mt-0.5">
                  {plan.promoPrice ? (
                    <span className="text-green-400 font-semibold">{plan.promoPrice}€ 🏷️</span>
                  ) : (
                    <span>{plan.price}€</span>
                  )}
                  {plan.badge && <span className="ml-2 px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-semibold">{plan.badge}</span>}
                </p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {plan.featured && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
                {plan.visible ? <Eye className="w-3.5 h-3.5 text-green-400" /> : <EyeOff className="w-3.5 h-3.5 text-admin-text-muted" />}
              </div>
            </button>
          ))}
        </div>

        {/* Right — Plan Editor */}
        <div className="lg:col-span-2">
          {currentPlan ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-amber-400" />
                    Éditer : {currentPlan.name}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 px-3 text-xs"
                    onClick={() => removePlan(currentPlan.slug)}
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Supprimer
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Nom du forfait"
                    value={currentPlan.name}
                    onChange={(e) => updatePlan(currentPlan.slug, 'name', e.target.value)}
                  />
                  <Input
                    label="Sous-titre (optionnel)"
                    value={currentPlan.subtitle || ''}
                    onChange={(e) => updatePlan(currentPlan.slug, 'subtitle', e.target.value)}
                    placeholder="ex: + 3 mois offerts"
                  />
                </div>

                {/* Pricing */}
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Prix (€)"
                    type="number"
                    step="0.01"
                    value={currentPlan.price}
                    onChange={(e) => updatePlan(currentPlan.slug, 'price', parseFloat(e.target.value) || 0)}
                  />
                  <Input
                    label="Prix original / barré (€)"
                    type="number"
                    step="0.01"
                    value={currentPlan.originalPrice ?? ''}
                    placeholder="Laisser vide si aucun"
                    onChange={(e) => updatePlan(currentPlan.slug, 'originalPrice', e.target.value ? parseFloat(e.target.value) : null)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Prix promo 🏷️ (optionnel)"
                    type="number"
                    step="0.01"
                    value={currentPlan.promoPrice ?? ''}
                    placeholder="ex: 14.99 (remplace le prix)"
                    onChange={(e) => updatePlan(currentPlan.slug, 'promoPrice', e.target.value ? parseFloat(e.target.value) : null)}
                  />
                  <Input
                    label="Économies (ex: 78%)"
                    value={currentPlan.savings || ''}
                    placeholder="ex: 50%"
                    onChange={(e) => updatePlan(currentPlan.slug, 'savings', e.target.value)}
                  />
                </div>

                {/* Badge & Settings */}
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Badge (ex: Populaire)"
                    value={currentPlan.badge || ''}
                    placeholder="Laisser vide pour aucun badge"
                    onChange={(e) => updatePlan(currentPlan.slug, 'badge', e.target.value || null)}
                  />
                  <Input
                    label="Ordre d'affichage"
                    type="number"
                    value={currentPlan.order}
                    onChange={(e) => updatePlan(currentPlan.slug, 'order', parseInt(e.target.value) || 0)}
                  />
                </div>

                {/* Toggles */}
                <div className="flex gap-4">
                  {[
                    { field: 'visible', label: 'Visible sur le site', icon: Eye },
                    { field: 'featured', label: 'Mis en avant (étoile)', icon: Star },
                  ].map(({ field, label, icon: Icon }) => (
                    <label key={field} className="flex items-center gap-2.5 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={!!currentPlan[field as keyof PricingPlan]}
                          onChange={(e) => updatePlan(currentPlan.slug, field as keyof PricingPlan, e.target.checked)}
                        />
                        <div className={`w-10 h-5 rounded-full transition-colors ${currentPlan[field as keyof PricingPlan] ? 'bg-amber-500' : 'bg-admin-muted border border-admin-border'}`}>
                          <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${currentPlan[field as keyof PricingPlan] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                        </div>
                      </div>
                      <Icon className="w-4 h-4 text-admin-text-muted" />
                      <span className="text-sm text-admin-text">{label}</span>
                    </label>
                  ))}
                </div>

                {/* Description */}
                <div>
                  <label className="text-xs font-medium text-admin-text-secondary uppercase tracking-wider block mb-2">Description</label>
                  <textarea
                    className="w-full bg-admin-input border border-admin-border rounded-xl px-4 py-3 text-sm text-admin-text focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 resize-none transition-colors"
                    rows={2}
                    value={currentPlan.description}
                    onChange={(e) => updatePlan(currentPlan.slug, 'description', e.target.value)}
                  />
                </div>

                {/* Features list */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-medium text-admin-text-secondary uppercase tracking-wider">Fonctionnalités</label>
                    <Button onClick={() => addFeature(currentPlan.slug)} className="h-7 px-3 text-xs">
                      <Plus className="w-3 h-3" /> Ajouter
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {currentPlan.features.map((feat, i) => (
                      <div key={`${currentPlan.slug}-feat-${i}`} className="flex items-center gap-2">
                        <input
                          className="flex-1 bg-admin-input border border-admin-border rounded-lg px-3 py-2 text-sm text-admin-text focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-colors"
                          value={feat}
                          onChange={(e) => updateFeature(currentPlan.slug, i, e.target.value)}
                        />
                        <button
                          onClick={() => removeFeature(currentPlan.slug, i)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-admin-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="flex items-center justify-center h-48 rounded-2xl border border-dashed border-admin-border text-admin-text-muted text-sm">
              Sélectionnez un forfait à modifier
            </div>
          )}
        </div>
      </div>

      <SaveBar
        saving={saving}
        success={success}
        error={error}
        onSave={() => save({ pricing: plans })}
      />
    </div>
  );
}
