import { ensureCMSInitialized } from '@/lib/cms/init';
import { getAllMedia, uploadMedia } from '@/lib/cms/repositories/media';
import { jsonResponse, errorResponse, requirePermission, isErrorResponse } from '@/lib/cms/api-helpers';
import type { MediaType } from '@/lib/cms/types';

export async function GET(request: Request) {
  await ensureCMSInitialized();
  const auth = await requirePermission('media:read');
  if (isErrorResponse(auth)) return auth;

  const { searchParams } = new URL(request.url);
  const media = await getAllMedia({
    folder: searchParams.get('folder') || undefined,
    type: (searchParams.get('type') as MediaType) || undefined,
    search: searchParams.get('search') || undefined,
  });

  return jsonResponse(media);
}

export async function POST(request: Request) {
  await ensureCMSInitialized();
  const auth = await requirePermission('media:write');
  if (isErrorResponse(auth)) return auth;

  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  const folder = (formData.get('folder') as string) || 'general';

  if (!file) return errorResponse('Fichier requis');

  const buffer = Buffer.from(await file.arrayBuffer());
  const item = await uploadMedia(buffer, file.name, file.type, folder);
  return jsonResponse(item, 201);
}
