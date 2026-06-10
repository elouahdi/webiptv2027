import { v4 as uuidv4 } from 'uuid';
import { promises as fs } from 'fs';
import path from 'path';
import type { MediaItem, MediaType } from '../types';
import { ensureUploadDir, MEDIA_UPLOAD_DIR } from '../storage';
import { query, execute } from '@/lib/db';

export interface MediaFilters {
  folder?: string;
  type?: MediaType;
  search?: string;
}

function rowToMediaItem(row: any): MediaItem {
  return {
    id: row.id,
    filename: row.filename,
    originalName: row.original_name,
    url: row.url,
    mimeType: row.mime_type,
    size: Number(row.size),
    type: row.type,
    folder: row.folder || 'general',
    alt: row.alt || '',
    width: row.width ?? undefined,
    height: row.height ?? undefined,
    optimized: Boolean(row.optimized),
    createdAt: row.created_at ? row.created_at.toISOString() : new Date().toISOString(),
  };
}

function getMediaType(mimeType: string): MediaType {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  return 'document';
}

export async function getAllMedia(filters: MediaFilters = {}): Promise<MediaItem[]> {
  let sql = 'SELECT * FROM media WHERE 1=1';
  const params: any[] = [];

  if (filters.folder) {
    sql += ' AND folder = ?';
    params.push(filters.folder);
  }
  if (filters.type) {
    sql += ' AND type = ?';
    params.push(filters.type);
  }
  if (filters.search) {
    sql += ' AND (filename LIKE ? OR original_name LIKE ? OR alt LIKE ?)';
    const q = `%${filters.search}%`;
    params.push(q, q, q);
  }

  sql += ' ORDER BY created_at DESC';

  const rows = await query<any>(sql, params);
  return rows.map(rowToMediaItem);
}

export async function getMediaById(id: string): Promise<MediaItem | null> {
  const rows = await query<any>('SELECT * FROM media WHERE id = ?', [id]);
  return rows.length > 0 ? rowToMediaItem(rows[0]) : null;
}

export async function getMediaFolders(): Promise<string[]> {
  const rows = await query<any>('SELECT DISTINCT folder FROM media WHERE folder IS NOT NULL ORDER BY folder');
  return rows.map((r: any) => r.folder).filter(Boolean);
}

export async function uploadMedia(
  file: Buffer,
  originalName: string,
  mimeType: string,
  folder = 'general'
): Promise<MediaItem> {
  const ext = path.extname(originalName) || '.bin';
  const id = uuidv4();
  const filename = `${id}${ext}`;
  const uploadDir = await ensureUploadDir(folder);
  const filePath = path.join(uploadDir, filename);
  await fs.writeFile(filePath, file);

  const url = `/uploads/${folder ? `${folder}/` : ''}${filename}`;
  const type = getMediaType(mimeType);

  // FIXED: Insert directly into MySQL instead of calling updateCMSData (which throws)
  await execute(
    `INSERT INTO media (id, filename, original_name, url, mime_type, size, type, folder, alt, optimized, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, '', FALSE, NOW())`,
    [id, filename, originalName, url, mimeType, file.length, type, folder]
  );

  const rows = await query<any>('SELECT * FROM media WHERE id = ?', [id]);
  return rowToMediaItem(rows[0]);
}

export async function updateMedia(
  id: string,
  input: Partial<{ alt: string; folder: string }>
): Promise<MediaItem | null> {
  const existing = await getMediaById(id);
  if (!existing) return null;

  const fields: string[] = [];
  const params: any[] = [];

  if (input.alt !== undefined) {
    fields.push('alt = ?');
    params.push(input.alt);
  }
  if (input.folder !== undefined) {
    fields.push('folder = ?');
    params.push(input.folder);
  }

  if (fields.length === 0) return existing;

  // FIXED: UPDATE directly in MySQL instead of calling updateCMSData (which throws)
  params.push(id);
  await execute(`UPDATE media SET ${fields.join(', ')} WHERE id = ?`, params);

  return getMediaById(id);
}

export async function deleteMedia(id: string): Promise<boolean> {
  const item = await getMediaById(id);
  if (!item) return false;

  // Delete file from disk
  const filePath = path.join(MEDIA_UPLOAD_DIR, item.folder, item.filename);
  try {
    await fs.unlink(filePath);
  } catch {
    // file may not exist on disk — continue anyway
  }

  // FIXED: DELETE directly from MySQL instead of calling updateCMSData (which throws)
  const result = await execute('DELETE FROM media WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

export async function createMediaFolder(folder: string): Promise<void> {
  await ensureUploadDir(folder);
}
