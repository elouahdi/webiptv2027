import { ensureCMSInitialized } from './init';
import { getPublishedPosts, getPostBySlug, getPopularPosts, getRelatedPosts } from './repositories/posts';
import { getAllCategories, getCategoryBySlug, getCategoryById } from './repositories/categories';
import { getAllTags, getTagBySlug } from './repositories/tags';
import { getMediaById } from './repositories/media';
import { getUserById } from './repositories/users';
import type { Post, Category, Tag, MediaItem } from './types';

export interface EnrichedPost {
  post: Post;
  category: Category | null;
  tags: Tag[];
  author: { id: string; name: string; avatar: string | null } | null;
  featuredImage: MediaItem | null;
}

async function enrichPost(post: Post): Promise<EnrichedPost> {
  const [category, allTags, author, featuredImage] = await Promise.all([
    post.categoryId ? getCategoryById(post.categoryId) : null,
    getAllTags(),
    getUserById(post.authorId),
    post.featuredImageId ? getMediaById(post.featuredImageId) : null,
  ]);

  return {
    post,
    category: category ?? null,
    tags: allTags.filter((t) => post.tagIds.includes(t.id)),
    author: author ? { id: author.id, name: author.name, avatar: author.avatar } : null,
    featuredImage: featuredImage ?? null,
  };
}

export async function getPublicBlogPosts(options?: {
  page?: number;
  limit?: number;
  categoryId?: string;
  tagId?: string;
  search?: string;
}) {
  await ensureCMSInitialized();
  const result = await getPublishedPosts(options);
  const enriched = await Promise.all(result.posts.map(enrichPost));
  return { ...result, posts: enriched };
}

export async function getPublicBlogPost(slug: string) {
  await ensureCMSInitialized();
  const post = await getPostBySlug(slug);
  if (!post) return null;

  const isVisible =
    post.status === 'published' ||
    (post.status === 'scheduled' && post.scheduledAt && new Date(post.scheduledAt) <= new Date());

  if (!isVisible) return null;

  const enriched = await enrichPost(post);
  const related = await getRelatedPosts(post.id);
  const relatedEnriched = await Promise.all(related.map(enrichPost));

  return { ...enriched, related: relatedEnriched };
}

export async function getPublicPopularPosts(limit = 5) {
  await ensureCMSInitialized();
  const posts = await getPopularPosts(limit);
  return Promise.all(posts.map(enrichPost));
}

export async function getPublicCategories() {
  await ensureCMSInitialized();
  return getAllCategories();
}

export async function getPublicCategoryPosts(slug: string, page = 1) {
  await ensureCMSInitialized();
  const category = await getCategoryBySlug(slug);
  if (!category) return null;

  const result = await getPublishedPosts({ categoryId: category.id, page });
  const enriched = await Promise.all(result.posts.map(enrichPost));
  return { category, ...result, posts: enriched };
}

export async function getPublicTagPosts(slug: string, page = 1) {
  await ensureCMSInitialized();
  const tag = await getTagBySlug(slug);
  if (!tag) return null;

  const result = await getPublishedPosts({ tagId: tag.id, page });
  const enriched = await Promise.all(result.posts.map(enrichPost));
  return { tag, ...result, posts: enriched };
}

export async function getAllPublicPostSlugs() {
  await ensureCMSInitialized();
  const result = await getPublishedPosts({ limit: 1000 });
  return result.posts.map((p) => p.slug);
}
