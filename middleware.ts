import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware({
  locales: ['ar', 'en'],
  defaultLocale: 'ar',
  localePrefix: 'always',
});

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for API routes and static files
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Handle admin routes — protect all admin pages except /admin/login
  const isAdminRoute = pathname.startsWith('/ar/admin') || pathname.startsWith('/en/admin');
  const isLoginPage = pathname.includes('/admin/login');

  if (isAdminRoute && !isLoginPage) {
    const sessionCookie = request.cookies.get('givora_admin_session');
    if (!sessionCookie?.value) {
      const locale = pathname.startsWith('/en') ? 'en' : 'ar';
      const loginUrl = new URL(`/${locale}/admin/login`, request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Match all pathnames except static files
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};
