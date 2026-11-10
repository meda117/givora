import { Star } from 'lucide-react';
import type { Locale } from '@/types';

const MOCK_TESTIMONIALS = [
  {
    id: '1',
    name: { ar: 'سارة من المعادي', en: 'Sara (Maadi, Cairo)' },
    rating: 5,
    body: {
      ar: 'بوكس الهدية كان تحفة بجد! التغليف شيك أوي والتفاصيل معمولة بمزاج، الهدية فرّحت أختي جداً. شكراً جيفورا!',
      en: 'The gift box was breathtaking! Super chic packaging and every detail made with great taste. Brought so much joy to my sister!',
    },
    date: '2026-10-15',
  },
  {
    id: '2',
    name: { ar: 'أحمد من الإسكندرية', en: 'Ahmed (Alexandria)' },
    rating: 5,
    body: {
      ar: 'طلبت سلسلة محفورة بالاسم، الفينش ممتاز والاسم مظبوط بالمللي. التوصيل كان سريع ووصلت لإسكندرية في يومين بس.',
      en: 'Ordered a personalized engraved necklace. The finish was top notch and name precision was spot-on. Delivered to Alex in just two days.',
    },
    date: '2026-10-20',
  },
  {
    id: '3',
    name: { ar: 'مريم من التجمع', en: 'Mariam (New Cairo)' },
    rating: 5,
    body: {
      ar: 'طلبت بوكس كابلز مخصص مع طباعة صورنا وكارت إهداء، التغليف الفاخر عجب خطيبي جداً وخامة المنتجات ممتازة.',
      en: 'Ordered a personalized couple gift box with custom printed photos and card. The luxury packaging was stunning and product quality is superior.',
    },
    date: '2026-11-01',
  },
];

export function TestimonialsSection({ locale }: { locale: Locale }) {
  return (
    <section className="py-20 px-4 sm:px-6 bg-neutral-50 dark:bg-[#111111] border-y border-neutral-200 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 space-y-2">
          <h2
            className="text-3xl md:text-4xl font-light text-neutral-950 dark:text-white"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            {locale === 'ar' ? 'فرحة عملائنا بهدايانا' : 'What Our Customers Say'}
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {locale === 'ar' ? 'تجارب حقيقية لعملاء شاركونا لحظاتهم السعيدة' : 'Real reviews from verified buyers across Egypt'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MOCK_TESTIMONIALS.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white dark:bg-[#151515] rounded-sm p-6 border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between"
            >
              <div>
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-black text-black dark:fill-white dark:text-white" />
                  ))}
                </div>

                {/* Body */}
                <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed mb-6">
                  &ldquo;{testimonial.body[locale]}&rdquo;
                </p>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center border border-neutral-200 dark:border-neutral-700">
                  <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                    {testimonial.name[locale].charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-neutral-900 dark:text-white">{testimonial.name[locale]}</p>
                  <p className="text-[11px] text-neutral-400 dark:text-neutral-500">{locale === 'ar' ? 'طلب مؤكد من مصر' : 'Verified Buyer in Egypt'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
