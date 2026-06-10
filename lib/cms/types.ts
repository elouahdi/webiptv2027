export type PostStatus = 'draft' | 'published' | 'scheduled';
export type UserRole = 'admin' | 'editor' | 'author' | 'moderator';
export type TwitterCardType = 'summary' | 'summary_large_image' | 'app' | 'player';
export type PageStatus = 'draft' | 'published';
export type PageTemplate = 'home' | 'about' | 'contact' | 'privacy' | 'terms' | 'custom';
export type MediaType = 'image' | 'video' | 'document';
export type PageBlockType =
  | 'hero'
  | 'text'
  | 'image'
  | 'cta'
  | 'features'
  | 'faq'
  | 'contact-form'
  | 'gallery';

export interface SEOSettings {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImageId: string | null;
  twitterCard: TwitterCardType;
  robotsIndex: boolean;
  robotsFollow: boolean;
  schemaJsonLd: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
}

export interface MediaItem {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  mimeType: string;
  size: number;
  type: MediaType;
  folder: string;
  alt: string;
  width?: number;
  height?: number;
  optimized: boolean;
  createdAt: string;
}

export type UserStatus = 'active' | 'suspended';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  avatar: string | null;
  status?: UserStatus;
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: PostStatus;
  featured: boolean;
  publishedAt: string | null;
  scheduledAt: string | null;
  categoryId: string | null;
  tagIds: string[];
  authorId: string;
  featuredImageId: string | null;
  galleryImageIds: string[];
  readTime: number;
  views: number;
  seo: SEOSettings;
  createdAt: string;
  updatedAt: string;
}

export interface PageBlock {
  id: string;
  type: PageBlockType;
  order: number;
  content: Record<string, unknown>;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  template: PageTemplate;
  status: PageStatus;
  sections: PageBlock[];
  seo: SEOSettings;
  createdAt: string;
  updatedAt: string;
}

export interface AnalyticsEntry {
  date: string;
  views: number;
  uniqueVisitors: number;
}

export interface CMSData {
  posts: Post[];
  categories: Category[];
  tags: Tag[];
  media: MediaItem[];
  pages: Page[];
  users: User[];
  analytics: AnalyticsEntry[];
}

export const DEFAULT_SEO: SEOSettings = {
  title: '',
  description: '',
  keywords: [],
  canonicalUrl: '',
  ogTitle: '',
  ogDescription: '',
  ogImageId: null,
  twitterCard: 'summary_large_image',
  robotsIndex: true,
  robotsFollow: true,
  schemaJsonLd: '',
};

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  admin: ['*'],
  editor: [
    'posts:read', 'posts:write', 'posts:delete',
    'categories:read', 'categories:write',
    'tags:read', 'tags:write',
    'media:read', 'media:write', 'media:delete',
    'pages:read', 'pages:write',
    'seo:read', 'seo:write',
  ],
  author: [
    'posts:read', 'posts:write',
    'categories:read', 'tags:read',
    'media:read', 'media:write',
  ],
  moderator: [
    'posts:read', 'posts:write',
    'categories:read', 'tags:read',
    'media:read',
    'users:read',
  ],
};
