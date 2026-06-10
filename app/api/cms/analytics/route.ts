import { NextRequest } from 'next/server';
import { ensureCMSInitialized } from '@/lib/cms/init';
import { readCMSData } from '@/lib/cms/storage';
import { getTrafficStats } from '@/lib/cms/repositories/analytics';
import { jsonResponse, requireAuth, isErrorResponse } from '@/lib/cms/api-helpers';

export const dynamic = 'force-dynamic';

const ALLOWED_RANGES = [7, 30, 90];

export async function GET(req: NextRequest) {
  await ensureCMSInitialized();
  const auth = await requireAuth();
  if (isErrorResponse(auth)) return auth;

  const daysParam = Number(req.nextUrl.searchParams.get('days') ?? 7);
  const days = ALLOWED_RANGES.includes(daysParam) ? daysParam : 7;

  const [data, traffic] = await Promise.all([readCMSData(), getTrafficStats(days)]);

  const topPosts = [...data.posts]
    .sort((a, b) => b.views - a.views)
    .slice(0, 10)
    .map((p) => ({ id: p.id, title: p.title, status: p.status, views: p.views, publishedAt: p.publishedAt }));

  return jsonResponse({ days, traffic, topPosts });
}
