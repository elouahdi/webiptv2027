import { promises as fs } from 'fs';
import path from 'path';
import type { CMSData, Post, Category, Tag, MediaItem, Page, User, AnalyticsEntry } from './types';
import { safeParseJSON } from '@/lib/utils';

const EMPTY_DATA: CMSData = {
  posts: [],
  categories: [],
  tags: [],
  media: [],
  pages: [],
  users: [],
  analytics: [],
};

export const MEDIA_UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

export async function ensureUploadDir(folder = '') {
  const dir = path.join(MEDIA_UPLOAD_DIR, folder);
  await fs.mkdir(dir, { recursive: true });
  return dir;
}

// Helper to convert DB row to Post
function rowToPost(row: any): Post {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt || '',
    content: row.content || '',
    status: row.status,
    featured: row.featured,
    authorId: row.author_id,
    categoryId: row.category_id,
    featuredImageId: row.featured_image_id,
    galleryImageIds: (() => {
      const v = row.gallery_image_ids;
      if (!v) return [];
      if (typeof v === 'string') {
        try { return JSON.parse(v); } catch { return []; }
      }
      return v;
    })(),
    publishedAt: row.published_at ? row.published_at.toISOString() : null,
    scheduledAt: row.scheduled_at ? row.scheduled_at.toISOString() : null,
    readTime: row.read_time,
    views: row.views,
    tagIds: [], // Will be populated separately
    seo: {
      title: row.seo_title || '',
      description: row.seo_description || '',
      keywords: safeParseJSON<string[]>(row.seo_keywords, []),
      canonicalUrl: row.seo_canonical_url || '',
      ogTitle: row.seo_og_title || '',
      ogDescription: row.seo_og_description || '',
      ogImageId: row.seo_og_image_id,
      twitterCard: row.seo_twitter_card || 'summary_large_image',
      robotsIndex: row.seo_robots_index,
      robotsFollow: row.seo_robots_follow,
      schemaJsonLd: row.seo_schema_jsonld || '',
    },
    createdAt: row.created_at ? row.created_at.toISOString() : new Date().toISOString(),
    updatedAt: row.updated_at ? row.updated_at.toISOString() : new Date().toISOString(),
  };
}

// Helper to convert DB row to Category
function rowToCategory(row: any): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description || '',
    createdAt: row.created_at ? row.created_at.toISOString() : new Date().toISOString(),
    updatedAt: row.updated_at ? row.updated_at.toISOString() : new Date().toISOString(),
  };
}

// Helper to convert DB row to Tag
function rowToTag(row: any): Tag {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    createdAt: row.created_at ? row.created_at.toISOString() : new Date().toISOString(),
  };
}

// Helper to convert DB row to MediaItem
function rowToMediaItem(row: any): MediaItem {
  return {
    id: row.id,
    filename: row.filename,
    originalName: row.original_name,
    url: row.url,
    mimeType: row.mime_type,
    size: row.size,
    type: row.type,
    folder: row.folder,
    alt: row.alt || '',
    width: row.width,
    height: row.height,
    optimized: row.optimized,
    createdAt: row.created_at ? row.created_at.toISOString() : new Date().toISOString(),
  };
}

// Helper to convert DB row to Page
function rowToPage(row: any): Page {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    template: row.template,
    status: row.status,
      sections: safeParseJSON<any[]>(row.sections, []),
    seo: {
      title: row.seo_title || '',
      description: row.seo_description || '',
        keywords: safeParseJSON<string[]>(row.seo_keywords, []),
      canonicalUrl: row.seo_canonical_url || '',
      ogTitle: row.seo_og_title || '',
      ogDescription: row.seo_og_description || '',
      ogImageId: row.seo_og_image_id,
      twitterCard: row.seo_twitter_card || 'summary_large_image',
      robotsIndex: row.seo_robots_index,
      robotsFollow: row.seo_robots_follow,
      schemaJsonLd: row.seo_schema_jsonld || '',
    },
    createdAt: row.created_at ? row.created_at.toISOString() : new Date().toISOString(),
    updatedAt: row.updated_at ? row.updated_at.toISOString() : new Date().toISOString(),
  };
}

// Helper to convert DB row to User
function rowToUser(row: any): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    passwordHash: row.password,
    role: row.role,
    avatar: row.avatar,
    createdAt: row.created_at ? row.created_at.toISOString() : new Date().toISOString(),
    updatedAt: row.updated_at ? row.updated_at.toISOString() : new Date().toISOString(),
  };
}

// Helper to convert DB row to AnalyticsEntry
function rowToAnalyticsEntry(row: any): AnalyticsEntry {
  return {
    date: row.created_at ? row.created_at.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    views: 0, // Analytics table doesn't have views, using 0 as default
    uniqueVisitors: 0, // Analytics table doesn't have unique_visitors, using 0 as default
  };
}

export async function readCMSData(): Promise<CMSData> {
  try {
    const { query } = await import('@/lib/db');
    // Fetch all data from MySQL
    const users = await query('SELECT * FROM users');
    const categories = await query('SELECT * FROM categories');
    const tags = await query('SELECT * FROM tags');
    const media = await query('SELECT * FROM media');
    const pages = await query('SELECT * FROM pages');
    const posts = await query('SELECT * FROM posts');
    const analytics = await query('SELECT * FROM analytics ORDER BY created_at DESC LIMIT 30');

    // Fetch post-tag relationships
    const postTags = await query('SELECT post_id, tag_id FROM post_tags');
    const postTagMap = new Map<string, string[]>();
    postTags.forEach((pt: any) => {
      if (!postTagMap.has(pt.post_id)) {
        postTagMap.set(pt.post_id, []);
      }
      postTagMap.get(pt.post_id)!.push(pt.tag_id);
    });

    // Convert rows to TypeScript objects
    const cmsData: CMSData = {
      users: users.map(rowToUser),
      categories: categories.map(rowToCategory),
      tags: tags.map(rowToTag),
      media: media.map(rowToMediaItem),
      pages: pages.map(rowToPage),
      posts: posts.map((row: any) => {
        const post = rowToPost(row);
        post.tagIds = postTagMap.get(row.id) || [];
        return post;
      }),
      analytics: analytics.map(rowToAnalyticsEntry),
    };

    return cmsData;
  } catch (error) {
    console.error('Error reading CMS data from MySQL:', error);
    return EMPTY_DATA;
  }
}

export async function writeCMSData(_data: CMSData): Promise<void> {
  throw new Error('writeCMSData is not supported with MySQL. Use repository functions instead.');
}

export async function updateCMSData(
  _updater: (data: CMSData) => CMSData | void
): Promise<CMSData> {
  throw new Error('updateCMSData is not supported with MySQL. Use repository functions instead.');
}

export function invalidateCache() {
  // No-op for MySQL - connection pool handles caching
}
