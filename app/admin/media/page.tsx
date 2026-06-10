'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import {
  Upload,
  Search,
  Trash2,
  Grid,
  List,
  Copy,
  Eye,
  FileVideo,
  FileText,
  HardDrive,
} from 'lucide-react';
import type { MediaItem, MediaType } from '@/lib/cms/types';
import { Card } from '@/components/admin/ui/Card';
import { Badge } from '@/components/admin/ui/Badge';
import { Button } from '@/components/admin/ui/Button';
import { Modal } from '@/components/admin/ui/Modal';
import { Skeleton } from '@/components/admin/ui/Skeleton';
import { useToast } from '@/components/admin/ui/Toast';
import { cn } from '@/lib/utils/cn';

// Indicative quota used only for the storage usage bar
const SOFT_QUOTA_BYTES = 1024 * 1024 * 1024; // 1 GB

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

function TypeIcon({ type, className }: { type: MediaType; className?: string }) {
  if (type === 'video') return <FileVideo className={className} />;
  return <FileText className={className} />;
}

export default function MediaPage() {
  const { toast } = useToast();
  const [media, setMedia] = useState<MediaItem[] | null>(null);
  const [search, setSearch] = useState('');
  const [folder, setFolder] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [uploadProgress, setUploadProgress] = useState<{ done: number; total: number } | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState<MediaItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MediaItem | null>(null);
  const [busy, setBusy] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = useCallback(async () => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (folder) params.set('folder', folder);
    if (typeFilter) params.set('type', typeFilter);
    try {
      const res = await fetch(`/api/cms/media?${params}`);
      if (!res.ok) throw new Error();
      setMedia(await res.json());
    } catch {
      setMedia([]);
      toast('Impossible de charger les médias', 'error');
    }
  }, [search, folder, typeFilter, toast]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const uploadFiles = async (files: FileList | File[]) => {
    const list = Array.from(files);
    if (list.length === 0) return;
    setUploadProgress({ done: 0, total: list.length });

    let failed = 0;
    for (let i = 0; i < list.length; i++) {
      const formData = new FormData();
      formData.append('file', list[i]);
      formData.append('folder', folder || 'general');
      try {
        const res = await fetch('/api/cms/media', { method: 'POST', body: formData });
        if (!res.ok) failed++;
      } catch {
        failed++;
      }
      setUploadProgress({ done: i + 1, total: list.length });
    }

    setUploadProgress(null);
    if (failed === 0) {
      toast(`${list.length} fichier(s) uploadé(s)`, 'success');
    } else {
      toast(`${list.length - failed} uploadé(s), ${failed} en échec`, 'warning');
    }
    fetchMedia();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      uploadFiles(e.dataTransfer.files);
    }
  };

  const copyUrl = async (item: MediaItem) => {
    try {
      const absolute = item.url.startsWith('http') ? item.url : `${window.location.origin}${item.url}`;
      await navigator.clipboard.writeText(absolute);
      toast('URL copiée dans le presse-papiers', 'success');
    } catch {
      toast('Copie impossible', 'error');
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/cms/media/${deleteTarget.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      toast('Média supprimé', 'success');
      setPreview(null);
      fetchMedia();
    } catch {
      toast('Suppression impossible', 'error');
    }
    setDeleteTarget(null);
    setBusy(false);
  };

  const totalSize = (media ?? []).reduce((sum, m) => sum + m.size, 0);
  const usagePercent = Math.min((totalSize / SOFT_QUOTA_BYTES) * 100, 100);

  const inputClass =
    'h-10 px-3 rounded-lg border border-admin-border bg-admin-input text-admin-text text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/30';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="font-syne font-bold text-2xl text-admin-text">Bibliothèque média</h1>
          <p className="text-admin-text-secondary">Gérez vos images, vidéos et documents</p>
        </div>
        <Button onClick={() => fileInputRef.current?.click()} disabled={!!uploadProgress}>
          <Upload className="w-4 h-4" />
          {uploadProgress ? `Upload ${uploadProgress.done}/${uploadProgress.total}...` : 'Uploader'}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*,.pdf,.doc,.docx"
          onChange={(e) => {
            if (e.target.files) uploadFiles(e.target.files);
            e.target.value = '';
          }}
          className="hidden"
        />
      </div>

      {/* Drag & drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          'rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-all',
          dragOver
            ? 'border-amber-500 bg-amber-500/10'
            : 'border-admin-border hover:border-amber-500/50 hover:bg-admin-muted/30'
        )}
      >
        <Upload className="w-8 h-8 mx-auto text-admin-text-muted mb-2" />
        <p className="text-sm text-admin-text font-medium">
          Glissez-déposez vos fichiers ici, ou cliquez pour parcourir
        </p>
        <p className="text-xs text-admin-text-muted mt-1">Images, vidéos et documents · upload multiple supporté</p>
        {uploadProgress && (
          <div className="max-w-xs mx-auto mt-3">
            <div className="h-1.5 bg-admin-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-300"
                style={{ width: `${(uploadProgress.done / uploadProgress.total) * 100}%` }}
              />
            </div>
            <p className="text-xs text-admin-text-muted mt-1">
              {uploadProgress.done} / {uploadProgress.total} fichiers
            </p>
          </div>
        )}
      </div>

      {/* Filters + storage usage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <Card className="p-16 lg:col-span-2">
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-admin-text-muted" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher des médias..."
                className={`${inputClass} w-full pl-10`}
              />
            </div>
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className={inputClass}>
              <option value="">Tous les types</option>
              <option value="image">Images</option>
              <option value="video">Vidéos</option>
              <option value="document">Documents</option>
            </select>
            <select value={folder} onChange={(e) => setFolder(e.target.value)} className={inputClass}>
              <option value="">Tous les dossiers</option>
              <option value="general">Général</option>
              <option value="blog">Blog</option>
              <option value="pages">Pages</option>
            </select>
            <div className="flex gap-1">
              <button
                onClick={() => setView('grid')}
                className={cn('p-2 rounded-lg transition-colors', view === 'grid' ? 'bg-amber-500/10 text-amber-400' : 'text-admin-text-muted hover:text-admin-text')}
                title="Vue grille"
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setView('list')}
                className={cn('p-2 rounded-lg transition-colors', view === 'list' ? 'bg-amber-500/10 text-amber-400' : 'text-admin-text-muted hover:text-admin-text')}
                title="Vue liste"
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </Card>

        <Card className="p-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
              <HardDrive className="w-5 h-5 text-amber-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline">
                <p className="text-sm font-medium text-admin-text">{formatSize(totalSize)} utilisés</p>
                <p className="text-xs text-admin-text-muted">{media?.length ?? 0} fichiers</p>
              </div>
              <div className="h-1.5 bg-admin-muted rounded-full overflow-hidden mt-2">
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-500',
                    usagePercent > 80 ? 'bg-red-500' : 'bg-gradient-to-r from-amber-500 to-amber-400'
                  )}
                  style={{ width: `${usagePercent}%` }}
                />
              </div>
              <p className="text-[10px] text-admin-text-muted mt-1">sur {formatSize(SOFT_QUOTA_BYTES)} (indicatif)</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Content */}
      {media === null ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-16">
          {[...Array(10)].map((_, i) => (
            <Skeleton key={i} className="aspect-square w-full" />
          ))}
        </div>
      ) : media.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-admin-text-muted text-sm">Aucun média trouvé</p>
        </Card>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-16">
          {media.map((item) => (
            <Card key={item.id} className="overflow-hidden group">
              <div className="relative aspect-square bg-admin-muted cursor-pointer" onClick={() => setPreview(item)}>
                {item.type === 'image' ? (
                  <Image src={item.url} alt={item.alt || item.filename} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <TypeIcon type={item.type} className="w-12 h-12 text-admin-text-muted" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreview(item);
                    }}
                    className="inline-flex items-center justify-center w-9 h-9 bg-white/15 hover:bg-white/25 rounded-xl text-white transition-colors"
                    title="Aperçu"
                  >
                    <Eye className="w-[18px] h-[18px]" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyUrl(item);
                    }}
                    className="inline-flex items-center justify-center w-9 h-9 bg-white/15 hover:bg-white/25 rounded-xl text-white transition-colors"
                    title="Copier l'URL"
                  >
                    <Copy className="w-[18px] h-[18px]" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteTarget(item);
                    }}
                    className="inline-flex items-center justify-center w-9 h-9 bg-red-500 hover:bg-red-600 rounded-xl text-white transition-colors"
                    title="Supprimer"
                  >
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
                <div
                  className="relative w-12 h-12 rounded-lg overflow-hidden bg-admin-muted flex-shrink-0 cursor-pointer"
                  onClick={() => setPreview(item)}
                >
                  {item.type === 'image' ? (
                    <Image src={item.url} alt="" fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <TypeIcon type={item.type} className="w-5 h-5 text-admin-text-muted" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-admin-text truncate">{item.originalName}</p>
                  <p className="text-xs text-admin-text-muted">
                    {item.folder} • {formatSize(item.size)} • {new Date(item.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <Badge variant="default">{item.type}</Badge>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPreview(item)}
                    className="inline-flex items-center justify-center w-9 h-9 rounded-xl text-admin-text-muted hover:text-blue-400 hover:bg-blue-500/10 transition-all"
                    title="Aperçu"
                  >
                    <Eye className="w-[18px] h-[18px]" />
                  </button>
                  <button
                    onClick={() => copyUrl(item)}
                    className="inline-flex items-center justify-center w-9 h-9 rounded-xl text-admin-text-muted hover:text-amber-400 hover:bg-amber-500/10 transition-all"
                    title="Copier l'URL"
                  >
                    <Copy className="w-[18px] h-[18px]" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(item)}
                    className="inline-flex items-center justify-center w-9 h-9 rounded-xl text-admin-text-muted hover:text-red-400 hover:bg-red-500/10 transition-all"
                    title="Supprimer"
                  >
                    <Trash2 className="w-[18px] h-[18px]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Preview modal */}
      <Modal open={!!preview} onOpenChange={() => setPreview(null)} title={preview?.originalName ?? ''}>
        {preview && (
          <div className="space-y-16">
            <div className="relative w-full h-64 bg-admin-muted rounded-xl overflow-hidden">
              {preview.type === 'image' ? (
                <Image src={preview.url} alt={preview.alt || preview.filename} fill className="object-contain" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <TypeIcon type={preview.type} className="w-16 h-16 text-admin-text-muted" />
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-admin-text-muted uppercase tracking-wider">Type</p>
                <p className="text-admin-text">{preview.mimeType}</p>
              </div>
              <div>
                <p className="text-xs text-admin-text-muted uppercase tracking-wider">Taille</p>
                <p className="text-admin-text">{formatSize(preview.size)}</p>
              </div>
              {preview.width && preview.height && (
                <div>
                  <p className="text-xs text-admin-text-muted uppercase tracking-wider">Dimensions</p>
                  <p className="text-admin-text">
                    {preview.width} × {preview.height} px
                  </p>
                </div>
              )}
              <div>
                <p className="text-xs text-admin-text-muted uppercase tracking-wider">Dossier</p>
                <p className="text-admin-text">{preview.folder}</p>
              </div>
              <div>
                <p className="text-xs text-admin-text-muted uppercase tracking-wider">Ajouté le</p>
                <p className="text-admin-text">{new Date(preview.createdAt).toLocaleDateString('fr-FR')}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-admin-muted border border-admin-border">
              <p className="flex-1 text-xs text-admin-text-secondary truncate font-mono">{preview.url}</p>
              <Button size="sm" variant="outline" onClick={() => copyUrl(preview)}>
                <Copy className="w-3.5 h-3.5" /> Copier
              </Button>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="danger" onClick={() => setDeleteTarget(preview)}>
                <Trash2 className="w-4 h-4" /> Supprimer
              </Button>
              <Button variant="outline" onClick={() => setPreview(null)}>
                Fermer
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete confirmation */}
      <Modal
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
        title="Supprimer le média"
        description={`« ${deleteTarget?.originalName ?? ''} » sera définitivement supprimé.`}
      >
        <div className="flex gap-3 justify-end mt-16">
          <Button variant="outline" onClick={() => setDeleteTarget(null)}>
            Annuler
          </Button>
          <Button variant="danger" disabled={busy} onClick={confirmDelete}>
            Supprimer
          </Button>
        </div>
      </Modal>
    </div>
  );
}
