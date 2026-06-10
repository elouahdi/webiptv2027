import { ensureCMSInitialized } from '@/lib/cms/init';
import { getPublishedPosts } from '@/lib/cms/repositories/posts';

export async function GET(request: Request) {
  await ensureCMSInitialized();

  const { searchParams } = new URL(request.url);
  const result = await getPublishedPosts({
    categoryId: searchParams.get('categoryId') || undefined,
    tagId: searchParams.get('tagId') || undefined,
    search: searchParams.get('search') || undefined,
    page: Number(searchParams.get('page')) || 1,
    limit: Number(searchParams.get('limit')) || 12,
  });

  return Response.json(result);
}
