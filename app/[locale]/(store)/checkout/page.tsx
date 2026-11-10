import { getTranslations } from 'next-intl/server';
import { CheckoutClient } from '@/components/store/checkout/checkout-client';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'checkout' });
  return { title: t('title') };
}

export default async function CheckoutPage({ params }: Props) {
  const { locale } = await params;
  return <CheckoutClient locale={locale as 'ar' | 'en'} />;
}
