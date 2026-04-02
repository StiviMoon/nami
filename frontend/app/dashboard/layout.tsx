'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { LayoutDashboard, UtensilsCrossed, User, QrCode, LogOut, ExternalLink } from 'lucide-react';
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
  const [token, setToken] = useState<string | null>(null);
  const [statusChecked, setStatusChecked] = useState(false);

  const pageTitle = useMemo(() => pathTitles[pathname] ?? 'Dashboard', [pathname]);

  useEffect(() => {
    const t = localStorage.getItem('token');
    if (!t) {
      router.push('/login');
      return;
    }
    setToken(t);

    // Verificar status del restaurante
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
      setStatusChecked(true);
    });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    clearTokenCookie();
    router.push('/login');
  };

  if (!token || !statusChecked) return null;

  return (
    <div className="h-svh min-h-0 overflow-hidden bg-n-50">
      {/* Sidebar — fija al viewport, fuera del scroll del contenido */}
      <aside
        className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-n-100 bg-white md:flex"
        aria-label="Navegación principal"
      >
        <div
          className="border-b border-n-100 p-6"
          style={{ paddingTop: 'max(1.5rem, var(--safe-top))' }}
        >
          <Link href="/" className="font-display text-2xl font-bold text-primary">
            ÑAMI
          </Link>
          <p className="mt-1 text-xs text-n-400">Dashboard</p>
        </div>
        <nav className="flex flex-1 flex-col space-y-1 overflow-y-auto px-3 py-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors',
                  isActive ? 'text-primary' : 'text-n-600 hover:bg-n-50 hover:text-n-900'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-xl bg-primary/10"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <item.icon className="relative z-10 h-5 w-5" />
                <span className="relative z-10">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-n-100 p-3">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-500 transition-colors hover:bg-red-50"
          >
            <LogOut className="h-5 w-5" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Top bar — fija al viewport; en desktop empieza a la derecha del sidebar */}
      <header
        className="fixed left-0 right-0 top-0 z-40 border-b border-n-100 bg-white/95 backdrop-blur-md supports-backdrop-filter:bg-white/80 md:left-64"
        style={{ paddingTop: 'var(--safe-top)' }}
      >
        <div className="flex h-14 shrink-0 items-center justify-between gap-3 px-4 md:px-6">
          <div className="flex min-w-0 items-center gap-2 md:gap-3">
            <Link href="/" className="font-display text-lg font-bold text-primary md:hidden">
              ÑAMI
            </Link>
            <span className="text-n-300 md:hidden" aria-hidden>
              |
            </span>
            <p className="truncate text-base font-semibold text-n-900 md:text-lg">{pageTitle}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/feed"
              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-primary hover:bg-primary/10 md:px-3"
            >
              <span className="hidden sm:inline">Ver feed</span>
              <span className="sm:hidden">Feed</span>
              <ExternalLink className="h-3.5 w-3.5 opacity-80" aria-hidden />
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
        className="fixed inset-x-0 bottom-0 z-50 border-t border-n-100 bg-white md:hidden"
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
                    isActive ? 'text-primary' : 'text-n-400'
                  )}
                />
                <span
                  className={cn(
                    'text-[10px] font-medium transition-colors',
                    isActive ? 'text-primary' : 'text-n-400'
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
