'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Shield } from 'lucide-react';
import type { User, UserRole } from '@/lib/cms/types';
import { Button } from '@/components/admin/ui/Button';
import { Input } from '@/components/admin/ui/Input';
import { Select } from '@/components/admin/ui/Select';
import { Badge } from '@/components/admin/ui/Badge';
import { Card } from '@/components/admin/ui/Card';
import { Modal } from '@/components/admin/ui/Modal';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/admin/ui/Table';

const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Administrateur',
  editor: 'Éditeur',
  author: 'Auteur',
  moderator: 'Modérateur',
};

const ROLE_COLORS: Record<UserRole, 'danger' | 'info' | 'success' | 'warning'> = {
  admin: 'danger',
  editor: 'info',
  author: 'success',
  moderator: 'warning',
};

type SafeUser = Omit<User, 'passwordHash'>;

export default function UsersPage() {
  const [users, setUsers] = useState<SafeUser[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<SafeUser | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('author');

  const fetchUsers = async () => {
    const res = await fetch('/api/cms/users');
    if (res.ok) setUsers(await res.json());
  };

  useEffect(() => { fetchUsers(); }, []);

  const openCreate = () => {
    setEditing(null);
    setName(''); setEmail(''); setPassword(''); setRole('author');
    setModalOpen(true);
  };

  const openEdit = (user: SafeUser) => {
    setEditing(user);
    setName(user.name); setEmail(user.email); setPassword(''); setRole(user.role);
    setModalOpen(true);
  };

  const handleSave = async () => {
    const payload: Record<string, string> = { name, email, role };
    if (password) payload.password = password;

    const url = editing ? `/api/cms/users/${editing.id}` : '/api/cms/users';
    const method = editing ? 'PUT' : 'POST';
    if (!editing) payload.password = password;

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    setModalOpen(false);
    fetchUsers();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cet utilisateur ?')) return;
    await fetch(`/api/cms/users/${id}`, { method: 'DELETE' });
    fetchUsers();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-syne font-bold text-2xl text-admin-text">Utilisateurs</h1>
          <p className="text-admin-text-secondary">Gérez les rôles et permissions</p>
        </div>
        <Button onClick={openCreate}><Plus className="w-4 h-4" /> Nouvel utilisateur</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-16">
        {(Object.keys(ROLE_LABELS) as UserRole[]).map((r) => (
          <Card key={r} className="p-4">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-amber-400" />
              <div>
                <p className="text-sm text-admin-text-secondary">{ROLE_LABELS[r]}</p>
                <p className="text-xl font-bold text-admin-text">{users.filter((u) => u.role === r).length}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Créé le</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell className="text-admin-text-secondary">{user.email}</TableCell>
                <TableCell><Badge variant={ROLE_COLORS[user.role]}>{ROLE_LABELS[user.role]}</Badge></TableCell>
                <TableCell className="text-sm text-admin-text-muted">
                  {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openEdit(user)} className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-admin-text-muted hover:text-amber-400 hover:bg-amber-500/10 transition-all" title="Modifier">
                      <Pencil className="w-[18px] h-[18px]" />
                    </button>
                    <button onClick={() => handleDelete(user.id)} className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-admin-text-muted hover:text-red-400 hover:bg-red-500/10 transition-all" title="Supprimer">
                      <Trash2 className="w-[18px] h-[18px]" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Modal open={modalOpen} onOpenChange={setModalOpen} title={editing ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}>
        <div className="space-y-16">
          <Input label="Nom" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label={editing ? 'Nouveau mot de passe (optionnel)' : 'Mot de passe'} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required={!editing} />
          <Select
            label="Rôle"
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            options={Object.entries(ROLE_LABELS).map(([v, l]) => ({ value: v, label: l }))}
          />
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setModalOpen(false)}>Annuler</Button>
            <Button onClick={handleSave}>Enregistrer</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
