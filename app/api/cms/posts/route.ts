import { ensureCMSInitialized } from '@/lib/cms/init';
import { getAllPosts, createPost } from '@/lib/cms/repositories/posts';
import { readCMSData } from '@/lib/cms/storage';
import {
  jsonResponse,
  errorResponse,
  requirePermission,
  isErrorResponse,
} from '@/lib/cms/api-helpers';
import type { Post, PostStatus } from '@/lib/cms/types';

export async function GET(request: Request) {
  await ensureCMSInitialized();
  const auth = await requirePermission('posts:read');
  if (isErrorResponse(auth)) return auth;

  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 20;
  const dateFrom = searchParams.get('dateFrom');
  const dateTo = searchParams.get('dateTo');
  const enriched = searchParams.get('enriched') === '1';

  // Fetch the full filtered set, then apply date filters and paginate here
  const result = await getAllPosts({
    status: (searchParams.get('status') as PostStatus) || undefined,
    categoryId: searchParams.get('categoryId') || undefined,
    tagId: searchParams.get('tagId') || undefined,
    search: searchParams.get('search') || undefined,
    page: 1,
    limit: Number.MAX_SAFE_INTEGER,
  });

  let posts: Post[] = result.posts;

  if (dateFrom) {
    const from = new Date(dateFrom).getTime();
    if (!Number.isNaN(from)) {
      posts = posts.filter((p) => new Date(p.updatedAt).getTime() >= from);
    }
  }
  if (dateTo) {
    const to = new Date(dateTo);
    if (!Number.isNaN(to.getTime())) {
      to.setHours(23, 59, 59, 999);
      posts = posts.filter((p) => new Date(p.updatedAt).getTime() <= to.getTime());
    }
  }

  const total = posts.length;
  const totalPages = Math.max(Math.ceil(total / limit), 1);
  const start = (page - 1) * limit;
  posts = posts.slice(start, start + limit);

  if (!enriched) {
    return jsonResponse({ posts, total, page, totalPages });
  }

  const data = await readCMSData();
  const enrichedPosts = posts.map((p) => {
    const author = data.users.find((u) => u.id === p.authorId);
    const category = data.categories.find((c) => c.id === p.categoryId);
    const image = data.media.find((m) => m.id === p.featuredImageId);
    return {
      ...p,
      authorName: author?.name ?? null,
      authorAvatar: author?.avatar ?? null,
      categoryName: category?.name ?? null,
      featuredImageUrl: image?.url ?? null,
    };
  });

  return jsonResponse({ posts: enrichedPosts, total, page, totalPages });
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
