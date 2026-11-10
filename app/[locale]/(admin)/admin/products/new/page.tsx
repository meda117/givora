'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Gift,
  Package,
  Printer,
  Sparkles,
  Upload,
  Plus,
  Trash2,
  Check,
  RefreshCw,
  Search,
  ExternalLink,
  Layers,
  SlidersHorizontal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import type {
  Locale,
  ProductType,
  GiftBoxAudience,
  GiftBoxItem,
  ProductAttribute,
  ProductVariantCombination,
  PrintedProductCustomization,
  EngravedProductCustomization,
  TranslationStatus,
} from '@/types';

// Mock existing catalog products for Option B in Box Contents Builder
const MOCK_EXISTING_CATALOG = [
  { id: 'cat-1', nameAr: 'سلسلة فضة عيار 925', nameEn: '925 Silver Necklace', price: 350, image: '' },
  { id: 'cat-2', nameAr: 'شوكولاتة بلجيكية فاخرة', nameEn: 'Belgian Truffles Box', price: 180, image: '' },
  { id: 'cat-3', nameAr: 'شمعة صويا عطرية برائحة الفانيليا', nameEn: 'Vanilla Scented Soy Candle', price: 140, image: '' },
  { id: 'cat-4', nameAr: 'ألبوم صور ميني جلدي', nameEn: 'Mini Leather Photo Album', price: 120, image: '' },
  { id: 'cat-5', nameAr: 'كوب سيراميك يدوي الصنع', nameEn: 'Handmade Ceramic Mug', price: 160, image: '' },
];

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
  const [images, setImages] = useState<string[]>([]);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

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

  // Catalog item search
  const [catalogSearch, setCatalogSearch] = useState('');

  const addExternalItem = () => {
    if (!extNameAr.trim()) return;
    const newItem: GiftBoxItem = {
      id: `ext-${Date.now()}`,
      source: 'external',
      name: { ar: extNameAr, en: extNameEn || extNameAr },
      description: { ar: extDescAr, en: '' },
      quantity: parseInt(extQty) || 1,
      order: boxContents.length + 1,
    };
    setBoxContents([...boxContents, newItem]);
    setExtNameAr('');
    setExtNameEn('');
    setExtDescAr('');
    setExtQty('1');
  };

  const addCatalogProductToBox = (catalogProduct: typeof MOCK_EXISTING_CATALOG[0]) => {
    const newItem: GiftBoxItem = {
      id: `cat-${Date.now()}`,
      source: 'catalog',
      productId: catalogProduct.id,
      productPrice: catalogProduct.price,
      name: { ar: catalogProduct.nameAr, en: catalogProduct.nameEn },
      quantity: 1,
      order: boxContents.length + 1,
    };
    setBoxContents([...boxContents, newItem]);
  };

  const removeBoxItem = (id: string) => {
    setBoxContents(boxContents.filter((item) => item.id !== id));
  };

  // ----------------------------------------------------
  // 2. STANDARD PRODUCT ATTRIBUTES & VARIANTS
  // ----------------------------------------------------
  const [attributes, setAttributes] = useState<ProductAttribute[]>([
    {
      id: 'size',
      name: { ar: 'المقاس', en: 'Size' },
      values: [
        { id: 's', label: { ar: 'صغير (S)', en: 'Small (S)' } },
        { id: 'm', label: { ar: 'متوسط (M)', en: 'Medium (M)' } },
        { id: 'l', label: { ar: 'كبير (L)', en: 'Large (L)' } },
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

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate API persistence
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
    }, 800);
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
              {isAr ? 'إضافة منتج جديد وتحديد المسار' : 'Create New Product'}
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {isAr
                ? 'اختر نوع المنتج لفتح النموذج المخصص والمتوافق مع متطلبات تصنيعه وتخصيصه'
                : 'Select the product type to activate its specialized management workflow'}
            </p>
          </div>
        </div>
      </div>

      {/* STEP 1: PRODUCT TYPE SELECTION */}
      <div className="space-y-3">
        <label className="text-xs font-bold tracking-wider uppercase text-neutral-500 dark:text-neutral-400">
          {isAr ? '1. اختر نوع المنتج' : '1. Select Product Type'}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              type: 'gift_box' as ProductType,
              title: isAr ? 'بوكس هدايا' : 'Gift Box',
              desc: isAr ? 'بوكس متكامل مع تحديد الفئة ومحتويات خارجية ومنتجات متجر' : 'Curated gift box with audience & mixed box builder',
              icon: Gift,
            },
            {
              type: 'standard' as ProductType,
              title: isAr ? 'منتج قياسي' : 'Standard Product',
              desc: isAr ? 'منتج فيزيائي مع مقاسات وألوان ومصفوفة متغيرات متقدمة' : 'Regular product with dynamic attributes & variants matrix',
              icon: Package,
            },
            {
              type: 'printed' as ProductType,
              title: isAr ? 'منتج مطبوع' : 'Printed Product',
              desc: isAr ? 'طباعة مخصصة مع رفع صور العميل واختيار مواضع الطباعة' : 'Custom thermal printing with image upload & text prompts',
              icon: Printer,
            },
            {
              type: 'engraved' as ProductType,
              title: isAr ? 'منتج محفور' : 'Engraved Product',
              desc: isAr ? 'حفر ليزر بالاسم والتواريخ مع اختيار نوع الخط وموضع الحفر' : 'Laser engraving with custom names, dates & font styles',
              icon: Sparkles,
            },
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = selectedType === item.type;
            return (
              <button
                key={item.type}
                type="button"
                onClick={() => setSelectedType(item.type)}
                className={`p-4 rounded-sm border text-start cursor-pointer transition-all duration-150 flex flex-col justify-between min-h-[130px] ${
                  isSelected
                    ? 'border-black dark:border-white bg-neutral-100 dark:bg-neutral-800 ring-1 ring-black dark:ring-white'
                    : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#1A1A1A] hover:border-neutral-400 dark:hover:border-neutral-600'
                }`}
              >
                <div className="flex items-center justify-between w-full">
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
        </div>

        {/* WORKFLOW A: GIFT BOX SPECIALIZED BUILDER */}
        {selectedType === 'gift_box' && (
          <div className="bg-white dark:bg-[#1A1A1A] border border-neutral-200 dark:border-neutral-800 rounded-sm p-6 space-y-6">
            <div className="border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <h2 className="text-sm font-bold tracking-wider uppercase text-neutral-900 dark:text-white">
                {isAr ? '3. إعدادات بوكس الهدايا والجمهور المستهدف' : '3. Gift Box Audience & Builder'}
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
                    placeholder={isAr ? 'اسم العنصر (عربي)' : 'Item name (Arabic)'}
                    value={extNameAr}
                    onChange={(e) => setExtNameAr(e.target.value)}
                  />
                  <Input
                    placeholder={isAr ? 'اسم العنصر (إنجليزي)' : 'Item name (English)'}
                    value={extNameEn}
                    onChange={(e) => setExtNameEn(e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder={isAr ? 'العدد' : 'Qty'}
                    value={extQty}
                    onChange={(e) => setExtQty(e.target.value)}
                  />
                  <Button type="button" variant="outline" size="md" onClick={addExternalItem}>
                    {isAr ? 'إضافة للبوكس' : 'Add Item'}
                  </Button>
                </div>
              </div>

              {/* Option B: Search & Select from Existing Catalog */}
              <div className="p-4 rounded-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3">
                <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                  {isAr ? '+ اختيار منتجات موجودة مسبقاً في كتالوج جيفورا' : '+ Option B: Select from Existing Catalog'}
                </span>
                <div className="relative">
                  <Input
                    placeholder={isAr ? 'ابحث في منتجات المتجر لإضافتها لمحتويات البوكس...' : 'Search existing products...'}
                    value={catalogSearch}
                    onChange={(e) => setCatalogSearch(e.target.value)}
                    leftElement={<Search className="h-4 w-4" />}
                  />
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {MOCK_EXISTING_CATALOG
                    .filter((p) => !catalogSearch || p.nameAr.includes(catalogSearch) || p.nameEn.toLowerCase().includes(catalogSearch.toLowerCase()))
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
                </div>
              </div>

              {/* Complete Current Box Contents Table */}
              <div className="pt-2">
                <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                  {isAr ? `المحتويات المعتمدة داخل هذا البوكس (${boxContents.length} عناصر):` : `Active Box Contents (${boxContents.length} items):`}
                </p>
                <div className="divide-y divide-neutral-200 dark:divide-neutral-800 border border-neutral-200 dark:border-neutral-800 rounded-sm bg-white dark:bg-[#1A1A1A]">
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
                {isAr ? '3. خيارات المنتج ومصفوفة المتغيرات (Options & Variants)' : '3. Product Options & Variants'}
              </h2>
            </div>

            {/* Configured Attributes */}
            <div className="space-y-3">
              {attributes.map((attr) => (
                <div key={attr.id} className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-sm bg-neutral-50 dark:bg-neutral-900 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-900 dark:text-white">
                      {isAr ? attr.name.ar : attr.name.en} ({attr.values.length} {isAr ? 'قيم' : 'values'})
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {attr.values.map((val) => (
                      <span
                        key={val.id}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xs"
                      >
                        {val.colorHex && (
                          <span className="w-2.5 h-2.5 rounded-full border border-neutral-300" style={{ backgroundColor: val.colorHex }} />
                        )}
                        <span>{isAr ? val.label.ar : val.label.en}</span>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Generated Combinations Matrix */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-neutral-900 dark:text-white">
                {isAr ? 'مصفوفة المتغيرات والأسعار والمخزون:' : 'Variants Pricing & Stock Matrix:'}
              </span>
              <div className="overflow-x-auto border border-neutral-200 dark:border-neutral-800 rounded-sm">
                <table className="w-full text-xs text-start">
                  <thead className="bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 uppercase">
                    <tr>
                      <th className="p-2.5 text-start">{isAr ? 'المتغير' : 'Variant'}</th>
                      <th className="p-2.5 text-start">{isAr ? 'كود الصنف SKU' : 'SKU'}</th>
                      <th className="p-2.5 text-start">{isAr ? 'السعر (ج.م)' : 'Price (EGP)'}</th>
                      <th className="p-2.5 text-start">{isAr ? 'المخزون' : 'Stock'}</th>
                      <th className="p-2.5 text-start">{isAr ? 'الحالة' : 'Status'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 bg-white dark:bg-[#1A1A1A]">
                    {variantsMatrix.map((vm) => (
                      <tr key={vm.id}>
                        <td className="p-2.5 font-medium text-neutral-900 dark:text-white">
                          {Object.entries(vm.attributes)
                            .map(([k, v]) => `${k.toUpperCase()}: ${v.toUpperCase()}`)
                            .join(' / ')}
                        </td>
                        <td className="p-2.5">
                          <input
                            type="text"
                            value={vm.sku}
                            className="w-28 p-1 border border-neutral-200 dark:border-neutral-700 rounded-xs text-xs bg-transparent"
                            readOnly
                          />
                        </td>
                        <td className="p-2.5">
                          <input
                            type="number"
                            value={vm.price}
                            className="w-20 p-1 border border-neutral-200 dark:border-neutral-700 rounded-xs text-xs bg-transparent"
                            readOnly
                          />
                        </td>
                        <td className="p-2.5">
                          <input
                            type="number"
                            value={vm.stock}
                            className="w-16 p-1 border border-neutral-200 dark:border-neutral-700 rounded-xs text-xs bg-transparent"
                            readOnly
                          />
                        </td>
                        <td className="p-2.5">
                          <Badge variant="success">{isAr ? 'نشط' : 'Active'}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* WORKFLOW C: PRINTED PRODUCT CUSTOMIZATION BUILDER */}
        {selectedType === 'printed' && (
          <div className="bg-white dark:bg-[#1A1A1A] border border-neutral-200 dark:border-neutral-800 rounded-sm p-6 space-y-6">
            <div className="border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <h2 className="text-sm font-bold tracking-wider uppercase text-neutral-900 dark:text-white">
                {isAr ? '3. نموذج تخصيص المنتجات المطبوعة للعميل' : '3. Printed Product Customization Schema'}
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
                <span>{isAr ? 'إلزام العميل بإدخال نص أو اسم للطباعة' : 'Require customer to enter custom text'}</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label={isAr ? 'عنوان حقل النص المطلوب' : 'Text Prompt Label'}
                  value={printedConfig.textLabel.ar}
                  onChange={(e) =>
                    setPrintedConfig({
                      ...printedConfig,
                      textLabel: { ...printedConfig.textLabel, ar: e.target.value },
                    })
                  }
                />
                <Input
                  label={isAr ? 'أقصى عدد أحرف مسموح' : 'Max Character Length'}
                  type="number"
                  value={printedConfig.textMaxLength || 40}
                  onChange={(e) =>
                    setPrintedConfig({ ...printedConfig, textMaxLength: parseInt(e.target.value) || 40 })
                  }
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-900 dark:text-white pt-2">
                <input
                  type="checkbox"
                  checked={printedConfig.allowCustomerImage}
                  onChange={(e) => setPrintedConfig({ ...printedConfig, allowCustomerImage: e.target.checked })}
                  className="rounded-xs"
                />
                <span>{isAr ? 'السماح للعميل برفع صورة أو تصميم للطباعة الحرارية' : 'Allow customer to upload custom photo/design'}</span>
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
                {isAr ? '3. نموذج تخصيص المنتجات المحفورة بالليزر' : '3. Engraved Product Customization Schema'}
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
            {saveSuccess && (
              <span className="text-xs font-semibold text-neutral-900 dark:text-white">
                ✓ {isAr ? 'تم حفظ المنتج بنجاح!' : 'Product saved successfully!'}
              </span>
            )}
            <Button type="submit" variant="primary" size="lg" isLoading={isSaving}>
              {isAr ? 'حفظ وتفعيل المنتج' : 'Save & Publish Product'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
