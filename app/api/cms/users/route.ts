import { ensureCMSInitialized } from '@/lib/cms/init';
import { getAllUsers, createUser } from '@/lib/cms/repositories/users';
import { jsonResponse, errorResponse, requirePermission, isErrorResponse } from '@/lib/cms/api-helpers';

export async function GET() {
  await ensureCMSInitialized();
  const auth = await requirePermission('users:read');
  if (isErrorResponse(auth)) return auth;

  const users = await getAllUsers();
  return jsonResponse(users);
}

export async function POST(request: Request) {
  await ensureCMSInitialized();
  const auth = await requirePermission('*');
  if (isErrorResponse(auth)) return auth;

  const body = await request.json();
  if (!body.name || !body.email || !body.password) {
    return errorResponse('Nom, email et mot de passe requis');
  }

  const user = await createUser(body);
  return jsonResponse(user, 201);
}
