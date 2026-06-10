import { NextResponse } from 'next/server';
import { getSession, type SessionPayload } from './auth/session';
import { hasPermission } from './auth/permissions';
import type { UserRole } from './types';

export function jsonResponse<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function errorResponse(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function requireAuth(): Promise<SessionPayload | NextResponse> {
  const session = await getSession();
  if (!session) {
    return errorResponse('Non autorisé', 401);
  }
  return session;
}

export async function requirePermission(
  permission: string
): Promise<SessionPayload | NextResponse> {
  const result = await requireAuth();
  if (result instanceof NextResponse) return result;

  if (!hasPermission(result.role as UserRole, permission)) {
    return errorResponse('Permission refusée', 403);
  }
  return result;
}

export function isErrorResponse(value: unknown): value is NextResponse {
  return value instanceof NextResponse;
}
