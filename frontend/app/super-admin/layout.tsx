'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { BarChart3, ClipboardList, Store, History, LogOut, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';
import { clearTokenCookie } from '@/lib/session-cookie';
import { supabase } from '@/lib/supabase';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/toast';

const navItems = [
  { href: '/super-admin', label: 'Métricas', icon: BarChart3 },
  { href: '/super-admin/solicitudes', label: 'Solicitudes', icon: ClipboardList },
  { href: '/super-admin/restaurantes', label: 'Restaurantes', icon: Store },
  { href: '/super-admin/logs', label: 'Actividad', icon: History },
];

const pathTitles: Record<string, string> = {
  '/super-admin': 'Métricas',
  '/super-admin/solicitudes': 'Solicitudes',
  '/super-admin/restaurantes': 'Restaurantes',
  '/super-admin/logs': 'Actividad',
};

const HEADER_INNER_PX = '3.5rem';

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [ready, setReady] = useState(false);

  const pageTitle = pathTitles[pathname] ?? 'Super Admin';

  useEffect(() => {
    const t = localStorage.getItem('token');
    if (!t) {
      router.push('/login');
      return;
    }

    api.get('/api/auth/me').then((res) => {
      if (res.data?.user?.role !== 'ADMIN') {
        router.push('/dashboard');
      } else {
        setReady(true);
      }
    }).catch(() => {
      router.push('/login');
    });
  }, [router]);

  // Realtime: nuevos registros de restaurantes
  useEffect(() => {
    if (!ready) return;

    const channel = supabase
      .channel('admin:new-requests')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'restaurants',
      }, (payload) => {
        const name = (payload.new as Record<string, unknown>).name as string;
        toast(`Nuevo restaurante: ${name}`, 'info');
        queryClient.invalidateQueries({ queryKey: ['admin'] });
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'restaurants',
      }, () => {
        queryClient.invalidateQueries({ queryKey: ['admin'] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [ready, queryClient]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    clearTokenCookie();
    router.push('/login');
  }, [router]);

  if (!ready) return null;

  return (
    <div className="h-svh min-h-0 overflow-hidden bg-n-50">
      {/* Sidebar */}
      <aside
        className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-n-100 bg-white md:flex"
        aria-label="Navegación admin"
      >
        <div
          className="border-b border-n-100 p-6"
          style={{ paddingTop: 'max(1.5rem, var(--safe-top))' }}
        >
          <Link href="/super-admin" className="font-display text-2xl font-bold text-[#B088C9]">
            ÑAMI
          </Link>
          <p className="mt-1 text-xs text-n-400">Super Admin</p>
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
                  isActive ? 'text-[#B088C9]' : 'text-n-600 hover:bg-n-50 hover:text-n-900',
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="admin-sidebar-active"
                    className="absolute inset-0 rounded-xl bg-[#B088C9]/10"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <item.icon className="relative z-10 h-5 w-5" />
                <span className="relative z-10">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-n-100 p-3 space-y-1">
          <Link
            href="/feed"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-n-500 hover:bg-n-50 transition-colors"
          >
            <ExternalLink className="h-5 w-5" />
            Ver feed público
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-500 transition-colors hover:bg-red-50 cursor-pointer"
          >
            <LogOut className="h-5 w-5" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Top bar */}
      <header
        className="fixed left-0 right-0 top-0 z-40 border-b border-n-100 bg-white/95 backdrop-blur-md md:left-64"
        style={{ paddingTop: 'var(--safe-top)' }}
      >
        <div className="flex h-14 shrink-0 items-center justify-between gap-3 px-4 md:px-6">
          <div className="flex min-w-0 items-center gap-2 md:gap-3">
            <Link href="/super-admin" className="font-display text-lg font-bold text-[#B088C9] md:hidden">
              ÑAMI
            </Link>
            <span className="text-n-300 md:hidden" aria-hidden>|</span>
            <p className="truncate text-base font-semibold text-n-900 md:text-lg">{pageTitle}</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main
        className="fixed inset-x-0 bottom-0 overflow-y-auto overflow-x-hidden overscroll-y-contain bg-n-50 md:left-64"
        style={{ top: `calc(var(--safe-top) + ${HEADER_INNER_PX})` }}
      >
        <div className="mx-auto max-w-6xl p-6 md:p-10">{children}</div>
      </main>

      {/* Bottom nav — mobile */}
      <nav
        className="fixed inset-x-0 bottom-0 z-50 border-t border-n-100 bg-white md:hidden"
        style={{ paddingBottom: 'var(--safe-bottom)' }}
        aria-label="Navegación inferior admin"
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
                    layoutId="admin-bottomnav-active"
                    className="absolute -top-0.5 h-1 w-8 rounded-full bg-[#B088C9]"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <item.icon
                  className={cn('h-5 w-5 transition-colors', isActive ? 'text-[#B088C9]' : 'text-n-400')}
                />
                <span
                  className={cn('text-[10px] font-medium transition-colors', isActive ? 'text-[#B088C9]' : 'text-n-400')}
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
