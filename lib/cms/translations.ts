import type { Post } from './types';
import type { EnrichedPost } from './blog-public';

export function translatePost(post: Post, _locale: string): Post {
  // Returns the post as-is (translation disabled for now as requested)
  return post;
}

export function translateEnrichedPost(enriched: EnrichedPost, _locale: string): EnrichedPost {
  // Returns the post as-is (translation disabled for now as requested)
  return enriched;
}
