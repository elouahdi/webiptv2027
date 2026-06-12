'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/admin/ui/Button';
import { Input } from '@/components/admin/ui/Input';
import { Select } from '@/components/admin/ui/Select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/admin/ui/Card';

export default function EditApplicationPage() {
  const params = useParams();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/cms/applications/${params.id}`).then(r => r.json()).then(setForm);
  }, [params.id]);

  const handleSubmit = async () => {
    if (!form?.name) return;
    setSaving(true);
    setSaved(false);
    await fetch(`/api/cms/applications/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const addStep = () => setForm({ ...form, steps: [...(form.steps || []), ''] });
  const updateStep = (i: number, val: string) => {
    const steps = [...(form.steps || [])];
    steps[i] = val;
    setForm({ ...form, steps });
  };

  const togglePlatform = (p: string) => {
    const platforms = (form.platforms || []).includes(p)
      ? form.platforms.filter((x: string) => x !== p)
      : [...(form.platforms || []), p];
    setForm({ ...form, platforms });
  };

  if (!form) return <div className="text-admin-text-muted p-8">Chargement...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-syne font-bold text-2xl text-admin-text">Modifier : {form.name}</h1>
        <div className="flex gap-2 items-center">
          {saved && <span className="text-green-400 text-sm">✅ Enregistré !</span>}
          <Button variant="outline" onClick={() => router.back()}>Annuler</Button>
          <Button onClick={handleSubmit} disabled={saving}>{saving ? 'Enregistrement...' : 'Enregistrer'}</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Informations</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-admin-text">Nom</label>
              <Input value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium text-admin-text">Slug</label>
              <Input value={form.slug || ''} onChange={e => setForm({ ...form, slug: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium text-admin-text">Logo</label>
              <Input value={form.logo || ''} onChange={e => setForm({ ...form, logo: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium text-admin-text">Catégorie</label>
              <Select value={form.category || 'smartphone'} onChange={e => setForm({ ...form, category: e.target.value })}>
                <option value="smartphone">📱 Smartphone/Tablette</option>
                <option value="smart_tv">📺 Smart TV</option>
                <option value="computer">💻 Ordinateur</option>
                <option value="box">📦 Box Android/Fire Stick</option>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-admin-text">Prix</label>
                <Select value={form.price_type || 'free'} onChange={e => setForm({ ...form, price_type: e.target.value })}>
                  <option value="free">Gratuit</option>
                  <option value="paid">Payant</option>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-admin-text">Montant</label>
                <Input value={form.price_amount || ''} onChange={e => setForm({ ...form, price_amount: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-admin-text">Statut</label>
              <Select value={form.status || 'active'} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-admin-text">Ordre</label>
              <Input type="number" value={form.sort_order || 0} onChange={e => setForm({ ...form, sort_order: Number(e.target.value) })} />
            </div>
            <div>
              <label className="text-sm font-medium text-admin-text">Description</label>
              <textarea value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full rounded-xl bg-bg-card border border-border text-text-primary p-3 text-sm" />
            </div>
            <div>
              <label className="text-sm font-medium text-admin-text">URL guide</label>
              <Input value={form.guide_url || ''} onChange={e => setForm({ ...form, guide_url: e.target.value })} />
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
                      (form.platforms || []).includes(p) ? 'bg-amber-500/20 border-amber-500 text-amber-400' : 'border-admin-border text-admin-text-secondary'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Étapes</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {(form.steps || []).map((step: string, i: number) => (
                <Input key={i} value={step} onChange={e => updateStep(i, e.target.value)} placeholder={`Étape ${i + 1}`} />
              ))}
              <Button variant="outline" onClick={addStep}>+ Ajouter une étape</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
