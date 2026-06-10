'use client';

import { useEffect, useState } from 'react';
import { Trophy, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/admin/ui/Card';
import { Badge } from '@/components/admin/ui/Badge';
import { Button } from '@/components/admin/ui/Button';
import { Skeleton } from '@/components/admin/ui/Skeleton';
import { useToast } from '@/components/admin/ui/Toast';

interface SportsMatch {
  id: number;
  home_team: string;
  away_team: string;
  event_date: string;
  status: string;
  home_score?: number | null;
  away_score?: number | null;
  current_minute?: number | null;
  league?: { name: string; country?: string };
}

const LIVE_STATUSES = ['inprogress', '1st_half', 'halftime', '2nd_half', 'extratime', 'extra_time', 'penalties'];

function statusBadge(status: string): { label: string; variant: 'success' | 'danger' | 'default' } {
  if (LIVE_STATUSES.includes(status)) return { label: 'En direct', variant: 'danger' };
  if (status === 'finished' || status === 'aet') return { label: 'Terminé', variant: 'success' };
  if (status === 'postponed') return { label: 'Reporté', variant: 'default' };
  if (status === 'cancelled') return { label: 'Annulé', variant: 'default' };
  return { label: 'À venir', variant: 'default' };
}

export default function SportsPage() {
  const { toast } = useToast();
  const [matches, setMatches] = useState<SportsMatch[] | null>(null);
  const [date, setDate] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const load = () => {
    setLoading(true);
    fetch('/api/sports/today')
      .then((r) => {
        if (!r.ok) throw new Error('sports');
        return r.json();
      })
      .then((d) => {
        setMatches(d.matches ?? []);
        setDate(d.date ?? '');
      })
      .catch(() => {
        setMatches([]);
        toast('Impossible de charger le programme sportif', 'error');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-32">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-16">
        <div>
          <h1 className="font-syne font-bold text-3xl text-admin-text tracking-tight">Programme sportif</h1>
          <p className="text-admin-text-secondary mt-1 text-sm">
            Matchs du jour {date && `· ${new Date(date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}`}
          </p>
        </div>
        <Button variant="secondary" onClick={load} disabled={loading}>
          <RefreshCw className={loading ? 'w-4 h-4 animate-spin' : 'w-4 h-4'} />
          Actualiser
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            Matchs ({matches?.length ?? 0})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {matches === null ? (
            <div className="p-6 space-y-3">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : matches.length === 0 ? (
            <p className="px-6 py-12 text-center text-sm text-admin-text-muted">Aucun match aujourd&apos;hui</p>
          ) : (
            <div className="divide-y divide-admin-border/50">
              {matches.map((match) => {
                const badge = statusBadge(match.status);
                const isLive = LIVE_STATUSES.includes(match.status);
                const hasScore = match.home_score !== null && match.home_score !== undefined;
                return (
                  <div key={match.id} className="flex items-center gap-4 px-6 py-4 hover:bg-admin-muted/50 transition-colors">
                    <div className="w-14 text-center shrink-0">
                      {isLive && match.current_minute ? (
                        <span className="text-sm font-bold text-red-400 tabular-nums">{match.current_minute}&apos;</span>
                      ) : (
                        <span className="text-sm text-admin-text-secondary tabular-nums">
                          {new Date(match.event_date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-admin-text truncate">
                        {match.home_team}
                        <span className="text-admin-text-muted mx-2 font-bold tabular-nums">
                          {hasScore ? `${match.home_score} - ${match.away_score}` : 'vs'}
                        </span>
                        {match.away_team}
                      </p>
                      <p className="text-xs text-admin-text-muted mt-0.5 truncate">
                        {match.league?.name ?? 'Football'}
                        {match.league?.country ? ` · ${match.league.country}` : ''}
                      </p>
                    </div>
                    <Badge variant={badge.variant}>{badge.label}</Badge>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
