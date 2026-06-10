'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, ExternalLink } from 'lucide-react';
import type { Post } from '@/lib/cms/types';
import { calculateSEOScore } from '@/lib/cms/services/seo-score';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/admin/ui/Card';
import { Badge } from '@/components/admin/ui/Badge';
import { Button } from '@/components/admin/ui/Button';

export default function SEOPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [stats, setStats] = useState<{ seoCoverage: number; withSeoTitle: number; withOgImage: number; withCanonical: number; indexed: number; totalPosts: number } | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/cms/posts?limit=100').then((r) => r.json()),
      fetch('/api/cms/posts/stats').then((r) => r.json()),
    ]).then(([postsData, statsData]) => {
      setPosts(postsData.posts || []);
      setStats(statsData.seo);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-syne font-bold text-2xl text-admin-text">SEO</h1>
        <p className="text-admin-text-secondary">Optimisez le référencement de votre contenu</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16">
        <Card><CardContent className="pt-6"><p className="text-sm text-admin-text-secondary">Couverture SEO</p><p className="text-3xl font-bold text-admin-text">{stats?.seoCoverage ?? 0}%</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-sm text-admin-text-secondary">Titres SEO</p><p className="text-3xl font-bold text-admin-text">{stats?.withSeoTitle ?? 0}/{stats?.totalPosts ?? 0}</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-sm text-admin-text-secondary">Images OG</p><p className="text-3xl font-bold text-admin-text">{stats?.withOgImage ?? 0}/{stats?.totalPosts ?? 0}</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-sm text-admin-text-secondary">Indexés</p><p className="text-3xl font-bold text-admin-text">{stats?.indexed ?? 0}/{stats?.totalPosts ?? 0}</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Score SEO par article
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {posts.map((post) => {
            const score = calculateSEOScore(post.seo, post.title, post.content);
            return (
              <div key={post.id} className="flex items-center justify-between p-4 rounded-lg border border-admin-border hover:bg-admin-muted/50">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-admin-text truncate">{post.title}</p>
                  <p className="text-xs text-admin-text-muted mt-1">/blog/{post.slug}</p>
                </div>
                <div className="flex items-center gap-3 ml-16">
                  <div className="w-24 h-2 bg-admin-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${score.percentage >= 80 ? 'bg-green-500' : score.percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${score.percentage}%` }}
                    />
                  </div>
                  <Badge variant={score.percentage >= 80 ? 'success' : score.percentage >= 50 ? 'warning' : 'danger'}>
                    {score.percentage}%
                  </Badge>
                  <Link href={`/admin/blog/posts/${post.id}/edit`}>
                    <Button variant="ghost" size="sm">Optimiser</Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Sitemap</CardTitle></CardHeader>
        <CardContent>
          <p className="text-admin-text-secondary text-sm mb-16">
            Votre sitemap est généré automatiquement et inclut tous les articles publiés.
          </p>
          <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer">
            <Button variant="outline"><ExternalLink className="w-4 h-4" /> Voir le sitemap</Button>
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
