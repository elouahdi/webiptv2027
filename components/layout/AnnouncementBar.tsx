'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import type { AnnouncementBar as AnnouncementBarType } from '@/lib/cms/settings-storage';

export function AnnouncementBar() {
  const [bar, setBar] = useState<AnnouncementBarType | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Fetch dynamic announcement settings
    fetch('/api/public/settings')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.announcement) {
          const ann = data.announcement as AnnouncementBarType;
          
          // Check if bar is enabled and not expired
          const hasExpired = ann.expiresAt && new Date(ann.expiresAt) < new Date();
          const dismissed = localStorage.getItem(`announcement-dismissed-${ann.expiresAt || 'default'}`);
          
          if (ann.enabled && !hasExpired && !dismissed) {
            setBar(ann);
            setIsVisible(true);
          }
        }
      })
      .catch(() => {});
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    if (bar) {
      localStorage.setItem(`announcement-dismissed-${bar.expiresAt || 'default'}`, 'true');
    }
  };

  if (!bar) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="relative w-full z-50 shadow-sm"
          style={{ backgroundColor: bar.backgroundColor, color: bar.textColor }}
        >
          <div className="max-w-7xl mx-auto px-[24px] py-[10px] flex items-center justify-center gap-[16px] text-xs md:text-sm font-medium">
            <span className="text-center leading-snug">
              {bar.text}
              {bar.ctaText && bar.ctaHref && (
                <Link
                  href={bar.ctaHref}
                  className="inline-flex items-center gap-1 bg-white/25 hover:bg-white/40 px-[12px] py-[3px] rounded-full transition-all font-semibold ml-[10px] border border-transparent active:scale-95"
                  style={{ color: bar.textColor, borderColor: `${bar.textColor}33` }}
                >
                  {bar.ctaText}
                  <span className="text-sm leading-none">→</span>
                </Link>
              )}
            </span>
          </div>
          <button
            onClick={handleDismiss}
            className="absolute right-[16px] md:right-[24px] top-1/2 -translate-y-1/2 p-[4px] hover:bg-white/20 rounded-full transition-colors z-10"
            aria-label="Fermer la bannière"
            style={{ color: bar.textColor }}
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
