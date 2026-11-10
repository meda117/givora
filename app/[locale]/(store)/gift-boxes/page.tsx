import { CategoryPageClient } from '@/components/store/category/category-page-client';
import type { Product } from '@/types';

type Props = { params: Promise<{ locale: string }> };

const SUBCATEGORIES = [
  { id: 'women', name: { ar: 'بوكسات نسائية', en: "Women's Gift Boxes" } },
  { id: 'men', name: { ar: 'بوكسات رجالية', en: "Men's Gift Boxes" } },
  { id: 'couples', name: { ar: 'بوكسات العشاق', en: "Couples Gift Boxes" } },
  { id: 'custom', name: { ar: 'بوكسات مخصصة', en: 'Customized Gift Boxes' } },
];

const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    slug: { ar: 'luxury-rose-box', en: 'luxury-rose-box', translationStatus: 'auto' },
    name: { ar: 'بوكس الورد الفاخر', en: 'Luxury Rose Box', translationStatus: 'auto' },
    description: { ar: 'مجموعة ورود فاخرة', en: 'Luxury rose collection', translationStatus: 'auto' },
    shortDescription: { ar: 'مجموعة ورود فاخرة', en: 'Luxury rose collection', translationStatus: 'auto' },
    type: 'gift-box',
    status: 'published',
    categoryIds: ['women', 'gift-boxes'],
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
    badges: ['best_seller', 'sale'],
    tags: ['roses'],
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
    boxContents: [],
    relatedProductIds: [],
    ratings: { average: 4.8, count: 47, distribution: {} },
    seo: {},
    createdAt: '2026-10-01T00:00:00Z',
    updatedAt: '2026-11-01T00:00:00Z',
  },
  {
    id: '4',
    slug: { ar: 'couples-gift-box', en: 'couples-gift-box', translationStatus: 'auto' },
    name: { ar: 'بوكس الذكريات الرومانسي', en: "Romantic Memories Gift Box", translationStatus: 'auto' },
    description: { ar: 'هدية رومانسية متكاملة للأزواج', en: 'Perfect gift for couples', translationStatus: 'auto' },
    shortDescription: { ar: 'هدية رومانسية متكاملة للأزواج', en: 'Perfect gift for couples', translationStatus: 'auto' },
    type: 'gift-box',
    status: 'published',
    categoryIds: ['couples', 'gift-boxes'],
    mainCategory: 'gift-boxes',
    images: [],
    videos: [],
    basePrice: 850,
    discountedPrice: 720,
    currency: 'EGP',
    inventory: 8,
    trackInventory: true,
    allowBackorder: false,
    variants: [],
    badges: ['sale'],
    tags: ['couples'],
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
    boxContents: [],
    relatedProductIds: [],
    ratings: { average: 4.9, count: 24, distribution: {} },
    seo: {},
    createdAt: '2026-10-01T00:00:00Z',
    updatedAt: '2026-11-01T00:00:00Z',
  },
];

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return {
    title: locale === 'ar' ? 'بوكسات الهدايا | Givora' : 'Gift Boxes | Givora',
    description: locale === 'ar' ? 'بوكسات هدايا شيك متنسقة بعناية ومغلفة تغليف فاخر' : 'Carefully curated luxury gift collections',
  };
}

export default async function GiftBoxesPage({ params }: Props) {
  const { locale } = await params;
  return (
    <CategoryPageClient
      title={locale === 'ar' ? 'بوكسات الهدايا' : 'Gift Boxes'}
      description={
        locale === 'ar'
          ? 'بوكسات هدايا شيك متنسقة بعناية ومغلفة تغليف فاخر عشان تفاجئ حبايبك في كل مناسبة حلوة'
          : 'Curated luxury gift collections designed and crafted with utmost care for your special occasions'
      }
      mainCategory="gift-boxes"
      subcategories={SUBCATEGORIES}
      products={MOCK_PRODUCTS}
      locale={locale as 'ar' | 'en'}
    />
  );
}
