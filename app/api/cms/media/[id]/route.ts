import { ensureCMSInitialized } from '@/lib/cms/init';
import { updateMedia, deleteMedia } from '@/lib/cms/repositories/media';
import { jsonResponse, errorResponse, requirePermission, isErrorResponse } from '@/lib/cms/api-helpers';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: RouteParams) {
  await ensureCMSInitialized();
  const auth = await requirePermission('media:write');
  if (isErrorResponse(auth)) return auth;

  const { id } = await params;
  const body = await request.json();
  const item = await updateMedia(id, body);
  if (!item) return errorResponse('Média non trouvé', 404);
  return jsonResponse(item);
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  await ensureCMSInitialized();
  const auth = await requirePermission('media:delete');
  if (isErrorResponse(auth)) return auth;

  const { id } = await params;
  const deleted = await deleteMedia(id);
  if (!deleted) return errorResponse('Média non trouvé', 404);
  return jsonResponse({ success: true });
}
