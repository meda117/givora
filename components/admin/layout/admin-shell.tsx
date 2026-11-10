'use client';
import { usePathname } from 'next/navigation';
import { AdminSidebar } from './admin-sidebar';
import { AdminHeader } from './admin-header';
import type { Locale } from '@/types';

interface AdminShellProps {
  children: React.ReactNode;
  locale: Locale;
}

export function AdminShell({ children, locale }: AdminShellProps) {
  const pathname = usePathname();
  const isLoginPage = pathname.includes('/admin/login');

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] flex">
      <AdminSidebar locale={locale} />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader locale={locale} />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
