'use client';
import { useState } from 'react';
import { ProductCard } from '@/components/store/product/product-card';
import type { Locale, MainCategory, Product } from '@/types';

interface CategoryPageClientProps {
  title: string;
  description: string;
  mainCategory: MainCategory;
  subcategories: { id: string; name: { ar: string; en: string } }[];
  products: Product[];
  locale: Locale;
}

export function CategoryPageClient({
  title,
  description,
  mainCategory,
  subcategories,
  products,
  locale,
}: CategoryPageClientProps) {
  const isAr = locale === 'ar';
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price_low' | 'price_high' | 'newest'>('featured');

  const filtered = products
    .filter(p => selectedSubcategory === 'all' || p.categoryIds?.includes(selectedSubcategory))
    .sort((a, b) => {
      if (sortBy === 'price_low') return a.basePrice - b.basePrice;
      if (sortBy === 'price_high') return b.basePrice - a.basePrice;
      return 0;
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Category Header */}
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
        <h1
          className="text-4xl md:text-5xl font-light text-neutral-950 dark:text-white"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          {title}
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 text-xs sm:text-sm leading-relaxed">
          {description}
        </p>
      </div>

      {/* Subcategory buttons & filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 pb-6 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
          <button
            onClick={() => setSelectedSubcategory('all')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xs transition-colors whitespace-nowrap cursor-pointer uppercase tracking-wider ${
              selectedSubcategory === 'all'
                ? 'bg-black text-white dark:bg-white dark:text-black'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
            }`}
          >
            {isAr ? 'الكل' : 'All'}
          </button>
          {subcategories.map(sub => (
            <button
              key={sub.id}
              onClick={() => setSelectedSubcategory(sub.id)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-xs transition-colors whitespace-nowrap cursor-pointer uppercase tracking-wider ${
                selectedSubcategory === sub.id
                  ? 'bg-black text-white dark:bg-white dark:text-black'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
              }`}
            >
              {sub.name[locale]}
            </button>
          ))}
        </div>

        {/* Sort dropdown */}
        <div className="flex items-center gap-2 ms-auto">
          <span className="text-xs text-neutral-500 dark:text-neutral-400">{isAr ? 'الترتيب:' : 'Sort:'}</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs border border-neutral-200 dark:border-neutral-800 rounded-sm px-3 py-1.5 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:border-black dark:focus:border-white"
          >
            <option value="featured">{isAr ? 'المميز' : 'Featured'}</option>
            <option value="newest">{isAr ? 'الأحدث' : 'Newest'}</option>
            <option value="price_low">{isAr ? 'السعر: من الأقل للأعلى' : 'Price: Low to High'}</option>
            <option value="price_high">{isAr ? 'السعر: من الأعلى للأقل' : 'Price: High to Low'}</option>
          </select>
        </div>
      </div>

      {/* Product grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} locale={locale} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <p className="text-neutral-500 dark:text-neutral-400 text-xs">
            {isAr ? 'لا توجد هدايا متاحة في هذه الفئة حالياً' : 'No gifts found in this category'}
          </p>
        </div>
      )}
    </div>
  );
}
