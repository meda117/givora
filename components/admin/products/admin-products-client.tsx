'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Eye, Edit, Trash2, Gift, Package, Printer, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';
import type { Locale, ProductType } from '@/types';

const MOCK_PRODUCTS = [
  { id: '1', name: { ar: 'بوكس الورد الملكي الفاخر', en: 'Royal Luxury Rose Box' }, type: 'gift_box' as ProductType, status: 'published', price: 650, inventory: 15, mainCategory: 'gift-boxes', updatedAt: '2026-11-01' },
  { id: '2', name: { ar: 'سلسلة اسم بالفضة الإيطالي عيار 925', en: 'Personalized Silver Name Necklace' }, type: 'engraved' as ProductType, status: 'published', price: 350, inventory: 32, mainCategory: 'trending-gifts', updatedAt: '2026-11-02' },
  { id: '3', name: { ar: 'مج سيراميك فاخر مطبوع بالصورة', en: 'Custom Printed Ceramic Mug' }, type: 'printed' as ProductType, status: 'published', price: 220, inventory: 50, mainCategory: 'trending-gifts', updatedAt: '2026-11-03' },
  { id: '4', name: { ar: 'بوكس الذكريات الرومانسي (كابلز)', en: 'Romantic Memories Gift Box' }, type: 'gift_box' as ProductType, status: 'published', price: 850, inventory: 8, mainCategory: 'gift-boxes', updatedAt: '2026-11-04' },
  { id: '5', name: { ar: 'إسورة جلد طبيعي قابلة للتعديل', en: 'Genuine Leather Adjustable Bracelet' }, type: 'standard' as ProductType, status: 'draft', price: 190, inventory: 25, mainCategory: 'trending-gifts', updatedAt: '2026-11-05' },
];

const TYPE_ICONS: Record<string, any> = {
  gift_box: Gift,
  'gift-box': Gift,
  standard: Package,
  physical: Package,
  printed: Printer,
  engraved: Sparkles,
};

const TYPE_LABELS: Record<string, { ar: string; en: string }> = {
  gift_box: { ar: 'بوكس هدايا', en: 'Gift Box' },
  'gift-box': { ar: 'بوكس هدايا', en: 'Gift Box' },
  standard: { ar: 'منتج قياسي', en: 'Standard' },
  physical: { ar: 'منتج قياسي', en: 'Standard' },
  printed: { ar: 'منتج مطبوع', en: 'Printed' },
  engraved: { ar: 'منتج محفور', en: 'Engraved' },
};

const STATUS_LABELS: Record<string, { ar: string; en: string }> = {
  published: { ar: 'منشور', en: 'Published' },
  draft: { ar: 'مسودة', en: 'Draft' },
  hidden: { ar: 'مخفي', en: 'Hidden' },
  out_of_stock: { ar: 'نفد المخزون', en: 'Out of Stock' },
};

export function AdminProductsClient({ locale }: { locale: Locale }) {
  const isAr = locale === 'ar';
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filtered = MOCK_PRODUCTS.filter((p) => {
    const matchesSearch = p.name[locale].toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || p.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            {isAr ? 'كتالوج المنتجات والهدايا' : 'Product Catalog'}
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            {isAr ? `إجمالي ${filtered.length} منتج مسجل بالمتجر` : `Total ${filtered.length} products`}
          </p>
        </div>
        <Link href={`/${locale}/admin/products/new`}>
          <Button leftIcon={<Plus className="h-4 w-4" />}>
            {isAr ? 'إضافة منتج جديد' : 'Add Product'}
          </Button>
        </Link>
      </div>

      {/* Filters bar */}
      <div className="bg-white dark:bg-[#1A1A1A] rounded-sm border border-neutral-200 dark:border-neutral-800 p-4 flex flex-wrap gap-3 items-center">
        <div className="flex-1 min-w-[220px]">
          <Input
            placeholder={isAr ? 'بحث عن منتج بالاسم...' : 'Search product name...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftElement={<Search className="h-4 w-4" />}
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-11 px-3 rounded-sm border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs font-semibold text-neutral-800 dark:text-neutral-200 focus:outline-none"
          >
            <option value="all">{isAr ? 'جميع الأنواع' : 'All Types'}</option>
            <option value="gift_box">{isAr ? 'بوكسات هدايا' : 'Gift Boxes'}</option>
            <option value="standard">{isAr ? 'منتجات قياسية' : 'Standard'}</option>
            <option value="printed">{isAr ? 'منتجات مطبوعة' : 'Printed'}</option>
            <option value="engraved">{isAr ? 'منتجات محفورة' : 'Engraved'}</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white dark:bg-[#1A1A1A] rounded-sm border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th className="w-10">
                  <input
                    type="checkbox"
                    onChange={(e) => setSelectedIds(e.target.checked ? filtered.map((p) => p.id) : [])}
                    checked={selectedIds.length === filtered.length && filtered.length > 0}
                    className="accent-black dark:accent-white"
                  />
                </th>
                <th>{isAr ? 'المنتج' : 'Product'}</th>
                <th>{isAr ? 'مسار الصنع / النوع' : 'Type / Workflow'}</th>
                <th>{isAr ? 'الحالة' : 'Status'}</th>
                <th>{isAr ? 'السعر' : 'Price'}</th>
                <th>{isAr ? 'المخزون' : 'Stock'}</th>
                <th>{isAr ? 'آخر تحديث' : 'Updated'}</th>
                <th className="text-end">{isAr ? 'الإجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => {
                const Icon = TYPE_ICONS[product.type] || Package;
                return (
                  <tr key={product.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(product.id)}
                        onChange={() => toggleSelect(product.id)}
                        className="accent-black dark:accent-white"
                      />
                    </td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-sm bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-neutral-800 dark:text-neutral-200 flex-shrink-0">
                          <Icon className="h-4 w-4 stroke-[1.5]" />
                        </div>
                        <div>
                          <p className="font-semibold text-xs text-neutral-900 dark:text-white">{product.name[locale]}</p>
                          <p className="text-[11px] text-neutral-400 dark:text-neutral-500">{product.mainCategory}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-xs border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
                        {TYPE_LABELS[product.type]?.[locale] || product.type}
                      </span>
                    </td>
                    <td>
                      <Badge variant={product.status === 'published' ? 'success' : 'default'}>
                        {STATUS_LABELS[product.status]?.[locale] || product.status}
                      </Badge>
                    </td>
                    <td className="font-semibold text-xs text-neutral-900 dark:text-white">
                      {formatPrice(product.price, 'EGP', locale)}
                    </td>
                    <td>
                      <span className="text-xs text-neutral-700 dark:text-neutral-300 font-medium">
                        {product.inventory} {isAr ? 'قطعة' : 'units'}
                      </span>
                    </td>
                    <td className="text-xs text-neutral-400 dark:text-neutral-500 font-mono">{product.updatedAt}</td>
                    <td className="text-end">
                      <div className="inline-flex items-center gap-1">
                        <Link href={`/${locale}/products/${product.id}`} target="_blank">
                          <button
                            className="p-1.5 text-neutral-400 hover:text-black dark:hover:text-white rounded-xs transition-colors"
                            title={isAr ? 'معاينة في المتجر' : 'View in Store'}
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                        </Link>
                        <button
                          className="p-1.5 text-neutral-400 hover:text-black dark:hover:text-white rounded-xs transition-colors"
                          title={isAr ? 'تعديل' : 'Edit'}
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button
                          className="p-1.5 text-neutral-400 hover:text-red-500 rounded-xs transition-colors"
                          title={isAr ? 'حذف' : 'Delete'}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
