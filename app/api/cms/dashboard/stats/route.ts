import { ensureCMSInitialized } from '@/lib/cms/init';
import { readCMSData } from '@/lib/cms/storage';
import { getPostStats } from '@/lib/cms/repositories/posts';
import { getSEOStats, getTrafficStats } from '@/lib/cms/repositories/analytics';
import { jsonResponse, requireAuth, isErrorResponse } from '@/lib/cms/api-helpers';

export const dynamic = 'force-dynamic';

export async function GET() {
  await ensureCMSInitialized();
  const auth = await requireAuth();
  if (isErrorResponse(auth)) return auth;

  const [data, traffic, postStats, seoStats] = await Promise.all([
    readCMSData(),
    getTrafficStats(7),
    getPostStats(),
    getSEOStats(),
  ]);

  const counts = {
    posts: data.posts.length,
    pages: data.pages.length,
    media: data.media.length,
    users: data.users.length,
    categories: data.categories.length,
    tags: data.tags.length,
  };

  const recentPosts = [...data.posts]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 6)
    .map((p) => ({ id: p.id, title: p.title, status: p.status, views: p.views, updatedAt: p.updatedAt }));

  const activity = [
    ...data.posts.map((p) => ({ id: `post-${p.id}`, type: 'post' as const, title: p.title, date: p.updatedAt, meta: p.status as string })),
    ...data.pages.map((p) => ({ id: `page-${p.id}`, type: 'page' as const, title: p.title, date: p.updatedAt, meta: p.status as string })),
    ...data.media.map((m) => ({ id: `media-${m.id}`, type: 'media' as const, title: m.originalName, date: m.createdAt, meta: m.type as string })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 8);

  return jsonResponse({ counts, recentPosts, activity, traffic, posts: postStats, seo: seoStats });
}
