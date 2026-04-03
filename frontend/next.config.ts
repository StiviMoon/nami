import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Segment explorer del DevTools (true por defecto en Next 15.5) puede romper el
  // bundler en dev con errores tipo "SegmentViewNode" / React Client Manifest (p. ej. con Cursor).
  experimental: {
    devtoolSegmentExplorer: false,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
    ],
  },
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
          { key: 'Service-Worker-Allowed', value: '/' },
        ],
      },
      {
        source: '/manifest.json',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=3600, must-revalidate' }],
      },
      // Cabeceras de seguridad para páginas: ver middleware.ts (excluye /_next/static).
    ];
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001'}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
