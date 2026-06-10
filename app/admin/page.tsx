'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  File,
  Image as ImageIcon,
  Users,
  FolderOpen,
  Tag,
  Plus,
  BarChart3,
  ChevronRight,
  Eye,
  Trophy,
  Activity,
  Upload,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/admin/ui/Card';
import { Badge } from '@/components/admin/ui/Badge';
import { Button } from '@/components/admin/ui/Button';
import { Skeleton } from '@/components/admin/ui/Skeleton';
import { StatCard } from '@/components/admin/ui/StatCard';
import { useToast } from '@/components/admin/ui/Toast';
import type { PostStatus } from '@/lib/cms/types';

interface DashboardData {
  counts: {
    posts: number;
    pages: number;
    media: number;
    users: number;
    categories: number;
    tags: number;
  };
  recentPosts: { id: string; title: string; status: PostStatus; views: number; updatedAt: string }[];
  activity: { id: string; type: 'post' | 'page' | 'media'; title: string; date: string; meta: string }[];
  traffic: { analytics: { date: string; views: number }[] };
}

interface SportsMatch {
  id: number;
  home_team: string;
  away_team: string;
  event_date: string;
  status: string;
  home_score?: number | null;
  away_score?: number | null;
  league?: { name: string };
}

const STATUS_BADGE: Record<PostStatus, { label: string; variant: 'success' | 'warning' | 'purple' }> = {
  published: { label: 'Publié', variant: 'success' },
  draft: { label: 'Brouillon', variant: 'warning' },
  scheduled: { label: 'Programmé', variant: 'purple' },
};

const ACTIVITY_ICONS = { post: FileText, page: File, media: ImageIcon } as const;
const ACTIVITY_LABELS = { post: 'Article', page: 'Page', media: 'Média' } as const;

const LIVE_STATUSES = ['inprogress', '1st_half', 'halftime', '2nd_half', 'extratime', 'extra_time', 'penalties'];

function matchStatusBadge(status: string): { label: string; variant: 'success' | 'danger' | 'default' } {
  if (LIVE_STATUSES.includes(status)) return { label: 'En direct', variant: 'danger' };
  if (status === 'finished' || status === 'aet') return { label: 'Terminé', variant: 'success' };
  return { label: 'À venir', variant: 'default' };
}

export default function AdminDashboard() {
  const { toast } = useToast();
  const [data, setData] = useState<DashboardData | null>(null);
  const [matches, setMatches] = useState<SportsMatch[] | null>(null);

  const load = useCallback(() => {
    fetch('/api/cms/dashboard/stats')
      .then((r) => {
        if (!r.ok) throw new Error('stats');
        return r.json();
      })
      .then(setData)
      .catch(() => toast('Impossible de charger les statistiques du tableau de bord', 'error'));

    fetch('/api/sports/today')
      .then((r) => (r.ok ? r.json() : { matches: [] }))
      .then((d) => setMatches(d.matches ?? []))
      .catch(() => setMatches([]));
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  const statCards = [
    { name: 'Articles', value: data?.counts.posts ?? null, icon: FileText, gradient: 'from-brand-from to-brand-to' },
    { name: 'Pages', value: data?.counts.pages ?? null, icon: File, gradient: 'from-blue-500 to-cyan-500' },
    { name: 'Médias', value: data?.counts.media ?? null, icon: ImageIcon, gradient: 'from-purple-500 to-pink-500' },
    { name: 'Utilisateurs', value: data?.counts.users ?? null, icon: Users, gradient: 'from-green-500 to-emerald-500' },
    { name: 'Catégories', value: data?.counts.categories ?? null, icon: FolderOpen, gradient: 'from-yellow-500 to-orange-500' },
    { name: 'Tags', value: data?.counts.tags ?? null, icon: Tag, gradient: 'from-red-500 to-rose-500' },
  ];

  const analytics = data?.traffic.analytics ?? [];
  const maxViews = Math.max(...analytics.map((a) => a.views), 1);
  const totalTrafficViews = analytics.reduce((sum, d) => sum + d.views, 0);

  return (
    <div className="space-y-32">
      {/* Page header + quick actions */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-16">
        <div>
          <h1 className="font-syne font-bold text-3xl text-admin-text tracking-tight">Bon retour 👋</h1>
          <p className="text-admin-text-secondary mt-1 text-sm">
            Voici un résumé de l&apos;activité de votre site aujourd&apos;hui.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/blog/posts/create">
            <Button>
              <Plus className="w-4 h-4" />
              Nouvel article
            </Button>
          </Link>
          <Link href="/admin/pages/create">
            <Button variant="secondary">
              <File className="w-4 h-4" />
              Nouvelle page
            </Button>
          </Link>
          <Link href="/admin/media">
            <Button variant="secondary">
              <Upload className="w-4 h-4" />
              Médias
            </Button>
          </Link>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-16">
        {statCards.map((stat) => (
          <StatCard key={stat.name} name={stat.name} value={stat.value} icon={stat.icon} gradient={stat.gradient} />
        ))}
      </div>

      {/* Traffic chart + recent posts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-amber-400" />
                Trafic (7 jours)
              </CardTitle>
              <div className="text-right">
                <p className="text-xl font-bold text-admin-text tabular-nums">{totalTrafficViews.toLocaleString('fr-FR')}</p>
                <p className="text-xs text-admin-text-muted">vues totales</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {!data ? (
              <Skeleton className="h-52 w-full" />
            ) : (
              <div className="relative h-52">
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="border-b border-admin-border/50 w-full" />
                  ))}
                </div>
                <div className="relative h-full flex items-end justify-between gap-2 pt-2 pb-6">
                  {analytics.filter((d) => d && d.date).map((day, idx) => (
                    <div key={`${day.date}-${idx}`} className="flex-1 flex flex-col items-center gap-2 group/bar relative">
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-admin-card border border-admin-border rounded-lg px-2 py-1 text-xs text-admin-text font-medium whitespace-nowrap shadow-lg z-10 pointer-events-none">
                        {day.views} vues
                      </div>
                      <div
                        className="w-full rounded-lg bg-gradient-to-t from-amber-500 to-amber-400 transition-all duration-300 hover:from-amber-400 hover:to-amber-300 min-h-[6px] cursor-pointer"
                        style={{ height: `${Math.max((day.views / maxViews) * 100, 3)}%` }}
                      />
                      <span className="absolute -bottom-0.5 text-[10px] text-admin-text-muted font-medium">
                        {new Date(day.date).toLocaleDateString('fr-FR', { weekday: 'short' })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Articles récents</CardTitle>
              <Link
                href="/admin/blog/posts"
                className="inline-flex items-center gap-1 text-sm text-amber-400 hover:text-amber-300 transition-colors font-medium"
              >
                Voir tout
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {!data ? (
              <div className="p-6 space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : (
              <div className="divide-y divide-admin-border/50">
                {data.recentPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/admin/blog/posts/${post.id}/edit`}
                    className="flex items-center justify-between px-6 py-3.5 hover:bg-admin-muted/50 transition-colors group"
                  >
                    <div className="min-w-0 flex-1 mr-4">
                      <p className="text-sm font-medium text-admin-text truncate group-hover:text-amber-400 transition-colors">
                        {post.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <Badge variant={STATUS_BADGE[post.status].variant}>{STATUS_BADGE[post.status].label}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-admin-text-muted shrink-0">
                      <Eye className="w-3.5 h-3.5" />
                      <span className="font-medium tabular-nums">{post.views}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Activity feed + sports widget */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-amber-400" />
              Activité récente
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {!data ? (
              <div className="p-6 space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : data.activity.length === 0 ? (
              <p className="px-6 py-8 text-center text-sm text-admin-text-muted">Aucune activité récente</p>
            ) : (
              <div className="divide-y divide-admin-border/50">
                {data.activity.map((item) => {
                  const Icon = ACTIVITY_ICONS[item.type];
                  return (
                    <div key={item.id} className="flex items-center gap-3 px-6 py-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-amber-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-admin-text truncate font-medium">{item.title}</p>
                        <p className="text-xs text-admin-text-muted mt-0.5">
                          {ACTIVITY_LABELS[item.type]} ·{' '}
                          {new Date(item.date).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      <Badge>{item.meta}</Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                Programme sportif du jour
              </CardTitle>
              <Link
                href="/admin/sports"
                className="inline-flex items-center gap-1 text-sm text-amber-400 hover:text-amber-300 transition-colors font-medium"
              >
                Voir tout
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {matches === null ? (
              <div className="p-6 space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : matches.length === 0 ? (
              <p className="px-6 py-8 text-center text-sm text-admin-text-muted">Aucun match aujourd&apos;hui</p>
            ) : (
              <div className="divide-y divide-admin-border/50">
                {matches.slice(0, 5).map((match) => {
                  const badge = matchStatusBadge(match.status);
                  const hasScore = match.home_score !== null && match.home_score !== undefined;
                  return (
                    <div key={match.id} className="flex items-center gap-3 px-6 py-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-admin-text font-medium truncate">
                          {match.home_team}
                          <span className="text-admin-text-muted mx-1.5 font-normal">
                            {hasScore ? `${match.home_score} - ${match.away_score}` : 'vs'}
                          </span>
                          {match.away_team}
                        </p>
                        <p className="text-xs text-admin-text-muted mt-0.5 truncate">
                          {match.league?.name ?? 'Football'} ·{' '}
                          {new Date(match.event_date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
