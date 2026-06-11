import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, isErrorResponse } from '@/lib/cms/api-helpers';
import db from '@/lib/db';

async function setSetting(key: string, value: any) {
  await db.query(
    `INSERT INTO settings (setting_key, setting_value) VALUES (?, ?)
     ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
    [key, JSON.stringify(value)]
  );
}

export async function GET(_req: NextRequest) {
  try {
    const auth = await requireAuth();
    if (isErrorResponse(auth)) return auth;
    const [rows] = await db.query('SELECT setting_key, setting_value FROM settings') as any[];
    const result: any = {};
    for (const row of (Array.isArray(rows) ? rows : [])) {
      try { result[row.setting_key] = JSON.parse(row.setting_value); }
      catch { result[row.setting_key] = row.setting_value; }
    }
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const auth = await requireAuth();
    if (isErrorResponse(auth)) return auth;
    const body = await req.json();
    for (const [key, value] of Object.entries(body)) {
      await setSetting(key, value);
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
