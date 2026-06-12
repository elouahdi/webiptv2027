'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { Button } from '@/components/admin/ui/Button';
import { Input } from '@/components/admin/ui/Input';
import { Select } from '@/components/admin/ui/Select';
import { Card } from '@/components/admin/ui/Card';
import { useToast } from '@/components/admin/ui/Toast';

// ─── Types ────────────────────────────────────────────────────────────────────
interface IptvAppForm {
  name: string;
  icon: string;
  category: string;
  is_free: boolean;
  price_fr: string;
  price_en: string;
  price_es: string;
  price_de: string;
  platforms: string[];
  device_types: string[];
  blog_slug: string;
  desc_fr: string;
  desc_en: string;
  desc_es: string;
  desc_de: string;
  steps_fr: string[];
  steps_en: string[];
  steps_es: string[];
  steps_de: string[];
  status: 'active' | 'inactive';
  sort_order: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const LOCALES = ['fr', 'en', 'es', 'de'] as const;
type Locale = typeof LOCALES[number];

const LOCALE_LABELS: Record<Locale, string> = { fr: '🇫🇷 FR', en: '🇬🇧 EN', es: '🇪🇸 ES', de: '🇩🇪 DE' };

const CATEGORIES = [
  { value: 'smartphone', label: 'Smartphone / Mobile' },
  { value: 'tv', label: 'Smart TV' },
  { value: 'pc', label: 'PC / Mac' },
  { value: 'box', label: 'Box / Fire Stick' },
];

const ALL_PLATFORMS = [
  'iOS', 'Android', 'Android TV', 'Fire Stick',
  'Samsung', 'LG', 'Windows', 'Mac', 'Linux',
  'Smart TV', 'Nvidia Shield',
];

const ALL_DEVICE_TYPES = [
  { value: 'smartphone', label: 'Smartphone' },
  { value: 'tv', label: 'TV' },
  { value: 'pc', label: 'PC' },
  { value: 'box', label: 'Box' },
];

const DEFAULT_FORM: IptvAppForm = {
  name: '', icon: '📺', category: 'smartphone',
  is_free: true,
  price_fr: '', price_en: '', price_es: '', price_de: '',
  platforms: [], device_types: [],
  blog_slug: '',
  desc_fr: '', desc_en: '', desc_es: '', desc_de: '',
  steps_fr: [''], steps_en: [''], steps_es: [''], steps_de: [''],
  status: 'active', sort_order: 0,
};

// ─── Sub-components ────────────────────────────────────────────────────────────
function StepsEditor({
  steps,
  onChange,
  locale,
}: {
  steps: string[];
  onChange: (val: string[]) => void;
  locale: string;
}) {
  const addStep = () => onChange([...steps, '']);
  const removeStep = (i: number) => onChange(steps.filter((_, idx) => idx !== i));
  const updateStep = (i: number, val: string) => {
    const next = [...steps];
    next[i] = val;
    onChange(next);
  };

  return (
    <div className="space-y-2">
      {steps.map((step, i) => (
        <div key={i} className="flex gap-2 items-center">
          <span className="text-xs text-admin-text-muted w-5 text-right shrink-0">{i + 1}.</span>
          <input
            type="text"
            value={step}
            onChange={(e) => updateStep(i, e.target.value)}
            placeholder={`Étape ${i + 1} (${locale.toUpperCase()})`}
            className="flex-1 bg-admin-input border border-admin-border rounded-lg px-3 py-2 text-sm text-admin-text placeholder-admin-text-muted focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/60 transition-all"
          />
          <button
            type="button"
            onClick={() => removeStep(i)}
            disabled={steps.length <= 1}
            className="text-admin-text-muted hover:text-red-400 transition-colors disabled:opacity-30"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addStep}
        className="flex items-center gap-1.5 text-sm text-amber-400 hover:text-amber-300 transition-colors mt-1"
      >
        <Plus className="w-3.5 h-3.5" /> Ajouter une étape
      </button>
    </div>
  );
}

function CheckboxGroup({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: string[] | { value: string; label: string }[];
  selected: string[];
  onChange: (val: string[]) => void;
}) {
  const toggle = (val: string) => {
    onChange(selected.includes(val) ? selected.filter((v) => v !== val) : [...selected, val]);
  };

  const normalized = (options as any[]).map((o) =>
    typeof o === 'string' ? { value: o, label: o } : o
  );

  return (
    <div>
      <p className="text-sm font-medium text-admin-text-secondary mb-2">{label}</p>
      <div className="flex flex-wrap gap-2">
        {normalized.map(({ value, label: lbl }) => (
          <button
            key={value}
            type="button"
            onClick={() => toggle(value)}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
              selected.includes(value)
                ? 'bg-amber-500/15 border-amber-500/50 text-amber-400'
                : 'bg-admin-muted border-admin-border text-admin-text-secondary hover:text-admin-text'
            }`}
          >
            {lbl}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Main form ────────────────────────────────────────────────────────────────
interface AppFormProps {
  initialData?: any;
  mode: 'create' | 'edit';
}

export function AppForm({ initialData, mode }: AppFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [activeLocale, setActiveLocale] = useState<Locale>('fr');
  const [form, setForm] = useState<IptvAppForm>(DEFAULT_FORM);

  useEffect(() => {
    if (!initialData) return;
    setForm({
      name: initialData.name ?? '',
      icon: initialData.icon ?? '📺',
      category: initialData.category ?? 'smartphone',
      is_free: initialData.is_free === 1 || initialData.is_free === true,
      price_fr: initialData.price?.fr ?? '',
      price_en: initialData.price?.en ?? '',
      price_es: initialData.price?.es ?? '',
      price_de: initialData.price?.de ?? '',
      platforms: initialData.platforms ?? [],
      device_types: initialData.device_types ?? [],
      blog_slug: initialData.blog_slug ?? '',
      desc_fr: initialData.descriptions?.fr ?? '',
      desc_en: initialData.descriptions?.en ?? '',
      desc_es: initialData.descriptions?.es ?? '',
      desc_de: initialData.descriptions?.de ?? '',
      steps_fr: initialData.steps?.fr?.length ? initialData.steps.fr : [''],
      steps_en: initialData.steps?.en?.length ? initialData.steps.en : [''],
      steps_es: initialData.steps?.es?.length ? initialData.steps.es : [''],
      steps_de: initialData.steps?.de?.length ? initialData.steps.de : [''],
      status: initialData.status ?? 'active',
      sort_order: initialData.sort_order ?? 0,
    });
  }, [initialData]);

  const set = (key: keyof IptvAppForm, val: any) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.category) {
      toast('Nom et catégorie sont requis', 'warning');
      return;
    }

    setBusy(true);
    const payload = {
      name: form.name,
      icon: form.icon,
      category: form.category,
      is_free: form.is_free,
      price: form.is_free
        ? null
        : { fr: form.price_fr, en: form.price_en, es: form.price_es, de: form.price_de },
      platforms: form.platforms,
      device_types: form.device_types,
      blog_slug: form.blog_slug || null,
      descriptions: { fr: form.desc_fr, en: form.desc_en, es: form.desc_es, de: form.desc_de },
      steps: {
        fr: form.steps_fr.filter(Boolean),
        en: form.steps_en.filter(Boolean),
        es: form.steps_es.filter(Boolean),
        de: form.steps_de.filter(Boolean),
      },
      status: form.status,
      sort_order: form.sort_order,
    };

    try {
      const url =
        mode === 'create'
          ? '/api/cms/applications'
          : `/api/cms/applications/${initialData.id}`;
      const method = mode === 'create' ? 'POST' : 'PUT';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error);
      }
      toast(mode === 'create' ? 'Application créée !' : 'Application mise à jour !', 'success');
      router.push('/admin/applications');
    } catch (err) {
      toast(
        err instanceof Error && err.message ? err.message : 'Enregistrement impossible',
        'error'
      );
    }
    setBusy(false);
  };

  const descKey = `desc_${activeLocale}` as keyof IptvAppForm;
  const stepsKey = `steps_${activeLocale}` as keyof IptvAppForm;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => router.push('/admin/applications')}
          className="p-2 rounded-xl text-admin-text-muted hover:text-admin-text hover:bg-admin-muted transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-syne font-bold text-2xl text-admin-text">
            {mode === 'create' ? 'Nouvelle application' : `Modifier — ${initialData?.name}`}
          </h1>
          <p className="text-admin-text-secondary text-sm">
            {mode === 'create'
              ? 'Ajoutez une nouvelle application IPTV au guide d\'installation'
              : 'Modifiez les informations de cette application'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left column – general info ─────────────────────────── */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-5 space-y-4">
            <h2 className="font-semibold text-admin-text">Informations générales</h2>

            <div className="flex gap-3 items-end">
              <div className="w-16">
                <Input
                  label="Icône"
                  value={form.icon}
                  onChange={(e) => set('icon', e.target.value)}
                  className="text-center text-2xl"
                />
              </div>
              <div className="flex-1">
                <Input
                  label="Nom *"
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  required
                />
              </div>
            </div>

            <Select
              label="Catégorie *"
              value={form.category}
              onChange={(e) => set('category', e.target.value)}
              options={CATEGORIES}
            />

            <Select
              label="Statut"
              value={form.status}
              onChange={(e) => set('status', e.target.value as 'active' | 'inactive')}
              options={[
                { value: 'active', label: 'Actif' },
                { value: 'inactive', label: 'Inactif' },
              ]}
            />

            <Input
              label="Ordre d'affichage"
              type="number"
              value={String(form.sort_order)}
              onChange={(e) => set('sort_order', Number(e.target.value))}
            />

            <Input
              label="Slug blog (optionnel)"
              value={form.blog_slug}
              onChange={(e) => set('blog_slug', e.target.value)}
              placeholder="nom-de-l-article-de-blog"
            />
          </Card>

          <Card className="p-5 space-y-4">
            <h2 className="font-semibold text-admin-text">Prix</h2>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => set('is_free', !form.is_free)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  form.is_free ? 'bg-emerald-500' : 'bg-admin-border'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    form.is_free ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className="text-sm text-admin-text">
                {form.is_free ? 'Gratuit' : 'Payant'}
              </span>
            </div>
            {!form.is_free && (
              <div className="space-y-3">
                {LOCALES.map((l) => (
                  <Input
                    key={l}
                    label={`Prix ${LOCALE_LABELS[l]}`}
                    value={(form as any)[`price_${l}`]}
                    onChange={(e) => set(`price_${l}` as any, e.target.value)}
                    placeholder="ex: Payant (4,99€/an)"
                  />
                ))}
              </div>
            )}
          </Card>

          <Card className="p-5 space-y-4">
            <h2 className="font-semibold text-admin-text">Compatibilité</h2>
            <CheckboxGroup
              label="Plateformes"
              options={ALL_PLATFORMS}
              selected={form.platforms}
              onChange={(val) => set('platforms', val)}
            />
            <CheckboxGroup
              label="Types d'appareils"
              options={ALL_DEVICE_TYPES}
              selected={form.device_types}
              onChange={(val) => set('device_types', val)}
            />
          </Card>
        </div>

        {/* ── Right column – localized content ────────────────────── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Locale tabs */}
          <div className="flex gap-2">
            {LOCALES.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setActiveLocale(l)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeLocale === l
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    : 'text-admin-text-secondary hover:text-admin-text hover:bg-admin-muted border border-transparent'
                }`}
              >
                {LOCALE_LABELS[l]}
              </button>
            ))}
          </div>

          <Card className="p-5 space-y-5">
            <h2 className="font-semibold text-admin-text">
              Description — {LOCALE_LABELS[activeLocale]}
            </h2>
            <div>
              <label className="block text-sm font-medium text-admin-text-secondary mb-1.5">
                Description courte
              </label>
              <textarea
                value={form[descKey] as string}
                onChange={(e) => set(descKey, e.target.value)}
                rows={3}
                placeholder="Description courte de l'application..."
                className="w-full bg-admin-input border border-admin-border rounded-lg px-3 py-2.5 text-sm text-admin-text placeholder-admin-text-muted focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/60 transition-all resize-none"
              />
            </div>
          </Card>

          <Card className="p-5 space-y-4">
            <h2 className="font-semibold text-admin-text">
              Étapes d'installation — {LOCALE_LABELS[activeLocale]}
            </h2>
            <StepsEditor
              locale={activeLocale}
              steps={form[stepsKey] as string[]}
              onChange={(val) => set(stepsKey, val)}
            />
          </Card>
        </div>
      </div>

      {/* Footer actions */}
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={() => router.push('/admin/applications')}>
          Annuler
        </Button>
        <Button type="submit" disabled={busy}>
          {busy ? 'Enregistrement...' : mode === 'create' ? 'Créer l\'application' : 'Mettre à jour'}
        </Button>
      </div>
    </form>
  );
}
