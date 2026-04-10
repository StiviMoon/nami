'use client';

import { useState } from 'react';
import { useAdminRestaurants } from '@/hooks/admin/useAdminRestaurants';
import { useAdminStatusChange } from '@/hooks/admin/useAdminActions';
import { CheckCircle2, XCircle, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { PageTransition, FadeIn } from '@/components/motion';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';

export default function SolicitudesPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminRestaurants({ status: 'PENDING', page });
  const statusMutation = useAdminStatusChange();

  // Modal de rechazo
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectNote, setRejectNote] = useState('');

  const handleApprove = (id: string) => {
    statusMutation.mutate({ id, status: 'ACTIVE' });
  };

  const handleReject = () => {
    if (!rejectId) return;
    statusMutation.mutate({ id: rejectId, status: 'REJECTED', note: rejectNote });
    setRejectId(null);
    setRejectNote('');
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-20" />)}
      </div>
    );
  }

  const restaurants = data?.restaurants || [];
  const totalPages = data?.totalPages || 1;

  return (
    <PageTransition>
      <div className="space-y-6">
        <FadeIn>
          <h1 className="text-3xl font-display font-bold text-n-900">Solicitudes</h1>
          <p className="text-n-500 mt-1">Restaurantes esperando aprobación</p>
        </FadeIn>

        {restaurants.length === 0 ? (
          <FadeIn>
            <div className="bg-white rounded-2xl border border-n-100 p-12 text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <p className="font-display font-bold text-lg text-n-900">Sin solicitudes pendientes</p>
              <p className="text-sm text-n-400 mt-1">Todas las solicitudes han sido procesadas</p>
            </div>
          </FadeIn>
        ) : (
          <div className="space-y-3">
            {restaurants.map((r: Record<string, unknown>) => (
              <FadeIn key={r.id as string}>
                <div className="bg-white rounded-2xl border border-n-100 p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-bold text-n-900 truncate">{r.name as string}</h3>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600 shrink-0">
                        <Clock className="w-3 h-3" />
                        Pendiente
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-n-400">
                      <span>{r.category as string}</span>
                      <span>{(r.owner as Record<string, string>)?.email}</span>
                      <span>{r.address as string}</span>
                      <span>{new Date(r.createdAt as string).toLocaleDateString('es-CO')}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      size="sm"
                      onClick={() => handleApprove(r.id as string)}
                      disabled={statusMutation.isPending}
                      className="gap-1.5 bg-emerald-500 hover:bg-emerald-600"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Aprobar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setRejectId(r.id as string)}
                      disabled={statusMutation.isPending}
                      className="gap-1.5 text-red-500 border-red-200 hover:bg-red-50"
                    >
                      <XCircle className="w-4 h-4" />
                      Rechazar
                    </Button>
                  </div>
                </div>
              </FadeIn>
            ))}

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <Button size="sm" variant="outline" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm text-n-500">
                  {page} / {totalPages}
                </span>
                <Button size="sm" variant="outline" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Modal de rechazo */}
        <AnimatePresence>
          {rejectId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex cursor-pointer items-center justify-center bg-black/50 px-4"
              onClick={() => setRejectId(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="font-display font-bold text-lg text-n-900 mb-4">Rechazar restaurante</h3>
                <textarea
                  value={rejectNote}
                  onChange={(e) => setRejectNote(e.target.value)}
                  placeholder="Motivo del rechazo (opcional)..."
                  className="w-full border border-n-200 rounded-xl px-4 py-3 text-sm resize-none h-28 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300"
                />
                <div className="flex gap-3 mt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => { setRejectId(null); setRejectNote(''); }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    className="flex-1 bg-red-500 hover:bg-red-600"
                    onClick={handleReject}
                    isLoading={statusMutation.isPending}
                  >
                    Confirmar rechazo
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
