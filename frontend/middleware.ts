import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const securityHeaders: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-DNS-Prefetch-Control': 'on',
};

/**
 * Aplica cabeceras de seguridad solo a rutas de la app, no a `/_next/*` ni estáticos.
 * Si un chunk falla con 404, Next devuelve `text/plain`; mezclar eso con nosniff en la
 * misma respuesta hace que el mensaje del navegador sea el de “MIME type” en lugar del 404.
 */
export function middleware(request: NextRequest) {
  const res = NextResponse.next();
  for (const [key, value] of Object.entries(securityHeaders)) {
    res.headers.set(key, value);
  }
  return res;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|_next/webpack-hmr|favicon.ico|icons/|sw.js|manifest.json).*)',
  ],
};
