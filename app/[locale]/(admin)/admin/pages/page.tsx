'use client';
import { useState } from 'react';
import { FileText, Edit, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Locale } from '@/types';

interface PageEntry {
  slug: string;
  nameAr: string;
  nameEn: string;
  contentAr: string;
  contentEn: string;
}

const INITIAL_PAGES: PageEntry[] = [
  { slug: 'about-us', nameAr: 'من نحن', nameEn: 'About Us', contentAr: 'جيفورا هي وجهتكم الأولى للهدايا الفاخرة والتجارب الرقمية المميزة.', contentEn: 'Givora is your premier luxury gift store and digital experiences platform.' },
  { slug: 'contact-us', nameAr: 'تواصل معنا', nameEn: 'Contact Us', contentAr: 'فريق خدمة عملاء جيفورا متاح على مدار الساعة للإجابة عن استفساراتكم.', contentEn: 'The Givora concierge team is available 24/7 to assist you.' },
  { slug: 'faq', nameAr: 'الأسئلة الشائعة', nameEn: 'FAQ', contentAr: 'هل يمكن إخفاء السعر عن المستلم؟ نعم بكل تأكيد عبر تفعيل خيار إخفاء السعر.', contentEn: 'Can I hide prices from the recipient? Yes, via the hide price toggle at checkout.' },
  { slug: 'privacy-policy', nameAr: 'سياسة الخصوصية', nameEn: 'Privacy Policy', contentAr: 'نلتزم بحماية خصوصية بياناتكم الشخصية وبيانات مستلمي الهدايا.', contentEn: 'We are committed to protecting your personal data and gift recipient information.' },
  { slug: 'terms-and-conditions', nameAr: 'الشروط والأحكام', nameEn: 'Terms & Conditions', contentAr: 'تخضع جميع الطلبات والخدمات المقدمة للشروط والأنظمة المعمول بها.', contentEn: 'All orders and services are subject to standard e-commerce regulations.' },
  { slug: 'shipping-policy', nameAr: 'سياسة الشحن', nameEn: 'Shipping Policy', contentAr: 'توصيل سريع لجميع المناطق مع شحن مجاني للطلبات فوق 200 ريال.', contentEn: 'Express delivery to all regions with free shipping on orders over 200 SAR.' },
  { slug: 'returns-policy', nameAr: 'سياسة الإرجاع', nameEn: 'Returns Policy', contentAr: 'نظراً لخصوصية الهدايا المصممة خصيصاً، الإرجاع متاح فقط للعيوب المصنعية.', contentEn: 'Due to custom craftsmanship, returns are accepted for defects only.' },
];

export default function AdminPagesManager() {
  const isAr = true;
  const locale: Locale = 'ar';
  const [pages, setPages] = useState<PageEntry[]>(INITIAL_PAGES);
  const [selectedSlug, setSelectedSlug] = useState<string>('about-us');
  const [contentAr, setContentAr] = useState(INITIAL_PAGES[0].contentAr);
  const [contentEn, setContentEn] = useState(INITIAL_PAGES[0].contentEn);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSelect = (p: PageEntry) => {
    setSelectedSlug(p.slug);
    setContentAr(p.contentAr);
    setContentEn(p.contentEn);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setPages(pages.map(p => p.slug === selectedSlug ? { ...p, contentAr, contentEn } : p));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const currentPage = pages.find(p => p.slug === selectedSlug)!;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-charcoal">
            {isAr ? 'إدارة صفحات ومحتوى الموقع (CMS)' : 'Website Pages (CMS)'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {isAr
              ? 'تعديل محتوى الصفحات الثابتة (من نحن، السياسات، الأسئلة الشائعة) بالعربية والإنجليزية'
              : 'Edit static legal and informational page contents in Arabic and English'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Pages Menu */}
        <div className="bg-white p-3 rounded-sm border border-gray-100 space-y-1">
          {pages.map((p) => (
            <button
              key={p.slug}
              onClick={() => handleSelect(p)}
              className={`w-full text-start px-3 py-2.5 rounded-sm text-sm font-medium transition-colors flex items-center justify-between ${
                selectedSlug === p.slug ? 'bg-charcoal text-white' : 'text-charcoal/70 hover:bg-gray-50'
              }`}
            >
              <span>{p.nameAr}</span>
              <span className="text-[10px] opacity-60 font-sans" dir="ltr">{p.slug}</span>
            </button>
          ))}
        </div>

        {/* Editor */}
        <div className="md:col-span-3 bg-white p-6 rounded-sm border border-gray-100">
          <form onSubmit={handleSave} className="space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-base font-semibold text-charcoal">
                {isAr ? `تعديل صفحة: ${currentPage.nameAr}` : `Editing: ${currentPage.nameEn}`}
              </h2>
              {savedSuccess && (
                <span className="text-xs text-green-600 bg-green-50 px-2.5 py-1 rounded font-medium flex items-center gap-1">
                  <Check className="h-3 w-3" /> {isAr ? 'تم الحفظ' : 'Saved'}
                </span>
              )}
            </div>

            <Textarea
              label={isAr ? 'المحتوى (بالعربية)' : 'Content (Arabic)'}
              value={contentAr}
              onChange={(e) => setContentAr(e.target.value)}
              rows={6}
              required
            />

            <Textarea
              label={isAr ? 'المحتوى (بالإنجليزية)' : 'Content (English)'}
              value={contentEn}
              onChange={(e) => setContentEn(e.target.value)}
              rows={6}
              dir="ltr"
            />

            <Button type="submit">
              {isAr ? 'حفظ تعديلات الصفحة' : 'Save Page'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
