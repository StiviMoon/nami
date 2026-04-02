'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { queryKeys } from '@/lib/queryKeys';
import { History, ChevronLeft, ChevronRight } from 'lucide-react';
import { PageTransition, FadeIn } from '@/components/motion';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const ACTION_LABELS: Record<string, { label: string; color: string }> = {
  STATUS_CHANGE: { label: 'Cambio de status', color: 'bg-blue-50 text-blue-600' },
  PLAN_CHANGE: { label: 'Cambio de plan', color: 'bg-purple-50 text-[#B088C9]' },
  EDIT_RESTAURANT: { label: 'Edición de datos', color: 'bg-amber-50 text-amber-600' },
};

export default function LogsPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.admin.logs({ page }),
    queryFn: () => api.get(`/api/admin/logs?page=${page}`),
    select: (res) => res.data,
  });

  const logs = data?.logs || [];
  const totalPages = data?.totalPages || 1;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-16" />)}
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        <FadeIn>
          <h1 className="text-3xl font-display font-bold text-n-900">Actividad</h1>
          <p className="text-n-500 mt-1">Registro de todas las acciones administrativas</p>
        </FadeIn>

        {logs.length === 0 ? (
          <FadeIn>
            <div className="bg-white rounded-2xl border border-n-100 p-12 text-center">
              <History className="w-10 h-10 text-n-300 mx-auto mb-3" />
              <p className="font-display font-bold text-n-900">Sin actividad</p>
              <p className="text-sm text-n-400 mt-1">Aún no hay acciones registradas</p>
            </div>
          </FadeIn>
        ) : (
          <>
            <div className="bg-white rounded-2xl border border-n-100 overflow-hidden divide-y divide-n-50">
              {logs.map((log: Record<string, unknown>) => {
                const action = ACTION_LABELS[(log.action as string)] || { label: log.action as string, color: 'bg-n-100 text-n-600' };
                const meta = log.metadata as Record<string, unknown> | null;
                return (
                  <div key={log.id as string} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${action.color}`}>
                          {action.label}
                        </span>
                        {meta && typeof meta.from === 'string' && typeof meta.to === 'string' && (
                          <span className="text-xs text-n-500">
                            {meta.from} → {meta.to}
                          </span>
                        )}
                        {meta && typeof meta.plan === 'string' && (
                          <span className="text-xs text-n-500">→ {meta.plan}</span>
                        )}
                        {meta && Array.isArray(meta.fields) && (
                          <span className="text-xs text-n-400">
                            Campos: {(meta.fields as string[]).join(', ')}
                          </span>
                        )}
                      </div>
                      {meta && typeof meta.note === 'string' && (
                        <p className="text-xs text-n-400 mt-1 italic">&ldquo;{meta.note}&rdquo;</p>
                      )}
                    </div>
                    <span className="text-xs text-n-400 shrink-0">
                      {new Date(log.createdAt as string).toLocaleDateString('es-CO', {
                        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                      })}
                    </span>
                  </div>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <Button size="sm" variant="outline" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm text-n-500">{page} / {totalPages}</span>
                <Button size="sm" variant="outline" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </PageTransition>
  );
}
