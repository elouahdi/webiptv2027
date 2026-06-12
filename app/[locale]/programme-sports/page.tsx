// app/[locale]/programme-sports/page.tsx
// Async server component — fetches football matches from BSD API
// Initial data loaded on the server; MatchesClient handles date nav + live refresh

import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { WhatsappButton } from '@/components/ui/WhatsappButton';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { MatchesClient } from '@/components/MatchesClient';
import { locales } from '@/lib/i18n';
import { SITE_CONFIG } from '@/config/site';
import { buildBreadcrumbSchema } from '@/lib/seo/schemas';
import { fetchTodayMatches } from '@/lib/bsd-sports';

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const activeLocale = locales.includes(locale as 'fr' | 'en' | 'de' | 'es') ? locale : 'fr';
  const baseUrl = SITE_CONFIG.url;

  const canonical =
    activeLocale === 'fr'
      ? `${baseUrl}/programme-sports`
      : `${baseUrl}/${activeLocale}/programme-sports`;

  return {
    title:
      activeLocale === 'en'
        ? "Today's Football Matches Live – IPTV Sports Guide"
        : activeLocale === 'de'
        ? 'Heutige Fußballspiele Live – IPTV Sport-Guide'
        : activeLocale === 'es'
        ? 'Partidos de Fútbol Hoy en Vivo – Guía Deportes IPTV'
        : "Matchs de Football du Jour en Direct – Programme Sports IPTV",
    description:
      activeLocale === 'en'
        ? 'Live football scores, fixtures and results for today. Watch all matches on IPTV – 45,000+ channels including BeIN Sports, Al Kass and more.'
        : activeLocale === 'de'
        ? 'Live-Fußballergebnisse, Spielpläne und Ergebnisse für heute. Alle Spiele auf IPTV sehen – über 45.000 Kanäle.'
        : activeLocale === 'es'
        ? 'Resultados de fútbol en directo, partidos y resultados de hoy. Ve todos los partidos en IPTV – +45.000 canales.'
        : "Résultats football en direct, matchs du jour et scores en temps réel. Regardez tous les matchs sur IPTV – +45 000 chaînes.",
    alternates: {
      canonical,
      languages: {
        'x-default': `${baseUrl}/programme-sports`,
        fr: `${baseUrl}/programme-sports`,
        en: `${baseUrl}/en/programme-sports`,
        de: `${baseUrl}/de/programme-sports`,
        es: `${baseUrl}/es/programme-sports`,
      },
    },
    openGraph: {
      title: "⚽ Matchs Football du Jour en Direct",
      description: "Scores, résultats et horaires des matchs de football. Regardez en 4K sur IPTV.",
      url: canonical,
      type: 'website',
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function SportsGuidePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ date?: string }>;
}) {
  const { locale } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const activeLocale = locales.includes(locale as 'fr' | 'en' | 'de' | 'es') ? locale : 'fr';

  // ─── Fetch matches server-side ───────────────────────────────
  const { matches, error, date } = await fetchTodayMatches(resolvedSearchParams.date);

  // ─── Breadcrumb ──────────────────────────────────────────────────────
  const crumbs = [
    {
      label:
        activeLocale === 'en'
          ? 'Football Matches Today'
          : activeLocale === 'de'
          ? 'Fußballspiele Heute'
          : activeLocale === 'es'
          ? 'Partidos Hoy'
          : 'Matchs Football du Jour',
      href:
        activeLocale === 'fr'
          ? '/programme-sports'
          : `/${activeLocale}/programme-sports`,
    },
  ];

  const pageTitle =
    activeLocale === 'en'
      ? "Today's Football Matches"
      : activeLocale === 'de'
      ? 'Heutige Fußballspiele'
      : activeLocale === 'es'
      ? 'Partidos de Fútbol Hoy'
      : 'Matchs de Football du Jour';

  const pageSubtitle =
    activeLocale === 'en'
      ? 'Live scores, results and fixtures – updated in real time. Watch every match in 4K on IPTV.'
      : activeLocale === 'de'
      ? 'Live-Ergebnisse, Resultate und Spielpläne – in Echtzeit aktualisiert. Sehen Sie jedes Spiel in 4K auf IPTV.'
      : activeLocale === 'es'
      ? 'Resultados en directo, marcadores y horaires – actualizados en tiempo real. Ve todos los partidos en 4K en IPTV.'
      : 'Scores en direct, résultats et programme – mis à jour en temps réel. Regardez chaque match en 4K sur IPTV.';

  return (
    <>
      <AnnouncementBar />
      <Navbar />

      <main className="min-h-screen bg-[#0f1117] pt-32 text-white kooora-theme">
        {/* Breadcrumb */}
        <div className="border-b border-[#2a2d3a] bg-[#161922]">
          <div className="max-w-5xl mx-auto px-[24px] md:px-[40px] py-16">
            <Breadcrumb items={crumbs} />
          </div>
        </div>

        {/* Hero Header */}
        <div className="py-56 bg-[#161922] border-b border-[#2a2d3a] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#e8002d]/[0.04] to-transparent pointer-events-none" />
          {/* Subtle football pattern */}
          <div
            className="absolute inset-0 opacity-[0.015] pointer-events-none"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Ccircle cx='30' cy='30' r='28' stroke='white' stroke-width='1.5' fill='none'/%3E%3C/svg%3E\")",
              backgroundSize: '60px 60px',
            }}
          />
          <div className="max-w-5xl mx-auto px-[24px] md:px-[40px] text-center relative z-10">
            <div className="inline-flex items-center gap-8 px-16 py-6 bg-[#e8002d]/10 border border-[#e8002d]/20 text-[#e8002d] text-[11px] font-extrabold uppercase tracking-widest rounded-full mb-20">
              <span className="w-6 h-6 rounded-full bg-[#e8002d] animate-pulse" />
              Scores en direct · Auto-refresh 30s
            </div>
            <h1 className="font-syne font-black text-32 md:text-52 text-white mb-16 tracking-tight">
              {pageTitle}
            </h1>
            <p className="text-[#8b8fa8] text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
              {pageSubtitle}
            </p>
            <div className="mt-32 max-w-2xl mx-auto">
              <img src="/hero-sports.svg" alt="Live scores" className="w-full rounded-xl opacity-90" />
            </div>
          </div>
        </div>

        {/* Matches — MatchesClient handles refresh */}
        <div className="py-48">
          <div className="max-w-5xl mx-auto px-[24px] md:px-[40px]">
            <MatchesClient
              initialMatches={matches}
              date={date}
              initialError={error}
            />
          </div>
        </div>
      </main>

      <Footer />
      <WhatsappButton />

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildBreadcrumbSchema([
              {
                label:
                  activeLocale === 'en'
                    ? 'Home'
                    : activeLocale === 'de'
                    ? 'Startseite'
                    : activeLocale === 'es'
                    ? 'Inicio'
                    : 'Accueil',
                url: activeLocale === 'fr' ? '' : `/${activeLocale}`,
              },
              {
                label: pageTitle,
                url:
                  activeLocale === 'fr'
                    ? '/programme-sports'
                    : `/${activeLocale}/programme-sports`,
              },
            ])
          ),
        }}
      />
    </>
  );
}
