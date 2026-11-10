'use client';
import { useState, useEffect } from 'react';
import { Truck, Search, Edit2, Check, X, ShieldCheck, RefreshCw } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { COLLECTIONS } from '@/lib/firebase/collections';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

const DEFAULT_SHIPPING: EditableGovernorateShipping[] = EGYPTIAN_GOVERNORATES.map((g) => ({
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
  const [shippingList, setShippingList] = useState<EditableGovernorateShipping[]>(DEFAULT_SHIPPING);
  const [search, setSearch] = useState('');
  const [globalThreshold, setGlobalThreshold] = useState('1000');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFee, setEditFee] = useState<number>(50);
  const [editMinDays, setEditMinDays] = useState<number>(1);
  const [editMaxDays, setEditMaxDays] = useState<number>(2);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Fetch real settings from Firestore
  useEffect(() => {
    const fetchShipping = async () => {
      setIsLoading(true);
      try {
        const snap = await getDoc(doc(db, COLLECTIONS.WEBSITE_SETTINGS, 'shipping'));
        if (snap.exists()) {
          const data = snap.data();
          if (data.globalThreshold) setGlobalThreshold(String(data.globalThreshold));
          if (Array.isArray(data.governorates) && data.governorates.length > 0) {
            setShippingList(data.governorates);
          }
        }
      } catch (err) {
        console.error('Failed to load shipping settings from Firestore:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchShipping();
  }, []);

  const persistToFirestore = async (updatedList: EditableGovernorateShipping[], threshold: string) => {
    setIsSaving(true);
    try {
      await setDoc(
        doc(db, COLLECTIONS.WEBSITE_SETTINGS, 'shipping'),
        {
          globalThreshold: parseFloat(threshold) || 1000,
          governorates: updatedList,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      console.error('Failed to persist shipping to Firestore:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredList = shippingList.filter(
    (item) =>
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

  const saveEdit = async (id: string) => {
    const nextList = shippingList.map((item) =>
      item.id === id
        ? { ...item, fee: editFee, deliveryMin: editMinDays, deliveryMax: editMaxDays }
        : item
    );
    setShippingList(nextList);
    setEditingId(null);
    await persistToFirestore(nextList, globalThreshold);
  };

  const toggleActive = async (id: string) => {
    const nextList = shippingList.map((item) =>
      item.id === id ? { ...item, isActive: !item.isActive } : item
    );
    setShippingList(nextList);
    await persistToFirestore(nextList, globalThreshold);
  };

  const applyGlobalThreshold = async () => {
    const thresholdNum = parseFloat(globalThreshold) || 1000;
    const nextList = shippingList.map((item) => ({ ...item, freeThreshold: thresholdNum }));
    setShippingList(nextList);
    await persistToFirestore(nextList, globalThreshold);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            {isAr ? 'إدارة الشحن والتوصيل لمحافظات مصر (27 محافظة)' : 'Egyptian Governorates Shipping (27 Governorates)'}
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            {isAr
              ? 'تعديل أسعار الشحن ومدة التوصيل وحد الشحن المجاني وحفظها فورياً في قاعدة البيانات'
              : 'Configure shipping fees, delivery timelines, and free shipping thresholds stored in live database'}
          </p>
        </div>
        {saveSuccess && (
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-xs border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
            <Check className="h-4 w-4" />
            <span>{isAr ? 'تم حفظ التعديلات في قاعدة البيانات!' : 'Saved to database!'}</span>
          </span>
        )}
      </div>

      {/* Global Free Shipping Setting Card */}
      <div className="bg-white dark:bg-[#1A1A1A] p-5 border border-neutral-200 dark:border-neutral-800 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-sm bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
            <Truck className="h-5 w-5 text-neutral-900 dark:text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              {isAr ? 'حد الشحن المجاني العام في مصر' : 'Global Free Shipping Threshold in Egypt'}
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {isAr
                ? 'أي طلب يتجاوز هذا المبلغ يحصل العميل على توصيل مجاني تلقائياً'
                : 'Any order exceeding this value gets automatic free shipping'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-32">
            <Input
              type="number"
              value={globalThreshold}
              onChange={(e) => setGlobalThreshold(e.target.value)}
              placeholder="1000"
            />
          </div>
          <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">ج.م</span>
          <Button onClick={applyGlobalThreshold} size="sm" isLoading={isSaving}>
            {isAr ? 'تطبيق على كل المحافظات' : 'Apply to All'}
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-[#1A1A1A] rounded-sm border border-neutral-200 dark:border-neutral-800 p-4 max-w-md">
        <Input
          placeholder={isAr ? 'بحث عن محافظة...' : 'Search governorate...'}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftElement={<Search className="h-4 w-4" />}
        />
      </div>

      {/* Governorates Table */}
      <div className="bg-white dark:bg-[#1A1A1A] rounded-sm border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>{isAr ? 'المحافظة' : 'Governorate'}</th>
                <th>{isAr ? 'كود المنطقة' : 'Code'}</th>
                <th>{isAr ? 'المدن المغطاة' : 'Cities'}</th>
                <th>{isAr ? 'مصاريف الشحن' : 'Shipping Fee'}</th>
                <th>{isAr ? 'مدة التوصيل المقدرة' : 'Delivery Estimate'}</th>
                <th>{isAr ? 'الشحن المجاني' : 'Free Shipping'}</th>
                <th>{isAr ? 'الحالة' : 'Status'}</th>
                <th className="text-end">{isAr ? 'إجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map((gov) => {
                const isEditing = editingId === gov.id;
                return (
                  <tr key={gov.id}>
                    <td>
                      <div>
                        <p className="font-semibold text-xs text-neutral-900 dark:text-white">{gov.nameAr}</p>
                        <p className="text-[11px] text-neutral-400 dark:text-neutral-500">{gov.nameEn}</p>
                      </div>
                    </td>

                    <td className="font-mono text-xs text-neutral-500 uppercase">{gov.code}</td>

                    <td>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-xs border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
                        {gov.cityCount} {isAr ? 'مدينة' : 'cities'}
                      </span>
                    </td>

                    <td>
                      {isEditing ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={editFee}
                            onChange={(e) => setEditFee(parseFloat(e.target.value) || 0)}
                            className="w-16 h-8 px-2 rounded-xs border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-mono text-xs"
                          />
                          <span className="text-[10px]">ج.م</span>
                        </div>
                      ) : (
                        <span className="font-semibold text-xs text-neutral-900 dark:text-white">
                          {formatPrice(gov.fee, 'EGP', locale)}
                        </span>
                      )}
                    </td>

                    <td className="text-xs text-neutral-600 dark:text-neutral-400">
                      {isEditing ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={editMinDays}
                            onChange={(e) => setEditMinDays(parseInt(e.target.value) || 1)}
                            className="w-10 h-8 px-1.5 rounded-xs border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-mono text-center text-xs"
                          />
                          <span>-</span>
                          <input
                            type="number"
                            value={editMaxDays}
                            onChange={(e) => setEditMaxDays(parseInt(e.target.value) || 2)}
                            className="w-10 h-8 px-1.5 rounded-xs border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-mono text-center text-xs"
                          />
                          <span className="text-[10px]">{isAr ? 'أيام' : 'days'}</span>
                        </div>
                      ) : (
                        <span>
                          {gov.deliveryMin} - {gov.deliveryMax} {isAr ? 'أيام عمل' : 'business days'}
                        </span>
                      )}
                    </td>

                    <td className="text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
                      {isAr ? `فوق ${gov.freeThreshold} ج.م` : `Over ${gov.freeThreshold} EGP`}
                    </td>

                    <td>
                      <button
                        onClick={() => toggleActive(gov.id)}
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-xs transition-colors border ${
                          gov.isActive
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                            : 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
                        }`}
                      >
                        {gov.isActive ? (isAr ? 'مفعل للتوصيل' : 'Active') : (isAr ? 'معطل' : 'Disabled')}
                      </button>
                    </td>

                    <td className="text-end">
                      {isEditing ? (
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => saveEdit(gov.id)}
                            className="p-1.5 rounded-xs bg-black text-white dark:bg-white dark:text-black transition-colors"
                            title={isAr ? 'حفظ التعديل' : 'Save'}
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-1.5 rounded-xs border border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:text-black dark:hover:text-white transition-colors"
                            title={isAr ? 'إلغاء' : 'Cancel'}
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEdit(gov)}
                          className="p-1.5 rounded-xs border border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:text-black dark:hover:text-white transition-colors"
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
