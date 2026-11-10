'use client';
import { useState } from 'react';
import { Globe, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Locale } from '@/types';

export default function AdminSEOPage() {
  const isAr = true;
  const locale: Locale = 'ar';

  const [metaTitleAr, setMetaTitleAr] = useState('جيفورا | متجر الهدايا الفاخرة والتجارب الرقمية');
  const [metaTitleEn, setMetaTitleEn] = useState('Givora | Luxury Gift Store & Digital Experiences');
  const [metaDescAr, setMetaDescAr] = useState('اكتشف أجمل بوكسات الهدايا الفاخرة والهدايا الشخصية والتجارب الرقمية والدعوات الإلكترونية من جيفورا.');
  const [metaDescEn, setMetaDescEn] = useState('Discover premium curated gift boxes, personalized gifts, and unforgettable digital experiences at Givora.');
  const [keywords, setKeywords] = useState('هدايا, بوكسات هدايا, هدايا شخصية, هدايا رقمية, دعوات زفاف, luxury gifts, gift boxes');
  const [ogImage, setOgImage] = useState('https://ik.imagekit.io/givora/seo/og-cover.jpg');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-charcoal">
            {isAr ? 'إدارة تحسين محركات البحث (SEO)' : 'SEO Management'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {isAr
              ? 'ضبط العناوين والأوصاف الترويجية والكلمات المفتاحية وصور المشاركة بالعربية والإنجليزية'
              : 'Configure multilingual titles, meta descriptions, and OpenGraph social preview images'}
          </p>
        </div>
        {savedSuccess && (
          <span className="text-xs text-green-600 bg-green-50 px-3 py-1.5 rounded font-medium flex items-center gap-1">
            <Check className="h-3.5 w-3.5" /> {isAr ? 'تم حفظ إعدادات SEO' : 'Saved'}
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="bg-white p-6 rounded-sm border border-gray-100 space-y-5">
        <h2 className="text-sm font-semibold text-charcoal border-b pb-3">
          {isAr ? 'بيانات الميتا الرئيسية للمتجر' : 'Global Meta Tags'}
        </h2>

        <div className="space-y-4">
          <Input
            label={isAr ? 'عنوان الموقع في جوجل (بالعربية)' : 'SEO Title (Arabic)'}
            value={metaTitleAr}
            onChange={(e) => setMetaTitleAr(e.target.value)}
            required
          />
          <Input
            label={isAr ? 'عنوان الموقع في جوجل (بالإنجليزية)' : 'SEO Title (English)'}
            value={metaTitleEn}
            onChange={(e) => setMetaTitleEn(e.target.value)}
            dir="ltr"
          />
          <Textarea
            label={isAr ? 'وصف الموقع في نتائج البحث (بالعربية)' : 'Meta Description (Arabic)'}
            value={metaDescAr}
            onChange={(e) => setMetaDescAr(e.target.value)}
            rows={3}
            required
          />
          <Textarea
            label={isAr ? 'وصف الموقع في نتائج البحث (بالإنجليزية)' : 'Meta Description (English)'}
            value={metaDescEn}
            onChange={(e) => setMetaDescEn(e.target.value)}
            rows={3}
            dir="ltr"
          />
          <Input
            label={isAr ? 'الكلمات المفتاحية (مفصولة بفواصل)' : 'Keywords (comma-separated)'}
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
          />
          <Input
            label={isAr ? 'رابط صورة المشاركة (Open Graph Image)' : 'OG Social Share Image URL'}
            value={ogImage}
            onChange={(e) => setOgImage(e.target.value)}
            dir="ltr"
          />
        </div>

        <Button type="submit">
          {isAr ? 'حفظ إعدادات SEO' : 'Save SEO Settings'}
        </Button>
      </form>

      {/* Google Preview */}
      <div className="bg-white p-6 rounded-sm border border-gray-100 space-y-3">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          {isAr ? 'معاينة النتيجة في بحث جوجل' : 'Google Search Preview'}
        </h3>
        <div className="p-4 bg-gray-50 rounded border border-gray-100 max-w-lg">
          <p className="text-xs text-gray-500 font-sans" dir="ltr">https://givora.com</p>
          <p className="text-blue-700 hover:underline text-base font-medium mt-1 cursor-pointer">
            {metaTitleAr}
          </p>
          <p className="text-xs text-gray-600 mt-1 leading-relaxed">
            {metaDescAr}
          </p>
        </div>
      </div>
    </div>
  );
}
