'use client';

import { useTranslation } from '@/hooks/useTranslation';

export function DeviceCarousel() {
  const { locale } = useTranslation();

  const textMap = {
    fr: 'Compatible avec tous vos appareils',
    en: 'Compatible with all your devices',
    de: 'Kompatibel mit all Ihren Geräten',
    es: 'Compatible con todos sus dispositivos',
  };

  const carouselText = textMap[locale as keyof typeof textMap] || textMap.fr;

  const devices = [
    { name: 'Samsung Smart TV', icon: '📺' },
    { name: 'LG Smart TV', icon: '📺' },
    { name: 'MAG Box', icon: '⚙️' },
    { name: 'X96 Mini', icon: '🤖' },
    { name: 'Apple TV', icon: '' },
    { name: 'Amazon Firestick', icon: '🔥' },
    { name: 'Formuler Z', icon: '⚡' },
    { name: 'Xiaomi Mi Box', icon: '📱' },
    { name: 'Sony Bravia', icon: '📺' },
    { name: 'Nvidia Shield', icon: '💚' },
    { name: 'Google Chromecast', icon: '📡' },
    { name: 'Android TV', icon: '🤖' },
    { name: 'iPhone & iPad', icon: '🍏' },
    { name: 'PC & Mac', icon: '💻' },
    { name: 'Enigma2 Box', icon: '📟' },
    { name: 'Smart IPTV', icon: '🔌' },
    { name: 'Net IPTV', icon: '🌐' },
    { name: 'Set IPTV', icon: '📲' },
    { name: 'IPTV Smarters Pro', icon: '🎬' },
    { name: 'SS IPTV', icon: '📺' },
    { name: 'Dreamlink', icon: '🛰️' },
    { name: 'Openbox', icon: '📦' },
  ];

  // Triple the items to guarantee zero gaps during loop transitions
  const displayDevices = [...devices, ...devices, ...devices];

  return (
    <div className="relative bg-bg-card/20 backdrop-blur-[2px] border-y border-border/10 py-16 overflow-hidden w-full select-none z-20">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee-custom {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.3333%);
          }
        }
        .animate-marquee-custom {
          display: flex;
          gap: 16px;
          width: max-content;
          animation: marquee-custom 40s linear infinite;
        }
        .animate-marquee-custom:hover {
          animation-play-state: paused;
        }
      ` }} />

      <div className="max-w-7xl mx-auto px-[24px] md:px-[40px] flex flex-col md:flex-row items-center gap-16 md:gap-32">
        {/* Left header label */}
        <div className="flex-shrink-0 flex items-center gap-8 text-[11px] md:text-xs font-bold uppercase tracking-wider text-text-muted">
          <span className="w-6 h-6 rounded-full bg-success animate-pulse" />
          <span>{carouselText}</span>
        </div>

        {/* Marquee slider track container */}
        <div className="relative flex-1 overflow-hidden w-full">
          {/* Gradient fade masks for smooth transition at edges */}
          <div className="absolute left-0 top-0 bottom-0 w-[40px] bg-gradient-to-r from-bg-base/100 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-[40px] bg-gradient-to-l from-bg-base/100 to-transparent z-10 pointer-events-none" />

          {/* Sliding track */}
          <div className="animate-marquee-custom py-4">
            {displayDevices.map((dev, i) => (
              <div
                key={`${dev.name}-${i}`}
                className="flex items-center gap-8 px-16 py-8 rounded-full bg-white/5 border border-white/10 shadow-sm text-xs font-semibold text-text-primary hover:border-[var(--brand-from)]/40 hover:bg-white/[0.08] transition-all duration-300 cursor-default flex-shrink-0"
              >
                <span className="text-sm flex items-center justify-center">{dev.icon}</span>
                <span>{dev.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
