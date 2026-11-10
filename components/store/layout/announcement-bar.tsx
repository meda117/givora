'use client';
import { useState, useEffect } from 'react';
import { X, Truck, Gift, ShieldCheck } from 'lucide-react';

const DEFAULT_MESSAGES = [
  {
    icon: Truck,
    ar: 'شحن مجاني للطلبات فوق 1000 ج.م في القاهرة والجيزة',
    en: 'Free shipping on orders over 1000 EGP in Cairo & Giza',
  },
  {
    icon: Gift,
    ar: 'مش مجرد هدية.. دي لحظة هتفضل فاكرها',
    en: 'More than a gift — an unforgettable moment',
  },
  {
    icon: ShieldCheck,
    ar: 'توصيل موثوق ومعاينة عند الاستلام لكل محافظات مصر',
    en: 'Reliable delivery and inspection on arrival across Egypt',
  },
];

export function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);
  const [locale, setLocale] = useState<'ar' | 'en'>('ar');

  useEffect(() => {
    const dir = document.documentElement.getAttribute('dir');
    setLocale(dir === 'rtl' ? 'ar' : 'en');

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % DEFAULT_MESSAGES.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  if (isDismissed) return null;

  const current = DEFAULT_MESSAGES[currentIndex];
  const Icon = current.icon;

  return (
    <div className="bg-black text-white dark:bg-neutral-900 dark:text-neutral-100 py-2 px-4 relative border-b border-neutral-800">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
        <Icon className="h-3.5 w-3.5 text-neutral-400 flex-shrink-0" />
        <p className="text-xs font-medium tracking-wide text-center">
          {current[locale]}
        </p>
      </div>
      <button
        onClick={() => setIsDismissed(true)}
        className="absolute end-4 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-white transition-colors"
        aria-label="Dismiss announcement"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
