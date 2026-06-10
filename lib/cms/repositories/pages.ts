import { v4 as uuidv4 } from 'uuid';
import type { Page, PageBlock, PageStatus, PageTemplate, SEOSettings } from '../types';
import { DEFAULT_SEO } from '../types';
import { query, execute } from '@/lib/db';
import { generateSlug, ensureUniqueSlug } from '../services/slug';

function rowToPage(row: any): Page {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    template: row.template,
    status: row.status,
    sections: row.sections ? (typeof row.sections === 'string' ? JSON.parse(row.sections) : row.sections) : [],
    seo: {
      title: row.seo_title || '',
      description: row.seo_description || '',
      keywords: row.seo_keywords ? (typeof row.seo_keywords === 'string' ? JSON.parse(row.seo_keywords) : row.seo_keywords) : [],
      canonicalUrl: row.seo_canonical_url || '',
      ogTitle: row.seo_og_title || '',
      ogDescription: row.seo_og_description || '',
      ogImageId: row.seo_og_image_id,
      twitterCard: row.seo_twitter_card || 'summary_large_image',
      robotsIndex: row.seo_robots_index !== undefined ? Boolean(row.seo_robots_index) : true,
      robotsFollow: row.seo_robots_follow !== undefined ? Boolean(row.seo_robots_follow) : true,
      schemaJsonLd: row.seo_schema_jsonld || '',
    },
    createdAt: row.created_at ? row.created_at.toISOString() : new Date().toISOString(),
    updatedAt: row.updated_at ? row.updated_at.toISOString() : new Date().toISOString(),
  };
}

export async function getAllPages(): Promise<Page[]> {
  const rows = await query<any>('SELECT * FROM pages ORDER BY title ASC');
  return rows.map(rowToPage);
}

export async function getPublishedPages(): Promise<Page[]> {
  const rows = await query<any>("SELECT * FROM pages WHERE status = 'published' ORDER BY title ASC");
  return rows.map(rowToPage);
}

export async function getPageById(id: string): Promise<Page | null> {
  const rows = await query<any>('SELECT * FROM pages WHERE id = ?', [id]);
  if (rows.length === 0) return null;
  return rowToPage(rows[0]);
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  const rows = await query<any>('SELECT * FROM pages WHERE slug = ?', [slug]);
  if (rows.length === 0) return null;
  return rowToPage(rows[0]);
}

export async function getPageByTemplate(template: PageTemplate): Promise<Page | null> {
  const rows = await query<any>('SELECT * FROM pages WHERE template = ?', [template]);
  if (rows.length === 0) return null;
  return rowToPage(rows[0]);
}

export interface CreatePageInput {
  title: string;
  slug?: string;
  template?: PageTemplate;
  status?: PageStatus;
  sections?: PageBlock[];
  seo?: Partial<SEOSettings>;
}

export async function createPage(input: CreatePageInput): Promise<Page> {
  const id = uuidv4();
  const now = new Date().toISOString();
  
  // Get existing pages to ensure unique slug
  const existingPages = await query<any>('SELECT slug FROM pages');
  const existingSlugs = existingPages.map((p: any) => p.slug);
  const slug = ensureUniqueSlug(
    input.slug || generateSlug(input.title),
    existingSlugs
  );

  const sections = input.sections ?? [];
  const seo = { ...DEFAULT_SEO, ...input.seo };

  await execute(
    `INSERT INTO pages (
      id, title, slug, template, status, sections,
      seo_title, seo_description, seo_keywords, seo_canonical_url,
      seo_og_title, seo_og_description, seo_og_image_id,
      seo_twitter_card, seo_robots_index, seo_robots_follow, seo_schema_jsonld,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [
      id,
      input.title,
      slug,
      input.template ?? 'custom',
      input.status ?? 'draft',
      JSON.stringify(sections),
      seo.title,
      seo.description,
      JSON.stringify(seo.keywords),
      seo.canonicalUrl,
      seo.ogTitle,
      seo.ogDescription,
      seo.ogImageId,
      seo.twitterCard,
      seo.robotsIndex !== undefined ? seo.robotsIndex : true,
      seo.robotsFollow !== undefined ? seo.robotsFollow : true,
      seo.schemaJsonLd,
    ]
  );

  return {
    id,
    title: input.title,
    slug,
    template: input.template ?? 'custom',
    status: input.status ?? 'draft',
    sections,
    seo,
    createdAt: now,
    updatedAt: now,
  };
}

export async function updatePage(
  id: string,
  input: Partial<CreatePageInput>
): Promise<Page | null> {
  const existing = await getPageById(id);
  if (!existing) return null;

  let slug = existing.slug;
  if (input.slug !== undefined || input.title) {
    const existingPages = await query<any>('SELECT id, slug FROM pages WHERE id != ?', [id]);
    const existingSlugs = existingPages.map((p: any) => p.slug);
    slug = ensureUniqueSlug(
      input.slug !== undefined ? input.slug : generateSlug(input.title || existing.title),
      existingSlugs
    );
  }

  const title = input.title ?? existing.title;
  const template = input.template ?? existing.template;
  const status = input.status ?? existing.status;
  const sections = input.sections ?? existing.sections;
  const seo = input.seo ? { ...existing.seo, ...input.seo } : existing.seo;

  await execute(
    `UPDATE pages SET
      title = ?, slug = ?, template = ?, status = ?, sections = ?,
      seo_title = ?, seo_description = ?, seo_keywords = ?, seo_canonical_url = ?,
      seo_og_title = ?, seo_og_description = ?, seo_og_image_id = ?,
      seo_twitter_card = ?, seo_robots_index = ?, seo_robots_follow = ?, seo_schema_jsonld = ?,
      updated_at = NOW()
    WHERE id = ?`,
    [
      title,
      slug,
      template,
      status,
      JSON.stringify(sections),
      seo.title,
      seo.description,
      JSON.stringify(seo.keywords),
      seo.canonicalUrl,
      seo.ogTitle,
      seo.ogDescription,
      seo.ogImageId,
      seo.twitterCard,
      seo.robotsIndex !== undefined ? seo.robotsIndex : true,
      seo.robotsFollow !== undefined ? seo.robotsFollow : true,
      seo.schemaJsonLd,
      id,
    ]
  );

  return getPageById(id);
}

export async function updatePageSections(id: string, sections: PageBlock[]): Promise<Page | null> {
  return updatePage(id, { sections: sections.sort((a, b) => a.order - b.order) });
}

export async function deletePage(id: string): Promise<boolean> {
  const result = await execute('DELETE FROM pages WHERE id = ?', [id]);
  return result.affectedRows > 0;
}
