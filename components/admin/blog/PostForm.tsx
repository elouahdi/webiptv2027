'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, CloudUpload, CircleDot, Loader2 } from 'lucide-react';
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
import { useToast } from '../ui/Toast';
import { calculateReadingTime } from '@/lib/cms/services/reading-time';

interface PostFormProps {
  post?: Post;
  mode: 'create' | 'edit';
}

type SaveStatus = 'idle' | 'dirty' | 'saving' | 'saved';

export function PostForm({ post, mode }: PostFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
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

  const initializedRef = useRef(false);
  const skipDirtyRef = useRef(false);

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

  // Track unsaved changes (skipped on first render and after programmatic updates)
  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      return;
    }
    if (skipDirtyRef.current) {
      skipDirtyRef.current = false;
      return;
    }
    setSaveStatus('dirty');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, slug, excerpt, content, status, scheduledAt, categoryId, tagIds, featuredImageId, galleryImageIds, seo]);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (saveStatus === 'dirty') {
        e.preventDefault();
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [saveStatus]);

  const readTime = calculateReadingTime(content);

  const savePost = useCallback(
    async (opts: { statusOverride?: PostStatus; redirect?: boolean; silent?: boolean } = {}) => {
      const effectiveStatus = opts.statusOverride ?? status;
      setSaving(true);
      setSaveStatus('saving');

      const payload = {
        title,
        slug,
        excerpt,
        content,
        status: effectiveStatus,
        scheduledAt:
          effectiveStatus === 'scheduled' && scheduledAt ? new Date(scheduledAt).toISOString() : null,
        categoryId: categoryId || null,
        tagIds,
        authorId,
        featuredImageId,
        galleryImageIds,
        seo,
      };

      const url = mode === 'create' ? '/api/cms/posts' : `/api/cms/posts/${post!.id}`;
      const method = mode === 'create' ? 'POST' : 'PUT';

      try {
        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error();

        if (opts.statusOverride && opts.statusOverride !== status) {
          skipDirtyRef.current = true;
          setStatus(opts.statusOverride);
        }
        setSaveStatus('saved');
        if (!opts.silent) {
          toast(
            opts.statusOverride === 'published' ? 'Article publié' : 'Article enregistré',
            'success'
          );
        }
        if (opts.redirect || mode === 'create') {
          router.push('/admin/blog/posts');
          router.refresh();
        }
      } catch {
        setSaveStatus('dirty');
        toast('Enregistrement impossible', 'error');
      }
      setSaving(false);
    },
    [title, slug, excerpt, content, status, scheduledAt, categoryId, tagIds, authorId, featuredImageId, galleryImageIds, seo, mode, post, router, toast]
  );

  // Autosave in edit mode, 3s after the last change
  useEffect(() => {
    if (mode !== 'edit' || saveStatus !== 'dirty') return;
    const timer = setTimeout(() => {
      savePost({ silent: true });
    }, 3000);
    return () => clearTimeout(timer);
  }, [saveStatus, mode, savePost]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    savePost({ redirect: true });
  };

  const handleCancel = () => {
    if (saveStatus === 'dirty' && !window.confirm('Des modifications ne sont pas enregistrées. Quitter quand même ?')) {
      return;
    }
    router.back();
  };

  const toggleTag = (id: string) => {
    setTagIds((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]));
  };

  const tabs = [
    { id: 'content' as const, label: 'Contenu' },
    { id: 'seo' as const, label: 'SEO' },
    { id: 'media' as const, label: 'Médias' },
  ];

  const saveIndicator = {
    idle: null,
    dirty: (
      <span className="inline-flex items-center gap-1.5 text-xs text-yellow-400">
        <CircleDot className="w-3.5 h-3.5" /> Non enregistré
      </span>
    ),
    saving: (
      <span className="inline-flex items-center gap-1.5 text-xs text-admin-text-secondary">
        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Enregistrement...
      </span>
    ),
    saved: (
      <span className="inline-flex items-center gap-1.5 text-xs text-green-400">
        <CheckCircle2 className="w-3.5 h-3.5" /> Enregistré
      </span>
    ),
  }[saveStatus];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-16">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-syne font-bold text-2xl text-admin-text">
              {mode === 'create' ? 'Nouvel article' : 'Modifier l\'article'}
            </h1>
            {saveIndicator}
          </div>
          <p className="text-admin-text-secondary text-sm mt-1">
            {readTime} min de lecture • Slug: /blog/{slug || '...'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Annuler
          </Button>
          <Button
            type="button"
            variant="secondary"
            disabled={saving}
            onClick={() => savePost({ statusOverride: 'draft' })}
          >
            Enregistrer brouillon
          </Button>
          <Button
            type="button"
            disabled={saving}
            onClick={() => savePost({ statusOverride: status === 'scheduled' ? 'scheduled' : 'published', redirect: true })}
          >
            <CloudUpload className="w-4 h-4" />
            {saving ? 'Enregistrement...' : status === 'published' || mode === 'edit' ? 'Mettre à jour' : 'Publier'}
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
