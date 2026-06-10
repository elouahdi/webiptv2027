import { ensureCMSInitialized } from '@/lib/cms/init';
import { getPageById, updatePage, deletePage } from '@/lib/cms/repositories/pages';
import { jsonResponse, errorResponse, requirePermission, isErrorResponse } from '@/lib/cms/api-helpers';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  await ensureCMSInitialized();
  const auth = await requirePermission('pages:read');
  if (isErrorResponse(auth)) return auth;

  const { id } = await params;
  const page = await getPageById(id);
  if (!page) return errorResponse('Page non trouvée', 404);
  return jsonResponse(page);
}

export async function PUT(request: Request, { params }: RouteParams) {
  await ensureCMSInitialized();
  const auth = await requirePermission('pages:write');
  if (isErrorResponse(auth)) return auth;

  const { id } = await params;
  const body = await request.json();
  const page = await updatePage(id, body);
  if (!page) return errorResponse('Page non trouvée', 404);
  return jsonResponse(page);
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  await ensureCMSInitialized();
  const auth = await requirePermission('pages:write');
  if (isErrorResponse(auth)) return auth;

  const { id } = await params;
  const deleted = await deletePage(id);
  if (!deleted) return errorResponse('Page non trouvée', 404);
  return jsonResponse({ success: true });
}
