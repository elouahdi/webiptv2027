'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Plus, Pencil, Trash2, Eye, Search } from 'lucide-react';
import type { Post } from '@/lib/cms/types';
import { Button } from '@/components/admin/ui/Button';
import { Badge } from '@/components/admin/ui/Badge';
import { Card } from '@/components/admin/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/admin/ui/Table';
import { Modal } from '@/components/admin/ui/Modal';

function BlogPostsPageContent() {
  const searchParams = useSearchParams();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState(searchParams.get('search') || '');

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter) params.set('status', statusFilter);
    if (search) params.set('search', search);
    const res = await fetch(`/api/cms/posts?${params}`);
    if (res.ok) {
      const data = await res.json();
      setPosts(data.posts);
    }
    setLoading(false);
  }, [statusFilter, search]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const handleDelete = async () => {
    if (!deleteId) return;
    await fetch(`/api/cms/posts/${deleteId}`, { method: 'DELETE' });
    setDeleteId(null);
    fetchPosts();
  };

  const statusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'warning' | 'purple'> = {
      published: 'success',
      draft: 'warning',
      scheduled: 'purple',
    };
    const labels: Record<string, string> = {
      published: 'Publié',
      draft: 'Brouillon',
      scheduled: 'Programmé',
    };
    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-syne font-bold text-2xl text-admin-text">Articles</h1>
          <p className="text-admin-text-secondary">Gérez vos articles de blog</p>
        </div>
        <Link href="/admin/blog/posts/create">
          <Button><Plus className="w-4 h-4" /> Nouvel article</Button>
        </Link>
      </div>

      <Card className="p-16">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-admin-text-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchPosts()}
              placeholder="Rechercher..."
              className="w-full pl-10 pr-16 h-10 rounded-lg border border-admin-border bg-admin-input text-admin-text"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 rounded-lg border border-admin-border bg-admin-input text-admin-text"
          >
            <option value="">Tous les statuts</option>
            <option value="published">Publié</option>
            <option value="draft">Brouillon</option>
            <option value="scheduled">Programmé</option>
          </select>
          <Button variant="outline" onClick={fetchPosts}>Filtrer</Button>
        </div>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titre</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Vues</TableHead>
              <TableHead>Lecture</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-admin-text-muted">
                  Chargement...
                </TableCell>
              </TableRow>
            ) : posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-admin-text-muted">
                  Aucun article trouvé
                </TableCell>
              </TableRow>
            ) : (
              posts.map((post, idx) => (
                <TableRow key={`${post.id}-${idx}`}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-admin-text">{post.title}</p>
                      <p className="text-xs text-admin-text-muted">/blog/{post.slug}</p>
                    </div>
                  </TableCell>
                  <TableCell>{statusBadge(post.status)}</TableCell>
                  <TableCell>{post.views}</TableCell>
                  <TableCell>{post.readTime} min</TableCell>
                  <TableCell className="text-admin-text-secondary text-sm">
                    {new Date(post.updatedAt).toLocaleDateString('fr-FR')}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-admin-text-muted hover:text-blue-400 hover:bg-blue-500/10 transition-all"
                        title="Voir l'article"
                      >
                        <Eye className="w-[18px] h-[18px]" />
                      </a>
                      <Link
                        href={`/admin/blog/posts/${post.id}/edit`}
                        className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-admin-text-muted hover:text-amber-400 hover:bg-amber-500/10 transition-all"
                        title="Modifier"
                      >
                        <Pencil className="w-[18px] h-[18px]" />
                      </Link>
                      <button
                        onClick={() => setDeleteId(post.id)}
                        className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-admin-text-muted hover:text-red-400 hover:bg-red-500/10 transition-all"
                        title="Supprimer"
                      >
                        <Trash2 className="w-[18px] h-[18px]" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <Modal
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title="Supprimer l'article"
        description="Cette action est irréversible."
      >
        <div className="flex gap-3 justify-end mt-16">
          <Button variant="outline" onClick={() => setDeleteId(null)}>Annuler</Button>
          <Button variant="danger" onClick={handleDelete}>Supprimer</Button>
        </div>
      </Modal>
    </div>
  );
}

export default function BlogPostsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-admin-text"></div>
      </div>
    }>
      <BlogPostsPageContent />
    </Suspense>
  );
}
