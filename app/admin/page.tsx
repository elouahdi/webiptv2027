'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileText, Eye, Clock, TrendingUp, Plus, Image as ImageIcon, Users, BarChart3, ChevronRight, ArrowUpRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/admin/ui/Card';
import { Badge } from '@/components/admin/ui/Badge';
import { Button } from '@/components/admin/ui/Button';
import type { Post } from '@/lib/cms/types';

interface DashboardStats {
  posts: { total: number; published: number; drafts: number; scheduled: number; totalViews: number };
  seo: { seoCoverage: number; withSeoTitle: number; totalPosts: number };
  traffic: { analytics: { date: string; views: number }[]; totalViews: number };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [popularPosts, setPopularPosts] = useState<Post[]>([]);

  useEffect(() => {
    Promise.all([
      fetch('/api/cms/posts/stats').then((r) => r.json()),
      fetch('/api/cms/posts?limit=5').then((r) => r.json()),
    ]).then(([statsData, postsData]) => {
      setStats(statsData);
      setRecentPosts(postsData.posts || []);
      const sorted = [...(postsData.posts || [])].sort((a: Post, b: Post) => b.views - a.views);
      setPopularPosts(sorted.slice(0, 5));
    });
  }, []);

  const statCards = [
    { name: 'Total Articles', value: stats?.posts.total ?? '—', icon: FileText, color: 'from-brand-from to-brand-to', change: '+12%', up: true },
    { name: 'Publiés', value: stats?.posts.published ?? '—', icon: TrendingUp, color: 'from-green-500 to-emerald-500', change: '+8%', up: true },
    { name: 'Brouillons', value: stats?.posts.drafts ?? '—', icon: Clock, color: 'from-yellow-500 to-orange-500', change: '-3%', up: false },
    { name: 'Vues Totales', value: stats?.posts.totalViews?.toLocaleString() ?? '—', icon: Eye, color: 'from-purple-500 to-pink-500', change: '+24%', up: true },
  ];

  const maxViews = Math.max(...(stats?.traffic.analytics.map((a) => a.views) || [1]));
  const totalTrafficViews = stats?.traffic.analytics.reduce((sum, d) => sum + d.views, 0) ?? 0;

  return (
    <div className="space-y-32">
      {/* ─── Page Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-16">
        <div>
          <h1 className="font-syne font-bold text-3xl text-admin-text tracking-tight">
            Bon retour 👋
          </h1>
          <p className="text-admin-text-secondary mt-1 text-sm">
            Voici un résumé de l&apos;activité de votre CMS aujourd&apos;hui.
          </p>
        </div>
        <Link href="/admin/blog/posts/create">
          <Button>
            <Plus className="w-4 h-4" />
            Nouvel article
          </Button>
        </Link>
      </div>

      {/* ─── Stat Cards ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-24">
        {statCards.map((stat) => (
          <Card key={stat.name} className="group transition-all duration-200 hover:shadow-md hover:border-amber-500/20">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-16">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <span className={`inline-flex items-center gap-0.5 text-xs font-medium px-2 py-0.5 rounded-full ${
                  stat.up
                    ? 'bg-green-500/10 text-green-400'
                    : 'bg-red-500/10 text-red-400'
                }`}>
                  <ArrowUpRight className={`w-3 h-3 ${!stat.up ? 'rotate-90' : ''}`} />
                  {stat.change}
                </span>
              </div>
              <p className="text-3xl font-bold text-admin-text tracking-tight">{stat.value}</p>
              <p className="text-xs text-admin-text-muted mt-1.5 uppercase tracking-wider font-medium">{stat.name}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ─── Traffic Chart + Recent Posts ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-amber-400" />
                Trafic (7 jours)
              </CardTitle>
              <div className="text-right">
                <p className="text-xl font-bold text-admin-text">{totalTrafficViews.toLocaleString()}</p>
                <p className="text-xs text-admin-text-muted">vues totales</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Y-axis guide lines */}
            <div className="relative h-52">
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="border-b border-admin-border/50 w-full" />
                ))}
              </div>
              {/* Bars */}
              <div className="relative h-full flex items-end justify-between gap-2 pt-2 pb-6">
                {(stats?.traffic.analytics || []).filter(d => d && d.date).map((day, idx) => (
                  <div key={`${day.date}-${idx}`} className="flex-1 flex flex-col items-center gap-2 group/bar relative">
                    {/* Tooltip */}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-admin-card border border-admin-border rounded-lg px-2 py-1 text-xs text-admin-text font-medium whitespace-nowrap shadow-lg z-10 pointer-events-none">
                      {day.views} vues
                    </div>
                    <div
                      className="w-full rounded-lg bg-gradient-to-t from-amber-500 to-amber-400 transition-all duration-300 hover:from-amber-400 hover:to-amber-300 min-h-[6px] cursor-pointer shadow-sm shadow-amber-500/10"
                      style={{ height: `${Math.max((day.views / maxViews) * 100, 3)}%` }}
                    />
                    <span className="absolute -bottom-0.5 text-[10px] text-admin-text-muted font-medium">
                      {new Date(day.date).toLocaleDateString('fr-FR', { weekday: 'short' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Posts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Articles récents</CardTitle>
              <Link href="/admin/blog/posts" className="inline-flex items-center gap-1 text-sm text-amber-400 hover:text-amber-300 transition-colors font-medium">
                Voir tout
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-admin-border/50">
              {recentPosts.filter(p => p && p.id).map((post) => (
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
                      <Badge
                        variant={
                          post.status === 'published' ? 'success' :
                          post.status === 'scheduled' ? 'purple' : 'warning'
                        }
                      >
                        {post.status === 'published' ? 'Publié' :
                         post.status === 'scheduled' ? 'Programmé' : 'Brouillon'}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-admin-text-muted shrink-0">
                    <Eye className="w-3.5 h-3.5" />
                    <span className="font-medium">{post.views}</span>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ─── Popular Posts + SEO Stats ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Posts */}
        <Card>
          <CardHeader>
            <CardTitle>Articles populaires</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-admin-border/50">
              {popularPosts.filter(p => p && p.id).map((post, i) => {
                const barWidth = maxViews > 0 ? (post.views / maxViews) * 100 : 0;
                return (
                  <div key={post.id} className="flex items-center gap-16 px-6 py-3.5 hover:bg-admin-muted/50 transition-colors">
                    <span className={`
                      w-7 h-7 rounded-lg text-xs flex items-center justify-center font-bold shrink-0
                      ${i === 0 ? 'bg-amber-500/15 text-amber-400' :
                        i === 1 ? 'bg-amber-500/10 text-amber-400/80' :
                        'bg-admin-muted text-admin-text-muted'}
                    `}>
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-admin-text truncate">{post.title}</p>
                      <div className="mt-2 flex items-center gap-3">
                        <div className="flex-1 h-1.5 bg-admin-muted rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-500"
                            style={{ width: `${barWidth}%` }}
                          />
                        </div>
                        <span className="text-xs text-admin-text-muted font-medium tabular-nums shrink-0">
                          {post.views} vues
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* SEO Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Statistiques SEO</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Coverage bar */}
              <div>
                <div className="flex justify-between items-baseline mb-3">
                  <span className="text-sm text-admin-text-secondary font-medium">Couverture SEO</span>
                  <span className="text-2xl font-bold text-admin-text tabular-nums">{stats?.seo.seoCoverage ?? 0}%</span>
                </div>
                <div className="h-2.5 bg-admin-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-500"
                    style={{ width: `${stats?.seo.seoCoverage ?? 0}%` }}
                  />
                </div>
                <p className="text-xs text-admin-text-muted mt-2">
                  {stats?.seo.withSeoTitle ?? 0} articles sur {stats?.seo.totalPosts ?? 0} ont un titre SEO
                </p>
              </div>
              {/* Metric cards */}
              <div className="grid grid-cols-2 gap-16">
                <div className="p-4 rounded-xl bg-admin-muted/70 border border-admin-border/50">
                  <p className="text-xs text-admin-text-muted uppercase tracking-wider font-medium">Avec titre SEO</p>
                  <p className="text-2xl font-bold text-admin-text mt-1 tabular-nums">{stats?.seo.withSeoTitle ?? 0}</p>
                </div>
                <div className="p-4 rounded-xl bg-admin-muted/70 border border-admin-border/50">
                  <p className="text-xs text-admin-text-muted uppercase tracking-wider font-medium">Total articles</p>
                  <p className="text-2xl font-bold text-admin-text mt-1 tabular-nums">{stats?.seo.totalPosts ?? 0}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ─── Quick Actions ─── */}
      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-16">
            {[
              { href: '/admin/blog/posts/create', icon: FileText, label: 'Créer un article', desc: 'Rédiger un nouvel article' },
              { href: '/admin/media', icon: ImageIcon, label: 'Gérer les médias', desc: 'Images, vidéos, fichiers' },
              { href: '/admin/users', icon: Users, label: 'Utilisateurs', desc: 'Gérer les accès' },
            ].map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="group flex items-center gap-16 p-16 rounded-xl border border-admin-border bg-admin-card hover:border-amber-500/50 hover:bg-amber-500/5 transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0 group-hover:bg-amber-500/20 transition-colors">
                  <action.icon className="w-5 h-5 text-amber-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-admin-text">{action.label}</p>
                  <p className="text-xs text-admin-text-muted mt-0.5">{action.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-admin-text-muted group-hover:text-amber-400 transition-colors shrink-0" />
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
