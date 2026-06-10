import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { page, event = 'pageview', referrer } = body;
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = req.headers.get('user-agent') || '';

    let source = 'direct';
    if (referrer) {
      if (referrer.includes('google')) source = 'google';
      else if (referrer.includes('facebook')) source = 'facebook';
      else if (referrer.includes('twitter') || referrer.includes('x.com')) source = 'twitter';
      else if (referrer.includes('instagram')) source = 'instagram';
      else source = 'other';
    }

    await db.query(
      `INSERT INTO analytics (page, event, data, ip_address, referrer, user_agent) VALUES (?, ?, ?, ?, ?, ?)`,
      [page, event, JSON.stringify({ source }), ip, referrer || null, userAgent]
    );

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
