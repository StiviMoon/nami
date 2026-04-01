import type { Metadata, Viewport } from 'next';
import { Sora, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ÑAMI — Descubre restaurantes locales',
  description: 'Feed de comida local en Yumbo. Pide directo por WhatsApp. Sin comisiones.',
  manifest: '/manifest.json',
  applicationName: 'ÑAMI',
  icons: {
    icon: '/favicon.svg',
    apple: '/icons/icon-192.svg',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'ÑAMI',
  },
};

export const viewport: Viewport = {
  themeColor: '#FF7A00',
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${sora.variable} ${jakarta.variable}`}>
      <body className="min-h-screen min-w-0 bg-white antialiased overflow-x-hidden">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
