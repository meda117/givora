import { getTranslations } from 'next-intl/server';
import { HeroBanner } from '@/components/store/home/hero-banner';
import { CategoryCards } from '@/components/store/home/category-cards';
import { ProductSection } from '@/components/store/home/product-section';
import { PromotionalBanner } from '@/components/store/home/promotional-banner';
import { TestimonialsSection } from '@/components/store/home/testimonials';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });

  return (
    <div className="space-y-4">
      {/* 1. Hero Banner */}
      <HeroBanner locale={locale as 'ar' | 'en'} />

      {/* 2. Two Clear Main Shopping Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <CategoryCards locale={locale as 'ar' | 'en'} />
      </section>

      {/* 3. Featured & Trending Gifts */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <ProductSection
          title={t('trendingTitle')}
          source="trending"
          locale={locale as 'ar' | 'en'}
          mainCategory="trending-gifts"
        />
      </section>

      {/* 4. Best Sellers Gift Boxes */}
      <section className="bg-neutral-50 dark:bg-[#151515] py-16 border-y border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <ProductSection
            title={t('bestSellersTitle')}
            source="best_sellers"
            locale={locale as 'ar' | 'en'}
            mainCategory="gift-boxes"
          />
        </div>
      </section>

      {/* 5. Promotional Experience Banner */}
      <PromotionalBanner locale={locale as 'ar' | 'en'} />

      {/* 6. Customer Testimonials */}
      <TestimonialsSection locale={locale as 'ar' | 'en'} />
    </div>
  );
}
