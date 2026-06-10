'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { Upload, Search, Trash2, Folder, Grid, List } from 'lucide-react';
import type { MediaItem } from '@/lib/cms/types';
import { Card } from '@/components/admin/ui/Card';
import { Badge } from '@/components/admin/ui/Badge';
import { cn } from '@/lib/utils/cn';

export default function MediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [search, setSearch] = useState('');
  const [folder, setFolder] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [uploading, setUploading] = useState(false);
  const fetchMedia = useCallback(async () => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (folder) params.set('folder', folder);
    const res = await fetch(`/api/cms/media?${params}`);
    if (res.ok) setMedia(await res.json());
  }, [search, folder]);

  useEffect(() => { fetchMedia(); }, [fetchMedia]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder || 'general');
      await fetch('/api/cms/media', { method: 'POST', body: formData });
    }

    setUploading(false);
    fetchMedia();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce média ?')) return;
    await fetch(`/api/cms/media/${id}`, { method: 'DELETE' });
    fetchMedia();
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="font-syne font-bold text-2xl text-admin-text">Bibliothèque média</h1>
          <p className="text-admin-text-secondary">Gérez vos images et vidéos</p>
        </div>
        <label className="cursor-pointer">
          <input type="file" multiple accept="image/*,video/*" onChange={handleUpload} className="hidden" />
          <span className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-gradient-to-r from-brand-from to-brand-to text-white text-sm font-medium hover:opacity-90">
            <Upload className="w-4 h-4" />
            {uploading ? 'Upload en cours...' : 'Uploader'}
          </span>
        </label>
      </div>

      <Card className="p-16">
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-admin-text-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher des médias..."
              className="w-full pl-10 pr-16 h-10 rounded-lg border border-admin-border bg-admin-input text-admin-text"
            />
          </div>
          <select
            value={folder}
            onChange={(e) => setFolder(e.target.value)}
            className="h-10 px-3 rounded-lg border border-admin-border bg-admin-input text-admin-text"
          >
            <option value="">Tous les dossiers</option>
            <option value="general">Général</option>
            <option value="blog">Blog</option>
            <option value="pages">Pages</option>
          </select>
          <div className="flex gap-1">
            <button onClick={() => setView('grid')} className={cn('p-2 rounded-lg', view === 'grid' ? 'bg-amber-500/10 text-amber-400' : 'text-admin-text-muted')}>
              <Grid className="w-5 h-5" />
            </button>
            <button onClick={() => setView('list')} className={cn('p-2 rounded-lg', view === 'list' ? 'bg-amber-500/10 text-amber-400' : 'text-admin-text-muted')}>
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </Card>

      {view === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-16">
          {media.map((item) => (
            <Card key={item.id} className="overflow-hidden group">
              <div className="relative aspect-square bg-admin-muted">
                {item.type === 'image' ? (
                  <Image src={item.url} alt={item.alt || item.filename} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Folder className="w-12 h-12 text-admin-text-muted" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button onClick={() => handleDelete(item.id)} className="inline-flex items-center justify-center w-10 h-10 bg-red-500 hover:bg-red-600 rounded-xl text-white transition-colors" title="Supprimer">
                    <Trash2 className="w-[18px] h-[18px]" />
                  </button>
                </div>
              </div>
              <div className="p-3">
                <p className="text-xs text-admin-text truncate">{item.originalName}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[10px] text-admin-text-muted">{formatSize(item.size)}</span>
                  <Badge variant="default">{item.type}</Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="divide-y divide-admin-border">
            {media.map((item) => (
              <div key={item.id} className="flex items-center gap-16 p-16 hover:bg-admin-muted/50">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-admin-muted flex-shrink-0">
                  {item.type === 'image' && (
                    <Image src={item.url} alt="" fill className="object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-admin-text truncate">{item.originalName}</p>
                  <p className="text-xs text-admin-text-muted">{item.folder} • {formatSize(item.size)}</p>
                </div>
                <Badge variant="default">{item.type}</Badge>
                <button onClick={() => handleDelete(item.id)} className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-admin-text-muted hover:text-red-400 hover:bg-red-500/10 transition-all" title="Supprimer">
                  <Trash2 className="w-[18px] h-[18px]" />
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
