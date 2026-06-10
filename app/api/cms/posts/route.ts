import { ensureCMSInitialized } from '@/lib/cms/init';
import { getAllPosts, createPost } from '@/lib/cms/repositories/posts';
import {
  jsonResponse,
  errorResponse,
  requirePermission,
  isErrorResponse,
} from '@/lib/cms/api-helpers';
import type { PostStatus } from '@/lib/cms/types';

export async function GET(request: Request) {
  await ensureCMSInitialized();
  const auth = await requirePermission('posts:read');
  if (isErrorResponse(auth)) return auth;

  const { searchParams } = new URL(request.url);
  const result = await getAllPosts({
    status: (searchParams.get('status') as PostStatus) || undefined,
    categoryId: searchParams.get('categoryId') || undefined,
    tagId: searchParams.get('tagId') || undefined,
    search: searchParams.get('search') || undefined,
    page: Number(searchParams.get('page')) || 1,
    limit: Number(searchParams.get('limit')) || 20,
  });

  return jsonResponse(result);
}

export async function POST(request: Request) {
  await ensureCMSInitialized();
  const auth = await requirePermission('posts:write');
  if (isErrorResponse(auth)) return auth;

  const body = await request.json();
  if (!body.title) return errorResponse('Titre requis');

  const post = await createPost({ ...body, authorId: body.authorId || auth.userId });
  return jsonResponse(post, 201);
}
