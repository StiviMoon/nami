'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { LayoutDashboard, UtensilsCrossed, User, QrCode, LogOut, ExternalLink, Store } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';
import { clearTokenCookie } from '@/lib/session-cookie';

const navItems = [
  { href: '/dashboard', label: 'Inicio', icon: LayoutDashboard },
  { href: '/dashboard/menu', label: 'Menú', icon: UtensilsCrossed },
  { href: '/dashboard/perfil', label: 'Perfil', icon: User },
  { href: '/dashboard/qr', label: 'QR', icon: QrCode },
];

const pathTitles: Record<string, string> = {
  '/dashboard': 'Inicio',
  '/dashboard/menu': 'Menú',
  '/dashboard/perfil': 'Perfil',
  '/dashboard/qr': 'Código QR',
  '/dashboard/bienvenida': 'Bienvenida',
};

/** Altura de la franja interna del header (sin safe-area). Debe coincidir con la clase h-14 del row interior. */
const HEADER_INNER_PX = '3.5rem';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [statusChecked, setStatusChecked] = useState(false);

  const pageTitle = useMemo(() => pathTitles[pathname] ?? 'Dashboard', [pathname]);

  useEffect(() => {
    // Verificar sesión y status del restaurante vía cookie httpOnly
    api.get('/api/auth/me').then((res) => {
      const role = res.data?.user?.role;
      const status = res.data?.restaurant?.status;

      if (role === 'ADMIN') {
        router.push('/super-admin');
      } else if (status && status !== 'ACTIVE') {
        router.push('/pending');
      } else {
        setStatusChecked(true);
      }
    }).catch(() => {
      router.push('/login');
    });
  }, [router]);

  const handleLogout = () => {
    clearTokenCookie();
    router.push('/login');
  };

  if (!statusChecked) return null;

  return (
    <div className="h-svh min-h-0 overflow-hidden bg-n-50">
      {/* Sidebar — fija al viewport, fuera del scroll del contenido */}
      <aside
        className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-n-900 md:flex"
        aria-label="Navegación principal"
      >
        <div
          className="border-b border-n-800 px-6 pb-5"
          style={{ paddingTop: 'max(1.5rem, var(--safe-top))' }}
        >
          <Link href="/" className="font-display text-2xl font-black tracking-tighter text-primary leading-none">
            ÑAMI
          </Link>
          <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-n-500">Mi restaurante</p>
        </div>
        <nav className="flex flex-1 flex-col space-y-0.5 overflow-y-auto px-3 py-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all',
                  isActive ? 'text-white' : 'text-n-400 hover:bg-n-800 hover:text-n-100'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-xl bg-primary/20 border border-primary/30"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <item.icon className={cn('relative z-10 h-4.5 w-4.5', isActive && 'text-primary')} />
                <span className="relative z-10">{item.label}</span>
                {isActive && (
                  <span className="relative z-10 ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-n-800 p-3 space-y-0.5">
          <Link
            href="/feed"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-n-500 hover:bg-n-800 hover:text-n-100 transition-all"
          >
            <ExternalLink className="h-4.5 w-4.5" />
            Ver mi página
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="cursor-pointer flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-n-500 hover:bg-red-950 hover:text-red-400 transition-all"
          >
            <LogOut className="h-4.5 w-4.5" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Top bar — fija al viewport; en desktop empieza a la derecha del sidebar */}
      <header
        className="fixed left-0 right-0 top-0 z-40 border-b border-n-100 bg-white/95 backdrop-blur-md md:left-64"
        style={{ paddingTop: 'var(--safe-top)' }}
      >
        <div className="flex h-14 shrink-0 items-center justify-between gap-3 px-4 md:px-6">
          <div className="flex min-w-0 items-center gap-2 md:gap-3">
            {/* Logo solo en mobile */}
            <div className="flex items-center gap-2 md:hidden">
              <div className="w-7 h-7 rounded-lg bg-n-900 flex items-center justify-center">
                <Store className="h-4 w-4 text-primary" />
              </div>
            </div>
            <p className="truncate text-base font-semibold text-n-900 md:text-lg">{pageTitle}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/feed"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold text-n-500 hover:bg-n-100 hover:text-n-700 transition-all uppercase tracking-wide"
            >
              <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              Mi página
            </Link>
          </div>
        </div>
      </header>

      {/* Contenido: única zona con scroll, inset según chrome fijo */}
      <main
        className="fixed inset-x-0 bottom-[calc(4.25rem+var(--safe-bottom))] overflow-y-auto overflow-x-hidden overscroll-y-contain bg-n-50 md:bottom-0 md:left-64"
        style={{
          top: `calc(var(--safe-top) + ${HEADER_INNER_PX})`,
        }}
        id="dashboard-main-scroll"
      >
        <div className="mx-auto max-w-5xl p-6 md:p-10">{children}</div>
      </main>

      {/* Bottom nav — fija al viewport (solo móvil) */}
      <nav
        className="fixed inset-x-0 bottom-0 z-50 bg-n-900 md:hidden"
        style={{ paddingBottom: 'var(--safe-bottom)' }}
        aria-label="Navegación inferior"
      >
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex flex-col items-center gap-1 px-3 py-2"
              >
                {isActive && (
                  <motion.div
                    layoutId="bottomnav-active"
                    className="absolute -top-0.5 h-1 w-8 rounded-full bg-primary"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <item.icon
                  className={cn(
                    'h-5 w-5 transition-colors',
                    isActive ? 'text-primary' : 'text-n-600'
                  )}
                />
                <span
                  className={cn(
                    'text-[10px] font-semibold transition-colors',
                    isActive ? 'text-primary' : 'text-n-600'
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
