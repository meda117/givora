'use client';
import { useState } from 'react';
import { Upload, Trash2, Eye, Copy, Check, Image as ImageIcon, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Locale } from '@/types';

interface MediaAsset {
  id: string;
  name: string;
  type: 'image' | 'video';
  url: string;
  size: string;
  uploadedAt: string;
}

const INITIAL_MEDIA: MediaAsset[] = [
  { id: '1', name: 'hero-banner-main.webp', type: 'image', url: 'https://ik.imagekit.io/givora/banners/hero-banner-main.webp', size: '240 KB', uploadedAt: '2026-11-01' },
  { id: '2', name: 'luxury-rose-box-cover.webp', type: 'image', url: 'https://ik.imagekit.io/givora/products/luxury-rose-box.webp', size: '180 KB', uploadedAt: '2026-11-02' },
  { id: '3', name: 'custom-necklace-video.mp4', type: 'video', url: 'https://ik.imagekit.io/givora/videos/necklace-showcase.mp4', size: '2.4 MB', uploadedAt: '2026-11-03' },
  { id: '4', name: 'wedding-invitation-mockup.webp', type: 'image', url: 'https://ik.imagekit.io/givora/digital/wedding-mockup.webp', size: '150 KB', uploadedAt: '2026-11-04' },
];

export default function AdminMediaPage() {
  const isAr = true;
  const locale: Locale = 'ar';
  const [mediaList, setMediaList] = useState(INITIAL_MEDIA);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyUrl = (url: string, id: string) => {
    navigator.clipboard?.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const deleteMedia = (id: string) => {
    setMediaList(mediaList.filter(m => m.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-charcoal">
            {isAr ? 'مكتبة الوسائط (ImageKit)' : 'Media Library (ImageKit)'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {isAr
              ? 'إدارة جميع صور وفيديوهات المنتجات والبانرات عبر شبكة ImageKit السريعة'
              : 'Upload and organize high-resolution product photography and videos via ImageKit CDN'}
          </p>
        </div>
        <Button leftIcon={<Upload className="h-4 w-4" />}>
          {isAr ? 'رفع ملفات جديدة' : 'Upload Media'}
        </Button>
      </div>

      {/* Upload Dropzone */}
      <div className="bg-white p-8 rounded-sm border-2 border-dashed border-gray-200 text-center hover:border-gold/50 transition-colors">
        <div className="w-12 h-12 rounded-full bg-champagne/30 flex items-center justify-center mx-auto mb-3 text-gold">
          <Upload className="h-6 w-6" />
        </div>
        <p className="text-sm font-semibold text-charcoal">
          {isAr ? 'اسحب الصور والفيديوهات وأفلتها هنا' : 'Drag & drop images and videos here'}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {isAr ? 'يتم تحسين المقاسات والضغط تلقائياً عبر ImageKit' : 'Automatic WebP/AVIF transformation via ImageKit'}
        </p>
        <div className="mt-4">
          <input type="file" multiple className="hidden" id="admin-file-upload" />
          <label htmlFor="admin-file-upload">
            <Button size="sm" variant="outline">
              {isAr ? 'تصفح جهازك' : 'Browse Local Files'}
            </Button>
          </label>
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {mediaList.map((item) => (
          <div key={item.id} className="bg-white rounded-sm border border-gray-100 overflow-hidden group shadow-sm flex flex-col">
            <div className="aspect-square bg-champagne/20 relative flex items-center justify-center">
              {item.type === 'video' ? (
                <Video className="h-10 w-10 text-charcoal/40" />
              ) : (
                <ImageIcon className="h-10 w-10 text-charcoal/30" />
              )}
              <div className="absolute top-2 start-2">
                <Badge variant={item.type === 'video' ? 'info' : 'default'}>
                  {item.type === 'video' ? 'Video' : 'Image'}
                </Badge>
              </div>
            </div>

            <div className="p-3 flex-1 flex flex-col justify-between">
              <div>
                <p className="text-xs font-medium text-charcoal truncate" title={item.name}>{item.name}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{item.size} · {item.uploadedAt}</p>
              </div>

              <div className="flex items-center justify-between pt-3 mt-2 border-t border-gray-50">
                <button
                  onClick={() => copyUrl(item.url, item.id)}
                  className="text-xs text-gold hover:underline flex items-center gap-1"
                >
                  {copiedId === item.id ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedId === item.id ? (isAr ? 'تم النسخ' : 'Copied') : (isAr ? 'نسخ الرابط' : 'Copy URL')}</span>
                </button>
                <button
                  onClick={() => deleteMedia(item.id)}
                  className="text-gray-400 hover:text-red-500 p-1"
                  aria-label="Delete"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
