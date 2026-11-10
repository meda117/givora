'use client';
import { useState } from 'react';
import { Plus, Package, Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import type { Locale, GiftBoxItem } from '@/types';

const INITIAL_BOX_ITEMS: GiftBoxItem[] = [
  { id: '1', source: 'external', name: { ar: 'ورد طبيعي هولندي مجفف (12 حبة)', en: 'Dutch Natural Preserved Roses (12 pcs)' }, quantity: 12, isOptional: false, order: 1 },
  { id: '2', source: 'external', name: { ar: 'شوكولاتة بلجيكية فاخرة (6 قطع)', en: 'Belgian Artisan Chocolates (6 pcs)' }, quantity: 6, isOptional: false, order: 2 },
  { id: '3', source: 'external', name: { ar: 'شمعة صويا عطرية بعبير الفانيلا واللافندر', en: 'Vanilla & Lavender Scented Candle' }, quantity: 1, isOptional: true, price: 120, order: 3 },
  { id: '4', source: 'external', name: { ar: 'كارت إهداء فاخر مختوم بالشمع الأسود', en: 'Luxury Wax-Sealed Gift Card' }, quantity: 1, isOptional: false, order: 4 },
];

export default function AdminGiftBoxesPage() {
  const isAr = true;
  const locale: Locale = 'ar';
  const [items, setItems] = useState<GiftBoxItem[]>(INITIAL_BOX_ITEMS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [qty, setQty] = useState('1');
  const [isOptional, setIsOptional] = useState(false);
  const [price, setPrice] = useState('');

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameAr) return;
    const newItem: GiftBoxItem = {
      id: Date.now().toString(),
      source: 'external',
      name: { ar: nameAr, en: nameEn || nameAr },
      quantity: parseInt(qty) || 1,
      isOptional,
      price: price ? parseFloat(price) : undefined,
      order: items.length + 1,
    };
    setItems([...items, newItem]);
    setNameAr('');
    setNameEn('');
    setQty('1');
    setPrice('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text-main)]">
            {isAr ? 'مكونات ومحتويات بوكسات الهدايا' : 'Gift Box Contents Master Library'}
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            {isAr
              ? 'مكتبة المحتويات المتاحة للإدراج داخل بوكسات الهدايا (ورد، شوكولاتة، شموع، كروت إهداء)'
              : 'Master library of items that can be included inside custom gift boxes'}
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)} leftIcon={<Plus className="h-4 w-4" />}>
          {isAr ? 'إضافة عنصر جديد للبوكس' : 'Add Item'}
        </Button>
      </div>

      {showAddModal && (
        <div className="bg-[var(--card-bg)] p-6 border border-[var(--border-color)] rounded-sm space-y-4 max-w-lg">
          <h2 className="text-sm font-semibold text-[var(--text-main)] border-b border-[var(--border-color)] pb-3">
            {isAr ? 'إضافة محتوى جديد لمكتبة البوكسات' : 'Add New Box Item'}
          </h2>
          <form onSubmit={handleAddItem} className="space-y-3">
            <Input
              label={isAr ? 'اسم العنصر (بالعربية)' : 'Item Name (Arabic)'}
              value={nameAr}
              onChange={(e) => setNameAr(e.target.value)}
              required
            />
            <Input
              label={isAr ? 'اسم العنصر (بالإنجليزية)' : 'Item Name (English)'}
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
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
            <label className="flex items-center gap-2 text-xs text-[var(--text-main)] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isOptional}
                onChange={(e) => setIsOptional(e.target.checked)}
                className="accent-[var(--text-main)] rounded"
              />
              <span>{isAr ? 'عنصر اختياري (يمكن للعميل إضافته أو تركه)' : 'Optional item for customer'}</span>
            </label>
            <div className="flex gap-2 pt-2">
              <Button type="submit">{isAr ? 'إضافة العنصر' : 'Add'}</Button>
              <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
                {isAr ? 'إلغاء' : 'Cancel'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Items Table */}
      <div className="bg-[var(--card-bg)] rounded-sm border border-[var(--border-color)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] text-start">
                <th className="py-3 px-4 font-medium">{isAr ? 'محتوى البوكس' : 'Item Name'}</th>
                <th className="py-3 px-4 font-medium">{isAr ? 'الكمية' : 'Quantity'}</th>
                <th className="py-3 px-4 font-medium">{isAr ? 'النوع' : 'Type'}</th>
                <th className="py-3 px-4 font-medium">{isAr ? 'السعر' : 'Price'}</th>
                <th className="py-3 px-4 font-medium">{isAr ? 'الترتيب' : 'Order'}</th>
                <th className="py-3 px-4 font-medium text-end">{isAr ? 'إجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-[var(--bg-secondary)] transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-sm bg-[var(--bg-secondary)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)]">
                        <Package className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-[var(--text-main)]">{item.name[locale]}</p>
                        <p className="text-[11px] text-[var(--text-secondary)]">{item.name.en}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-[var(--text-main)] font-mono">x{item.quantity}</td>
                  <td className="py-3.5 px-4">
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-sm border ${
                      item.isOptional
                        ? 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-color)]'
                        : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                    }`}>
                      {item.isOptional ? (isAr ? 'اختياري' : 'Optional') : (isAr ? 'أساسي' : 'Included')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-[var(--text-main)]">
                    {item.price ? `+${item.price} ج.م` : (isAr ? 'مشمول' : 'Included')}
                  </td>
                  <td className="py-3.5 px-4 text-[var(--text-secondary)]">{item.order}</td>
                  <td className="py-3.5 px-4 text-end">
                    <button
                      onClick={() => setItems(items.filter(x => x.id !== item.id))}
                      className="p-1.5 text-[var(--text-secondary)] hover:text-red-500 rounded"
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
    </div>
  );
}
