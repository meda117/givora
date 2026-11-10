'use client';
import { useState, useEffect } from 'react';
import { Search, Users, Phone, MessageCircle, RefreshCw, ShoppingBag } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { COLLECTIONS } from '@/lib/firebase/collections';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import type { Locale } from '@/types';

interface RealCustomerItem {
  id: string;
  name: string;
  email?: string;
  phone: string;
  whatsappNumber?: string;
  ordersCount: number;
  totalSpent: number;
  governorate: string;
  lastOrderDate: string;
}

export default function AdminCustomersPage() {
  const isAr = true;
  const locale: Locale = 'ar';
  const [customers, setCustomers] = useState<RealCustomerItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.ORDERS));
      const customerMap = new Map<string, RealCustomerItem>();

      snap.docs.forEach((d) => {
        const data = d.data();
        const shipping = data.shippingAddress || {};
        const customer = data.customer || {};

        const phone = customer.phone || data.phone || shipping.phone || '';
        const name = customer.name || data.customerName || shipping.fullName || (isAr ? 'عميل جيفورا' : 'Givora Customer');
        const email = customer.email || data.email || shipping.email;
        const governorate = shipping.governorateName || data.governorateName || shipping.governorateId || (isAr ? 'القاهرة' : 'Cairo');
        const orderTotal = Number(data.total) || 0;
        const orderDate = data.createdAt || new Date().toISOString();

        const key = phone || email || d.id;

        if (customerMap.has(key)) {
          const existing = customerMap.get(key)!;
          existing.ordersCount += 1;
          existing.totalSpent += orderTotal;
          if (new Date(orderDate) > new Date(existing.lastOrderDate)) {
            existing.lastOrderDate = orderDate;
          }
        } else {
          customerMap.set(key, {
            id: key,
            name,
            email,
            phone,
            whatsappNumber: customer.whatsappNumber || data.whatsappNumber || shipping.whatsappNumber || phone,
            ordersCount: 1,
            totalSpent: orderTotal,
            governorate,
            lastOrderDate: orderDate,
          });
        }
      });

      setCustomers(Array.from(customerMap.values()));
    } catch (err) {
      console.error('Failed to aggregate real customers from Firestore:', err);
      setCustomers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.email && c.email.toLowerCase().includes(search.toLowerCase())) ||
      c.phone.includes(search) ||
      c.governorate.toLowerCase().includes(search.toLowerCase())
  );

  const getWhatsAppLink = (c: RealCustomerItem) => {
    const raw = (c.whatsappNumber || c.phone || '').replace(/\D/g, '');
    const formatted = raw.startsWith('0') ? '2' + raw : raw.startsWith('2') ? raw : '20' + raw;
    const msg = encodeURIComponent(
      isAr
        ? `أهلاً يا ${c.name}، معاك فريق خدمة عملاء جيفورا. يسعدنا تواصلك معنا دائماً!`
        : `Hello ${c.name}, this is Givora customer care.`
    );
    return `https://wa.me/${formatted}?text=${msg}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            {isAr ? 'سجل عملاء جيفورا' : 'Customer Directory'}
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            {isAr
              ? `بيانات حية مستخرجة من سجلات الطلبات في قاعدة البيانات • ${customers.length} عميل فريد`
              : `Aggregated live customer profiles from Firestore • ${customers.length} unique customers`}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchCustomers}
          isLoading={isLoading}
          leftIcon={<RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />}
        >
          {isAr ? 'تحديث' : 'Refresh'}
        </Button>
      </div>

      <div className="bg-white dark:bg-[#1A1A1A] rounded-sm border border-neutral-200 dark:border-neutral-800 p-4 max-w-md">
        <Input
          placeholder={isAr ? 'بحث بالاسم، رقم الموبايل أو المحافظة...' : 'Search customers...'}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftElement={<Search className="h-4 w-4" />}
        />
      </div>

      {isLoading && (
        <div className="bg-white dark:bg-[#1A1A1A] rounded-sm border border-neutral-200 dark:border-neutral-800 p-12 text-center text-neutral-500">
          <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-neutral-900 dark:text-white" />
          <p className="text-xs font-medium">
            {isAr ? 'جاري تجميع سجلات العملاء...' : 'Loading customers...'}
          </p>
        </div>
      )}

      {!isLoading && customers.length === 0 && (
        <div className="bg-white dark:bg-[#1A1A1A] rounded-sm border border-neutral-200 dark:border-neutral-800 p-12 text-center">
          <div className="w-16 h-16 rounded-sm bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center mx-auto mb-4 text-neutral-900 dark:text-white">
            <Users className="h-8 w-8 stroke-[1.2]" />
          </div>
          <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-1">
            {isAr ? 'لا يوجد عملاء مسجلين بعد' : 'No Customers Found'}
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-md mx-auto leading-relaxed">
            {isAr
              ? 'يتم تكوين ملفات العملاء تلقائياً وبشكل حي بمجرد قيام أي مشترٍ بإتمام طلبه عبر متجر جيفورا.'
              : 'Customer profiles are automatically compiled in real-time as users place orders.'}
          </p>
        </div>
      )}

      {!isLoading && customers.length > 0 && (
        <div className="bg-white dark:bg-[#1A1A1A] rounded-sm border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>{isAr ? 'العميل' : 'Customer'}</th>
                  <th>{isAr ? 'المحافظة' : 'Governorate'}</th>
                  <th>{isAr ? 'عدد الطلبات' : 'Orders'}</th>
                  <th>{isAr ? 'إجمالي الإنفاق' : 'Total Spent'}</th>
                  <th>{isAr ? 'آخر طلب' : 'Last Order'}</th>
                  <th className="text-end">{isAr ? 'إجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((customer) => (
                  <tr key={customer.id}>
                    <td>
                      <div>
                        <p className="font-semibold text-xs text-neutral-900 dark:text-white">{customer.name}</p>
                        <div className="flex items-center gap-2 text-[11px] text-neutral-500 font-mono mt-0.5">
                          {customer.phone && <span>{customer.phone}</span>}
                          {customer.email && <span>• {customer.email}</span>}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-xs border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
                        {customer.governorate}
                      </span>
                    </td>
                    <td className="font-semibold text-xs text-neutral-900 dark:text-white font-mono">
                      {customer.ordersCount} {isAr ? 'طلبات' : 'orders'}
                    </td>
                    <td className="font-semibold text-xs text-neutral-900 dark:text-white">
                      {formatPrice(customer.totalSpent, 'EGP', locale)}
                    </td>
                    <td className="text-xs text-neutral-500 font-mono">
                      {customer.lastOrderDate ? new Date(customer.lastOrderDate).toLocaleDateString('ar-EG') : '—'}
                    </td>
                    <td className="text-end">
                      {customer.phone && (
                        <a
                          href={getWhatsAppLink(customer)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex p-1.5 rounded-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                          title={isAr ? 'تواصل على واتساب' : 'Chat on WhatsApp'}
                        >
                          <MessageCircle className="h-4 w-4" />
                        </a>
                      )}
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
