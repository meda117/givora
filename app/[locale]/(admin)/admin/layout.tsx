import { AdminShell } from '@/components/admin/layout/admin-shell';
import type { Locale } from '@/types';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function AdminLayout({ children, params }: Props) {
  const { locale } = await params;

  return (
    <AdminShell locale={locale as Locale}>
      {children}
    </AdminShell>
  );
}
