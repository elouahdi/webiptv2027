import { ensureCMSInitialized } from '@/lib/cms/init';
import { getPostBySlug, incrementPostViews, getRelatedPosts } from '@/lib/cms/repositories/posts';
import { getCategoryById } from '@/lib/cms/repositories/categories';
import { getAllTags } from '@/lib/cms/repositories/tags';
import { getMediaById } from '@/lib/cms/repositories/media';
import { getUserById } from '@/lib/cms/repositories/users';
import { recordPageView } from '@/lib/cms/repositories/analytics';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  await ensureCMSInitialized();
  const { slug } = await params;

  const post = await getPostBySlug(slug);
  if (!post || (post.status !== 'published' && !(post.status === 'scheduled' && post.scheduledAt && new Date(post.scheduledAt) <= new Date()))) {
    return Response.json({ error: 'Article non trouvé' }, { status: 404 });
  }

  // Record page view in analytics + increment post views counter
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || '';
  await Promise.all([
    incrementPostViews(post.id),
    recordPageView(`/blog/${slug}`, ip),
  ]);

  const [category, allTags, author, featuredImage, related] = await Promise.all([
    post.categoryId ? getCategoryById(post.categoryId) : null,
    getAllTags(),
    getUserById(post.authorId),
    post.featuredImageId ? getMediaById(post.featuredImageId) : null,
    getRelatedPosts(post.id),
  ]);

  const tags = allTags.filter((t) => post.tagIds.includes(t.id));

  return Response.json({
    post,
    category,
    tags,
    author: author ? { id: author.id, name: author.name, avatar: author.avatar } : null,
    featuredImage,
    related,
  });
}
