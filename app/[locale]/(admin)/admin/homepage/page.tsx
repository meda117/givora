'use client';
import { useState } from 'react';
import { Eye, EyeOff, MoveUp, MoveDown, Edit, Save, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import type { Locale } from '@/types';

interface SectionConfig {
  id: string;
  name: { ar: string; en: string };
  titleAr: string;
  titleEn: string;
  isVisible: boolean;
  order: number;
}

const INITIAL_SECTIONS: SectionConfig[] = [
  { id: 'announcement', name: { ar: 'شريط الإعلانات العلوي', en: 'Announcement Bar' }, titleAr: 'شحن مجاني لجميع الطلبات فوق 1000 ج.م في مصر', titleEn: 'Free shipping on orders over 1000 EGP in Egypt', isVisible: true, order: 1 },
  { id: 'hero', name: { ar: 'البانر الترحيبي الرئيسي (Hero)', en: 'Main Hero Banner' }, titleAr: 'مش مجرد هدية، دي لحظة هتفضل فاكرها', titleEn: 'Not Just a Gift, A Lasting Memory', isVisible: true, order: 2 },
  { id: 'categories', name: { ar: 'بطاقات الأقسام (بوكسات هدايا وهدايا مخصصة)', en: 'Category Cards' }, titleAr: 'اكتشف مجموعات هدايا جيفورا', titleEn: 'Explore Givora Gift Collections', isVisible: true, order: 3 },
  { id: 'bestsellers', name: { ar: 'قسم الأكثر طلباً ومبيعاً', en: 'Best Sellers Section' }, titleAr: 'الهدايا الأكثر طلباً في مصر', titleEn: 'Most Demanded Gifts in Egypt', isVisible: true, order: 4 },
  { id: 'trending', name: { ar: 'قسم الهدايا التريند والتخصيص', en: 'Trending & Personalized Gifts' }, titleAr: 'هدايا تريند ومميزة بالاسم', titleEn: 'Trending & Personalized Gifts', isVisible: true, order: 5 },
  { id: 'promo', name: { ar: 'البانر الترويجي الفاخر للبوكسات', en: 'Promotional Box Banner' }, titleAr: 'صمم بوكس هديتك الفاخر بكل تفاصيله', titleEn: 'Design Your Custom Luxury Gift Box', isVisible: true, order: 6 },
  { id: 'reviews', name: { ar: 'قسم تجارب وآراء العملاء', en: 'Customer Testimonials' }, titleAr: 'آراء وتجارب عملاء جيفورا في مصر', titleEn: 'What Our Customers Say in Egypt', isVisible: true, order: 7 },
  { id: 'newsletter', name: { ar: 'النشرة البريدية والعروض الخاصة', en: 'Newsletter Signup' }, titleAr: 'انضم لمجتمع جيفورا واحصل على عروض حصرية', titleEn: 'Join Givora Community for Exclusive Offers', isVisible: true, order: 8 },
];

export default function AdminHomepageManagement() {
  const isAr = true;
  const locale: Locale = 'ar';
  const [sections, setSections] = useState(INITIAL_SECTIONS);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitleAr, setEditTitleAr] = useState('');
  const [editTitleEn, setEditTitleEn] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const toggleVisibility = (id: string) => {
    setSections(sections.map(s => s.id === id ? { ...s, isVisible: !s.isVisible } : s));
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= sections.length) return;
    const copy = [...sections];
    const temp = copy[index];
    copy[index] = copy[target];
    copy[target] = temp;
    setSections(copy.map((s, idx) => ({ ...s, order: idx + 1 })));
  };

  const startEdit = (sec: SectionConfig) => {
    setEditingId(sec.id);
    setEditTitleAr(sec.titleAr);
    setEditTitleEn(sec.titleEn);
  };

  const saveEdit = (id: string) => {
    setSections(sections.map(s => s.id === id ? { ...s, titleAr: editTitleAr, titleEn: editTitleEn } : s));
    setEditingId(null);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text-main)]">
            {isAr ? 'إدارة الصفحة الرئيسية والمحتوى' : 'Homepage & Content Management'}
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            {isAr
              ? 'التحكم الكامل في أقسام الصفحة الرئيسية، إعادة الترتيب، التعديل الفوري، والإخفاء/الإظهار'
              : 'Reorder sections, toggle visibility, and update titles dynamically'}
          </p>
        </div>
        {savedSuccess && (
          <span className="text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded font-medium flex items-center gap-1 border border-emerald-500/20">
            <Check className="h-3.5 w-3.5" /> {isAr ? 'تم حفظ التعديلات بنجاح' : 'Saved Successfully'}
          </span>
        )}
      </div>

      <div className="bg-[var(--card-bg)] rounded-sm border border-[var(--border-color)] divide-y divide-[var(--border-color)]">
        {sections.map((sec, idx) => (
          <div key={sec.id} className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-[var(--bg-secondary)] text-[var(--text-secondary)] text-xs font-semibold flex items-center justify-center border border-[var(--border-color)]">
                {idx + 1}
              </span>
              <div>
                <p className="font-medium text-sm text-[var(--text-main)]">{sec.name[locale]}</p>
                {editingId === sec.id ? (
                  <div className="flex flex-col sm:flex-row gap-2 mt-2">
                    <Input
                      value={editTitleAr}
                      onChange={(e) => setEditTitleAr(e.target.value)}
                      className="h-8 text-xs w-64"
                      placeholder="العنوان بالعربية"
                    />
                    <Input
                      value={editTitleEn}
                      onChange={(e) => setEditTitleEn(e.target.value)}
                      className="h-8 text-xs w-64"
                      placeholder="Title in English"
                      dir="ltr"
                    />
                    <Button size="sm" onClick={() => saveEdit(sec.id)}>
                      {isAr ? 'حفظ' : 'Save'}
                    </Button>
                  </div>
                ) : (
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                    &ldquo;{sec.titleAr}&rdquo; · <span className="font-sans" dir="ltr">{sec.titleEn}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 ms-auto">
              <span className={`text-[11px] font-medium px-2 py-0.5 rounded-sm border ${
                sec.isVisible
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                  : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-color)]'
              }`}>
                {sec.isVisible ? (isAr ? 'معروض' : 'Visible') : (isAr ? 'مخفي' : 'Hidden')}
              </span>

              <button
                onClick={() => toggleVisibility(sec.id)}
                className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-main)] rounded"
                title={sec.isVisible ? (isAr ? 'إخفاء القسم' : 'Hide') : (isAr ? 'إظهار القسم' : 'Show')}
              >
                {sec.isVisible ? <Eye className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> : <EyeOff className="h-4 w-4" />}
              </button>

              <button
                onClick={() => startEdit(sec)}
                className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-main)] rounded"
                aria-label="Edit"
              >
                <Edit className="h-4 w-4" />
              </button>

              <div className="flex items-center border border-[var(--border-color)] rounded-sm">
                <button
                  disabled={idx === 0}
                  onClick={() => moveSection(idx, 'up')}
                  className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-main)] disabled:opacity-30"
                  aria-label="Move Up"
                >
                  <MoveUp className="h-3.5 w-3.5" />
                </button>
                <button
                  disabled={idx === sections.length - 1}
                  onClick={() => moveSection(idx, 'down')}
                  className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-main)] disabled:opacity-30 border-s border-[var(--border-color)]"
                  aria-label="Move Down"
                >
                  <MoveDown className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
