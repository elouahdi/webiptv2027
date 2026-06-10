'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Image as ImageIcon,
  File,
  Users,
  Search,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Globe,
  DollarSign,
  Layout,
  Tv,
  Phone,
  Bell,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  {
    name: 'Blog',
    href: '/admin/blog',
    icon: FileText,
    children: [
      { name: 'Articles', href: '/admin/blog/posts' },
      { name: 'Catégories', href: '/admin/blog/categories' },
      { name: 'Tags', href: '/admin/blog/tags' },
    ],
  },
  { name: 'Médias', href: '/admin/media', icon: ImageIcon },
  { name: 'Pages', href: '/admin/pages', icon: File },
  {
    name: 'Site',
    href: '/admin/site',
    icon: Globe,
    children: [
      { name: '💰 Tarifs & Prix', href: '/admin/site/pricing', icon: DollarSign },
      { name: '📝 Contenu', href: '/admin/site/content', icon: Layout },
      { name: '📺 Packages IPTV', href: '/admin/site/iptv', icon: Tv },
      { name: '🔍 SEO & Meta', href: '/admin/site/seo', icon: Search },
      { name: '📞 Contact', href: '/admin/site/contact', icon: Phone },
      { name: '📢 Annonces', href: '/admin/site/announcement', icon: Bell },
    ],
  },
  { name: 'Utilisateurs', href: '/admin/users', icon: Users },
  { name: 'Sports', href: '/admin/sports', icon: Trophy },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'SEO', href: '/admin/seo', icon: Search },
  { name: 'Paramètres', href: '/admin/settings', icon: Settings },
];

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function AdminSidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['Blog', 'Site']);

  const toggleGroup = (name: string) => {
    setExpandedGroups((prev) =>
      prev.includes(name) ? prev.filter((g) => g !== name) : [...prev, name]
    );
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-full bg-admin-sidebar border-r border-admin-border transition-all duration-300 z-40 flex flex-col',
        collapsed ? 'w-[80px]' : 'w-[260px]',
        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}
    >
      <div className="p-[16px] px-[20px] border-b border-admin-border">
        <Link href="/admin" className="flex items-center gap-3" onClick={onMobileClose}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-from to-brand-to flex items-center justify-center flex-shrink-0 shadow-lg shadow-brand-from/20">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div>
              <span className="font-syne font-bold text-lg text-admin-text block">RegardezIPTV</span>
              <span className="text-xs text-admin-text-muted">Administration</span>
            </div>
          )}
        </Link>
      </div>

      <nav className="flex-1 p-[12px] space-y-[6px] overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const isExpanded = expandedGroups.includes(item.name);

          if (item.children) {
            return (
              <div key={item.name}>
                <button
                  onClick={() => !collapsed && toggleGroup(item.name)}
                  className={cn(
                    'w-full flex items-center gap-3 py-[10px] rounded-lg text-sm font-medium transition-all',
                    collapsed ? 'justify-center px-0' : 'px-[12px]',
                    isActive
                      ? 'bg-amber-500/10 text-amber-400'
                      : 'text-admin-text-secondary hover:text-admin-text hover:bg-admin-muted'
                  )}
                  title={collapsed ? item.name : undefined}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left">{item.name}</span>
                      <ChevronDown
                        className={cn('w-4 h-4 transition-transform', isExpanded && 'rotate-180')}
                      />
                    </>
                  )}
                </button>
                {!collapsed && isExpanded && (
                  <div className="ml-[16px] mt-[4px] space-y-[4px] border-l border-admin-border pl-[16px]">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={onMobileClose}
                        className={cn(
                          'block px-[12px] py-[8px] rounded-lg text-sm transition-colors',
                          pathname === child.href
                            ? 'bg-amber-500/10 text-amber-400 font-medium'
                            : 'text-admin-text-secondary hover:text-admin-text hover:bg-admin-muted'
                        )}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onMobileClose}
              className={cn(
                'flex items-center gap-3 py-[10px] rounded-lg text-sm font-medium transition-all',
                collapsed ? 'justify-center px-0' : 'px-[12px]',
                isActive
                  ? 'bg-amber-500/10 text-amber-400'
                  : 'text-admin-text-secondary hover:text-admin-text hover:bg-admin-muted'
              )}
              title={collapsed ? item.name : undefined}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-[12px] border-t border-admin-border">
        <button
          onClick={onToggle}
          className="w-full hidden lg:flex items-center justify-center gap-2 px-[12px] py-[8px] rounded-lg text-admin-text-secondary hover:text-admin-text hover:bg-admin-muted transition-colors"
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>
    </aside>
  );
}
