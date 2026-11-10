'use client';
import { useState, useEffect } from 'react';
import { Settings, Save, Check, ShieldAlert, RefreshCw } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { COLLECTIONS } from '@/lib/firebase/collections';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Locale } from '@/types';

export default function AdminSettingsPage() {
  const isAr = true;
  const locale: Locale = 'ar';

  const [siteNameAr, setSiteNameAr] = useState('جيفورا');
  const [siteNameEn, setSiteNameEn] = useState('Givora');
  const [contactEmail, setContactEmail] = useState('care@givora.com');
  const [contactPhone, setContactPhone] = useState('+20 100 123 4567');
  const [whatsapp, setWhatsapp] = useState('+20 100 123 4567');
  const [currency, setCurrency] = useState('EGP');
  const [currencySymbolAr, setCurrencySymbolAr] = useState('ج.م');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [allowGuestCheckout, setAllowGuestCheckout] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      try {
        const snap = await getDoc(doc(db, COLLECTIONS.WEBSITE_SETTINGS, 'global'));
        if (snap.exists()) {
          const data = snap.data();
          if (data.siteNameAr) setSiteNameAr(data.siteNameAr);
          if (data.siteNameEn) setSiteNameEn(data.siteNameEn);
          if (data.contactEmail) setContactEmail(data.contactEmail);
          if (data.contactPhone) setContactPhone(data.contactPhone);
          if (data.whatsapp) setWhatsapp(data.whatsapp);
          if (data.currency) setCurrency(data.currency);
          if (data.currencySymbolAr) setCurrencySymbolAr(data.currencySymbolAr);
          if (data.maintenanceMode !== undefined) setMaintenanceMode(data.maintenanceMode);
          if (data.allowGuestCheckout !== undefined) setAllowGuestCheckout(data.allowGuestCheckout);
        }
      } catch (err) {
        console.error('Failed to load global website settings:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await setDoc(
        doc(db, COLLECTIONS.WEBSITE_SETTINGS, 'global'),
        {
          siteNameAr,
          siteNameEn,
          contactEmail,
          contactPhone,
          whatsapp,
          currency,
          currencySymbolAr,
          maintenanceMode,
          allowGuestCheckout,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            {isAr ? 'إعدادات المتجر العامة' : 'General Store Settings'}
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            {isAr
              ? 'التحكم في هوية المتجر والعملة وبيانات التواصل والشراء كضيف المحفوظة في قاعدة البيانات'
              : 'Manage store identity, currency, and customer touchpoints in live database'}
          </p>
        </div>
        {savedSuccess && (
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-xs border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
            <Check className="h-4 w-4" /> {isAr ? 'تم حفظ الإعدادات بنجاح!' : 'Saved successfully!'}
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="bg-white dark:bg-[#1A1A1A] rounded-sm border border-neutral-200 dark:border-neutral-800 p-8 text-center text-neutral-500">
          <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-2 text-neutral-900 dark:text-white" />
          <p className="text-xs">{isAr ? 'جاري تحميل الإعدادات من قاعدة البيانات...' : 'Loading settings...'}</p>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          {/* Brand identity */}
          <div className="bg-white dark:bg-[#1A1A1A] p-6 rounded-sm border border-neutral-200 dark:border-neutral-800 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white border-b border-neutral-100 dark:border-neutral-800 pb-3">
              {isAr ? 'هوية المتجر والعملة' : 'Store Identity & Currency'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={isAr ? 'اسم المتجر (بالعربية)' : 'Store Name (Arabic)'}
                value={siteNameAr}
                onChange={(e) => setSiteNameAr(e.target.value)}
                required
              />
              <Input
                label={isAr ? 'اسم المتجر (بالإنجليزية)' : 'Store Name (English)'}
                value={siteNameEn}
                onChange={(e) => setSiteNameEn(e.target.value)}
                required
                dir="ltr"
              />
              <Input
                label={isAr ? 'رمز كود العملة (ISO)' : 'Currency Code'}
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                required
                dir="ltr"
              />
              <Input
                label={isAr ? 'رمز عرض العملة للعملاء' : 'Display Currency Symbol'}
                value={currencySymbolAr}
                onChange={(e) => setCurrencySymbolAr(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Contact info */}
          <div className="bg-white dark:bg-[#1A1A1A] p-6 rounded-sm border border-neutral-200 dark:border-neutral-800 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white border-b border-neutral-100 dark:border-neutral-800 pb-3">
              {isAr ? 'بيانات التواصل وخدمة العملاء في مصر' : 'Customer Service & Contact (Egypt)'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label={isAr ? 'البريد الإلكتروني للدعم' : 'Support Email'}
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                required
                dir="ltr"
              />
              <Input
                label={isAr ? 'رقم الهاتف المباشر' : 'Phone'}
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                dir="ltr"
              />
              <Input
                label={isAr ? 'رقم الواتساب المعتمد' : 'WhatsApp'}
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                dir="ltr"
              />
            </div>
          </div>

          {/* Policies & Checkout */}
          <div className="bg-white dark:bg-[#1A1A1A] p-6 rounded-sm border border-neutral-200 dark:border-neutral-800 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white border-b border-neutral-100 dark:border-neutral-800 pb-3">
              {isAr ? 'خيارات إتمام الطلب والصيانة' : 'Checkout & Store State'}
            </h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 text-xs text-neutral-900 dark:text-white cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={allowGuestCheckout}
                  onChange={(e) => setAllowGuestCheckout(e.target.checked)}
                  className="accent-black dark:accent-white h-4 w-4 rounded-xs"
                />
                <div>
                  <p className="font-bold">{isAr ? 'السماح بإتمام الطلب كضيف' : 'Allow Guest Checkout'}</p>
                  <p className="text-[11px] text-neutral-500">
                    {isAr
                      ? 'تمكين العملاء من الشراء بدون تسجيل حساب مسبق لزيادة سرعة التحويل والمبيعات'
                      : 'Customers can complete checkout without creating an account'}
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-3 text-xs text-neutral-900 dark:text-white cursor-pointer select-none pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <input
                  type="checkbox"
                  checked={maintenanceMode}
                  onChange={(e) => setMaintenanceMode(e.target.checked)}
                  className="accent-black dark:accent-white h-4 w-4 rounded-xs"
                />
                <div>
                  <p className="font-bold text-amber-600 dark:text-amber-400">
                    {isAr ? 'وضع الصيانة (Maintenance Mode)' : 'Maintenance Mode'}
                  </p>
                  <p className="text-[11px] text-neutral-500">
                    {isAr
                      ? 'إغلاق واجهة المتجر مؤقتاً أمام الزوار وعرض رسالة الصيانة'
                      : 'Temporarily close public store and display maintenance banner'}
                  </p>
                </div>
              </label>
            </div>
          </div>

          <Button type="submit" size="lg" isLoading={isSaving}>
            {isAr ? 'حفظ التعديلات في قاعدة البيانات' : 'Save All Settings'}
          </Button>
        </form>
      )}
    </div>
  );
}
