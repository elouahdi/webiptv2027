'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Pencil } from 'lucide-react';
import type { Page } from '@/lib/cms/types';
import { Button } from '@/components/admin/ui/Button';
import { Badge } from '@/components/admin/ui/Badge';
import { Card } from '@/components/admin/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/admin/ui/Table';

const TEMPLATE_LABELS: Record<string, string> = {
  home: 'Accueil',
  about: 'À propos',
  contact: 'Contact',
  privacy: 'Confidentialité',
  terms: 'CGU',
  custom: 'Personnalisée',
};

export default function PagesAdminPage() {
  const [pages, setPages] = useState<Page[]>([]);

  useEffect(() => {
    fetch('/api/cms/pages').then((r) => r.json()).then(setPages);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-syne font-bold text-2xl text-admin-text">Pages</h1>
          <p className="text-admin-text-secondary">Gérez les pages de votre site</p>
        </div>
        <Link href="/admin/pages/create">
          <Button><Plus className="w-4 h-4" /> Nouvelle page</Button>
        </Link>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titre</TableHead>
              <TableHead>Template</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Blocs</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pages.map((page) => (
              <TableRow key={page.id}>
                <TableCell>
                  <p className="font-medium text-admin-text">{page.title}</p>
                  <p className="text-xs text-admin-text-muted">/{page.slug}</p>
                </TableCell>
                <TableCell>
                  <Badge variant="default">{TEMPLATE_LABELS[page.template] || page.template}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={page.status === 'published' ? 'success' : 'warning'}>
                    {page.status === 'published' ? 'Publié' : 'Brouillon'}
                  </Badge>
                </TableCell>
                <TableCell className="text-admin-text-secondary">{page.sections.length} blocs</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/pages/${page.id}/edit`} className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-admin-text-muted hover:text-amber-400 hover:bg-amber-500/10 transition-all" title="Modifier">
                      <Pencil className="w-[18px] h-[18px]" />
                    </Link>
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
