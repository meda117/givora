'use client';
import { useState, useEffect } from 'react';
import { Plus, Trash2, Sparkles, RefreshCw, Tags, Eye, EyeOff } from 'lucide-react';
import { collection, getDocs, setDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { COLLECTIONS } from '@/lib/firebase/collections';
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

export default function AdminCategoriesPage() {
  const isAr = true;
  const locale: Locale = 'ar';
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newNameAr, setNewNameAr] = useState('');
  const [newNameEn, setNewNameEn] = useState('');
  const [mainCat, setMainCat] = useState<MainCategory>('gift-boxes');
  const [isTranslating, setIsTranslating] = useState(false);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.CATEGORIES));
      const list: CategoryItem[] = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          name: typeof data.name === 'object' ? data.name : { ar: data.name || '', en: data.name || '' },
          mainCategory: data.mainCategory || 'gift-boxes',
          productCount: data.productCount || 0,
          order: data.order || 1,
          isVisible: data.isVisible !== false,
        };
      });
      setCategories(list.sort((a, b) => (a.order || 0) - (b.order || 0)));
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAutoTranslate = async () => {
    if (!newNameAr) return;
    setIsTranslating(true);
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newNameAr, from: 'ar', to: 'en' }),
      });
      const data = await res.json();
      if (data.translatedText) setNewNameEn(data.translatedText);
    } catch {
      setNewNameEn(newNameAr);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNameAr.trim()) return;

    setIsSaving(true);
    try {
      const newId = `cat_${Date.now()}`;
      const newCat: CategoryItem = {
        id: newId,
        name: { ar: newNameAr.trim(), en: (newNameEn || newNameAr).trim() },
        mainCategory: mainCat,
        productCount: 0,
        order: categories.length + 1,
        isVisible: true,
      };

      await setDoc(doc(db, COLLECTIONS.CATEGORIES, newId), {
        ...newCat,
        createdAt: new Date().toISOString(),
      });

      setCategories((prev) => [...prev, newCat]);
      setNewNameAr('');
      setNewNameEn('');
      setShowAddModal(false);
    } catch (err) {
      console.error('Failed to add category:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteDoc(doc(db, COLLECTIONS.CATEGORIES, id));
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error('Failed to delete category:', err);
    }
  };

  const handleToggleVisibility = async (cat: CategoryItem) => {
    const nextVal = !cat.isVisible;
    try {
      await updateDoc(doc(db, COLLECTIONS.CATEGORIES, cat.id), { isVisible: nextVal });
      setCategories((prev) =>
        prev.map((c) => (c.id === cat.id ? { ...c, isVisible: nextVal } : c))
      );
    } catch (err) {
      console.error('Failed to update category visibility:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            {isAr ? 'إدارة الفئات والأقسام' : 'Category Management'}
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            {isAr
              ? `أقسام وفئات المتجر المخزنة في قاعدة البيانات • ${categories.length} فئات مسجلة`
              : `Store taxonomy in live Firestore database • ${categories.length} categories`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchCategories}
            isLoading={isLoading}
            leftIcon={<RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />}
          >
            {isAr ? 'تحديث' : 'Refresh'}
          </Button>
          <Button onClick={() => setShowAddModal(true)} leftIcon={<Plus className="h-4 w-4" />}>
            {isAr ? 'إضافة فئة جديدة' : 'Add Category'}
          </Button>
        </div>
      </div>

      {showAddModal && (
        <div className="bg-white dark:bg-[#1A1A1A] p-6 border border-neutral-200 dark:border-neutral-800 rounded-sm space-y-4 max-w-xl shadow-sm">
          <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
            <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
              {isAr ? 'إضافة فئة فرعية جديدة' : 'Add New Category'}
            </h2>
            <Button
              size="sm"
              variant="outline"
              leftIcon={<Sparkles className="h-3.5 w-3.5" />}
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
              placeholder={isAr ? 'مثال: بوكسات نسائية فاخرة' : 'Category name'}
              required
            />
            <Input
              label={isAr ? 'اسم الفئة (بالإنجليزية)' : 'Category Name (English)'}
              value={newNameEn}
              onChange={(e) => setNewNameEn(e.target.value)}
              placeholder="e.g. Luxury Women's Boxes"
              dir="ltr"
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                {isAr ? 'القسم الرئيسي التابع له' : 'Parent Main Category'}
              </label>
              <select
                value={mainCat}
                onChange={(e) => setMainCat(e.target.value as MainCategory)}
                className="w-full h-11 rounded-sm border border-neutral-200 dark:border-neutral-700 px-3.5 text-xs font-semibold bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
              >
                <option value="gift-boxes">{isAr ? 'بوكسات الهدايا' : 'Gift Boxes'}</option>
                <option value="trending-gifts">{isAr ? 'هدايا تريندي ومخصصة' : 'Trending & Custom Gifts'}</option>
              </select>
            </div>
            <div className="flex gap-2 pt-2">
              <Button type="submit" isLoading={isSaving}>{isAr ? 'حفظ الفئة' : 'Add'}</Button>
              <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
                {isAr ? 'إلغاء' : 'Cancel'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="bg-white dark:bg-[#1A1A1A] rounded-sm border border-neutral-200 dark:border-neutral-800 p-8 text-center text-neutral-500">
          <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-2 text-neutral-900 dark:text-white" />
          <p className="text-xs">{isAr ? 'جاري تحميل الفئات...' : 'Loading categories...'}</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && categories.length === 0 && (
        <div className="bg-white dark:bg-[#1A1A1A] rounded-sm border border-neutral-200 dark:border-neutral-800 p-12 text-center">
          <div className="w-16 h-16 rounded-sm bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center mx-auto mb-4 text-neutral-900 dark:text-white">
            <Tags className="h-8 w-8 stroke-[1.2]" />
          </div>
          <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-1">
            {isAr ? 'لا توجد فئات مسجلة حالياً' : 'No Categories Found'}
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-md mx-auto mb-6 leading-relaxed">
            {isAr
              ? 'لم يتم إنشاء أي فئات فرعية بعد في قاعدة البيانات. أضف الفئات لتنظيم معروضات المتجر وسهولة تصفح العملاء.'
              : 'No categories have been registered in the database yet. Create categories to organize your gift catalog.'}
          </p>
          <Button onClick={() => setShowAddModal(true)} leftIcon={<Plus className="h-4 w-4" />}>
            {isAr ? 'إضافة أول فئة' : 'Add First Category'}
          </Button>
        </div>
      )}

      {/* Categories Table */}
      {!isLoading && categories.length > 0 && (
        <div className="bg-white dark:bg-[#1A1A1A] rounded-sm border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>{isAr ? 'اسم الفئة' : 'Category'}</th>
                  <th>{isAr ? 'القسم الرئيسي' : 'Main Category'}</th>
                  <th>{isAr ? 'عدد المنتجات' : 'Products'}</th>
                  <th>{isAr ? 'الترتيب' : 'Order'}</th>
                  <th>{isAr ? 'الحالة' : 'Status'}</th>
                  <th className="text-end">{isAr ? 'إجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id}>
                    <td>
                      <div>
                        <p className="font-semibold text-xs text-neutral-900 dark:text-white">{cat.name[locale] || cat.name.ar}</p>
                        <p className="text-[11px] text-neutral-400 dark:text-neutral-500">{cat.name.en}</p>
                      </div>
                    </td>
                    <td>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-xs border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
                        {cat.mainCategory === 'gift-boxes'
                          ? isAr ? 'بوكسات الهدايا' : 'Gift Boxes'
                          : isAr ? 'هدايا تريندي ومخصصة' : 'Trending Gifts'}
                      </span>
                    </td>
                    <td className="font-semibold text-xs text-neutral-900 dark:text-white">{cat.productCount}</td>
                    <td className="text-xs text-neutral-500 font-mono">{cat.order}</td>
                    <td>
                      <button
                        onClick={() => handleToggleVisibility(cat)}
                        className={`text-[11px] px-2 py-0.5 rounded-xs font-semibold border flex items-center gap-1 transition-colors ${
                          cat.isVisible
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 border-neutral-200 dark:border-neutral-700'
                        }`}
                        title={isAr ? 'انقر لتغيير الظهور' : 'Toggle visibility'}
                      >
                        {cat.isVisible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                        <span>{cat.isVisible ? (isAr ? 'معروض' : 'Visible') : (isAr ? 'مخفي' : 'Hidden')}</span>
                      </button>
                    </td>
                    <td className="text-end">
                      <button
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="p-1.5 text-neutral-400 hover:text-red-500 rounded-xs transition-colors"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
