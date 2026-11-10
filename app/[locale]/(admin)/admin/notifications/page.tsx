'use client';
import { useState } from 'react';
import { Bell, Send, CheckCircle2, MessageSquare, Smartphone, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Locale } from '@/types';

interface NotificationTemplate {
  id: string;
  type: string;
  titleAr: string;
  titleEn: string;
  bodyAr: string;
  bodyEn: string;
  channels: string[];
}

const TEMPLATES: NotificationTemplate[] = [
  {
    id: '1',
    type: 'order_confirmation',
    titleAr: 'تم تأكيد طلبك بنجاح',
    titleEn: 'Order Confirmed',
    bodyAr: 'شكراً لثقتك في جيفورا. رقم طلبك هو {order_id}. بدأنا في تجهيز وتغليف هديتك الفاخرة.',
    bodyEn: 'Thank you for choosing Givora. Your order #{order_id} is being prepared.',
    channels: ['Push', 'Email', 'WhatsApp'],
  },
  {
    id: '2',
    type: 'shipping_update',
    titleAr: 'شحنتك في الطريق مع مندوب التوصيل',
    titleEn: 'Your Gift is Out for Delivery',
    bodyAr: 'تم تسليم شحنتك لشركة الشحن برقم تتبع {tracking_number}. المندوب سيتواصل معك قريباً.',
    bodyEn: 'Your package is on its way with tracking #{tracking_number}.',
    channels: ['Push', 'SMS', 'WhatsApp'],
  },
  {
    id: '3',
    type: 'order_delivered',
    titleAr: 'تم تسليم هديتك بنجاح',
    titleEn: 'Your Gift was Delivered',
    bodyAr: 'سعداء بمشاركتكم هذه اللحظة المميزة. نتمنى أن تنال الهدية إعجابكم دائماً.',
    bodyEn: 'Your gift was successfully delivered. We hope it brought immense joy.',
    channels: ['Push', 'Email'],
  },
];

export default function AdminNotificationsPage() {
  const isAr = true;
  const locale: Locale = 'ar';
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastBody, setBroadcastBody] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastBody) return;
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setSentSuccess(true);
      setBroadcastTitle('');
      setBroadcastBody('');
      setTimeout(() => setSentSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--text-main)]">
          {isAr ? 'إدارة الإشعارات وFCM' : 'Notifications & Push Center'}
        </h1>
        <p className="text-xs text-[var(--text-secondary)] mt-1">
          {isAr
            ? 'إرسال الإشعارات الفورية (Firebase Cloud Messaging) وإعداد قوالب رسائل الطلبات والشحن'
            : 'Configure automated order notifications and broadcast push announcements'}
        </p>
      </div>

      {/* Broadcast message */}
      <div className="bg-[var(--card-bg)] p-6 rounded-sm border border-[var(--border-color)] max-w-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-[var(--text-main)]" />
            <h2 className="text-sm font-semibold text-[var(--text-main)]">
              {isAr ? 'إرسال إشعار فوري لجميع العملاء (FCM Push)' : 'Broadcast Push Notification'}
            </h2>
          </div>
          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-secondary)]">
            FCM Ready
          </span>
        </div>

        {sentSuccess && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-sm text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
            <Check className="h-4 w-4" />
            <span>{isAr ? 'تم إرسال الإشعار بنجاح لجميع المشتركين' : 'Notification sent successfully to all subscribers'}</span>
          </div>
        )}

        <form onSubmit={handleSendBroadcast} className="space-y-3">
          <Input
            label={isAr ? 'عنوان الإشعار' : 'Notification Title'}
            placeholder={isAr ? 'عرض حصري: شحن مجاني لكافة محافظات مصر اليوم' : 'Special Offer: Free Shipping Across Egypt Today'}
            value={broadcastTitle}
            onChange={(e) => setBroadcastTitle(e.target.value)}
            required
          />
          <Textarea
            label={isAr ? 'نص الإشعار' : 'Notification Message'}
            placeholder={isAr ? 'اكتشف أحدث بوكسات الهدايا الفاخرة وسلاسل الفضة المحفورة بالاسم...' : 'Discover our newest luxury gift boxes and engraved collections...'}
            value={broadcastBody}
            onChange={(e) => setBroadcastBody(e.target.value)}
            required
          />
          <Button type="submit" isLoading={isSending} leftIcon={<Send className="h-4 w-4" />}>
            {isAr ? 'إرسال الإشعار الفوري' : 'Send Push Notification'}
          </Button>
        </form>
      </div>

      {/* Automated Templates */}
      <div className="space-y-4">
        <h2 className="text-base font-semibold text-[var(--text-main)]">
          {isAr ? 'قوالب الإشعارات التلقائية لحالات الطلبات' : 'Automated System Order Templates'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TEMPLATES.map((tmpl) => (
            <div key={tmpl.id} className="bg-[var(--card-bg)] p-5 rounded-sm border border-[var(--border-color)] flex flex-col justify-between">
              <div>
                <p className="font-semibold text-sm text-[var(--text-main)]">{tmpl.titleAr}</p>
                <p className="text-xs text-[var(--text-secondary)] mt-2 leading-relaxed">{tmpl.bodyAr}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-[var(--border-color)] flex items-center justify-between">
                <span className="text-[10px] text-[var(--text-secondary)] font-mono">{tmpl.type}</span>
                <div className="flex gap-1">
                  {tmpl.channels.map(ch => (
                    <span key={ch} className="text-[10px] bg-[var(--bg-secondary)] text-[var(--text-secondary)] px-2 py-0.5 rounded border border-[var(--border-color)]">
                      {ch}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
