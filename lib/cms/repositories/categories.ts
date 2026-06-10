import { v4 as uuidv4 } from 'uuid';
import type { Category } from '../types';
import { readCMSData } from '../storage';
import { generateSlug, ensureUniqueSlug } from '../services/slug';
import { query, execute } from '@/lib/db';

export async function getAllCategories(): Promise<Category[]> {
  const data = await readCMSData();
  return (data.categories || []).filter(c => c && c.name).sort((a, b) => a.name.localeCompare(b.name));
}

export async function getCategoryById(id: string): Promise<Category | null> {
  const data = await readCMSData();
  return (data.categories || []).find((c) => c && c.id === id) ?? null;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const data = await readCMSData();
  return (data.categories || []).find((c) => c && c.slug === slug) ?? null;
}

export async function createCategory(input: {
  name: string;
  slug?: string;
  description?: string;
}): Promise<Category> {
  const now = new Date().toISOString();
  
  // Get existing categories to ensure unique slug
  const existingCategories = await query<any>('SELECT slug FROM categories');
  const existingSlugs = existingCategories.map((c: any) => c.slug);
  const slug = ensureUniqueSlug(
    input.slug || generateSlug(input.name),
    existingSlugs
  );

  const id = uuidv4();

  await execute(
    `INSERT INTO categories (id, name, slug, description, created_at, updated_at) 
     VALUES (?, ?, ?, ?, NOW(), NOW())`,
    [id, input.name, slug, input.description ?? '']
  );
  
  // Fetch the created category
  const categories = await query<any>('SELECT * FROM categories WHERE id = ?', [id]);
  const category = categories[0];
  
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description || '',
    createdAt: category.created_at ? category.created_at.toISOString() : now,
    updatedAt: category.updated_at ? category.updated_at.toISOString() : now,
  };
}

export async function updateCategory(
  id: string,
  input: Partial<{ name: string; slug: string; description: string }>
): Promise<Category | null> {
  const now = new Date().toISOString();
  
  // Get existing category
  const categories = await query<any>('SELECT * FROM categories WHERE id = ?', [id]);
  const existing = categories[0];
  if (!existing) return null;
  
  // Ensure unique slug if changing
  let slug = existing.slug;
  if (input.slug !== undefined || input.name) {
    const existingCategories = await query<any>('SELECT id, slug FROM categories WHERE id != ?', [id]);
    const existingSlugs = existingCategories.map((c: any) => c.slug);
    slug = ensureUniqueSlug(
      input.slug !== undefined ? input.slug : generateSlug(input.name || existing.name),
      existingSlugs
    );
  }
  
  // Update category
  await execute(
    `UPDATE categories SET name = ?, slug = ?, description = ?, updated_at = NOW() WHERE id = ?`,
    [
      input.name ?? existing.name,
      slug,
      input.description !== undefined ? input.description : existing.description,
      id,
    ]
  );
  
  // Fetch updated category
  const updatedCategories = await query<any>('SELECT * FROM categories WHERE id = ?', [id]);
  const category = updatedCategories[0];
  
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description || '',
    createdAt: category.created_at ? category.created_at.toISOString() : now,
    updatedAt: category.updated_at ? category.updated_at.toISOString() : now,
  };
}

export async function deleteCategory(id: string): Promise<boolean> {
  // Update posts with this category to remove category
  await execute('UPDATE posts SET category_id = NULL WHERE category_id = ?', [id]);
  
  // Delete category
  const result = await execute('DELETE FROM categories WHERE id = ?', [id]);
  return result.affectedRows > 0;
}
