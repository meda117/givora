'use client';
import Link from 'next/link';
import { Heart, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { ProductCard } from '@/components/store/product/product-card';
import type { Locale, Product } from '@/types';

const MOCK_WISHLIST: Product[] = [
  {
    id: '1',
    slug: { ar: 'luxury-rose-box', en: 'luxury-rose-box', translationStatus: 'auto' },
    name: { ar: 'بوكس الورد الفاخر', en: 'Luxury Rose Box', translationStatus: 'auto' },
    description: { ar: 'مجموعة ورود فاخرة', en: 'Luxury rose collection', translationStatus: 'auto' },
    shortDescription: { ar: 'مجموعة ورود فاخرة', en: 'Luxury rose collection', translationStatus: 'auto' },
    type: 'gift-box',
    status: 'published',
    categoryIds: ['gift-boxes'],
    mainCategory: 'gift-boxes',
    images: [],
    videos: [],
    basePrice: 299,
    discountedPrice: 249,
    currency: 'SAR',
    inventory: 15,
    trackInventory: true,
    allowBackorder: false,
    variants: [],
    badges: ['best_seller'],
    tags: ['roses'],
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
    relatedProductIds: [],
    ratings: { average: 4.8, count: 47, distribution: {} },
    seo: {},
    createdAt: '2026-10-01T00:00:00Z',
    updatedAt: '2026-11-01T00:00:00Z',
  },
];

export default function WishlistPage() {
  const locale: Locale = 'ar';
  const isAr = locale === 'ar';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <h1
        className="text-3xl font-light text-charcoal mb-8"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}
      >
        {isAr ? 'قائمة المفضلة' : 'My Wishlist'}
      </h1>

      {MOCK_WISHLIST.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {MOCK_WISHLIST.map(product => (
            <ProductCard key={product.id} product={product} locale={locale} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Heart className="h-8 w-8" />}
          title={isAr ? 'قائمة المفضلة فارغة' : 'Your wishlist is empty'}
          description={
            isAr
              ? 'احفظ هداياك المفضلة للعودة إليها لاحقاً'
              : 'Save your favorite gifts to purchase them later'
          }
          action={
            <Link href={`/${locale}`}>
              <Button>{isAr ? 'تصفح المتجر' : 'Browse Store'}</Button>
            </Link>
          }
        />
      )}
    </div>
  );
}
