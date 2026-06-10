import { ensureCMSInitialized } from '@/lib/cms/init';
import { getAllCategories, createCategory } from '@/lib/cms/repositories/categories';
import { jsonResponse, errorResponse, requirePermission, isErrorResponse } from '@/lib/cms/api-helpers';

export async function GET() {
  await ensureCMSInitialized();
  const categories = await getAllCategories();
  return jsonResponse(categories);
}

export async function POST(request: Request) {
  await ensureCMSInitialized();
  const auth = await requirePermission('categories:write');
  if (isErrorResponse(auth)) return auth;

  const body = await request.json();
  if (!body.name) return errorResponse('Nom requis');

  const category = await createCategory(body);
  return jsonResponse(category, 201);
}
