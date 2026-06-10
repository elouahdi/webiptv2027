import { v4 as uuidv4 } from 'uuid';
import type { Post, PostStatus, SEOSettings } from '../types';
import { DEFAULT_SEO } from '../types';
import { readCMSData } from '../storage';
import { generateSlug, ensureUniqueSlug } from '../services/slug';
import { calculateReadingTime } from '../services/reading-time';
import { query, execute } from '@/lib/db';

export interface PostFilters {
  status?: PostStatus;
  categoryId?: string;
  tagId?: string;
  authorId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PostListResult {
  posts: Post[];
  total: number;
  page: number;
  totalPages: number;
}

function isPublished(post: Post): boolean {
  if (post.status === 'published') return true;
  if (post.status === 'scheduled' && post.scheduledAt) {
    return new Date(post.scheduledAt) <= new Date();
  }
  return false;
}

export async function getAllPosts(filters: PostFilters = {}): Promise<PostListResult> {
  const data = await readCMSData();
  let posts = [...data.posts];

  if (filters.status) {
    posts = posts.filter((p) => p.status === filters.status);
  }
  if (filters.categoryId) {
    posts = posts.filter((p) => p.categoryId === filters.categoryId);
  }
  if (filters.tagId) {
    posts = posts.filter((p) => p.tagIds.includes(filters.tagId!));
  }
  if (filters.authorId) {
    posts = posts.filter((p) => p.authorId === filters.authorId);
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    posts = posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q)
    );
  }

  posts.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const page = filters.page ?? 1;
  const limit = filters.limit ?? 20;
  const total = posts.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;

  return {
    posts: posts.slice(start, start + limit),
    total,
    page,
    totalPages,
  };
}

export async function getPublishedPosts(filters: Omit<PostFilters, 'status'> = {}): Promise<PostListResult> {
  const data = await readCMSData();
  let posts = data.posts.filter(isPublished);

  if (filters.categoryId) {
    posts = posts.filter((p) => p.categoryId === filters.categoryId);
  }
  if (filters.tagId) {
    posts = posts.filter((p) => p.tagIds.includes(filters.tagId!));
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    posts = posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q)
    );
  }

  posts.sort((a, b) => {
    const dateA = a.publishedAt || a.createdAt;
    const dateB = b.publishedAt || b.createdAt;
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });

  const page = filters.page ?? 1;
  const limit = filters.limit ?? 12;
  const total = posts.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;

  return {
    posts: posts.slice(start, start + limit),
    total,
    page,
    totalPages,
  };
}

export async function getPostById(id: string): Promise<Post | null> {
  const data = await readCMSData();
  return data.posts.find((p) => p.id === id) ?? null;
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const data = await readCMSData();
  return data.posts.find((p) => p.slug === slug) ?? null;
}

export async function getPopularPosts(limit = 5): Promise<Post[]> {
  const data = await readCMSData();
  return data.posts
    .filter(isPublished)
    .sort((a, b) => b.views - a.views)
    .slice(0, limit);
}

export async function getRelatedPosts(postId: string, limit = 3): Promise<Post[]> {
  const data = await readCMSData();
  const post = data.posts.find((p) => p.id === postId);
  if (!post) return [];

  return data.posts
    .filter((p) => p.id !== postId && isPublished(p))
    .filter(
      (p) =>
        p.categoryId === post.categoryId ||
        p.tagIds.some((t) => post.tagIds.includes(t))
    )
    .sort((a, b) => b.views - a.views)
    .slice(0, limit);
}

export interface CreatePostInput {
  title: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  status?: PostStatus;
  publishedAt?: string | null;
  scheduledAt?: string | null;
  categoryId?: string | null;
  tagIds?: string[];
  authorId: string;
  featuredImageId?: string | null;
  galleryImageIds?: string[];
  seo?: Partial<SEOSettings>;
}

export async function createPost(input: CreatePostInput): Promise<Post> {
  const now = new Date().toISOString();
  
  // Get existing posts to ensure unique slug
  const existingPosts = await query<any>('SELECT slug FROM posts');
  const existingSlugs = existingPosts.map((p: any) => p.slug);
  const slug = ensureUniqueSlug(
    input.slug || generateSlug(input.title),
    existingSlugs
  );
  
  const content = input.content ?? '';
  const readTime = calculateReadingTime(content);
  const seo = { ...DEFAULT_SEO, ...input.seo };
  const id = uuidv4();

  await execute(
    `INSERT INTO posts (
      id, title, slug, excerpt, content, status, 
      published_at, scheduled_at, category_id, author_id, 
      featured_image_id, gallery_image_ids, read_time, views,
      seo_title, seo_description, seo_keywords, seo_canonical_url,
      seo_og_title, seo_og_description, seo_og_image_id,
      seo_twitter_card, seo_robots_index, seo_robots_follow, seo_schema_jsonld,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [
      id,
      input.title,
      slug,
      input.excerpt ?? '',
      content,
      input.status ?? 'draft',
      input.publishedAt ?? (input.status === 'published' ? now : null),
      input.scheduledAt ?? null,
      input.categoryId ?? null,
      input.authorId,
      input.featuredImageId ?? null,
      JSON.stringify(input.galleryImageIds ?? []),
      readTime,
      0,
      seo.title,
      seo.description,
      JSON.stringify(seo.keywords),
      seo.canonicalUrl,
      seo.ogTitle,
      seo.ogDescription,
      seo.ogImageId,
      seo.twitterCard,
      seo.robotsIndex,
      seo.robotsFollow,
      seo.schemaJsonLd,
    ]
  );
  
  // Insert tag relationships
  if (input.tagIds && input.tagIds.length > 0) {
    for (const tagId of input.tagIds) {
      await execute(
        'INSERT INTO post_tags (post_id, tag_id) VALUES (?, ?)',
        [id, tagId]
      );
    }
  }

  // Fetch the created post
  const posts = await query<any>('SELECT * FROM posts WHERE id = ?', [id]);
  const post = posts[0];
  const tagIds = input.tagIds ?? [];
  
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt || '',
    content: post.content || '',
    status: post.status,
    featured: post.featured || false,
    publishedAt: post.published_at ? post.published_at.toISOString() : null,
    scheduledAt: post.scheduled_at ? post.scheduled_at.toISOString() : null,
    categoryId: post.category_id,
    tagIds,
    authorId: post.author_id,
    featuredImageId: post.featured_image_id,
    galleryImageIds: post.gallery_image_ids ? JSON.parse(post.gallery_image_ids) : [],
    readTime: post.read_time,
    views: post.views,
    seo: {
      title: post.seo_title || '',
      description: post.seo_description || '',
      keywords: post.seo_keywords ? JSON.parse(post.seo_keywords) : [],
      canonicalUrl: post.seo_canonical_url || '',
      ogTitle: post.seo_og_title || '',
      ogDescription: post.seo_og_description || '',
      ogImageId: post.seo_og_image_id,
      twitterCard: post.seo_twitter_card || 'summary_large_image',
      robotsIndex: post.seo_robots_index,
      robotsFollow: post.seo_robots_follow,
      schemaJsonLd: post.seo_schema_jsonld || '',
    },
    createdAt: post.created_at ? post.created_at.toISOString() : now,
    updatedAt: post.updated_at ? post.updated_at.toISOString() : now,
  };
}

export async function updatePost(id: string, input: Partial<CreatePostInput>): Promise<Post | null> {
  const now = new Date().toISOString();
  
  // Get existing post
  const posts = await query<any>('SELECT * FROM posts WHERE id = ?', [id]);
  const existing = posts[0];
  if (!existing) return null;
  
  // Ensure unique slug if changing
  let slug = existing.slug;
  if (input.slug !== undefined || input.title) {
    const existingPosts = await query<any>('SELECT id, slug FROM posts WHERE id != ?', [id]);
    const existingSlugs = existingPosts.map((p: any) => p.slug);
    slug = ensureUniqueSlug(
      input.slug !== undefined ? input.slug : generateSlug(input.title || existing.title),
      existingSlugs
    );
  }
  
  const content = input.content ?? existing.content;
  const readTime = calculateReadingTime(content);
  const existingSeo = {
    title: existing.seo_title || '',
    description: existing.seo_description || '',
    keywords: existing.seo_keywords ? JSON.parse(existing.seo_keywords) : [],
    canonicalUrl: existing.seo_canonical_url || '',
    ogTitle: existing.seo_og_title || '',
    ogDescription: existing.seo_og_description || '',
    ogImageId: existing.seo_og_image_id,
    twitterCard: existing.seo_twitter_card || 'summary_large_image',
    robotsIndex: existing.seo_robots_index,
    robotsFollow: existing.seo_robots_follow,
    schemaJsonLd: existing.seo_schema_jsonld || '',
  };
  const seo = input.seo ? { ...existingSeo, ...input.seo } : existingSeo;
  
  const publishedAt = input.status === 'published' && !existing.published_at
    ? now
    : input.publishedAt !== undefined
      ? input.publishedAt
      : existing.published_at ? existing.published_at.toISOString() : null;

  // Update post
  await execute(
    `UPDATE posts SET
      title = ?, slug = ?, excerpt = ?, content = ?, status = ?,
      published_at = ?, scheduled_at = ?, category_id = ?, author_id = ?,
      featured_image_id = ?, gallery_image_ids = ?, read_time = ?,
      seo_title = ?, seo_description = ?, seo_keywords = ?, seo_canonical_url = ?,
      seo_og_title = ?, seo_og_description = ?, seo_og_image_id = ?,
      seo_twitter_card = ?, seo_robots_index = ?, seo_robots_follow = ?, seo_schema_jsonld = ?,
      updated_at = NOW()
    WHERE id = ?`,
    [
      input.title ?? existing.title,
      slug,
      input.excerpt ?? existing.excerpt,
      content,
      input.status ?? existing.status,
      publishedAt,
      input.scheduledAt ?? (existing.scheduled_at ? existing.scheduled_at.toISOString() : null),
      input.categoryId !== undefined ? input.categoryId : existing.category_id,
      input.authorId ?? existing.author_id,
      input.featuredImageId !== undefined ? input.featuredImageId : existing.featured_image_id,
      JSON.stringify(input.galleryImageIds ?? (existing.gallery_image_ids ? JSON.parse(existing.gallery_image_ids) : [])),
      readTime,
      seo.title,
      seo.description,
      JSON.stringify(seo.keywords),
      seo.canonicalUrl,
      seo.ogTitle,
      seo.ogDescription,
      seo.ogImageId,
      seo.twitterCard,
      seo.robotsIndex,
      seo.robotsFollow,
      seo.schemaJsonLd,
      id,
    ]
  );
  
  // Update tag relationships
  if (input.tagIds !== undefined) {
    // Delete existing relationships
    await execute('DELETE FROM post_tags WHERE post_id = ?', [id]);
    // Insert new relationships
    if (input.tagIds.length > 0) {
      for (const tagId of input.tagIds) {
        await execute(
          'INSERT INTO post_tags (post_id, tag_id) VALUES (?, ?)',
          [id, tagId]
        );
      }
    }
  }
  
  // Fetch updated post
  const updatedPosts = await query<any>('SELECT * FROM posts WHERE id = ?', [id]);
  const post = updatedPosts[0];
  const postTags = await query<any>('SELECT tag_id FROM post_tags WHERE post_id = ?', [id]);
  const tagIds = postTags.map((pt: any) => pt.tag_id);
  
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt || '',
    content: post.content || '',
    status: post.status,
    featured: post.featured || false,
    publishedAt: post.published_at ? post.published_at.toISOString() : null,
    scheduledAt: post.scheduled_at ? post.scheduled_at.toISOString() : null,
    categoryId: post.category_id,
    tagIds,
    authorId: post.author_id,
    featuredImageId: post.featured_image_id,
    galleryImageIds: post.gallery_image_ids ? JSON.parse(post.gallery_image_ids) : [],
    readTime: post.read_time,
    views: post.views,
    seo: {
      title: post.seo_title || '',
      description: post.seo_description || '',
      keywords: post.seo_keywords ? JSON.parse(post.seo_keywords) : [],
      canonicalUrl: post.seo_canonical_url || '',
      ogTitle: post.seo_og_title || '',
      ogDescription: post.seo_og_description || '',
      ogImageId: post.seo_og_image_id,
      twitterCard: post.seo_twitter_card || 'summary_large_image',
      robotsIndex: post.seo_robots_index,
      robotsFollow: post.seo_robots_follow,
      schemaJsonLd: post.seo_schema_jsonld || '',
    },
    createdAt: post.created_at ? post.created_at.toISOString() : now,
    updatedAt: post.updated_at ? post.updated_at.toISOString() : now,
  };
}

export async function deletePost(id: string): Promise<boolean> {
  // Delete post tag relationships
  await execute('DELETE FROM post_tags WHERE post_id = ?', [id]);
  
  // Delete post
  const result = await execute('DELETE FROM posts WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

export async function incrementPostViews(id: string): Promise<void> {
  await execute('UPDATE posts SET views = views + 1 WHERE id = ?', [id]);
}

export async function getPostStats() {
  const data = await readCMSData();
  const published = data.posts.filter((p) => p.status === 'published' || isPublished(p));
  const drafts = data.posts.filter((p) => p.status === 'draft');
  const scheduled = data.posts.filter((p) => p.status === 'scheduled');
  const totalViews = data.posts.reduce((sum, p) => sum + p.views, 0);

  return {
    total: data.posts.length,
    published: published.length,
    drafts: drafts.length,
    scheduled: scheduled.length,
    totalViews,
  };
}
