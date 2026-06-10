'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import type { Tag } from '@/lib/cms/types';
import { Button } from '@/components/admin/ui/Button';
import { Input } from '@/components/admin/ui/Input';
import { Card } from '@/components/admin/ui/Card';
import { Modal } from '@/components/admin/ui/Modal';
import { Badge } from '@/components/admin/ui/Badge';

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Tag | null>(null);
  const [name, setName] = useState('');

  const fetchTags = async () => {
    const res = await fetch('/api/cms/tags');
    if (res.ok) setTags(await res.json());
  };

  useEffect(() => { fetchTags(); }, []);

  const handleSave = async () => {
    const url = editing ? `/api/cms/tags/${editing.id}` : '/api/cms/tags';
    const method = editing ? 'PUT' : 'POST';
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    setModalOpen(false);
    fetchTags();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce tag ?')) return;
    await fetch(`/api/cms/tags/${id}`, { method: 'DELETE' });
    fetchTags();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-syne font-bold text-2xl text-admin-text">Tags</h1>
          <p className="text-admin-text-secondary">Gérez les tags de vos articles</p>
        </div>
        <Button onClick={() => { setEditing(null); setName(''); setModalOpen(true); }}>
          <Plus className="w-4 h-4" /> Nouveau tag
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex flex-wrap gap-3">
          {tags.map((tag) => (
            <div key={tag.id} className="flex items-center gap-2 group">
              <Badge variant="info" className="text-sm py-1.5 px-3">
                {tag.name}
                <span className="ml-2 text-admin-text-muted text-xs">/{tag.slug}</span>
              </Badge>
              <button onClick={() => { setEditing(tag); setName(tag.name); setModalOpen(true); }} className="opacity-0 group-hover:opacity-100 inline-flex items-center justify-center w-8 h-8 rounded-lg text-admin-text-muted hover:text-amber-400 hover:bg-amber-500/10 transition-all" title="Modifier">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(tag.id)} className="opacity-0 group-hover:opacity-100 inline-flex items-center justify-center w-8 h-8 rounded-lg text-admin-text-muted hover:text-red-400 hover:bg-red-500/10 transition-all" title="Supprimer">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </Card>

      <Modal open={modalOpen} onOpenChange={setModalOpen} title={editing ? 'Modifier le tag' : 'Nouveau tag'}>
        <div className="space-y-16">
          <Input label="Nom" value={name} onChange={(e) => setName(e.target.value)} required />
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setModalOpen(false)}>Annuler</Button>
            <Button onClick={handleSave}>Enregistrer</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
