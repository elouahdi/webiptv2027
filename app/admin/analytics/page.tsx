'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BarChart3, Eye, TrendingUp, Users, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/admin/ui/Card';
import { Badge } from '@/components/admin/ui/Badge';
import { Skeleton } from '@/components/admin/ui/Skeleton';
import { useToast } from '@/components/admin/ui/Toast';
import { cn } from '@/lib/utils/cn';
import type { PostStatus } from '@/lib/cms/types';

interface AnalyticsData {
  days: number;
  traffic: { analytics: { date: string; views: number }[] };
  topPosts: { id: string; title: string; status: PostStatus; views: number; publishedAt: string | null }[];
  sources: { source: string; count: number }[];
  registrations: { date: string; count: number }[];
}

const RANGES = [7, 30, 90] as const;
const STATUS_BADGE: Record<PostStatus, { label: string; variant: 'success' | 'warning' | 'purple' }> = {
  published: { label: 'Publié', variant: 'success' },
  draft: { label: 'Brouillon', variant: 'warning' },
  scheduled: { label: 'Programmé', variant: 'purple' },
};
const SOURCE_COLORS: Record<string, string> = {
  'Google': 'bg-blue-500', 'Facebook': 'bg-indigo-500',
  'Twitter': 'bg-sky-500', 'Instagram': 'bg-pink-500',
  'Direct': 'bg-amber-500', 'Autre': 'bg-slate-500',
};

export default function AnalyticsPage() {
  const { toast } = useToast();
  const [range, setRange] = useState<number>(7);
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    setData(null);
    fetch(`/api/cms/analytics?days=${range}`)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(setData)
      .catch(() => toast('Impossible de charger les statistiques', 'error'));
  }, [range, toast]);

  const analytics = data?.traffic.analytics ?? [];
  const maxViews = Math.max(...analytics.map(a => a.views), 1);
  const totalViews = analytics.reduce((sum, d) => sum + d.views, 0);
  const avgViews = analytics.length > 0 ? Math.round(totalViews / analytics.length) : 0;
  const maxTopViews = Math.max(...(data?.topPosts.map(p => p.views) ?? []), 1);
  const totalSources = data?.sources.reduce((sum, s) => sum + s.count, 0) || 1;
  const totalRegs = data?.registrations.reduce((sum, r) => sum + r.count, 0) || 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-syne font-bold text-3xl text-admin-text tracking-tight">Analytics</h1>
          <p className="text-admin-text-secondary mt-1 text-sm">Performance et trafic de votre site.</p>
        </div>
        <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-admin-muted border border-admin-border">
          {RANGES.map(r => (
            <button key={r} onClick={() => setRange(r)}
              className={cn('px-4 py-1.5 rounded-lg text-sm font-medium transition-all',
                range === r ? 'bg-admin-card text-admin-text shadow-sm' : 'text-admin-text-secondary hover:text-admin-text')}>
              {r} jours
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Eye, label: `Vues (${range}j)`, value: totalViews, color: 'from-amber-500 to-orange-500' },
          { icon: TrendingUp, label: 'Moyenne/jour', value: avgViews, color: 'from-green-500 to-emerald-500' },
          { icon: Users, label: `Inscriptions (${range}j)`, value: totalRegs, color: 'from-blue-500 to-cyan-500' },
          { icon: Globe, label: 'Sources', value: data?.sources.length ?? 0, color: 'from-purple-500 to-pink-500' },
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg mb-4`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              {!data ? <Skeleton className="h-9 w-24" /> :
                <p className="text-3xl font-bold text-admin-text tabular-nums">{stat.value.toLocaleString('fr-FR')}</p>}
              <p className="text-xs text-admin-text-muted mt-1.5 uppercase tracking-wider font-medium">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-amber-400" />Vues par jour
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!data ? <Skeleton className="h-64 w-full" /> : (
            <div className="relative h-64">
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                {[...Array(5)].map((_, i) => <div key={i} className="border-b border-admin-border/50 w-full" />)}
              </div>
              <div className="relative h-full flex items-end gap-px pt-2 pb-6">
                {analytics.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center text-sm text-admin-text-muted">Aucune donnée</div>
                ) : analytics.map((day, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center group/bar relative h-full justify-end">
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-admin-card border border-admin-border rounded-lg px-2 py-1 text-xs text-admin-text font-medium whitespace-nowrap shadow-lg z-10 pointer-events-none">
                      {new Date(day.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} · {day.views} vues
                    </div>
                    <div className="w-full rounded-t-md bg-gradient-to-t from-amber-500 to-amber-400 min-h-[4px]"
                      style={{ height: `${Math.max((day.views / maxViews) * 100, 2)}%` }} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-amber-400" />Sources de trafic
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!data ? <Skeleton className="h-40 w-full" /> :
              data.sources.length === 0 ? (
                <p className="text-center text-sm text-admin-text-muted py-8">Aucune donnée</p>
              ) : (
                <div className="space-y-3">
                  {data.sources.map((s, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full shrink-0 ${SOURCE_COLORS[s.source] || 'bg-slate-500'}`} />
                      <span className="text-sm text-admin-text flex-1">{s.source}</span>
                      <div className="flex-1 h-2 bg-admin-muted rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${SOURCE_COLORS[s.source] || 'bg-slate-500'}`}
                          style={{ width: `${(s.count / totalSources) * 100}%` }} />
                      </div>
                      <span className="text-xs text-admin-text-muted tabular-nums w-8 text-right">{s.count}</span>
                    </div>
                  ))}
                </div>
              )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-400" />Inscriptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!data ? <Skeleton className="h-40 w-full" /> :
              data.registrations.length === 0 ? (
                <p className="text-center text-sm text-admin-text-muted py-8">Aucune inscription sur cette période</p>
              ) : (
                <div className="space-y-2">
                  {data.registrations.map((r, i) => (
                    <div key={i} className="flex items-center justify-between py-1.5 border-b border-admin-border/50 last:border-0">
                      <span className="text-sm text-admin-text">
                        {new Date(r.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                      </span>
                      <span className="text-sm font-medium text-amber-400">+{r.count}</span>
                    </div>
                  ))}
                </div>
              )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Articles les plus performants</CardTitle></CardHeader>
        <CardContent className="p-0">
          {!data ? (
            <div className="p-6 space-y-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
          ) : data.topPosts.length === 0 ? (
            <p className="px-6 py-8 text-center text-sm text-admin-text-muted">Aucun article</p>
          ) : (
            <div className="divide-y divide-admin-border/50">
              {data.topPosts.map((post, i) => (
                <Link key={post.id} href={`/admin/blog/posts/${post.id}/edit`}
                  className="flex items-center gap-4 px-6 py-3.5 hover:bg-admin-muted/50 transition-colors">
                  <span className={cn('w-7 h-7 rounded-lg text-xs flex items-center justify-center font-bold shrink-0',
                    i === 0 ? 'bg-amber-500/15 text-amber-400' : i === 1 ? 'bg-amber-500/10 text-amber-400/80' : 'bg-admin-muted text-admin-text-muted')}>
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-admin-text truncate">{post.title}</p>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-admin-muted rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400"
                          style={{ width: `${(post.views / maxTopViews) * 100}%` }} />
                      </div>
                      <span className="text-xs text-admin-text-muted font-medium tabular-nums shrink-0">
                        {post.views.toLocaleString('fr-FR')} vues
                      </span>
                    </div>
                  </div>
                  <Badge variant={STATUS_BADGE[post.status].variant}>{STATUS_BADGE[post.status].label}</Badge>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
