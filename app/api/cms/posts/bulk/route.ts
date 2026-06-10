import { ensureCMSInitialized } from '@/lib/cms/init';
import { updatePost, deletePost } from '@/lib/cms/repositories/posts';
import {
  jsonResponse,
  errorResponse,
  requirePermission,
  isErrorResponse,
} from '@/lib/cms/api-helpers';

type BulkAction = 'delete' | 'publish' | 'draft';

const ACTIONS: BulkAction[] = ['delete', 'publish', 'draft'];

export async function POST(request: Request) {
  await ensureCMSInitialized();

  const body = (await request.json()) as { ids?: unknown; action?: unknown };
  const ids = Array.isArray(body.ids) ? body.ids.filter((id): id is string => typeof id === 'string') : [];
  const action = body.action as BulkAction;

  if (ids.length === 0) return errorResponse('Aucun article sélectionné');
  if (!ACTIONS.includes(action)) return errorResponse('Action invalide');

  const auth = await requirePermission(action === 'delete' ? 'posts:delete' : 'posts:write');
  if (isErrorResponse(auth)) return auth;

  let processed = 0;
  for (const id of ids) {
    if (action === 'delete') {
      const deleted = await deletePost(id);
      if (deleted) processed++;
    } else {
      const updated = await updatePost(id, {
        status: action === 'publish' ? 'published' : 'draft',
      });
      if (updated) processed++;
    }
  }

  return jsonResponse({ success: true, processed, action });
}
