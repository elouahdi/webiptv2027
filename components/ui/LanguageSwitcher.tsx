'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';
import { cn } from '@/lib/utils/cn';
import { useEffect } from 'react';

export function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const { locale } = useTranslation();

  const locales = [
    { code: 'fr', label: 'FR' },
    { code: 'en', label: 'EN' },
    { code: 'de', label: 'DE' },
    { code: 'es', label: 'ES' },
  ];

  const getSwitchLocalePath = (targetLocale: string) => {
    const segments = pathname.split('/');
    const availableLocales = ['fr', 'en', 'de', 'es'];
    const firstSegment = segments[1];

    if (availableLocales.includes(firstSegment)) {
      if (targetLocale === 'fr') {
        const newSegments = ['', ...segments.slice(2)];
        return newSegments.join('/') || '/';
      } else {
        const newSegments = ['', targetLocale, ...segments.slice(2)];
        return newSegments.join('/');
      }
    } else {
      if (targetLocale === 'fr') {
        return pathname;
      } else {
        return `/${targetLocale}${pathname === '/' ? '' : pathname}`;
      }
    }
  };

  const handleLanguageChange = (code: string) => {
    if (code === locale) return;
    localStorage.setItem('preferred-locale', code);
    const newPath = getSwitchLocalePath(code);
    router.push(newPath);
  };

  // Sync preferred locale to localStorage on load
  useEffect(() => {
    localStorage.setItem('preferred-locale', locale);
  }, [locale]);

  return (
    <div className="flex items-center gap-[4px] text-xs font-semibold border border-black/[0.08] dark:border-white/[0.08] rounded-full p-[2px] bg-black/[0.02] dark:bg-white/[0.02]">
      {locales.map((loc) => {
        const isActive = locale === loc.code;
        return (
          <button
            key={loc.code}
            onClick={() => handleLanguageChange(loc.code)}
            className={cn(
              "px-[8px] py-[3px] rounded-full transition-all duration-200 text-[11px] font-bold tracking-wider",
              isActive
                ? "bg-gradient-to-r from-brand-from to-brand-to text-white shadow-sm"
                : "text-text-secondary hover:text-text-primary hover:bg-black/[0.04] dark:hover:bg-white/[0.04]"
            )}
          >
            {loc.label}
          </button>
        );
      })}
    </div>
  );
}
