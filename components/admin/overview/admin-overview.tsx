'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, Package, Users, TrendingUp, ArrowRight, Plus, RefreshCw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';
import { db } from '@/lib/firebase/client';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import type { Locale, Order } from '@/types';

interface OverviewMetrics {
  totalRevenue: number;
  ordersCount: number;
  productsCount: number;
  customersCount: number;
  pendingCount: number;
}

const STATUS_CONFIG: Record<string, { label: { ar: string; en: string }; variant: 'default' | 'success' | 'warning' | 'info' | 'danger' }> = {
  pending: { label: { ar: 'جديد', en: 'Pending' }, variant: 'warning' },
  confirmed: { label: { ar: 'مؤكد', en: 'Confirmed' }, variant: 'info' },
  preparing: { label: { ar: 'جاري التحضير', en: 'Preparing' }, variant: 'info' },
  shipped: { label: { ar: 'تم الشحن', en: 'Shipped' }, variant: 'default' },
  delivered: { label: { ar: 'تم التسليم', en: 'Delivered' }, variant: 'success' },
  cancelled: { label: { ar: 'ملغي', en: 'Cancelled' }, variant: 'danger' },
};

export function AdminOverview({ locale }: { locale: Locale }) {
  const isAr = locale === 'ar';
  const [metrics, setMetrics] = useState<OverviewMetrics>({
    totalRevenue: 0,
    ordersCount: 0,
    productsCount: 0,
    customersCount: 0,
    pendingCount: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLiveMetrics = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch real orders from Firestore
      const ordersSnap = await getDocs(collection(db, 'orders'));
      let revenue = 0;
      let pending = 0;
      const uniqueCustomers = new Set<string>();

      ordersSnap.forEach((docSnap) => {
        const data = docSnap.data() as any;
        if (data.total) revenue += Number(data.total);
        if (data.status === 'new' || data.status === 'confirmed' || data.status === 'preparing') {
          pending += 1;
        }
        if (data.shippingAddress?.phone) uniqueCustomers.add(data.shippingAddress.phone);
        else if (data.phone) uniqueCustomers.add(data.phone);
        else if (data.customerId) uniqueCustomers.add(data.customerId);
      });

      // 2. Fetch real products count from Firestore
      const productsSnap = await getDocs(collection(db, 'products'));

      // 3. Fetch recent 5 orders from Firestore
      let ordersList: Order[] = [];
      try {
        const recentQuery = query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(5));
        const recentSnap = await getDocs(recentQuery);
        ordersList = recentSnap.docs.map(d => ({ id: d.id, ...d.data() } as Order));
      } catch (err) {
        // Fallback if index not ready
        ordersList = ordersSnap.docs
          .map(d => ({ id: d.id, ...d.data() } as Order))
          .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
          .slice(0, 5);
      }

      setMetrics({
        totalRevenue: revenue,
        ordersCount: ordersSnap.size,
        productsCount: productsSnap.size,
        customersCount: uniqueCustomers.size,
        pendingCount: pending,
      });
      setRecentOrders(ordersList);
    } catch (err) {
      console.warn('Firestore live metrics fetch warning:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveMetrics();
  }, []);

  const statCards = [
    {
      label: isAr ? 'إجمالي المبيعات' : 'Total Revenue',
      value: formatPrice(metrics.totalRevenue, 'EGP', locale),
      icon: TrendingUp,
      subtitle: isAr ? 'من واقع الطلبات الفعلية' : 'From verified orders',
    },
    {
      label: isAr ? 'إجمالي الطلبات' : 'Total Orders',
      value: metrics.ordersCount.toLocaleString(),
      icon: ShoppingCart,
      subtitle: isAr ? `${metrics.pendingCount} طلب بانتظار الشحن` : `${metrics.pendingCount} pending fulfillment`,
    },
    {
      label: isAr ? 'المنتجات والبوكسات' : 'Catalog Items',
      value: metrics.productsCount.toLocaleString(),
      icon: Package,
      subtitle: isAr ? 'منتج مسجل في الكتالوج' : 'Active catalog items',
    },
    {
      label: isAr ? 'قاعدة العملاء' : 'Customer Reach',
      value: metrics.customersCount.toLocaleString(),
      icon: Users,
      subtitle: isAr ? 'عميل أجرى طلبات' : 'Unique purchasing clients',
    },
  ];

  return (
    <div className="space-y-8 select-none">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-color)]">
        <div>
          <h1
            className="text-2xl sm:text-3xl font-light text-[var(--text-main)]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {isAr ? 'نظرة عامة على المتجر' : 'Store Executive Overview'}
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            {isAr
              ? 'مؤشرات الأداء الحقيقية ومتابعة الطلبات المباشرة من قاعدة بيانات Firestore'
              : 'Real-time performance metrics synchronized directly from Firestore'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchLiveMetrics}
            disabled={isLoading}
            leftIcon={<RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />}
          >
            {isAr ? 'تحديث البيانات' : 'Sync Live Data'}
          </Button>

          <Link href={`/${locale}/admin/products/new`}>
            <Button size="sm" leftIcon={<Plus className="h-4 w-4" />}>
              {isAr ? 'إضافة منتج جديد' : 'New Product'}
            </Button>
          </Link>
        </div>
      </div>

      {/* Real Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-sm p-5 shadow-sm transition-all hover:border-[var(--text-main)]"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-[var(--text-muted)]">{card.label}</span>
                <div className="w-8 h-8 rounded-sm bg-[var(--bg-secondary)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-main)]">
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-semibold tracking-tight text-[var(--text-main)] font-mono">
                  {isLoading ? '...' : card.value}
                </p>
                <p className="text-[11px] text-[var(--text-muted)]">{card.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Operations Matrix */}
      <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-sm p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-[var(--text-main)] mb-4">
          {isAr ? 'إجراءات تشغيل سريعة' : 'Quick Operations'}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <Link
            href={`/${locale}/admin/products/gift-boxes`}
            className="p-3.5 rounded-sm border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-main)] font-medium hover:border-[var(--text-main)] transition-colors text-center block"
          >
            {isAr ? 'منشئ بوكسات الهدايا' : 'Gift Box Builder'}
          </Link>
          <Link
            href={`/${locale}/admin/orders`}
            className="p-3.5 rounded-sm border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-main)] font-medium hover:border-[var(--text-main)] transition-colors text-center block"
          >
            {isAr ? 'متابعة وفحص الطلبات' : 'Order Pipeline'}
          </Link>
          <Link
            href={`/${locale}/admin/shipping`}
            className="p-3.5 rounded-sm border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-main)] font-medium hover:border-[var(--text-main)] transition-colors text-center block"
          >
            {isAr ? 'تسعير شحن المحافظات' : 'Egyptian Shipping'}
          </Link>
          <Link
            href={`/${locale}/admin/media`}
            className="p-3.5 rounded-sm border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-main)] font-medium hover:border-[var(--text-main)] transition-colors text-center block"
          >
            {isAr ? 'مكتبة وسائط ImageKit' : 'ImageKit Media CDN'}
          </Link>
        </div>
      </div>

      {/* Recent Live Orders Table */}
      <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-sm shadow-sm overflow-hidden">
        <div className="p-5 border-b border-[var(--border-color)] flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-[var(--text-main)]">
              {isAr ? 'أحدث الطلبات المسجلة' : 'Recent Live Orders'}
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              {isAr ? 'تحديث لحظي من قاعدة بيانات فايربيس' : 'Live synchronized from Firestore orders collection'}
            </p>
          </div>
          <Link
            href={`/${locale}/admin/orders`}
            className="text-xs font-medium text-[var(--text-main)] hover:underline flex items-center gap-1"
          >
            <span>{isAr ? 'عرض كافة الطلبات' : 'View All'}</span>
            <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12 text-[var(--text-muted)] text-xs">
            <Loader2 className="h-5 w-5 animate-spin me-2" />
            <span>{isAr ? 'جارِ فحص قاعدة البيانات...' : 'Querying database...'}</span>
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="py-16 px-4 text-center text-[var(--text-muted)]">
            <ShoppingCart className="h-10 w-10 mx-auto mb-3 opacity-30 stroke-1" />
            <p className="text-sm font-medium text-[var(--text-main)]">
              {isAr ? 'لا توجد طلبات واردة حتى الآن' : 'No customer orders recorded yet'}
            </p>
            <p className="text-xs text-[var(--text-muted)] mt-1 max-w-sm mx-auto">
              {isAr
                ? 'عند إتمام أي عميل لطلبية عبر المتجر، ستظهر هنا فورياً بكامل تفاصيل التخصيص ومعلومات الشحن.'
                : 'When a customer places an order on the storefront, it will appear here in real time with all customization details.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-[var(--bg-secondary)] text-[var(--text-muted)] border-b border-[var(--border-color)]">
                <tr>
                  <th className="py-3 px-4 text-start font-medium">{isAr ? 'رقم الطلب' : 'Order ID'}</th>
                  <th className="py-3 px-4 text-start font-medium">{isAr ? 'العميل' : 'Customer'}</th>
                  <th className="py-3 px-4 text-start font-medium">{isAr ? 'المحافظة' : 'Governorate'}</th>
                  <th className="py-3 px-4 text-start font-medium">{isAr ? 'الإجمالي' : 'Total'}</th>
                  <th className="py-3 px-4 text-start font-medium">{isAr ? 'الحالة' : 'Status'}</th>
                  <th className="py-3 px-4 text-start font-medium">{isAr ? 'التاريخ' : 'Date'}</th>
                  <th className="py-3 px-4 text-end font-medium">{isAr ? 'الإجراء' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {recentOrders.map((ord) => {
                  const statusConf = STATUS_CONFIG[ord.status] || STATUS_CONFIG.pending;
                  return (
                    <tr key={ord.id} className="hover:bg-[var(--bg-secondary)] transition-colors">
                      <td className="py-3 px-4 font-mono font-medium text-[var(--text-main)]">
                        {ord.orderNumber || ord.id.substring(0, 8)}
                      </td>
                      <td className="py-3 px-4 text-[var(--text-main)]">
                        {(ord as any).customerName || ord.shippingAddress?.fullName || (isAr ? 'عميل متجر' : 'Client')}
                      </td>
                      <td className="py-3 px-4 text-[var(--text-muted)]">
                        {(ord as any).governorateName || ord.shippingAddress?.governorate || ord.shippingAddress?.city || '—'}
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-[var(--text-main)]">
                        {formatPrice(ord.total || 0, 'EGP', locale)}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={statusConf.variant} size="sm">
                          {statusConf.label[locale]}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-[var(--text-muted)]">
                        {ord.createdAt ? new Date(ord.createdAt).toLocaleDateString('ar-EG') : '—'}
                      </td>
                      <td className="py-3 px-4 text-end">
                        <Link
                          href={`/${locale}/admin/orders`}
                          className="text-[var(--text-main)] font-medium hover:underline"
                        >
                          {isAr ? 'فحص الطلب' : 'Inspect'}
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
