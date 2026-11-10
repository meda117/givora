'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Plus,
  Search,
  Eye,
  Trash2,
  Gift,
  Package,
  Printer,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';
import { collection, getDocs, deleteDoc, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { COLLECTIONS } from '@/lib/firebase/collections';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';
import type { Locale, ProductType } from '@/types';

interface RealProductItem {
  id: string;
  name: { ar: string; en: string };
  productType?: ProductType;
  type?: string;
  status: 'published' | 'draft' | 'hidden' | 'out_of_stock';
  basePrice?: number;
  price?: number;
  discountedPrice?: number;
  inventory?: number;
  mainCategory?: string;
  updatedAt?: string;
  createdAt?: string;
  images?: Array<{ url: string; fileId?: string; isCover?: boolean } | string>;
}

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
  const [products, setProducts] = useState<RealProductItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isToggling, setIsToggling] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Fetch real products from Firestore
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const q = query(collection(db, COLLECTIONS.PRODUCTS), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const list: RealProductItem[] = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          name: typeof data.name === 'object' ? data.name : { ar: data.name || '', en: data.name || '' },
          productType: data.productType || (data.type === 'gift-box' ? 'gift_box' : 'standard'),
          type: data.type || 'standard',
          status: data.status || 'draft',
          basePrice: data.basePrice ?? data.price ?? 0,
          discountedPrice: data.discountedPrice,
          inventory: data.inventory ?? 0,
          mainCategory: data.mainCategory || 'general',
          updatedAt: data.updatedAt ? new Date(data.updatedAt).toLocaleDateString('ar-EG') : '—',
          createdAt: data.createdAt,
          images: data.images || [],
        };
      });
      setProducts(list);
    } catch (err) {
      console.error('Failed to fetch real products from Firestore:', err);
      // Fallback query without orderBy if index is building
      try {
        const fallbackSnap = await getDocs(collection(db, COLLECTIONS.PRODUCTS));
        const list: RealProductItem[] = fallbackSnap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            name: typeof data.name === 'object' ? data.name : { ar: data.name || '', en: data.name || '' },
            productType: data.productType || (data.type === 'gift-box' ? 'gift_box' : 'standard'),
            type: data.type || 'standard',
            status: data.status || 'draft',
            basePrice: data.basePrice ?? data.price ?? 0,
            discountedPrice: data.discountedPrice,
            inventory: data.inventory ?? 0,
            mainCategory: data.mainCategory || 'general',
            updatedAt: data.updatedAt ? new Date(data.updatedAt).toLocaleDateString('ar-EG') : '—',
            createdAt: data.createdAt,
            images: data.images || [],
          };
        });
        setProducts(list);
      } catch (innerErr) {
        console.error('Fallback query also failed:', innerErr);
        setProducts([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    setIsDeleting(id);
    try {
      await deleteDoc(doc(db, COLLECTIONS.PRODUCTS, id));
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setSelectedIds((prev) => prev.filter((x) => x !== id));
      setDeleteConfirmId(null);
    } catch (err) {
      console.error('Failed to delete product from Firestore:', err);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleToggleStatus = async (product: RealProductItem) => {
    const nextStatus = product.status === 'published' ? 'draft' : 'published';
    setIsToggling(product.id);
    try {
      await updateDoc(doc(db, COLLECTIONS.PRODUCTS, product.id), {
        status: nextStatus,
        updatedAt: new Date().toISOString(),
      });
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, status: nextStatus } : p))
      );
    } catch (err) {
      console.error('Failed to toggle product status:', err);
    } finally {
      setIsToggling(null);
    }
  };

  const filtered = products.filter((p) => {
    const nameStr = (p.name?.[locale] || p.name?.ar || '').toLowerCase();
    const matchesSearch = nameStr.includes(search.toLowerCase());
    const actualType = p.productType || p.type || 'standard';
    const matchesType = typeFilter === 'all' || actualType === typeFilter;
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
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            {isAr ? 'كتالوج المنتجات وبوكسات الهدايا' : 'Product Catalog'}
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            {isAr
              ? `بيانات حية مباشرة من قاعدة البيانات • إجمالي ${products.length} منتج مسجل`
              : `Live Firestore records • Total ${products.length} products registered`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchProducts}
            isLoading={isLoading}
            leftIcon={<RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />}
          >
            {isAr ? 'تحديث' : 'Refresh'}
          </Button>
          <Link href={`/${locale}/admin/products/new`}>
            <Button leftIcon={<Plus className="h-4 w-4" />}>
              {isAr ? 'إضافة منتج جديد' : 'Add Product'}
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters bar */}
      <div className="bg-white dark:bg-[#1A1A1A] rounded-sm border border-neutral-200 dark:border-neutral-800 p-4 flex flex-wrap gap-3 items-center">
        <div className="flex-1 min-w-[220px]">
          <Input
            placeholder={isAr ? 'بحث عن منتج بالاسم في قاعدة البيانات...' : 'Search live products...'}
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
            <option value="all">{isAr ? 'جميع مسارات الصنع' : 'All Workflows'}</option>
            <option value="gift_box">{isAr ? 'بوكسات هدايا' : 'Gift Boxes'}</option>
            <option value="standard">{isAr ? 'منتجات قياسية' : 'Standard'}</option>
            <option value="printed">{isAr ? 'منتجات مطبوعة' : 'Printed'}</option>
            <option value="engraved">{isAr ? 'منتجات محفورة' : 'Engraved'}</option>
          </select>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="bg-white dark:bg-[#1A1A1A] rounded-sm border border-neutral-200 dark:border-neutral-800 p-8 space-y-4">
          <div className="flex items-center justify-center gap-3 py-12 text-neutral-500">
            <RefreshCw className="h-5 w-5 animate-spin text-neutral-900 dark:text-white" />
            <span className="text-sm font-medium">
              {isAr ? 'جاري تحميل كتالوج المنتجات من قاعدة البيانات...' : 'Loading products from database...'}
            </span>
          </div>
        </div>
      )}

      {/* Empty State — No mock data */}
      {!isLoading && products.length === 0 && (
        <div className="bg-white dark:bg-[#1A1A1A] rounded-sm border border-neutral-200 dark:border-neutral-800 p-12 text-center">
          <div className="w-16 h-16 rounded-sm bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center mx-auto mb-4 text-neutral-900 dark:text-white">
            <Gift className="h-8 w-8 stroke-[1.2]" />
          </div>
          <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-1">
            {isAr ? 'كتالوج المنتجات فارغ حالياً' : 'Product Catalog is Empty'}
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-md mx-auto mb-6 leading-relaxed">
            {isAr
              ? 'لم يتم تسجيل أي منتجات أو بوكسات هدايا بعد في قاعدة بيانات جيفورا الحقيقية. ابدأ الآن بإضافة أول منتج لتفعيله فوراً لعملاء المتجر.'
              : 'No products or gift boxes have been added to the live database yet. Create your first product to activate it in the store.'}
          </p>
          <Link href={`/${locale}/admin/products/new`}>
            <Button size="lg" leftIcon={<Plus className="h-4 w-4" />}>
              {isAr ? 'إضافة أول منتج للكتالوج' : 'Create First Product'}
            </Button>
          </Link>
        </div>
      )}

      {/* Products Table */}
      {!isLoading && products.length > 0 && (
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
                  const actualType = product.productType || product.type || 'standard';
                  const Icon = TYPE_ICONS[actualType] || Package;
                  const firstImg = product.images?.[0];
                  const imgUrl = typeof firstImg === 'string' ? firstImg : firstImg?.url;

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
                          <div className="w-10 h-10 rounded-sm bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 overflow-hidden flex items-center justify-center text-neutral-800 dark:text-neutral-200 flex-shrink-0 relative">
                            {imgUrl ? (
                              <Image
                                src={imgUrl}
                                alt={product.name[locale] || product.name.ar}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <Icon className="h-4 w-4 stroke-[1.5]" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-xs text-neutral-900 dark:text-white">
                              {product.name[locale] || product.name.ar || isAr ? 'منتج بدون اسم' : 'Untitled'}
                            </p>
                            <p className="text-[11px] text-neutral-400 dark:text-neutral-500 font-mono">
                              ID: {product.id.slice(0, 8)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-xs border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
                          {TYPE_LABELS[actualType]?.[locale] || actualType}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => handleToggleStatus(product)}
                          disabled={isToggling === product.id}
                          className="inline-flex items-center gap-1.5 cursor-pointer transition-opacity disabled:opacity-50"
                          title={isAr ? 'انقر لتغيير الحالة' : 'Click to toggle status'}
                        >
                          <Badge variant={product.status === 'published' ? 'success' : 'default'}>
                            {STATUS_LABELS[product.status]?.[locale] || product.status}
                          </Badge>
                          {product.status === 'published' ? (
                            <ToggleRight className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                          ) : (
                            <ToggleLeft className="h-4 w-4 text-neutral-400" />
                          )}
                        </button>
                      </td>
                      <td className="font-semibold text-xs text-neutral-900 dark:text-white">
                        {formatPrice(product.basePrice || 0, 'EGP', locale)}
                        {product.discountedPrice && product.discountedPrice < (product.basePrice || 0) && (
                          <span className="block text-[10px] text-neutral-400 line-through">
                            {formatPrice(product.discountedPrice, 'EGP', locale)}
                          </span>
                        )}
                      </td>
                      <td>
                        <span
                          className={`text-xs font-medium ${
                            (product.inventory || 0) <= 5
                              ? 'text-amber-600 dark:text-amber-400 font-bold'
                              : 'text-neutral-700 dark:text-neutral-300'
                          }`}
                        >
                          {product.inventory} {isAr ? 'قطعة' : 'units'}
                        </span>
                      </td>
                      <td className="text-xs text-neutral-400 dark:text-neutral-500 font-mono">
                        {product.updatedAt}
                      </td>
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

                          {deleteConfirmId === product.id ? (
                            <div className="inline-flex items-center gap-1 bg-red-50 dark:bg-red-950/40 p-1 rounded-xs border border-red-200 dark:border-red-800">
                              <span className="text-[10px] font-bold text-red-600 dark:text-red-400 px-1">
                                {isAr ? 'تأكيد الحذف؟' : 'Confirm?'}
                              </span>
                              <button
                                onClick={() => handleDelete(product.id)}
                                disabled={isDeleting === product.id}
                                className="px-2 py-0.5 bg-red-600 text-white text-[10px] font-bold rounded-xs hover:bg-red-700 transition-colors"
                              >
                                {isAr ? 'نعم' : 'Yes'}
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="px-1.5 py-0.5 text-neutral-500 text-[10px] hover:text-black dark:hover:text-white"
                              >
                                {isAr ? 'إلغاء' : 'Cancel'}
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirmId(product.id)}
                              className="p-1.5 text-neutral-400 hover:text-red-500 rounded-xs transition-colors"
                              title={isAr ? 'حذف من قاعدة البيانات' : 'Delete'}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
