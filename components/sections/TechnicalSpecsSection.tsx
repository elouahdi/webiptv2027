'use client';

import { motion } from 'framer-motion';
import {
  Shield,
  Wifi,
  Tv2,
  Layers,
  MonitorPlay,
  Clock4,
  CheckCircle2,
} from 'lucide-react';
import { staggerContainer, fadeInUp } from '@/lib/utils/animations';
import { useTranslation } from '@/hooks/useTranslation';

const specRows = [
  { icon: Layers, key: 'protocols' },
  { icon: MonitorPlay, key: 'resolution' },
  { icon: Tv2, key: 'epg' },
  { icon: Shield, key: 'antifreeze' },
  { icon: Wifi, key: 'devices' },
  { icon: Clock4, key: 'trial' },
] as const;

export function TechnicalSpecsSection() {
  const { t } = useTranslation();

  return (
    <section className="py-[96px] bg-bg-base relative overflow-hidden" aria-labelledby="specs-heading">
      {/* Ambient blobs */}
      <div
        className="absolute -top-[120px] left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse, rgba(0,243,255,0.06) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-[400px] h-[300px] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at bottom right, rgba(255,0,229,0.05) 0%, transparent 70%)',
        }}
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="max-w-7xl mx-auto px-[24px] md:px-[40px] relative z-10"
      >
        {/* Header */}
        <motion.div variants={fadeInUp} className="text-center mb-[64px]">
          <div className="inline-flex items-center gap-[8px] px-[16px] py-[7px] bg-[var(--brand-from)]/10 border border-[var(--brand-from)]/20 rounded-full mb-[20px]">
            <span className="w-[6px] h-[6px] rounded-full bg-[var(--brand-from)] animate-pulse" />
            <span className="text-[var(--brand-from)] text-xs font-bold uppercase tracking-widest">
              Infrastructure
            </span>
          </div>
          <h2
            id="specs-heading"
            className="font-syne font-bold text-[32px] md:text-[48px] text-text-primary mb-[16px] tracking-tight"
          >
            {t('specs.title')}
          </h2>
          <p className="text-text-secondary text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            {t('specs.subtitle')}
          </p>
        </motion.div>

        {/* Specs grid — top cards */}
        <motion.div
          variants={fadeInUp}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px] mb-[32px]"
        >
          {specRows.slice(0, 3).map(({ icon: Icon, key }) => (
            <SpecCard key={key} Icon={Icon} title={t(`specs.${key}.title`)} desc={t(`specs.${key}.desc`)} />
          ))}
        </motion.div>

        <motion.div
          variants={fadeInUp}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px] mb-[64px]"
        >
          {specRows.slice(3).map(({ icon: Icon, key }) => (
            <SpecCard key={key} Icon={Icon} title={t(`specs.${key}.title`)} desc={t(`specs.${key}.desc`)} />
          ))}
        </motion.div>

        {/* Full specs table */}
        <motion.div
          variants={fadeInUp}
          className="rounded-2xl overflow-hidden card-glass"
        >
          <div className="grid grid-cols-[1fr_2fr] bg-gradient-to-r from-[var(--brand-from)]/10 to-[var(--brand-to)]/10 border-b border-border/50">
            <div className="px-[24px] py-[16px] text-xs font-bold uppercase tracking-widest text-text-muted">
              {t('specs.feature')}
            </div>
            <div className="px-[24px] py-[16px] text-xs font-bold uppercase tracking-widest text-text-muted">
              {t('specs.description')}
            </div>
          </div>

          {specRows.map(({ icon: Icon, key }, i) => (
            <div
              key={key}
              className={`grid grid-cols-[1fr_2fr] border-b last:border-0 border-border/30 hover:bg-[var(--brand-from)]/5 transition-colors duration-200 ${
                i % 2 === 0 ? 'bg-transparent' : 'bg-bg-elevated/30'
              }`}
            >
              <div className="px-[24px] py-[20px] flex items-center gap-[12px]">
                <div className="w-[32px] h-[32px] rounded-lg bg-gradient-to-br from-[var(--brand-from)] to-[var(--brand-to)] flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Icon className="w-[16px] h-[16px] text-white" />
                </div>
                <span className="font-semibold text-sm text-text-primary">{t(`specs.${key}.title`)}</span>
              </div>
              <div className="px-[24px] py-[20px] flex items-center gap-[10px]">
                <CheckCircle2 className="w-[16px] h-[16px] text-success flex-shrink-0" />
                <span className="text-sm text-text-secondary leading-relaxed">{t(`specs.${key}.desc`)}</span>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Bottom trust strip */}
        <motion.div variants={fadeInUp} className="mt-[48px]">
          <div className="rounded-2xl bg-gradient-to-r from-[var(--brand-from)]/8 via-bg-elevated/50 to-[var(--brand-to)]/8 border border-border/40 p-[24px] md:p-[32px] flex flex-col md:flex-row items-center justify-between gap-[24px]">
            <div className="text-center md:text-left">
              <p className="font-syne font-bold text-lg text-text-primary mb-[4px]">
                99.9% Uptime SLA
              </p>
              <p className="text-sm text-text-secondary">
                Nos serveurs fonctionnent en redondance active avec basculement automatique en cas de panne.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-[12px] flex-shrink-0">
              {['10 Gbps Bandwidth', '4K UHD', 'CDN Global', 'Anti-Freeze v5.8'].map((badge) => (
                <span
                  key={badge}
                  className="px-[14px] py-[7px] bg-bg-card border border-border rounded-full text-xs font-bold text-text-primary tracking-wide"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

function SpecCard({
  Icon,
  title,
  desc,
}: {
  Icon: React.ElementType;
  title: string;
  desc: string;
}) {
  return (
    <div className="p-[28px] rounded-2xl card-glass card-hover group">
      <div className="w-[44px] h-[44px] rounded-xl bg-gradient-to-br from-[var(--brand-from)] to-[var(--brand-to)] flex items-center justify-center mb-[20px] shadow-md shadow-[var(--brand-from)]/10 group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-[22px] h-[22px] text-white" />
      </div>
      <h3 className="font-syne font-bold text-base text-text-primary mb-[8px]">{title}</h3>
      <p className="text-sm text-text-secondary leading-relaxed">{desc}</p>
    </div>
  );
}
