'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle2, ChevronRight, Truck, Wallet, ShieldCheck, MessageCircle, MapPin, Building, Phone } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { generateOrderNumber, formatPrice, isValidEgyptianPhone } from '@/lib/utils';
import { EGYPTIAN_GOVERNORATES } from '@/lib/data/egyptian-locations';
import type { Locale } from '@/types';

const checkoutSchema = z.object({
  fullName: z.string().min(2, 'الاسم مطلوب بالكامل'),
  phone: z.string().refine(isValidEgyptianPhone, {
    message: 'رقم الموبايل لازم يكون رقم مصري صحيح (010، 011، 012، 015)',
  }),
  useSameWhatsApp: z.boolean(),
  whatsappNumber: z.string().optional(),
  email: z.string().email('بريد إلكتروني غير صالح').optional().or(z.literal('')),
  governorateId: z.string().min(1, 'اختار المحافظة'),
  cityId: z.string().min(1, 'اختار المدينة أو المركز'),
  districtId: z.string().optional(),
  street: z.string().min(5, 'اكتب اسم الشارع بالتفصيل'),
  buildingNumber: z.string().min(1, 'رقم العمارة مطلوب'),
  floor: z.string().optional(),
  apartmentNumber: z.string().optional(),
  landmark: z.string().optional(),
  recipientName: z.string().optional(),
  giftMessage: z.string().optional(),
  orderNotes: z.string().optional(),
  paymentMethod: z.enum(['cash_on_delivery', 'manual_transfer']),
}).refine((data) => {
  if (!data.useSameWhatsApp && data.whatsappNumber) {
    return isValidEgyptianPhone(data.whatsappNumber);
  }
  return true;
}, {
  message: 'رقم الواتساب غير صحيح',
  path: ['whatsappNumber'],
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

interface CheckoutClientProps {
  locale: Locale;
}

export function CheckoutClient({ locale }: CheckoutClientProps) {
  const isAr = locale === 'ar';
  const t = useTranslations('checkout');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: 'cash_on_delivery',
      useSameWhatsApp: true,
      governorateId: 'cairo',
    },
  });

  const selectedGovId = watch('governorateId');
  const selectedCityId = watch('cityId');
  const useSameWhatsApp = watch('useSameWhatsApp');
  const phoneValue = watch('phone');

  // Find active governorate details
  const activeGovernorate = useMemo(() => {
    return EGYPTIAN_GOVERNORATES.find(g => g.id === selectedGovId) || EGYPTIAN_GOVERNORATES[0];
  }, [selectedGovId]);

  // Cities for the selected governorate
  const cities = activeGovernorate?.cities || [];

  // Find active city details
  const activeCity = useMemo(() => {
    return cities.find(c => c.id === selectedCityId);
  }, [cities, selectedCityId]);

  const districts = activeCity?.districts || [];

  // Cart pricing calculation (Mock baseline for preview / will connect with store)
  const subtotal = 1250;
  const isFreeShipping = subtotal >= 1000;
  const shippingFee = isFreeShipping ? 0 : (activeGovernorate?.shippingFee || 50);
  const total = subtotal + shippingFee;

  const onSubmit = async (data: CheckoutFormData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      const generatedNum = generateOrderNumber();
      setOrderNumber(generatedNum);
      setOrderSuccess(true);
    } catch (err) {
      console.error(err);
    }
  };

  const effectiveWhatsApp = useSameWhatsApp ? phoneValue : (watch('whatsappNumber') || phoneValue);
  const cleanPhone = (effectiveWhatsApp || '').replace(/\D/g, '');
  const formattedWa = cleanPhone.startsWith('0') ? '2' + cleanPhone : (cleanPhone.startsWith('2') ? cleanPhone : '20' + cleanPhone);
  const waOrderText = encodeURIComponent(
    isAr 
      ? `أهلاً جيفورا، كنت حابب أستفسر عن أوردر رقم #${orderNumber}`
      : `Hello Givora, I have an inquiry regarding order #${orderNumber}`
  );
  const waUrl = `https://wa.me/${formattedWa}?text=${waOrderText}`;

  if (orderSuccess) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="h-8 w-8" />
        </div>

        <h1
          className="text-3xl font-light text-[var(--text-main)] mb-3"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          {isAr ? 'طلبك اتسجل بنجاح' : 'Order Placed Successfully'}
        </h1>

        <p className="text-[var(--text-secondary)] text-sm mb-4 leading-relaxed">
          {isAr
            ? 'شكراً لاختيارك جيفورا. تم استلام تفاصيل هديتك وبدأنا في تجهيزها بكل دقة وعناية.'
            : 'Thank you for choosing Givora. Your gift order has been received and is being prepared with utmost care.'}
        </p>

        <div className="p-4 rounded-sm border border-[var(--border-color)] bg-[var(--card-bg)] inline-block mb-6">
          <span className="text-xs text-[var(--text-secondary)] block mb-1">
            {isAr ? 'رقم الطلب' : 'Order Number'}
          </span>
          <span className="font-mono text-lg font-semibold tracking-wider text-[var(--text-main)]">
            {orderNumber}
          </span>
        </div>

        <div className="p-4 rounded-sm border border-[var(--border-color)] bg-[var(--bg-secondary)] text-start mb-8 text-xs text-[var(--text-secondary)] space-y-2">
          <div className="flex items-center gap-2 text-[var(--text-main)] font-medium">
            <Truck className="h-4 w-4" />
            <span>
              {isAr ? 'موعد التوصيل المتوقع:' : 'Estimated Delivery:'}{' '}
              {activeGovernorate.deliveryEstimateDays.min} - {activeGovernorate.deliveryEstimateDays.max}{' '}
              {isAr ? 'أيام عمل' : 'business days'}
            </span>
          </div>
          <p>
            {isAr
              ? `العنوان: ${activeGovernorate.name.ar} - ${activeCity?.name.ar || ''}`
              : `Destination: ${activeGovernorate.name.en} - ${activeCity?.name.en || ''}`}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-sm bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            <span>{isAr ? 'تواصل معنا عبر واتساب' : 'Chat via WhatsApp'}</span>
          </a>

          <Link href={`/${locale}`}>
            <Button variant="outline" className="h-11 px-6">
              {isAr ? 'الرجوع للمتجر' : 'Back to Store'}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <h1
          className="text-3xl md:text-4xl font-light text-[var(--text-main)] mb-2"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          {isAr ? 'إتمام الطلب' : 'Complete Order'}
        </h1>
        <p className="text-sm text-[var(--text-secondary)]">
          {isAr
            ? 'اكتب بيانات الاستلام عشان نوصّلك هديتك لحد باب البيت في مصر'
            : 'Enter delivery details so we can deliver your gift across Egypt'}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Delivery & Payment Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* 1. Customer & Recipient Info */}
            <div className="bg-[var(--card-bg)] rounded-sm border border-[var(--border-color)] p-6">
              <h2 className="text-base font-medium text-[var(--text-main)] mb-6 flex items-center gap-2 pb-3 border-b border-[var(--border-color)]">
                <Truck className="h-4 w-4 text-[var(--text-main)]" />
                <span>{isAr ? 'بيانات المستلم والتوصيل' : 'Recipient & Delivery Information'}</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label={isAr ? 'الاسم بالكامل' : 'Full Name'}
                  {...register('fullName')}
                  error={errors.fullName?.message}
                  required
                />

                <Input
                  label={isAr ? 'رقم الموبايل المصري' : 'Egyptian Mobile Number'}
                  type="tel"
                  placeholder="010XXXXXXXX"
                  {...register('phone')}
                  error={errors.phone?.message}
                  required
                />

                {/* WhatsApp Checkbox & Alternate */}
                <div className="sm:col-span-2 border border-[var(--border-color)] bg-[var(--bg-secondary)] p-3 rounded-sm space-y-3">
                  <label className="flex items-center gap-2.5 text-xs text-[var(--text-main)] cursor-pointer select-none">
                    <input
                      type="checkbox"
                      {...register('useSameWhatsApp')}
                      className="accent-[var(--text-main)] rounded"
                    />
                    <span>{isAr ? 'رقم الواتساب هو نفس رقم الموبايل للتواصل ومتابعة الشحنة' : 'WhatsApp number is the same as mobile for tracking and updates'}</span>
                  </label>

                  {!useSameWhatsApp && (
                    <Input
                      label={isAr ? 'رقم الواتساب البديل' : 'Alternative WhatsApp Number'}
                      type="tel"
                      placeholder="01XXXXXXXXX"
                      {...register('whatsappNumber')}
                      error={errors.whatsappNumber?.message}
                    />
                  )}
                </div>

                <Input
                  label={isAr ? 'البريد الإلكتروني (اختياري لتأكيد الطلب والفاتورة)' : 'Email (Optional)'}
                  type="email"
                  {...register('email')}
                  error={errors.email?.message}
                  className="sm:col-span-2"
                />

                {/* Governorate Selection */}
                <Select
                  label={isAr ? 'المحافظة' : 'Governorate'}
                  {...register('governorateId')}
                  error={errors.governorateId?.message}
                  options={EGYPTIAN_GOVERNORATES.map(g => ({
                    value: g.id,
                    label: isAr ? `${g.name.ar} (${g.shippingFee} ج.م)` : `${g.name.en} (${g.shippingFee} EGP)`,
                  }))}
                  required
                />

                {/* City Selection */}
                <Select
                  label={isAr ? 'المدينة / المركز' : 'City / Center'}
                  {...register('cityId')}
                  error={errors.cityId?.message}
                  options={cities.map(c => ({
                    value: c.id,
                    label: isAr ? c.name.ar : c.name.en,
                  }))}
                  placeholder={isAr ? 'اختر المدينة' : 'Select City'}
                  required
                />

                {/* District Selection (if available) */}
                {districts.length > 0 && (
                  <Select
                    label={isAr ? 'الحي / المنطقة' : 'District'}
                    {...register('districtId')}
                    error={errors.districtId?.message}
                    options={districts.map(d => ({
                      value: d.id,
                      label: isAr ? d.name.ar : d.name.en,
                    }))}
                    placeholder={isAr ? 'اختر الحي' : 'Select District'}
                    className="sm:col-span-2"
                  />
                )}

                <Input
                  label={isAr ? 'اسم الشارع' : 'Street Name'}
                  {...register('street')}
                  error={errors.street?.message}
                  placeholder={isAr ? 'شارع الجمهورية، متفرع من...' : 'Street name...'}
                  className="sm:col-span-2"
                  required
                />

                <Input
                  label={isAr ? 'رقم العمارة / المبنى' : 'Building Number'}
                  {...register('buildingNumber')}
                  error={errors.buildingNumber?.message}
                  placeholder={isAr ? 'عمارة 14' : 'Building 14'}
                  required
                />

                <div className="grid grid-cols-2 gap-2">
                  <Input
                    label={isAr ? 'الدور' : 'Floor'}
                    {...register('floor')}
                    placeholder={isAr ? 'الدور 3' : 'Floor 3'}
                  />
                  <Input
                    label={isAr ? 'رقم الشقة' : 'Apt Number'}
                    {...register('apartmentNumber')}
                    placeholder={isAr ? 'شقة 6' : 'Apt 6'}
                  />
                </div>

                <Input
                  label={isAr ? 'علامة مميزة (أقرب مسجد، صيدلية، مدرسة)' : 'Nearest Landmark'}
                  {...register('landmark')}
                  placeholder={isAr ? 'بجوار صيدلية...' : 'Near...'}
                  className="sm:col-span-2"
                />

                <div className="sm:col-span-2 pt-2 border-t border-[var(--border-color)]">
                  <Input
                    label={isAr ? 'اسم مستلم الهدية (لو رايحة لشخص تاني كـ مفاجأة)' : 'Recipient Name (If a surprise gift)'}
                    {...register('recipientName')}
                    placeholder={isAr ? 'سيبها فاضية لو هتستلمها بنفسك' : 'Leave blank if receiving yourself'}
                  />
                </div>

                <div className="sm:col-span-2">
                  <Textarea
                    label={isAr ? 'رسالة الإهداء (هنطبعها على كارت شيك ومرفق مع البوكس)' : 'Gift Card Message'}
                    {...register('giftMessage')}
                    placeholder={isAr ? 'اكتب رسالتك الدافئة هنا...' : 'Write your warm message here...'}
                  />
                </div>

                <div className="sm:col-span-2">
                  <Textarea
                    label={isAr ? 'ملاحظات خاصة بمندوب الشحن' : 'Delivery Notes'}
                    {...register('orderNotes')}
                    placeholder={isAr ? 'مواعيد الاتصال المفضلة أو أي تعليمات خاصة بالتسليم' : 'Preferred contact timing or delivery instructions'}
                  />
                </div>
              </div>
            </div>

            {/* 2. Payment Method */}
            <div className="bg-[var(--card-bg)] rounded-sm border border-[var(--border-color)] p-6">
              <h2 className="text-base font-medium text-[var(--text-main)] mb-6 flex items-center gap-2 pb-3 border-b border-[var(--border-color)]">
                <Wallet className="h-4 w-4 text-[var(--text-main)]" />
                <span>{isAr ? 'طريقة الدفع' : 'Payment Method'}</span>
              </h2>

              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border border-[var(--border-color)] rounded-sm cursor-pointer hover:border-[var(--text-main)] has-[:checked]:border-[var(--text-main)] has-[:checked]:bg-[var(--bg-secondary)] transition-colors">
                  <input
                    type="radio"
                    value="cash_on_delivery"
                    {...register('paymentMethod')}
                    className="accent-[var(--text-main)]"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[var(--text-main)]">
                      {isAr ? 'الدفع كاش عند الاستلام' : 'Cash on Delivery (COD)'}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                      {isAr ? 'ادفع للمندوب كاش براحتك بعد استلام ومعاينة البوكس' : 'Pay in cash directly to courier upon delivery'}
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 border border-[var(--border-color)] rounded-sm cursor-pointer hover:border-[var(--text-main)] has-[:checked]:border-[var(--text-main)] has-[:checked]:bg-[var(--bg-secondary)] transition-colors">
                  <input
                    type="radio"
                    value="manual_transfer"
                    {...register('paymentMethod')}
                    className="accent-[var(--text-main)]"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[var(--text-main)]">
                      {isAr ? 'إنستاباي / فودافون كاش / تحويل بنكي' : 'InstaPay / Vodafone Cash / Bank Transfer'}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                      {isAr ? 'هنرسل لك بيانات التحويل الفوري فور تأكيد الطلب' : 'InstaPay handle and wallet transfer details provided after confirmation'}
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-sm p-6 space-y-4">
              <h2 className="text-base font-semibold text-[var(--text-main)] pb-3 border-b border-[var(--border-color)]">
                {isAr ? 'ملخص الحساب' : 'Order Summary'}
              </h2>

              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">{isAr ? 'قيمة المنتجات' : 'Products Total'}</span>
                  <span className="text-[var(--text-main)] font-medium">{formatPrice(subtotal, 'EGP', locale)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">{isAr ? 'مصاريف الشحن' : 'Shipping Fee'}</span>
                  <span className="text-[var(--text-main)] font-medium">
                    {isFreeShipping ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                        {isAr ? 'شحن مجاني' : 'Free Shipping'}
                      </span>
                    ) : (
                      formatPrice(shippingFee, 'EGP', locale)
                    )}
                  </span>
                </div>

                <div className="pt-2 text-xs text-[var(--text-secondary)]">
                  <span className="block">
                    {isAr ? 'مدة التوصيل لـ' : 'Estimated delivery to'}{' '}
                    <strong className="text-[var(--text-main)]">{isAr ? activeGovernorate.name.ar : activeGovernorate.name.en}</strong>:
                  </span>
                  <span>
                    {activeGovernorate.deliveryEstimateDays.min} - {activeGovernorate.deliveryEstimateDays.max}{' '}
                    {isAr ? 'أيام عمل' : 'business days'}
                  </span>
                </div>
              </div>

              <div className="flex justify-between text-base font-semibold pt-4 border-t border-[var(--border-color)] text-[var(--text-main)]">
                <span>{isAr ? 'الإجمالي النهائي' : 'Final Total'}</span>
                <span>{formatPrice(total, 'EGP', locale)}</span>
              </div>

              <Button
                type="submit"
                isLoading={isSubmitting}
                fullWidth
                size="lg"
                rightIcon={<ChevronRight className="h-4 w-4 rtl:rotate-180" />}
              >
                {isAr ? 'أكّد الطلب الآن' : 'Place Order Now'}
              </Button>

              <div className="pt-4 border-t border-[var(--border-color)] flex items-center justify-center gap-2 text-xs text-[var(--text-secondary)]">
                <ShieldCheck className="h-4 w-4 text-[var(--text-main)]" />
                <span>{isAr ? 'تسوق آمن ومشفر 100%' : '100% Secure Checkout'}</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
