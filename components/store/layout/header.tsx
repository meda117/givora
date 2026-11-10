'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, ShoppingBag, Heart, User, Menu, X, Globe } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { GivoraLogo } from '@/components/shared/givora-logo';
import { ThemeSwitcher } from '@/components/shared/theme-switcher';
import { cn } from '@/lib/utils';

export function StoreHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations('nav');

  // Detect current locale from pathname
  const locale = pathname.startsWith('/en') ? 'en' : 'ar';
  const otherLocale = locale === 'ar' ? 'en' : 'ar';
  const switchLocalePath = pathname.replace(`/${locale}`, `/${otherLocale}`);

  const navLinks = [
    { href: `/${locale}`, label: t('home') },
    { href: `/${locale}/gift-boxes`, label: t('giftBoxes') },
    { href: `/${locale}/trending-gifts`, label: t('trendingGifts') },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#111111]/95 backdrop-blur-sm border-b border-neutral-200 dark:border-neutral-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center h-16 md:h-20 gap-4">
          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* Logo */}
          <Link href={`/${locale}`} className="flex-shrink-0">
            <GivoraLogo className="h-8 md:h-10" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2 mx-auto">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-4 py-2 text-xs font-semibold tracking-wider uppercase transition-colors rounded-xs',
                  pathname === link.href || (link.href !== `/${locale}` && pathname.startsWith(link.href))
                    ? 'text-black dark:text-white font-bold border-b border-black dark:border-white'
                    : 'text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1.5 ms-auto">
            {/* Theme switcher */}
            <ThemeSwitcher />

            {/* Language switcher */}
            <Link
              href={switchLocalePath}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors rounded-sm"
              title="Change language"
            >
              <Globe className="h-4 w-4" />
              <span>{otherLocale === 'ar' ? 'عربي' : 'EN'}</span>
            </Link>

            {/* Search */}
            <Link
              href={`/${locale}/search`}
              className="p-2 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors rounded-sm"
              aria-label={t('search')}
            >
              <Search className="h-4 w-4" />
            </Link>

            {/* Wishlist */}
            <Link
              href={`/${locale}/account/wishlist`}
              className="p-2 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors rounded-sm"
              aria-label={t('wishlist')}
            >
              <Heart className="h-4 w-4" />
            </Link>

            {/* Account */}
            <Link
              href={`/${locale}/account`}
              className="p-2 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors rounded-sm"
              aria-label={t('account')}
            >
              <User className="h-4 w-4" />
            </Link>

            {/* Cart */}
            <Link
              href={`/${locale}/cart`}
              className="relative p-2 text-neutral-900 dark:text-white hover:opacity-80 transition-opacity rounded-sm"
              aria-label={t('cart')}
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="absolute -top-0.5 -end-0.5 h-4 w-4 rounded-full bg-black text-white dark:bg-white dark:text-black text-[10px] font-bold flex items-center justify-center">
                0
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111111]">
          <nav className="flex flex-col px-4 py-3 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  'px-3 py-2.5 text-sm font-medium rounded-sm transition-colors',
                  pathname === link.href
                    ? 'bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white font-semibold'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900 hover:text-black dark:hover:text-white'
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={switchLocalePath}
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white rounded-sm"
            >
              <Globe className="h-4 w-4" />
              {otherLocale === 'ar' ? 'العربية' : 'English'}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
