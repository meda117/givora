import { notFound } from 'next/navigation';

type Props = { params: Promise<{ locale: string; pageSlug: string }> };

const PAGES_DATA: Record<string, { title: { ar: string; en: string }; content: { ar: string; en: string } }> = {
  'about-us': {
    title: { ar: 'عن جيفورا', en: 'About Givora' },
    content: {
      ar: 'جيفورا هو براند مصري راقي للهدايا والتجارب الرقمية المميزة. بنجمع بين شياكة بوكسات الهدايا الفاخرة، والهدايا المودرن اللي بتتصمم بالاسم والصور مخصوص، وتجارب الذكريات الرقمية اللي تفضل عايشة.',
      en: 'Givora is an upscale Egyptian luxury gifting brand and digital experiences platform, combining physical gift boxes, trending personalized gifts, and unforgettable digital memories across Egypt.',
    },
  },
  'contact-us': {
    title: { ar: 'كلمنا', en: 'Contact Us' },
    content: {
      ar: 'يسعدنا جداً تواصلكم معانا في أي وقت. فريق خدمة عملاء جيفورا جاهز يساعدكم في اختيار الهدية وتجهيز المفاجأة عبر الواتساب على 01001234567 أو الإيميل: care@givora.com',
      en: 'We are delighted to assist you anytime. The Givora concierge team is ready to help you curate your gifts and surprises via WhatsApp (+20 100 123 4567) or email: care@givora.com',
    },
  },
  'faq': {
    title: { ar: 'الأسئلة الشائعة', en: 'Frequently Asked Questions' },
    content: {
      ar: 'إزاي أطلب؟ وهل ينفع أخفي السعر عن المستلم؟ أكيد، تقدّر تفعّل خيار إخفاء السعر وتكتب رسالة إهداء شيك على كارت هدايا فاخر في صفحة تأكيد الأوردر.',
      en: 'How do I order? Can I hide prices from the recipient? Absolutely! Simply enable the "Hide Price" toggle at checkout and add your personalized gift message.',
    },
  },
  'privacy-policy': {
    title: { ar: 'سياسة الخصوصية', en: 'Privacy Policy' },
    content: {
      ar: 'نحن في جيفورا نلتزم بحماية خصوصية بياناتكم الشخصية ومعلومات مستلمي الهدايا بأعلى معايير الأمان والتشفير.',
      en: 'At Givora, we are committed to safeguarding your personal data and gift recipient information with the highest security and encryption standards.',
    },
  },
  'terms-and-conditions': {
    title: { ar: 'الشروط والأحكام', en: 'Terms & Conditions' },
    content: {
      ar: 'تخضع جميع الطلبات والخدمات المقدمة عبر منصة جيفورا للشروط والأنظمة المعمول بها للتجارة الإلكترونية في مصر.',
      en: 'All orders and services provided through Givora are subject to standard Egyptian e-commerce laws and regulations.',
    },
  },
  'shipping-policy': {
    title: { ar: 'سياسة الشحن والتوصيل', en: 'Shipping Policy' },
    content: {
      ar: 'نوفر خدمة التوصيل السريع لجميع محافظات جمهورية مصر العربية (القاهرة والجيزة والإسكندرية وجميع محافظات الدلتا والصعيد والقناة). شحن مجاني للطلبات بقيمة 1000 ج.م وأكتر في القاهرة والجيزة. التوصيل الرقمي فوري في ثواني.',
      en: 'We offer express delivery across all Egyptian governorates (Cairo, Giza, Alexandria, Delta, Canal, and Upper Egypt). Enjoy free shipping on orders of 1000 EGP or more in Cairo & Giza. Digital gifts are delivered instantaneously.',
    },
  },
  'returns-policy': {
    title: { ar: 'سياسة الإرجاع والاستبدال', en: 'Returns Policy' },
    content: {
      ar: 'نظراً لطبيعة المنتجات المخصصة والهدايا المصممة خصيصاً بالاسم أو الصور، فإن الإرجاع متاح فقط في حالة وجود عيب مصنعي أو تلف في الشحنة.',
      en: 'Due to the personalized nature of our custom-crafted gifts, returns are accepted exclusively in cases of manufacturing defects or transit damage.',
    },
  },
};

export default async function StaticPage({ params }: Props) {
  const { locale, pageSlug } = await params;
  const page = PAGES_DATA[pageSlug];

  if (!page) notFound();

  const isAr = locale === 'ar';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center mb-12">
        <h1
          className="text-3xl md:text-5xl font-light text-charcoal mb-4"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          {page.title[locale as 'ar' | 'en']}
        </h1>
        <div className="h-0.5 w-16 bg-gold mx-auto" />
      </div>

      <div className="bg-white border border-gray-100 rounded-sm p-8 sm:p-12 shadow-sm leading-relaxed text-charcoal/80 text-base md:text-lg">
        <p>{page.content[locale as 'ar' | 'en']}</p>
      </div>
    </div>
  );
}
