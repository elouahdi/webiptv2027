import { ensureCMSInitialized } from '@/lib/cms/init';
import { getPostStats } from '@/lib/cms/repositories/posts';
import { getSEOStats } from '@/lib/cms/repositories/analytics';
import { getTrafficStats } from '@/lib/cms/repositories/analytics';
import { jsonResponse, requirePermission, isErrorResponse } from '@/lib/cms/api-helpers';

export async function GET() {
  await ensureCMSInitialized();
  const auth = await requirePermission('posts:read');
  if (isErrorResponse(auth)) return auth;

  const [postStats, seoStats, traffic] = await Promise.all([
    getPostStats(),
    getSEOStats(),
    getTrafficStats(7),
  ]);

  return jsonResponse({ posts: postStats, seo: seoStats, traffic });
}
