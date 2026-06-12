import { ensureCMSInitialized } from '@/lib/cms/init';
import { query, execute } from '@/lib/db';
import { jsonResponse, errorResponse, requirePermission, isErrorResponse } from '@/lib/cms/api-helpers';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  await ensureCMSInitialized();
  const auth = await requirePermission('pages:read');
  if (isErrorResponse(auth)) return auth;

  const rows = await query<any>('SELECT * FROM iptv_apps ORDER BY sort_order ASC, name ASC');
  return jsonResponse(rows.map(rowToApp));
}

export async function POST(request: Request) {
  await ensureCMSInitialized();
  const auth = await requirePermission('pages:write');
  if (isErrorResponse(auth)) return auth;

  const body = await request.json();
  if (!body.name) return errorResponse('Nom requis');

  const id = uuidv4();
  const slug = body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  await execute(
    `INSERT INTO iptv_apps (id, name, slug, logo, category, platforms, price_type, price_amount, description, steps, guide_url, sort_order, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id, body.name, slug, body.logo || '📱', body.category || 'smartphone',
      JSON.stringify(body.platforms || []), body.price_type || 'free', body.price_amount || null,
      body.description || '', JSON.stringify(body.steps || []), body.guide_url || null,
      body.sort_order || 0, body.status || 'active'
    ]
  );

  const rows = await query<any>('SELECT * FROM iptv_apps WHERE id = ?', [id]);
  return jsonResponse(rowToApp(rows[0]), 201);
}

function rowToApp(row: any) {
  return {
    ...row,
    platforms: typeof row.platforms === 'string' ? JSON.parse(row.platforms) : (row.platforms || []),
    steps: typeof row.steps === 'string' ? JSON.parse(row.steps) : (row.steps || []),
  };
}
