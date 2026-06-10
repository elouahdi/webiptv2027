'use client';

import { useState, useEffect, useCallback, useTransition, useRef } from 'react';
import type { BSDEventV2, LeagueGroup } from '@/lib/bsd-sports';
import { parseStatus, formatKickoff, countryToFlag, countryToCode, groupByLeague } from '@/lib/bsd-sports';

// ─── Props ────────────────────────────────────────────────────────────────────

interface MatchesClientProps {
  initialMatches: BSDEventV2[];
  date:           string;
  initialError:   string | null;
}

// ─── Helper to sort matches: live first, then HT, then by event time ──────────

function sortMatches(matches: BSDEventV2[]): BSDEventV2[] {
  return [...matches].sort((a, b) => {
    const aStatus = parseStatus(a.status);
    const bStatus = parseStatus(b.status);

    const aIsLive = aStatus === 'live';
    const bIsLive = bStatus === 'live';
    const aIsHt = aStatus === 'ht';
    const bIsHt = bStatus === 'ht';

    // Live first
    if (aIsLive && !bIsLive) return -1;
    if (!aIsLive && bIsLive) return 1;

    // HT second
    if (aIsHt && !bIsHt) return -1;
    if (!aIsHt && bIsHt) return 1;

    // Else by time
    return new Date(a.event_date).getTime() - new Date(b.event_date).getTime();
  });
}

// ─── Team Logo (loads from BSD CDN; falls back to initials on error) ──────────

function TeamLogo({ id, name, size = 28 }: { id: number | null | undefined; name: string; size?: number }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [id]);

  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  if (id && !hasError) {
    return (
      <span className="kooora-logo-wrapper" style={{ width: size, height: size }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://sports.bzzoiro.com/img/team/${id}/`}
          alt={name}
          width={size}
          height={size}
          className="kooora-logo-img"
          onError={() => setHasError(true)}
          loading="lazy"
        />
      </span>
    );
  }

  return (
    <span
      className="kooora-logo-fallback"
      style={{ width: size, height: size }}
      aria-label={name}
    >
      {initials}
    </span>
  );
}

// ─── League Logo (loads from BSD CDN; falls back to ⚽ on error) ──────────────

function LeagueLogo({ id, name, size = 24 }: { id: number; name: string; size?: number }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [id]);

  if (!hasError) {
    return (
      <span className="kooora-logo-wrapper animate-fade-in" style={{ width: size, height: size, background: '#ffffff', borderRadius: 4, padding: 1 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://sports.bzzoiro.com/img/league/${id}/`}
          alt={name}
          width={size}
          height={size}
          className="kooora-logo-img"
          onError={() => setHasError(true)}
          loading="lazy"
        />
      </span>
    );
  }

  return (
    <span className="kooora-league-logo-fallback" style={{ fontSize: 16 }} title={name}>
      ⚽
    </span>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({
  status,
  minute,
}: {
  status: string;
  minute?: number | null;
}) {
  const parsed = parseStatus(status);

  if (parsed === 'live') {
    return (
      <span className="kooora-badge-live">
        <span className="kooora-pulse-dot" />
        EN DIRECT {minute != null ? `${minute}'` : ''}
      </span>
    );
  }
  if (parsed === 'ht') {
    return <span className="kooora-badge-ht">MI-TEMPS</span>;
  }
  if (parsed === 'finished') {
    return <span className="kooora-badge-ft">Terminé</span>;
  }
  return null; // Upcoming has no status badge (just time in center)
}

// ─── Score or Time centerpiece ────────────────────────────────────────────────

function ScoreOrTime({ event }: { event: BSDEventV2 }) {
  const parsed = parseStatus(event.status);
  const showScore = parsed === 'live' || parsed === 'ht' || parsed === 'finished';

  if (showScore) {
    const home = event.home_score ?? 0;
    const away = event.away_score ?? 0;

    return (
      <span className="kooora-score">
        {home} - {away}
      </span>
    );
  }

  // Upcoming
  return (
    <span className="kooora-time">
      {formatKickoff(event.event_date)}
    </span>
  );
}

// ─── Match Row ────────────────────────────────────────────────────────────────

function MatchRow({ event }: { event: BSDEventV2 }) {
  return (
    <div
      className="kooora-match-row"
      role="listitem"
      aria-label={`${event.home_team} vs ${event.away_team}`}
    >
      {/* Left: Home team */}
      <div className="kooora-match-team kooora-match-team-home">
        <span className="kooora-team-name">{event.home_team}</span>
        <TeamLogo id={event.home_team_id} name={event.home_team} />
      </div>

      {/* Center: score or time */}
      <div className="kooora-match-center">
        <ScoreOrTime event={event} />
      </div>

      {/* Right: Away team */}
      <div className="kooora-match-team kooora-match-team-away">
        <TeamLogo id={event.away_team_id} name={event.away_team} />
        <span className="kooora-team-name">{event.away_team}</span>
      </div>

      {/* Far right: Status badge */}
      <div className="kooora-match-status-cell">
        <StatusBadge status={event.status} minute={event.current_minute} />
      </div>
    </div>
  );
}

// ─── League Group Card ────────────────────────────────────────────────────────

function LeagueGroupCard({ group }: { group: LeagueGroup }) {
  const hasLive = group.matches.some((m) => {
    const s = parseStatus(m.status);
    return s === 'live' || s === 'ht';
  });
  const flag = countryToFlag(group.country);
  const code = countryToCode(group.country);

  return (
    <section
      className="kooora-league-group"
      aria-labelledby={`league-${group.leagueId}`}
    >
      {/* League header */}
      <div className="kooora-league-header">
        <div className="kooora-league-header-left">
          {flag !== '🌍' ? (
            <span className="kooora-league-flag" aria-label={group.country}>{flag}</span>
          ) : code ? (
            <span className="kooora-league-code-text" style={{ fontSize: 10, fontWeight: 700, color: '#8b8fa8', border: '1px solid #2a2d3a', padding: '2px 4px', borderRadius: 4, backgroundColor: '#2a2d3a' }}>
              {code}
            </span>
          ) : (
            <span className="kooora-league-flag">🌍</span>
          )}
          <span id={`league-${group.leagueId}`} className="kooora-league-name">
            {group.leagueName}
          </span>
          {group.country && (
            <>
              <span style={{ color: '#8b8fa8', fontSize: 12 }}> · </span>
              <span className="kooora-league-country">{group.country}</span>
            </>
          )}
        </div>
        
        {/* Right side: live indicator & league logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {hasLive && (
            <span className="kooora-league-live-badge">
              <span className="kooora-pulse-dot" style={{ backgroundColor: '#e8002d' }} />
              En direct
            </span>
          )}
          <LeagueLogo id={group.leagueId} name={group.leagueName} />
        </div>
      </div>

      {/* Match list */}
      <div role="list">
        {group.matches.map((m) => (
          <MatchRow key={m.id} event={m} />
        ))}
      </div>
    </section>
  );
}

// ─── Skeleton Loader ──────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="space-y-16">
      {[0, 1, 2].map((g) => (
        <div key={g} className="kooora-league-group animate-pulse">
          <div className="kooora-league-header" style={{ background: '#1a1d27' }}>
            <div style={{ height: 14, width: 180, background: '#2a2d3a', borderRadius: 4 }} />
          </div>
          <div className="league-matches">
            {[0, 1, 2].map((r) => (
              <div key={r} className="kooora-match-row" style={{ opacity: 1 - r * 0.2 }}>
                <div style={{ flex: 1, height: 12, background: '#2a2d3a', borderRadius: 4, margin: '0 8px' }} />
                <div style={{ width: 60, height: 22, background: '#2a2d3a', borderRadius: 4 }} />
                <div style={{ flex: 1, height: 12, background: '#2a2d3a', borderRadius: 4, margin: '0 8px' }} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Refresh Countdown ────────────────────────────────────────────────────────

function RefreshIndicator({ pending, countdown }: { pending: boolean; countdown: number }) {
  return (
    <div className="refresh-indicator" style={{ color: '#8b8fa8', fontSize: 11 }}>
      {pending ? (
        <>
          <span className="kooora-pulse-dot" style={{ backgroundColor: '#e8002d' }} />
          <span>Mise à jour...</span>
        </>
      ) : (
        <>
          <span>Refresh dans {countdown}s</span>
        </>
      )}
    </div>
  );
}

// ─── Main Client Component ────────────────────────────────────────────────────

const REFRESH_INTERVAL_S = 30;

export function MatchesClient({
  initialMatches,
  date,
  initialError,
}: MatchesClientProps) {
  const [matches,  setMatches]  = useState<BSDEventV2[]>(initialMatches);
  const [error,    setError]    = useState<string | null>(initialError);
  const [selectedDate, setSelectedDate] = useState(date);
  const [loading, setLoading] = useState(false);

  const [isPending, startTransition] = useTransition();
  const [countdown, setCountdown]    = useState(REFRESH_INTERVAL_S);
  const countRef = useRef(REFRESH_INTERVAL_S);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [filter, setFilter] = useState<'all' | 'live'>('all');

  // Are there any live or HT matches right now?
  const hasLiveOrHt = matches.some((m) => {
    const s = parseStatus(m.status);
    return s === 'live' || s === 'ht';
  });

  // Refresh matches for the selected date
  const doRefresh = useCallback(async (targetDate: string, silent = true) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetch(`/api/sports/today?date=${targetDate}`, { cache: 'no-store' });
      if (!res.ok) return;
      const json: { matches: BSDEventV2[]; error: string | null } = await res.json();
      startTransition(() => {
        setMatches(json.matches);
        setError(json.error);
      });
    } catch {
      // silently keep old data
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  // Handle date click
  const handleDateChange = async (targetDate: string) => {
    setSelectedDate(targetDate);
    await doRefresh(targetDate, false);
    // Update browser URL query param
    const newUrl = `${window.location.pathname}?date=${targetDate}`;
    window.history.pushState(null, '', newUrl);
  };

  // Auto-refresh every 30s — ONLY when live/HT matches are on screen
  useEffect(() => {
    if (!hasLiveOrHt) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    countRef.current = REFRESH_INTERVAL_S;
    setCountdown(REFRESH_INTERVAL_S);

    timerRef.current = setInterval(() => {
      countRef.current -= 1;
      setCountdown(countRef.current);

      if (countRef.current <= 0) {
        countRef.current = REFRESH_INTERVAL_S;
        setCountdown(REFRESH_INTERVAL_S);
        doRefresh(selectedDate, true);
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [hasLiveOrHt, selectedDate, doRefresh]);

  // Generate date nav bar (7 days centered on selectedDate)
  const daysRange = (() => {
    const range = [];
    const centerDate = new Date(selectedDate + 'T12:00:00Z');
    
    for (let i = -3; i <= 3; i++) {
      const d = new Date(centerDate.getTime());
      d.setDate(centerDate.getDate() + i);
      
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const dateStr = `${yyyy}-${mm}-${dd}`;
      
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' }); // "Mon", "Tue"...
      const dayNum = d.getDate();
      
      range.push({
        date: dateStr,
        dayName,
        dayNum,
      });
    }
    return range;
  })();

  // Filter matches based on selected tab
  const filteredMatches = matches.filter((m) => {
    const s = parseStatus(m.status);
    if (filter === 'live') return s === 'live' || s === 'ht';
    return true; // 'all'
  });

  // Group by league
  const groups = groupByLeague(filteredMatches);

  // Sort matches inside each group: live first, then HT, then time
  groups.forEach((g) => {
    g.matches = sortMatches(g.matches);
  });

  return (
    <div className="kooora-theme" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── 7-Day Date Navigation Bar ───────────────────────────────── */}
      <div className="kooora-date-nav">
        {daysRange.map((d) => {
          const isSelected = d.date === selectedDate;
          return (
            <button
              key={d.date}
              onClick={() => handleDateChange(d.date)}
              className={`date-pill ${isSelected ? 'date-pill--active' : ''}`}
            >
              <span className="date-pill-name">{d.dayName}</span>
              <span className="date-pill-num">{d.dayNum}</span>
            </button>
          );
        })}
      </div>

      {/* ── Top bar: Title + Count + Refresh ──────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #2a2d3a', paddingBottom: 12 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#ffffff' }}>⚽ Matchs de football</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {hasLiveOrHt && (
            <RefreshIndicator pending={isPending || loading} countdown={countdown} />
          )}
          <span style={{ fontSize: 12, color: '#8b8fa8' }}>
            {filteredMatches.length} match{filteredMatches.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* ── Filter Tabs ──────────────────────────────────────────────── */}
      <div className="kooora-filters">
        <button
          onClick={() => setFilter('all')}
          className={`kooora-filter-tab ${filter === 'all' ? 'kooora-filter-tab--active' : ''}`}
        >
          <span>Tous</span>
          <span className="kooora-filter-count">{matches.length}</span>
        </button>
        <button
          onClick={() => setFilter('live')}
          className={`kooora-filter-tab ${filter === 'live' ? 'kooora-filter-tab--active' : ''}`}
        >
          <span className="flex items-center gap-6">
            <span className="kooora-pulse-dot" style={{ backgroundColor: '#e8002d' }} />
            En direct
          </span>
          <span className="kooora-filter-count">
            {matches.filter((m) => {
              const s = parseStatus(m.status);
              return s === 'live' || s === 'ht';
            }).length}
          </span>
        </button>
      </div>

      {/* ── Skeleton while first-load or date-switch loading ───────────── */}
      {(isPending || loading) && matches.length === 0 && <Skeleton />}

      {/* ── API key not configured ────────────────────────────────────── */}
      {error === 'missing_api_key' && (
        <div className="kooora-notice">
          <span style={{ fontSize: 24 }}>🔑</span>
          <div>
            <p style={{ fontWeight: 700, color: '#ffffff', marginBottom: 6 }}>
              Clé API BSD manquante
            </p>
            <p style={{ fontSize: 13, color: '#8b8fa8', lineHeight: 1.6 }}>
              Ajoutez votre token dans <code style={{ background: '#2a2d3a', padding: '2px 6px', borderRadius: 4, color: '#e8002d' }}>.env.local</code>:
              <br />
              <code style={{ background: '#2a2d3a', padding: '2px 6px', borderRadius: 4, color: '#ffffff' }}>BSD_SPORTS_API_KEY=votre_clé</code>
            </p>
          </div>
        </div>
      )}

      {/* ── HTTP/network error ────────────────────────────────────────── */}
      {error && error !== 'missing_api_key' && (
        <div className="kooora-notice" style={{ borderColor: '#ef4444' }}>
          <span style={{ fontSize: 24 }}>⚠️</span>
          <div>
            <p style={{ fontWeight: 700, color: '#ffffff', marginBottom: 4 }}>
              Impossible de charger les matchs
            </p>
            <p style={{ fontSize: 12, color: '#8b8fa8' }}>
              Erreur : {error} — Réessayez dans quelques instants.
            </p>
          </div>
        </div>
      )}

      {/* ── No matches today ─────────────────────────────────────────── */}
      {!error && !loading && matches.length === 0 && (
        <div className="kooora-empty">
          <span style={{ fontSize: 48, marginBottom: 16 }}>😴</span>
          <p style={{ fontWeight: 700, color: '#ffffff', fontSize: 18, marginBottom: 8 }}>
            Aucun match aujourd&apos;hui
          </p>
          <p style={{ color: '#8b8fa8', fontSize: 14 }}>
            Revenez demain pour voir le programme des matchs.
          </p>
        </div>
      )}

      {/* ── League groups ────────────────────────────────────────────── */}
      {!loading && groups.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {groups.map((group) => (
            <LeagueGroupCard key={group.leagueId} group={group} />
          ))}
        </div>
      ) : (
        !error && !loading && matches.length > 0 && (
          <div className="kooora-empty">
            <span style={{ fontSize: 32, marginBottom: 12 }}>🔍</span>
            <p style={{ fontWeight: 700, color: '#ffffff', fontSize: 16, marginBottom: 6 }}>
              {filter === 'live' && "Aucun match en direct en ce moment"}
            </p>
            <p style={{ color: '#8b8fa8', fontSize: 13 }}>
              {filter === 'live' && "Revenez plus tard ou consultez l'onglet \"Tous\"."}
            </p>
          </div>
        )
      )}

      {/* ── CTA banner ────────────────────────────────────────────────── */}
      {matches.length > 0 && (
        <div className="kooora-cta-banner">
          <div>
            <p style={{ fontWeight: 700, color: '#ffffff', fontSize: 16, marginBottom: 6 }}>
              📺 Regardez tous ces matchs en direct 4K sur votre TV, mobile ou tablette
            </p>
            <p style={{ color: '#8b8fa8', fontSize: 12 }}>
              +45 000 chaînes · BeIN Sports, Al Kass, Arabsport, Canal+ inclus · Sans engagement
            </p>
          </div>
          <a href="/essai-gratuit" className="kooora-cta-btn">
            Essai gratuit 3H →
          </a>
        </div>
      )}
    </div>
  );
}
