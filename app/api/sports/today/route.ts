import { NextRequest, NextResponse } from 'next/server';
import { fetchTodayMatches } from '@/lib/bsd-sports';

export const dynamic = 'force-dynamic';
export const runtime  = 'nodejs';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const dateParam = searchParams.get('date') || undefined;

  const { matches, error, date } = await fetchTodayMatches(dateParam);

  return NextResponse.json(
    { matches, error, date },
    { headers: { 'Cache-Control': 'no-store, max-age=0' } }
  );
}
