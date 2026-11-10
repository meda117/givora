'use client';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search as SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ProductCard } from '@/components/store/product/product-card';
import { EmptyState } from '@/components/ui/empty-state';
import type { Locale, Product } from '@/types';

const ALL_MOCK_PRODUCTS: Product[] = [
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
    basePrice: 650,
    discountedPrice: 550,
    currency: 'EGP',
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
  {
    id: '2',
    slug: { ar: 'personalized-name-necklace', en: 'personalized-name-necklace', translationStatus: 'auto' },
    name: { ar: 'سلسلة اسم بالفضة الإيطالي', en: 'Personalized Silver Name Necklace', translationStatus: 'auto' },
    description: { ar: 'سلسلة فضة عيار 925 مطلية دهب ومحفورة بالاسم', en: 'Gold-plated necklace with custom name engraving', translationStatus: 'auto' },
    shortDescription: { ar: 'سلسلة مميزة بالاسم', en: 'Custom name necklace', translationStatus: 'auto' },
    type: 'physical',
    status: 'published',
    categoryIds: ['trending-gifts'],
    mainCategory: 'trending-gifts',
    images: [],
    videos: [],
    basePrice: 350,
    currency: 'EGP',
    inventory: 32,
    trackInventory: true,
    allowBackorder: false,
    variants: [],
    badges: ['new'],
    tags: ['necklace'],
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    relatedProductIds: [],
    ratings: { average: 4.7, count: 89, distribution: {} },
    seo: {},
    createdAt: '2026-10-01T00:00:00Z',
    updatedAt: '2026-11-01T00:00:00Z',
  },
  {
    id: '3',
    slug: { ar: 'custom-printed-acrylic-portrait', en: 'custom-printed-acrylic-portrait', translationStatus: 'auto' },
    name: { ar: 'بورتريه أكريليك مطبوع بستاند مضيء', en: 'Custom Printed Acrylic Portrait', translationStatus: 'auto' },
    description: { ar: 'بورتريه أكريليك عالي الدقة بإضاءة ليد دافئة وقاعدة خشبية فاخرة', en: 'High definition acrylic portrait with warm LED light and wood base', translationStatus: 'auto' },
    shortDescription: { ar: 'طباعة ذكرياتك بأعلى جودة', en: 'Print your memories in highest fidelity', translationStatus: 'auto' },
    type: 'printed',
    status: 'published',
    categoryIds: ['trending-gifts'],
    mainCategory: 'trending-gifts',
    images: [],
    videos: [],
    basePrice: 380,
    currency: 'EGP',
    inventory: 50,
    trackInventory: true,
    allowBackorder: false,
    variants: [],
    badges: ['featured'],
    tags: ['printed', 'portrait', 'custom'],
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
    relatedProductIds: [],
    ratings: { average: 5.0, count: 64, distribution: {} },
    seo: {},
    createdAt: '2026-10-01T00:00:00Z',
    updatedAt: '2026-11-01T00:00:00Z',
  },
];

export default function SearchPage({ params }: { params: { locale?: string } }) {
  const isAr = true;
  const locale: Locale = 'ar';
  const [query, setQuery] = useState('');

  const filtered = query.trim()
    ? ALL_MOCK_PRODUCTS.filter(p =>
        p.name.ar.toLowerCase().includes(query.toLowerCase()) ||
        p.name.en.toLowerCase().includes(query.toLowerCase())
      )
    : ALL_MOCK_PRODUCTS;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="max-w-xl mx-auto mb-10">
        <h1
          className="text-3xl font-light text-charcoal text-center mb-6"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          {locale === 'ar' ? 'البحث عن الهدايا' : 'Search Gifts'}
        </h1>
        <Input
          placeholder={locale === 'ar' ? 'اكتب اسم المنتج أو الهدية...' : 'Search for gifts...'}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          leftElement={<SearchIcon className="h-4 w-4" />}
          autoFocus
        />
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} locale={locale} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<SearchIcon className="h-8 w-8" />}
          title={locale === 'ar' ? 'لم يتم العثور على نتائج' : 'No results found'}
          description={
            locale === 'ar'
              ? 'جرّب البحث بكلمات أخرى أو تصفح الأقسام الرئيسية'
              : 'Try different search keywords or browse our main categories'
          }
        />
      )}
    </div>
  );
}
