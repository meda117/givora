// ============================================================
// GIVORA — IMAGEKIT SERVICE
// Secure server-side upload auth + client-side helpers
// ============================================================

// ----------------------------------------------------------------
// CLIENT-SIDE — ImageKit URL builder (safe to use in components)
// ----------------------------------------------------------------
export const IMAGEKIT_URL_ENDPOINT = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || '';

export interface ImageKitTransform {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
  crop?: 'maintain_ratio' | 'force' | 'at_max' | 'at_least';
  focus?: 'auto' | 'face' | 'center' | 'top' | 'left' | 'bottom' | 'right';
  blur?: number;
  grayscale?: boolean;
  progressive?: boolean;
}

/**
 * Build an optimized ImageKit URL with transformations.
 * Does NOT require any private keys — purely URL manipulation.
 */
export function buildImageKitUrl(
  url: string,
  transforms: ImageKitTransform = {}
): string {
  if (!url) return '';
  if (!url.includes('ik.imagekit.io')) return url;

  const params: string[] = [];

  if (transforms.width) params.push(`w-${transforms.width}`);
  if (transforms.height) params.push(`h-${transforms.height}`);
  if (transforms.quality) params.push(`q-${transforms.quality}`);
  if (transforms.format) params.push(`f-${transforms.format}`);
  if (transforms.crop) params.push(`c-${transforms.crop}`);
  if (transforms.focus) params.push(`fo-${transforms.focus}`);
  if (transforms.blur) params.push(`bl-${transforms.blur}`);
  if (transforms.grayscale) params.push('e-grayscale');
  if (transforms.progressive) params.push('pr-true');

  if (params.length === 0) return url;

  // Insert tr: params into the URL
  const baseUrl = url.split('?')[0];
  return `${baseUrl}?tr=${params.join(',')}`;
}

/**
 * Pre-built transform presets for common use cases.
 */
export const imagekitPresets = {
  productThumbnail: (url: string) => buildImageKitUrl(url, { width: 400, height: 400, crop: 'maintain_ratio', quality: 80, format: 'auto' }),
  productDetail: (url: string) => buildImageKitUrl(url, { width: 800, height: 800, crop: 'maintain_ratio', quality: 85, format: 'auto' }),
  productZoom: (url: string) => buildImageKitUrl(url, { width: 1200, height: 1200, crop: 'maintain_ratio', quality: 90, format: 'auto' }),
  heroBanner: (url: string) => buildImageKitUrl(url, { width: 1920, height: 800, crop: 'force', quality: 85, format: 'auto' }),
  categoryCard: (url: string) => buildImageKitUrl(url, { width: 600, height: 700, crop: 'force', focus: 'auto', quality: 80, format: 'auto' }),
  avatar: (url: string) => buildImageKitUrl(url, { width: 100, height: 100, crop: 'force', focus: 'face', format: 'auto' }),
  ogImage: (url: string) => buildImageKitUrl(url, { width: 1200, height: 630, crop: 'force', quality: 85, format: 'jpg' }),
  adminThumb: (url: string) => buildImageKitUrl(url, { width: 80, height: 80, crop: 'force', quality: 70, format: 'auto' }),
};

// ----------------------------------------------------------------
// TYPE: Upload auth response (from our API route)
// ----------------------------------------------------------------
export interface ImageKitAuthResponse {
  token: string;
  expire: number;
  signature: string;
  publicKey: string;
  urlEndpoint: string;
}

/**
 * Request upload authentication from our secure API route.
 * This keeps the private key server-side only.
 */
export async function getImageKitUploadAuth(): Promise<ImageKitAuthResponse> {
  const res = await fetch('/api/imagekit/auth');
  if (!res.ok) throw new Error('Failed to get ImageKit upload authentication');
  return res.json();
}

/**
 * Upload a file to ImageKit via our proxy API route.
 * Accepts a File object and optional folder path.
 */
export async function uploadToImageKit(
  file: File,
  folder: string = '/givora',
  fileName?: string
): Promise<{ url: string; fileId: string; filePath: string }> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);
  if (fileName) formData.append('fileName', fileName);

  const res = await fetch('/api/imagekit/upload', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Upload failed' }));
    throw new Error(error.message || 'Upload failed');
  }

  return res.json();
}

/**
 * Delete a file from ImageKit via our proxy API route.
 */
export async function deleteFromImageKit(fileId: string): Promise<void> {
  const res = await fetch('/api/imagekit/delete', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileId }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Delete failed' }));
    throw new Error(error.message || 'Delete failed');
  }
}
