import { clearSessionCookie } from '@/lib/cms/auth/session';
import { jsonResponse } from '@/lib/cms/api-helpers';

export async function POST() {
  await clearSessionCookie();
  return jsonResponse({ success: true });
}
