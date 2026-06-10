'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher';
import { NotificationsDropdown } from './NotificationsDropdown';
import {
  Search,
  User,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
interface AdminHeaderProps {
  onMenuClick: () => void;
  mobileMenuOpen: boolean;
  sidebarCollapsed: boolean;
}

export function AdminHeader({ onMenuClick, mobileMenuOpen }: AdminHeaderProps) {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.ok ? r.json() : null)
      .then((data) => data && setUser(data.user))
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/admin/blog/posts?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-30 h-64 bg-admin-card/80 backdrop-blur-xl border-b border-admin-border">
      <div className="flex items-center justify-between h-full px-16 lg:px-24">
        {/* Left section: mobile menu + search */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button
            onClick={onMenuClick}
            className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg text-admin-text-secondary hover:text-admin-text hover:bg-admin-muted transition-all duration-200"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <form onSubmit={handleSearch} className="hidden sm:block flex-1 max-w-xs lg:max-w-sm">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-admin-text-muted transition-colors duration-200 group-focus-within:text-amber-500" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher..."
                className="w-full pl-9 pr-16 py-2 h-9 bg-admin-muted/60 border border-transparent rounded-full text-sm text-admin-text placeholder:text-admin-text-muted focus:outline-none focus:bg-admin-input focus:border-admin-border focus:ring-1 focus:ring-amber-500/20 transition-all duration-200"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium text-admin-text-muted bg-admin-card border border-admin-border rounded-md font-mono">
                  ⌘K
                </kbd>
              </div>
            </div>
          </form>
        </div>

        {/* Right section: actions */}
        <div className="flex items-center gap-1">
          {/* View site link */}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center justify-center gap-1.5 h-9 px-3 text-[13px] font-medium text-admin-text-secondary hover:text-admin-text rounded-lg hover:bg-admin-muted transition-all duration-200"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Site
          </a>

          {/* Separator */}
          <div className="hidden md:block w-px h-5 bg-admin-border mx-1" />

          {/* Theme toggle */}
          <ThemeSwitcher />

          {/* Notifications */}
          <button className="relative flex items-center justify-center w-9 h-9 rounded-lg text-admin-text-secondary hover:text-admin-text hover:bg-admin-muted transition-all duration-200">
            <Bell className="w-[18px] h-[18px]" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-amber-500 rounded-full ring-2 ring-admin-card" />
          </button>

          {/* Separator */}
          <div className="w-px h-5 bg-admin-border mx-1" />

          {/* User dropdown */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="flex items-center gap-2.5 h-9 pl-1 pr-1 md:pr-2.5 rounded-lg hover:bg-admin-muted transition-all duration-200 outline-none focus-visible:ring-1 focus-visible:ring-amber-500/40">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-from to-brand-to flex items-center justify-center ring-1 ring-white/10 flex-shrink-0">
                  <User className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="hidden md:block text-left min-w-0">
                  <p className="text-[13px] font-medium text-admin-text leading-tight truncate">{user?.name || 'Admin'}</p>
                  <p className="text-[11px] text-admin-text-muted leading-tight truncate">{user?.email || ''}</p>
                </div>
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="min-w-[200px] bg-admin-card border border-admin-border rounded-xl shadow-2xl shadow-black/20 p-1.5 z-50 animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2"
                sideOffset={8}
                align="end"
              >
                <DropdownMenu.Item
                  className="flex items-center gap-2.5 px-3 py-2 text-[13px] text-admin-text rounded-lg cursor-pointer outline-none hover:bg-admin-muted focus:bg-admin-muted transition-colors duration-150"
                  onClick={() => router.push('/admin/settings')}
                >
                  <User className="w-4 h-4 text-admin-text-secondary" />
                  Profil
                </DropdownMenu.Item>
                <DropdownMenu.Separator className="h-px bg-admin-border my-1 mx-2" />
                <DropdownMenu.Item
                  className="flex items-center gap-2.5 px-3 py-2 text-[13px] text-red-400 rounded-lg cursor-pointer outline-none hover:bg-red-500/10 focus:bg-red-500/10 transition-colors duration-150"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" />
                  Déconnexion
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>
    </header>
  );
}
