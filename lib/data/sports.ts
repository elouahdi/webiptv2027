// Static mock data - kept as-is since sports data comes from external API
export interface SportMatch {
  id: string;
  sport: 'football' | 'basketball' | 'motorsport' | 'tennis';
  league: string;
  homeTeam: string;
  awayTeam: string;
  homeLogo?: string;
  awayLogo?: string;
  time: string; // HH:MM
  dayOffset: number; // 0 = today, 1 = tomorrow, 2 = after tomorrow, etc.
  isLiveNow?: boolean;
  tvChannel?: string;
}

export const SPORTS_MATCHES: SportMatch[] = [
  // TODAY (dayOffset = 0)
  {
    id: 'f1',
    sport: 'football',
    league: 'UEFA Champions League',
    homeTeam: 'Real Madrid',
    awayTeam: 'Manchester City',
    time: '21:00',
    dayOffset: 0,
    isLiveNow: false,
    tvChannel: 'Canal+ Foot / RMC Sport',
  },
  {
    id: 'f2',
    sport: 'football',
    league: 'Ligue 1 McDonald\'s',
    homeTeam: 'Paris Saint-Germain',
    awayTeam: 'Olympique de Marseille',
    time: '20:45',
    dayOffset: 0,
    isLiveNow: false,
    tvChannel: 'DAZN Ligue 1',
  },
  {
    id: 'b1',
    sport: 'basketball',
    league: 'NBA Finals',
    homeTeam: 'Boston Celtics',
    awayTeam: 'Los Angeles Lakers',
    time: '23:30',
    dayOffset: 0,
    isLiveNow: false,
    tvChannel: 'beIN SPORTS 1',
  },
  {
    id: 't1',
    sport: 'tennis',
    league: 'Roland Garros',
    homeTeam: 'Carlos Alcaraz',
    awayTeam: 'Novak Djokovic',
    time: '15:00',
    dayOffset: 0,
    isLiveNow: false,
    tvChannel: 'France 2 / Eurosport',
  },

  // TOMORROW (dayOffset = 1)
  {
    id: 'f3',
    sport: 'football',
    league: 'UEFA Champions League',
    homeTeam: 'Bayern München',
    awayTeam: 'Arsenal FC',
    time: '21:00',
    dayOffset: 1,
    isLiveNow: false,
    tvChannel: 'Canal+ Sport',
  },
  {
    id: 'f4',
    sport: 'football',
    league: 'Premier League',
    homeTeam: 'Liverpool FC',
    awayTeam: 'Chelsea FC',
    time: '18:30',
    dayOffset: 1,
    isLiveNow: false,
    tvChannel: 'Canal+ Foot',
  },
  {
    id: 'm1',
    sport: 'motorsport',
    league: 'Formula 1',
    homeTeam: 'Grand Prix de Monaco',
    awayTeam: 'Qualifications',
    time: '16:00',
    dayOffset: 1,
    isLiveNow: false,
    tvChannel: 'Canal+',
  },

  // DAY AFTER (dayOffset = 2)
  {
    id: 'f5',
    sport: 'football',
    league: 'La Liga EA Sports',
    homeTeam: 'FC Barcelona',
    awayTeam: 'Atlético de Madrid',
    time: '21:00',
    dayOffset: 2,
    isLiveNow: false,
    tvChannel: 'beIN SPORTS 2',
  },
  {
    id: 'f6',
    sport: 'football',
    league: 'Serie A Enilive',
    homeTeam: 'Inter Milan',
    awayTeam: 'AC Milan',
    time: '20:45',
    dayOffset: 2,
    isLiveNow: false,
    tvChannel: 'beIN SPORTS 3',
  },
  {
    id: 'b2',
    sport: 'basketball',
    league: 'NBA Finals',
    homeTeam: 'Golden State Warriors',
    awayTeam: 'Chicago Bulls',
    time: '22:00',
    dayOffset: 2,
    isLiveNow: false,
    tvChannel: 'beIN SPORTS 1',
  },

  // LATER THIS WEEK (dayOffset = 3)
  {
    id: 'm2',
    sport: 'motorsport',
    league: 'Formula 1',
    homeTeam: 'Grand Prix de Monaco',
    awayTeam: 'Course Finale 🏎️',
    time: '15:00',
    dayOffset: 3,
    isLiveNow: false,
    tvChannel: 'Canal+ / TF1',
  },
  {
    id: 'f7',
    sport: 'football',
    league: 'UEFA Europa League',
    homeTeam: 'Manchester United',
    awayTeam: 'AS Roma',
    time: '21:00',
    dayOffset: 3,
    isLiveNow: false,
    tvChannel: 'Canal+ Foot',
  },
  {
    id: 't2',
    sport: 'tennis',
    league: 'Wimbledon',
    homeTeam: 'Jannik Sinner',
    awayTeam: 'Daniil Medvedev',
    time: '14:30',
    dayOffset: 4,
    isLiveNow: false,
    tvChannel: 'beIN SPORTS 2',
  },
];

export function getLocalizedDateString(dayOffset: number, locale: string): string {
  const date = new Date();
  date.setDate(date.getDate() + dayOffset);

  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  };

  let str = date.toLocaleDateString(locale === 'de' ? 'de-DE' : locale === 'es' ? 'es-ES' : locale === 'en' ? 'en-US' : 'fr-FR', options);
  
  // Capitalize first letter
  return str.charAt(0).toUpperCase() + str.slice(1);
}
