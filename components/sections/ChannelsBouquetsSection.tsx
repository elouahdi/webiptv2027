'use client';

import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp } from '@/lib/utils/animations';

const bouquets = [
  {
    emoji: '🏆',
    name: 'Sport Premium',
    channels: ['BeIN Sports 1-3', 'RMC Sport 1-2', 'Canal+ Sport', 'Eurosport', 'DAZN', 'ESPN'],
    color: 'from-orange-500/20 to-red-500/10',
    borderColor: 'border-orange-500/20',
    tagColor: 'bg-orange-500/10 text-orange-500 dark:text-orange-400',
  },
  {
    emoji: '🎬',
    name: 'Cinéma & Séries',
    channels: ['Canal+', 'OCS Cinéma', 'TCM Cinéma', 'C8', 'Ciné+ Club', 'VOD illimitée'],
    color: 'from-purple-500/20 to-violet-500/10',
    borderColor: 'border-purple-500/20',
    tagColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  },
  {
    emoji: '📺',
    name: 'Généraliste FR',
    channels: ['TF1', 'France 2-5', 'M6', 'TMC', 'W9', 'Arte', 'BFM TV', 'CNews'],
    color: 'from-blue-500/20 to-cyan-500/10',
    borderColor: 'border-blue-500/20',
    tagColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  },
  {
    emoji: '🌍',
    name: 'International',
    channels: ['Chaînes arabes', 'Turques', 'Espagnoles', 'Portugaises', 'UK', 'US', 'Allemandes'],
    color: 'from-green-500/20 to-emerald-500/10',
    borderColor: 'border-green-500/20',
    tagColor: 'bg-green-500/10 text-green-700 dark:text-green-400',
  },
  {
    emoji: '👶',
    name: 'Jeunesse',
    channels: ['Disney Channel', 'Cartoon Network', 'Nickelodeon', 'Gulli', 'TiJi', 'Piwi+'],
    color: 'from-yellow-500/20 to-amber-500/10',
    borderColor: 'border-yellow-500/20',
    tagColor: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
  },
  {
    emoji: '🎵',
    name: 'Musique & Culture',
    channels: ['MTV', 'Trace Urban', 'Mezzo', 'MCM', 'Melody', 'Arte Concert'],
    color: 'from-pink-500/20 to-rose-500/10',
    borderColor: 'border-pink-500/20',
    tagColor: 'bg-pink-500/10 text-pink-600 dark:text-pink-400',
  },
];

export function ChannelsBouquetsSection() {
  return (
    <section className="py-[96px] bg-bg-card relative overflow-hidden" aria-labelledby="bouquets-heading">
      {/* Background decoration */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, var(--brand-from) 40%, var(--brand-to) 60%, transparent 100%)',
          opacity: 0.15,
        }}
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.08 }}
        className="max-w-7xl mx-auto px-[24px] md:px-[40px] relative z-10"
      >
        {/* Header */}
        <motion.div variants={fadeInUp} className="text-center mb-[64px]">
          <div className="inline-flex items-center gap-[8px] px-[16px] py-[7px] bg-[var(--brand-from)]/10 border border-[var(--brand-from)]/20 rounded-full mb-[20px]">
            <span className="w-[6px] h-[6px] rounded-full bg-[var(--brand-from)] animate-pulse" />
            <span className="text-[var(--brand-from)] text-xs font-bold uppercase tracking-widest">
              45 000+ Chaînes
            </span>
          </div>
          <h2
            id="bouquets-heading"
            className="font-syne font-bold text-[32px] md:text-[48px] text-text-primary mb-[16px] tracking-tight"
          >
            Tous Vos Bouquets Préférés
          </h2>
          <p className="text-text-secondary text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Plus de 45 000 chaînes Live HD/4K et VOD, toutes catégories confondues. Sport, cinéma, séries, international et jeunesse — tout est inclus.
          </p>
        </motion.div>

        {/* Bouquet cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px]">
          {bouquets.map((bouquet, i) => (
            <motion.div
              key={bouquet.name}
              variants={fadeInUp}
              custom={i}
              className={`p-[28px] rounded-2xl card-glass card-hover bg-gradient-to-br ${bouquet.color} border ${bouquet.borderColor}`}
            >
              <div className="flex items-center gap-[14px] mb-[20px]">
                <div className="text-[32px] leading-none">{bouquet.emoji}</div>
                <h3 className="font-syne font-bold text-lg text-text-primary">
                  {bouquet.name}
                </h3>
              </div>
              <div className="flex flex-wrap gap-[8px]">
                {bouquet.channels.map((ch) => (
                  <span
                    key={ch}
                    className={`px-[10px] py-[4px] rounded-full text-xs font-semibold ${bouquet.tagColor}`}
                  >
                    {ch}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom count strip */}
        <motion.div variants={fadeInUp} className="mt-[48px] text-center">
          <p className="text-text-muted text-sm">
            Et bien plus encore… chaînes locales, info, documentaires, sport régional — 
            <span className="text-text-primary font-semibold"> le catalogue le plus complet du marché.</span>
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
