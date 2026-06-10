// lib/bsd-sports.ts
// ─── Server-side only ────────────────────────────────────────────────────────
// BSD (Bzzoiro Sports Data) API client
// Base URL : https://sports.bzzoiro.com
// Auth     : Authorization: Token <key>   (server env only, never exposed)
// Docs     : https://sports.bzzoiro.com/docs/football/
// Schema   : https://sports.bzzoiro.com/api/schema/

const BASE_URL = 'https://sports.bzzoiro.com';

// ─── Types — match the OpenAPI schema exactly ─────────────────────────────────

/** League object nested inside Event (v1 shape, also used in v2 detail) */
export interface BSDLeague {
  id: number;
  name: string;
  country?: string;       // full country name e.g. "England"
  country_code?: string;  // ISO-2 e.g. "ES" (present in LeagueDetailV2, may be absent in event list)
  is_women?: boolean;
}

/** /api/v2/events/ → EventDetailV2Schema
 *  league_id is an int, home_team / away_team are strings.
 *  Nested league object comes from the older /api/events/ (v1) — v2 uses flat IDs.
 */
export interface BSDEventV2 {
  id: number;
  // v2 flat IDs
  league_id:    number | null;
  home_team_id: number | null;
  away_team_id: number | null;
  // display names (always present)
  home_team: string;
  away_team: string;
  // v1 nested objects (present on /api/events/ v1 and sometimes on v2 detail)
  league?:         BSDLeague;
  home_team_obj?:  { id: number; name: string; short_name?: string; country?: string };
  away_team_obj?:  { id: number; name: string; short_name?: string; country?: string };
  // Kickoff
  event_date: string;  // ISO-8601 UTC e.g. "2026-06-08T19:00:00Z"
  // Status — real BSD v2 values:
  // notstarted | inprogress | 1st_half | halftime | 2nd_half
  // extratime  | extra_time | penalties | finished | aet
  // postponed  | cancelled
  status: string;
  // Score
  home_score?:    number | null;
  away_score?:    number | null;
  home_score_ht?: number | null;
  away_score_ht?: number | null;
  // Live
  current_minute?: number | null;
  period?:         string | null;  // "1st_half" | "halftime" | "2nd_half" | "FT" | null
  // Round info (nice to display)
  round_number?: number | null;
  round_name?:   string;
}

/** /api/v2/events/live/ → EventLiveListItemV2Schema
 *  Same shape but returned inside { count, events: [...] }
 */
export interface BSDLiveEvent extends BSDEventV2 {
  league_name?: string | null;
}

/** Derived enum so the UI doesn't need to parse raw status strings */
export type MatchStatus = 'upcoming' | 'live' | 'ht' | 'finished' | 'cancelled';

// ─── Status parser ────────────────────────────────────────────────────────────

export function parseStatus(raw: string | undefined | null): MatchStatus {
  if (!raw) return 'upcoming';
  const s = raw.toLowerCase();
  if (s === 'notstarted' || s === 'tbd') return 'upcoming';
  if (s === 'halftime' || s === 'ht')   return 'ht';
  if (['finished', 'aet', 'ft'].includes(s)) return 'finished';
  if (['postponed', 'cancelled', 'canceled', 'suspended', 'abandoned'].includes(s)) return 'cancelled';
  // inprogress, 1st_half, 2nd_half, extratime, extra_time, penalties
  return 'live';
}

// ─── League group type ────────────────────────────────────────────────────────

export interface LeagueGroup {
  leagueId:   number;
  leagueName: string;
  country:    string;
  matches:    BSDEventV2[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Format ISO UTC date as HH:mm in Africa/Casablanca timezone */
export function formatKickoff(isoDate: string): string {
  try {
    return new Intl.DateTimeFormat('fr-MA', {
      timeZone: 'Africa/Casablanca',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(new Date(isoDate));
  } catch {
    return '--:--';
  }
}

/** Country name or ISO-2 code → flag emoji */
export function countryToFlag(country?: string): string {
  if (!country) return '🌍';
  const s = country.trim();

  // If it's already an ISO-2 code
  if (/^[A-Za-z]{2}$/.test(s)) {
    return s.toUpperCase()
      .replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));
  }

  // Country name → ISO-2 lookup (most common football leagues)
  const map: Record<string, string> = {
    'england':          'GB', 'spain':          'ES', 'france':         'FR',
    'germany':          'DE', 'italy':           'IT', 'portugal':        'PT',
    'netherlands':      'NL', 'belgium':         'BE', 'turkey':          'TR',
    'russia':           'RU', 'brazil':          'BR', 'argentina':       'AR',
    'mexico':           'MX', 'usa':             'US', 'saudi arabia':    'SA',
    'morocco':          'MA', 'algeria':         'DZ', 'egypt':           'EG',
    'tunisia':          'TN', 'nigeria':         'NG', 'south africa':    'ZA',
    'scotland':         'GB', 'ukraine':         'UA', 'greece':          'GR',
    'croatia':          'HR', 'switzerland':     'CH', 'austria':         'AT',
    'sweden':           'SE', 'denmark':         'DK', 'norway':          'NO',
    'poland':           'PL', 'czech republic':  'CZ', 'serbia':          'RS',
    'japan':            'JP', 'south korea':     'KR', 'china':           'CN',
    'australia':        'AU', 'colombia':        'CO', 'chile':           'CL',
    'peru':             'PE', 'uruguay':         'UY', 'world':           'UN',
    'europe':           'EU', 'africa':          'UN', 'international':   'UN',
    'qatar':            'QA', 'uae':             'AE', 'iran':            'IR',
    'iraq':             'IQ', 'jordan':          'JO', 'israel':          'IL',
    'senegal':          'SN', 'ghana':           'GH', 'ivory coast':     'CI',
    "côte d'ivoire":   'CI', 'cameroon':        'CM', 'mali':            'ML',
    'romania':          'RO', 'hungary':         'HU', 'slovakia':        'SK',
    'bulgaria':         'BG', 'finland':         'FI', 'ireland':         'IE',
    'wales':            'GB', 'northern ireland':'GB',
    'indonesia':        'ID', 'thailand':        'TH', 'india':           'IN',
  };

  const lower = s.toLowerCase();
  const code  = map[lower];
  if (code) {
    return code.replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));
  }

  return '🌍';
}

/** Country name -> ISO-2 code mapping fallback */
export function countryToCode(country?: string): string {
  if (!country) return '';
  const s = country.trim().toLowerCase();
  
  const map: Record<string, string> = {
    'england': 'EN', 'spain': 'ES', 'france': 'FR', 'germany': 'DE', 'italy': 'IT',
    'portugal': 'PT', 'netherlands': 'NL', 'belgium': 'BE', 'turkey': 'TR', 'brazil': 'BR',
    'argentina': 'AR', 'usa': 'US', 'saudi arabia': 'SA', 'morocco': 'MA', 'algeria': 'DZ',
    'egypt': 'EG', 'tunisia': 'TN', 'scotland': 'SCO', 'wales': 'WAL', 'northern ireland': 'NIR',
    'qatar': 'QA', 'uae': 'AE', 'japan': 'JP', 'south korea': 'KR', 'europe': 'EU',
    'world': 'INT', 'international': 'INT'
  };
  return map[s] || '';
}

/** Calculate sorting priority for leagues */
export function getLeagueSortScore(name: string, country?: string): number {
  const n = name.toLowerCase();
  const c = country?.toLowerCase() || '';

  // 1. Champions League / Ligue des Champions
  if (n.includes('champions league') || n.includes('ligue des champions')) {
    return 1;
  }
  // 2. Premier League (England)
  if (n.includes('premier league') && c.includes('england')) {
    return 2;
  }
  // 3. La Liga (Spain)
  if (n.includes('la liga') || n === 'la liga') {
    return 3;
  }
  // 4. Serie A (Italy)
  if (n.includes('serie a') && c.includes('italy')) {
    return 4;
  }
  // 5. Bundesliga (Germany)
  if (n.includes('bundesliga')) {
    return 5;
  }
  // 6. Ligue 1 (France)
  if (n.includes('ligue 1') && c.includes('france')) {
    return 6;
  }
  // 7. Botola Pro (Morocco)
  if (n.includes('botola') || c.includes('morocco')) {
    return 7;
  }
  // 8. Saudi Pro League
  if (n.includes('saudi pro') || n.includes('saudi professional')) {
    return 8;
  }
  // 9. All other leagues
  return 999;
}

/** Group events by league, sorted by priority first, then alphabetically */
export function groupByLeague(events: BSDEventV2[]): LeagueGroup[] {
  const map = new Map<number, LeagueGroup>();

  for (const ev of events) {
    const lid  = ev.league_id ?? 0;
    const name = (ev as BSDLiveEvent).league_name ?? ev.league?.name ?? `League ${lid}`;
    const country = ev.league?.country ?? '';

    if (!map.has(lid)) {
      map.set(lid, { leagueId: lid, leagueName: name, country, matches: [] });
    }
    map.get(lid)!.matches.push(ev);
  }

  return Array.from(map.values()).sort((a, b) => {
    const scoreA = getLeagueSortScore(a.leagueName, a.country);
    const scoreB = getLeagueSortScore(b.leagueName, b.country);

    if (scoreA !== scoreB) {
      return scoreA - scoreB;
    }

    return a.leagueName.localeCompare(b.leagueName);
  });
}

// ─── API fetcher (server-only) ────────────────────────────────────────────────

function getApiKey(): string | null {
  return process.env.BSD_SPORTS_API_KEY ?? null;
}

/** Get today's date in YYYY-MM-DD format in Africa/Casablanca timezone */
export function getTodayDate(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Africa/Casablanca',
    year:  'numeric',
    month: '2-digit',
    day:   '2-digit',
  }).format(new Date());
}

async function bsdFetch(path: string): Promise<{
  data: unknown;
  error: string | null;
}> {
  const key = getApiKey();

  if (!key || key === 'YOUR_API_KEY_HERE') {
    return { data: null, error: 'missing_api_key' };
  }

  try {
    const url = `${BASE_URL}${path}`;
    const res  = await fetch(url, {
      headers: {
        Authorization: `Token ${key}`,
        Accept: 'application/json',
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      console.error(`[BSD] ${res.status} on ${url}: ${body.slice(0, 200)}`);
      return { data: null, error: `http_${res.status}` };
    }

    const data = await res.json();
    return { data, error: null };
  } catch (err) {
    console.error('[BSD] Network error:', err);
    return { data: null, error: 'network_error' };
  }
}

// ─── Public API functions ─────────────────────────────────────────────────────

export interface BSDLeagueDetail {
  id: number;
  name: string;
  country: string;
}

let cachedLeagues: Record<number, BSDLeagueDetail> | null = null;
let lastCacheTime = 0;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export async function fetchLeagues(): Promise<Record<number, BSDLeagueDetail>> {
  const now = Date.now();
  if (cachedLeagues && (now - lastCacheTime < CACHE_TTL_MS)) {
    return cachedLeagues;
  }

  const { data, error } = await bsdFetch('/api/v2/leagues/?limit=200');
  const leagueMap: Record<number, BSDLeagueDetail> = {};
  
  if (error || !data) {
    console.error('[BSD] Failed to fetch leagues:', error);
    return cachedLeagues || leagueMap;
  }
  
  const resp = data as { results?: BSDLeagueDetail[] };
  const results = resp.results || [];
  
  for (const item of results) {
    leagueMap[item.id] = {
      id: item.id,
      name: item.name,
      country: item.country,
    };
  }
  
  cachedLeagues = leagueMap;
  lastCacheTime = now;
  return leagueMap;
}

/**
 * Fetch all matches for a specific date (defaults to today in Africa/Casablanca date).
 * Uses /api/v2/events/ with date_from & date_to, limit=200.
 * Returns paginated { count, next, previous, results: BSDEventV2[] }.
 */
export async function fetchTodayMatches(dateParam?: string): Promise<{
  matches: BSDEventV2[];
  error:   string | null;
  date:    string;
}> {
  const date = dateParam || getTodayDate();
  const { data, error } = await bsdFetch(
    `/api/v2/events/?date_from=${date}&date_to=${date}&limit=200&offset=0`
  );

  if (error || !data) {
    return { matches: [], error, date };
  }

  const resp = data as { results?: BSDEventV2[]; count?: number };
  const matches = Array.isArray(resp.results) ? resp.results : [];

  // Populate missing league details from the cached leagues list
  try {
    const leagues = await fetchLeagues();
    for (const m of matches) {
      const lid = m.league_id;
      if (lid && leagues[lid]) {
        m.league = {
          id: lid,
          name: leagues[lid].name,
          country: leagues[lid].country,
        };
      }
    }
  } catch (err) {
    console.error('[BSD] Error populating matches leagues:', err);
  }

  return { matches, error: null, date };
}

/**
 * Fetch live matches right now.
 * Uses /api/v2/events/live/ — Redis-cached with 30s TTL server-side.
 * Returns { count, events: BSDLiveEvent[] }.
 */
export async function fetchLiveMatches(): Promise<{
  matches: BSDLiveEvent[];
  error:   string | null;
}> {
  const { data, error } = await bsdFetch('/api/v2/events/live/');

  if (error || !data) {
    return { matches: [], error };
  }

  const resp = data as { events?: BSDLiveEvent[]; count?: number };
  const matches = Array.isArray(resp.events) ? resp.events : [];

  // Populate missing league details
  try {
    const leagues = await fetchLeagues();
    for (const m of matches) {
      const lid = m.league_id;
      if (lid && leagues[lid]) {
        m.league_name = leagues[lid].name;
        m.league = {
          id: lid,
          name: leagues[lid].name,
          country: leagues[lid].country,
        };
      }
    }
  } catch (err) {
    console.error('[BSD] Error populating live leagues:', err);
  }

  return { matches, error: null };
}
