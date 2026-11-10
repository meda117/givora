'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from '@/components/store/product/product-card';
import { ProductGridSkeleton } from '@/components/ui/skeleton';
import type { Locale, MainCategory, Product } from '@/types';

// Structured mock products focusing exclusively on Gift Boxes and Physical/Customized Gifts
const MOCK_PRODUCTS: Partial<Product>[] = [
  {
    id: '1',
    name: { ar: 'بوكس الورد الملكي الفاخر', en: 'Royal Luxury Rose Box', translationStatus: 'auto' },
    shortDescription: { ar: 'تنسيق ورود طبيعية تدوم سنة مع شوكولاتة بلجيكية فاخرة', en: 'Preserved eternal roses with Belgian chocolates', translationStatus: 'auto' },
    basePrice: 650,
    discountedPrice: 550,
    images: [],
    isBestSeller: true,
    slug: { ar: 'luxury-rose-box', en: 'luxury-rose-box', translationStatus: 'auto' },
    type: 'gift_box',
    status: 'published',
    badges: ['best_seller'],
  },
  {
    id: '2',
    name: { ar: 'سلسلة اسم بالفضة الإيطالي عيار 925', en: 'Custom Engraved 925 Silver Name Necklace', translationStatus: 'auto' },
    shortDescription: { ar: 'فضة إيطالي عيار 925 مطلية ذهب ومحفورة بالاسم حسب طلبك', en: '925 Italian silver gold-plated custom engraved necklace', translationStatus: 'auto' },
    basePrice: 350,
    images: [],
    isNewArrival: true,
    slug: { ar: 'personalized-name-necklace', en: 'personalized-name-necklace', translationStatus: 'auto' },
    type: 'engraved',
    status: 'published',
    badges: ['new'],
  },
  {
    id: '3',
    name: { ar: 'مج سيراميك فاخر مطبوع بالصورة والإهداء', en: 'Signature Printed Ceramic Mug with Custom Design', translationStatus: 'auto' },
    shortDescription: { ar: 'طباعة حرارية عالية الدقة ثابتة للأبد مع كارت إهداء خاص', en: 'High definition permanent thermal print with custom greeting card', translationStatus: 'auto' },
    basePrice: 220,
    images: [],
    isFeatured: true,
    slug: { ar: 'printed-custom-mug', en: 'printed-custom-mug', translationStatus: 'auto' },
    type: 'printed',
    status: 'published',
    badges: [],
  },
  {
    id: '4',
    name: { ar: 'بوكس الذكريات الرومانسي (كابلز)', en: "Romantic Memories Gift Box for Couples", translationStatus: 'auto' },
    shortDescription: { ar: 'ألبوم صور ميني، شمعة عطرية فاخرة، وشوكولاتة راقية', en: 'Mini photo album, scented candle, and luxury chocolates', translationStatus: 'auto' },
    basePrice: 850,
    discountedPrice: 720,
    images: [],
    isBestSeller: true,
    slug: { ar: 'couples-gift-box', en: 'couples-gift-box', translationStatus: 'auto' },
    type: 'gift_box',
    targetAudience: 'couples',
    status: 'published',
    badges: ['sale'],
  },
];

interface ProductSectionProps {
  title: string;
  source: 'trending' | 'best_sellers' | 'new_arrivals' | 'featured';
  locale: Locale;
  mainCategory?: MainCategory;
  viewAllHref?: string;
}

export function ProductSection({ title, source, locale, mainCategory, viewAllHref }: ProductSectionProps) {
  const [products, setProducts] = useState<Partial<Product>[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProducts(MOCK_PRODUCTS);
      setIsLoading(false);
    }, 200);
    return () => clearTimeout(timer);
  }, [source]);

  const href = viewAllHref || `/${locale}/${mainCategory || 'trending-gifts'}`;

  return (
    <div>
      {/* Section header */}
      <div className="flex items-end justify-between mb-8 pb-3 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h2
            className="text-2xl md:text-3xl font-light text-neutral-950 dark:text-white"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            {title}
          </h2>
        </div>
        <Link
          href={href}
          className="flex items-center gap-1.5 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
        >
          <span>{locale === 'ar' ? 'شوف الكل' : 'View All'}</span>
          <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
        </Link>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <ProductGridSkeleton count={4} />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product as Product} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
