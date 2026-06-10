import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, isErrorResponse } from '@/lib/cms/api-helpers';
import db from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth();
    if (isErrorResponse(auth)) return auth;

    const { searchParams } = new URL(req.url);
    const days = Number(searchParams.get('days') || 7);

    const [traffic] = await db.query(`
      SELECT DATE(created_at) as date, COUNT(*) as views
      FROM analytics
      WHERE event = 'pageview'
        AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `, [days]) as any[];

    const [topPosts] = await db.query(`
      SELECT id, title, status, views, published_at as publishedAt
      FROM posts WHERE status = 'published'
      ORDER BY views DESC LIMIT 10
    `) as any[];

    const [sources] = await db.query(`
      SELECT 
        CASE 
          WHEN referrer LIKE '%google%' THEN 'Google'
          WHEN referrer LIKE '%facebook%' THEN 'Facebook'
          WHEN referrer LIKE '%twitter%' OR referrer LIKE '%x.com%' THEN 'Twitter'
          WHEN referrer LIKE '%instagram%' THEN 'Instagram'
          WHEN referrer IS NULL OR referrer = '' THEN 'Direct'
          ELSE 'Autre'
        END as source,
        COUNT(*) as count
      FROM analytics
      WHERE event = 'pageview'
        AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
      GROUP BY source ORDER BY count DESC
    `, [days]) as any[];

    const [registrations] = await db.query(`
      SELECT DATE(created_at) as date, COUNT(*) as count
      FROM users
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
      GROUP BY DATE(created_at) ORDER BY date ASC
    `, [days]) as any[];

    return NextResponse.json({
      days,
      traffic: { analytics: Array.isArray(traffic) ? traffic : [] },
      topPosts: Array.isArray(topPosts) ? topPosts : [],
      sources: Array.isArray(sources) ? sources : [],
      registrations: Array.isArray(registrations) ? registrations : [],
    });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
