'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon, Laptop } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { cn } from '@/lib/utils/cn';

export function PublicThemeSwitcher({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={cn("w-9 h-9 rounded-lg bg-transparent border border-transparent", className)} />
    );
  }

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="w-[18px] h-[18px]" />;
      case 'dark':
        return <Moon className="w-[18px] h-[18px]" />;
      default:
        return <Laptop className="w-[18px] h-[18px]" />;
    }
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className={cn(
            "flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200 outline-none",
            "text-text-secondary hover:text-text-primary focus-visible:ring-1 focus-visible:ring-[var(--brand-from)]/40",
            className
          )}
          aria-label="Changer le thème"
        >
          {getThemeIcon()}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className={cn(
            "min-w-[140px] border rounded-xl shadow-2xl p-1.5 z-50",
            "animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2"
          )}
          style={{
            background: 'var(--bg-card)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderColor: 'var(--border)',
          }}
          sideOffset={8}
          align="end"
        >
          <DropdownMenu.Item
            className={cn(
              "flex items-center gap-2.5 px-3 py-2 text-[13px] rounded-lg cursor-pointer outline-none transition-colors duration-150",
              theme === 'light'
                ? "font-medium"
                : "hover:bg-[var(--text-muted)]/10 focus:bg-[var(--text-muted)]/10"
            )}
            style={{
              color: theme === 'light' ? 'var(--brand-from)' : 'var(--text-primary)',
              backgroundColor: theme === 'light' ? 'color-mix(in srgb, var(--brand-from) 10%, transparent)' : undefined,
            }}
            onClick={() => setTheme('light')}
          >
            <Sun className="w-4 h-4 shrink-0" />
            Clair
          </DropdownMenu.Item>
          
          <DropdownMenu.Item
            className={cn(
              "flex items-center gap-2.5 px-3 py-2 text-[13px] rounded-lg cursor-pointer outline-none transition-colors duration-150",
              theme === 'dark'
                ? "font-medium"
                : "hover:bg-[var(--text-muted)]/10 focus:bg-[var(--text-muted)]/10"
            )}
            style={{
              color: theme === 'dark' ? 'var(--brand-from)' : 'var(--text-primary)',
              backgroundColor: theme === 'dark' ? 'color-mix(in srgb, var(--brand-from) 10%, transparent)' : undefined,
            }}
            onClick={() => setTheme('dark')}
          >
            <Moon className="w-4 h-4 shrink-0" />
            Sombre
          </DropdownMenu.Item>

          <DropdownMenu.Item
            className={cn(
              "flex items-center gap-2.5 px-3 py-2 text-[13px] rounded-lg cursor-pointer outline-none transition-colors duration-150",
              theme === 'system'
                ? "font-medium"
                : "hover:bg-[var(--text-muted)]/10 focus:bg-[var(--text-muted)]/10"
            )}
            style={{
              color: theme === 'system' ? 'var(--brand-from)' : 'var(--text-primary)',
              backgroundColor: theme === 'system' ? 'color-mix(in srgb, var(--brand-from) 10%, transparent)' : undefined,
            }}
            onClick={() => setTheme('system')}
          >
            <Laptop className="w-4 h-4 shrink-0" />
            Système
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
