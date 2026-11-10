import { AdminOrdersClient } from '@/components/admin/orders/admin-orders-client';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return { title: locale === 'ar' ? 'إدارة الطلبات | Givora' : 'Orders Management | Givora' };
}

export default async function AdminOrdersPage({ params }: Props) {
  const { locale } = await params;
  return <AdminOrdersClient locale={locale as 'ar' | 'en'} />;
}
