import { ensureCMSInitialized } from '@/lib/cms/init';
import { updateCategory, deleteCategory } from '@/lib/cms/repositories/categories';
import { jsonResponse, errorResponse, requirePermission, isErrorResponse } from '@/lib/cms/api-helpers';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: RouteParams) {
  await ensureCMSInitialized();
  const auth = await requirePermission('categories:write');
  if (isErrorResponse(auth)) return auth;

  const { id } = await params;
  const body = await request.json();
  const category = await updateCategory(id, body);
  if (!category) return errorResponse('Catégorie non trouvée', 404);
  return jsonResponse(category);
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  await ensureCMSInitialized();
  const auth = await requirePermission('categories:write');
  if (isErrorResponse(auth)) return auth;

  const { id } = await params;
  const deleted = await deleteCategory(id);
  if (!deleted) return errorResponse('Catégorie non trouvée', 404);
  return jsonResponse({ success: true });
}
