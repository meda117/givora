// ============================================================
// GIVORA — UTILITY FUNCTIONS (EGYPTIAN LOCALIZATION)
// ============================================================

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Locale, LocalizedString } from '@/types';

// ----------------------------------------------------------------
// Tailwind class merger
// ----------------------------------------------------------------
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ----------------------------------------------------------------
// Localization helpers
// ----------------------------------------------------------------

/**
 * Get the localized value from a LocalizedString.
 * Falls back to the other language if the requested one is empty.
 */
export function t(ls: LocalizedString | undefined, locale: Locale): string {
  if (!ls) return '';
  return ls[locale] || ls[locale === 'ar' ? 'en' : 'ar'] || '';
}

/**
 * Get locale-aware slug from a LocalizedString slug.
 */
export function getSlug(ls: LocalizedString | undefined, locale: Locale): string {
  return t(ls, locale);
}

// ----------------------------------------------------------------
// Price formatting (Egyptian Pound EGP / ج.م)
// ----------------------------------------------------------------
export function formatPrice(
  amount: number,
  currency: string = 'EGP',
  locale: Locale = 'ar'
): string {
  const rounded = Math.round(amount);
  if (locale === 'ar') {
    return `${rounded.toLocaleString('ar-EG')} ج.م`;
  }
  return `${rounded.toLocaleString('en-US')} EGP`;
}

// ----------------------------------------------------------------
// Discount calculation
// ----------------------------------------------------------------
export function calculateDiscount(original: number, discounted: number): number {
  if (!original || !discounted || discounted >= original) return 0;
  return Math.round(((original - discounted) / original) * 100);
}

// ----------------------------------------------------------------
// String helpers
// ----------------------------------------------------------------
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

// ----------------------------------------------------------------
// Date formatting (Egyptian locale)
// ----------------------------------------------------------------
export function formatDate(date: string | Date, locale: Locale = 'ar'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const intlLocale = locale === 'ar' ? 'ar-EG' : 'en-US';

  return new Intl.DateTimeFormat(intlLocale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

export function formatDateTime(date: string | Date, locale: Locale = 'ar'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const intlLocale = locale === 'ar' ? 'ar-EG' : 'en-US';

  return new Intl.DateTimeFormat(intlLocale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

// ----------------------------------------------------------------
// Order number generator
// ----------------------------------------------------------------
export function generateOrderNumber(): string {
  const prefix = 'GIV';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

// ----------------------------------------------------------------
// Validation helpers
// ----------------------------------------------------------------
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidEgyptianPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  // Matches 010, 011, 012, 015 with 8 more digits, optional +20 / 0020
  return /^((\+20|0020|20)?1[0125][0-9]{8}|01[0125][0-9]{8})$/.test(cleaned);
}

export function isValidPhone(phone: string): boolean {
  return isValidEgyptianPhone(phone) || /^\+?[\d\s\-().]{7,20}$/.test(phone);
}

// ----------------------------------------------------------------
// File helpers
// ----------------------------------------------------------------
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

export function isImageFile(filename: string): boolean {
  const ext = getFileExtension(filename);
  return ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg', 'avif'].includes(ext);
}

export function isVideoFile(filename: string): boolean {
  const ext = getFileExtension(filename);
  return ['mp4', 'webm', 'mov', 'avi'].includes(ext);
}
