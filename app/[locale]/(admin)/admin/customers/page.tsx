'use client';
import { useState } from 'react';
import { Search, Eye, Mail, Phone, ShoppingBag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { formatPrice } from '@/lib/utils';
import type { Locale } from '@/types';

const MOCK_CUSTOMERS = [
  { id: 'c1', name: 'سارة محمد', email: 'sara@example.com', phone: '+966501234567', ordersCount: 4, totalSpent: 1240, city: 'الرياض', registeredAt: '2026-09-15' },
  { id: 'c2', name: 'أحمد علي', email: 'ahmed@example.com', phone: '+966502345678', ordersCount: 2, totalSpent: 448, city: 'جدة', registeredAt: '2026-10-01' },
  { id: 'c3', name: 'نورة خالد', email: 'noura@example.com', phone: '+966503456789', ordersCount: 7, totalSpent: 2890, city: 'الدمام', registeredAt: '2026-08-20' },
  { id: 'c4', name: 'محمد كمال', email: 'mohammed@example.com', phone: '+966504567890', ordersCount: 1, totalSpent: 399, city: 'مكة', registeredAt: '2026-11-02' },
];

export default function AdminCustomersPage() {
  const isAr = true;
  const locale: Locale = 'ar';
  const [search, setSearch] = useState('');

  const filtered = MOCK_CUSTOMERS.filter(c =>
    c.name.includes(search) || c.email.includes(search) || c.phone.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-charcoal">
            {isAr ? 'إدارة العملاء' : 'Customer Management'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {isAr ? 'قائمة العملاء المسجلين وسجل مشترياتهم وإجمالي الإنفاق' : 'View customer profiles and lifetime orders'}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-sm border border-gray-100 p-4 max-w-md">
        <Input
          placeholder={isAr ? 'بحث بالاسم أو البريد أو الهاتف...' : 'Search customers...'}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftElement={<Search className="h-4 w-4" />}
        />
      </div>

      <div className="bg-white rounded-sm border border-gray-100 overflow-hidden">
        <table className="admin-table">
          <thead>
            <tr>
              <th>{isAr ? 'العميل' : 'Customer'}</th>
              <th>{isAr ? 'المدينة' : 'City'}</th>
              <th>{isAr ? 'عدد الطلبات' : 'Orders'}</th>
              <th>{isAr ? 'إجمالي الإنفاق' : 'Total Spent'}</th>
              <th>{isAr ? 'تاريخ التسجيل' : 'Registered'}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(customer => (
              <tr key={customer.id}>
                <td>
                  <div>
                    <p className="font-medium text-charcoal">{customer.name}</p>
                    <p className="text-xs text-gray-400">{customer.email} · {customer.phone}</p>
                  </div>
                </td>
                <td className="text-xs text-gray-600">{customer.city}</td>
                <td>
                  <span className="font-semibold text-charcoal">{customer.ordersCount}</span>
                </td>
                <td className="font-semibold text-charcoal">
                  {formatPrice(customer.totalSpent, 'SAR', locale)}
                </td>
                <td className="text-xs text-gray-400">{customer.registeredAt}</td>
                <td>
                  <button className="p-1.5 text-gray-400 hover:text-charcoal rounded" aria-label="View">
                    <Eye className="h-4 w-4" />
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
