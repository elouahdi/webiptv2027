import { ensureCMSInitialized } from '@/lib/cms/init';
import { query, execute } from '@/lib/db';
import { jsonResponse, errorResponse, requirePermission, isErrorResponse } from '@/lib/cms/api-helpers';

function rowToApp(row: any) {
  return {
    ...row,
    platforms: typeof row.platforms === 'string' ? JSON.parse(row.platforms) : (row.platforms || []),
    steps: typeof row.steps === 'string' ? JSON.parse(row.steps) : (row.steps || []),
  };
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await ensureCMSInitialized();
  const auth = await requirePermission('pages:read');
  if (isErrorResponse(auth)) return auth;

  const { id } = await params;
  const rows = await query<any>('SELECT * FROM iptv_apps WHERE id = ?', [id]);
  if (rows.length === 0) return errorResponse('Application non trouvée', 404);
  return jsonResponse(rowToApp(rows[0]));
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await ensureCMSInitialized();
  const auth = await requirePermission('pages:write');
  if (isErrorResponse(auth)) return auth;

  const { id } = await params;
  const existing = await query<any>('SELECT * FROM iptv_apps WHERE id = ?', [id]);
  if (existing.length === 0) return errorResponse('Application non trouvée', 404);

  const body = await request.json();
  const app = existing[0];

  await execute(
    `UPDATE iptv_apps SET name=?, slug=?, logo=?, category=?, platforms=?, price_type=?, price_amount=?, description=?, steps=?, guide_url=?, sort_order=?, status=? WHERE id=?`,
    [
      body.name ?? app.name,
      body.slug ?? app.slug,
      body.logo ?? app.logo,
      body.category ?? app.category,
      JSON.stringify(body.platforms ?? (typeof app.platforms === 'string' ? JSON.parse(app.platforms) : app.platforms)),
      body.price_type ?? app.price_type,
      body.price_amount ?? app.price_amount,
      body.description ?? app.description,
      JSON.stringify(body.steps ?? (typeof app.steps === 'string' ? JSON.parse(app.steps) : app.steps)),
      body.guide_url ?? app.guide_url,
      body.sort_order ?? app.sort_order,
      body.status ?? app.status,
      id
    ]
  );

  const rows = await query<any>('SELECT * FROM iptv_apps WHERE id = ?', [id]);
  return jsonResponse(rowToApp(rows[0]));
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await ensureCMSInitialized();
  const auth = await requirePermission('pages:write');
  if (isErrorResponse(auth)) return auth;

  const { id } = await params;
  await execute('DELETE FROM iptv_apps WHERE id = ?', [id]);
  return jsonResponse({ success: true });
}
