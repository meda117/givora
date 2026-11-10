'use client';
import { useState, useRef } from 'react';
import { UploadCloud, CheckCircle, AlertCircle, X, Film, Image as ImageIcon, Loader2 } from 'lucide-react';
import { uploadToImageKit } from '@/lib/imagekit/service';
import { Button } from '@/components/ui/button';

export interface UploadedMediaItem {
  url: string;
  fileId: string;
  name: string;
  fileType?: string;
}

interface ImageKitUploaderProps {
  onUploadSuccess: (item: UploadedMediaItem) => void;
  folder?: string;
  accept?: string;
  maxSizeMB?: number;
  label?: string;
  hint?: string;
  className?: string;
}

export function ImageKitUploader({
  onUploadSuccess,
  folder = '/givora/products',
  accept = 'image/*,video/*',
  maxSizeMB = 50,
  label,
  hint,
  className = '',
}: ImageKitUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recentUpload, setRecentUpload] = useState<UploadedMediaItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);

    // Validate size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`حجم الملف كبير جداً. الحد الأقصى المسموح به هو ${maxSizeMB} ميجابايت.`);
      return;
    }

    setIsUploading(true);
    setUploadProgress(20);

    try {
      const simulatedProgress = setInterval(() => {
        setUploadProgress((prev) => (prev && prev < 90 ? prev + 15 : prev));
      }, 200);

      const res = await uploadToImageKit(file, folder, file.name);

      clearInterval(simulatedProgress);
      setUploadProgress(100);

      const isVideo = file.type.startsWith('video/');
      const uploadedItem: UploadedMediaItem = {
        url: res.url,
        fileId: res.fileId,
        name: file.name,
        fileType: isVideo ? 'video' : 'image',
      };

      setRecentUpload(uploadedItem);
      onUploadSuccess(uploadedItem);

      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(null);
      }, 500);
    } catch (err: any) {
      console.error('Upload failed:', err);
      setError(err?.message || 'فشل رفع الملف إلى سيرفر ImageKit. يرجى المحاولة مرة أخرى.');
      setIsUploading(false);
      setUploadProgress(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="text-xs font-medium text-[var(--text-main)] block">
          {label}
        </label>
      )}

      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`relative border border-dashed rounded-sm p-6 text-center transition-all cursor-pointer select-none ${
          isDragging
            ? 'border-[var(--text-main)] bg-[var(--bg-secondary)] scale-[0.99]'
            : 'border-[var(--border-color)] bg-[var(--card-bg)] hover:border-[var(--text-muted)] hover:bg-[var(--bg-secondary)]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFile(e.target.files[0]);
            }
          }}
          className="hidden"
        />

        {isUploading ? (
          <div className="flex flex-col items-center justify-center py-4 space-y-3">
            <Loader2 className="h-7 w-7 text-[var(--text-main)] animate-spin" />
            <p className="text-xs font-medium text-[var(--text-main)]">
              جارِ رفع الملف إلى خوادم ImageKit السريعة...
            </p>
            {uploadProgress !== null && (
              <div className="w-48 h-1 bg-[var(--border-color)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--text-main)] transition-all duration-200"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-2 space-y-2">
            <div className="w-10 h-10 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-main)]">
              <UploadCloud className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-[var(--text-main)]">
                اضغط لاختيار صورة أو فيديو، أو اسحب الملف وأفلته هنا
              </p>
              <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                {hint || `الصور (JPG, PNG, WEBP) والفيديوهات (MP4) حتى ${maxSizeMB}MB ترفع مباشرة إلى CDN ImageKit`}
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="p-2.5 rounded-sm bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {recentUpload && !isUploading && (
        <div className="flex items-center justify-between p-2 rounded-sm bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs">
          <div className="flex items-center gap-2 min-w-0">
            {recentUpload.fileType === 'video' ? (
              <Film className="h-4 w-4 text-[var(--text-main)] flex-shrink-0" />
            ) : (
              <ImageIcon className="h-4 w-4 text-[var(--text-main)] flex-shrink-0" />
            )}
            <span className="truncate max-w-[200px] sm:max-w-xs text-[var(--text-main)] font-medium">
              {recentUpload.name}
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
              ✓ تم الرفع بنجاح إلى ImageKit
            </span>
          </div>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setRecentUpload(null); }}
            className="text-[var(--text-muted)] hover:text-red-500 p-1"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
