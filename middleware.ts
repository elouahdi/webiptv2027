import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const COOKIE_NAME = 'cms_session';
const locales = ['fr', 'en', 'de', 'es'];

function getSecret() {
  const secret = process.env.CMS_AUTH_SECRET || 'dev-secret-change-in-production';
  return new TextEncoder().encode(secret);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Skip static assets, APIs, and meta files
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.') || // static files (e.g. image.png, favicon.ico)
    pathname === '/sitemap.ts' ||
    pathname === '/robots.ts' ||
    pathname === '/manifest.ts'
  ) {
    return NextResponse.next();
  }

  // 2. Admin auth routing
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }

    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
      await jwtVerify(token, getSecret());
      return NextResponse.next();
    } catch {
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.delete(COOKIE_NAME);
      return response;
    }
  }

  // 3. Locale routing logic
  // Check if pathname starts with any locale
  const segments = pathname.split('/');
  const localePrefix = segments[1];

  if (locales.includes(localePrefix)) {
    // If it's the default locale prefix 'fr', redirect to path without prefix
    if (localePrefix === 'fr') {
      const newPathname = pathname.replace(/^\/fr(\/|$)/, '/');
      const searchParams = request.nextUrl.search;
      return NextResponse.redirect(new URL(`${newPathname}${searchParams}`, request.url));
    }
    // If it's a non-default locale (en, de, es), serve as is
    return NextResponse.next();
  }

  // If there is no locale prefix, rewrite to /fr internally (e.g. /checkout -> /fr/checkout)
  const searchParams = request.nextUrl.search;
  return NextResponse.rewrite(new URL(`/fr${pathname}${searchParams}`, request.url));
}

export const config = {
  // Match all request paths except api, static files, etc.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
