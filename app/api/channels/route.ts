export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const res = await fetch('https://iptv-org.github.io/api/channels.json', {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    return Response.json(data);
  } catch {
    return Response.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
