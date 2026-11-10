'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Search, Filter, Eye, Printer, MessageCircle, Phone, 
  MapPin, Calendar, Clock, CheckCircle, Package, ExternalLink,
  Type, Image as ImageIcon, ChevronRight, X, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Modal } from '@/components/ui/modal';
import { formatPrice, formatDate } from '@/lib/utils';
import type { Locale, Order, OrderStatus, ProductType, OrderCustomizationSnapshot } from '@/types';

interface DetailedMockOrder {
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
    productType: ProductType;
    unitPrice: number;
    customizationPrice: number;
    quantity: number;
    productImage?: string;
    customizationSnapshot?: OrderCustomizationSnapshot;
  }[];
}

const MOCK_ORDERS_DATA: DetailedMockOrder[] = [
  {
    id: 'ord-001',
    orderNumber: 'GIV-2411-9081',
    customerName: 'سارة محمود الشناوي',
    phone: '01001234567',
    whatsappNumber: '01001234567',
    email: 'sara.m@example.com',
    governorateName: 'القاهرة',
    cityName: 'المعادي',
    districtName: 'دجلة',
    street: 'شارع 206 متفرع من شارع النصر',
    buildingNumber: 'عمارة 18',
    apartmentNumber: 'شقة 4',
    floor: 'الدور الثاني',
    landmark: 'بجوار المدرسة الإنجليزية',
    recipientName: 'نادية إبراهيم',
    giftMessage: 'ألف مبروك الترقية يا أحلى أخت في الدنيا، دايماً فخورة بيكي!',
    orderNotes: 'يرجى الاتصال قبل التوصيل بنصف ساعة',
    subtotal: 1450,
    shippingAmount: 0,
    discountAmount: 0,
    total: 1450,
    status: 'new',
    paymentMethod: 'cash_on_delivery',
    paymentStatus: 'pending',
    createdAt: '2026-11-10T11:45:00Z',
    items: [
      {
        id: 'item-1',
        productName: { ar: 'بوكس الملكة الفاخر (إصدار النخبة)', en: 'Royal Queen Gift Box' },
        productType: 'gift_box',
        unitPrice: 1450,
        customizationPrice: 0,
        quantity: 1,
        productImage: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&auto=format&fit=crop&q=80',
        customizationSnapshot: {
          productType: 'gift_box',
          specialInstructions: 'تغليف راقي بشريط قماشي أسود وخاتم شمعي',
        },
      },
    ],
  },
  {
    id: 'ord-002',
    orderNumber: 'GIV-2411-9082',
    customerName: 'كريم أحمد عبد الفتاح',
    phone: '01112345678',
    whatsappNumber: '01112345678',
    email: 'karim.ahmed@example.com',
    governorateName: 'الجيزة',
    cityName: 'الشيخ زايد',
    districtName: 'الحي الثامن',
    street: 'شارع البستان الرئيسي',
    buildingNumber: 'فيلا 42',
    landmark: 'أمام كمبوند الياسمين',
    giftMessage: 'Happy Anniversary my love! To many more years together.',
    orderNotes: 'ميعاد التسليم المفضل بعد الساعة 5 مساءً',
    subtotal: 580,
    shippingAmount: 50,
    discountAmount: 0,
    total: 630,
    status: 'preparing',
    paymentMethod: 'manual_transfer',
    paymentStatus: 'paid',
    createdAt: '2026-11-10T09:20:00Z',
    items: [
      {
        id: 'item-2',
        productName: { ar: 'سوار فضة 925 بحفر ليزر مخصص', en: '925 Silver Laser Engraved Bracelet' },
        productType: 'engraved',
        unitPrice: 480,
        customizationPrice: 100,
        quantity: 1,
        productImage: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&auto=format&fit=crop&q=80',
        customizationSnapshot: {
          productType: 'engraved',
          nameToEngrave: 'كريم & ياسمين',
          engravingDate: '2023-11-12',
          fontStyle: 'خط ديواني كلاسيكي',
          position: 'الواجهة الخارجية للسوار',
        },
      },
    ],
  },
  {
    id: 'ord-003',
    orderNumber: 'GIV-2411-9083',
    customerName: 'فاطمة الزهراء علي',
    phone: '01223456789',
    whatsappNumber: '01223456789',
    governorateName: 'الإسكندرية',
    cityName: 'سموحة',
    street: 'شارع فيكتور عمانويل',
    buildingNumber: 'عمارة الأطباء 5',
    apartmentNumber: 'شقة 12',
    floor: 'الدور السادس',
    landmark: 'بجوار نادي سموحة',
    subtotal: 390,
    shippingAmount: 60,
    discountAmount: 0,
    total: 450,
    status: 'shipped',
    paymentMethod: 'cash_on_delivery',
    paymentStatus: 'pending',
    createdAt: '2026-11-09T16:00:00Z',
    items: [
      {
        id: 'item-3',
        productName: { ar: 'بورتريه أكريليك مطبوع بستاند مضيء', en: 'Custom Printed Acrylic Portrait' },
        productType: 'printed',
        unitPrice: 350,
        customizationPrice: 40,
        quantity: 1,
        productImage: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500&auto=format&fit=crop&q=80',
        customizationSnapshot: {
          productType: 'printed',
          customerText: 'Love you always Mom',
          position: 'أسفل الصورة في المنتصف',
          uploadedImages: [
            {
              url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=80',
              fileName: 'family-portrait.jpg',
            },
          ],
        },
      },
    ],
  },
  {
    id: 'ord-004',
    orderNumber: 'GIV-2411-9084',
    customerName: 'محمد طارق الباز',
    phone: '01556789012',
    whatsappNumber: '01556789012',
    governorateName: 'الدقهلية',
    cityName: 'المنصورة',
    districtName: 'حي الجامعة',
    street: 'شارع جيهان',
    buildingNumber: 'عمارة 22',
    apartmentNumber: 'شقة 3',
    floor: 'الدور الأول',
    landmark: 'بجوار بوابة جامعة المنصورة',
    subtotal: 920,
    shippingAmount: 70,
    discountAmount: 0,
    total: 990,
    status: 'delivered',
    paymentMethod: 'cash_on_delivery',
    paymentStatus: 'paid',
    createdAt: '2026-11-08T14:15:00Z',
    items: [
      {
        id: 'item-4',
        productName: { ar: 'بوكس السعادة الرجالي المميز', en: 'Gentleman Luxury Gift Box' },
        productType: 'gift_box',
        unitPrice: 920,
        customizationPrice: 0,
        quantity: 1,
        productImage: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500&auto=format&fit=crop&q=80',
        customizationSnapshot: {
          productType: 'gift_box',
          specialInstructions: 'مع كارت إهداء بدون كتابة أسعار',
        },
      },
    ],
  },
];

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
  const [orders, setOrders] = useState<DetailedMockOrder[]>(MOCK_ORDERS_DATA);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<DetailedMockOrder | null>(null);

  const filteredOrders = orders.filter(o => {
    const matchSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.phone.includes(search) ||
      o.governorateName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const getWhatsAppLink = (order: DetailedMockOrder) => {
    const clean = order.whatsappNumber.replace(/\D/g, '');
    const formatted = clean.startsWith('0') ? '2' + clean : (clean.startsWith('2') ? clean : '20' + clean);
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text-main)]">
            {isAr ? 'إدارة الطلبات والمبيعات' : 'Order Management'}
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            {isAr
              ? `عرض وتحديث طلبات العملاء والتواصل المباشر عبر واتساب وتفاصيل التخصيص`
              : `Review customer orders, update statuses, inspect customizations, and WhatsApp integration`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="h-4 w-4 me-1.5" />
            <span>{isAr ? 'طباعة القائمة' : 'Print List'}</span>
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-[var(--card-bg)] rounded-sm border border-[var(--border-color)] p-4 flex flex-wrap gap-3">
        <div className="flex-1 min-w-[240px]">
          <Input
            placeholder={isAr ? 'بحث برقم الطلب، اسم العميل، رقم الموبايل أو المحافظة...' : 'Search by order #, customer, phone, or governorate...'}
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

      {/* Orders Table */}
      <div className="bg-[var(--card-bg)] rounded-sm border border-[var(--border-color)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] text-start">
                <th className="py-3 px-4 font-medium">{isAr ? 'رقم الطلب' : 'Order #'}</th>
                <th className="py-3 px-4 font-medium">{isAr ? 'العميل' : 'Customer'}</th>
                <th className="py-3 px-4 font-medium">{isAr ? 'المحافظة والعنوان' : 'Location'}</th>
                <th className="py-3 px-4 font-medium">{isAr ? 'المنتجات والتخصيص' : 'Items'}</th>
                <th className="py-3 px-4 font-medium">{isAr ? 'المبلغ الإجمالي' : 'Total'}</th>
                <th className="py-3 px-4 font-medium">{isAr ? 'طريقة الدفع' : 'Payment'}</th>
                <th className="py-3 px-4 font-medium">{isAr ? 'الحالة' : 'Status'}</th>
                <th className="py-3 px-4 font-medium text-end">{isAr ? 'إجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[var(--text-secondary)]">
                    {isAr ? 'لا توجد طلبات مطابقة للبحث' : 'No matching orders found'}
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const statusConf = STATUS_CONFIG[order.status];
                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <td className="py-3.5 px-4 font-mono font-medium text-[var(--text-main)]">
                        {order.orderNumber}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-medium text-[var(--text-main)]">{order.customerName}</div>
                        <div className="text-[11px] text-[var(--text-secondary)] font-mono">{order.phone}</div>
                      </td>

                      <td className="py-3.5 px-4 text-[var(--text-secondary)]">
                        <span className="font-medium text-[var(--text-main)]">{order.governorateName}</span>
                        <span className="block text-[11px] truncate max-w-[140px]">{order.cityName} - {order.street}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-[var(--text-main)] font-medium">
                          {order.items.length} {isAr ? 'منتج' : 'item(s)'}
                        </div>
                        {order.items.some(i => i.customizationSnapshot?.nameToEngrave || i.customizationSnapshot?.customerText) && (
                          <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-[var(--bg-secondary)] text-[var(--text-main)] border border-[var(--border-color)] mt-0.5">
                            <Type className="h-3 w-3" />
                            <span>{isAr ? 'يوجد تخصيص' : 'Customized'}</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-[var(--text-main)]">
                        {formatPrice(order.total, 'EGP', locale)}
                      </td>

                      <td className="py-3.5 px-4 text-[var(--text-secondary)]">
                        {order.paymentMethod === 'cash_on_delivery'
                          ? (isAr ? 'كاش استلام' : 'COD')
                          : (isAr ? 'إنستاباي / تحويل' : 'InstaPay')}
                      </td>

                      <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateStatus(order.id, e.target.value as OrderStatus)}
                          className={`text-[11px] font-medium px-2 py-1 rounded-sm cursor-pointer border-0 ${statusConf.classes}`}
                        >
                          {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                            <option key={k} value={k}>{isAr ? v.labelAr : v.labelEn}</option>
                          ))}
                        </select>
                      </td>

                      <td className="py-3.5 px-4 text-end" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Quick WhatsApp Action Button */}
                          <a
                            href={getWhatsAppLink(order)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-sm bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                            title={isAr ? 'مراسلة عبر واتساب' : 'Chat on WhatsApp'}
                          >
                            <MessageCircle className="h-4 w-4" />
                          </a>

                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-1.5 rounded-sm border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-[var(--bg-secondary)] transition-colors"
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

      {/* Comprehensive Order Detail Modal */}
      {selectedOrder && (
        <Modal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          title={isAr ? `تفاصيل الطلب #${selectedOrder.orderNumber}` : `Order Details #${selectedOrder.orderNumber}`}
          size="xl"
        >
          <div className="space-y-6 text-xs text-[var(--text-main)]">
            {/* Top Bar with WhatsApp Action and Status */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-sm bg-[var(--bg-secondary)] border border-[var(--border-color)]">
              <div>
                <span className="text-[11px] text-[var(--text-secondary)] block">
                  {isAr ? 'حالة الطلب الحالية:' : 'Current Status:'}
                </span>
                <span className={`inline-block mt-1 px-2.5 py-1 rounded-sm text-xs font-medium ${STATUS_CONFIG[selectedOrder.status].classes}`}>
                  {isAr ? STATUS_CONFIG[selectedOrder.status].labelAr : STATUS_CONFIG[selectedOrder.status].labelEn}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={getWhatsAppLink(selectedOrder)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 h-9 px-4 rounded-sm bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>{isAr ? 'تواصل مع العميل على واتساب' : 'Open WhatsApp Chat'}</span>
                </a>

                <select
                  value={selectedOrder.status}
                  onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value as OrderStatus)}
                  className="h-9 px-3 text-xs rounded-sm border border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--text-main)]"
                >
                  {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                    <option key={k} value={k}>{isAr ? v.labelAr : v.labelEn}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Grid of Customer & Shipping details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Customer Box */}
              <div className="p-4 rounded-sm border border-[var(--border-color)] bg-[var(--card-bg)] space-y-2">
                <h3 className="font-semibold text-sm pb-2 border-b border-[var(--border-color)] flex items-center gap-2">
                  <Phone className="h-4 w-4 text-[var(--text-main)]" />
                  <span>{isAr ? 'بيانات العميل' : 'Customer Info'}</span>
                </h3>
                <p>
                  <span className="text-[var(--text-secondary)]">{isAr ? 'الاسم:' : 'Name:'}</span>{' '}
                  <strong>{selectedOrder.customerName}</strong>
                </p>
                <p>
                  <span className="text-[var(--text-secondary)]">{isAr ? 'الموبايل:' : 'Phone:'}</span>{' '}
                  <span className="font-mono">{selectedOrder.phone}</span>
                </p>
                <p>
                  <span className="text-[var(--text-secondary)]">{isAr ? 'رقم الواتساب:' : 'WhatsApp:'}</span>{' '}
                  <span className="font-mono">{selectedOrder.whatsappNumber}</span>
                </p>
                {selectedOrder.email && (
                  <p>
                    <span className="text-[var(--text-secondary)]">{isAr ? 'الإيميل:' : 'Email:'}</span>{' '}
                    <span>{selectedOrder.email}</span>
                  </p>
                )}
              </div>

              {/* Delivery Address Box */}
              <div className="p-4 rounded-sm border border-[var(--border-color)] bg-[var(--card-bg)] space-y-2">
                <h3 className="font-semibold text-sm pb-2 border-b border-[var(--border-color)] flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[var(--text-main)]" />
                  <span>{isAr ? 'عنوان التوصيل في مصر' : 'Delivery Address'}</span>
                </h3>
                <p>
                  <span className="text-[var(--text-secondary)]">{isAr ? 'المحافظة:' : 'Governorate:'}</span>{' '}
                  <strong>{selectedOrder.governorateName}</strong> - {selectedOrder.cityName}
                  {selectedOrder.districtName && ` (${selectedOrder.districtName})`}
                </p>
                <p>
                  <span className="text-[var(--text-secondary)]">{isAr ? 'الشارع والمبنى:' : 'Street & Bldg:'}</span>{' '}
                  {selectedOrder.street} - {selectedOrder.buildingNumber}
                </p>
                {(selectedOrder.floor || selectedOrder.apartmentNumber) && (
                  <p>
                    <span className="text-[var(--text-secondary)]">{isAr ? 'الشقة والدور:' : 'Floor & Apt:'}</span>{' '}
                    {selectedOrder.floor || ''} {selectedOrder.apartmentNumber ? ` - ${selectedOrder.apartmentNumber}` : ''}
                  </p>
                )}
                {selectedOrder.landmark && (
                  <p>
                    <span className="text-[var(--text-secondary)]">{isAr ? 'علامة مميزة:' : 'Landmark:'}</span>{' '}
                    {selectedOrder.landmark}
                  </p>
                )}
              </div>
            </div>

            {/* Recipient & Gift Message (If applicable) */}
            {(selectedOrder.recipientName || selectedOrder.giftMessage || selectedOrder.orderNotes) && (
              <div className="p-4 rounded-sm border border-[var(--border-color)] bg-[var(--card-bg)] space-y-2">
                <h3 className="font-semibold text-sm pb-2 border-b border-[var(--border-color)]">
                  {isAr ? 'رسالة الإهداء والملاحظات' : 'Gift Message & Notes'}
                </h3>
                {selectedOrder.recipientName && (
                  <p>
                    <span className="text-[var(--text-secondary)]">{isAr ? 'اسم المستلم (المفاجأة):' : 'Recipient:'}</span>{' '}
                    <strong>{selectedOrder.recipientName}</strong>
                  </p>
                )}
                {selectedOrder.giftMessage && (
                  <div className="p-3 bg-[var(--bg-secondary)] rounded-sm border border-[var(--border-color)] font-serif italic text-sm">
                    &ldquo;{selectedOrder.giftMessage}&rdquo;
                  </div>
                )}
                {selectedOrder.orderNotes && (
                  <p className="text-[11px] text-[var(--text-secondary)]">
                    <span className="font-medium text-[var(--text-main)]">{isAr ? 'ملاحظة للمندوب:' : 'Courier note:'}</span> {selectedOrder.orderNotes}
                  </p>
                )}
              </div>
            )}

            {/* Order Items & Customizations */}
            <div className="border border-[var(--border-color)] rounded-sm overflow-hidden bg-[var(--card-bg)]">
              <div className="p-3 bg-[var(--bg-secondary)] font-semibold border-b border-[var(--border-color)]">
                {isAr ? 'المنتجات وتفاصيل التخصيص' : 'Items & Customization Specs'}
              </div>

              <div className="divide-y divide-[var(--border-color)]">
                {selectedOrder.items.map((item) => {
                  const snap = item.customizationSnapshot;
                  return (
                    <div key={item.id} className="p-4 flex flex-col md:flex-row gap-4 items-start">
                      {item.productImage && (
                        <div className="w-16 h-16 rounded border border-[var(--border-color)] relative overflow-hidden flex-shrink-0 bg-[var(--bg-secondary)]">
                          <Image src={item.productImage} alt={item.productName[locale]} fill className="object-cover" />
                        </div>
                      )}

                      <div className="flex-1 space-y-2 min-w-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-sm text-[var(--text-main)]">{item.productName[locale]}</h4>
                            <span className="text-[11px] text-[var(--text-secondary)] capitalize font-mono">
                              {item.productType.replace('_', ' ')}
                            </span>
                          </div>
                          <div className="text-end">
                            <span className="font-semibold text-sm">
                              {formatPrice((item.unitPrice + item.customizationPrice) * item.quantity, 'EGP', locale)}
                            </span>
                            <span className="block text-[11px] text-[var(--text-secondary)]">
                              {item.quantity} x {formatPrice(item.unitPrice + item.customizationPrice, 'EGP', locale)}
                            </span>
                          </div>
                        </div>

                        {/* Customization Details Box */}
                        {snap && (
                          <div className="p-3 rounded-sm bg-[var(--bg-secondary)] border border-[var(--border-color)] space-y-1.5 text-xs">
                            <span className="font-medium text-[var(--text-main)] block pb-1 border-b border-[var(--border-color)]">
                              {isAr ? 'بيانات التخصيص المحفوظة:' : 'Stored Customization Details:'}
                            </span>

                            {snap.nameToEngrave && (
                              <p>
                                <span className="text-[var(--text-secondary)]">{isAr ? 'الاسم المطلوب حفره:' : 'Engraving Name:'}</span>{' '}
                                <strong className="text-[var(--text-main)] font-mono">{snap.nameToEngrave}</strong>
                              </p>
                            )}

                            {snap.engravingDate && (
                              <p>
                                <span className="text-[var(--text-secondary)]">{isAr ? 'التاريخ المطلوب:' : 'Date:'}</span>{' '}
                                <strong className="font-mono">{snap.engravingDate}</strong>
                              </p>
                            )}

                            {snap.fontStyle && (
                              <p>
                                <span className="text-[var(--text-secondary)]">{isAr ? 'نوع الخط:' : 'Font Style:'}</span>{' '}
                                <span>{snap.fontStyle}</span>
                              </p>
                            )}

                            {snap.position && (
                              <p>
                                <span className="text-[var(--text-secondary)]">{isAr ? 'مكان الحفر / الطباعة:' : 'Position:'}</span>{' '}
                                <span>{snap.position}</span>
                              </p>
                            )}

                            {snap.customerText && (
                              <p>
                                <span className="text-[var(--text-secondary)]">{isAr ? 'النص المطبوع:' : 'Printed Text:'}</span>{' '}
                                <strong className="text-[var(--text-main)]">&ldquo;{snap.customerText}&rdquo;</strong>
                              </p>
                            )}

                            {snap.uploadedImages && snap.uploadedImages.length > 0 && (
                              <div className="pt-2">
                                <span className="text-[var(--text-secondary)] block mb-1.5">
                                  {isAr ? 'صور العميل المرفقة للطباعة:' : 'Uploaded Customer Images:'}
                                </span>
                                <div className="flex gap-2">
                                  {snap.uploadedImages.map((img, i) => (
                                    <a
                                      key={i}
                                      href={img.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="relative group border border-[var(--border-color)] rounded overflow-hidden w-16 h-16 block"
                                    >
                                      <Image src={img.url} alt="Uploaded Image" fill className="object-cover" />
                                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                                        <ExternalLink className="h-4 w-4" />
                                      </div>
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}

                            {snap.specialInstructions && (
                              <p className="text-[11px] text-[var(--text-secondary)]">
                                <span className="font-medium text-[var(--text-main)]">{isAr ? 'تعليمات خاصة:' : 'Special note:'}</span> {snap.specialInstructions}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Financial Totals */}
            <div className="p-4 rounded-sm border border-[var(--border-color)] bg-[var(--bg-secondary)] space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">{isAr ? 'قيمة المنتجات' : 'Subtotal'}</span>
                <span>{formatPrice(selectedOrder.subtotal, 'EGP', locale)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">{isAr ? 'مصاريف الشحن' : 'Shipping Fee'}</span>
                <span>{selectedOrder.shippingAmount === 0 ? (isAr ? 'مجاني' : 'Free') : formatPrice(selectedOrder.shippingAmount, 'EGP', locale)}</span>
              </div>
              <div className="flex justify-between font-semibold text-sm pt-2 border-t border-[var(--border-color)] text-[var(--text-main)]">
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
