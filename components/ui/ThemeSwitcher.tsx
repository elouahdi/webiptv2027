'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon, Laptop } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { cn } from '@/lib/utils/cn';

export function ThemeSwitcher({ className }: { className?: string }) {
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
            "text-admin-text-secondary hover:text-admin-text hover:bg-admin-muted/60 focus-visible:ring-1 focus-visible:ring-amber-500/40",
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
            "min-w-[140px] bg-admin-card border border-admin-border rounded-xl shadow-2xl p-1.5 z-50",
            "animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2"
          )}
          sideOffset={8}
          align="end"
        >
          <DropdownMenu.Item
            className={cn(
              "flex items-center gap-2.5 px-3 py-2 text-[13px] rounded-lg cursor-pointer outline-none transition-colors duration-150",
              theme === 'light'
                ? "bg-amber-500/10 text-amber-400 font-medium"
                : "text-admin-text hover:bg-admin-muted focus:bg-admin-muted"
            )}
            onClick={() => setTheme('light')}
          >
            <Sun className="w-4 h-4 shrink-0" />
            Clair
          </DropdownMenu.Item>
          
          <DropdownMenu.Item
            className={cn(
              "flex items-center gap-2.5 px-3 py-2 text-[13px] rounded-lg cursor-pointer outline-none transition-colors duration-150",
              theme === 'dark'
                ? "bg-amber-500/10 text-amber-400 font-medium"
                : "text-admin-text hover:bg-admin-muted focus:bg-admin-muted"
            )}
            onClick={() => setTheme('dark')}
          >
            <Moon className="w-4 h-4 shrink-0" />
            Sombre
          </DropdownMenu.Item>

          <DropdownMenu.Item
            className={cn(
              "flex items-center gap-2.5 px-3 py-2 text-[13px] rounded-lg cursor-pointer outline-none transition-colors duration-150",
              theme === 'system'
                ? "bg-amber-500/10 text-amber-400 font-medium"
                : "text-admin-text hover:bg-admin-muted focus:bg-admin-muted"
            )}
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
