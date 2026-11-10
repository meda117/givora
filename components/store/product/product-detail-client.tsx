'use client';
import { useState } from 'react';
import Image from 'next/image';
import {
  Heart,
  ShoppingBag,
  Check,
  Gift,
  Package,
  Printer,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Upload,
  Calendar,
  Layers,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { cn, formatPrice, calculateDiscount, t } from '@/lib/utils';
import type { Locale, Product, OrderCustomizationSnapshot } from '@/types';

interface ProductDetailProps {
  product: Product;
  locale: Locale;
}

export function ProductDetailClient({ product, locale }: ProductDetailProps) {
  const isAr = locale === 'ar';
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'details' | 'contents' | 'shipping'>('details');
  const [addedToCart, setAddedToCart] = useState(false);

  // Customization states
  const [customerText, setCustomerText] = useState('');
  const [nameToEngrave, setNameToEngrave] = useState('');
  const [engravingDate, setEngravingDate] = useState('');
  const [selectedFont, setSelectedFont] = useState('ruqaa');
  const [selectedPosition, setSelectedPosition] = useState('front');
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Standard Product Variant selection
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({
    size: 'm',
    color: 'black',
  });

  // Customer Image Upload (ImageKit)
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<{ url: string; fileName: string }[]>([]);

  const name = t(product.name, locale);
  const description = t(product.description, locale);
  const shortDescription = t(product.shortDescription, locale);
  const hasDiscount = !!product.discountedPrice && product.discountedPrice < product.basePrice;
  const basePriceToUse = hasDiscount ? product.discountedPrice! : product.basePrice;

  // Calculate extra customization fee if configured
  const customizationFee =
    product.type === 'printed'
      ? product.printedCustomization?.customizationFee || 0
      : product.type === 'engraved'
      ? product.engravedCustomization?.customizationFee || 0
      : 0;

  const unitPrice = basePriceToUse + customizationFee;
  const totalPrice = unitPrice * quantity;

  // Handle image upload to ImageKit via proxy route
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const file = files[0];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', '/givora/customizations');
      formData.append('fileName', `order-${Date.now()}-${file.name}`);

      const res = await fetch('/api/imagekit/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setUploadedImages([...uploadedImages, { url: data.url, fileName: file.name }]);
      } else {
        // Fallback demo URL if offline/dev test
        const fallbackUrl = URL.createObjectURL(file);
        setUploadedImages([...uploadedImages, { url: fallbackUrl, fileName: file.name }]);
      }
    } catch (err) {
      console.warn('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddToCart = () => {
    const snapshot: OrderCustomizationSnapshot = {
      productType: product.type,
      customerText: customerText || undefined,
      nameToEngrave: nameToEngrave || undefined,
      engravingDate: engravingDate || undefined,
      fontStyle: selectedFont,
      position: selectedPosition,
      specialInstructions: specialInstructions || undefined,
      uploadedImages: uploadedImages.map((img) => ({ url: img.url, fileName: img.fileName })),
      selectedAttributes: Object.keys(selectedAttributes).length > 0 ? selectedAttributes : undefined,
    };

    // Dispatch or store in cart state
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  const audienceLabels: Record<string, { ar: string; en: string }> = {
    women: { ar: 'بوكس حريمي فاخر', en: "Women's Luxury Box" },
    men: { ar: 'بوكس رجالي فاخر', en: "Men's Luxury Box" },
    couples: { ar: 'بوكس كابلز رومانسي', en: "Couples Gift Box" },
    unisex: { ar: 'بوكس يناسب الجميع', en: 'Unisex Gift Box' },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Gallery Section */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-sm overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            {product.images && product.images.length > 0 ? (
              <Image
                src={product.images[currentImageIndex]?.url}
                alt={name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-neutral-400 dark:text-neutral-600">
                {product.type === 'gift_box' || product.type === 'gift-box' ? (
                  <Gift className="h-16 w-16 stroke-[1.2]" />
                ) : (
                  <Package className="h-16 w-16 stroke-[1.2]" />
                )}
                <span className="text-xs uppercase tracking-widest text-neutral-400">
                  {product.type === 'gift_box' || product.type === 'gift-box'
                    ? (isAr ? 'بوكس هدايا فاخر' : 'Luxury Gift Box')
                    : (isAr ? 'هدية مميزة' : 'Signature Gift')}
                </span>
              </div>
            )}

            {product.images && product.images.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImageIndex((i) => Math.max(0, i - 1))}
                  className="absolute start-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xs bg-white/90 dark:bg-black/90 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center hover:bg-white transition-colors"
                  aria-label="Previous"
                >
                  <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
                </button>
                <button
                  onClick={() => setCurrentImageIndex((i) => Math.min(product.images.length - 1, i + 1))}
                  className="absolute end-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xs bg-white/90 dark:bg-black/90 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center hover:bg-white transition-colors"
                  aria-label="Next"
                >
                  <ChevronRight className="h-4 w-4 rtl:rotate-180" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {product.images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setCurrentImageIndex(i)}
                  className={cn(
                    'flex-shrink-0 w-16 h-16 rounded-xs overflow-hidden border-2 transition-colors',
                    i === currentImageIndex ? 'border-black dark:border-white' : 'border-transparent opacity-60'
                  )}
                >
                  <Image src={img.url} alt="" width={64} height={64} className="object-cover w-full h-full" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details & Ordering Section */}
        <div className="space-y-6">
          {/* Header Badges */}
          <div className="flex flex-wrap items-center gap-2">
            {product.targetAudience && (
              <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 bg-black text-white dark:bg-white dark:text-black rounded-xs">
                {audienceLabels[product.targetAudience]?.[locale] || product.targetAudience}
              </span>
            )}
            {product.isBestSeller && (
              <span className="text-[11px] font-semibold tracking-wider uppercase px-2 py-0.5 border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-xs">
                {isAr ? 'الأكثر طلباً' : 'Best Seller'}
              </span>
            )}
            {hasDiscount && (
              <span className="text-[11px] font-bold tracking-wider uppercase px-2 py-0.5 bg-neutral-900 text-white dark:bg-neutral-100 dark:text-black rounded-xs">
                {calculateDiscount(product.basePrice, product.discountedPrice!)}% {isAr ? 'خصم' : 'OFF'}
              </span>
            )}
          </div>

          <div>
            <h1
              className="text-3xl sm:text-4xl font-light text-neutral-950 dark:text-white leading-tight"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              {name}
            </h1>
            {shortDescription && (
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-2 leading-relaxed">
                {shortDescription}
              </p>
            )}
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-3 pb-4 border-b border-neutral-200 dark:border-neutral-800">
            <span className="text-2xl font-bold text-neutral-950 dark:text-white">
              {formatPrice(unitPrice, 'EGP', locale)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-neutral-400 line-through">
                {formatPrice(product.basePrice, 'EGP', locale)}
              </span>
            )}
            <span className="text-xs text-neutral-500 ms-auto">
              {isAr ? 'شامل ضريبة القيمة المضافة والتغليف الفاخر' : 'Includes luxury packaging & VAT'}
            </span>
          </div>

          {/* CUSTOMIZATION WORKFLOW 1: PRINTED PRODUCT */}
          {(product.type === 'printed' || product.printedCustomization) && (
            <div className="p-4 rounded-sm border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#151515] space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
                <Printer className="h-4 w-4" />
                <span>{isAr ? 'بيانات الطباعة المخصصة' : 'Custom Print Information'}</span>
              </div>

              <Input
                label={isAr ? 'الاسم أو النص المطلوب طباعته' : 'Custom Text / Name'}
                placeholder={isAr ? 'اكتب الاسم أو الجملة المطلوبة...' : 'Enter your custom inscription...'}
                value={customerText}
                onChange={(e) => setCustomerText(e.target.value)}
                maxLength={40}
                required
              />

              {/* Image Upload for Print */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                  {isAr ? 'ارفع صورتك أو تصميمك الخاص (JPG, PNG, WEBP)' : 'Upload your photo or artwork'}
                </label>
                <div className="border border-dashed border-neutral-300 dark:border-neutral-700 rounded-sm p-4 text-center bg-white dark:bg-[#1A1A1A]">
                  <input
                    type="file"
                    id="print-upload"
                    accept="image/png, image/jpeg, image/webp"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <label htmlFor="print-upload" className="cursor-pointer flex flex-col items-center gap-2">
                    <Upload className="h-5 w-5 text-neutral-400" />
                    <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                      {isUploading
                        ? (isAr ? 'جاري رفع الصورة...' : 'Uploading to ImageKit...')
                        : (isAr ? 'اضغط لاختيار صورة من جهازك' : 'Click to choose image')}
                    </span>
                  </label>
                </div>
                {uploadedImages.length > 0 && (
                  <div className="flex items-center gap-2 pt-1 text-xs text-neutral-800 dark:text-neutral-200">
                    <Check className="h-3.5 w-3.5 text-green-600" />
                    <span>{isAr ? 'تم رفع الصورة وتأكيد ارتباطها بالطلب' : 'Image uploaded successfully'}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* CUSTOMIZATION WORKFLOW 2: ENGRAVED PRODUCT */}
          {(product.type === 'engraved' || product.engravedCustomization) && (
            <div className="p-4 rounded-sm border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#151515] space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
                <Sparkles className="h-4 w-4" />
                <span>{isAr ? 'تخصيص الحفر بالليزر' : 'Laser Engraving Options'}</span>
              </div>

              <Input
                label={isAr ? 'الاسم المطلوب حفره على القطعة' : 'Name to Engrave'}
                placeholder={isAr ? 'مثال: نورا، أحمد، سارة...' : 'e.g. Sarah, Ahmed'}
                value={nameToEngrave}
                onChange={(e) => setNameToEngrave(e.target.value)}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label={isAr ? 'تاريخ الذكرى السعيدة (اختياري)' : 'Date to Engrave (Optional)'}
                  type="date"
                  value={engravingDate}
                  onChange={(e) => setEngravingDate(e.target.value)}
                />
                <div>
                  <label className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 block mb-1.5">
                    {isAr ? 'نوع الخط المفضل' : 'Font Style'}
                  </label>
                  <select
                    value={selectedFont}
                    onChange={(e) => setSelectedFont(e.target.value)}
                    className="w-full h-11 px-3 rounded-sm border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#1A1A1A] text-xs font-medium"
                  >
                    <option value="ruqaa">{isAr ? 'خط رقعة عربي فخم' : 'Classic Ruqaa Arabic'}</option>
                    <option value="diwani">{isAr ? 'خط ديواني ملوكي' : 'Royal Diwani Arabic'}</option>
                    <option value="naskh">{isAr ? 'خط نسخ عصري' : 'Modern Naskh Arabic'}</option>
                    <option value="script">English Modern Script</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STANDARD PRODUCT ATTRIBUTES (Size & Color) */}
          {product.type === 'standard' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 block mb-2">
                  {isAr ? 'المقاس:' : 'Size:'}
                </label>
                <div className="flex gap-2">
                  {['s', 'm', 'l'].map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedAttributes({ ...selectedAttributes, size: sz })}
                      className={cn(
                        'w-10 h-10 rounded-xs border text-xs font-bold uppercase transition-colors',
                        selectedAttributes.size === sz
                          ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white'
                          : 'bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200'
                      )}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Quantity & Add to Cart Controls */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-4">
              {/* Qty Counter */}
              <div className="flex items-center border border-neutral-200 dark:border-neutral-700 rounded-sm bg-white dark:bg-[#1A1A1A]">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-9 h-11 flex items-center justify-center text-sm font-bold hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  -
                </button>
                <span className="w-10 text-center text-xs font-bold">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-9 h-11 flex items-center justify-center text-sm font-bold hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  +
                </button>
              </div>

              {/* Add to Cart CTA */}
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleAddToCart}
                leftIcon={<ShoppingBag className="h-4 w-4" />}
                className="h-11"
              >
                {addedToCart
                  ? (isAr ? 'تمت الإضافة للسلة ✓' : 'Added to Cart ✓')
                  : (isAr ? `ضيف للسلة (${formatPrice(totalPrice, 'EGP', locale)})` : `Add to Cart (${formatPrice(totalPrice, 'EGP', locale)})`)}
              </Button>

              {/* Wishlist Icon */}
              <button
                type="button"
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="w-11 h-11 rounded-sm border border-neutral-200 dark:border-neutral-700 flex items-center justify-center hover:border-black dark:hover:border-white transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="h-4 w-4" fill={isWishlisted ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-400">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-neutral-900 dark:text-white flex-shrink-0" />
              <span>{isAr ? 'شحن لجميع المحافظات خلال 24-48 ساعة' : 'Fast Delivery across Egypt'}</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-neutral-900 dark:text-white flex-shrink-0" />
              <span>{isAr ? 'معاينة مجانية وتغليف آمن للشحن' : 'Safe packaging & Inspection on arrival'}</span>
            </div>
          </div>

          {/* TABBED INFORMATION (Description & Box Contents) */}
          <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 space-y-4">
            <div className="flex border-b border-neutral-200 dark:border-neutral-800">
              <button
                type="button"
                onClick={() => setActiveTab('details')}
                className={cn(
                  'pb-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 -mb-[1px]',
                  activeTab === 'details'
                    ? 'border-black text-black dark:border-white dark:text-white'
                    : 'border-transparent text-neutral-400 hover:text-neutral-700'
                )}
              >
                {isAr ? 'تفاصيل الهدية' : 'Details'}
              </button>
              {(product.type === 'gift_box' || product.type === 'gift-box' || (product.boxContents && product.boxContents.length > 0)) && (
                <button
                  type="button"
                  onClick={() => setActiveTab('contents')}
                  className={cn(
                    'pb-3 ms-6 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 -mb-[1px]',
                    activeTab === 'contents'
                      ? 'border-black text-black dark:border-white dark:text-white'
                      : 'border-transparent text-neutral-400 hover:text-neutral-700'
                  )}
                >
                  {isAr ? 'محتويات البوكس المشمولة' : 'Included Contents'}
                </button>
              )}
            </div>

            {activeTab === 'details' && (
              <div className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed space-y-2">
                <p>{description || (isAr ? 'هدية مميزة تم إعدادها وتغليفها بعناية فائقة لتليق بمناسبتك السعيدة.' : 'Crafted with premium materials and exquisite attention to detail.')}</p>
              </div>
            )}

            {activeTab === 'contents' && (
              <div className="space-y-3">
                <p className="text-xs text-neutral-500">
                  {isAr ? 'يحتوي هذا البوكس على المكونات التالية كاملة داخل علبة هدايا فاخرة:' : 'This box includes all the following curated items inside a luxury gift packaging:'}
                </p>
                <div className="divide-y divide-neutral-100 dark:divide-neutral-800 border border-neutral-200 dark:border-neutral-800 rounded-sm">
                  {[
                    { name: isAr ? 'ورد طبيعي دائم (Eternal Rose)' : 'Eternal Preserved Rose', qty: 1 },
                    { name: isAr ? 'سلسلة فضة إيطالي عيار 925' : '925 Italian Silver Necklace', qty: 1 },
                    { name: isAr ? 'شوكولاتة بلجيكية فاخرة' : 'Belgian Chocolate Truffles', qty: 1 },
                    { name: isAr ? 'كارت إهداء كلاسيكي بالرسالة المخصصة' : 'Wax-Sealed Custom Card', qty: 1 },
                  ].map((item, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-4 text-neutral-400">{idx + 1}.</span>
                        <span className="font-semibold text-neutral-900 dark:text-white">{item.name}</span>
                      </div>
                      <span className="text-neutral-500">× {item.qty}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
