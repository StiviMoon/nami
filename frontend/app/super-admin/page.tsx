'use client';

import { useAdminMetrics } from '@/hooks/admin/useAdminMetrics';
import { Store, Clock, CheckCircle2, XCircle, PauseCircle, Crown, Star } from 'lucide-react';
import Link from 'next/link';
import { PageTransition, StaggerContainer, StaggerItem, AnimatedNumber, FadeIn } from '@/components/motion';
import { Skeleton } from '@/components/ui/skeleton';

export default function SuperAdminDashboard() {
  const { data: metrics, isLoading } = useAdminMetrics();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 7 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
        </div>
      </div>
    );
  }

  if (!metrics) return null;

  const stats = [
    { label: 'Total', value: metrics.total, icon: Store, color: 'text-n-700 bg-n-100' },
    { label: 'Pendientes', value: metrics.pending, icon: Clock, color: 'text-amber-600 bg-amber-50', urgent: metrics.pending > 0 },
    { label: 'Activos', value: metrics.active, icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Rechazados', value: metrics.rejected, icon: XCircle, color: 'text-red-500 bg-red-50' },
    { label: 'Suspendidos', value: metrics.suspended, icon: PauseCircle, color: 'text-gray-500 bg-gray-100' },
    { label: 'Plan Gratis', value: metrics.byPlan.GRATIS, icon: Star, color: 'text-blue-500 bg-blue-50' },
    { label: 'Plan Pro', value: metrics.byPlan.PRO, icon: Crown, color: 'text-[#B088C9] bg-[#B088C9]/10' },
  ];

  return (
    <PageTransition>
      <div className="space-y-8">
        <FadeIn>
          <h1 className="text-3xl font-display font-bold text-n-900">Panel de Control</h1>
          <p className="text-n-500 mt-1">Vista general de la plataforma ÑAMI</p>
        </FadeIn>

        {/* Stats Grid */}
        <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <StaggerItem key={stat.label}>
              <div className={`bg-white rounded-2xl p-5 border ${stat.urgent ? 'border-amber-200 ring-1 ring-amber-100' : 'border-n-100'}`}>
                <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <p className="text-2xl font-display font-bold text-n-900">
                  <AnimatedNumber value={stat.value} />
                </p>
                <p className="text-sm text-n-400 mt-0.5">{stat.label}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Solicitudes recientes */}
        {metrics.recentSignups.length > 0 && (
          <FadeIn>
            <div className="bg-white rounded-2xl border border-n-100 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-n-100">
                <h2 className="font-display font-bold text-lg text-n-900">Solicitudes pendientes</h2>
                <Link
                  href="/super-admin/solicitudes"
                  className="text-sm font-semibold text-[#B088C9] hover:underline"
                >
                  Ver todas
                </Link>
              </div>
              <div className="divide-y divide-n-50">
                {metrics.recentSignups.map((r: { id: string; name: string; category: string; createdAt: string }) => (
                  <div key={r.id} className="flex items-center justify-between px-6 py-4">
                    <div>
                      <p className="font-semibold text-n-900">{r.name}</p>
                      <p className="text-sm text-n-400">{r.category}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600">
                        <Clock className="w-3 h-3" />
                        Pendiente
                      </span>
                      <p className="text-xs text-n-400 mt-1">
                        {new Date(r.createdAt).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        )}

        {metrics.recentSignups.length === 0 && (
          <FadeIn>
            <div className="bg-white rounded-2xl border border-n-100 p-12 text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <p className="font-display font-bold text-lg text-n-900">Todo al día</p>
              <p className="text-sm text-n-400 mt-1">No hay solicitudes pendientes de revisión</p>
            </div>
          </FadeIn>
        )}
      </div>
    </PageTransition>
  );
}
