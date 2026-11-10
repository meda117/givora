'use client';
import { ShoppingCart, Package, Users, TrendingUp, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import type { Locale } from '@/types';

const MOCK_STATS = {
  totalSales: 185400,
  totalOrders: 234,
  totalCustomers: 189,
  totalProducts: 67,
  pendingOrders: 12,
  completedOrders: 198,
  cancelledOrders: 5,
  lowStockProducts: 3,
};

const MOCK_RECENT_ORDERS = [
  { id: 'GIV-123456-ABC', customer: 'سارة محمد (المعادي)', total: 650, status: 'new', date: '2026-11-10' },
  { id: 'GIV-234567-DEF', customer: 'أحمد علي (الإسكندرية)', total: 350, status: 'preparing', date: '2026-11-10' },
  { id: 'GIV-345678-GHI', customer: 'مريم محمود (التجمع)', total: 200, status: 'shipped', date: '2026-11-09' },
  { id: 'GIV-456789-JKL', customer: 'كريم عبد العزيز (الشيخ زايد)', total: 850, status: 'delivered', date: '2026-11-09' },
  { id: 'GIV-567890-MNO', customer: 'فاطمة حسن (المنصورة)', total: 450, status: 'confirmed', date: '2026-11-08' },
];

const STATUS_STYLES: Record<string, string> = {
  new: 'bg-blue-50 text-blue-700',
  confirmed: 'bg-indigo-50 text-indigo-700',
  preparing: 'bg-amber-50 text-amber-700',
  shipped: 'bg-purple-50 text-purple-700',
  delivered: 'bg-green-50 text-green-700',
  cancelled: 'bg-red-50 text-red-700',
};

const STATUS_LABELS: Record<string, { ar: string; en: string }> = {
  new: { ar: 'جديد', en: 'New' },
  confirmed: { ar: 'مؤكد', en: 'Confirmed' },
  preparing: { ar: 'جاري التحضير', en: 'Preparing' },
  shipped: { ar: 'تم الشحن', en: 'Shipped' },
  delivered: { ar: 'تم التسليم', en: 'Delivered' },
  cancelled: { ar: 'ملغي', en: 'Cancelled' },
};

export function AdminOverview({ locale }: { locale: Locale }) {
  const isAr = locale === 'ar';

  const statCards = [
    {
      label: isAr ? 'إجمالي المبيعات' : 'Total Sales',
      value: formatPrice(MOCK_STATS.totalSales, 'EGP', locale),
      icon: TrendingUp,
      color: 'text-gold',
      bg: 'bg-gold/10',
      change: '+12%',
    },
    {
      label: isAr ? 'إجمالي الطلبات' : 'Total Orders',
      value: MOCK_STATS.totalOrders,
      icon: ShoppingCart,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      change: '+8%',
    },
    {
      label: isAr ? 'إجمالي العملاء' : 'Total Customers',
      value: MOCK_STATS.totalCustomers,
      icon: Users,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      change: '+5%',
    },
    {
      label: isAr ? 'إجمالي المنتجات' : 'Total Products',
      value: MOCK_STATS.totalProducts,
      icon: Package,
      color: 'text-green-600',
      bg: 'bg-green-50',
      change: '+3',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page title */}
      <div>
        <h1 className="text-2xl font-semibold text-charcoal">
          {isAr ? 'نظرة عامة' : 'Dashboard Overview'}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {new Date().toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
          })}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-sm border border-gray-100 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">{card.label}</p>
                  <p className="text-2xl font-bold text-charcoal">{card.value}</p>
                  <span className="text-xs text-green-600 font-medium mt-1 inline-block">{card.change}</span>
                </div>
                <div className={`p-3 rounded-sm ${card.bg}`}>
                  <Icon className={`h-5 w-5 ${card.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Order status cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: isAr ? 'طلبات معلقة' : 'Pending', value: MOCK_STATS.pendingOrders, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: isAr ? 'مكتملة' : 'Completed', value: MOCK_STATS.completedOrders, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
          { label: isAr ? 'ملغاة' : 'Cancelled', value: MOCK_STATS.cancelledOrders, icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
          { label: isAr ? 'مخزون منخفض' : 'Low Stock', value: MOCK_STATS.lowStockProducts, icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-50' },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="bg-white rounded-sm border border-gray-100 p-4 flex items-center gap-3">
              <div className={`p-2 rounded-sm ${item.bg}`}>
                <Icon className={`h-4 w-4 ${item.color}`} />
              </div>
              <div>
                <p className="text-xs text-gray-500">{item.label}</p>
                <p className="text-lg font-bold text-charcoal">{item.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-charcoal">
            {isAr ? 'أحدث الطلبات' : 'Recent Orders'}
          </h2>
          <a href={`/${locale}/admin/orders`} className="text-xs text-gold hover:text-gold/80">
            {isAr ? 'عرض الكل' : 'View All'}
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="text-start px-6 py-3 text-xs font-medium text-gray-500">{isAr ? 'رقم الطلب' : 'Order #'}</th>
                <th className="text-start px-6 py-3 text-xs font-medium text-gray-500">{isAr ? 'العميل' : 'Customer'}</th>
                <th className="text-start px-6 py-3 text-xs font-medium text-gray-500">{isAr ? 'المبلغ' : 'Amount'}</th>
                <th className="text-start px-6 py-3 text-xs font-medium text-gray-500">{isAr ? 'الحالة' : 'Status'}</th>
                <th className="text-start px-6 py-3 text-xs font-medium text-gray-500">{isAr ? 'التاريخ' : 'Date'}</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_RECENT_ORDERS.map((order) => (
                <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-3">
                    <a href={`/${locale}/admin/orders/${order.id}`} className="text-gold hover:underline font-mono text-xs">
                      {order.id}
                    </a>
                  </td>
                  <td className="px-6 py-3 text-charcoal">{order.customer}</td>
                  <td className="px-6 py-3 font-medium">{formatPrice(order.total, 'EGP', locale)}</td>
                  <td className="px-6 py-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_STYLES[order.status]}`}>
                      {STATUS_LABELS[order.status]?.[locale]}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-gray-500 text-xs">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
