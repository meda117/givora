'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Bell, Globe, ExternalLink, ChevronDown, LogOut, ShieldCheck } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import { ThemeSwitcher } from '@/components/shared/theme-switcher';
import type { Locale, AdminRole } from '@/types';

export function AdminHeader({ locale }: { locale: Locale }) {
  const isAr = locale === 'ar';
  const router = useRouter();
  const pathname = usePathname();
  const otherLocale = locale === 'ar' ? 'en' : 'ar';
  const switchPath = pathname.replace(`/${locale}/`, `/${otherLocale}/`);

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<{ email: string; role: AdminRole } | null>(null);

  useEffect(() => {
    fetch('/api/admin/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.authenticated && data.user) {
          setAdminUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  const handleSignOut = async () => {
    try {
      setUserMenuOpen(false);
      await fetch('/api/admin/auth/logout', { method: 'POST' });
      await signOut(auth);
      router.push(`/${locale}/admin/login`);
      router.refresh();
    } catch (err) {
      console.error('Sign out error:', err);
      router.push(`/${locale}/admin/login`);
    }
  };

  const displayEmail = adminUser?.email || 'admin@givora.com';
  const displayRole = adminUser?.role || 'super_admin';
  const initial = displayEmail.charAt(0).toUpperCase();

  return (
    <header className="h-14 bg-[var(--card-bg)] border-b border-[var(--border-color)] flex items-center justify-between px-6 gap-4 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <span className="text-xs font-medium text-[var(--text-secondary)] hidden sm:inline-block">
          {isAr ? 'لوحة تحكم متجر جيفورا' : 'Givora Administration'}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {/* Store link */}
        <Link
          href={`/${locale}`}
          target="_blank"
          className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-main)] transition-colors px-3 py-1.5 rounded-sm hover:bg-[var(--bg-secondary)] border border-[var(--border-color)]"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          <span className="hidden md:inline">{isAr ? 'زيارة المتجر' : 'Visit Store'}</span>
        </Link>

        {/* Theme Switcher */}
        <ThemeSwitcher />

        {/* Language switcher */}
        <Link
          href={switchPath}
          className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-main)] transition-colors px-2.5 py-1.5 rounded-sm hover:bg-[var(--bg-secondary)] border border-[var(--border-color)]"
        >
          <Globe className="h-3.5 w-3.5" />
          <span>{otherLocale === 'ar' ? 'عربي' : 'EN'}</span>
        </Link>

        {/* Notifications */}
        <button
          className="relative p-2 text-[var(--text-secondary)] hover:text-[var(--text-main)] transition-colors rounded-sm hover:bg-[var(--bg-secondary)] border border-[var(--border-color)]"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1 end-1 w-2 h-2 rounded-full bg-emerald-500" />
        </button>

        {/* Admin user menu */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 px-2.5 py-1 rounded-sm hover:bg-[var(--bg-secondary)] border border-[var(--border-color)] transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-[var(--text-main)] text-[var(--bg-main)] flex items-center justify-center font-mono text-xs font-bold">
              {initial}
            </div>
            <div className="text-start hidden sm:block">
              <span className="text-xs font-medium text-[var(--text-main)] block leading-tight max-w-[120px] truncate">
                {displayEmail.split('@')[0]}
              </span>
              <span className="text-[10px] text-[var(--text-secondary)] block capitalize">
                {displayRole.replace('_', ' ')}
              </span>
            </div>
            <ChevronDown className="h-3 w-3 text-[var(--text-secondary)]" />
          </button>

          {userMenuOpen && (
            <div className="absolute end-0 mt-1.5 w-56 rounded-sm bg-[var(--card-bg)] border border-[var(--border-color)] shadow-xl p-1 z-50 text-xs">
              <div className="px-3 py-2 border-b border-[var(--border-color)] mb-1">
                <p className="font-semibold text-[var(--text-main)]">Givora Administrator</p>
                <p className="text-[11px] text-[var(--text-secondary)] truncate">{displayEmail}</p>
                <span className="inline-block mt-1 text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[var(--bg-secondary)] text-[var(--text-secondary)]">
                  {displayRole}
                </span>
              </div>

              <Link
                href={`/${locale}/admin/users`}
                onClick={() => setUserMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-1.5 rounded text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-[var(--bg-secondary)] transition-colors"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>{isAr ? 'إدارة الصلاحيات' : 'Manage Permissions'}</span>
              </Link>

              <button
                type="button"
                onClick={handleSignOut}
                className="w-full text-start flex items-center gap-2 px-3 py-1.5 rounded text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors mt-1 pt-1 border-t border-[var(--border-color)]"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>{isAr ? 'تسجيل الخروج' : 'Sign Out'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
