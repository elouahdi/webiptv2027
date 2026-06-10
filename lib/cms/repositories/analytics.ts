import { query, execute } from '@/lib/db';
import { readCMSData } from '../storage';

export interface AnalyticsEntry {
  date: string;
  views: number;
  uniqueVisitors: number;
}

export async function getAnalytics(days = 30): Promise<AnalyticsEntry[]> {
  // FIXED: Query MySQL directly with proper aggregation
  // analytics table rows: one row per page view event (page, event, created_at)
  // We aggregate by date to get daily view counts
  const rows = await query<any>(
    `SELECT 
      DATE(created_at) as date,
      COUNT(*) as views,
      COUNT(DISTINCT ip_address) as uniqueVisitors
     FROM analytics
     WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
     GROUP BY DATE(created_at)
     ORDER BY date ASC`,
    [days]
  );

  return rows.map((r: any) => ({
    date: r.date instanceof Date ? r.date.toISOString().split('T')[0] : String(r.date),
    views: Number(r.views),
    uniqueVisitors: Number(r.uniqueVisitors),
  }));
}

export async function recordPageView(page = '/', ipAddress = ''): Promise<void> {
  // FIXED: INSERT directly into MySQL instead of calling updateCMSData (which throws)
  try {
    await execute(
      `INSERT INTO analytics (page, event, ip_address, created_at) VALUES (?, 'pageview', ?, NOW())`,
      [page, ipAddress || null]
    );
  } catch {
    // Non-critical — never let analytics break the page render
  }
}

export async function getTrafficStats(days = 7) {
  const analytics = await getAnalytics(days);
  const totalViews = analytics.reduce((sum, a) => sum + a.views, 0);
  const avgDaily = analytics.length > 0 ? Math.round(totalViews / analytics.length) : 0;

  return { analytics, totalViews, avgDaily };
}

export async function getSEOStats() {
  // This reads from posts — still OK via readCMSData (SELECT only, no write)
  const data = await readCMSData();
  const posts = data.posts;
  const withSeoTitle = posts.filter((p) => p.seo.title).length;
  const withOgImage = posts.filter((p) => p.seo.ogImageId).length;
  const withCanonical = posts.filter((p) => p.seo.canonicalUrl).length;
  const indexed = posts.filter((p) => p.seo.robotsIndex).length;

  return {
    totalPosts: posts.length,
    withSeoTitle,
    withOgImage,
    withCanonical,
    indexed,
    seoCoverage: posts.length > 0 ? Math.round((withSeoTitle / posts.length) * 100) : 0,
  };
}
