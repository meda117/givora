'use client';
import { useState, useEffect } from 'react';
import { Plus, Package, Trash2, RefreshCw, Gift } from 'lucide-react';
import { collection, getDocs, setDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Locale, GiftBoxItem } from '@/types';

export default function AdminGiftBoxesPage() {
  const isAr = true;
  const locale: Locale = 'ar';
  const [items, setItems] = useState<GiftBoxItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [qty, setQty] = useState('1');
  const [isOptional, setIsOptional] = useState(false);
  const [price, setPrice] = useState('');

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const snap = await getDocs(collection(db, 'gift_box_items'));
      const list: GiftBoxItem[] = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          source: data.source || 'external',
          name: typeof data.name === 'object' ? data.name : { ar: data.name || '', en: data.name || '' },
          quantity: data.quantity || 1,
          isOptional: !!data.isOptional,
          price: data.price,
          order: data.order || 1,
        };
      });
      setItems(list.sort((a, b) => (a.order || 0) - (b.order || 0)));
    } catch (err) {
      console.error('Failed to fetch gift box items:', err);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameAr.trim()) return;

    setIsSaving(true);
    try {
      const newId = `boxitem_${Date.now()}`;
      const newItem: GiftBoxItem = {
        id: newId,
        source: 'external',
        name: { ar: nameAr.trim(), en: (nameEn || nameAr).trim() },
        quantity: parseInt(qty) || 1,
        isOptional,
        price: price ? parseFloat(price) : undefined,
        order: items.length + 1,
      };

      await setDoc(doc(db, 'gift_box_items', newId), {
        ...newItem,
        createdAt: new Date().toISOString(),
      });

      setItems((prev) => [...prev, newItem]);
      setNameAr('');
      setNameEn('');
      setQty('1');
      setPrice('');
      setShowAddModal(false);
    } catch (err) {
      console.error('Failed to save gift box item:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'gift_box_items', id));
      setItems((prev) => prev.filter((x) => x.id !== id));
    } catch (err) {
      console.error('Failed to delete gift box item:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            {isAr ? 'مكتبة عناصر ومحتويات بوكسات الهدايا' : 'Gift Box Contents Master Library'}
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            {isAr
              ? `عناصر ومكونات الهدايا المعتمدة في قاعدة البيانات • ${items.length} عنصر مسجل`
              : `Master components stored in live database • ${items.length} items`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchItems}
            isLoading={isLoading}
            leftIcon={<RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />}
          >
            {isAr ? 'تحديث' : 'Refresh'}
          </Button>
          <Button onClick={() => setShowAddModal(true)} leftIcon={<Plus className="h-4 w-4" />}>
            {isAr ? 'إضافة عنصر جديد للبوكس' : 'Add Item'}
          </Button>
        </div>
      </div>

      {showAddModal && (
        <div className="bg-white dark:bg-[#1A1A1A] p-6 border border-neutral-200 dark:border-neutral-800 rounded-sm space-y-4 max-w-lg shadow-sm">
          <h2 className="text-sm font-bold text-neutral-900 dark:text-white border-b border-neutral-100 dark:border-neutral-800 pb-3">
            {isAr ? 'إضافة محتوى جديد لمكتبة البوكسات' : 'Add New Box Item'}
          </h2>
          <form onSubmit={handleAddItem} className="space-y-3">
            <Input
              label={isAr ? 'اسم العنصر (بالعربية)' : 'Item Name (Arabic)'}
              value={nameAr}
              onChange={(e) => setNameAr(e.target.value)}
              placeholder={isAr ? 'مثال: ورد طبيعي هولندي مجفف' : 'Item name in Arabic'}
              required
            />
            <Input
              label={isAr ? 'اسم العنصر (بالإنجليزية)' : 'Item Name (English)'}
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              placeholder="e.g. Preserved Dutch Roses"
              dir="ltr"
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label={isAr ? 'الكمية الافتراضية' : 'Default Quantity'}
                type="number"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                min="1"
              />
              <Input
                label={isAr ? 'سعر إضافي (ج.م - إن وجد)' : 'Extra Price (EGP)'}
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0"
              />
            </div>
            <label className="flex items-center gap-2 text-xs text-neutral-700 dark:text-neutral-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isOptional}
                onChange={(e) => setIsOptional(e.target.checked)}
                className="accent-black dark:accent-white rounded-xs"
              />
              <span>{isAr ? 'عنصر اختياري (يمكن للعميل إضافته أو تركه)' : 'Optional item for customer'}</span>
            </label>
            <div className="flex gap-2 pt-2">
              <Button type="submit" isLoading={isSaving}>{isAr ? 'حفظ العنصر' : 'Add'}</Button>
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
          <p className="text-xs">{isAr ? 'جاري تحميل محتويات البوكسات...' : 'Loading items...'}</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && items.length === 0 && (
        <div className="bg-white dark:bg-[#1A1A1A] rounded-sm border border-neutral-200 dark:border-neutral-800 p-12 text-center">
          <div className="w-16 h-16 rounded-sm bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center mx-auto mb-4 text-neutral-900 dark:text-white">
            <Gift className="h-8 w-8 stroke-[1.2]" />
          </div>
          <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-1">
            {isAr ? 'مكتبة محتويات البوكسات فارغة' : 'Library is Empty'}
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-md mx-auto mb-6 leading-relaxed">
            {isAr
              ? 'لم يتم تسجيل أي محتويات أو إكسسوارات للبوكسات حتى الآن. يمكنك إضافة الورد المجفف، الشوكولاتة، الشموع العطرية، والكروت الفاخرة.'
              : 'No items have been registered in the gift box library yet. Add your standard box contents.'}
          </p>
          <Button onClick={() => setShowAddModal(true)} leftIcon={<Plus className="h-4 w-4" />}>
            {isAr ? 'إضافة أول عنصر للمكتبة' : 'Add First Item'}
          </Button>
        </div>
      )}

      {/* Items Table */}
      {!isLoading && items.length > 0 && (
        <div className="bg-white dark:bg-[#1A1A1A] rounded-sm border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>{isAr ? 'محتوى البوكس' : 'Item Name'}</th>
                  <th>{isAr ? 'الكمية الافتراضية' : 'Quantity'}</th>
                  <th>{isAr ? 'النوع' : 'Type'}</th>
                  <th>{isAr ? 'السعر الإضافي' : 'Price'}</th>
                  <th>{isAr ? 'الترتيب' : 'Order'}</th>
                  <th className="text-end">{isAr ? 'إجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-sm bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-neutral-800 dark:text-neutral-200">
                          <Package className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-xs text-neutral-900 dark:text-white">{item.name[locale] || item.name.ar}</p>
                          <p className="text-[11px] text-neutral-400 dark:text-neutral-500">{item.name.en}</p>
                        </div>
                      </div>
                    </td>
                    <td className="font-semibold text-xs text-neutral-900 dark:text-white font-mono">x{item.quantity}</td>
                    <td>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-xs border ${
                        item.isOptional
                          ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700'
                          : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                      }`}>
                        {item.isOptional ? (isAr ? 'اختياري' : 'Optional') : (isAr ? 'أساسي' : 'Included')}
                      </span>
                    </td>
                    <td className="font-medium text-xs text-neutral-900 dark:text-white">
                      {item.price ? `+${item.price} ج.م` : (isAr ? 'مشمول' : 'Included')}
                    </td>
                    <td className="text-xs text-neutral-500 font-mono">{item.order}</td>
                    <td className="text-end">
                      <button
                        onClick={() => handleDeleteItem(item.id)}
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
