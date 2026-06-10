import { ensureCMSInitialized } from '@/lib/cms/init';
import { getAllPages, createPage } from '@/lib/cms/repositories/pages';
import { jsonResponse, errorResponse, requirePermission, isErrorResponse } from '@/lib/cms/api-helpers';

export async function GET() {
  await ensureCMSInitialized();
  const auth = await requirePermission('pages:read');
  if (isErrorResponse(auth)) return auth;

  const pages = await getAllPages();
  return jsonResponse(pages);
}

export async function POST(request: Request) {
  await ensureCMSInitialized();
  const auth = await requirePermission('pages:write');
  if (isErrorResponse(auth)) return auth;

  const body = await request.json();
  if (!body.title) return errorResponse('Titre requis');

  const page = await createPage(body);
  return jsonResponse(page, 201);
}
