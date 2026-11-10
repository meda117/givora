'use client';
import { useState } from 'react';
import { Settings, Save, Check, ShieldAlert } from 'lucide-react';
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
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [allowGuestCheckout, setAllowGuestCheckout] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-charcoal">
            {isAr ? 'إعدادات الموقع العامة' : 'General Website Settings'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {isAr ? 'التحكم في هوية المتجر والعملة وبيانات التواصل والشراء كضيف' : 'Manage store identity, currency, contact info, and checkout rules'}
          </p>
        </div>
        {savedSuccess && (
          <span className="text-xs text-green-600 bg-green-50 px-3 py-1.5 rounded font-medium flex items-center gap-1">
            <Check className="h-3.5 w-3.5" /> {isAr ? 'تم حفظ الإعدادات' : 'Saved'}
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Brand identity */}
        <div className="bg-white p-6 rounded-sm border border-gray-100 space-y-4">
          <h2 className="text-sm font-semibold text-charcoal border-b pb-3">
            {isAr ? 'هوية المتجر' : 'Store Identity'}
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
              label={isAr ? 'العملة الأساسية' : 'Base Currency'}
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              required
              dir="ltr"
            />
          </div>
        </div>

        {/* Contact info */}
        <div className="bg-white p-6 rounded-sm border border-gray-100 space-y-4">
          <h2 className="text-sm font-semibold text-charcoal border-b pb-3">
            {isAr ? 'بيانات التواصل وخدمة العملاء' : 'Customer Service & Contact'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label={isAr ? 'البريد الإلكتروني' : 'Support Email'}
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              required
              dir="ltr"
            />
            <Input
              label={isAr ? 'رقم الهاتف' : 'Phone'}
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              dir="ltr"
            />
            <Input
              label={isAr ? 'رقم الواتساب' : 'WhatsApp'}
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              dir="ltr"
            />
          </div>
        </div>

        {/* Policies & Checkout */}
        <div className="bg-white p-6 rounded-sm border border-gray-100 space-y-4">
          <h2 className="text-sm font-semibold text-charcoal border-b pb-3">
            {isAr ? 'خيارات إتمام الطلب والصيانة' : 'Checkout & Store State'}
          </h2>
          <div className="space-y-3">
            <label className="flex items-center gap-3 text-sm text-charcoal cursor-pointer">
              <input
                type="checkbox"
                checked={allowGuestCheckout}
                onChange={(e) => setAllowGuestCheckout(e.target.checked)}
                className="accent-gold h-4 w-4"
              />
              <div>
                <p className="font-medium">{isAr ? 'السماح بإتمام الطلب كضيف' : 'Allow Guest Checkout'}</p>
                <p className="text-xs text-gray-400">{isAr ? 'تمكين العملاء من الشراء بدون تسجيل حساب مسبق' : 'Customers can complete checkout without creating an account'}</p>
              </div>
            </label>

            <label className="flex items-center gap-3 text-sm text-charcoal cursor-pointer pt-2 border-t border-gray-50">
              <input
                type="checkbox"
                checked={maintenanceMode}
                onChange={(e) => setMaintenanceMode(e.target.checked)}
                className="accent-gold h-4 w-4"
              />
              <div>
                <p className="font-medium text-amber-700">{isAr ? 'وضع الصيانة (Maintenance Mode)' : 'Maintenance Mode'}</p>
                <p className="text-xs text-gray-400">{isAr ? 'إغلاق واجهة المتجر مؤقتاً أمام الزوار وعرض صفحة الصيانة' : 'Temporarily close public store and display maintenance banner'}</p>
              </div>
            </label>
          </div>
        </div>

        <Button type="submit" size="lg">
          {isAr ? 'حفظ جميع الإعدادات' : 'Save All Settings'}
        </Button>
      </form>
    </div>
  );
}
