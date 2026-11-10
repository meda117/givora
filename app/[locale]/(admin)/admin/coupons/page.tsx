'use client';
import { useState, useEffect } from 'react';
import { Plus, Trash2, Tag, Calendar, RefreshCw } from 'lucide-react';
import { collection, getDocs, setDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { COLLECTIONS } from '@/lib/firebase/collections';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import type { Locale, DiscountType } from '@/types';

interface RealCoupon {
  id: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  usageCount: number;
  usageLimit?: number;
  minOrder?: number;
  isActive: boolean;
  expiresAt?: string;
  createdAt?: string;
}

export default function AdminCouponsPage() {
  const isAr = true;
  const locale: Locale = 'ar';
  const [coupons, setCoupons] = useState<RealCoupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<DiscountType>('percentage');
  const [value, setValue] = useState('');
  const [minOrder, setMinOrder] = useState('250');
  const [expiresAt, setExpiresAt] = useState('');

  const fetchCoupons = async () => {
    setIsLoading(true);
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.COUPONS));
      const list: RealCoupon[] = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          code: data.code || '',
          discountType: data.discountType || 'percentage',
          discountValue: Number(data.discountValue) || 0,
          usageCount: Number(data.usageCount) || 0,
          usageLimit: Number(data.usageLimit) || 100,
          minOrder: Number(data.minOrder) || 0,
          isActive: data.isActive !== false,
          expiresAt: data.expiresAt || '—',
          createdAt: data.createdAt,
        };
      });
      setCoupons(list);
    } catch (err) {
      console.error('Failed to fetch coupons from Firestore:', err);
      setCoupons([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleAddCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setIsSaving(true);
    try {
      const newId = `cpn_${Date.now()}`;
      const newCoupon: RealCoupon = {
        id: newId,
        code: code.toUpperCase().trim(),
        discountType,
        discountValue: parseFloat(value) || 0,
        usageCount: 0,
        usageLimit: 100,
        minOrder: parseFloat(minOrder) || 0,
        isActive: true,
        expiresAt: expiresAt || '2026-12-31',
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, COLLECTIONS.COUPONS, newId), newCoupon);
      setCoupons((prev) => [...prev, newCoupon]);
      setCode('');
      setValue('');
      setExpiresAt('');
      setShowAddModal(false);
    } catch (err) {
      console.error('Failed to add coupon:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    try {
      await deleteDoc(doc(db, COLLECTIONS.COUPONS, id));
      setCoupons((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error('Failed to delete coupon:', err);
    }
  };

  const handleToggleActive = async (c: RealCoupon) => {
    const nextVal = !c.isActive;
    try {
      await updateDoc(doc(db, COLLECTIONS.COUPONS, c.id), { isActive: nextVal });
      setCoupons((prev) =>
        prev.map((item) => (item.id === c.id ? { ...item, isActive: nextVal } : item))
      );
    } catch (err) {
      console.error('Failed to toggle coupon status:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            {isAr ? 'إدارة الكوبونات والخصومات الحقيقية' : 'Coupons & Discounts'}
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            {isAr
              ? `أكواد الخصم المخزنة في قاعدة البيانات ومفعلة لعملاء المتجر • ${coupons.length} كود مسجل`
              : `Active coupon records stored in Firestore • ${coupons.length} coupons`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchCoupons}
            isLoading={isLoading}
            leftIcon={<RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />}
          >
            {isAr ? 'تحديث' : 'Refresh'}
          </Button>
          <Button onClick={() => setShowAddModal(true)} leftIcon={<Plus className="h-4 w-4" />}>
            {isAr ? 'إنشاء كود خصم جديد' : 'Create Coupon'}
          </Button>
        </div>
      </div>

      {showAddModal && (
        <div className="bg-white dark:bg-[#1A1A1A] p-6 border border-neutral-200 dark:border-neutral-800 rounded-sm shadow-sm space-y-4 max-w-lg">
          <h2 className="text-sm font-bold text-neutral-900 dark:text-white border-b border-neutral-100 dark:border-neutral-800 pb-3">
            {isAr ? 'إنشاء كود خصم جديد' : 'New Coupon'}
          </h2>
          <form onSubmit={handleAddCoupon} className="space-y-3">
            <Input
              label={isAr ? 'كود الخصم (بالحروف الإنجليزية)' : 'Coupon Code'}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. GIVORA20"
              required
              dir="ltr"
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                {isAr ? 'نوع الخصم' : 'Discount Type'}
              </label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as DiscountType)}
                className="w-full h-11 rounded-sm border border-neutral-200 dark:border-neutral-700 px-3.5 text-xs font-semibold bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
              >
                <option value="percentage">{isAr ? 'نسبة مئوية (%)' : 'Percentage (%)'}</option>
                <option value="fixed">{isAr ? 'مبلغ ثابت (ج.م)' : 'Fixed Amount (EGP)'}</option>
                <option value="free_shipping">{isAr ? 'شحن مجاني' : 'Free Shipping'}</option>
              </select>
            </div>
            {discountType !== 'free_shipping' && (
              <Input
                label={discountType === 'percentage' ? (isAr ? 'نسبة الخصم (%)' : 'Percentage') : (isAr ? 'قيمة الخصم (ج.م)' : 'Amount')}
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={discountType === 'percentage' ? '15' : '100'}
                required
              />
            )}
            <Input
              label={isAr ? 'الحد الأدنى للطلب (ج.م)' : 'Minimum Order (EGP)'}
              type="number"
              value={minOrder}
              onChange={(e) => setMinOrder(e.target.value)}
              placeholder="250"
            />
            <Input
              label={isAr ? 'تاريخ انتهاء الصلاحية' : 'Expiry Date'}
              type="date"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
            />
            <div className="flex gap-2 pt-2">
              <Button type="submit" isLoading={isSaving}>{isAr ? 'حفظ وتفعيل الكود' : 'Save Coupon'}</Button>
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
          <p className="text-xs">{isAr ? 'جاري استرجاع الكوبونات من قاعدة البيانات...' : 'Loading coupons...'}</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && coupons.length === 0 && (
        <div className="bg-white dark:bg-[#1A1A1A] rounded-sm border border-neutral-200 dark:border-neutral-800 p-12 text-center">
          <div className="w-16 h-16 rounded-sm bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center mx-auto mb-4 text-neutral-900 dark:text-white">
            <Tag className="h-8 w-8 stroke-[1.2]" />
          </div>
          <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-1">
            {isAr ? 'لا توجد كوبونات خصم مسجلة' : 'No Coupons Found'}
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-md mx-auto mb-6 leading-relaxed">
            {isAr
              ? 'لم يتم إنشاء أي كوبونات خصم بعد في قاعدة البيانات. يمكنك إنشاء كود خصم لعملائك بنسبة مئوية أو قيمة ثابتة أو شحن مجاني.'
              : 'No coupons have been registered in the database yet. Create coupon codes to boost your store sales.'}
          </p>
          <Button onClick={() => setShowAddModal(true)} leftIcon={<Plus className="h-4 w-4" />}>
            {isAr ? 'إنشاء أول كود خصم' : 'Create First Coupon'}
          </Button>
        </div>
      )}

      {/* Table */}
      {!isLoading && coupons.length > 0 && (
        <div className="bg-white dark:bg-[#1A1A1A] rounded-sm border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>{isAr ? 'الكود' : 'Code'}</th>
                  <th>{isAr ? 'النوع' : 'Type'}</th>
                  <th>{isAr ? 'القيمة' : 'Value'}</th>
                  <th>{isAr ? 'الحد الأدنى للطلب' : 'Min Order'}</th>
                  <th>{isAr ? 'مرات الاستخدام' : 'Usage'}</th>
                  <th>{isAr ? 'تاريخ الانتهاء' : 'Expiry'}</th>
                  <th>{isAr ? 'الحالة' : 'Status'}</th>
                  <th className="text-end">{isAr ? 'إجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((c) => (
                  <tr key={c.id}>
                    <td className="font-mono font-bold text-xs text-neutral-900 dark:text-white">{c.code}</td>
                    <td>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-xs border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
                        {c.discountType === 'percentage'
                          ? isAr ? 'نسبة مئوية' : 'Percentage'
                          : c.discountType === 'fixed'
                          ? isAr ? 'مبلغ ثابت' : 'Fixed'
                          : isAr ? 'شحن مجاني' : 'Free Ship'}
                      </span>
                    </td>
                    <td className="font-semibold text-xs text-neutral-900 dark:text-white">
                      {c.discountType === 'percentage'
                        ? `${c.discountValue}%`
                        : c.discountType === 'fixed'
                        ? `${c.discountValue} ج.م`
                        : isAr ? 'شحن مجاني' : 'Free'}
                    </td>
                    <td className="text-xs text-neutral-600 dark:text-neutral-400 font-mono">
                      {c.minOrder ? `${c.minOrder} ج.م` : '—'}
                    </td>
                    <td className="text-xs text-neutral-600 dark:text-neutral-400 font-mono">
                      {c.usageCount} / {c.usageLimit || 100}
                    </td>
                    <td className="text-xs text-neutral-500 font-mono">{c.expiresAt || '—'}</td>
                    <td>
                      <button
                        onClick={() => handleToggleActive(c)}
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-xs transition-colors border ${
                          c.isActive
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 border-neutral-200 dark:border-neutral-700'
                        }`}
                      >
                        {c.isActive ? (isAr ? 'مفعل' : 'Active') : (isAr ? 'معطل' : 'Disabled')}
                      </button>
                    </td>
                    <td className="text-end">
                      <button
                        onClick={() => handleDeleteCoupon(c.id)}
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
