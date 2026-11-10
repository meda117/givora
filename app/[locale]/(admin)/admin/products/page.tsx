import { AdminProductsClient } from '@/components/admin/products/admin-products-client';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return { title: locale === 'ar' ? 'إدارة المنتجات | Givora' : 'Products Management | Givora' };
}

export default async function AdminProductsPage({ params }: Props) {
  const { locale } = await params;
  return <AdminProductsClient locale={locale as 'ar' | 'en'} />;
}
