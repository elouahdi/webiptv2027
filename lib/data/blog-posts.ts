// Blog posts are now stored in MySQL via CMS
// This file is kept for backward compatibility but delegates to CMS posts
import { getPublishedPosts, getPostBySlug } from '@/lib/cms/repositories/posts';

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  content: string;
  publishedAt: string;
  updatedAt: string;
  category: string;
  readTime: number;
  coverImage: string;
}

// Convert CMS Post to BlogPost format
function postToBlogPost(post: any): BlogPost {
  return {
    slug: post.slug,
    title: post.title,
    description: post.excerpt,
    content: post.content,
    publishedAt: post.publishedAt || post.createdAt,
    updatedAt: post.updatedAt,
    category: post.categoryId || 'Général',
    readTime: post.readTime,
    coverImage: post.featuredImageId ? `/media/${post.featuredImageId}` : '/images/blog/default.jpg',
  };
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const result = await getPublishedPosts({ limit: 100 });
  return result.posts.map(postToBlogPost);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const post = await getPostBySlug(slug);
  return post ? postToBlogPost(post) : undefined;
}

export async function getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
  const result = await getPublishedPosts({ limit: 100 });
  return result.posts
    .map(postToBlogPost)
    .filter((post) => post.category === category);
}
