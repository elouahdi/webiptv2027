'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/admin/ui/Button';
import { Input } from '@/components/admin/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/admin/ui/Card';

export default function CreateApplicationPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    logo: '📱',
    category: 'smartphone',
    price_type: 'free',
    price_amount: '',
    description: '',
    guide_url: '',
    sort_order: 0,
    status: 'active',
    steps: [''],
    platforms: [] as string[],
  });

  const handleSubmit = async () => {
    if (!form.name) return alert('Nom requis');
    setSaving(true);
    const body = {
      ...form,
      steps: form.steps.filter(s => s.trim()),
      slug: form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    };
    const res = await fetch('/api/cms/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    setSaving(false);
    if (res.ok) router.push('/admin/applications');
  };

  const addStep = () => setForm({ ...form, steps: [...form.steps, ''] });
  const updateStep = (i: number, val: string) => {
    const steps = [...form.steps];
    steps[i] = val;
    setForm({ ...form, steps });
  };

  const togglePlatform = (p: string) => {
    const platforms = form.platforms.includes(p)
      ? form.platforms.filter(x => x !== p)
      : [...form.platforms, p];
    setForm({ ...form, platforms });
  };

  const inputClass = "w-full px-3 py-2.5 rounded-xl bg-bg-card border border-border text-text-primary text-sm focus:outline-none focus:border-[var(--brand-from)]/50";
  const selectClass = "w-full px-3 py-2.5 rounded-xl bg-bg-card border border-border text-text-primary text-sm focus:outline-none focus:border-[var(--brand-from)]/50";
  const labelClass = "text-sm font-medium text-admin-text mb-1.5 block";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-syne font-bold text-2xl text-admin-text">Nouvelle application</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.back()}>Annuler</Button>
          <Button onClick={handleSubmit} disabled={saving}>{saving ? 'Création...' : 'Créer'}</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Informations</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className={labelClass}>Nom *</label>
              <input className={inputClass} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="GSE Smart IPTV" />
            </div>
            <div>
              <label className={labelClass}>Logo (emoji)</label>
              <input className={inputClass} value={form.logo} onChange={e => setForm({ ...form, logo: e.target.value })} placeholder="📱" />
            </div>
            <div>
              <label className={labelClass}>Catégorie</label>
              <select className={selectClass} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                <option value="smartphone">📱 Smartphone/Tablette</option>
                <option value="smart_tv">📺 Smart TV</option>
                <option value="computer">💻 Ordinateur</option>
                <option value="box">📦 Box Android/Fire Stick</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Type de prix</label>
                <select className={selectClass} value={form.price_type} onChange={e => setForm({ ...form, price_type: e.target.value })}>
                  <option value="free">Gratuit</option>
                  <option value="paid">Payant</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Prix</label>
                <input className={inputClass} value={form.price_amount} onChange={e => setForm({ ...form, price_amount: e.target.value })} placeholder="5,49€" />
              </div>
            </div>
            <div>
              <label className={labelClass}>Statut</label>
              <select className={selectClass} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Ordre</label>
              <input className={inputClass} type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: Number(e.target.value) })} />
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <textarea className={inputClass} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} />
            </div>
            <div>
              <label className={labelClass}>URL guide dédié (optionnel)</label>
              <input className={inputClass} value={form.guide_url} onChange={e => setForm({ ...form, guide_url: e.target.value })} placeholder="/blog/guide-gse-smart-iptv" />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Plateformes</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {['ios', 'android', 'samsung', 'lg', 'windows', 'mac', 'linux', 'firestick', 'androidtv', 'formuler'].map(p => (
                  <button key={p} onClick={() => togglePlatform(p)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      form.platforms.includes(p) ? 'bg-amber-500/20 border-amber-500 text-amber-400' : 'border-admin-border text-admin-text-secondary'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Étapes d'installation</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {(form.steps || []).map((step, i) => (
                <input key={i} className={inputClass} value={step} onChange={e => updateStep(i, e.target.value)} placeholder={`Étape ${i + 1}`} />
              ))}
              <Button variant="outline" onClick={addStep}>+ Ajouter une étape</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
