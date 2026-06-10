import { ensureCMSInitialized } from '@/lib/cms/init';
import { getAllTags, createTag } from '@/lib/cms/repositories/tags';
import { jsonResponse, errorResponse, requirePermission, isErrorResponse } from '@/lib/cms/api-helpers';

export async function GET() {
  await ensureCMSInitialized();
  const tags = await getAllTags();
  return jsonResponse(tags);
}

export async function POST(request: Request) {
  await ensureCMSInitialized();
  const auth = await requirePermission('tags:write');
  if (isErrorResponse(auth)) return auth;

  const body = await request.json();
  if (!body.name) return errorResponse('Nom requis');

  const tag = await createTag(body);
  return jsonResponse(tag, 201);
}
