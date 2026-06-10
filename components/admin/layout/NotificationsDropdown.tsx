'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bell, FileText, File, Image as ImageIcon, CheckCheck } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

interface ActivityItem {
  id: string;
  type: 'post' | 'page' | 'media';
  title: string;
  date: string;
  meta: string;
}

const LAST_READ_KEY = 'admin:notifications:lastRead';

const TYPE_ICONS = { post: FileText, page: File, media: ImageIcon } as const;
const TYPE_LABELS = { post: 'Article', page: 'Page', media: 'Média' } as const;
const TYPE_LINKS = { post: '/admin/blog/posts', page: '/admin/pages', media: '/admin/media' } as const;

export function NotificationsDropdown() {
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [lastRead, setLastRead] = useState<number>(0);

  useEffect(() => {
    setLastRead(Number(localStorage.getItem(LAST_READ_KEY) ?? 0));
    fetch('/api/cms/dashboard/stats')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => data && setItems(data.activity ?? []))
      .catch(() => {});
  }, []);

  const unreadCount = items.filter((i) => new Date(i.date).getTime() > lastRead).length;

  const markAllRead = () => {
    const now = Date.now();
    localStorage.setItem(LAST_READ_KEY, String(now));
    setLastRead(now);
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="relative flex items-center justify-center w-9 h-9 rounded-lg text-admin-text-secondary hover:text-admin-text hover:bg-admin-muted transition-all duration-200 outline-none"
          aria-label="Notifications"
        >
          <Bell className="w-[18px] h-[18px]" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-[10px] font-bold text-white bg-amber-500 rounded-full ring-2 ring-admin-card">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="w-[340px] bg-admin-card border border-admin-border rounded-xl shadow-2xl shadow-black/20 z-50 overflow-hidden"
          sideOffset={8}
          align="end"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-admin-border">
            <p className="text-sm font-semibold text-admin-text">Notifications</p>
            <button
              onClick={markAllRead}
              className="inline-flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 transition-colors font-medium"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Tout marquer comme lu
            </button>
          </div>
          <div className="max-h-[320px] overflow-y-auto">
            {items.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-admin-text-muted">Aucune notification</p>
            ) : (
              items.map((item) => {
                const Icon = TYPE_ICONS[item.type];
                const isUnread = new Date(item.date).getTime() > lastRead;
                return (
                  <DropdownMenu.Item key={item.id} asChild>
                    <Link
                      href={TYPE_LINKS[item.type]}
                      className="flex items-start gap-3 px-4 py-3 hover:bg-admin-muted focus:bg-admin-muted outline-none cursor-pointer transition-colors border-b border-admin-border/40 last:border-0"
                    >
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className="w-4 h-4 text-amber-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] text-admin-text truncate font-medium">{item.title}</p>
                        <p className="text-[11px] text-admin-text-muted mt-0.5">
                          {TYPE_LABELS[item.type]} ·{' '}
                          {new Date(item.date).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      {isUnread && <span className="w-2 h-2 bg-amber-500 rounded-full shrink-0 mt-2" />}
                    </Link>
                  </DropdownMenu.Item>
                );
              })
            )}
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
