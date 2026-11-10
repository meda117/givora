'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  Printer,
  MessageCircle,
  Phone,
  MapPin,
  Eye,
  Type,
  ExternalLink,
  RefreshCw,
  ShoppingBag,
} from 'lucide-react';
import { collection, getDocs, updateDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { COLLECTIONS } from '@/lib/firebase/collections';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Modal } from '@/components/ui/modal';
import { formatPrice } from '@/lib/utils';
import type { Locale, OrderStatus, ProductType, OrderCustomizationSnapshot } from '@/types';

export interface RealAdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  whatsappNumber: string;
  email?: string;
  governorateName: string;
  cityName: string;
  districtName?: string;
  street: string;
  buildingNumber: string;
  apartmentNumber?: string;
  floor?: string;
  landmark?: string;
  recipientName?: string;
  giftMessage?: string;
  orderNotes?: string;
  subtotal: number;
  shippingAmount: number;
  discountAmount: number;
  total: number;
  status: OrderStatus;
  paymentMethod: 'cash_on_delivery' | 'manual_transfer';
  paymentStatus: 'pending' | 'paid';
  createdAt: string;
  items: {
    id: string;
    productName: { ar: string; en: string };
    productType?: ProductType;
    unitPrice: number;
    customizationPrice?: number;
    quantity: number;
    productImage?: string;
    customizationSnapshot?: OrderCustomizationSnapshot;
  }[];
}

const STATUS_CONFIG: Record<OrderStatus, { labelAr: string; labelEn: string; classes: string }> = {
  new: { labelAr: 'طلب جديد', labelEn: 'New', classes: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20' },
  confirmed: { labelAr: 'مؤكد', labelEn: 'Confirmed', classes: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20' },
  preparing: { labelAr: 'جاري التجهيز', labelEn: 'Preparing', classes: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20' },
  ready_for_shipping: { labelAr: 'جاهز للشحن', labelEn: 'Ready for Courier', classes: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20' },
  shipped: { labelAr: 'تم الشحن مع المندوب', labelEn: 'Shipped', classes: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20' },
  delivered: { labelAr: 'تم التسليم بنجاح', labelEn: 'Delivered', classes: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' },
  cancelled: { labelAr: 'ملغي', labelEn: 'Cancelled', classes: 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20' },
  returned: { labelAr: 'مرتجع', labelEn: 'Returned', classes: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border border-gray-500/20' },
};

export function AdminOrdersClient({ locale }: { locale: Locale }) {
  const isAr = locale === 'ar';
  const [orders, setOrders] = useState<RealAdminOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<RealAdminOrder | null>(null);

  // Fetch real orders from Firestore
  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const q = query(collection(db, COLLECTIONS.ORDERS), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const list: RealAdminOrder[] = snap.docs.map((d) => {
        const data = d.data();
        const shippingAddr = data.shippingAddress || {};
        const customer = data.customer || {};

        return {
          id: d.id,
          orderNumber: data.orderNumber || `GIV-${d.id.slice(0, 8)}`,
          customerName: customer.name || data.customerName || shippingAddr.fullName || (isAr ? 'عميل جيفورا' : 'Givora Customer'),
          phone: customer.phone || data.phone || shippingAddr.phone || '',
          whatsappNumber: customer.whatsappNumber || data.whatsappNumber || shippingAddr.whatsappNumber || customer.phone || shippingAddr.phone || '',
          email: customer.email || data.email || shippingAddr.email || '',
          governorateName: shippingAddr.governorateName || data.governorateName || shippingAddr.governorateId || (isAr ? 'القاهرة' : 'Cairo'),
          cityName: shippingAddr.cityName || data.cityName || shippingAddr.cityId || '',
          districtName: shippingAddr.districtName || data.districtName || '',
          street: shippingAddr.street || data.street || shippingAddr.address || '',
          buildingNumber: shippingAddr.buildingNumber || data.buildingNumber || '',
          apartmentNumber: shippingAddr.apartmentNumber || data.apartmentNumber || '',
          floor: shippingAddr.floor || data.floor || '',
          landmark: shippingAddr.landmark || data.landmark || '',
          recipientName: data.recipientName || shippingAddr.recipientName || '',
          giftMessage: data.giftMessage || '',
          orderNotes: data.orderNotes || data.notes || '',
          subtotal: Number(data.subtotal) || Number(data.total) || 0,
          shippingAmount: Number(data.shippingAmount) || Number(data.shippingFee) || 0,
          discountAmount: Number(data.discountAmount) || 0,
          total: Number(data.total) || 0,
          status: (data.status as OrderStatus) || 'new',
          paymentMethod: data.paymentMethod || 'cash_on_delivery',
          paymentStatus: data.paymentStatus || 'pending',
          createdAt: data.createdAt || new Date().toISOString(),
          items: Array.isArray(data.items)
            ? data.items.map((i: any, idx: number) => ({
                id: i.id || `item_${idx}`,
                productName: typeof i.name === 'object' ? i.name : typeof i.productName === 'object' ? i.productName : { ar: i.name || i.productName || '', en: i.name || i.productName || '' },
                productType: i.productType,
                unitPrice: Number(i.unitPrice) || Number(i.price) || 0,
                customizationPrice: Number(i.customizationPrice) || 0,
                quantity: Number(i.quantity) || 1,
                productImage: i.image || i.productImage || (Array.isArray(i.images) ? i.images[0]?.url || i.images[0] : ''),
                customizationSnapshot: i.customizationSnapshot || i.customizationData,
              }))
            : [],
        };
      });
      setOrders(list);
    } catch (err) {
      console.error('Failed to fetch real orders from Firestore:', err);
      // Fallback query without orderBy
      try {
        const fallbackSnap = await getDocs(collection(db, COLLECTIONS.ORDERS));
        const list: RealAdminOrder[] = fallbackSnap.docs.map((d) => {
          const data = d.data();
          const shippingAddr = data.shippingAddress || {};
          const customer = data.customer || {};
          return {
            id: d.id,
            orderNumber: data.orderNumber || `GIV-${d.id.slice(0, 8)}`,
            customerName: customer.name || data.customerName || shippingAddr.fullName || (isAr ? 'عميل جيفورا' : 'Givora Customer'),
            phone: customer.phone || data.phone || shippingAddr.phone || '',
            whatsappNumber: customer.whatsappNumber || data.whatsappNumber || shippingAddr.whatsappNumber || customer.phone || '',
            email: customer.email || data.email || shippingAddr.email || '',
            governorateName: shippingAddr.governorateName || data.governorateName || (isAr ? 'القاهرة' : 'Cairo'),
            cityName: shippingAddr.cityName || data.cityName || '',
            districtName: shippingAddr.districtName || '',
            street: shippingAddr.street || data.street || shippingAddr.address || '',
            buildingNumber: shippingAddr.buildingNumber || '',
            apartmentNumber: shippingAddr.apartmentNumber || '',
            floor: shippingAddr.floor || '',
            landmark: shippingAddr.landmark || '',
            recipientName: data.recipientName || '',
            giftMessage: data.giftMessage || '',
            orderNotes: data.orderNotes || '',
            subtotal: Number(data.subtotal) || Number(data.total) || 0,
            shippingAmount: Number(data.shippingAmount) || 0,
            discountAmount: Number(data.discountAmount) || 0,
            total: Number(data.total) || 0,
            status: (data.status as OrderStatus) || 'new',
            paymentMethod: data.paymentMethod || 'cash_on_delivery',
            paymentStatus: data.paymentStatus || 'pending',
            createdAt: data.createdAt || new Date().toISOString(),
            items: [],
          };
        });
        setOrders(list);
      } catch (innerErr) {
        console.error('Fallback orders query also failed:', innerErr);
        setOrders([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((o) => {
    const matchSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.phone.includes(search) ||
      o.governorateName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateDoc(doc(db, COLLECTIONS.ORDERS, orderId), {
        status: newStatus,
        updatedAt: new Date().toISOString(),
      });
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch (err) {
      console.error('Failed to update order status in Firestore:', err);
    }
  };

  const getWhatsAppLink = (order: RealAdminOrder) => {
    const clean = (order.whatsappNumber || order.phone || '').replace(/\D/g, '');
    const formatted = clean.startsWith('0') ? '2' + clean : clean.startsWith('2') ? clean : '20' + clean;
    const msg = encodeURIComponent(
      isAr
        ? `أهلاً يا ${order.customerName}، معاك فريق جيفورا بخصوص طلبك رقم #${order.orderNumber}. حابين نأكد معاك تفاصيل الطلب والتوصيل إلى ${order.governorateName} (${order.cityName}).`
        : `Hello ${order.customerName}, this is Givora regarding your order #${order.orderNumber}. We are confirming the details for delivery to ${order.governorateName}.`
    );
    return `https://wa.me/${formatted}?text=${msg}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            {isAr ? 'إدارة الطلبات والمبيعات الحية' : 'Order Management'}
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            {isAr
              ? `بيانات حية مباشرة من قاعدة البيانات • إجمالي ${orders.length} طلب مسجل`
              : `Live Firestore records • Total ${orders.length} orders registered`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchOrders}
            isLoading={isLoading}
            leftIcon={<RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />}
          >
            {isAr ? 'تحديث الطلبات' : 'Refresh'}
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="h-4 w-4 me-1.5" />
            <span>{isAr ? 'طباعة القائمة' : 'Print List'}</span>
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-[#1A1A1A] rounded-sm border border-neutral-200 dark:border-neutral-800 p-4 flex flex-wrap gap-3">
        <div className="flex-1 min-w-[240px]">
          <Input
            placeholder={isAr ? 'بحث برقم الطلب، اسم العميل، رقم الموبايل أو المحافظة...' : 'Search orders...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftElement={<Search className="h-4 w-4" />}
          />
        </div>

        <div className="w-48">
          <Select
            options={[
              { value: '', label: isAr ? 'جميع الحالات' : 'All Statuses' },
              ...Object.entries(STATUS_CONFIG).map(([val, conf]) => ({
                value: val,
                label: isAr ? conf.labelAr : conf.labelEn,
              })),
            ]}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="bg-white dark:bg-[#1A1A1A] rounded-sm border border-neutral-200 dark:border-neutral-800 p-12 text-center text-neutral-500">
          <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-neutral-900 dark:text-white" />
          <p className="text-xs font-medium">
            {isAr ? 'جاري استرجاع الطلبات من قاعدة البيانات...' : 'Loading orders...'}
          </p>
        </div>
      )}

      {/* Empty State — No mock data */}
      {!isLoading && orders.length === 0 && (
        <div className="bg-white dark:bg-[#1A1A1A] rounded-sm border border-neutral-200 dark:border-neutral-800 p-12 text-center">
          <div className="w-16 h-16 rounded-sm bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center mx-auto mb-4 text-neutral-900 dark:text-white">
            <ShoppingBag className="h-8 w-8 stroke-[1.2]" />
          </div>
          <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-1">
            {isAr ? 'لا توجد طلبات مسجلة حتى الآن' : 'No Orders Found'}
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-md mx-auto mb-6 leading-relaxed">
            {isAr
              ? 'لم يتم تسجيل أي طلبات شراء بعد في قاعدة بيانات جيفورا. ستظهر هنا الطلبات فور إتمام العملاء لعمليات الشراء، مع إمكانية التواصل الفوري عبر واتساب وتحديث حالات التجهيز والتوصيل.'
              : 'No orders have been recorded in the database yet. New customer orders will stream here with real-time WhatsApp actions and status progression.'}
          </p>
        </div>
      )}

      {/* Orders Table */}
      {!isLoading && orders.length > 0 && (
        <div className="bg-white dark:bg-[#1A1A1A] rounded-sm border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>{isAr ? 'رقم الطلب' : 'Order #'}</th>
                  <th>{isAr ? 'العميل' : 'Customer'}</th>
                  <th>{isAr ? 'المحافظة والعنوان' : 'Location'}</th>
                  <th>{isAr ? 'المنتجات' : 'Items'}</th>
                  <th>{isAr ? 'المبلغ الإجمالي' : 'Total'}</th>
                  <th>{isAr ? 'طريقة الدفع' : 'Payment'}</th>
                  <th>{isAr ? 'الحالة' : 'Status'}</th>
                  <th className="text-end">{isAr ? 'إجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-neutral-500">
                      {isAr ? 'لا توجد طلبات مطابقة للبحث' : 'No matching orders found'}
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const statusConf = STATUS_CONFIG[order.status] || STATUS_CONFIG.new;
                    return (
                      <tr
                        key={order.id}
                        className="hover:bg-neutral-50 dark:hover:bg-neutral-900/60 transition-colors cursor-pointer"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <td className="font-mono font-semibold text-xs text-neutral-900 dark:text-white">
                          #{order.orderNumber}
                        </td>

                        <td>
                          <div className="font-semibold text-xs text-neutral-900 dark:text-white">
                            {order.customerName}
                          </div>
                          <div className="text-[11px] text-neutral-500 font-mono">{order.phone}</div>
                        </td>

                        <td className="text-neutral-600 dark:text-neutral-400">
                          <span className="font-semibold text-xs text-neutral-900 dark:text-white block">
                            {order.governorateName}
                          </span>
                          <span className="text-[11px] truncate max-w-[140px] block">
                            {order.cityName} {order.street ? `- ${order.street}` : ''}
                          </span>
                        </td>

                        <td>
                          <div className="text-neutral-900 dark:text-white font-medium text-xs">
                            {order.items.length} {isAr ? 'منتج' : 'item(s)'}
                          </div>
                          {order.items.some(
                            (i) => i.customizationSnapshot?.nameToEngrave || i.customizationSnapshot?.customerText
                          ) && (
                            <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 mt-0.5">
                              <Type className="h-3 w-3" />
                              <span>{isAr ? 'يوجد تخصيص' : 'Customized'}</span>
                            </span>
                          )}
                        </td>

                        <td className="font-semibold text-xs text-neutral-900 dark:text-white">
                          {formatPrice(order.total, 'EGP', locale)}
                        </td>

                        <td className="text-neutral-600 dark:text-neutral-400 text-xs">
                          {order.paymentMethod === 'cash_on_delivery'
                            ? isAr ? 'كاش عند الاستلام' : 'COD'
                            : isAr ? 'إنستاباي / تحويل' : 'InstaPay'}
                        </td>

                        <td onClick={(e) => e.stopPropagation()}>
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateStatus(order.id, e.target.value as OrderStatus)}
                            className={`text-[11px] font-semibold px-2 py-1 rounded-xs cursor-pointer ${statusConf.classes}`}
                          >
                            {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                              <option key={k} value={k}>
                                {isAr ? v.labelAr : v.labelEn}
                              </option>
                            ))}
                          </select>
                        </td>

                        <td className="text-end" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            {order.phone && (
                              <a
                                href={getWhatsAppLink(order)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                                title={isAr ? 'مراسلة العميل على واتساب' : 'Chat on WhatsApp'}
                              >
                                <MessageCircle className="h-4 w-4" />
                              </a>
                            )}

                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="p-1.5 rounded-xs border border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:text-black dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                              title={isAr ? 'تفاصيل الطلب' : 'View Details'}
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Comprehensive Order Detail Modal */}
      {selectedOrder && (
        <Modal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          title={isAr ? `تفاصيل الطلب #${selectedOrder.orderNumber}` : `Order Details #${selectedOrder.orderNumber}`}
          size="xl"
        >
          <div className="space-y-6 text-xs text-neutral-900 dark:text-white">
            {/* Top Bar with WhatsApp Action and Status */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <div>
                <span className="text-[11px] text-neutral-500 block">
                  {isAr ? 'حالة الطلب الحالية:' : 'Current Status:'}
                </span>
                <span
                  className={`inline-block mt-1 px-2.5 py-1 rounded-xs text-xs font-semibold ${
                    STATUS_CONFIG[selectedOrder.status]?.classes || STATUS_CONFIG.new.classes
                  }`}
                >
                  {isAr
                    ? STATUS_CONFIG[selectedOrder.status]?.labelAr
                    : STATUS_CONFIG[selectedOrder.status]?.labelEn}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={getWhatsAppLink(selectedOrder)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 h-9 px-4 rounded-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>{isAr ? 'تواصل على واتساب' : 'WhatsApp Chat'}</span>
                </a>

                <select
                  value={selectedOrder.status}
                  onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value as OrderStatus)}
                  className="h-9 px-3 text-xs rounded-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-medium"
                >
                  {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                    <option key={k} value={k}>
                      {isAr ? v.labelAr : v.labelEn}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Grid of Customer & Shipping details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Customer Box */}
              <div className="p-4 rounded-sm border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#1A1A1A] space-y-2">
                <h3 className="font-bold text-sm pb-2 border-b border-neutral-100 dark:border-neutral-800 flex items-center gap-2">
                  <Phone className="h-4 w-4 text-neutral-900 dark:text-white" />
                  <span>{isAr ? 'بيانات العميل' : 'Customer Info'}</span>
                </h3>
                <p>
                  <span className="text-neutral-500">{isAr ? 'الاسم:' : 'Name:'}</span>{' '}
                  <strong>{selectedOrder.customerName}</strong>
                </p>
                <p>
                  <span className="text-neutral-500">{isAr ? 'الموبايل:' : 'Phone:'}</span>{' '}
                  <span className="font-mono">{selectedOrder.phone}</span>
                </p>
                <p>
                  <span className="text-neutral-500">{isAr ? 'رقم الواتساب:' : 'WhatsApp:'}</span>{' '}
                  <span className="font-mono">{selectedOrder.whatsappNumber || selectedOrder.phone}</span>
                </p>
                {selectedOrder.email && (
                  <p>
                    <span className="text-neutral-500">{isAr ? 'الإيميل:' : 'Email:'}</span>{' '}
                    <span>{selectedOrder.email}</span>
                  </p>
                )}
              </div>

              {/* Delivery Address Box */}
              <div className="p-4 rounded-sm border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#1A1A1A] space-y-2">
                <h3 className="font-bold text-sm pb-2 border-b border-neutral-100 dark:border-neutral-800 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-neutral-900 dark:text-white" />
                  <span>{isAr ? 'عنوان التوصيل في مصر' : 'Delivery Address'}</span>
                </h3>
                <p>
                  <span className="text-neutral-500">{isAr ? 'المحافظة:' : 'Governorate:'}</span>{' '}
                  <strong>{selectedOrder.governorateName}</strong> - {selectedOrder.cityName}
                  {selectedOrder.districtName && ` (${selectedOrder.districtName})`}
                </p>
                <p>
                  <span className="text-neutral-500">{isAr ? 'الشارع والمبنى:' : 'Street & Bldg:'}</span>{' '}
                  {selectedOrder.street} {selectedOrder.buildingNumber ? `- ${selectedOrder.buildingNumber}` : ''}
                </p>
                {(selectedOrder.floor || selectedOrder.apartmentNumber) && (
                  <p>
                    <span className="text-neutral-500">{isAr ? 'الشقة والدور:' : 'Floor & Apt:'}</span>{' '}
                    {selectedOrder.floor || ''} {selectedOrder.apartmentNumber ? ` - ${selectedOrder.apartmentNumber}` : ''}
                  </p>
                )}
                {selectedOrder.landmark && (
                  <p>
                    <span className="text-neutral-500">{isAr ? 'علامة مميزة:' : 'Landmark:'}</span>{' '}
                    {selectedOrder.landmark}
                  </p>
                )}
              </div>
            </div>

            {/* Gift Message and Recipient Note */}
            {(selectedOrder.recipientName || selectedOrder.giftMessage || selectedOrder.orderNotes) && (
              <div className="p-4 rounded-sm border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 space-y-2">
                <h3 className="font-bold text-xs uppercase tracking-wider text-neutral-900 dark:text-white">
                  {isAr ? 'تفاصيل الإهداء والملاحظات الخاصة' : 'Gift & Special Notes'}
                </h3>
                {selectedOrder.recipientName && (
                  <p>
                    <span className="text-neutral-500">{isAr ? 'اسم المستلم المهدى إليه:' : 'Recipient:'}</span>{' '}
                    <strong>{selectedOrder.recipientName}</strong>
                  </p>
                )}
                {selectedOrder.giftMessage && (
                  <div className="p-3 bg-white dark:bg-[#1A1A1A] rounded-xs border border-neutral-200 dark:border-neutral-800 italic">
                    &ldquo;{selectedOrder.giftMessage}&rdquo;
                  </div>
                )}
                {selectedOrder.orderNotes && (
                  <p className="text-[11px] text-neutral-500">
                    <span className="font-semibold text-neutral-900 dark:text-white">
                      {isAr ? 'ملاحظات العميل:' : 'Order notes:'}
                    </span>{' '}
                    {selectedOrder.orderNotes}
                  </p>
                )}
              </div>
            )}

            {/* Ordered Items List */}
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
                {isAr ? `المنتجات المطلوبة (${selectedOrder.items.length})` : `Order Items (${selectedOrder.items.length})`}
              </h3>
              <div className="divide-y divide-neutral-200 dark:divide-neutral-800 border border-neutral-200 dark:border-neutral-800 rounded-sm overflow-hidden bg-white dark:bg-[#1A1A1A]">
                {selectedOrder.items.map((item, idx) => (
                  <div key={item.id || idx} className="p-3.5 flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xs bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 overflow-hidden relative flex-shrink-0">
                      {item.productImage ? (
                        <Image
                          src={item.productImage}
                          alt={item.productName[locale] || item.productName.ar}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-400 font-mono text-xs">
                          {idx + 1}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-xs text-neutral-900 dark:text-white">
                          {item.productName[locale] || item.productName.ar}
                        </p>
                        <span className="font-semibold text-xs text-neutral-900 dark:text-white">
                          {formatPrice((item.unitPrice + (item.customizationPrice || 0)) * item.quantity, 'EGP', locale)}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        {item.quantity} × {formatPrice(item.unitPrice, 'EGP', locale)}
                      </p>

                      {/* Customization Details */}
                      {item.customizationSnapshot && (
                        <div className="mt-2 p-2.5 rounded-xs bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-1 text-[11px]">
                          {item.customizationSnapshot.nameToEngrave && (
                            <p>
                              <span className="text-neutral-500">{isAr ? 'الاسم المطلوب حفره:' : 'Engraving:'}</span>{' '}
                              <strong>{item.customizationSnapshot.nameToEngrave}</strong>
                            </p>
                          )}
                          {item.customizationSnapshot.engravingDate && (
                            <p>
                              <span className="text-neutral-500">{isAr ? 'تاريخ الذكرى:' : 'Date:'}</span>{' '}
                              <span>{item.customizationSnapshot.engravingDate}</span>
                            </p>
                          )}
                          {item.customizationSnapshot.customerText && (
                            <p>
                              <span className="text-neutral-500">{isAr ? 'النص المطبوع:' : 'Print Text:'}</span>{' '}
                              <strong>{item.customizationSnapshot.customerText}</strong>
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Totals */}
            <div className="p-4 rounded-sm border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-neutral-500">{isAr ? 'قيمة المنتجات' : 'Subtotal'}</span>
                <span>{formatPrice(selectedOrder.subtotal, 'EGP', locale)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">{isAr ? 'مصاريف الشحن' : 'Shipping Fee'}</span>
                <span>
                  {selectedOrder.shippingAmount === 0
                    ? isAr ? 'مجاني' : 'Free'
                    : formatPrice(selectedOrder.shippingAmount, 'EGP', locale)}
                </span>
              </div>
              <div className="flex justify-between font-bold text-sm pt-2 border-t border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white">
                <span>{isAr ? 'الإجمالي النهائي' : 'Total Amount'}</span>
                <span>{formatPrice(selectedOrder.total, 'EGP', locale)}</span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
