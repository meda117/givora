'use client';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ArrowRight, Gift, Truck, SlidersHorizontal, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Locale } from '@/types';

interface HeroBannerProps {
  locale: Locale;
}

export function HeroBanner({ locale }: HeroBannerProps) {
  const t = useTranslations('home');

  return (
    <section className="relative overflow-hidden bg-white dark:bg-[#111111] border-b border-neutral-200 dark:border-neutral-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Main Copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-xs border border-neutral-200 dark:border-neutral-700">
              <span className="text-[11px] font-semibold text-neutral-800 dark:text-neutral-200 tracking-widest uppercase">
                {locale === 'ar' ? 'تشكيلة 2026 الحصرية' : 'Exclusive 2026 Collection'}
              </span>
            </div>

            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-light text-neutral-950 dark:text-white leading-[1.15]"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              {t('heroTitle')}
            </h1>

            <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-xl">
              {t('heroSubtitle')}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link href={`/${locale}/gift-boxes`}>
                <Button size="lg" variant="primary" className="tracking-wider">
                  {t('heroCta')}
                </Button>
              </Link>
              <Link href={`/${locale}/trending-gifts`}>
                <Button size="lg" variant="outline" rightIcon={<ArrowRight className="h-4 w-4 rtl:rotate-180" />}>
                  {t('heroCtaSecondary')}
                </Button>
              </Link>
            </div>

            {/* Value Propositions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2.5">
                <Gift className="h-4 w-4 text-neutral-900 dark:text-white flex-shrink-0" />
                <span className="text-xs text-neutral-600 dark:text-neutral-400">
                  {locale === 'ar' ? 'تغليف هدايا فاخر' : 'Luxury Packaging'}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Truck className="h-4 w-4 text-neutral-900 dark:text-white flex-shrink-0" />
                <span className="text-xs text-neutral-600 dark:text-neutral-400">
                  {locale === 'ar' ? 'توصيل لمحافظات مصر' : 'Fast Egypt Delivery'}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <SlidersHorizontal className="h-4 w-4 text-neutral-900 dark:text-white flex-shrink-0" />
                <span className="text-xs text-neutral-600 dark:text-neutral-400">
                  {locale === 'ar' ? 'تخصيص بالاسم والصور' : 'Custom Names & Prints'}
                </span>
              </div>
            </div>
          </div>

          {/* Hero Visual Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-sm bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-8 flex flex-col justify-between aspect-[4/5]">
              <div className="space-y-2">
                <span className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 dark:text-neutral-500">
                  {locale === 'ar' ? 'بوكس الهدايا المتكامل' : 'Curated Box Collection'}
                </span>
                <h3
                  className="text-2xl font-light text-neutral-900 dark:text-white"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  {locale === 'ar' ? 'بوكس اللحظات الخاصة' : 'The Signature Gift Box'}
                </h3>
              </div>

              {/* Minimal SVG Graphic Placeholder */}
              <div className="my-auto flex flex-col items-center justify-center text-center p-6">
                <div className="w-20 h-20 rounded-full border border-neutral-300 dark:border-neutral-700 flex items-center justify-center mb-4 text-neutral-900 dark:text-white">
                  <Gift className="h-8 w-8 stroke-[1.25]" />
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-xs">
                  {locale === 'ar'
                    ? 'اختار محتويات البوكس أو ضيف منتجات من المتجر مع كارت مخصص باسم اللي بتحبه'
                    : 'Personalize every item in your box with curated products and custom cards'}
                </p>
              </div>

              {/* Bottom Feature Card */}
              <div className="bg-white dark:bg-[#1A1A1A] border border-neutral-200 dark:border-neutral-800 rounded-sm p-4 flex items-center justify-between shadow-xs">
                <div>
                  <p className="text-xs font-semibold text-neutral-900 dark:text-white">
                    {locale === 'ar' ? 'يبدأ من 650 ج.م' : 'Starting from 650 EGP'}
                  </p>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    {locale === 'ar' ? 'شحن فوري داخل القاهرة والجيزة' : 'Same-day dispatch in Cairo'}
                  </p>
                </div>
                <Link
                  href={`/${locale}/gift-boxes`}
                  className="text-xs font-semibold underline text-neutral-900 dark:text-white hover:opacity-75"
                >
                  {locale === 'ar' ? 'استكشف' : 'Explore'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
