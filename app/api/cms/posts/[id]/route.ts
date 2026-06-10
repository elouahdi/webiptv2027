import { ensureCMSInitialized } from '@/lib/cms/init';
import { getPostById, updatePost, deletePost } from '@/lib/cms/repositories/posts';
import {
  jsonResponse,
  errorResponse,
  requirePermission,
  isErrorResponse,
} from '@/lib/cms/api-helpers';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  await ensureCMSInitialized();
  const auth = await requirePermission('posts:read');
  if (isErrorResponse(auth)) return auth;

  const { id } = await params;
  const post = await getPostById(id);
  if (!post) return errorResponse('Article non trouvé', 404);
  return jsonResponse(post);
}

export async function PUT(request: Request, { params }: RouteParams) {
  await ensureCMSInitialized();
  const auth = await requirePermission('posts:write');
  if (isErrorResponse(auth)) return auth;

  const { id } = await params;
  const body = await request.json();
  const post = await updatePost(id, body);
  if (!post) return errorResponse('Article non trouvé', 404);
  return jsonResponse(post);
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  await ensureCMSInitialized();
  const auth = await requirePermission('posts:delete');
  if (isErrorResponse(auth)) return auth;

  const { id } = await params;
  const deleted = await deletePost(id);
  if (!deleted) return errorResponse('Article non trouvé', 404);
  return jsonResponse({ success: true });
}
