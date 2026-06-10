'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NAV_LINKS } from '@/config/navigation';
import { cn } from '@/lib/utils/cn';
import { PublicThemeSwitcher } from '@/components/ui/PublicThemeSwitcher';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { useTranslation } from '@/hooks/useTranslation';
import { getLocalizedPath } from '@/lib/i18n';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { t, locale } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const getLinkLabel = (label: string) => {
    switch (label.toLowerCase()) {
      case 'accueil':
        return t('nav.home');
      case 'plans':
      case 'nos plans':
        return t('nav.plans');
      case 'chaînes':
      case 'chaines':
        return t('nav.channels') || 'Chaînes';
      case 'sports':
        return t('nav.sports') || 'Sports';
      case 'blog':
        return t('nav.blog');
      case 'contact':
        return t('nav.contact');
      case 'faq':
        return t('nav.faq');
      default:
        return label;
    }
  };


  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300 border-b",
        isScrolled
          ? "bg-white/80 dark:bg-[#0A0A0A]/85 backdrop-blur-md border-black/[0.06] dark:border-white/[0.06] shadow-sm"
          : "bg-transparent border-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-[24px] md:px-[40px]">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo and Brand */}
          <Link href={getLocalizedPath('/', locale)} className="flex items-center gap-[12px] group">
            <div className="w-[32px] h-[32px] bg-gradient-to-br from-brand-from to-brand-to rounded-xl flex items-center justify-center shadow-lg shadow-brand-from/15 group-hover:scale-[1.05] transition-transform duration-300 relative overflow-hidden">
              <span className="text-white font-bold text-lg relative z-10">R</span>
              <div className="absolute inset-0 bg-white/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <span className="font-syne font-bold text-lg md:text-xl text-text-primary tracking-tight group-hover:text-[var(--brand-from)] transition-colors duration-300">
              RegardezIPTV
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-[4px]">
            {NAV_LINKS.map((link, index) => {
              const localizedHref = getLocalizedPath(link.href, locale);
              const isActive = pathname === localizedHref;
              
              // Determine legibility colors based on scroll and theme modes
              let linkColorClasses = '';
              if (isScrolled) {
                if (isActive) {
                  linkColorClasses = 'font-semibold text-[#111] dark:text-white bg-black/[0.03] dark:bg-white/[0.05]';
                } else {
                  linkColorClasses = 'text-[#111]/75 hover:text-[#111] dark:text-white/75 dark:hover:text-white hover:bg-black/[0.02] dark:hover:bg-white/[0.02]';
                }
              } else {
                if (isActive) {
                  linkColorClasses = 'font-semibold text-text-primary bg-black/[0.03] dark:bg-white/[0.05]';
                } else {
                  linkColorClasses = 'text-text-secondary hover:text-text-primary hover:bg-black/[0.02] dark:hover:bg-white/[0.02]';
                }
              }

              return (
                <Link
                  key={`${link.href}-${index}`}
                  href={localizedHref}
                  className={cn(
                    'text-sm font-medium px-[16px] py-[8px] rounded-full transition-all duration-300 relative',
                    linkColorClasses
                  )}
                >
                  {getLinkLabel(link.label)}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-[16px]">
            <LanguageSwitcher />
            <PublicThemeSwitcher />
            <Link
              href={getLocalizedPath('/essai-gratuit', locale)}
              className="relative inline-flex items-center justify-center px-[20px] py-[8px] h-[40px] bg-gradient-to-r from-brand-from to-brand-to text-white text-[13px] font-bold rounded-xl transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] hover:shadow-[0_0_20px_rgba(0,243,255,0.25)] group overflow-hidden"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
              <span className="relative z-10">{t('nav.trial')}</span>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-[12px]">
            <LanguageSwitcher />
            <PublicThemeSwitcher />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-[8px] rounded-lg text-text-primary hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-colors relative z-50 focus:outline-none"
              aria-label={isMobileMenuOpen ? t('nav.close_menu') : t('nav.open_menu')}
            >
              {isMobileMenuOpen ? <X className="w-[22px] h-[22px]" /> : <Menu className="w-[22px] h-[22px]" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden border-t border-black/[0.06] dark:border-white/[0.06] bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="px-[24px] py-[20px] flex flex-col gap-[8px]">
              {NAV_LINKS.map((link, index) => {
                const localizedHref = getLocalizedPath(link.href, locale);
                const isActive = pathname === localizedHref;
                return (
                  <Link
                    key={`${link.href}-${index}`}
                    href={localizedHref}
                    className={cn(
                      'flex items-center w-full px-[16px] py-[12px] rounded-xl text-base font-medium transition-all duration-200',
                      isActive
                        ? 'bg-gradient-to-r from-[var(--brand-from)]/10 to-[var(--brand-to)]/10 dark:from-[var(--brand-from)]/15 dark:to-[var(--brand-to)]/15 text-text-primary border-l-[3px] border-[var(--brand-from)]'
                        : 'text-text-secondary hover:text-text-primary hover:bg-black/[0.02] dark:hover:bg-white/[0.02]'
                    )}
                  >
                    {getLinkLabel(link.label)}
                  </Link>
                );
              })}
              <div className="h-px bg-black/[0.06] dark:bg-white/[0.06] my-[8px]" />
              <Link
                href={getLocalizedPath('/essai-gratuit', locale)}
                className="relative flex items-center justify-center w-full py-[12px] bg-gradient-to-r from-brand-from to-brand-to text-white font-bold rounded-xl shadow-lg shadow-brand-from/10 hover:shadow-brand-from/20 transition-all duration-200"
              >
                {t('nav.trial')}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
