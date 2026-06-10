'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { Page, PageBlock, PageTemplate, PageStatus, SEOSettings } from '@/lib/cms/types';
import { PageBuilder } from '@/components/admin/pages/PageBuilder';
import { SEOPanel } from '@/components/admin/seo/SEOPanel';
import { Button } from '@/components/admin/ui/Button';
import { Input } from '@/components/admin/ui/Input';
import { Select } from '@/components/admin/ui/Select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/admin/ui/Card';

export default function EditPagePage() {
  const params = useParams();
  const router = useRouter();
  const [page, setPage] = useState<Page | null>(null);
  const [activeTab, setActiveTab] = useState<'builder' | 'seo'>('builder');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/cms/pages/${params.id}`).then((r) => r.json()).then(setPage);
  }, [params.id]);

  const handleSave = async () => {
    if (!page) return;
    setSaving(true);
    await fetch(`/api/cms/pages/${page.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(page),
    });
    setSaving(false);
    router.push('/admin/pages');
  };

  if (!page) return <div className="text-admin-text-muted">Chargement...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-syne font-bold text-2xl text-admin-text">Modifier : {page.title}</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.back()}>Annuler</Button>
          <Button onClick={handleSave} disabled={saving}>{saving ? 'Enregistrement...' : 'Enregistrer'}</Button>
        </div>
      </div>

      <div className="flex gap-1 border-b border-admin-border">
        {(['builder', 'seo'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 ${
              activeTab === tab ? 'border-amber-500 text-amber-400' : 'border-transparent text-admin-text-secondary'
            }`}
          >
            {tab === 'builder' ? 'Page Builder' : 'SEO'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {activeTab === 'builder' ? (
            <Card>
              <CardHeader><CardTitle>Blocs de page</CardTitle></CardHeader>
              <CardContent>
                <PageBuilder
                  sections={page.sections}
                  onChange={(sections: PageBlock[]) => setPage({ ...page, sections })}
                />
              </CardContent>
            </Card>
          ) : (
            <SEOPanel
              seo={page.seo}
              onChange={(seo: SEOSettings) => setPage({ ...page, seo })}
              postTitle={page.title}
              postContent=""
            />
          )}
        </div>
        <Card>
          <CardContent className="space-y-16 pt-24">
            <Input label="Titre" value={page.title} onChange={(e) => setPage({ ...page, title: e.target.value })} />
            <Input label="Slug" value={page.slug} onChange={(e) => setPage({ ...page, slug: e.target.value })} />
            <Select
              label="Template"
              value={page.template}
              onChange={(e) => setPage({ ...page, template: e.target.value as PageTemplate })}
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
              value={page.status}
              onChange={(e) => setPage({ ...page, status: e.target.value as PageStatus })}
              options={[
                { value: 'draft', label: 'Brouillon' },
                { value: 'published', label: 'Publié' },
              ]}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
