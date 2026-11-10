'use client';
import { useState } from 'react';
import { Plus, Trash2, Tag, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import type { Locale, Coupon, DiscountType } from '@/types';

const INITIAL_COUPONS = [
  { id: '1', code: 'GIVORA10', discountType: 'percentage' as DiscountType, discountValue: 10, usageCount: 45, usageLimit: 100, minOrder: 500, isActive: true, expiresAt: '2026-12-31' },
  { id: '2', code: 'LUXURY100', discountType: 'fixed' as DiscountType, discountValue: 100, usageCount: 12, usageLimit: 50, minOrder: 1000, isActive: true, expiresAt: '2026-11-30' },
  { id: '3', code: 'FREESHIP', discountType: 'free_shipping' as DiscountType, discountValue: 0, usageCount: 89, usageLimit: 200, minOrder: 500, isActive: true, expiresAt: '2026-12-15' },
];

export default function AdminCouponsPage() {
  const isAr = true;
  const locale: Locale = 'ar';
  const [coupons, setCoupons] = useState(INITIAL_COUPONS);
  const [showAddModal, setShowAddModal] = useState(false);

  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<DiscountType>('percentage');
  const [value, setValue] = useState('');
  const [minOrder, setMinOrder] = useState('150');

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;
    const newCoupon = {
      id: Date.now().toString(),
      code: code.toUpperCase().trim(),
      discountType,
      discountValue: parseFloat(value) || 0,
      usageCount: 0,
      usageLimit: 100,
      minOrder: parseFloat(minOrder) || 0,
      isActive: true,
      expiresAt: '2026-12-31',
    };
    setCoupons([...coupons, newCoupon]);
    setCode('');
    setValue('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-charcoal">
            {isAr ? 'إدارة الكوبونات والخصومات' : 'Coupons & Discounts'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {isAr ? 'إنشاء أكواد الخصم وتحديد نسب أو مبالغ التخفيض والشحن المجاني' : 'Manage coupon codes and discount thresholds'}
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)} leftIcon={<Plus className="h-4 w-4" />}>
          {isAr ? 'إنشاء كود خصم' : 'Create Coupon'}
        </Button>
      </div>

      {showAddModal && (
        <div className="bg-white p-6 border border-gray-100 rounded-sm shadow-sm space-y-4 max-w-lg">
          <h2 className="text-sm font-semibold text-charcoal border-b pb-3">
            {isAr ? 'إنشاء كوبون جديد' : 'Create New Coupon'}
          </h2>
          <form onSubmit={handleAddCoupon} className="space-y-3">
            <Input
              label={isAr ? 'كود الكوبون' : 'Coupon Code'}
              placeholder="GIVORA20"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              dir="ltr"
            />
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-charcoal">
                  {isAr ? 'نوع الخصم' : 'Discount Type'}
                </label>
                <select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value as DiscountType)}
                  className="h-11 rounded-sm border border-gray-200 px-3 text-sm bg-white"
                >
                  <option value="percentage">{isAr ? 'نسبة مئوية (%)' : 'Percentage (%)'}</option>
                  <option value="fixed">{isAr ? 'مبلغ ثابت (ج.م)' : 'Fixed Amount (EGP)'}</option>
                  <option value="free_shipping">{isAr ? 'شحن مجاني' : 'Free Shipping'}</option>
                </select>
              </div>
              <Input
                label={isAr ? 'قيمة الخصم' : 'Discount Value'}
                type="number"
                placeholder={discountType === 'percentage' ? '15' : '50'}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                disabled={discountType === 'free_shipping'}
              />
            </div>
            <Input
              label={isAr ? 'الحد الأدنى لقيمة الطلب (ج.م)' : 'Minimum Order Amount (EGP)'}
              type="number"
              value={minOrder}
              onChange={(e) => setMinOrder(e.target.value)}
            />
            <div className="flex gap-2 pt-3">
              <Button type="submit">{isAr ? 'إنشاء الكوبون' : 'Create'}</Button>
              <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
                {isAr ? 'إلغاء' : 'Cancel'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Coupons Table */}
      <div className="bg-white rounded-sm border border-gray-100 overflow-hidden">
        <table className="admin-table">
          <thead>
            <tr>
              <th>{isAr ? 'كود الكوبون' : 'Code'}</th>
              <th>{isAr ? 'النوع والقيمة' : 'Type & Value'}</th>
              <th>{isAr ? 'الحد الأدنى' : 'Min Order'}</th>
              <th>{isAr ? 'مرات الاستخدام' : 'Usage'}</th>
              <th>{isAr ? 'تاريخ الانتهاء' : 'Expires'}</th>
              <th>{isAr ? 'الحالة' : 'Status'}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c.id}>
                <td>
                  <span className="font-mono text-sm font-semibold text-gold bg-gold/10 px-2 py-1 rounded">
                    {c.code}
                  </span>
                </td>
                <td className="font-medium">
                  {c.discountType === 'percentage'
                    ? `${c.discountValue}%`
                    : c.discountType === 'fixed'
                    ? `${c.discountValue} ج.م`
                    : (isAr ? 'شحن مجاني' : 'Free Shipping')}
                </td>
                <td className="text-xs text-gray-500">{c.minOrder} ج.م</td>
                <td className="text-xs">
                  {c.usageCount} / {c.usageLimit}
                </td>
                <td className="text-xs text-gray-400">{c.expiresAt}</td>
                <td>
                  <Badge variant="success">{isAr ? 'نشط' : 'Active'}</Badge>
                </td>
                <td>
                  <button
                    onClick={() => setCoupons(coupons.filter(x => x.id !== c.id))}
                    className="p-1.5 text-gray-400 hover:text-red-500 rounded"
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
  );
}
