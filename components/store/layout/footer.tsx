'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageCircle } from 'lucide-react';
import { GivoraLogo } from '@/components/shared/givora-logo';
import { useTranslations } from 'next-intl';

export function StoreFooter() {
  const t = useTranslations();
  const pathname = usePathname();
  const locale = pathname.startsWith('/en') ? 'en' : 'ar';

  return (
    <footer className="bg-black text-neutral-300 dark:bg-[#0A0A0A] dark:text-neutral-400 mt-24 border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <span
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontWeight: 600,
                  letterSpacing: '0.22em',
                  fontSize: '1.4em',
                  lineHeight: 1,
                }}
                className="text-white tracking-widest"
              >
                GIVORA
              </span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-xs">
              {t('home.heroSubtitle')}
            </p>
            <div className="flex gap-2.5 mt-6">
              <a
                href="https://wa.me/201001234567"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-sm border border-neutral-800 text-neutral-400 hover:border-neutral-600 hover:text-white transition-colors"
                aria-label="Contact WhatsApp"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-xs font-semibold text-white mb-4 tracking-wider uppercase">
              {t('nav.home')}
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href={`/${locale}/gift-boxes`} className="hover:text-white transition-colors">
                  {t('nav.giftBoxes')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/trending-gifts`} className="hover:text-white transition-colors">
                  {t('nav.trendingGifts')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-xs font-semibold text-white mb-4 tracking-wider uppercase">
              {t('account.title')}
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href={`/${locale}/account`} className="hover:text-white transition-colors">
                  {t('account.orders')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/account/wishlist`} className="hover:text-white transition-colors">
                  {t('account.wishlist')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal / Policy */}
          <div>
            <h4 className="text-xs font-semibold text-white mb-4 tracking-wider uppercase">
              {t('pages.about')}
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href={`/${locale}/about`} className="hover:text-white transition-colors">
                  {t('pages.about')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/contact`} className="hover:text-white transition-colors">
                  {t('pages.contact')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/shipping`} className="hover:text-white transition-colors">
                  {t('pages.shipping')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/privacy`} className="hover:text-white transition-colors">
                  {t('pages.privacy')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-900 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>
            &copy; {new Date().getFullYear()} Givora. {t('footer.rights')}.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-[11px] text-neutral-600">Givora Luxury Gift Platform</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
