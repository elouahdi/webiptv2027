'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, TrendingUp, Sparkles, Play } from 'lucide-react';

interface Show {
  id: number;
  name: string;
  image: string | null;
  rating: number | null;
  genres: string[];
  network: string;
  premiered: string | null;
}

export function SeriesCarousel() {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/tv/trending')
      .then(r => r.json())
      .then(data => {
        if (data.shows?.length) setShows(data.shows);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const scroll = (dir: 'left' | 'right') => {
    const el = document.getElementById('series-scroll');
    if (el) el.scrollBy({ left: dir === 'left' ? -340 : 340, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <section className="py-[60px] bg-bg-base">
        <div className="max-w-7xl mx-auto px-[16px] md:px-[40px]">
          <div className="animate-pulse flex gap-[16px] overflow-hidden">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="min-w-[260px] h-[380px] bg-bg-card rounded-3xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!shows.length) return null;

  return (
    <section className="relative py-[60px] md:py-[80px] bg-bg-base overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[150px] pointer-events-none opacity-20"
        style={{ background: 'radial-gradient(ellipse, rgba(255,0,229,0.12) 0%, transparent 70%)' }} />
      <div className="absolute bottom-0 left-[10%] w-[400px] h-[400px] rounded-full blur-[120px] pointer-events-none opacity-15"
        style={{ background: 'radial-gradient(ellipse, rgba(0,243,255,0.10) 0%, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto px-[16px] md:px-[40px] relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-[32px] md:mb-[40px] gap-[16px]"
        >
          <div>
            <div className="inline-flex items-center gap-[8px] px-[12px] py-[5px] bg-[var(--brand-from)]/10 border border-[var(--brand-from)]/20 rounded-full mb-[16px]">
              <Sparkles className="w-[12px] h-[12px] text-[var(--brand-from)]" />
              <span className="text-[var(--brand-from)] text-[11px] font-bold uppercase tracking-widest">À l'affiche cette semaine</span>
            </div>
            <h2 className="font-syne font-bold text-[32px] md:text-[42px] text-text-primary leading-[1.1] tracking-tight">
              Nouveautés <span className="text-gradient">Séries & Films</span>
            </h2>
          </div>
          <div className="flex items-center gap-[10px]">
            <button
              onClick={() => scroll('left')}
              className="w-[42px] h-[42px] rounded-full bg-bg-card border border-border flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-[var(--brand-from)]/30 transition-all active:scale-95 touch-manipulation"
            >
              ←
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-[42px] h-[42px] rounded-full bg-bg-card border border-border flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-[var(--brand-from)]/30 transition-all active:scale-95 touch-manipulation"
            >
              →
            </button>
          </div>
        </motion.div>

        {/* Carousel */}
        <div
          id="series-scroll"
          className="flex gap-[18px] overflow-x-auto scroll-smooth scrollbar-hide pb-[12px]"
          style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {shows.map((show, i) => (
            <motion.div
              key={show.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04, duration: 0.4 }}
              className="group relative min-w-[240px] md:min-w-[280px] max-w-[280px] flex-shrink-0 rounded-3xl bg-bg-card border border-border hover:border-[var(--brand-from)]/40 transition-all duration-500 overflow-hidden hover:shadow-2xl hover:shadow-[var(--brand-from)]/5 hover:-translate-y-1"
              style={{ scrollSnapAlign: 'start' }}
            >
              {/* Image container */}
              <div className="relative w-full aspect-[2/3] bg-bg-elevated overflow-hidden">
                {show.image ? (
                  <img
                    src={show.image}
                    alt={show.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      (e.target as HTMLImageElement).parentElement!.querySelector('.fallback')!.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className="fallback w-full h-full flex items-center justify-center text-5xl bg-gradient-to-br from-[var(--brand-from)]/20 via-purple-500/20 to-[var(--brand-to)]/20 hidden">
                  🎬
                </div>

                {/* Overlay gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Play button on hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="w-[56px] h-[56px] rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                    <Play className="w-[22px] h-[22px] text-white fill-white ml-[3px]" />
                  </div>
                </div>

                {/* Rating top badge */}
                {show.rating && (
                  <div className="absolute top-[12px] right-[12px] flex items-center gap-[4px] px-[10px] py-[5px] bg-black/50 backdrop-blur-md rounded-xl border border-white/10">
                    <Star className="w-[12px] h-[12px] text-amber-400 fill-amber-400" />
                    <span className="text-white text-[12px] font-bold">{show.rating}</span>
                  </div>
                )}

                {/* Network bottom badge */}
                <div className="absolute bottom-[12px] left-[12px] px-[10px] py-[4px] bg-black/50 backdrop-blur-md rounded-lg text-white text-[11px] font-medium border border-white/10">
                  {show.network}
                </div>
              </div>

              {/* Info */}
              <div className="p-[16px]">
                <h3 className="font-syne font-bold text-[15px] text-text-primary line-clamp-1 mb-[8px] group-hover:text-[var(--brand-from)] transition-colors">
                  {show.name}
                </h3>
                <div className="flex flex-wrap gap-[6px]">
                  {show.genres.slice(0, 2).map(g => (
                    <span key={g} className="px-[8px] py-[3px] bg-[var(--brand-from)]/10 text-[var(--brand-from)] text-[10px] rounded-lg font-semibold">
                      {g}
                    </span>
                  ))}
                  {show.premiered && (
                    <span className="px-[8px] py-[3px] bg-bg-elevated text-text-muted text-[10px] rounded-lg font-medium">
                      {new Date(show.premiered).getFullYear()}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
