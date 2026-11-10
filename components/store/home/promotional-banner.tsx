import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Locale } from '@/types';

export function PromotionalBanner({ locale }: { locale: Locale }) {
  return (
    <section className="bg-black text-white dark:bg-[#0A0A0A] py-20 px-4 sm:px-6 relative border-y border-neutral-900">
      <div className="relative max-w-4xl mx-auto text-center space-y-6">
        <span className="text-[11px] font-semibold tracking-widest uppercase text-neutral-400">
          {locale === 'ar' ? 'إحساس مختلف' : 'Exclusive Experience'}
        </span>
        <h2
          className="text-3xl sm:text-4xl md:text-5xl font-light text-white leading-tight"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          {locale === 'ar'
            ? 'مش مجرد هدية.. دي لحظة هتفضل فاكرها'
            : 'More than a gift — an unforgettable memory'}
        </h2>
        <p className="text-neutral-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          {locale === 'ar'
            ? 'صمم بوكس هديتك على ذوقك باختيار المحتويات وكارت الإهداء المخصص وخلي المفاجأة علينا.'
            : 'Curate your custom gift box with personalized contents and let us deliver the moment.'}
        </p>
        <div className="pt-2">
          <Link
            href={`/${locale}/gift-boxes`}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-black hover:bg-neutral-200 transition-colors text-xs font-semibold tracking-widest uppercase rounded-xs"
          >
            <span>{locale === 'ar' ? 'صمم البوكس دلوقتي' : 'Design Your Box'}</span>
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </div>
      </div>
    </section>
  );
}
