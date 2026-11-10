import { getTranslations } from 'next-intl/server';
import { AdminOverview } from '@/components/admin/overview/admin-overview';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return { title: locale === 'ar' ? 'لوحة التحكم | Givora' : 'Dashboard | Givora' };
}

export default async function AdminDashboardPage({ params }: Props) {
  const { locale } = await params;
  return <AdminOverview locale={locale as 'ar' | 'en'} />;
}
