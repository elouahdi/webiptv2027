import { ensureCMSInitialized } from '@/lib/cms/init';
import { readCMSData } from '@/lib/cms/storage';
import { jsonResponse, requireAuth, isErrorResponse } from '@/lib/cms/api-helpers';

export const dynamic = 'force-dynamic';

const LIMIT_PER_TYPE = 5;

export async function GET(request: Request) {
  await ensureCMSInitialized();
  const auth = await requireAuth();
  if (isErrorResponse(auth)) return auth;

  const q = new URL(request.url).searchParams.get('q')?.trim().toLowerCase() ?? '';
  if (q.length < 2) {
    return jsonResponse({ posts: [], pages: [], users: [], media: [] });
  }

  const data = await readCMSData();

  const posts = data.posts
    .filter((p) => p.title.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q))
    .slice(0, LIMIT_PER_TYPE)
    .map((p) => ({ id: p.id, title: p.title, status: p.status }));

  const pages = data.pages
    .filter((p) => p.title.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q))
    .slice(0, LIMIT_PER_TYPE)
    .map((p) => ({ id: p.id, title: p.title, status: p.status }));

  // Only expose safe user fields
  const users = data.users
    .filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
    .slice(0, LIMIT_PER_TYPE)
    .map((u) => ({ id: u.id, name: u.name, email: u.email, role: u.role }));

  const media = data.media
    .filter(
      (m) =>
        m.originalName.toLowerCase().includes(q) ||
        m.filename.toLowerCase().includes(q) ||
        m.alt.toLowerCase().includes(q)
    )
    .slice(0, LIMIT_PER_TYPE)
    .map((m) => ({ id: m.id, name: m.originalName, type: m.type }));

  return jsonResponse({ posts, pages, users, media });
}
