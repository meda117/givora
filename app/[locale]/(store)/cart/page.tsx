import { getTranslations } from 'next-intl/server';
import { CartPageClient } from '@/components/store/cart/cart-page-client';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'cart' });
  return { title: t('title') };
}

export default async function CartPage({ params }: Props) {
  const { locale } = await params;
  return <CartPageClient locale={locale as 'ar' | 'en'} />;
}
