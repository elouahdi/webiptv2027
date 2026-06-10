'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Post, Category, Tag, SEOSettings, User, PostStatus } from '@/lib/cms/types';
import { DEFAULT_SEO } from '@/lib/cms/types';
import { generateSlug } from '@/lib/cms/services/slug';
import { TiptapEditor } from '../editor/TiptapEditor';
import { SEOPanel } from '../seo/SEOPanel';
import { MediaPicker } from '../media/MediaPicker';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { calculateReadingTime } from '@/lib/cms/services/reading-time';

interface PostFormProps {
  post?: Post;
  mode: 'create' | 'edit';
}

export function PostForm({ post, mode }: PostFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [users, setUsers] = useState<Omit<User, 'passwordHash'>[]>([]);
  const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'media'>('content');

  const [title, setTitle] = useState(post?.title || '');
  const [slug, setSlug] = useState(post?.slug || '');
  const [excerpt, setExcerpt] = useState(post?.excerpt || '');
  const [content, setContent] = useState(post?.content || '');
  const [status, setStatus] = useState<PostStatus>(post?.status || 'draft');
  const [scheduledAt, setScheduledAt] = useState(post?.scheduledAt?.slice(0, 16) || '');
  const [categoryId, setCategoryId] = useState(post?.categoryId || '');
  const [tagIds, setTagIds] = useState<string[]>(post?.tagIds || []);
  const [authorId, setAuthorId] = useState(post?.authorId || '');
  const [featuredImageId, setFeaturedImageId] = useState(post?.featuredImageId || null);
  const [galleryImageIds, setGalleryImageIds] = useState<string[]>(post?.galleryImageIds || []);
  const [seo, setSeo] = useState<SEOSettings>(post?.seo || { ...DEFAULT_SEO });
  const [autoSlug, setAutoSlug] = useState(mode === 'create');

  useEffect(() => {
    Promise.all([
      fetch('/api/cms/categories').then((r) => r.json()),
      fetch('/api/cms/tags').then((r) => r.json()),
      fetch('/api/cms/users').then((r) => r.json()),
    ]).then(([cats, tgs, usrs]) => {
      setCategories(cats);
      setTags(tgs);
      setUsers(usrs);
      if (!authorId && usrs.length) setAuthorId(usrs[0].id);
    });
  }, [authorId]);

  useEffect(() => {
    if (autoSlug && title) setSlug(generateSlug(title));
  }, [title, autoSlug]);

  const readTime = calculateReadingTime(content);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      title,
      slug,
      excerpt,
      content,
      status,
      scheduledAt: status === 'scheduled' && scheduledAt ? new Date(scheduledAt).toISOString() : null,
      categoryId: categoryId || null,
      tagIds,
      authorId,
      featuredImageId,
      galleryImageIds,
      seo,
    };

    const url = mode === 'create' ? '/api/cms/posts' : `/api/cms/posts/${post!.id}`;
    const method = mode === 'create' ? 'POST' : 'PUT';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push('/admin/blog/posts');
      router.refresh();
    }
    setSaving(false);
  };

  const toggleTag = (id: string) => {
    setTagIds((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]));
  };

  const tabs = [
    { id: 'content' as const, label: 'Contenu' },
    { id: 'seo' as const, label: 'SEO' },
    { id: 'media' as const, label: 'Médias' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-16">
        <div>
          <h1 className="font-syne font-bold text-2xl text-admin-text">
            {mode === 'create' ? 'Nouvel article' : 'Modifier l\'article'}
          </h1>
          <p className="text-admin-text-secondary text-sm mt-1">
            {readTime} min de lecture • Slug: /blog/{slug || '...'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Annuler
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </div>
      </div>

      <div className="flex gap-1 border-b border-admin-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-admin-text-secondary hover:text-admin-text'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'content' && (
            <>
              <Card>
                <CardContent className="space-y-16 pt-24">
                  <Input
                    label="Titre"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                  <div className="flex gap-3 items-end">
                    <div className="flex-1">
                      <Input
                        label="Slug"
                        value={slug}
                        onChange={(e) => { setSlug(e.target.value); setAutoSlug(false); }}
                        required
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => { setSlug(generateSlug(title)); setAutoSlug(true); }}
                    >
                      Générer
                    </Button>
                  </div>
                  <Textarea
                    label="Extrait"
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    rows={2}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contenu</CardTitle>
                </CardHeader>
                <CardContent>
                  <TiptapEditor content={content} onChange={setContent} />
                </CardContent>
              </Card>
            </>
          )}

          {activeTab === 'seo' && (
            <SEOPanel
              seo={seo}
              onChange={setSeo}
              postTitle={title}
              postContent={content}
            />
          )}

          {activeTab === 'media' && (
            <Card>
              <CardContent className="space-y-6 pt-6">
                <MediaPicker
                  label="Image à la une"
                  value={featuredImageId}
                  onChange={(id) => setFeaturedImageId(id)}
                />
                <div>
                  <label className="block text-sm font-medium text-admin-text mb-3">
                    Galerie d&apos;images
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {galleryImageIds.map((id, index) => (
                      <MediaPicker
                        key={`${id}-${index}`}
                        value={id}
                        onChange={(newId) => {
                          setGalleryImageIds((prev) => {
                            if (!newId) return prev.filter((_, i) => i !== index);
                            const updated = [...prev];
                            updated[index] = newId;
                            return updated;
                          });
                        }}
                      />
                    ))}
                    <button
                      type="button"
                      onClick={() => setGalleryImageIds((prev) => [...prev, ''])}
                      className="w-24 h-24 rounded-lg border-2 border-dashed border-admin-border text-admin-text-muted text-sm hover:border-brand-from"
                    >
                      + Ajouter
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-16">
          <Card>
            <CardHeader>
              <CardTitle>Publication</CardTitle>
            </CardHeader>
            <CardContent className="space-y-16">
              <Select
                label="Statut"
                value={status}
                onChange={(e) => setStatus(e.target.value as PostStatus)}
                options={[
                  { value: 'draft', label: 'Brouillon' },
                  { value: 'published', label: 'Publié' },
                  { value: 'scheduled', label: 'Programmé' },
                ]}
              />
              {status === 'scheduled' && (
                <Input
                  label="Date de publication"
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                />
              )}
              <Select
                label="Auteur"
                value={authorId}
                onChange={(e) => setAuthorId(e.target.value)}
                options={users.map((u) => ({ value: u.id, label: u.name }))}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Catégorie</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                options={[
                  { value: '', label: 'Aucune' },
                  ...categories.map((c) => ({ value: c.id, label: c.name })),
                ]}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                  >
                    <Badge variant={tagIds.includes(tag.id) ? 'info' : 'default'}>
                      {tag.name}
                    </Badge>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
