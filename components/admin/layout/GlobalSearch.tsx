'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  FileText,
  File,
  Users,
  Image as ImageIcon,
  Loader2,
  Clock,
  X,
  CornerDownLeft,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface SearchResults {
  posts: { id: string; title: string; status: string }[];
  pages: { id: string; title: string; status: string }[];
  users: { id: string; name: string; email: string; role: string }[];
  media: { id: string; name: string; type: string }[];
}

interface FlatItem {
  key: string;
  label: string;
  sublabel?: string;
  href: string;
  icon: LucideIcon;
}

interface Section {
  label: string;
  items: FlatItem[];
}

const RECENT_KEY = 'admin:search:recent';
const EMPTY: SearchResults = { posts: [], pages: [], users: [], media: [] };

export function GlobalSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResults>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Global shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Open / close lifecycle
  useEffect(() => {
    if (open) {
      try {
        setRecent(JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]'));
      } catch {
        setRecent([]);
      }
      const t = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
    setQuery('');
    setResults(EMPTY);
    setActiveIndex(0);
  }, [open]);

  // Debounced search
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults(EMPTY);
      setLoading(false);
      return;
    }
    setLoading(true);
    const t = setTimeout(() => {
      fetch(`/api/cms/search?q=${encodeURIComponent(query.trim())}`)
        .then((r) => (r.ok ? r.json() : EMPTY))
        .then((d) => {
          setResults(d);
          setActiveIndex(0);
        })
        .catch(() => setResults(EMPTY))
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  const sections: Section[] = [
    {
      label: 'Articles',
      items: results.posts.map((p) => ({
        key: `post-${p.id}`,
        label: p.title,
        sublabel: p.status,
        href: `/admin/blog/posts/${p.id}/edit`,
        icon: FileText,
      })),
    },
    {
      label: 'Pages',
      items: results.pages.map((p) => ({
        key: `page-${p.id}`,
        label: p.title,
        sublabel: p.status,
        href: `/admin/pages/${p.id}/edit`,
        icon: File,
      })),
    },
    {
      label: 'Utilisateurs',
      items: results.users.map((u) => ({
        key: `user-${u.id}`,
        label: u.name,
        sublabel: u.email,
        href: '/admin/users',
        icon: Users,
      })),
    },
    {
      label: 'Médias',
      items: results.media.map((m) => ({
        key: `media-${m.id}`,
        label: m.name,
        sublabel: m.type,
        href: '/admin/media',
        icon: ImageIcon,
      })),
    },
  ].filter((s) => s.items.length > 0);

  const flatItems: FlatItem[] = sections.flatMap((s) => s.items);

  const saveRecent = (q: string) => {
    if (!q) return;
    const list = [q, ...recent.filter((r) => r !== q)].slice(0, 8);
    localStorage.setItem(RECENT_KEY, JSON.stringify(list));
    setRecent(list);
  };

  const clearRecent = () => {
    localStorage.removeItem(RECENT_KEY);
    setRecent([]);
  };

  const go = (item: FlatItem) => {
    saveRecent(query.trim());
    setOpen(false);
    router.push(item.href);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, flatItems.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && flatItems[activeIndex]) {
      e.preventDefault();
      go(flatItems[activeIndex]);
    }
  };

  let runningIndex = -1;

  return (
    <>
      {/* Trigger styled like a search input */}
      <button
        onClick={() => setOpen(true)}
        className="hidden sm:flex items-center gap-2 flex-1 max-w-xs lg:max-w-sm h-9 pl-3 pr-2 bg-admin-muted/60 border border-transparent rounded-full text-sm text-admin-text-muted hover:bg-admin-muted hover:border-admin-border transition-all duration-200"
      >
        <Search className="w-4 h-4 shrink-0" />
        <span className="flex-1 text-left truncate">Rechercher...</span>
        <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium text-admin-text-muted bg-admin-card border border-admin-border rounded-md font-mono">
          ⌘K
        </kbd>
      </button>
      {/* Mobile trigger */}
      <button
        onClick={() => setOpen(true)}
        className="sm:hidden flex items-center justify-center w-9 h-9 rounded-lg text-admin-text-secondary hover:text-admin-text hover:bg-admin-muted transition-all duration-200"
        aria-label="Rechercher"
      >
        <Search className="w-[18px] h-[18px]" />
      </button>

      {/* Palette */}
      {open && (
        <div className="fixed inset-0 z-[90]">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative max-w-xl mx-auto mt-[12vh] px-4">
            <div className="bg-admin-card border border-admin-border rounded-2xl shadow-2xl shadow-black/40 overflow-hidden">
              {/* Input */}
              <div className="flex items-center gap-3 px-4 border-b border-admin-border">
                {loading ? (
                  <Loader2 className="w-4 h-4 text-amber-400 animate-spin shrink-0" />
                ) : (
                  <Search className="w-4 h-4 text-admin-text-muted shrink-0" />
                )}
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Rechercher articles, pages, utilisateurs, médias..."
                  className="flex-1 h-12 bg-transparent text-sm text-admin-text placeholder:text-admin-text-muted focus:outline-none"
                />
                <button
                  onClick={() => setOpen(false)}
                  className="text-admin-text-muted hover:text-admin-text transition-colors"
                  aria-label="Fermer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="max-h-[50vh] overflow-y-auto p-2">
                {query.trim().length < 2 ? (
                  recent.length > 0 ? (
                    <div>
                      <div className="flex items-center justify-between px-3 py-1.5">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-admin-text-muted">
                          Recherches récentes
                        </p>
                        <button
                          onClick={clearRecent}
                          className="text-[11px] text-amber-400 hover:text-amber-300 font-medium transition-colors"
                        >
                          Effacer
                        </button>
                      </div>
                      {recent.map((r) => (
                        <button
                          key={r}
                          onClick={() => setQuery(r)}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-admin-text-secondary hover:bg-admin-muted hover:text-admin-text transition-colors text-left"
                        >
                          <Clock className="w-3.5 h-3.5 shrink-0" />
                          {r}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="px-3 py-6 text-center text-sm text-admin-text-muted">
                      Tapez au moins 2 caractères pour rechercher
                    </p>
                  )
                ) : flatItems.length === 0 && !loading ? (
                  <p className="px-3 py-6 text-center text-sm text-admin-text-muted">
                    Aucun résultat pour « {query} »
                  </p>
                ) : (
                  sections.map((section) => (
                    <div key={section.label} className="mb-1">
                      <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-admin-text-muted">
                        {section.label}
                      </p>
                      {section.items.map((item) => {
                        runningIndex++;
                        const idx = runningIndex;
                        const isActive = idx === activeIndex;
                        return (
                          <button
                            key={item.key}
                            onClick={() => go(item)}
                            onMouseEnter={() => setActiveIndex(idx)}
                            className={cn(
                              'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-left',
                              isActive ? 'bg-amber-500/10 text-amber-400' : 'text-admin-text hover:bg-admin-muted'
                            )}
                          >
                            <item.icon className="w-4 h-4 shrink-0 opacity-70" />
                            <span className="flex-1 truncate">{item.label}</span>
                            {item.sublabel && (
                              <span className="text-[11px] text-admin-text-muted truncate max-w-[140px]">
                                {item.sublabel}
                              </span>
                            )}
                            {isActive && <CornerDownLeft className="w-3.5 h-3.5 shrink-0 opacity-60" />}
                          </button>
                        );
                      })}
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center gap-4 px-4 py-2 border-t border-admin-border text-[11px] text-admin-text-muted">
                <span>↑↓ naviguer</span>
                <span>↵ ouvrir</span>
                <span>esc fermer</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
