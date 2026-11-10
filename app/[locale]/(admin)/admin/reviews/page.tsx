'use client';
import { useState } from 'react';
import { Star, Check, X, EyeOff, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Locale, ReviewStatus } from '@/types';

interface ReviewItem {
  id: string;
  productName: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  status: ReviewStatus;
  isFeatured: boolean;
}

const INITIAL_REVIEWS: ReviewItem[] = [
  { id: '1', productName: 'بوكس الملكة الفاخر', customerName: 'سارة م.', rating: 5, comment: 'بوكس الهدية كان خيالياً! التغليف فاخر جداً والمحتوى أجمل من الصور.', date: '2026-10-15', status: 'approved', isFeatured: true },
  { id: '2', productName: 'سلسلة اسم فضة 925 بحفر ليزر', customerName: 'محمد ع.', rating: 5, comment: 'السلسلة المخصصة جاءت بالاسم بالضبط كما أردت. جودة ممتازة وتسليم سريع جداً.', date: '2026-10-20', status: 'approved', isFeatured: true },
  { id: '3', productName: 'بورتريه أكريليك مطبوع بستاند مضيء', customerName: 'نورة ك.', rating: 5, comment: 'الصورة والطباعة طلعت أوضح بكتير من المتوقع والإضاءة فخمة جداً! شكراً جيفورا.', date: '2026-11-01', status: 'approved', isFeatured: true },
  { id: '4', productName: 'بوكس السعادة الرجالي', customerName: 'طارق فهد', rating: 4, comment: 'المنتج ممتاز والتغليف راقي، وصل في الميعاد المحدد بالظبط.', date: '2026-11-09', status: 'pending', isFeatured: false },
];

export default function AdminReviewsPage() {
  const isAr = true;
  const locale: Locale = 'ar';
  const [reviews, setReviews] = useState<ReviewItem[]>(INITIAL_REVIEWS);

  const updateStatus = (id: string, status: ReviewStatus) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, status } : r));
  };

  const toggleFeatured = (id: string) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, isFeatured: !r.isFeatured } : r));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text-main)]">
            {isAr ? 'إدارة التقييمات والآراء' : 'Reviews & Testimonials Management'}
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            {isAr ? 'مراجعة آراء العملاء واعتمادها وتمييزها في الصفحة الرئيسية' : 'Moderate customer reviews and feature top testimonials'}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map(review => (
          <div key={review.id} className="bg-[var(--card-bg)] p-5 rounded-sm border border-[var(--border-color)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-[var(--text-main)]">{review.customerName}</span>
                <span className="text-xs text-[var(--text-secondary)]">على: {review.productName}</span>
                <Badge variant={review.status === 'approved' ? 'success' : review.status === 'rejected' ? 'danger' : 'warning'}>
                  {review.status === 'approved' ? (isAr ? 'معتمد' : 'Approved') : review.status === 'rejected' ? (isAr ? 'مرفوض' : 'Rejected') : (isAr ? 'بانتظار المراجعة' : 'Pending')}
                </Badge>
                {review.isFeatured && (
                  <Badge variant="default">{isAr ? 'مميز بالرئيسية' : 'Featured'}</Badge>
                )}
              </div>
              <div className="flex gap-0.5 my-1">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} className={`h-3.5 w-3.5 ${s <= review.rating ? 'fill-[var(--text-main)] text-[var(--text-main)]' : 'text-[var(--border-color)]'}`} />
                ))}
              </div>
              <p className="text-sm text-[var(--text-main)] leading-relaxed">&ldquo;{review.comment}&rdquo;</p>
              <p className="text-xs text-[var(--text-secondary)]">{review.date}</p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={review.isFeatured ? 'primary' : 'outline'}
                onClick={() => toggleFeatured(review.id)}
                leftIcon={<Sparkles className="h-3 w-3" />}
              >
                {review.isFeatured ? (isAr ? 'إلغاء التمييز' : 'Unfeature') : (isAr ? 'تمييز بالرئيسية' : 'Feature')}
              </Button>
              {review.status !== 'approved' && (
                <Button size="sm" onClick={() => updateStatus(review.id, 'approved')}>
                  {isAr ? 'اعتماد' : 'Approve'}
                </Button>
              )}
              {review.status !== 'rejected' && (
                <Button size="sm" variant="danger" onClick={() => updateStatus(review.id, 'rejected')}>
                  {isAr ? 'رفض' : 'Reject'}
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
