import { verifyPassword } from '@/lib/cms/repositories/users';
import { createSession, setSessionCookie } from '@/lib/cms/auth/session';
import { ensureCMSInitialized } from '@/lib/cms/init';
import { jsonResponse, errorResponse } from '@/lib/cms/api-helpers';

export async function POST(request: Request) {
  await ensureCMSInitialized();

  const body = await request.json();
  const { email, password } = body;

  if (!email || !password) {
    return errorResponse('Email et mot de passe requis');
  }

  const user = await verifyPassword(email, password);
  if (!user) {
    return errorResponse('Identifiants invalides', 401);
  }

  const token = await createSession(user);
  await setSessionCookie(token);

  return jsonResponse({
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
}
