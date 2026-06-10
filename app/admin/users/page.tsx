'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Shield, UserCheck, UserX, KeyRound, Copy } from 'lucide-react';
import type { User, UserRole } from '@/lib/cms/types';
import { Button } from '@/components/admin/ui/Button';
import { Input } from '@/components/admin/ui/Input';
import { Select } from '@/components/admin/ui/Select';
import { Badge } from '@/components/admin/ui/Badge';
import { Card } from '@/components/admin/ui/Card';
import { Modal } from '@/components/admin/ui/Modal';
import { Skeleton } from '@/components/admin/ui/Skeleton';
import { useToast } from '@/components/admin/ui/Toast';
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

function generatePassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%*';
  const arr = new Uint32Array(14);
  crypto.getRandomValues(arr);
  return Array.from(arr, (n) => chars[n % chars.length]).join('');
}

export default function UsersPage() {
  const { toast } = useToast();
  const [users, setUsers] = useState<SafeUser[] | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<SafeUser | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SafeUser | null>(null);
  const [busy, setBusy] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('author');

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/cms/users');
      if (!res.ok) throw new Error();
      setUsers(await res.json());
    } catch {
      setUsers([]);
      toast('Impossible de charger les utilisateurs', 'error');
    }
  };

  useEffect(() => {
    fetchUsers();
    fetch('/api/auth/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => data && setCurrentUserId(data.user?.id ?? null))
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openCreate = () => {
    setEditing(null);
    setName('');
    setEmail('');
    setPassword('');
    setRole('author');
    setModalOpen(true);
  };

  const openEdit = (user: SafeUser) => {
    setEditing(user);
    setName(user.name);
    setEmail(user.email);
    setPassword('');
    setRole(user.role);
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!name.trim() || !email.trim() || (!editing && !password)) {
      toast('Nom, email et mot de passe sont requis', 'warning');
      return;
    }
    setBusy(true);
    const payload: Record<string, string> = { name, email, role };
    if (password) payload.password = password;

    const url = editing ? `/api/cms/users/${editing.id}` : '/api/cms/users';
    const method = editing ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error);
      }
      toast(editing ? 'Utilisateur mis à jour' : 'Utilisateur créé', 'success');
      setModalOpen(false);
      fetchUsers();
    } catch (err) {
      toast(err instanceof Error && err.message ? err.message : 'Enregistrement impossible', 'error');
    }
    setBusy(false);
  };

  const toggleStatus = async (user: SafeUser) => {
    const newStatus = (user.status ?? 'active') === 'active' ? 'suspended' : 'active';
    try {
      const res = await fetch(`/api/cms/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error);
      }
      toast(newStatus === 'suspended' ? 'Compte suspendu' : 'Compte activé', 'success');
      fetchUsers();
    } catch (err) {
      toast(err instanceof Error && err.message ? err.message : 'Action impossible', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/cms/users/${deleteTarget.id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error);
      }
      toast('Utilisateur supprimé', 'success');
      fetchUsers();
    } catch (err) {
      toast(err instanceof Error && err.message ? err.message : 'Suppression impossible', 'error');
    }
    setDeleteTarget(null);
    setBusy(false);
  };

  const handleGeneratePassword = async () => {
    const generated = generatePassword();
    setPassword(generated);
    try {
      await navigator.clipboard.writeText(generated);
      toast('Mot de passe généré et copié — transmettez-le à l\'utilisateur', 'success');
    } catch {
      toast('Mot de passe généré — copiez-le manuellement', 'info');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-syne font-bold text-2xl text-admin-text">Utilisateurs</h1>
          <p className="text-admin-text-secondary">Gérez les comptes, rôles et accès</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4" /> Nouvel utilisateur
        </Button>
      </div>

      {/* Role stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-16">
        {(Object.keys(ROLE_LABELS) as UserRole[]).map((r) => (
          <Card key={r} className="p-4">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-amber-400" />
              <div>
                <p className="text-sm text-admin-text-secondary">{ROLE_LABELS[r]}</p>
                <p className="text-xl font-bold text-admin-text tabular-nums">
                  {users?.filter((u) => u.role === r).length ?? '—'}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Utilisateur</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Dernière connexion</TableHead>
              <TableHead>Créé le</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users === null ? (
              [...Array(4)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={6}>
                    <Skeleton className="h-10 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-admin-text-muted">
                  Aucun utilisateur
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => {
                const isSelf = user.id === currentUserId;
                const isActive = (user.status ?? 'active') === 'active';
                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {user.avatar ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={user.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-amber-500/15 text-amber-400 flex items-center justify-center text-xs font-bold shrink-0">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-medium text-admin-text truncate">
                            {user.name}
                            {isSelf && <span className="text-xs text-admin-text-muted ml-1.5">(vous)</span>}
                          </p>
                          <p className="text-xs text-admin-text-muted truncate">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={ROLE_COLORS[user.role]}>{ROLE_LABELS[user.role]}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={isActive ? 'success' : 'danger'}>{isActive ? 'Actif' : 'Suspendu'}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-admin-text-secondary">
                      {user.lastLoginAt
                        ? new Date(user.lastLoginAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : 'Jamais'}
                    </TableCell>
                    <TableCell className="text-sm text-admin-text-muted">
                      {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => toggleStatus(user)}
                          disabled={isSelf}
                          className="inline-flex items-center justify-center w-9 h-9 rounded-xl text-admin-text-muted hover:text-amber-400 hover:bg-amber-500/10 transition-all disabled:opacity-30 disabled:pointer-events-none"
                          title={isActive ? 'Suspendre le compte' : 'Activer le compte'}
                        >
                          {isActive ? <UserX className="w-[18px] h-[18px]" /> : <UserCheck className="w-[18px] h-[18px]" />}
                        </button>
                        <button
                          onClick={() => openEdit(user)}
                          className="inline-flex items-center justify-center w-9 h-9 rounded-xl text-admin-text-muted hover:text-amber-400 hover:bg-amber-500/10 transition-all"
                          title="Modifier"
                        >
                          <Pencil className="w-[18px] h-[18px]" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(user)}
                          disabled={isSelf}
                          className="inline-flex items-center justify-center w-9 h-9 rounded-xl text-admin-text-muted hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-30 disabled:pointer-events-none"
                          title="Supprimer"
                        >
                          <Trash2 className="w-[18px] h-[18px]" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Create / edit modal */}
      <Modal open={modalOpen} onOpenChange={setModalOpen} title={editing ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}>
        <div className="space-y-16">
          <Input label="Nom" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <Input
                label={editing ? 'Nouveau mot de passe (optionnel)' : 'Mot de passe'}
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required={!editing}
                autoComplete="new-password"
              />
            </div>
            <Button type="button" variant="outline" onClick={handleGeneratePassword} title="Générer un mot de passe fort et le copier">
              <KeyRound className="w-4 h-4" /> Générer
            </Button>
            {password && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={async () => {
                  await navigator.clipboard.writeText(password).catch(() => {});
                  toast('Mot de passe copié', 'success');
                }}
                title="Copier le mot de passe"
              >
                <Copy className="w-4 h-4" />
              </Button>
            )}
          </div>
          <Select
            label="Rôle"
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            options={Object.entries(ROLE_LABELS).map(([v, l]) => ({ value: v, label: l }))}
          />
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSave} disabled={busy}>
              {busy ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete confirmation */}
      <Modal
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
        title="Supprimer l'utilisateur"
        description={`« ${deleteTarget?.name ?? ''} » perdra définitivement son accès.`}
      >
        <div className="flex gap-3 justify-end mt-16">
          <Button variant="outline" onClick={() => setDeleteTarget(null)}>
            Annuler
          </Button>
          <Button variant="danger" disabled={busy} onClick={handleDelete}>
            Supprimer
          </Button>
        </div>
      </Modal>
    </div>
  );
}
