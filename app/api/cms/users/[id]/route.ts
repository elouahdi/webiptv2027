import { ensureCMSInitialized } from '@/lib/cms/init';
import { updateUser, deleteUser } from '@/lib/cms/repositories/users';
import { jsonResponse, errorResponse, requirePermission, isErrorResponse } from '@/lib/cms/api-helpers';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: RouteParams) {
  await ensureCMSInitialized();
  const auth = await requirePermission('*');
  if (isErrorResponse(auth)) return auth;

  const { id } = await params;
  const body = await request.json();

  if (body.status === 'suspended' && id === auth.userId) {
    return errorResponse('Impossible de suspendre votre propre compte');
  }

  const user = await updateUser(id, body);
  if (!user) return errorResponse('Utilisateur non trouvé', 404);
  return jsonResponse(user);
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  await ensureCMSInitialized();
  const auth = await requirePermission('*');
  if (isErrorResponse(auth)) return auth;

  const { id } = await params;
  if (id === auth.userId) return errorResponse('Impossible de supprimer votre propre compte');

  const deleted = await deleteUser(id);
  if (!deleted) return errorResponse('Utilisateur non trouvé', 404);
  return jsonResponse({ success: true });
}
