'use client';
import { useState } from 'react';
import { Plus, Trash2, Edit, Sparkles, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import type { Locale, MainCategory } from '@/types';

interface CategoryItem {
  id: string;
  name: { ar: string; en: string };
  mainCategory: MainCategory;
  productCount: number;
  order: number;
  isVisible: boolean;
}

const INITIAL_CATEGORIES: CategoryItem[] = [
  { id: '1', name: { ar: 'بوكسات نسائية فاخرة', en: "Women's Gift Boxes" }, mainCategory: 'gift-boxes', productCount: 16, order: 1, isVisible: true },
  { id: '2', name: { ar: 'بوكسات رجالية راقية', en: "Men's Gift Boxes" }, mainCategory: 'gift-boxes', productCount: 12, order: 2, isVisible: true },
  { id: '3', name: { ar: 'بوكسات كابلز ومناسبات', en: "Couples & Anniversary Boxes" }, mainCategory: 'gift-boxes', productCount: 9, order: 3, isVisible: true },
  { id: '4', name: { ar: 'هدايا محفورة بالاسم وليزر', en: 'Laser Engraved Gifts' }, mainCategory: 'trending-gifts', productCount: 24, order: 4, isVisible: true },
  { id: '5', name: { ar: 'بورتريهات ومطبوعات مخصصة', en: 'Custom Printed Keepsakes' }, mainCategory: 'trending-gifts', productCount: 18, order: 5, isVisible: true },
];

export default function AdminCategoriesPage() {
  const isAr = true;
  const locale: Locale = 'ar';
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newNameAr, setNewNameAr] = useState('');
  const [newNameEn, setNewNameEn] = useState('');
  const [mainCat, setMainCat] = useState<MainCategory>('gift-boxes');
  const [isTranslating, setIsTranslating] = useState(false);

  const handleAutoTranslate = async () => {
    if (!newNameAr && !newNameEn) return;
    setIsTranslating(true);
    try {
      if (newNameAr && !newNameEn) {
        setNewNameEn(newNameAr);
      }
    } finally {
      setIsTranslating(false);
    }
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNameAr) return;
    const newCat: CategoryItem = {
      id: Date.now().toString(),
      name: { ar: newNameAr, en: newNameEn || newNameAr },
      mainCategory: mainCat,
      productCount: 0,
      order: categories.length + 1,
      isVisible: true,
    };
    setCategories([...categories, newCat]);
    setNewNameAr('');
    setNewNameEn('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text-main)]">
            {isAr ? 'إدارة الفئات والأقسام' : 'Category Management'}
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            {isAr
              ? 'التحكم في الأقسام الرئيسية (بوكسات الهدايا، هدايا تريندي ومخصصة) والفئات التابعة لها'
              : 'Manage main categories (Gift Boxes, Trending & Personalized Gifts) and subcategories'}
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)} leftIcon={<Plus className="h-4 w-4" />}>
          {isAr ? 'إضافة فئة جديدة' : 'Add Category'}
        </Button>
      </div>

      {showAddModal && (
        <div className="bg-[var(--card-bg)] p-6 border border-[var(--border-color)] rounded-sm space-y-4 max-w-xl">
          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
            <h2 className="text-sm font-semibold text-[var(--text-main)]">
              {isAr ? 'إضافة فئة فرعية جديدة' : 'Add New Category'}
            </h2>
            <Button
              size="sm"
              variant="outline"
              leftIcon={<Sparkles className="h-3.5 w-3.5 text-[var(--text-main)]" />}
              onClick={handleAutoTranslate}
              isLoading={isTranslating}
            >
              {isAr ? 'ترجمة تلقائية' : 'Auto Translate'}
            </Button>
          </div>
          <form onSubmit={handleAddCategory} className="space-y-3">
            <Input
              label={isAr ? 'اسم الفئة (بالعربية)' : 'Category Name (Arabic)'}
              value={newNameAr}
              onChange={(e) => setNewNameAr(e.target.value)}
              required
            />
            <Input
              label={isAr ? 'اسم الفئة (بالإنجليزية)' : 'Category Name (English)'}
              value={newNameEn}
              onChange={(e) => setNewNameEn(e.target.value)}
              dir="ltr"
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[var(--text-main)]">
                {isAr ? 'القسم الرئيسي التابع له' : 'Parent Main Category'}
              </label>
              <select
                value={mainCat}
                onChange={(e) => setMainCat(e.target.value as MainCategory)}
                className="w-full h-11 rounded-sm border border-[var(--border-color)] px-3.5 text-sm bg-[var(--bg-main)] text-[var(--text-main)]"
              >
                <option value="gift-boxes">{isAr ? 'بوكسات الهدايا' : 'Gift Boxes'}</option>
                <option value="trending-gifts">{isAr ? 'هدايا تريندي ومخصصة' : 'Trending & Custom Gifts'}</option>
              </select>
            </div>
            <div className="flex gap-2 pt-2">
              <Button type="submit">{isAr ? 'إضافة الفئة' : 'Add'}</Button>
              <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
                {isAr ? 'إلغاء' : 'Cancel'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Categories Table */}
      <div className="bg-[var(--card-bg)] rounded-sm border border-[var(--border-color)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] text-start">
                <th className="py-3 px-4 font-medium">{isAr ? 'اسم الفئة' : 'Category'}</th>
                <th className="py-3 px-4 font-medium">{isAr ? 'القسم الرئيسي' : 'Main Category'}</th>
                <th className="py-3 px-4 font-medium">{isAr ? 'عدد المنتجات' : 'Products'}</th>
                <th className="py-3 px-4 font-medium">{isAr ? 'الترتيب' : 'Order'}</th>
                <th className="py-3 px-4 font-medium">{isAr ? 'الحالة' : 'Status'}</th>
                <th className="py-3 px-4 font-medium text-end">{isAr ? 'إجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-[var(--bg-secondary)] transition-colors">
                  <td className="py-3.5 px-4">
                    <div>
                      <p className="font-medium text-sm text-[var(--text-main)]">{cat.name[locale]}</p>
                      <p className="text-[11px] text-[var(--text-secondary)]">{cat.name.en}</p>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-main)]">
                      {cat.mainCategory === 'gift-boxes'
                        ? (isAr ? 'بوكسات الهدايا' : 'Gift Boxes')
                        : (isAr ? 'هدايا تريندي ومخصصة' : 'Trending Gifts')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-[var(--text-main)]">{cat.productCount}</td>
                  <td className="py-3.5 px-4 text-[var(--text-secondary)]">{cat.order}</td>
                  <td className="py-3.5 px-4">
                    <span className="text-[11px] px-2 py-0.5 rounded-sm font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      {isAr ? 'معروض' : 'Visible'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-end">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setCategories(categories.filter(c => c.id !== cat.id))}
                        className="p-1.5 text-[var(--text-secondary)] hover:text-red-500 rounded"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
