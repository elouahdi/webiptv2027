import { NextResponse } from 'next/server';
import { readSettings } from '@/lib/cms/settings-storage';

// Public endpoint — returns only frontend-safe fields (no sensitive data)
export async function GET() {
  try {
    const settings = await readSettings();
    const { pricing, hero, about, features, footer, contact, announcement, seoPages } = settings;
    // No debug logging in production code
    return NextResponse.json({ pricing, hero, about, features, footer, contact, announcement, seoPages });
  } catch (err) {
    console.error('Public settings GET error:', err);
    return NextResponse.json({ error: 'Failed to read settings' }, { status: 500 });
  }
}
