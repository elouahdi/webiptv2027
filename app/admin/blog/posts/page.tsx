'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  Search,
  Image as ImageIcon,
  CheckCircle2,
  FileEdit,
  X,
} from 'lucide-react';
import type { Post, PostStatus, Category } from '@/lib/cms/types';
import { Button } from '@/components/admin/ui/Button';
import { Badge } from '@/components/admin/ui/Badge';
import { Card } from '@/components/admin/ui/Card';
import { Skeleton } from '@/components/admin/ui/Skeleton';
import { useToast } from '@/components/admin/ui/Toast';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/admin/ui/Table';
import { Modal } from '@/components/admin/ui/Modal';

interface AdminPost extends Post {
  authorName: string | null;
  authorAvatar: string | null;
  categoryName: string | null;
  featuredImageUrl: string | null;
}

const PAGE_SIZES = [10, 25, 50, 100];

const STATUS_META: Record<PostStatus, { label: string; variant: 'success' | 'default' | 'blue' }> = {
  published: { label: 'Publié', variant: 'success' },
  draft: { label: 'Brouillon', variant: 'default' },
  scheduled: { label: 'Programmé', variant: 'blue' },
};

function BlogPostsPageContent() {
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Selection + actions
  const [selected, setSelected] = useState<string[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch('/api/cms/categories')
      .then((r) => (r.ok ? r.json() : []))
      .then(setCategories)
      .catch(() => {});
  }, []);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ enriched: '1', page: String(page), limit: String(pageSize) });
    if (statusFilter) params.set('status', statusFilter);
    if (categoryFilter) params.set('categoryId', categoryFilter);
    if (search) params.set('search', search);
    if (dateFrom) params.set('dateFrom', dateFrom);
    if (dateTo) params.set('dateTo', dateTo);
    try {
      const res = await fetch(`/api/cms/posts?${params}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setPosts(data.posts);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch {
      toast('Impossible de charger les articles', 'error');
    }
    setSelected([]);
    setLoading(false);
  }, [page, pageSize, statusFilter, categoryFilter, search, dateFrom, dateTo, toast]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const applySearch = () => {
    setPage(1);
    setSearch(searchInput);
  };

  const resetFilters = () => {
    setSearchInput('');
    setSearch('');
    setStatusFilter('');
    setCategoryFilter('');
    setDateFrom('');
    setDateTo('');
    setPage(1);
  };

  const allSelected = posts.length > 0 && selected.length === posts.length;

  const toggleSelectAll = () => {
    setSelected(allSelected ? [] : posts.map((p) => p.id));
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };

  const runBulk = async (action: 'publish' | 'draft' | 'delete') => {
    setBusy(true);
    try {
      const res = await fetch('/api/cms/posts/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selected, action }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      toast(
        action === 'delete'
          ? `${data.processed} article(s) supprimé(s)`
          : `${data.processed} article(s) mis à jour`,
        'success'
      );
      setConfirmBulkDelete(false);
      fetchPosts();
    } catch {
      toast('Action impossible', 'error');
    }
    setBusy(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/cms/posts/${deleteId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      toast('Article supprimé', 'success');
      fetchPosts();
    } catch {
      toast('Suppression impossible', 'error');
    }
    setDeleteId(null);
    setBusy(false);
  };

  const inputClass =
    'h-10 px-3 rounded-lg border border-admin-border bg-admin-input text-admin-text text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/30';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-syne font-bold text-2xl text-admin-text">Articles</h1>
          <p className="text-admin-text-secondary">
            {total} article{total > 1 ? 's' : ''} au total
          </p>
        </div>
        <Link href="/admin/blog/posts/create">
          <Button>
            <Plus className="w-4 h-4" /> Nouvel article
          </Button>
        </Link>
      </div>

      {/* Filters bar */}
      <Card className="p-16">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-admin-text-muted" />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && applySearch()}
              placeholder="Rechercher..."
              className={`${inputClass} w-full pl-10`}
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            className={inputClass}
          >
            <option value="">Toutes les catégories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className={inputClass}
          >
            <option value="">Tous les statuts</option>
            <option value="published">Publié</option>
            <option value="draft">Brouillon</option>
            <option value="scheduled">Programmé</option>
          </select>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => {
              setDateFrom(e.target.value);
              setPage(1);
            }}
            className={inputClass}
            title="Date de début"
          />
          <input
            type="date"
            value={dateTo}
            onChange={(e) => {
              setDateTo(e.target.value);
              setPage(1);
            }}
            className={inputClass}
            title="Date de fin"
          />
          <Button variant="outline" onClick={applySearch}>
            Filtrer
          </Button>
          <Button variant="ghost" onClick={resetFilters}>
            Réinitialiser
          </Button>
        </div>
      </Card>

      {/* Bulk actions toolbar */}
      {selected.length > 0 && (
        <Card className="p-3 px-16 flex flex-wrap items-center gap-3 border-amber-500/30 bg-amber-500/5">
          <p className="text-sm font-medium text-admin-text">
            {selected.length} sélectionné{selected.length > 1 ? 's' : ''}
          </p>
          <div className="flex-1" />
          <Button size="sm" variant="secondary" disabled={busy} onClick={() => runBulk('publish')}>
            <CheckCircle2 className="w-4 h-4" /> Publier
          </Button>
          <Button size="sm" variant="outline" disabled={busy} onClick={() => runBulk('draft')}>
            <FileEdit className="w-4 h-4" /> Mettre en brouillon
          </Button>
          <Button size="sm" variant="danger" disabled={busy} onClick={() => setConfirmBulkDelete(true)}>
            <Trash2 className="w-4 h-4" /> Supprimer
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setSelected([])}>
            <X className="w-4 h-4" />
          </Button>
        </Card>
      )}

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleSelectAll}
                  className="accent-amber-500 w-4 h-4 cursor-pointer"
                  aria-label="Tout sélectionner"
                />
              </TableHead>
              <TableHead>Article</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Auteur</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Vues</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={8}>
                    <Skeleton className="h-10 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-admin-text-muted">
                  Aucun article trouvé
                </TableCell>
              </TableRow>
            ) : (
              posts.map((post) => (
                <TableRow key={post.id} className={selected.includes(post.id) ? 'bg-amber-500/5' : undefined}>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selected.includes(post.id)}
                      onChange={() => toggleSelect(post.id)}
                      className="accent-amber-500 w-4 h-4 cursor-pointer"
                      aria-label={`Sélectionner ${post.title}`}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3 min-w-0">
                      {post.featuredImageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={post.featuredImageUrl}
                          alt=""
                          className="w-10 h-10 rounded-lg object-cover shrink-0 border border-admin-border"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-admin-muted flex items-center justify-center shrink-0">
                          <ImageIcon className="w-4 h-4 text-admin-text-muted" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-medium text-admin-text truncate max-w-[260px]">{post.title}</p>
                        <p className="text-xs text-admin-text-muted truncate">/blog/{post.slug}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {post.categoryName ? <Badge variant="info">{post.categoryName}</Badge> : <span className="text-admin-text-muted text-sm">—</span>}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {post.authorAvatar ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={post.authorAvatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-amber-500/15 text-amber-400 flex items-center justify-center text-[10px] font-bold">
                          {(post.authorName ?? '?').charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="text-sm text-admin-text-secondary">{post.authorName ?? '—'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={STATUS_META[post.status].variant}>{STATUS_META[post.status].label}</Badge>
                  </TableCell>
                  <TableCell className="tabular-nums">{post.views}</TableCell>
                  <TableCell className="text-admin-text-secondary text-sm">
                    {new Date(post.updatedAt).toLocaleDateString('fr-FR')}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-9 h-9 rounded-xl text-admin-text-muted hover:text-blue-400 hover:bg-blue-500/10 transition-all"
                        title="Voir l'article"
                      >
                        <Eye className="w-[18px] h-[18px]" />
                      </a>
                      <Link
                        href={`/admin/blog/posts/${post.id}/edit`}
                        className="inline-flex items-center justify-center w-9 h-9 rounded-xl text-admin-text-muted hover:text-amber-400 hover:bg-amber-500/10 transition-all"
                        title="Modifier"
                      >
                        <Pencil className="w-[18px] h-[18px]" />
                      </Link>
                      <button
                        onClick={() => setDeleteId(post.id)}
                        className="inline-flex items-center justify-center w-9 h-9 rounded-xl text-admin-text-muted hover:text-red-400 hover:bg-red-500/10 transition-all"
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

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-16 py-3 border-t border-admin-border">
          <div className="flex items-center gap-2 text-sm text-admin-text-secondary">
            <span>Afficher</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="h-8 px-2 rounded-lg border border-admin-border bg-admin-input text-admin-text text-sm"
            >
              {PAGE_SIZES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <span>par page</span>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" disabled={page <= 1 || loading} onClick={() => setPage((p) => p - 1)}>
              Précédent
            </Button>
            <span className="text-sm text-admin-text-secondary px-2 tabular-nums">
              Page {page} / {totalPages}
            </span>
            <Button
              size="sm"
              variant="outline"
              disabled={page >= totalPages || loading}
              onClick={() => setPage((p) => p + 1)}
            >
              Suivant
            </Button>
          </div>
        </div>
      </Card>

      {/* Single delete confirmation */}
      <Modal
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title="Supprimer l'article"
        description="Cette action est irréversible."
      >
        <div className="flex gap-3 justify-end mt-16">
          <Button variant="outline" onClick={() => setDeleteId(null)}>
            Annuler
          </Button>
          <Button variant="danger" disabled={busy} onClick={handleDelete}>
            Supprimer
          </Button>
        </div>
      </Modal>

      {/* Bulk delete confirmation */}
      <Modal
        open={confirmBulkDelete}
        onOpenChange={() => setConfirmBulkDelete(false)}
        title={`Supprimer ${selected.length} article(s)`}
        description="Cette action est irréversible."
      >
        <div className="flex gap-3 justify-end mt-16">
          <Button variant="outline" onClick={() => setConfirmBulkDelete(false)}>
            Annuler
          </Button>
          <Button variant="danger" disabled={busy} onClick={() => runBulk('delete')}>
            Supprimer définitivement
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default function BlogPostsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-admin-text"></div>
        </div>
      }
    >
      <BlogPostsPageContent />
    </Suspense>
  );
}
