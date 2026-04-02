import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const securityHeaders: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-DNS-Prefetch-Control': 'on',
};

const PROTECTED_ROUTES = ['/dashboard', '/pending', '/super-admin'];

export function middleware(request: NextRequest) {
  const res = NextResponse.next();

  for (const [key, value] of Object.entries(securityHeaders)) {
    res.headers.set(key, value);
  }

  // Protección de rutas: si no hay cookie token, redirigir a login
  const token = request.cookies.get('token')?.value;
  const pathname = request.nextUrl.pathname;

  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));
  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return res;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|_next/webpack-hmr|favicon.ico|icons/|sw.js|manifest.json).*)',
  ],
};
