import { ensureCMSInitialized } from '@/lib/cms/init';
import { updateTag, deleteTag } from '@/lib/cms/repositories/tags';
import { jsonResponse, errorResponse, requirePermission, isErrorResponse } from '@/lib/cms/api-helpers';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: RouteParams) {
  await ensureCMSInitialized();
  const auth = await requirePermission('tags:write');
  if (isErrorResponse(auth)) return auth;

  const { id } = await params;
  const body = await request.json();
  const tag = await updateTag(id, body);
  if (!tag) return errorResponse('Tag non trouvé', 404);
  return jsonResponse(tag);
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  await ensureCMSInitialized();
  const auth = await requirePermission('tags:write');
  if (isErrorResponse(auth)) return auth;

  const { id } = await params;
  const deleted = await deleteTag(id);
  if (!deleted) return errorResponse('Tag non trouvé', 404);
  return jsonResponse({ success: true });
}
