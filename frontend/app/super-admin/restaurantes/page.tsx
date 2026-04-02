'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAdminRestaurants } from '@/hooks/admin/useAdminRestaurants';
import { Search, ChevronLeft, ChevronRight, Eye, CheckCircle2, Clock, XCircle, PauseCircle } from 'lucide-react';
import { PageTransition, FadeIn } from '@/components/motion';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useDebounce } from '@/hooks/useDebounce';

const STATUS_TABS = [
  { value: '', label: 'Todos' },
  { value: 'PENDING', label: 'Pendientes' },
  { value: 'ACTIVE', label: 'Activos' },
  { value: 'REJECTED', label: 'Rechazados' },
  { value: 'SUSPENDED', label: 'Suspendidos' },
];

const statusBadge: Record<string, { icon: typeof Clock; bg: string; text: string; label: string }> = {
  PENDING: { icon: Clock, bg: 'bg-amber-50', text: 'text-amber-600', label: 'Pendiente' },
  ACTIVE: { icon: CheckCircle2, bg: 'bg-emerald-50', text: 'text-emerald-600', label: 'Activo' },
  REJECTED: { icon: XCircle, bg: 'bg-red-50', text: 'text-red-500', label: 'Rechazado' },
  SUSPENDED: { icon: PauseCircle, bg: 'bg-gray-100', text: 'text-gray-500', label: 'Suspendido' },
};

export default function RestaurantesPage() {
  const [statusFilter, setStatusFilter] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const search = useDebounce(searchInput, 300);

  const { data, isLoading } = useAdminRestaurants({
    status: statusFilter || undefined,
    search: search || undefined,
    page,
  });

  const restaurants = data?.restaurants || [];
  const totalPages = data?.totalPages || 1;

  return (
    <PageTransition>
      <div className="space-y-6">
        <FadeIn>
          <h1 className="text-3xl font-display font-bold text-n-900">Restaurantes</h1>
          <p className="text-n-500 mt-1">Gestiona todos los restaurantes de la plataforma</p>
        </FadeIn>

        {/* Filtros */}
        <FadeIn>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-n-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => { setSearchInput(e.target.value); setPage(1); }}
                placeholder="Buscar por nombre o email..."
                className="w-full bg-white border border-n-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#B088C9]/20 focus:border-[#B088C9]"
              />
            </div>
            <div className="flex gap-1 overflow-x-auto pb-1">
              {STATUS_TABS.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => { setStatusFilter(tab.value); setPage(1); }}
                  className={`px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    statusFilter === tab.value
                      ? 'bg-[#B088C9] text-white'
                      : 'bg-white border border-n-200 text-n-600 hover:bg-n-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Lista */}
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-20" />)}
          </div>
        ) : restaurants.length === 0 ? (
          <FadeIn>
            <div className="bg-white rounded-2xl border border-n-100 p-12 text-center">
              <Search className="w-10 h-10 text-n-300 mx-auto mb-3" />
              <p className="font-display font-bold text-n-900">No se encontraron restaurantes</p>
              <p className="text-sm text-n-400 mt-1">Intenta con otros filtros</p>
            </div>
          </FadeIn>
        ) : (
          <div className="space-y-3">
            {restaurants.map((r: Record<string, unknown>) => {
              const badge = statusBadge[(r.status as string) || 'PENDING'];
              const BadgeIcon = badge.icon;
              return (
                <FadeIn key={r.id as string}>
                  <Link href={`/super-admin/restaurantes/${r.id}`}>
                    <div className="bg-white rounded-2xl border border-n-100 p-5 flex flex-col sm:flex-row sm:items-center gap-3 hover:border-[#B088C9]/30 transition-colors cursor-pointer">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-display font-bold text-n-900 truncate">{r.name as string}</h3>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${badge.bg} ${badge.text} shrink-0`}>
                            <BadgeIcon className="w-3 h-3" />
                            {badge.label}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            r.plan === 'PRO' ? 'bg-[#B088C9]/10 text-[#B088C9]' : 'bg-n-100 text-n-500'
                          }`}>
                            {r.plan as string}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-n-400">
                          <span>{r.category as string}</span>
                          <span>{(r.owner as Record<string, string>)?.email}</span>
                          <span>{new Date(r.createdAt as string).toLocaleDateString('es-CO')}</span>
                        </div>
                      </div>
                      <Eye className="w-5 h-5 text-n-300 shrink-0" />
                    </div>
                  </Link>
                </FadeIn>
              );
            })}

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <Button size="sm" variant="outline" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm text-n-500">{page} / {totalPages}</span>
                <Button size="sm" variant="outline" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
