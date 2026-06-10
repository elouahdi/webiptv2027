'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import type { Category } from '@/lib/cms/types';
import { Button } from '@/components/admin/ui/Button';
import { Input } from '@/components/admin/ui/Input';
import { Textarea } from '@/components/admin/ui/Textarea';
import { Card } from '@/components/admin/ui/Card';
import { Modal } from '@/components/admin/ui/Modal';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/admin/ui/Table';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const fetchCategories = async () => {
    const res = await fetch('/api/cms/categories');
    if (res.ok) setCategories(await res.json());
  };

  useEffect(() => { fetchCategories(); }, []);

  const openCreate = () => {
    setEditing(null);
    setName('');
    setDescription('');
    setModalOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditing(cat);
    setName(cat.name);
    setDescription(cat.description);
    setModalOpen(true);
  };

  const handleSave = async () => {
    const url = editing ? `/api/cms/categories/${editing.id}` : '/api/cms/categories';
    const method = editing ? 'PUT' : 'POST';
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description }),
    });
    setModalOpen(false);
    fetchCategories();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette catégorie ?')) return;
    await fetch(`/api/cms/categories/${id}`, { method: 'DELETE' });
    fetchCategories();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-syne font-bold text-2xl text-admin-text">Catégories</h1>
          <p className="text-admin-text-secondary">Organisez vos articles par catégorie</p>
        </div>
        <Button onClick={openCreate}><Plus className="w-4 h-4" /> Nouvelle catégorie</Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((cat) => (
              <TableRow key={cat.id}>
                <TableCell className="font-medium">{cat.name}</TableCell>
                <TableCell className="text-admin-text-muted">{cat.slug}</TableCell>
                <TableCell className="text-admin-text-secondary truncate max-w-xs">{cat.description}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openEdit(cat)} className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-admin-text-muted hover:text-amber-400 hover:bg-amber-500/10 transition-all" title="Modifier">
                      <Pencil className="w-[18px] h-[18px]" />
                    </button>
                    <button onClick={() => handleDelete(cat.id)} className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-admin-text-muted hover:text-red-400 hover:bg-red-500/10 transition-all" title="Supprimer">
                      <Trash2 className="w-[18px] h-[18px]" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Modal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title={editing ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
      >
        <div className="space-y-16">
          <Input label="Nom" value={name} onChange={(e) => setName(e.target.value)} required />
          <Textarea label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setModalOpen(false)}>Annuler</Button>
            <Button onClick={handleSave}>Enregistrer</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
