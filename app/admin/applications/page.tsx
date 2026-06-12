'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/admin/ui/Button';
import { Badge } from '@/components/admin/ui/Badge';
import { Card } from '@/components/admin/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/admin/ui/Table';

const CATEGORY_LABELS: Record<string, string> = {
  smartphone: '📱 Smartphone',
  smart_tv: '📺 Smart TV',
  computer: '💻 Ordinateur',
  box: '📦 Box Android',
};

export default function ApplicationsAdminPage() {
  const [apps, setApps] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/cms/applications').then(r => r.json()).then(setApps);
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette application ?')) return;
    await fetch(`/api/cms/applications/${id}`, { method: 'DELETE' });
    setApps(apps.filter(a => a.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-syne font-bold text-2xl text-admin-text">Applications IPTV</h1>
          <p className="text-admin-text-secondary">Gérez les applications du guide d'installation</p>
        </div>
        <Link href="/admin/applications/create">
          <Button><Plus className="w-4 h-4" /> Nouvelle application</Button>
        </Link>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Logo</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Prix</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {apps.map((app) => (
              <TableRow key={app.id}>
                <TableCell><span className="text-2xl">{app.logo}</span></TableCell>
                <TableCell>
                  <p className="font-medium text-admin-text">{app.name}</p>
                  <p className="text-xs text-admin-text-muted">/{app.slug}</p>
                </TableCell>
                <TableCell>
                  <Badge variant="default">{CATEGORY_LABELS[app.category] || app.category}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={app.price_type === 'free' ? 'success' : 'warning'}>
                    {app.price_type === 'free' ? 'Gratuit' : `Payant${app.price_amount ? ` (${app.price_amount})` : ''}`}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={app.status === 'active' ? 'success' : 'danger'}>
                    {app.status === 'active' ? 'Actif' : 'Inactif'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/applications/${app.id}/edit`} className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-admin-text-muted hover:text-amber-400 hover:bg-amber-500/10 transition-all">
                      <Pencil className="w-[18px] h-[18px]" />
                    </Link>
                    <button onClick={() => handleDelete(app.id)} className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-admin-text-muted hover:text-red-400 hover:bg-red-500/10 transition-all">
                      <Trash2 className="w-[18px] h-[18px]" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
