export const dynamic = 'force-dynamic';

// Cache 24h
let cache: { shows: any[]; timestamp: number } | null = null;

export async function GET() {
  try {
    // Cache valable 24h
    if (cache && Date.now() - cache.timestamp < 86400000) {
      return Response.json({ shows: cache.shows });
    }

    const res = await fetch('https://api.tvmaze.com/schedule/full', {
      headers: { 'User-Agent': 'RegardezIPTV/1.0' }
    });
    const data = await res.json();

    const seen = new Set();
    const unique: any[] = [];

    for (const item of data) {
      const show = item._embedded?.show;
      if (!show || seen.has(show.id)) continue;
      
      const lang = (show.language || '').toLowerCase();
      if (!lang.includes('english') && !lang.includes('french')) continue;
      if (!show.image?.medium) continue;
      
      seen.add(show.id);
      unique.push({
        id: show.id,
        name: show.name,
        image: show.image.medium,
        rating: show.rating?.average || null,
        genres: show.genres || [],
        network: show.network?.name || show.webChannel?.name || 'N/A',
        premiered: show.premiered || null,
      });
    }

    unique.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    const shows = unique.slice(0, 20);

    cache = { shows, timestamp: Date.now() };

    return Response.json({ shows });
  } catch (err: any) {
    // Si le cache existe, le retourner même expiré en cas d'erreur
    if (cache) return Response.json({ shows: cache.shows });
    return Response.json({ shows: [], error: err.message }, { status: 500 });
  }
}
