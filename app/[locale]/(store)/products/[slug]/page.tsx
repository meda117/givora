import { ProductDetailClient } from '@/components/store/product/product-detail-client';
import type { Product } from '@/types';

type Props = { params: Promise<{ locale: string; slug: string }> };

async function getProduct(slug: string): Promise<Product | null> {
  return {
    id: '1',
    slug: { ar: slug, en: slug, translationStatus: 'auto' },
    name: { ar: 'بوكس الورد الملكي الفاخر', en: 'Royal Luxury Rose Box', translationStatus: 'auto' },
    description: {
      ar: 'بوكس هدايا فخم مصمم بحب عشان يعبّر عن مشاعرك بأرقى طريقة. بيحتوي على تشكيلة ورود طبيعية بتعيش سنة كاملة مع شوكولاتة بلجيكية فاخرة وشمعة عطرية بلمسة خاصة.',
      en: 'A carefully curated collection of luxury preserved roses, Belgian chocolates, and a personalized scented candle, all wrapped in our signature luxury packaging.',
      translationStatus: 'auto',
    },
    shortDescription: {
      ar: 'بوكس هدايا فخم مع ورود تدوم سنة وشوكولاتة بلجيكية',
      en: 'A premium curated gift collection with preserved roses and chocolates',
      translationStatus: 'auto',
    },
    type: 'gift-box',
    status: 'published',
    categoryIds: ['gift-boxes'],
    mainCategory: 'gift-boxes',
    images: [],
    videos: [],
    basePrice: 650,
    discountedPrice: 550,
    discountPercent: 15,
    currency: 'EGP',
    inventory: 15,
    trackInventory: true,
    allowBackorder: false,
    variants: [
      {
        id: 'size',
        name: { ar: 'الحجم', en: 'Size', translationStatus: 'auto' },
        options: [
          { id: 'small', value: { ar: 'صغير', en: 'Small', translationStatus: 'auto' }, isAvailable: true },
          { id: 'medium', value: { ar: 'وسط', en: 'Medium', translationStatus: 'auto' }, priceModifier: 100, isAvailable: true },
          { id: 'large', value: { ar: 'كبير', en: 'Large', translationStatus: 'auto' }, priceModifier: 200, isAvailable: true },
        ],
      },
    ],
    badges: ['sale', 'best_seller'],
    tags: ['roses', 'gift-box', 'luxury'],
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
    boxContents: [
      { id: '1', source: 'external', name: { ar: 'ورود طبيعية تدوم سنة', en: 'Preserved Eternal Roses', translationStatus: 'auto' }, quantity: 12, isOptional: false, order: 1 },
      { id: '2', source: 'external', name: { ar: 'شوكولاتة بلجيكية فاخرة', en: 'Luxury Belgian Chocolates', translationStatus: 'auto' }, quantity: 6, isOptional: false, order: 2 },
      { id: '3', source: 'external', name: { ar: 'شمعة عطرية بلمسة خاصة', en: 'Custom Scented Candle', translationStatus: 'auto' }, quantity: 1, isOptional: true, order: 3 },
    ],
    relatedProductIds: ['2', '3'],
    ratings: { average: 4.8, count: 47, distribution: { 5: 38, 4: 7, 3: 1, 2: 0, 1: 0 } },
    seo: {
      title: { ar: 'بوكس الورد الملكي الفاخر | Givora', en: 'Royal Luxury Rose Box | Givora', translationStatus: 'auto' },
    },
    createdAt: '2026-10-01T00:00:00Z',
    updatedAt: '2026-11-01T00:00:00Z',
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-light text-charcoal">
          {locale === 'ar' ? 'المنتج غير موجود' : 'Product not found'}
        </h1>
      </div>
    );
  }

  return <ProductDetailClient product={product} locale={locale as 'ar' | 'en'} />;
}
