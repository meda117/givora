'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Gift,
  Package,
  Printer,
  Sparkles,
  Plus,
  Trash2,
  Check,
  RefreshCw,
  Search,
  ExternalLink,
  SlidersHorizontal,
  Film,
  Star,
  CheckCircle2,
} from 'lucide-react';
import { collection, doc, setDoc, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { COLLECTIONS } from '@/lib/firebase/collections';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ImageKitUploader, UploadedMediaItem } from '@/components/admin/media/imagekit-uploader';
import type {
  Locale,
  ProductType,
  GiftBoxAudience,
  GiftBoxItem,
  ProductAttribute,
  ProductVariantCombination,
  PrintedProductCustomization,
  EngravedProductCustomization,
} from '@/types';

interface RealCatalogOption {
  id: string;
  nameAr: string;
  nameEn: string;
  price: number;
  image?: string;
}

export default function NewProductWorkflowPage() {
  const isAr = true;
  const locale: Locale = 'ar';

  // Step 1: Selected Product Type
  const [selectedType, setSelectedType] = useState<ProductType>('gift_box');

  // Common Fields
  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [shortDescAr, setShortDescAr] = useState('');
  const [shortDescEn, setShortDescEn] = useState('');
  const [fullDescAr, setFullDescAr] = useState('');
  const [fullDescEn, setFullDescEn] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [discountedPrice, setDiscountedPrice] = useState('');
  const [sku, setSku] = useState('');
  const [inventory, setInventory] = useState('25');
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [uploadedMedia, setUploadedMedia] = useState<
    Array<{ url: string; fileId: string; name: string; fileType?: string; isCover?: boolean }>
  >([]);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedProductId, setSavedProductId] = useState<string | null>(null);

  // Real catalog products for Option B in Box Contents Builder
  const [catalogOptions, setCatalogOptions] = useState<RealCatalogOption[]>([]);
  const [catalogSearch, setCatalogSearch] = useState('');

  // ----------------------------------------------------
  // 1. GIFT BOX WORKFLOW STATES
  // ----------------------------------------------------
  const [targetAudience, setTargetAudience] = useState<GiftBoxAudience>('women');
  const [boxContents, setBoxContents] = useState<GiftBoxItem[]>([
    {
      id: 'ext-1',
      source: 'external',
      name: { ar: 'ورد طبيعي دائم (Eternal Rose)', en: 'Eternal Preserved Rose' },
      description: { ar: 'وردة طبيعية مجهزة لتدوم لأكثر من عام', en: 'Preserved rose that lasts over a year' },
      quantity: 1,
      order: 1,
    },
    {
      id: 'ext-2',
      source: 'external',
      name: { ar: 'كارت إهداء كلاسيكي مختوم بالشمع', en: 'Wax-Sealed Greeting Card' },
      description: { ar: 'كارت فاخر يُكتب عليه رسالة العميل', en: 'Luxury card inscribed with custom message' },
      quantity: 1,
      order: 2,
    },
  ]);

  // External item draft input
  const [extNameAr, setExtNameAr] = useState('');
  const [extNameEn, setExtNameEn] = useState('');
  const [extQty, setExtQty] = useState('1');
  const [extDescAr, setExtDescAr] = useState('');

  // ----------------------------------------------------
  // 2. STANDARD PRODUCT WORKFLOW STATES
  // ----------------------------------------------------
  const [attributes, setAttributes] = useState<ProductAttribute[]>([
    {
      id: 'size',
      name: { ar: 'المقاس', en: 'Size' },
      values: [
        { id: 's', label: { ar: 'صغير (S)', en: 'Small' } },
        { id: 'm', label: { ar: 'وسط (M)', en: 'Medium' } },
        { id: 'l', label: { ar: 'كبير (L)', en: 'Large' } },
      ],
    },
    {
      id: 'color',
      name: { ar: 'اللون', en: 'Color' },
      values: [
        { id: 'black', label: { ar: 'أسود ملوكي', en: 'Matte Black' }, colorHex: '#111111' },
        { id: 'silver', label: { ar: 'فضي لامع', en: 'Polished Silver' }, colorHex: '#E5E5E5' },
      ],
    },
  ]);

  const [newAttrAr, setNewAttrAr] = useState('');
  const [newAttrEn, setNewAttrEn] = useState('');

  const [variantsMatrix, setVariantsMatrix] = useState<ProductVariantCombination[]>([
    { id: 'v1', attributes: { size: 's', color: 'black' }, sku: 'GIV-S-BLK', price: 350, stock: 15, isAvailable: true },
    { id: 'v2', attributes: { size: 'm', color: 'black' }, sku: 'GIV-M-BLK', price: 350, stock: 20, isAvailable: true },
    { id: 'v3', attributes: { size: 'l', color: 'black' }, sku: 'GIV-L-BLK', price: 380, stock: 10, isAvailable: true },
    { id: 'v4', attributes: { size: 's', color: 'silver' }, sku: 'GIV-S-SLV', price: 350, stock: 8, isAvailable: true },
    { id: 'v5', attributes: { size: 'm', color: 'silver' }, sku: 'GIV-M-SLV', price: 350, stock: 12, isAvailable: true },
    { id: 'v6', attributes: { size: 'l', color: 'silver' }, sku: 'GIV-L-SLV', price: 380, stock: 5, isAvailable: true },
  ]);

  // ----------------------------------------------------
  // 3. PRINTED PRODUCT CUSTOMIZATION SCHEMA
  // ----------------------------------------------------
  const [printedConfig, setPrintedConfig] = useState<PrintedProductCustomization>({
    requiredCustomerText: true,
    textLabel: { ar: 'النص المطلوب طباعته (اسم / إهداء)', en: 'Custom Text or Name' },
    textMaxLength: 40,
    allowCustomerImage: true,
    imageUploadPrompt: { ar: 'ارفع صورة شخصية أو تصميم عالي الدقة', en: 'Upload your photo or reference design' },
    printPositions: [
      { id: 'front', label: { ar: 'الجهة الأمامية', en: 'Front Side' }, priceModifier: 0 },
      { id: 'both', label: { ar: 'الجهتان (الأمام والخلف)', en: 'Both Sides' }, priceModifier: 30 },
    ],
    specialInstructionsAllowed: true,
    customizationFee: 0,
  });

  // ----------------------------------------------------
  // 4. ENGRAVED PRODUCT CUSTOMIZATION SCHEMA
  // ----------------------------------------------------
  const [engravedConfig, setEngravedConfig] = useState<EngravedProductCustomization>({
    requireNameToEngrave: true,
    nameLabel: { ar: 'الاسم أو الكلمة المطلوب حفرها بالليزر', en: 'Name or Word for Laser Engraving' },
    allowDate: true,
    dateLabel: { ar: 'تاريخ الذكرى السعيدة (اختياري)', en: 'Anniversary Date (Optional)' },
    fontOptions: [
      { id: 'ruqaa', label: { ar: 'خط رقعة كلاسيكي', en: 'Classic Ruqaa Arabic' } },
      { id: 'diwani', label: { ar: 'خط ديواني فخم', en: 'Royal Diwani Arabic' } },
      { id: 'naskh', label: { ar: 'خط نسخ عصري', en: 'Modern Naskh Arabic' } },
      { id: 'script', label: { ar: 'English Modern Script', en: 'English Modern Script' } },
    ],
    engravingPositions: [
      { id: 'outside', label: { ar: 'من الخارج بشكل بارز', en: 'Exterior Face' }, priceModifier: 0 },
      { id: 'inside', label: { ar: 'من الداخل (سري وخاص)', en: 'Interior (Secret)' }, priceModifier: 25 },
    ],
    allowReferenceImage: true,
    specialInstructionsAllowed: true,
    customizationFee: 0,
  });

  // Fetch real catalog products from Firestore on mount
  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const snap = await getDocs(collection(db, COLLECTIONS.PRODUCTS));
        const list: RealCatalogOption[] = snap.docs.map((d) => {
          const data = d.data();
          const pNameAr = typeof data.name === 'object' ? data.name?.ar : data.name || '';
          const pNameEn = typeof data.name === 'object' ? data.name?.en : data.name || '';
          const firstImg = data.images?.[0];
          return {
            id: d.id,
            nameAr: pNameAr,
            nameEn: pNameEn,
            price: data.basePrice ?? data.price ?? 0,
            image: typeof firstImg === 'string' ? firstImg : firstImg?.url || '',
          };
        });
        setCatalogOptions(list);
      } catch (err) {
        console.error('Failed to load existing catalog products:', err);
      }
    };
    fetchCatalog();
  }, []);

  // Handle auto translate
  const handleAutoTranslate = async () => {
    setIsTranslating(true);
    try {
      if (nameAr && !nameEn) {
        const res = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: nameAr, from: 'ar', to: 'en' }),
        });
        const data = await res.json();
        if (data.translatedText) setNameEn(data.translatedText);
      }
      if (shortDescAr && !shortDescEn) {
        const res = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: shortDescAr, from: 'ar', to: 'en' }),
        });
        const data = await res.json();
        if (data.translatedText) setShortDescEn(data.translatedText);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsTranslating(false);
    }
  };

  // Add external item to box
  const addExternalItemToBox = () => {
    if (!extNameAr) return;
    const newItem: GiftBoxItem = {
      id: `ext-${Date.now()}`,
      source: 'external',
      name: { ar: extNameAr, en: extNameEn || extNameAr },
      description: extDescAr ? { ar: extDescAr, en: extDescAr } : undefined,
      quantity: parseInt(extQty) || 1,
      order: boxContents.length + 1,
    };
    setBoxContents([...boxContents, newItem]);
    setExtNameAr('');
    setExtNameEn('');
    setExtQty('1');
    setExtDescAr('');
  };

  // Add catalog product to box
  const addCatalogProductToBox = (prod: RealCatalogOption) => {
    const newItem: GiftBoxItem = {
      id: `cat-${prod.id}-${Date.now()}`,
      source: 'catalog',
      productId: prod.id,
      name: { ar: prod.nameAr, en: prod.nameEn || prod.nameAr },
      quantity: 1,
      order: boxContents.length + 1,
    };
    setBoxContents([...boxContents, newItem]);
  };

  // Remove box item
  const removeBoxItem = (id: string) => {
    setBoxContents(boxContents.filter((item) => item.id !== id));
  };

  // Add attribute
  const addAttribute = () => {
    if (!newAttrAr) return;
    const newId = `attr-${Date.now()}`;
    setAttributes([
      ...attributes,
      {
        id: newId,
        name: { ar: newAttrAr, en: newAttrEn || newAttrAr },
        values: [],
      },
    ]);
    setNewAttrAr('');
    setNewAttrEn('');
  };

  // ImageKit Media Handlers
  const handleMediaUpload = (item: UploadedMediaItem) => {
    setUploadedMedia((prev) => {
      const isFirst = prev.length === 0;
      return [
        ...prev,
        {
          url: item.url,
          fileId: item.fileId,
          name: item.name,
          fileType: item.fileType,
          isCover: isFirst,
        },
      ];
    });
  };

  const setCoverImage = (index: number) => {
    setUploadedMedia((prev) =>
      prev.map((item, idx) => ({ ...item, isCover: idx === index }))
    );
  };

  const removeMedia = (index: number) => {
    setUploadedMedia((prev) => {
      const next = prev.filter((_, idx) => idx !== index);
      if (next.length > 0 && !next.some((m) => m.isCover)) {
        next[0].isCover = true;
      }
      return next;
    });
  };

  // Save product to real Firestore
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameAr.trim()) {
      alert(isAr ? 'يرجى إدخال اسم المنتج بالعربية' : 'Please enter Arabic product name');
      return;
    }
    if (!basePrice.trim()) {
      alert(isAr ? 'يرجى إدخال السعر الأصلي' : 'Please enter base price');
      return;
    }

    setIsSaving(true);
    try {
      const newId = `prod_${Date.now()}`;
      const slugAr = nameAr.trim().replace(/\s+/g, '-');
      const slugEn = (nameEn || nameAr).trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const generatedSku = sku.trim() || `GIV-${selectedType.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`;

      const productPayload: Record<string, any> = {
        id: newId,
        name: { ar: nameAr.trim(), en: (nameEn || nameAr).trim() },
        slug: { ar: slugAr, en: slugEn },
        shortDescription: { ar: shortDescAr.trim(), en: (shortDescEn || shortDescAr).trim() },
        description: { ar: fullDescAr.trim(), en: (fullDescEn || fullDescAr).trim() },
        basePrice: parseFloat(basePrice) || 0,
        discountedPrice: discountedPrice ? parseFloat(discountedPrice) : null,
        sku: generatedSku,
        inventory: parseInt(inventory) || 0,
        status,
        productType: selectedType,
        type: selectedType === 'gift_box' ? 'gift-box' : 'physical',
        mainCategory: selectedType === 'gift_box' ? 'gift-boxes' : 'trending-gifts',
        images: uploadedMedia.map((m) => ({
          url: m.url,
          fileId: m.fileId,
          isCover: !!m.isCover,
          alt: { ar: nameAr, en: nameEn || nameAr },
        })),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (selectedType === 'gift_box') {
        productPayload.targetAudience = targetAudience;
        productPayload.boxContents = boxContents;
      } else if (selectedType === 'standard') {
        productPayload.attributes = attributes;
        productPayload.variants = variantsMatrix;
      } else if (selectedType === 'printed') {
        productPayload.printedConfig = printedConfig;
      } else if (selectedType === 'engraved') {
        productPayload.engravedConfig = engravedConfig;
      }

      await setDoc(doc(collection(db, COLLECTIONS.PRODUCTS), newId), productPayload);
      setSavedProductId(newId);
    } catch (err: any) {
      console.error('Failed to save product to Firestore:', err);
      alert(isAr ? 'حدث خطأ أثناء حفظ المنتج في قاعدة البيانات' : 'Failed to save product');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-3">
          <Link href={`/${locale}/admin/products`}>
            <button className="p-2 rounded-sm border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors">
              <ArrowRight className="h-4 w-4" />
            </button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-neutral-900 dark:text-white">
              {isAr ? 'إضافة منتج جديد وتحديد مسار الصنع' : 'Create New Product'}
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {isAr
                ? 'حفظ فوري ومباشر في قاعدة بيانات جيفورا ورفع الصور ومقاطع الفيديو على ImageKit CDN'
                : 'Direct persistence to live Firestore database and media assets on ImageKit CDN'}
            </p>
          </div>
        </div>
      </div>

      {/* Success Notification Banner */}
      {savedProductId && (
        <div className="p-5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                {isAr ? 'تم حفظ المنتج بنجاح وتفعيله في قاعدة البيانات!' : 'Product saved successfully!'}
              </p>
              <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">
                {isAr ? `معرف الصنف: ${savedProductId}` : `Product ID: ${savedProductId}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/${locale}/products/${savedProductId}`} target="_blank">
              <Button size="sm" variant="outline" rightIcon={<ExternalLink className="h-3.5 w-3.5" />}>
                {isAr ? 'معاينة في المتجر' : 'View in Store'}
              </Button>
            </Link>
            <Link href={`/${locale}/admin/products`}>
              <Button size="sm" variant="primary">
                {isAr ? 'كتالوج المنتجات' : 'Products List'}
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* STEP 1: PRODUCT TYPE SELECTION */}
      <div className="space-y-3">
        <label className="text-xs font-bold tracking-wider uppercase text-neutral-500 dark:text-neutral-400">
          {isAr ? '1. اختر مسار الصنع ونوع المنتج' : '1. Select Product Workflow'}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              type: 'gift_box' as ProductType,
              icon: Gift,
              title: isAr ? 'بوكس هدايا فاخر' : 'Luxury Gift Box',
              desc: isAr ? 'بوكس مركب يشمل مكونات مختارة وكارت إهداء وتغليف راقي' : 'Curated box with items and card',
            },
            {
              type: 'standard' as ProductType,
              icon: Package,
              title: isAr ? 'منتج قياسي بمتغيرات' : 'Standard Product',
              desc: isAr ? 'منتج جاهز بمقاسات وألوان وخيارات متعددة ومخزون لكل متغير' : 'Ready product with variants',
            },
            {
              type: 'printed' as ProductType,
              icon: Printer,
              title: isAr ? 'منتج مطبوع مخصص' : 'Custom Printed Gift',
              desc: isAr ? 'طباعة صور أو نصوص على مجات أو تابلوهات أو كروت' : 'Photo & text prints on items',
            },
            {
              type: 'engraved' as ProductType,
              icon: Sparkles,
              title: isAr ? 'منتج محفور بالليزر' : 'Laser Engraved Gift',
              desc: isAr ? 'حفر أسماء وتواريخ على مجوهرات أو إكسسوارات أو محافظ' : 'Engrave names & dates on jewelry',
            },
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = selectedType === item.type;
            return (
              <button
                key={item.type}
                type="button"
                onClick={() => setSelectedType(item.type)}
                className={`p-4 rounded-sm border text-start cursor-pointer transition-all ${
                  isSelected
                    ? 'border-black dark:border-white bg-black/5 dark:bg-white/5 shadow-xs ring-1 ring-black dark:ring-white'
                    : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#1A1A1A] hover:border-neutral-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`w-8 h-8 rounded-sm flex items-center justify-center ${
                      isSelected
                        ? 'bg-black text-white dark:bg-white dark:text-black'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  {isSelected && <Check className="h-4 w-4 text-neutral-900 dark:text-white" />}
                </div>
                <div className="mt-3">
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white">{item.title}</h3>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 leading-snug">{item.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP 2: SPECIALIZED PRODUCT FORM */}
      <form onSubmit={handleSaveProduct} className="space-y-8">
        {/* COMMON BASIC INFORMATION */}
        <div className="bg-white dark:bg-[#1A1A1A] border border-neutral-200 dark:border-neutral-800 rounded-sm p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
            <h2 className="text-sm font-bold tracking-wider uppercase text-neutral-900 dark:text-white">
              {isAr ? '2. المعلومات الأساسية والتسعير' : '2. Basic Info & Pricing'}
            </h2>
            <button
              type="button"
              onClick={handleAutoTranslate}
              disabled={isTranslating}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-sm border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200"
            >
              <RefreshCw className={`h-3 w-3 ${isTranslating ? 'animate-spin' : ''}`} />
              <span>{isAr ? 'ترجمة آلية ذكية (مصري / إنجليزي)' : 'Auto Translate'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={isAr ? 'اسم المنتج بالعربية' : 'Arabic Name'}
              placeholder={isAr ? 'مثال: بوكس الورد الملكي الفاخر' : 'Product name in Arabic'}
              value={nameAr}
              onChange={(e) => setNameAr(e.target.value)}
              required
            />
            <Input
              label={isAr ? 'اسم المنتج بالإنجليزية' : 'English Name'}
              placeholder="e.g. Royal Luxury Rose Box"
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Textarea
              label={isAr ? 'وصف مختصر (عربي)' : 'Short Description (Arabic)'}
              value={shortDescAr}
              onChange={(e) => setShortDescAr(e.target.value)}
              placeholder={isAr ? 'سطرين يوضحوا سر تميز الهدية للمشتري' : 'Brief appealing summary'}
              rows={2}
            />
            <Textarea
              label={isAr ? 'وصف مختصر (إنجليزي)' : 'Short Description (English)'}
              value={shortDescEn}
              onChange={(e) => setShortDescEn(e.target.value)}
              placeholder="Brief summary in English"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Textarea
              label={isAr ? 'الوصف التفصيلي الكامل (عربي)' : 'Full Description (Arabic)'}
              value={fullDescAr}
              onChange={(e) => setFullDescAr(e.target.value)}
              placeholder={isAr ? 'تفاصيل المكونات، المقاسات، والمزايا التنافسية' : 'Full details and features'}
              rows={3}
            />
            <Textarea
              label={isAr ? 'الوصف التفصيلي الكامل (إنجليزي)' : 'Full Description (English)'}
              value={fullDescEn}
              onChange={(e) => setFullDescEn(e.target.value)}
              placeholder="Full details and features in English"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <Input
              label={isAr ? 'السعر الأصلي (ج.م)' : 'Base Price (EGP)'}
              type="number"
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
              placeholder="650"
              required
            />
            <Input
              label={isAr ? 'سعر العرض أو الخصم (ج.م)' : 'Sale Price (EGP)'}
              type="number"
              value={discountedPrice}
              onChange={(e) => setDiscountedPrice(e.target.value)}
              placeholder="550"
            />
            <Input
              label={isAr ? 'كود الصنف (SKU)' : 'SKU'}
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              placeholder="GIV-BOX-01"
            />
            <Input
              label={isAr ? 'الكمية المتاحة بالمخزن' : 'Stock Quantity'}
              type="number"
              value={inventory}
              onChange={(e) => setInventory(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center gap-4 pt-2">
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              {isAr ? 'حالة النشر:' : 'Publish Status:'}
            </label>
            <div className="inline-flex gap-2">
              <button
                type="button"
                onClick={() => setStatus('published')}
                className={`px-3 py-1 text-xs font-bold rounded-xs transition-colors ${
                  status === 'published'
                    ? 'bg-black text-white dark:bg-white dark:text-black'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                }`}
              >
                {isAr ? 'منشور فوري' : 'Published'}
              </button>
              <button
                type="button"
                onClick={() => setStatus('draft')}
                className={`px-3 py-1 text-xs font-bold rounded-xs transition-colors ${
                  status === 'draft'
                    ? 'bg-black text-white dark:bg-white dark:text-black'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                }`}
              >
                {isAr ? 'مسودة' : 'Draft'}
              </button>
            </div>
          </div>
        </div>

        {/* MEDIA UPLOADER (IMAGEKIT CDN) */}
        <div className="bg-white dark:bg-[#1A1A1A] border border-neutral-200 dark:border-neutral-800 rounded-sm p-6 space-y-5">
          <div className="border-b border-neutral-100 dark:border-neutral-800 pb-3">
            <h2 className="text-sm font-bold tracking-wider uppercase text-neutral-900 dark:text-white">
              {isAr ? '3. وسائط وصور المنتج (ImageKit CDN)' : '3. Product Media & Videos'}
            </h2>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
              {isAr
                ? 'ارفع صور ومقاطع فيديو المنتج بجودة فائقة ليتم تخزينها وبثها عبر سيرفر ImageKit السريع.'
                : 'Upload ultra-high resolution photos and short videos to ImageKit CDN.'}
            </p>
          </div>

          <ImageKitUploader
            onUploadSuccess={handleMediaUpload}
            folder="/givora/products"
            label={isAr ? 'رفع ملف وسائط جديد (صورة أو فيديو قصير)' : 'Upload media file'}
          />

          {/* Uploaded media previews */}
          {uploadedMedia.length > 0 && (
            <div className="space-y-2 pt-3">
              <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                {isAr ? `الملفات المرفوعة (${uploadedMedia.length}):` : `Uploaded Files (${uploadedMedia.length}):`}
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {uploadedMedia.map((media, idx) => (
                  <div
                    key={media.fileId || idx}
                    className={`relative rounded-sm overflow-hidden border p-1 bg-neutral-50 dark:bg-neutral-900 ${
                      media.isCover
                        ? 'border-black dark:border-white ring-1 ring-black dark:ring-white'
                        : 'border-neutral-200 dark:border-neutral-800'
                    }`}
                  >
                    <div className="relative aspect-square w-full rounded-xs overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                      {media.fileType === 'video' ? (
                        <div className="w-full h-full flex items-center justify-center text-neutral-500">
                          <Film className="h-6 w-6" />
                        </div>
                      ) : (
                        <Image src={media.url} alt={media.name} fill className="object-cover" />
                      )}
                    </div>
                    <div className="mt-1.5 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setCoverImage(idx)}
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-xs transition-colors ${
                          media.isCover
                            ? 'bg-black text-white dark:bg-white dark:text-black'
                            : 'text-neutral-500 hover:text-black dark:hover:text-white'
                        }`}
                        title={isAr ? 'تعيين كغلاف رئيسي' : 'Set as main cover'}
                      >
                        {media.isCover ? (isAr ? 'الغلاف' : 'Cover') : (isAr ? 'اجعلها غلاف' : 'Set cover')}
                      </button>
                      <button
                        type="button"
                        onClick={() => removeMedia(idx)}
                        className="text-neutral-400 hover:text-red-500 p-1"
                        title={isAr ? 'حذف' : 'Remove'}
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* WORKFLOW A: GIFT BOX SPECIALIZED BUILDER */}
        {selectedType === 'gift_box' && (
          <div className="bg-white dark:bg-[#1A1A1A] border border-neutral-200 dark:border-neutral-800 rounded-sm p-6 space-y-6">
            <div className="border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <h2 className="text-sm font-bold tracking-wider uppercase text-neutral-900 dark:text-white">
                {isAr ? '4. إعدادات بوكس الهدايا والجمهور المستهدف' : '4. Gift Box Audience & Builder'}
              </h2>
            </div>

            {/* Target Audience Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                {isAr ? 'الفئة المستهدفة للبوكس (إلزامي)' : 'Target Audience (Mandatory)'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'women' as GiftBoxAudience, ar: 'بوكس حريمي', en: "Women's Box" },
                  { id: 'men' as GiftBoxAudience, ar: 'بوكس رجالي', en: "Men's Box" },
                  { id: 'couples' as GiftBoxAudience, ar: 'بوكس كابلز / رومانسي', en: "Couples Box" },
                  { id: 'unisex' as GiftBoxAudience, ar: 'بوكس للجميع', en: 'Unisex Box' },
                ].map((aud) => (
                  <button
                    key={aud.id}
                    type="button"
                    onClick={() => setTargetAudience(aud.id)}
                    className={`py-2 px-3 rounded-xs border text-xs font-semibold cursor-pointer transition-colors ${
                      targetAudience === aud.id
                        ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white'
                        : 'bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700'
                    }`}
                  >
                    {isAr ? aud.ar : aud.en}
                  </button>
                ))}
              </div>
            </div>

            {/* BOX CONTENTS BUILDER (External + Catalog) */}
            <div className="space-y-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
              <div>
                <h3 className="text-xs font-bold tracking-wider uppercase text-neutral-900 dark:text-white">
                  {isAr ? 'محتويات البوكس (Box Contents Builder)' : 'Box Contents Builder'}
                </h3>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                  {isAr
                    ? 'يمكنك إضافة عناصر خارجية خاصة بالبوكس، أو منتجات جاهزة من كتالوج المتجر، أو المزج بينهما.'
                    : 'Add external custom items, link existing website products, or mix both together.'}
                </p>
              </div>

              {/* Option A: Add External Item */}
              <div className="p-4 rounded-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3">
                <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                  {isAr ? '+ إضافة عنصر خارجي (غير موجود كمنتج منفصل في المتجر)' : '+ Option A: Add External Item'}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <Input
                    placeholder={isAr ? 'اسم العنصر (مثال: برطمان رسائل)' : 'Item name (Ar)'}
                    value={extNameAr}
                    onChange={(e) => setExtNameAr(e.target.value)}
                  />
                  <Input
                    placeholder={isAr ? 'الاسم بالإنجليزية (اختياري)' : 'Item name (En)'}
                    value={extNameEn}
                    onChange={(e) => setExtNameEn(e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder={isAr ? 'العدد' : 'Qty'}
                    value={extQty}
                    onChange={(e) => setExtQty(e.target.value)}
                  />
                  <Button type="button" onClick={addExternalItemToBox} variant="outline" size="sm">
                    {isAr ? 'إدراج بالبوكس' : 'Add to Box'}
                  </Button>
                </div>
              </div>

              {/* Option B: Add From Real Catalog */}
              <div className="p-4 rounded-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3">
                <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                  {isAr ? '+ إضافة منتج جاهز من كتالوج المتجر' : '+ Option B: Add from Store Catalog'}
                </span>
                <div className="max-w-md">
                  <Input
                    placeholder={isAr ? 'بحث في كتالوج المتجر...' : 'Search catalog products...'}
                    value={catalogSearch}
                    onChange={(e) => setCatalogSearch(e.target.value)}
                    leftElement={<Search className="h-4 w-4" />}
                  />
                </div>
                <div className="flex flex-wrap gap-2 pt-1 max-h-48 overflow-y-auto">
                  {catalogOptions
                    .filter(
                      (p) =>
                        !catalogSearch ||
                        p.nameAr.includes(catalogSearch) ||
                        p.nameEn.toLowerCase().includes(catalogSearch.toLowerCase())
                    )
                    .map((catProd) => (
                      <button
                        key={catProd.id}
                        type="button"
                        onClick={() => addCatalogProductToBox(catProd)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:border-black dark:hover:border-white rounded-xs transition-colors cursor-pointer"
                      >
                        <Plus className="h-3 w-3" />
                        <span>{isAr ? catProd.nameAr : catProd.nameEn}</span>
                        <span className="text-neutral-400">({catProd.price} ج.م)</span>
                      </button>
                    ))}
                  {catalogOptions.length === 0 && (
                    <p className="text-xs text-neutral-400">
                      {isAr ? 'لا توجد منتجات مسجلة في الكتالوج بعد' : 'No catalog products yet'}
                    </p>
                  )}
                </div>
              </div>

              {/* Complete Current Box Contents Table */}
              <div className="pt-2">
                <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                  {isAr
                    ? `المحتويات المعتمدة داخل هذا البوكس (${boxContents.length} عناصر):`
                    : `Active Box Contents (${boxContents.length} items):`}
                </p>
                <div className="divide-y divide-neutral-200 dark:border-neutral-800 border border-neutral-200 dark:border-neutral-800 rounded-sm bg-white dark:bg-[#1A1A1A]">
                  {boxContents.map((item, idx) => (
                    <div key={item.id} className="p-3 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <span className="w-5 text-neutral-400 font-mono">{idx + 1}.</span>
                        <Badge variant={item.source === 'catalog' ? 'default' : 'outline'}>
                          {item.source === 'catalog' ? (isAr ? 'منتج متجر' : 'Catalog') : (isAr ? 'عنصر خارجي' : 'External')}
                        </Badge>
                        <span className="font-semibold text-neutral-900 dark:text-white">
                          {isAr ? item.name.ar : item.name.en}
                        </span>
                        <span className="text-neutral-500">× {item.quantity}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeBoxItem(item.id)}
                        className="text-neutral-400 hover:text-red-500 p-1 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* WORKFLOW B: STANDARD PRODUCT DYNAMIC ATTRIBUTES & VARIANTS */}
        {selectedType === 'standard' && (
          <div className="bg-white dark:bg-[#1A1A1A] border border-neutral-200 dark:border-neutral-800 rounded-sm p-6 space-y-6">
            <div className="border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <h2 className="text-sm font-bold tracking-wider uppercase text-neutral-900 dark:text-white">
                {isAr ? '4. خيارات المنتج ومصفوفة المتغيرات (Options & Variants)' : '4. Product Options & Variants'}
              </h2>
            </div>

            {/* Configured Attributes */}
            <div className="space-y-3">
              {attributes.map((attr) => (
                <div
                  key={attr.id}
                  className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-sm bg-neutral-50 dark:bg-neutral-900 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-900 dark:text-white">
                      {isAr ? attr.name.ar : attr.name.en}
                    </span>
                    <Badge variant="outline">{attr.values.length} {isAr ? 'خيارات' : 'options'}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {attr.values.map((val) => (
                      <span
                        key={val.id}
                        className="px-2.5 py-1 text-xs bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xs font-medium text-neutral-800 dark:text-neutral-200"
                      >
                        {val.label.ar}
                      </span>
                    ))}
                  </div>
                </div>
              ))}

              <div className="flex gap-2 max-w-md pt-2">
                <Input
                  placeholder={isAr ? 'إضافة سمة جديدة (مثال: نوع المعدن)' : 'New attribute name'}
                  value={newAttrAr}
                  onChange={(e) => setNewAttrAr(e.target.value)}
                />
                <Button type="button" onClick={addAttribute} variant="outline" size="sm">
                  {isAr ? 'إضافة' : 'Add'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* WORKFLOW C: PRINTED PRODUCT CUSTOMIZATION BUILDER */}
        {selectedType === 'printed' && (
          <div className="bg-white dark:bg-[#1A1A1A] border border-neutral-200 dark:border-neutral-800 rounded-sm p-6 space-y-6">
            <div className="border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <h2 className="text-sm font-bold tracking-wider uppercase text-neutral-900 dark:text-white">
                {isAr ? '4. نموذج تخصيص المنتجات المطبوعة' : '4. Printed Product Customization Schema'}
              </h2>
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-900 dark:text-white">
                <input
                  type="checkbox"
                  checked={printedConfig.requiredCustomerText}
                  onChange={(e) => setPrintedConfig({ ...printedConfig, requiredCustomerText: e.target.checked })}
                  className="rounded-xs"
                />
                <span>{isAr ? 'إلزام العميل بكتابة نص أو اسم للطباعة' : 'Require customer text'}</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-900 dark:text-white">
                <input
                  type="checkbox"
                  checked={printedConfig.allowCustomerImage}
                  onChange={(e) => setPrintedConfig({ ...printedConfig, allowCustomerImage: e.target.checked })}
                  className="rounded-xs"
                />
                <span>{isAr ? 'إتاحة رفع صورة شخصية من العميل بدقة عالية' : 'Allow photo upload'}</span>
              </label>

              <div className="space-y-2 pt-2">
                <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  {isAr ? 'مواضع الطباعة المتاحة:' : 'Available Print Positions:'}
                </span>
                <div className="flex flex-wrap gap-2">
                  {printedConfig.printPositions?.map((pos) => (
                    <span
                      key={pos.id}
                      className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-xs text-xs font-medium border border-neutral-200 dark:border-neutral-700"
                    >
                      {pos.label.ar} (+{pos.priceModifier} ج.م)
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* WORKFLOW D: ENGRAVED PRODUCT CUSTOMIZATION BUILDER */}
        {selectedType === 'engraved' && (
          <div className="bg-white dark:bg-[#1A1A1A] border border-neutral-200 dark:border-neutral-800 rounded-sm p-6 space-y-6">
            <div className="border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <h2 className="text-sm font-bold tracking-wider uppercase text-neutral-900 dark:text-white">
                {isAr ? '4. نموذج تخصيص المنتجات المحفورة بالليزر' : '4. Engraved Product Customization Schema'}
              </h2>
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-900 dark:text-white">
                <input
                  type="checkbox"
                  checked={engravedConfig.requireNameToEngrave}
                  onChange={(e) => setEngravedConfig({ ...engravedConfig, requireNameToEngrave: e.target.checked })}
                  className="rounded-xs"
                />
                <span>{isAr ? 'إلزام العميل بإدخال الاسم المراد حفره' : 'Require Name for Engraving'}</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-900 dark:text-white">
                <input
                  type="checkbox"
                  checked={engravedConfig.allowDate}
                  onChange={(e) => setEngravedConfig({ ...engravedConfig, allowDate: e.target.checked })}
                  className="rounded-xs"
                />
                <span>{isAr ? 'تفعيل إدخال تاريخ الذكرى السعيدة' : 'Allow Anniversary Date Field'}</span>
              </label>

              <div className="space-y-2 pt-2">
                <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  {isAr ? 'أنواع الخطوط العربية والإنجليزية المتاحة للعميل:' : 'Available Engraving Fonts:'}
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {engravedConfig.fontOptions?.map((font) => (
                    <div
                      key={font.id}
                      className="p-2.5 rounded-xs border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-xs font-medium text-neutral-900 dark:text-white text-center"
                    >
                      {font.label.ar}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUBMIT BUTTON */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-200 dark:border-neutral-800">
          <Link href={`/${locale}/admin/products`}>
            <Button type="button" variant="outline">
              {isAr ? 'إلغاء' : 'Cancel'}
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <Button type="submit" variant="primary" size="lg" isLoading={isSaving}>
              {isAr ? 'حفظ وتفعيل المنتج في قاعدة البيانات' : 'Save & Publish Product'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
