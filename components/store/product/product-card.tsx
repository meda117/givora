'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, Eye, Gift, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn, formatPrice, calculateDiscount, t } from '@/lib/utils';
import { imagekitPresets } from '@/lib/imagekit/service';
import type { Locale, Product } from '@/types';

interface ProductCardProps {
  product: Product;
  locale: Locale;
}

export function ProductCard({ product, locale }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const name = t(product.name, locale);
  const shortDesc = t(product.shortDescription, locale);
  const slug = t(product.slug, locale);
  const coverImage = product.images?.find(img => img.isCover) || product.images?.[0];
  const hoverImage = product.images?.[1];

  const hasDiscount = product.discountedPrice && product.discountedPrice < product.basePrice;
  const discountPercent = hasDiscount
    ? calculateDiscount(product.basePrice, product.discountedPrice!)
    : 0;

  return (
    <article
      className="group relative flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative block aspect-square overflow-hidden rounded-sm bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 mb-3">
        {/* Main Image Link */}
        <Link
          href={`/${locale}/products/${slug}`}
          className="absolute inset-0 z-0 block"
          aria-label={name}
        >
          {coverImage ? (
            <Image
              src={isHovered && hoverImage
                ? imagekitPresets.productThumbnail(hoverImage.url)
                : imagekitPresets.productThumbnail(coverImage.url)}
              alt={t(coverImage.alt, locale) || name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-102"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400 dark:text-neutral-600 gap-1.5">
              {product.type === 'gift_box' || product.type === 'gift-box' ? (
                <Gift className="h-8 w-8 stroke-[1.25]" />
              ) : (
                <Sparkles className="h-8 w-8 stroke-[1.25]" />
              )}
              <span className="text-[10px] tracking-wider uppercase text-neutral-400">
                {product.type === 'gift_box' || product.type === 'gift-box'
                  ? (locale === 'ar' ? 'بوكس هدية' : 'Gift Box')
                  : (locale === 'ar' ? 'هدية مميزة' : 'Trending Gift')}
              </span>
            </div>
          )}
        </Link>

        {/* Badges */}
        <div className="absolute top-2.5 start-2.5 flex flex-col gap-1.5 z-10 pointer-events-none">
          {hasDiscount && (
            <span className="bg-black text-white dark:bg-white dark:text-black text-[10px] font-bold px-2 py-0.5 rounded-xs tracking-wider">
              {discountPercent}% {locale === 'ar' ? 'خصم' : 'OFF'}
            </span>
          )}
          {product.isNewArrival && (
            <span className="bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200 text-[10px] font-semibold px-2 py-0.5 rounded-xs border border-neutral-200 dark:border-neutral-700 uppercase">
              {locale === 'ar' ? 'جديد' : 'New'}
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 text-[10px] font-semibold px-2 py-0.5 rounded-xs uppercase">
              {locale === 'ar' ? 'الأكتر طلباً' : 'Best Seller'}
            </span>
          )}
        </div>

        {/* Quick actions */}
        <div className={cn(
          'absolute top-2.5 end-2.5 flex flex-col gap-1.5 transition-all duration-200 z-10',
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1 pointer-events-none'
        )}>
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsWishlisted(!isWishlisted); }}
            className={cn(
              'w-8 h-8 rounded-sm flex items-center justify-center border transition-colors shadow-xs',
              isWishlisted
                ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white'
                : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:text-black dark:hover:text-white'
            )}
            aria-label="Wishlist"
          >
            <Heart className="h-3.5 w-3.5" fill={isWishlisted ? 'currentColor' : 'none'} />
          </button>
          <Link
            href={`/${locale}/products/${slug}`}
            className="w-8 h-8 rounded-sm bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 hover:text-black dark:hover:text-white flex items-center justify-center shadow-xs transition-colors"
            aria-label="View Product"
          >
            <Eye className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Add to cart / View product action link on hover */}
        <Link
          href={`/${locale}/products/${slug}`}
          className={cn(
            'absolute bottom-0 inset-x-0 py-2.5 text-xs font-semibold text-center',
            'bg-black text-white dark:bg-white dark:text-black',
            'flex items-center justify-center gap-2 transition-all duration-200 z-10',
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
          )}
        >
          <ShoppingBag className="h-3.5 w-3.5" />
          <span>{locale === 'ar' ? 'ضيف للسلة' : 'Add to Cart'}</span>
        </Link>
      </div>

      {/* Product info */}
      <div className="flex-1 flex flex-col gap-1">
        <Link href={`/${locale}/products/${slug}`}>
          <h3 className="text-sm font-medium text-neutral-900 dark:text-neutral-100 hover:opacity-75 transition-opacity line-clamp-2 leading-snug">
            {name}
          </h3>
        </Link>
        {shortDesc && (
          <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1">{shortDesc}</p>
        )}
        <div className="flex items-center gap-2 mt-1">
          {hasDiscount ? (
            <>
              <span className="text-sm font-semibold text-neutral-950 dark:text-white">
                {formatPrice(product.discountedPrice!, 'EGP', locale)}
              </span>
              <span className="text-xs text-neutral-400 dark:text-neutral-500 line-through">
                {formatPrice(product.basePrice, 'EGP', locale)}
              </span>
            </>
          ) : (
            <span className="text-sm font-semibold text-neutral-950 dark:text-white">
              {formatPrice(product.basePrice, 'EGP', locale)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
