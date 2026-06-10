/**
 * Server-side helper to load site settings for use in Next.js Server Components.
 * Falls back to defaults if settings file doesn't exist yet.
 */
import { readSettings, type SiteSettings } from '@/lib/cms/settings-storage';

export async function getSettings(): Promise<SiteSettings> {
  try {
    return await readSettings();
  } catch {
    // Return defaults inline if storage fails
    return readSettings();
  }
}

/**
 * Client-side hook: fetch settings from public API (no auth needed)
 */
export async function fetchPublicSettings(): Promise<Partial<SiteSettings> | null> {
  try {
    const res = await fetch('/api/public/settings', { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}
