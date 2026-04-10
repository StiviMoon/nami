'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Clock, XCircle, PauseCircle, LogOut, MessageCircle } from 'lucide-react';
import { PageTransition } from '@/components/motion';
import { Button } from '@/components/ui/button';
import { useMe } from '@/hooks/useRestaurantStatus';
import { useRealtimeRestaurant } from '@/hooks/useRealtimeRestaurant';
import { useQueryClient } from '@tanstack/react-query';
import { clearTokenCookie } from '@/lib/session-cookie';

export default function PendingPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data, isLoading } = useMe();

  const [status, setStatus] = useState<string | null>(null);
  const [rejectionNote, setRejectionNote] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !data) {
      router.push('/login');
    }
  }, [isLoading, data, router]);

  useEffect(() => {
    if (!data) return;

    // Si es admin, redirigir al panel
    if (data.user.role === 'ADMIN') {
      router.push('/super-admin');
      return;
    }

    const rs = data.restaurant?.status;
    if (rs === 'ACTIVE') {
      router.push('/dashboard');
      return;
    }

    setStatus(rs || null);
    setRejectionNote(data.restaurant?.rejectionNote || null);
  }, [data, router]);

  // Realtime: detectar cuando aprueban el restaurante
  const handleRealtimeUpdate = useCallback(
    (payload: Record<string, unknown>) => {
      const newStatus = payload.status as string;
      if (newStatus === 'ACTIVE') {
        queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
        router.push('/dashboard/bienvenida');
      } else {
        setStatus(newStatus);
        setRejectionNote((payload.rejection_note as string) || null);
      }
    },
    [queryClient, router],
  );

  useRealtimeRestaurant(data?.restaurant?.id, handleRealtimeUpdate);

  const handleLogout = () => {
    clearTokenCookie();
    router.push('/login');
  };

  if (isLoading || !status) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-n-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <PageTransition>
      <main className="min-h-screen flex items-center justify-center bg-n-50 px-4 py-12 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full -translate-y-1/3 -translate-x-1/3" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-accent/5 rounded-full translate-y-1/4 translate-x-1/4" />

        <div className="w-full max-w-md relative z-10">
          <div className="text-center mb-8">
            <span className="text-3xl font-display font-bold text-primary">ÑAMI</span>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-n-100 text-center">
            {/* PENDING */}
            {status === 'PENDING' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-5"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto"
                >
                  <Clock className="w-10 h-10 text-primary" />
                </motion.div>

                <div>
                  <h1 className="text-2xl font-display font-bold text-n-900">
                    Tu solicitud está en revisión
                  </h1>
                  <p className="text-n-500 mt-2 text-sm leading-relaxed">
                    Nuestro equipo revisará tu restaurante y te notificaremos cuando
                    sea aprobado. Esto suele tomar menos de 24 horas.
                  </p>
                </div>

                {data?.restaurant?.name && (
                  <div className="bg-n-50 rounded-xl p-4">
                    <p className="text-xs text-n-400 uppercase tracking-widest font-bold mb-1">Restaurante</p>
                    <p className="font-display font-bold text-n-900">{data.restaurant.name}</p>
                  </div>
                )}

                <div className="flex items-center justify-center gap-2 text-xs text-n-400">
                  <motion.div
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-2 h-2 rounded-full bg-primary"
                  />
                  Escuchando actualizaciones en tiempo real
                </div>
              </motion.div>
            )}

            {/* REJECTED */}
            {status === 'REJECTED' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-5"
              >
                <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto">
                  <XCircle className="w-10 h-10 text-red-500" />
                </div>

                <div>
                  <h1 className="text-2xl font-display font-bold text-n-900">
                    Tu solicitud fue rechazada
                  </h1>
                  <p className="text-n-500 mt-2 text-sm leading-relaxed">
                    Lamentamos informarte que tu solicitud no fue aprobada en esta ocasión.
                  </p>
                </div>

                {rejectionNote && (
                  <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-left">
                    <p className="text-xs text-red-400 uppercase tracking-widest font-bold mb-1">Motivo</p>
                    <p className="text-sm text-red-700">{rejectionNote}</p>
                  </div>
                )}

                <a
                  href="https://wa.me/573000000000?text=Hola,%20mi%20solicitud%20fue%20rechazada%20en%20ÑAMI"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="w-full gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Contactar soporte
                  </Button>
                </a>
              </motion.div>
            )}

            {/* SUSPENDED */}
            {status === 'SUSPENDED' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-5"
              >
                <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center mx-auto">
                  <PauseCircle className="w-10 h-10 text-amber-500" />
                </div>

                <div>
                  <h1 className="text-2xl font-display font-bold text-n-900">
                    Tu cuenta está suspendida
                  </h1>
                  <p className="text-n-500 mt-2 text-sm leading-relaxed">
                    Tu cuenta ha sido temporalmente suspendida. Si crees que es un error,
                    contacta a nuestro equipo de soporte.
                  </p>
                </div>

                <a
                  href="https://wa.me/573000000000?text=Hola,%20mi%20cuenta%20está%20suspendida%20en%20ÑAMI"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="w-full gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Contactar soporte
                  </Button>
                </a>
              </motion.div>
            )}

            <div className="mt-6 pt-5 border-t border-n-100">
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 text-sm text-n-400 hover:text-red-500 transition-colors mx-auto cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </main>
    </PageTransition>
  );
}
