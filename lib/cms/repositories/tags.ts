import { v4 as uuidv4 } from 'uuid';
import type { Tag } from '../types';
import { readCMSData } from '../storage';
import { generateSlug, ensureUniqueSlug } from '../services/slug';
import { query, execute } from '@/lib/db';

export async function getAllTags(): Promise<Tag[]> {
  const data = await readCMSData();
  return (data.tags || []).filter(t => t && t.name).sort((a, b) => a.name.localeCompare(b.name));
}

export async function getTagById(id: string): Promise<Tag | null> {
  const data = await readCMSData();
  return (data.tags || []).find((t) => t && t.id === id) ?? null;
}

export async function getTagBySlug(slug: string): Promise<Tag | null> {
  const data = await readCMSData();
  return (data.tags || []).find((t) => t && t.slug === slug) ?? null;
}

export async function createTag(input: { name: string; slug?: string }): Promise<Tag> {
  const now = new Date().toISOString();
  
  // Get existing tags to ensure unique slug
  const existingTags = await query<any>('SELECT slug FROM tags');
  const existingSlugs = existingTags.map((t: any) => t.slug);
  const slug = ensureUniqueSlug(
    input.slug || generateSlug(input.name),
    existingSlugs
  );

  const id = uuidv4();

  await execute(
    `INSERT INTO tags (id, name, slug, created_at) VALUES (?, ?, ?, NOW())`,
    [id, input.name, slug]
  );
  
  // Fetch the created tag
  const tags = await query<any>('SELECT * FROM tags WHERE id = ?', [id]);
  const tag = tags[0];
  
  return {
    id: tag.id,
    name: tag.name,
    slug: tag.slug,
    createdAt: tag.created_at ? tag.created_at.toISOString() : now,
  };
}

export async function updateTag(
  id: string,
  input: Partial<{ name: string; slug: string }>
): Promise<Tag | null> {
  const now = new Date().toISOString();
  
  // Get existing tag
  const tags = await query<any>('SELECT * FROM tags WHERE id = ?', [id]);
  const existing = tags[0];
  if (!existing) return null;
  
  // Ensure unique slug if changing
  let slug = existing.slug;
  if (input.slug !== undefined || input.name) {
    const existingTags = await query<any>('SELECT id, slug FROM tags WHERE id != ?', [id]);
    const existingSlugs = existingTags.map((t: any) => t.slug);
    slug = ensureUniqueSlug(
      input.slug !== undefined ? input.slug : generateSlug(input.name || existing.name),
      existingSlugs
    );
  }
  
  // Update tag
  await execute(
    `UPDATE tags SET name = ?, slug = ? WHERE id = ?`,
    [
      input.name ?? existing.name,
      slug,
      id,
    ]
  );
  
  // Fetch updated tag
  const updatedTags = await query<any>('SELECT * FROM tags WHERE id = ?', [id]);
  const tag = updatedTags[0];
  
  return {
    id: tag.id,
    name: tag.name,
    slug: tag.slug,
    createdAt: tag.created_at ? tag.created_at.toISOString() : now,
  };
}

export async function deleteTag(id: string): Promise<boolean> {
  // Delete post-tag relationships
  await execute('DELETE FROM post_tags WHERE tag_id = ?', [id]);
  
  // Delete tag
  const result = await execute('DELETE FROM tags WHERE id = ?', [id]);
  return result.affectedRows > 0;
}
