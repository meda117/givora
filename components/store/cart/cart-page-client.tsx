'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Tag, Package, Image as ImageIcon, Type, Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/ui/empty-state';
import { formatPrice } from '@/lib/utils';
import type { Locale, CartItem } from '@/types';

// Mock cart items showcasing diverse product types & customization snapshots
const INITIAL_CART_ITEMS: CartItem[] = [
  {
    id: 'line-1',
    productId: '1',
    productName: { ar: 'بوكس الملكة الفاخر', en: 'Royal Queen Gift Box', translationStatus: 'auto' },
    productSlug: { ar: 'royal-queen-gift-box', en: 'royal-queen-gift-box', translationStatus: 'auto' },
    productType: 'gift_box',
    unitPrice: 1250,
    customizationPrice: 0,
    quantity: 1,
    productImage: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&auto=format&fit=crop&q=80',
    customizationSnapshot: {
      productType: 'gift_box',
      specialInstructions: 'تغليف شريط ساتان أسود فخم',
    },
  },
  {
    id: 'line-2',
    productId: '2',
    productName: { ar: 'سلسلة اسم فضة إيطالي عيار 925 بحفر ليزر', en: 'Italian 925 Silver Engraved Name Necklace', translationStatus: 'auto' },
    productSlug: { ar: 'engraved-silver-necklace', en: 'engraved-silver-necklace', translationStatus: 'auto' },
    productType: 'engraved',
    unitPrice: 480,
    customizationPrice: 50,
    quantity: 1,
    productImage: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&auto=format&fit=crop&q=80',
    customizationSnapshot: {
      productType: 'engraved',
      nameToEngrave: 'مريم & أحمد',
      engravingDate: '2026-11-20',
      fontStyle: 'ديواني فاخر',
      position: 'الواجهة الأمامية',
    },
  },
];

interface CartPageClientProps {
  locale: Locale;
}

export function CartPageClient({ locale }: CartPageClientProps) {
  const isAr = locale === 'ar';
  const t = useTranslations('cart');
  const [items, setItems] = useState<CartItem[]>(INITIAL_CART_ITEMS);
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [giftMessage, setGiftMessage] = useState('');
  const [hidePrice, setHidePrice] = useState(false);

  const updateQty = (id: string, delta: number) => {
    setItems(prev => prev.map(item =>
      item.id === id
        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
        : item
    ));
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = items.reduce((acc, item) =>
    acc + (item.unitPrice + item.customizationPrice) * item.quantity, 0
  );
  const freeShippingThreshold = 1000;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const shipping = isFreeShipping ? 0 : 50;
  const discount = couponApplied ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal + shipping - discount;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <EmptyState
          icon={<ShoppingBag className="h-8 w-8 text-[var(--text-secondary)]" />}
          title={isAr ? 'سلة المشتريات فاضية' : 'Your cart is empty'}
          description={isAr ? 'لسة ما ضفتش أي هدايا لسلتك، استكشف مجموعاتنا المميزة دلوقتي' : 'You have not added any gifts yet. Explore our curated collections.'}
          action={
            <Link href={`/${locale}`}>
              <Button>{isAr ? 'اتسوق دلوقتي' : 'Start Shopping'}</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <h1
          className="text-3xl md:text-4xl font-light text-[var(--text-main)] mb-2"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          {isAr ? 'سلة الهدايا' : 'Shopping Cart'}
        </h1>
        <p className="text-sm text-[var(--text-secondary)]">
          {isAr
            ? `عندك ${items.length} ${items.length === 1 ? 'هدية' : 'هدايا'} في سلتك`
            : `You have ${items.length} item${items.length > 1 ? 's' : ''} in your cart`}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const snap = item.customizationSnapshot;
            const lineTotal = (item.unitPrice + item.customizationPrice) * item.quantity;

            return (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row gap-4 p-5 border border-[var(--border-color)] rounded-sm bg-[var(--card-bg)] transition-colors"
              >
                {/* Product image */}
                <Link
                  href={`/${locale}/products/${item.productSlug[locale]}`}
                  className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 rounded-sm bg-[var(--bg-secondary)] overflow-hidden relative border border-[var(--border-color)]"
                >
                  {item.productImage ? (
                    <Image
                      src={item.productImage}
                      alt={item.productName[locale] || ''}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[var(--text-secondary)]">
                      <Package className="h-6 w-6 stroke-1" />
                    </div>
                  )}
                </Link>

                {/* Info & Customization */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <Link href={`/${locale}/products/${item.productSlug[locale]}`}>
                        <h3 className="text-sm sm:text-base font-medium text-[var(--text-main)] hover:text-[var(--text-secondary)] transition-colors line-clamp-2">
                          {item.productName[locale]}
                        </h3>
                      </Link>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-[var(--text-secondary)] hover:text-red-500 transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Customization Snapshot Details */}
                    {snap && (
                      <div className="mt-2.5 p-2.5 rounded-sm bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs text-[var(--text-secondary)] space-y-1">
                        {snap.nameToEngrave && (
                          <div className="flex items-center gap-1.5">
                            <Type className="h-3.5 w-3.5 text-[var(--text-main)]" />
                            <span>{isAr ? 'الاسم المحفور:' : 'Engraved Name:'}</span>
                            <strong className="text-[var(--text-main)]">{snap.nameToEngrave}</strong>
                          </div>
                        )}
                        {snap.engravingDate && (
                          <div className="flex items-center gap-1.5">
                            <span>{isAr ? 'التاريخ المطلوب:' : 'Date:'}</span>
                            <strong className="text-[var(--text-main)]">{snap.engravingDate}</strong>
                          </div>
                        )}
                        {snap.fontStyle && (
                          <div className="flex items-center gap-1.5">
                            <span>{isAr ? 'نوع الخط:' : 'Font:'}</span>
                            <strong className="text-[var(--text-main)]">{snap.fontStyle}</strong>
                          </div>
                        )}
                        {snap.customerText && (
                          <div className="flex items-center gap-1.5">
                            <Type className="h-3.5 w-3.5 text-[var(--text-main)]" />
                            <span>{isAr ? 'النص المطبوع:' : 'Printed Text:'}</span>
                            <strong className="text-[var(--text-main)]">{snap.customerText}</strong>
                          </div>
                        )}
                        {snap.uploadedImages && snap.uploadedImages.length > 0 && (
                          <div className="flex items-center gap-2 pt-1">
                            <ImageIcon className="h-3.5 w-3.5 text-[var(--text-main)]" />
                            <span>{isAr ? 'الصور المرفقة للطباعة:' : 'Uploaded Images:'}</span>
                            <div className="flex gap-1.5">
                              {snap.uploadedImages.map((img, idx) => (
                                <a
                                  key={idx}
                                  href={img.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-6 h-6 rounded border border-[var(--border-color)] overflow-hidden relative inline-block"
                                >
                                  <Image src={img.url} alt="Custom" fill className="object-cover" />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                        {snap.specialInstructions && (
                          <p className="text-[11px] text-[var(--text-secondary)]">
                            {isAr ? 'ملاحظة:' : 'Note:'} {snap.specialInstructions}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Quantity & Price Controls */}
                  <div className="flex items-center justify-between pt-4 mt-3 border-t border-[var(--border-color)]">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQty(item.id, -1)}
                        className="w-7 h-7 rounded-sm border border-[var(--border-color)] text-[var(--text-main)] flex items-center justify-center hover:bg-[var(--bg-secondary)] transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium text-[var(--text-main)]">{item.quantity}</span>
                      <button
                        onClick={() => updateQty(item.id, 1)}
                        className="w-7 h-7 rounded-sm border border-[var(--border-color)] text-[var(--text-main)] flex items-center justify-center hover:bg-[var(--bg-secondary)] transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    <div className="text-end">
                      <span className="text-base font-semibold text-[var(--text-main)]">
                        {formatPrice(lineTotal, 'EGP', locale)}
                      </span>
                      {item.customizationPrice > 0 && (
                        <p className="text-[11px] text-[var(--text-secondary)]">
                          {isAr ? `شامل تخصيص ${formatPrice(item.customizationPrice, 'EGP', locale)}` : `Includes customization`}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Gift Message Card */}
          <div className="p-5 border border-[var(--border-color)] rounded-sm bg-[var(--card-bg)] space-y-3">
            <label className="flex items-center gap-2.5 text-sm font-medium text-[var(--text-main)] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={!!giftMessage || false}
                onChange={(e) => { if (!e.target.checked) setGiftMessage(''); }}
                className="accent-[var(--text-main)] rounded"
              />
              <span>{isAr ? 'إضافة كارت إهداء مجاني مع الطلب' : 'Add complimentary luxury gift card'}</span>
            </label>

            <textarea
              value={giftMessage}
              onChange={(e) => setGiftMessage(e.target.value)}
              placeholder={isAr ? 'اكتب إهدائك هنا وهنطبعهولك على كارت هدايا فاخر مرفق داخل البوكس...' : 'Write your gift message here...'}
              className="w-full text-sm border border-[var(--border-color)] bg-[var(--bg-main)] text-[var(--text-main)] rounded-sm p-3 resize-none min-h-[80px] focus:outline-none focus:ring-1 focus:ring-[var(--text-main)] placeholder:text-[var(--text-secondary)]"
            />

            <label className="flex items-center gap-2 text-xs text-[var(--text-secondary)] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={hidePrice}
                onChange={(e) => setHidePrice(e.target.checked)}
                className="accent-[var(--text-main)] rounded"
              />
              <span>{isAr ? 'إخفاء الأسعار من الفاتورة المرفقة داخل الشحنة (للإهداء المباشر)' : 'Hide prices from printed delivery packing slip'}</span>
            </label>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-sm p-6 space-y-4">
            <h2 className="text-base font-semibold text-[var(--text-main)] pb-3 border-b border-[var(--border-color)]">
              {isAr ? 'ملخص الطلب' : 'Order Summary'}
            </h2>

            {/* Coupon Code Input */}
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder={isAr ? 'كود الخصم' : 'Discount code'}
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  leftElement={<Tag className="h-4 w-4" />}
                />
              </div>
              <Button
                variant="outline"
                onClick={() => { if (coupon.trim()) setCouponApplied(true); }}
              >
                {isAr ? 'تطبيق' : 'Apply'}
              </Button>
            </div>

            {couponApplied && (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                {isAr ? 'تم تطبيق خصم 10% بنجاح' : '10% discount applied'}
              </p>
            )}

            {/* Price Breakdown */}
            <div className="space-y-2.5 pt-2 border-t border-[var(--border-color)] text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">{isAr ? 'المجموع الفرعي' : 'Subtotal'}</span>
                <span className="text-[var(--text-main)] font-medium">{formatPrice(subtotal, 'EGP', locale)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">{isAr ? 'الشحن المقدر' : 'Estimated Shipping'}</span>
                <span className="text-[var(--text-main)] font-medium">
                  {isFreeShipping ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                      {isAr ? 'شحن مجاني' : 'Free Shipping'}
                    </span>
                  ) : (
                    formatPrice(shipping, 'EGP', locale)
                  )}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>{isAr ? 'قيمة الخصم' : 'Discount'}</span>
                  <span>-{formatPrice(discount, 'EGP', locale)}</span>
                </div>
              )}
            </div>

            <div className="flex justify-between text-base font-semibold pt-3 border-t border-[var(--border-color)] text-[var(--text-main)]">
              <span>{isAr ? 'الإجمالي' : 'Total'}</span>
              <span>{formatPrice(total, 'EGP', locale)}</span>
            </div>

            <Link href={`/${locale}/checkout`} className="block">
              <Button fullWidth size="lg" rightIcon={<ArrowRight className="h-4 w-4 rtl:rotate-180" />}>
                {isAr ? 'متابعة الشراء' : 'Proceed to Checkout'}
              </Button>
            </Link>

            <Link
              href={`/${locale}`}
              className="block text-center text-xs text-[var(--text-secondary)] hover:text-[var(--text-main)] transition-colors pt-2"
            >
              {isAr ? 'متابعة التسوق وإضافة هدايا أخرى' : 'Continue shopping'}
            </Link>

            {!isFreeShipping && (
              <div className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-sm text-xs text-center text-[var(--text-secondary)]">
                {isAr
                  ? `أضف بقيمة ${formatPrice(freeShippingThreshold - subtotal, 'EGP', locale)} إضافية واحصل على شحن مجاني لأي مكان في مصر`
                  : `Add ${formatPrice(freeShippingThreshold - subtotal, 'EGP', locale)} more to get free shipping across Egypt`}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
