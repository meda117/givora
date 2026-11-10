'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Trash2, Copy, Check, Image as ImageIcon, Film, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ImageKitUploader, type UploadedMediaItem } from '@/components/admin/media/imagekit-uploader';
import { db } from '@/lib/firebase/client';
import { collection, getDocs, doc, setDoc, deleteDoc, query, orderBy } from 'firebase/firestore';

interface MediaAsset {
  id: string;
  name: string;
  type: 'image' | 'video';
  url: string;
  size?: string;
  createdAt: string;
}

export default function AdminMediaPage() {
  const isAr = true;
  const [mediaList, setMediaList] = useState<MediaAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchMedia = async () => {
    setIsLoading(true);
    try {
      const q = query(collection(db, 'media_assets'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as MediaAsset));
      setMediaList(items);
    } catch (err) {
      console.warn('Error fetching media assets from Firestore:', err);
      setMediaList([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleUploadSuccess = async (item: UploadedMediaItem) => {
    const newAsset: MediaAsset = {
      id: item.fileId,
      name: item.name,
      type: item.fileType === 'video' ? 'video' : 'image',
      url: item.url,
      createdAt: new Date().toISOString(),
    };

    // Save metadata record to Firestore
    try {
      await setDoc(doc(db, 'media_assets', item.fileId), newAsset);
      setMediaList(prev => [newAsset, ...prev]);
    } catch (err) {
      console.error('Failed to save media metadata to Firestore:', err);
    }
  };

  const copyUrl = (url: string, id: string) => {
    navigator.clipboard?.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const deleteMedia = async (id: string, fileId: string) => {
    if (!confirm(isAr ? 'هل أنت متأكد من حذف هذا الملف من ImageKit وقاعدة البيانات؟' : 'Are you sure you want to delete this media?')) {
      return;
    }

    try {
      // 1. Delete from Firestore
      await deleteDoc(doc(db, 'media_assets', id));

      // 2. Delete from ImageKit via server route
      fetch('/api/imagekit/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileId }),
      }).catch(console.error);

      setMediaList(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-color)]">
        <div>
          <h1
            className="text-2xl sm:text-3xl font-light text-[var(--text-main)]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {isAr ? 'مكتبة الوسائط السحابية' : 'Media CDN Library'}
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            {isAr
              ? 'جميع الصور والفيديوهات ترفع مباشرة على شبكة ImageKit العالمية وتخزن بياناتها في فايربيس'
              : 'Direct integration with ImageKit CDN & persistent Firestore catalog'}
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchMedia}
          disabled={isLoading}
          leftIcon={<RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />}
        >
          {isAr ? 'تحديث الوسائط' : 'Refresh'}
        </Button>
      </div>

      {/* Upload Component */}
      <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-sm p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-[var(--text-main)] mb-3">
          {isAr ? 'رفع صور أو فيديوهات جديدة إلى ImageKit' : 'Upload Assets to ImageKit'}
        </h2>
        <ImageKitUploader
          onUploadSuccess={handleUploadSuccess}
          folder="/givora/uploads"
          hint={isAr ? 'الصور (PNG, JPG, WEBP) والفيديوهات (MP4) تُرفع وتُضغط تلقائياً عبر ImageKit' : 'Images and videos are compressed and served globally via ImageKit'}
        />
      </div>

      {/* Media Assets Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[var(--text-main)]">
            {isAr ? `الملفات المرفوعة (${mediaList.length})` : `Uploaded Assets (${mediaList.length})`}
          </h2>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-[var(--text-muted)]">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ms-2 text-xs">{isAr ? 'جارِ تحميل مكتبة الوسائط...' : 'Loading media library...'}</span>
          </div>
        ) : mediaList.length === 0 ? (
          <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-sm p-12 text-center text-[var(--text-muted)]">
            <ImageIcon className="h-10 w-10 mx-auto mb-3 opacity-30 stroke-1" />
            <p className="text-sm font-medium text-[var(--text-main)]">
              {isAr ? 'لا توجد وسائط مرفوعة حتى الآن' : 'No media assets found'}
            </p>
            <p className="text-xs text-[var(--text-muted)] mt-1 max-w-sm mx-auto">
              {isAr
                ? 'استخدم صندوق الرفع بالأعلى لرفع أول صورة أو فيديو ليتم حفظها فوراً على ImageKit وربطها بالمتجر.'
                : 'Upload your first image or video above to store it on ImageKit CDN and link it in the catalog.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {mediaList.map((item) => (
              <div
                key={item.id}
                className="bg-[var(--card-bg)] rounded-sm border border-[var(--border-color)] overflow-hidden group shadow-sm flex flex-col transition-all hover:border-[var(--text-main)]"
              >
                {/* Media Preview Box */}
                <div className="aspect-square bg-[var(--bg-secondary)] relative flex items-center justify-center overflow-hidden">
                  {item.type === 'video' ? (
                    <div className="flex flex-col items-center justify-center p-4 text-center">
                      <Film className="h-8 w-8 text-[var(--text-main)] mb-1 opacity-70" />
                      <span className="text-[10px] text-[var(--text-muted)] font-mono">VIDEO</span>
                    </div>
                  ) : (
                    <Image
                      src={item.url}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, 20vw"
                    />
                  )}
                  <div className="absolute top-2 start-2">
                    <Badge variant={item.type === 'video' ? 'info' : 'default'} size="sm">
                      {item.type === 'video' ? 'Video' : 'Image'}
                    </Badge>
                  </div>
                </div>

                {/* Info & Action Controls */}
                <div className="p-3 flex-1 flex flex-col justify-between text-xs">
                  <div>
                    <p className="font-medium text-[var(--text-main)] truncate" title={item.name}>
                      {item.name}
                    </p>
                    <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
                      {new Date(item.createdAt).toLocaleDateString('ar-EG')}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-[var(--border-color)]">
                    <button
                      type="button"
                      onClick={() => copyUrl(item.url, item.id)}
                      className="text-[11px] text-[var(--text-main)] font-medium hover:underline flex items-center gap-1 active:scale-95 transition-transform"
                    >
                      {copiedId === item.id ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                      <span>{copiedId === item.id ? (isAr ? 'تم النسخ' : 'Copied') : (isAr ? 'نسخ الرابط' : 'Copy CDN')}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteMedia(item.id, item.id)}
                      className="text-[var(--text-muted)] hover:text-red-500 p-1 active:scale-90 transition-transform"
                      aria-label="Delete media"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
