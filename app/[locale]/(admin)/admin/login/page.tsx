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
      setError(isAr ? 'يرجى إدخال البريد الإلكتروني وكلمة المرور' : 'Please enter your email and password');
      setIsLoading(false);
      return;
    }

    try {
      // 1. Direct authentication with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
      const user = userCredential.user;

      // 2. Fetch freshly minted Firebase ID Token
      const idToken = await user.getIdToken(true);

      // 3. Verify administrator authorization with trusted server-side layer
      const sessionRes = await fetch('/api/admin/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      const sessionData = await sessionRes.json();

      if (!sessionRes.ok || !sessionData.success) {
        // Sign out from client immediately if user is not an authorized administrator
        await signOut(auth);

        if (sessionRes.status === 403 || sessionData.code === 'UNAUTHORIZED_NOT_ADMIN') {
          setError(
            isAr
              ? 'تم التحقق من بيانات حساب Firebase بنجاح، لكن هذا الحساب ليس لديه صلاحية مسؤول (Admin) للوصول للوحة التحكم. يرجى تفعيل حسابك كـ Super Admin أولاً.'
              : 'Authentication successful, but this Firebase account is not authorized as an administrator. Please authorize this account as Super Admin first.'
          );
        } else {
          setError(sessionData.error || (isAr ? 'فشل التحقق من صلاحيات الإدارة' : 'Failed to verify admin authorization'));
        }
        setIsLoading(false);
        return;
      }

      // 4. Authorized — redirect to Admin Dashboard
      const targetPath = redirectUrl || `/${locale}/admin`;
      router.push(targetPath);
      router.refresh();
    } catch (err: any) {
      console.error('Admin login error:', err);
      let friendlyError = isAr ? 'فشل تسجيل الدخول. يرجى التحقق من البيانات.' : 'Login failed. Please verify your credentials.';

      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        friendlyError = isAr
          ? 'بيانات الدخول غير صحيحة. يرجى التأكد من البريد الإلكتروني وكلمة المرور الخاصة بحساب Firebase.'
          : 'Invalid credentials. Please verify your Firebase account email and password.';
      } else if (err.code === 'auth/too-many-requests') {
        friendlyError = isAr
          ? 'تم حظر محاولات الدخول مؤقتاً لكثرة المحاولات الخاطئة. يرجى المحاولة بعد قليل.'
          : 'Too many unsuccessful attempts. Access temporarily blocked. Please try again later.';
      } else if (err.code === 'auth/user-disabled') {
        friendlyError = isAr
          ? 'هذا الحساب معطّل في Firebase Authentication.'
          : 'This account has been disabled in Firebase Authentication.';
      }

      setError(friendlyError);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] flex flex-col justify-center items-center px-4 py-12 relative">
      {/* Theme Switcher in top corner */}
      <div className="absolute top-6 end-6">
        <ThemeSwitcher />
      </div>

      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <GivoraLogo className="h-8 justify-center mb-3" />
          <h1
            className="text-2xl font-light tracking-wide text-[var(--text-main)]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {isAr ? 'لوحة الإدارة والتحكم' : 'Administration Portal'}
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            {isAr ? 'تسجيل دخول المشرفين المعتمدين عبر Firebase Authentication' : 'Authorized administrators via Firebase Authentication'}
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-sm p-8 shadow-sm">
          {error && (
            <div className="mb-6 p-3.5 rounded-sm bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex gap-2.5 items-start leading-relaxed">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label={isAr ? 'البريد الإلكتروني لحساب Firebase' : 'Firebase Account Email'}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={isAr ? 'admin@example.com' : 'admin@example.com'}
              leftElement={<Mail className="h-4 w-4" />}
              autoComplete="email"
              required
            />

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[var(--text-main)] block">
                {isAr ? 'كلمة المرور' : 'Password'}
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
                  className="absolute end-3 text-[var(--text-secondary)] hover:text-[var(--text-main)]"
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
              className="mt-6"
              rightIcon={<ArrowRight className="h-4 w-4 rtl:rotate-180" />}
            >
              {isAr ? 'تسجيل الدخول عبر Firebase' : 'Sign In via Firebase'}
            </Button>
          </form>

          {/* Security Notice */}
          <div className="mt-8 pt-6 border-t border-[var(--border-color)] text-center text-xs text-[var(--text-secondary)]">
            <p className="leading-relaxed">
              {isAr
                ? 'الدخول مخصص فقط لحسابات Firebase المسجلة مسبقاً والمصرح لها كمسؤولين.'
                : 'Access is restricted to pre-existing Firebase accounts authorized as administrators.'}
            </p>
          </div>
        </div>

        {/* Security Footer */}
        <div className="text-center mt-6 flex items-center justify-center gap-1.5 text-xs text-[var(--text-secondary)]">
          <ShieldCheck className="h-4 w-4 text-[var(--text-main)]" />
          <span>Givora Security System &bull; Firebase Authentication Protected</span>
        </div>
      </div>
    </div>
  );
}
