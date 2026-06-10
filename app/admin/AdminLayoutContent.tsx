'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/layout/AdminSidebar';
import { AdminHeader } from '@/components/admin/layout/AdminHeader';
import { ToastProvider } from '@/components/admin/ui/Toast';

export default function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <ToastProvider>
      <div className="admin-panel dark:dark light:light min-h-screen">
        <AdminSidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          mobileOpen={mobileMenuOpen}
          onMobileClose={() => setMobileMenuOpen(false)}
        />

        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        <div
          className={`transition-all duration-300 ${
            sidebarCollapsed ? 'lg:ml-[80px]' : 'lg:ml-[260px]'
          }`}
        >
          <AdminHeader
            onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            mobileMenuOpen={mobileMenuOpen}
            sidebarCollapsed={sidebarCollapsed}
          />
          <main className="p-16 lg:p-24 bg-admin-bg min-h-[calc(100vh-64px)]">{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
}
