'use client';
import { useState, useEffect } from 'react';
import { Eye, EyeOff, MoveUp, MoveDown, Edit, Save, Check, RefreshCw } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { COLLECTIONS } from '@/lib/firebase/collections';
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

const DEFAULT_SECTIONS: SectionConfig[] = [
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
  const [sections, setSections] = useState<SectionConfig[]>(DEFAULT_SECTIONS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitleAr, setEditTitleAr] = useState('');
  const [editTitleEn, setEditTitleEn] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const fetchSections = async () => {
      setIsLoading(true);
      try {
        const snap = await getDoc(doc(db, COLLECTIONS.WEBSITE_SETTINGS, 'homepage'));
        if (snap.exists()) {
          const data = snap.data();
          if (Array.isArray(data.sections) && data.sections.length > 0) {
            setSections(data.sections);
          }
        }
      } catch (err) {
        console.error('Failed to load homepage settings from Firestore:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSections();
  }, []);

  const handleSaveToFirestore = async (listToSave: SectionConfig[]) => {
    setIsSaving(true);
    try {
      await setDoc(
        doc(db, COLLECTIONS.WEBSITE_SETTINGS, 'homepage'),
        {
          sections: listToSave,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (err) {
      console.error('Failed to save homepage settings:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleVisibility = (id: string) => {
    const next = sections.map((s) => (s.id === id ? { ...s, isVisible: !s.isVisible } : s));
    setSections(next);
    handleSaveToFirestore(next);
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= sections.length) return;
    const copy = [...sections];
    const temp = copy[index];
    copy[index] = copy[target];
    copy[target] = temp;
    const next = copy.map((s, idx) => ({ ...s, order: idx + 1 }));
    setSections(next);
    handleSaveToFirestore(next);
  };

  const startEdit = (sec: SectionConfig) => {
    setEditingId(sec.id);
    setEditTitleAr(sec.titleAr);
    setEditTitleEn(sec.titleEn);
  };

  const saveEdit = (id: string) => {
    const next = sections.map((s) =>
      s.id === id ? { ...s, titleAr: editTitleAr, titleEn: editTitleEn } : s
    );
    setSections(next);
    setEditingId(null);
    handleSaveToFirestore(next);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            {isAr ? 'إدارة وترتيب أقسام الصفحة الرئيسية' : 'Homepage Layout & Builder'}
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            {isAr
              ? 'التحكم في ظهور وترتيب ونصوص أقسام المتجر المحفوظة في قاعدة البيانات'
              : 'Configure visibility, ordering, and Egyptian Arabic headlines in live Firestore'}
          </p>
        </div>
        {savedSuccess && (
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-xs border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
            <Check className="h-4 w-4" /> {isAr ? 'تم حفظ التعديلات في قاعدة البيانات!' : 'Saved to database!'}
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="bg-white dark:bg-[#1A1A1A] rounded-sm border border-neutral-200 dark:border-neutral-800 p-8 text-center text-neutral-500">
          <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-2 text-neutral-900 dark:text-white" />
          <p className="text-xs">{isAr ? 'جاري تحميل إعدادات الصفحة الرئيسية...' : 'Loading sections...'}</p>
        </div>
      ) : (
        <div className="space-y-3 max-w-4xl">
          {sections.map((section, idx) => {
            const isEditing = editingId === section.id;
            return (
              <div
                key={section.id}
                className="bg-white dark:bg-[#1A1A1A] p-4 rounded-sm border border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-4 shadow-xs"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="w-6 text-center font-mono text-xs font-bold text-neutral-400">
                    {section.order}.
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-xs text-neutral-900 dark:text-white truncate">
                        {section.name[locale]}
                      </p>
                      <Badge variant={section.isVisible ? 'success' : 'default'}>
                        {section.isVisible ? (isAr ? 'مفعل' : 'Active') : (isAr ? 'مخفي' : 'Hidden')}
                      </Badge>
                    </div>

                    {isEditing ? (
                      <div className="mt-2 space-y-2">
                        <Input
                          value={editTitleAr}
                          onChange={(e) => setEditTitleAr(e.target.value)}
                          placeholder="العنوان بالعربية"
                        />
                        <Input
                          value={editTitleEn}
                          onChange={(e) => setEditTitleEn(e.target.value)}
                          placeholder="Title in English"
                          dir="ltr"
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => saveEdit(section.id)} isLoading={isSaving}>
                            {isAr ? 'حفظ' : 'Save'}
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                            {isAr ? 'إلغاء' : 'Cancel'}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-[11px] text-neutral-500 truncate mt-0.5">
                        {section.titleAr}
                      </p>
                    )}
                  </div>
                </div>

                {!isEditing && (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => moveSection(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1.5 rounded-xs border border-neutral-200 dark:border-neutral-800 text-neutral-400 hover:text-black dark:hover:text-white disabled:opacity-30 transition-colors"
                      title={isAr ? 'تحريك لأعلى' : 'Move Up'}
                    >
                      <MoveUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => moveSection(idx, 'down')}
                      disabled={idx === sections.length - 1}
                      className="p-1.5 rounded-xs border border-neutral-200 dark:border-neutral-800 text-neutral-400 hover:text-black dark:hover:text-white disabled:opacity-30 transition-colors"
                      title={isAr ? 'تحريك لأسفل' : 'Move Down'}
                    >
                      <MoveDown className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => startEdit(section)}
                      className="p-1.5 rounded-xs border border-neutral-200 dark:border-neutral-800 text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
                      title={isAr ? 'تعديل العنوان' : 'Edit Title'}
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => toggleVisibility(section.id)}
                      className={`p-1.5 rounded-xs border transition-colors ${
                        section.isVisible
                          ? 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
                          : 'border-red-200 dark:border-red-800 text-red-500'
                      }`}
                      title={section.isVisible ? (isAr ? 'إخفاء' : 'Hide') : (isAr ? 'إظهار' : 'Show')}
                    >
                      {section.isVisible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
