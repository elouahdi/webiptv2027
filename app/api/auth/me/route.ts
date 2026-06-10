import { getSession } from '@/lib/cms/auth/session';
import { jsonResponse, errorResponse } from '@/lib/cms/api-helpers';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return errorResponse('Non autorisé', 401);
  }
  return jsonResponse({ user: session });
}
