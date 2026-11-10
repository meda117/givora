'use client';
import { useState } from 'react';
import { User, Package, Heart, MapPin, Settings, LogOut, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatPrice } from '@/lib/utils';
import type { Locale } from '@/types';

export default function AccountPage() {
  const locale: Locale = 'ar';
  const isAr = locale === 'ar';
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'addresses'>('profile');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <h1
        className="text-3xl font-light text-charcoal mb-8"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}
      >
        {isAr ? 'حسابي' : 'My Account'}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="bg-white border border-gray-100 rounded-sm p-4 space-y-1">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-sm text-sm font-medium transition-colors ${
              activeTab === 'profile' ? 'bg-charcoal text-white' : 'text-charcoal/70 hover:bg-gray-50'
            }`}
          >
            <User className="h-4 w-4" />
            <span>{isAr ? 'الملف الشخصي' : 'Profile'}</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-sm text-sm font-medium transition-colors ${
              activeTab === 'orders' ? 'bg-charcoal text-white' : 'text-charcoal/70 hover:bg-gray-50'
            }`}
          >
            <Package className="h-4 w-4" />
            <span>{isAr ? 'طلباتي' : 'Orders'}</span>
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-sm text-sm font-medium transition-colors ${
              activeTab === 'addresses' ? 'bg-charcoal text-white' : 'text-charcoal/70 hover:bg-gray-50'
            }`}
          >
            <MapPin className="h-4 w-4" />
            <span>{isAr ? 'العناوين المحفوظة' : 'Addresses'}</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="md:col-span-3 bg-white border border-gray-100 rounded-sm p-6">
          {activeTab === 'profile' && (
            <div className="space-y-6 max-w-lg">
              <h2 className="text-lg font-semibold text-charcoal">
                {isAr ? 'المعلومات الشخصية' : 'Personal Information'}
              </h2>
              <div className="space-y-4">
                <Input label={isAr ? 'الاسم الكامل' : 'Full Name'} defaultValue="سارة محمد" />
                <Input label={isAr ? 'رقم الهاتف' : 'Phone Number'} defaultValue="+966 50 123 4567" />
                <Input label={isAr ? 'البريد الإلكتروني' : 'Email Address'} defaultValue="sara@example.com" />
                <Button>{isAr ? 'حفظ التغييرات' : 'Save Changes'}</Button>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-charcoal mb-4">
                {isAr ? 'سجل الطلبات' : 'Order History'}
              </h2>
              <div className="border border-gray-100 rounded-sm p-4 flex items-center justify-between">
                <div>
                  <p className="font-mono text-xs text-gold">GIV-982134-XYZ</p>
                  <p className="text-sm font-medium text-charcoal mt-1">
                    {isAr ? 'بوكس الورد الفاخر + سلسلة مخصصة' : 'Luxury Rose Box + Custom Necklace'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">2026-11-08</p>
                </div>
                <div className="text-end">
                  <p className="text-sm font-bold text-charcoal">{formatPrice(448, 'SAR', locale)}</p>
                  <span className="inline-block mt-1 text-xs px-2.5 py-0.5 rounded-full bg-green-50 text-green-700 font-medium">
                    {isAr ? 'تم التسليم' : 'Delivered'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-charcoal">
                  {isAr ? 'العناوين المحفوظة' : 'Saved Addresses'}
                </h2>
                <Button size="sm" variant="outline">
                  {isAr ? '+ إضافة عنوان' : '+ Add Address'}
                </Button>
              </div>
              <div className="border border-gray-100 rounded-sm p-4">
                <p className="font-medium text-sm text-charcoal">{isAr ? 'المنزل' : 'Home'}</p>
                <p className="text-xs text-charcoal/60 mt-1">
                  {isAr ? 'الرياض - حي الياسمين - شارع أنس بن مالك' : 'Riyadh - Al Yasmin - Anas Ibn Malik St'}
                </p>
                <p className="text-xs text-charcoal/40 mt-1">+966 50 123 4567</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
