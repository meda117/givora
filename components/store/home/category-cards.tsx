'use client';
import Link from 'next/link';
import { ArrowRight, Gift, Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { Locale } from '@/types';

export function CategoryCards({ locale }: { locale: Locale }) {
  const t = useTranslations('home');

  const categories = [
    {
      id: 'gift-boxes',
      icon: Gift,
      title: t('categoryGiftBoxes'),
      desc: t('categoryGiftBoxesDesc'),
      href: `/${locale}/gift-boxes`,
      badge: locale === 'ar' ? 'الأكثر طلباً' : 'Curated',
    },
    {
      id: 'trending-gifts',
      icon: Sparkles,
      title: t('categoryTrending'),
      desc: t('categoryTrendingDesc'),
      href: `/${locale}/trending-gifts`,
      badge: locale === 'ar' ? 'تخصيص بالاسم' : 'Personalized',
    },
  ];

  return (
    <div>
      <div className="text-center max-w-xl mx-auto mb-10">
        <h2
          className="text-3xl md:text-4xl font-light text-neutral-950 dark:text-white mb-2"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          {locale === 'ar' ? 'أقسام الهدايا' : 'Gift Collections'}
        </h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          {locale === 'ar' ? 'اختار الفئة المناسبة لهديتك وخلي الباقي علينا' : 'Explore our signature physical gift collections'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <Link
              key={cat.id}
              href={cat.href}
              className="group relative overflow-hidden rounded-sm p-8 sm:p-10 border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#151515] hover:border-black dark:hover:border-white transition-all duration-200 flex flex-col justify-between min-h-[260px]"
            >
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-sm bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-neutral-900 dark:text-white group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-[11px] font-semibold tracking-wider uppercase text-neutral-500 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800 px-2.5 py-1 rounded-xs">
                  {cat.badge}
                </span>
              </div>

              <div className="mt-8 space-y-2">
                <h3
                  className="text-2xl sm:text-3xl font-light text-neutral-950 dark:text-white group-hover:translate-x-0.5 transition-transform"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  {cat.title}
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 max-w-md leading-relaxed">
                  {cat.desc}
                </p>
                <div className="pt-3 inline-flex items-center gap-2 text-xs font-semibold text-neutral-900 dark:text-white">
                  <span>{locale === 'ar' ? 'اتسوق دلوقتي' : 'Shop Now'}</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 rtl:rotate-180 transition-transform" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
