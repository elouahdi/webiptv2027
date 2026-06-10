'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Upload, Search, Folder, X, Image as ImageIcon } from 'lucide-react';
import type { MediaItem } from '@/lib/cms/types';
import { Modal } from '../ui/Modal';
import { cn } from '@/lib/utils/cn';

interface MediaPickerProps {
  value?: string | null;
  onChange: (mediaId: string | null, media?: MediaItem) => void;
  label?: string;
  accept?: string;
}

export function MediaPicker({ value, onChange, label, accept = 'image/*' }: MediaPickerProps) {
  const [open, setOpen] = useState(false);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [selected, setSelected] = useState<MediaItem | null>(null);
  const [search, setSearch] = useState('');
  const [folder] = useState('');
  const [uploading, setUploading] = useState(false);

  const fetchMedia = useCallback(async () => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (folder) params.set('folder', folder);
    const res = await fetch(`/api/cms/media?${params}`);
    if (res.ok) setMedia(await res.json());
  }, [search, folder]);

  useEffect(() => {
    if (open) fetchMedia();
  }, [open, fetchMedia]);

  useEffect(() => {
    if (value && media.length) {
      setSelected(media.find((m) => m.id === value) ?? null);
    }
  }, [value, media]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder || 'general');

    const res = await fetch('/api/cms/media', { method: 'POST', body: formData });
    if (res.ok) {
      await fetchMedia();
    }
    setUploading(false);
  };

  const handleSelect = (item: MediaItem) => {
    onChange(item.id, item);
    setSelected(item);
    setOpen(false);
  };

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-admin-text">{label}</label>}

      <div className="flex items-center gap-3">
        {selected ? (
          <div className="relative w-24 h-24 rounded-lg border border-admin-border overflow-hidden">
            {selected.type === 'image' ? (
              <Image src={selected.url} alt={selected.alt} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-admin-muted">
                <ImageIcon className="w-8 h-8 text-admin-text-muted" />
              </div>
            )}
            <button
              type="button"
              onClick={() => { onChange(null); setSelected(null); }}
              className="absolute top-1 right-1 p-0.5 bg-red-500 rounded-full text-white"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="w-24 h-24 rounded-lg border-2 border-dashed border-admin-border flex flex-col items-center justify-center text-admin-text-muted hover:border-brand-from hover:text-brand-from transition-colors"
          >
            <ImageIcon className="w-6 h-6 mb-1" />
            <span className="text-xs">Choisir</span>
          </button>
        )}
      </div>

      <Modal open={open} onOpenChange={setOpen} title="Bibliothèque média" className="max-w-4xl">
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-admin-text-muted" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher..."
                className="w-full pl-10 pr-4 h-10 rounded-lg border border-admin-border bg-admin-input text-admin-text"
              />
            </div>
            <label className="cursor-pointer">
              <input type="file" accept={accept} onChange={handleUpload} className="hidden" />
              <span className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-brand-from text-white text-sm font-medium hover:opacity-90">
                <Upload className="w-4 h-4" />
                {uploading ? 'Upload...' : 'Uploader'}
              </span>
            </label>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 max-h-[400px] overflow-y-auto">
            {media.map((item, index) => (
              <button
                key={`${item.id}-${index}`}
                type="button"
                onClick={() => handleSelect(item)}
                className={cn(
                  'relative aspect-square rounded-lg border overflow-hidden transition-all hover:ring-2 hover:ring-brand-from',
                  value === item.id && 'ring-2 ring-brand-from'
                )}
              >
                {item.type === 'image' ? (
                  <Image src={item.url} alt={item.alt} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-admin-muted">
                    <Folder className="w-8 h-8 text-admin-text-muted" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
}
