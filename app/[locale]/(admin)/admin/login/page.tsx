'use client';
import { useState, use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldCheck, Lock, Mail, ArrowRight, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import { GivoraLogo } from '@/components/shared/givora-logo';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ThemeSwitcher } from '@/components/shared/theme-switcher';
import type { Locale } from '@/types';

export default function AdminLoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAr = locale === 'ar';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      setError(isAr ? 'يرجى إدخال البريد الإلكتروني ورمز المرور السري' : 'Please enter your authorized email and passcode');
      setIsLoading(false);
      return;
    }

    try {
      // 1. Authenticate with secure authentication service
      const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
      const user = userCredential.user;

      // 2. Fetch authenticated security token
      const idToken = await user.getIdToken(true);

      // 3. Verify administrative authorization with server-side security layer
      const sessionRes = await fetch('/api/admin/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      const sessionData = await sessionRes.json();

      if (!sessionRes.ok || !sessionData.success) {
        // Sign out immediately if not authorized as an administrator
        await signOut(auth);

        if (sessionRes.status === 403 || sessionData.code === 'UNAUTHORIZED_NOT_ADMIN') {
          setError(
            isAr
              ? 'تم التحقق من بيانات الحساب بنجاح، ولكن هذا الحساب لا يمتلك تصريح دخول إداري. يرجى التواصل مع الإدارة المركزية لمنحك صلاحيات المسؤول.'
              : 'Authentication verified, but this account does not have administrative clearance. Please contact executive administration for access.'
          );
        } else {
          setError(sessionData.error || (isAr ? 'فشل التحقق من التصريح الإداري' : 'Administrative clearance check failed'));
        }
        setIsLoading(false);
        return;
      }

      // 4. Authorized — redirect to Management Dashboard
      const targetPath = redirectUrl || `/${locale}/admin`;
      router.push(targetPath);
      router.refresh();
    } catch (err: any) {
      console.error('Admin authentication error:', err);
      let friendlyError = isAr ? 'بيانات الاعتماد غير صحيحة. يرجى إعادة المحاولة.' : 'Invalid credentials. Please verify your details.';

      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        friendlyError = isAr
          ? 'بيانات الدخول غير صحيحة. يرجى التأكد من البريد الإلكتروني ورمز المرور السري.'
          : 'Invalid credentials. Please verify your authorized email and security passcode.';
      } else if (err.code === 'auth/too-many-requests') {
        friendlyError = isAr
          ? 'تم تعليق محاولات الدخول مؤقتاً لحماية أمان النظام. يرجى المحاولة بعد قليل.'
          : 'Access temporarily suspended due to multiple failed attempts. Please try again later.';
      } else if (err.code === 'auth/user-disabled') {
        friendlyError = isAr
          ? 'تم إيقاف هذا الحساب الإداري. يرجى التواصل مع الإدارة العليا.'
          : 'This administrative account has been deactivated.';
      }

      setError(friendlyError);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] flex flex-col justify-between items-center px-4 py-8 sm:py-12 relative overflow-hidden select-none">
      {/* Subtle ambient luxury background grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#80808012_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-50" />

      {/* Top Header Bar */}
      <div className="w-full max-w-5xl flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-mono tracking-wider text-[var(--text-muted)] uppercase">
            SECURE TERMINAL &bull; V2.0
          </span>
        </div>
        <ThemeSwitcher />
      </div>

      {/* Central Login Card */}
      <div className="w-full max-w-md my-auto z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <GivoraLogo className="h-9 justify-center mb-4 tracking-[0.25em]" />
          <div className="inline-block px-3 py-1 rounded-full border border-[var(--border-color)] bg-[var(--bg-secondary)] mb-3">
            <span className="text-[10px] font-mono tracking-widest text-[var(--text-muted)] uppercase">
              {isAr ? 'بوابة الإدارة المركزية الفاخرة' : 'EXECUTIVE MANAGEMENT PORTAL'}
            </span>
          </div>
          <h1
            className="text-2xl sm:text-3xl font-light tracking-wide text-[var(--text-main)]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {isAr ? 'تسجيل دخول المشرفين' : 'Administrative Sign In'}
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1.5 max-w-xs mx-auto leading-relaxed">
            {isAr
              ? 'الوصول مقصور حصراً على الحسابات المصرح لها بإدارة المتجر والطلبات.'
              : 'Authorized personnel only. All access attempts are cryptographically verified and logged.'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-sm p-7 sm:p-9 shadow-2xl backdrop-blur-md transition-all duration-200">
          {error && (
            <div className="mb-6 p-3.5 rounded-sm bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex gap-2.5 items-start leading-relaxed">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <Input
              label={isAr ? 'البريد الإلكتروني المعتمد' : 'Authorized Email Address'}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={isAr ? 'name@givora.com' : 'name@givora.com'}
              leftElement={<Mail className="h-4 w-4" />}
              autoComplete="email"
              required
            />

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[var(--text-main)] block">
                {isAr ? 'رمز المرور السري' : 'Security Passcode'}
              </label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  className="w-full h-11 rounded-sm border border-[var(--border-color)] bg-[var(--bg-main)] text-[var(--text-main)] text-sm ps-3.5 pe-10 focus:outline-none focus:ring-1 focus:ring-[var(--text-main)]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute end-3 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              isLoading={isLoading}
              fullWidth
              size="lg"
              className="mt-6 font-medium tracking-wide active:scale-[0.99] transition-transform"
              rightIcon={<ArrowRight className="h-4 w-4 rtl:rotate-180" />}
            >
              {isAr ? 'الدخول إلى النظام الإداري' : 'Enter Management Portal'}
            </Button>
          </form>

          {/* Security Assurance */}
          <div className="mt-8 pt-6 border-t border-[var(--border-color)] text-center text-[11px] text-[var(--text-muted)] space-y-1">
            <div className="flex items-center justify-center gap-1.5 font-medium text-[var(--text-main)]">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>{isAr ? 'نظام أمان جيفورا المشفر' : 'Givora Encrypted Security Protocol'}</span>
            </div>
            <p className="text-[10px] text-[var(--text-muted)]">
              {isAr ? 'جميع العمليات الإدارية مشفرة ومحمية ببروتوكول SSL/TLS 256-bit' : '256-bit End-to-End Encrypted Session'}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <footer className="text-center text-[11px] text-[var(--text-muted)] font-mono z-10 pt-4">
        &copy; {new Date().getFullYear()} GIVORA LUXURY GROUP &bull; ALL RIGHTS RESERVED
      </footer>
    </div>
  );
}
