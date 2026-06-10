import { NextRequest, NextResponse } from 'next/server';
import { readSettings, writeSettings } from '@/lib/cms/settings-storage';
import { requireAuth, isErrorResponse } from '@/lib/cms/api-helpers';

export async function GET() {
  const auth = await requireAuth();
  if (isErrorResponse(auth)) return auth;

  try {
    const settings = await readSettings();
    return NextResponse.json(settings);
  } catch (err) {
    console.error('Settings GET error:', err);
    return NextResponse.json({ error: 'Failed to read settings' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (isErrorResponse(auth)) return auth;

  try {
    const body = await req.json();
    const updated = await writeSettings(body);
    return NextResponse.json(updated);
  } catch (err) {
    console.error('Settings POST error:', err);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
