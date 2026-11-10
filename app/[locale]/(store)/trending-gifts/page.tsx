import { CategoryPageClient } from '@/components/store/category/category-page-client';
import type { Product } from '@/types';

type Props = { params: Promise<{ locale: string }> };

const SUBCATEGORIES = [
  { id: 'accessories', name: { ar: 'إكسسوارات', en: 'Accessories' } },
  { id: 'personalized', name: { ar: 'هدايا بالاسم', en: 'Personalized Gifts' } },
  { id: 'engraved', name: { ar: 'هدايا محفورة', en: 'Engraved Gifts' } },
  { id: 'printed', name: { ar: 'مطبوعات مخصصة', en: 'Printed Gifts' } },
  { id: 'chocolates', name: { ar: 'شوكولاتة مخصصة', en: 'Custom Chocolates' } },
];

const MOCK_PRODUCTS: Product[] = [
  {
    id: '2',
    slug: { ar: 'personalized-name-necklace', en: 'personalized-name-necklace', translationStatus: 'auto' },
    name: { ar: 'سلسلة اسم بالفضة الإيطالي', en: 'Personalized Silver Name Necklace', translationStatus: 'auto' },
    description: { ar: 'سلسلة فضة عيار 925 مطلية دهب ومحفورة بالاسم حسب طلبك', en: '925 silver gold-plated necklace with custom name engraving', translationStatus: 'auto' },
    shortDescription: { ar: 'سلسلة مميزة بالاسم وتفصيل شيك', en: 'Custom name necklace with luxury finish', translationStatus: 'auto' },
    type: 'physical',
    status: 'published',
    categoryIds: ['personalized', 'accessories', 'trending-gifts'],
    mainCategory: 'trending-gifts',
    images: [],
    videos: [],
    basePrice: 350,
    currency: 'EGP',
    inventory: 32,
    trackInventory: true,
    allowBackorder: false,
    variants: [],
    badges: ['new', 'best_seller'],
    tags: ['necklace', 'personalized'],
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    relatedProductIds: [],
    ratings: { average: 4.7, count: 89, distribution: {} },
    seo: {},
    createdAt: '2026-10-01T00:00:00Z',
    updatedAt: '2026-11-01T00:00:00Z',
  },
];

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return {
    title: locale === 'ar' ? 'هدايا تريندي | Givora' : 'Trending Gifts | Givora',
    description: locale === 'ar' ? 'أجدد أفكار الهدايا الإبداعية اللي طالعة تريند' : 'The latest creative and personalized gift trends',
  };
}

export default async function TrendingGiftsPage({ params }: Props) {
  const { locale } = await params;
  return (
    <CategoryPageClient
      title={locale === 'ar' ? 'هدايا تريندي' : 'Trending Gifts'}
      description={
        locale === 'ar'
          ? 'أجدد أفكار الهدايا الإبداعية اللي طالعة تريند، تقدّر تخصصها بالاسم والصور عشان تفرح اللي بتحبهم'
          : 'Discover the latest creative, personalized gift ideas that express your sentiments with modern flair'
      }
      mainCategory="trending-gifts"
      subcategories={SUBCATEGORIES}
      products={MOCK_PRODUCTS}
      locale={locale as 'ar' | 'en'}
    />
  );
}
