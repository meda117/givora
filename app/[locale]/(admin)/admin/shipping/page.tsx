'use client';
import { useState } from 'react';
import { Truck, Plus, Trash2, Search, Edit2, Check, X, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';
import { EGYPTIAN_GOVERNORATES } from '@/lib/data/egyptian-locations';
import type { Locale } from '@/types';

interface EditableGovernorateShipping {
  id: string;
  nameAr: string;
  nameEn: string;
  code: string;
  fee: number;
  freeThreshold: number;
  deliveryMin: number;
  deliveryMax: number;
  isActive: boolean;
  cityCount: number;
}

const INITIAL_GOVERNORATES_SHIPPING: EditableGovernorateShipping[] = EGYPTIAN_GOVERNORATES.map(g => ({
  id: g.id,
  nameAr: g.name.ar,
  nameEn: g.name.en,
  code: g.code,
  fee: g.shippingFee,
  freeThreshold: 1000,
  deliveryMin: g.deliveryEstimateDays.min,
  deliveryMax: g.deliveryEstimateDays.max,
  isActive: g.isActive,
  cityCount: g.cities.length,
}));

export default function AdminShippingPage() {
  const isAr = true;
  const locale: Locale = 'ar';
  const [shippingList, setShippingList] = useState<EditableGovernorateShipping[]>(INITIAL_GOVERNORATES_SHIPPING);
  const [search, setSearch] = useState('');
  const [globalThreshold, setGlobalThreshold] = useState('1000');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFee, setEditFee] = useState<number>(50);
  const [editMinDays, setEditMinDays] = useState<number>(1);
  const [editMaxDays, setEditMaxDays] = useState<number>(2);

  const filteredList = shippingList.filter(item =>
    item.nameAr.toLowerCase().includes(search.toLowerCase()) ||
    item.nameEn.toLowerCase().includes(search.toLowerCase()) ||
    item.code.toLowerCase().includes(search.toLowerCase())
  );

  const startEdit = (item: EditableGovernorateShipping) => {
    setEditingId(item.id);
    setEditFee(item.fee);
    setEditMinDays(item.deliveryMin);
    setEditMaxDays(item.deliveryMax);
  };

  const saveEdit = (id: string) => {
    setShippingList(prev => prev.map(item =>
      item.id === id
        ? { ...item, fee: editFee, deliveryMin: editMinDays, deliveryMax: editMaxDays }
        : item
    ));
    setEditingId(null);
  };

  const toggleActive = (id: string) => {
    setShippingList(prev => prev.map(item =>
      item.id === id ? { ...item, isActive: !item.isActive } : item
    ));
  };

  const applyGlobalThreshold = () => {
    const thresholdNum = parseFloat(globalThreshold) || 1000;
    setShippingList(prev => prev.map(item => ({ ...item, freeThreshold: thresholdNum })));
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text-main)]">
            {isAr ? 'إدارة الشحن لمحافظات مصر (27 محافظة)' : 'Egyptian Governorates Shipping (27 Governorates)'}
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            {isAr
              ? 'التحكم في مصاريف الشحن لكل محافظة ومدة التوصيل وحد الشحن المجاني والتفعيل والإيقاف'
              : 'Control shipping rates, delivery timelines, free shipping thresholds, and active status for all 27 Egyptian governorates'}
          </p>
        </div>
      </div>

      {/* Global Free Shipping Setting Card */}
      <div className="bg-[var(--card-bg)] p-5 border border-[var(--border-color)] rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-sm bg-[var(--bg-secondary)] border border-[var(--border-color)]">
            <Truck className="h-5 w-5 text-[var(--text-main)]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-main)]">
              {isAr ? 'حد الشحن المجاني العام في مصر' : 'Global Free Shipping Threshold in Egypt'}
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              {isAr ? 'أي طلب يتجاوز هذا المبلغ يحصل العميل على توصيل مجاني تلقائياً' : 'Any order exceeding this value gets automatic free shipping'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Input
            type="number"
            value={globalThreshold}
            onChange={(e) => setGlobalThreshold(e.target.value)}
            className="w-32 text-end font-mono"
            rightElement={<span className="text-xs text-[var(--text-secondary)]">ج.م</span>}
          />
          <Button variant="outline" size="sm" onClick={applyGlobalThreshold}>
            {isAr ? 'تطبيق على الكل' : 'Apply All'}
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-[var(--card-bg)] rounded-sm border border-[var(--border-color)] p-4">
        <Input
          placeholder={isAr ? 'بحث باسم المحافظة (مثال: القاهرة، الدقهلية، الإسكندرية، أسوان)...' : 'Search governorate...'}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftElement={<Search className="h-4 w-4" />}
        />
      </div>

      {/* 27 Governorates Table */}
      <div className="bg-[var(--card-bg)] rounded-sm border border-[var(--border-color)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] text-start">
                <th className="py-3 px-4 font-medium">{isAr ? 'المحافظة' : 'Governorate'}</th>
                <th className="py-3 px-4 font-medium">{isAr ? 'كود المحافظة' : 'Code'}</th>
                <th className="py-3 px-4 font-medium">{isAr ? 'عدد المدن/المراكز' : 'Cities/Districts'}</th>
                <th className="py-3 px-4 font-medium">{isAr ? 'رسوم الشحن' : 'Shipping Fee'}</th>
                <th className="py-3 px-4 font-medium">{isAr ? 'مدة التوصيل' : 'Delivery Days'}</th>
                <th className="py-3 px-4 font-medium">{isAr ? 'حد الشحن المجاني' : 'Free Shipping At'}</th>
                <th className="py-3 px-4 font-medium">{isAr ? 'حالة التوصيل' : 'Status'}</th>
                <th className="py-3 px-4 font-medium text-end">{isAr ? 'إجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {filteredList.map((gov) => {
                const isEditing = editingId === gov.id;
                return (
                  <tr key={gov.id} className="hover:bg-[var(--bg-secondary)] transition-colors">
                    <td className="py-3.5 px-4">
                      <div>
                        <p className="font-medium text-sm text-[var(--text-main)]">{gov.nameAr}</p>
                        <p className="text-[11px] text-[var(--text-secondary)]">{gov.nameEn}</p>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[var(--text-secondary)]">
                      {gov.code}
                    </td>

                    <td className="py-3.5 px-4 text-[var(--text-secondary)]">
                      {gov.cityCount} {isAr ? 'مدينة وميدان' : 'cities'}
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-[var(--text-main)]">
                      {isEditing ? (
                        <div className="flex items-center gap-1 w-28">
                          <input
                            type="number"
                            value={editFee}
                            onChange={(e) => setEditFee(parseFloat(e.target.value) || 0)}
                            className="w-16 h-8 px-2 rounded border border-[var(--border-color)] bg-[var(--bg-main)] text-[var(--text-main)] font-mono text-xs"
                          />
                          <span className="text-[11px]">ج.م</span>
                        </div>
                      ) : (
                        formatPrice(gov.fee, 'EGP', locale)
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-[var(--text-secondary)]">
                      {isEditing ? (
                        <div className="flex items-center gap-1 w-32">
                          <input
                            type="number"
                            value={editMinDays}
                            onChange={(e) => setEditMinDays(parseInt(e.target.value) || 1)}
                            className="w-10 h-8 px-1.5 rounded border border-[var(--border-color)] bg-[var(--bg-main)] text-[var(--text-main)] font-mono text-center text-xs"
                          />
                          <span>-</span>
                          <input
                            type="number"
                            value={editMaxDays}
                            onChange={(e) => setEditMaxDays(parseInt(e.target.value) || 2)}
                            className="w-10 h-8 px-1.5 rounded border border-[var(--border-color)] bg-[var(--bg-main)] text-[var(--text-main)] font-mono text-center text-xs"
                          />
                          <span className="text-[10px]">{isAr ? 'يوم' : 'd'}</span>
                        </div>
                      ) : (
                        <span>{gov.deliveryMin} - {gov.deliveryMax} {isAr ? 'أيام عمل' : 'business days'}</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-emerald-600 dark:text-emerald-400 font-medium">
                      {isAr ? `فوق ${gov.freeThreshold} ج.م` : `Over ${gov.freeThreshold} EGP`}
                    </td>

                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => toggleActive(gov.id)}
                        className={`text-[11px] font-medium px-2 py-0.5 rounded-sm transition-colors border ${
                          gov.isActive
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                            : 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
                        }`}
                      >
                        {gov.isActive ? (isAr ? 'مفعل للتوصيل' : 'Active') : (isAr ? 'معطل' : 'Disabled')}
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-end">
                      {isEditing ? (
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => saveEdit(gov.id)}
                            className="p-1.5 rounded bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                            title={isAr ? 'حفظ التعديل' : 'Save'}
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-1.5 rounded border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors"
                            title={isAr ? 'إلغاء' : 'Cancel'}
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEdit(gov)}
                          className="p-1.5 rounded border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-[var(--bg-secondary)] transition-colors"
                          title={isAr ? 'تعديل السعر والمدة' : 'Edit Fee & Timeline'}
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                      )}
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
