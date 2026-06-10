'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageBuilder } from '@/components/admin/pages/PageBuilder';
import { Button } from '@/components/admin/ui/Button';
import { Input } from '@/components/admin/ui/Input';
import { Select } from '@/components/admin/ui/Select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/admin/ui/Card';
import type { PageBlock, PageTemplate, PageStatus } from '@/lib/cms/types';
import { generateSlug } from '@/lib/cms/services/slug';

export default function CreatePagePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [template, setTemplate] = useState<PageTemplate>('custom');
  const [status, setStatus] = useState<PageStatus>('draft');
  const [sections, setSections] = useState<PageBlock[]>([]);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch('/api/cms/pages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, slug: slug || generateSlug(title), template, status, sections }),
    });
    if (res.ok) router.push('/admin/pages');
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-syne font-bold text-2xl text-admin-text">Nouvelle page</h1>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>Annuler</Button>
          <Button type="submit" disabled={saving}>{saving ? 'Enregistrement...' : 'Enregistrer'}</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader><CardTitle>Page Builder</CardTitle></CardHeader>
            <CardContent>
              <PageBuilder sections={sections} onChange={setSections} />
            </CardContent>
          </Card>
        </div>
        <div className="space-y-16">
          <Card>
            <CardContent className="space-y-16 pt-24">
              <Input label="Titre" value={title} onChange={(e) => { setTitle(e.target.value); setSlug(generateSlug(e.target.value)); }} required />
              <Input label="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
              <Select
                label="Template"
                value={template}
                onChange={(e) => setTemplate(e.target.value as PageTemplate)}
                options={[
                  { value: 'custom', label: 'Personnalisée' },
                  { value: 'home', label: 'Accueil' },
                  { value: 'about', label: 'À propos' },
                  { value: 'contact', label: 'Contact' },
                  { value: 'privacy', label: 'Confidentialité' },
                  { value: 'terms', label: 'CGU' },
                ]}
              />
              <Select
                label="Statut"
                value={status}
                onChange={(e) => setStatus(e.target.value as PageStatus)}
                options={[
                  { value: 'draft', label: 'Brouillon' },
                  { value: 'published', label: 'Publié' },
                ]}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
