'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAdminRestaurant } from '@/hooks/admin/useAdminRestaurants';
import { useAdminStatusChange, useAdminEditRestaurant, useAdminChangePlan } from '@/hooks/admin/useAdminActions';
import {
  ArrowLeft, CheckCircle2, XCircle, PauseCircle, Clock,
  MapPin, Phone, Mail, Tag, Calendar, Eye, ShoppingBag,
  FolderOpen, ChefHat, Crown, AlertTriangle,
} from 'lucide-react';
import { PageTransition, FadeIn } from '@/components/motion';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';

const statusConfig: Record<string, { icon: typeof Clock; color: string; bg: string; label: string }> = {
  PENDING: { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200', label: 'Pendiente' },
  ACTIVE: { icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200', label: 'Activo' },
  REJECTED: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-50 border-red-200', label: 'Rechazado' },
  SUSPENDED: { icon: PauseCircle, color: 'text-gray-500', bg: 'bg-gray-100 border-gray-200', label: 'Suspendido' },
};

export default function RestaurantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: restaurant, isLoading } = useAdminRestaurant(id);
  const statusMutation = useAdminStatusChange();
  const editMutation = useAdminEditRestaurant();
  const planMutation = useAdminChangePlan();

  const [showReject, setShowReject] = useState(false);
  const [rejectNote, setRejectNote] = useState('');
  const [showSuspend, setShowSuspend] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState<Record<string, string>>({});

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-48" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!restaurant) return null;

  const status = statusConfig[restaurant.status] || statusConfig.PENDING;
  const StatusIcon = status.icon;

  const handleApprove = () => statusMutation.mutate({ id, status: 'ACTIVE' });
  const handleReject = () => {
    statusMutation.mutate({ id, status: 'REJECTED', note: rejectNote });
    setShowReject(false);
    setRejectNote('');
  };
  const handleSuspend = () => {
    statusMutation.mutate({ id, status: 'SUSPENDED' });
    setShowSuspend(false);
  };
  const handleReactivate = () => statusMutation.mutate({ id, status: 'ACTIVE' });

  const startEdit = () => {
    setEditForm({
      name: restaurant.name || '',
      address: restaurant.address || '',
      whatsapp: restaurant.whatsapp || '',
      category: restaurant.category || '',
    });
    setEditMode(true);
  };

  const saveEdit = () => {
    editMutation.mutate({ id, data: editForm });
    setEditMode(false);
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Back + Header */}
        <FadeIn>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-sm text-n-500 hover:text-n-900 transition-colors mb-4 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-display font-bold text-n-900 truncate">{restaurant.name}</h1>
              <p className="text-n-400 text-sm mt-1">/{restaurant.slug}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${status.bg} ${status.color}`}>
                <StatusIcon className="w-3.5 h-3.5" />
                {status.label}
              </span>
              <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                restaurant.plan === 'PRO' ? 'bg-[#B088C9]/10 text-[#B088C9]' : 'bg-n-100 text-n-500'
              }`}>
                {restaurant.plan}
              </span>
            </div>
          </div>
        </FadeIn>

        {/* Acciones según status */}
        <FadeIn>
          <div className="flex flex-wrap gap-2">
            {restaurant.status === 'PENDING' && (
              <>
                <Button onClick={handleApprove} disabled={statusMutation.isPending} className="gap-1.5 bg-emerald-500 hover:bg-emerald-600">
                  <CheckCircle2 className="w-4 h-4" /> Aprobar
                </Button>
                <Button variant="outline" onClick={() => setShowReject(true)} className="gap-1.5 text-red-500 border-red-200 hover:bg-red-50">
                  <XCircle className="w-4 h-4" /> Rechazar
                </Button>
              </>
            )}
            {restaurant.status === 'ACTIVE' && (
              <Button variant="outline" onClick={() => setShowSuspend(true)} className="gap-1.5 text-amber-600 border-amber-200 hover:bg-amber-50">
                <PauseCircle className="w-4 h-4" /> Suspender
              </Button>
            )}
            {(restaurant.status === 'SUSPENDED' || restaurant.status === 'REJECTED') && (
              <Button onClick={handleReactivate} disabled={statusMutation.isPending} className="gap-1.5 bg-emerald-500 hover:bg-emerald-600">
                <CheckCircle2 className="w-4 h-4" /> Reactivar
              </Button>
            )}
          </div>
        </FadeIn>

        {/* Info + Stats Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Info */}
          <FadeIn>
            <div className="bg-white rounded-2xl border border-n-100 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display font-bold text-lg text-n-900">Información</h2>
                {!editMode ? (
                  <Button size="sm" variant="outline" onClick={startEdit}>Editar</Button>
                ) : (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setEditMode(false)}>Cancelar</Button>
                    <Button size="sm" onClick={saveEdit} isLoading={editMutation.isPending}>Guardar</Button>
                  </div>
                )}
              </div>

              {editMode ? (
                <div className="space-y-3">
                  {['name', 'address', 'whatsapp', 'category'].map((field) => (
                    <div key={field}>
                      <label className="block text-xs font-bold text-n-400 uppercase tracking-widest mb-1">
                        {field === 'name' ? 'Nombre' : field === 'address' ? 'Dirección' : field === 'whatsapp' ? 'WhatsApp' : 'Categoría'}
                      </label>
                      <input
                        value={editForm[field] || ''}
                        onChange={(e) => setEditForm((f) => ({ ...f, [field]: e.target.value }))}
                        className="w-full border border-n-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#B088C9]/20"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  <InfoRow icon={Mail} label="Email" value={restaurant.owner?.email} />
                  <InfoRow icon={Tag} label="Categoría" value={restaurant.category} />
                  <InfoRow icon={MapPin} label="Dirección" value={restaurant.address} />
                  <InfoRow icon={Phone} label="WhatsApp" value={restaurant.whatsapp} />
                  <InfoRow icon={Calendar} label="Registrado" value={new Date(restaurant.createdAt).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })} />
                  {restaurant.reviewedAt && (
                    <InfoRow icon={CheckCircle2} label="Revisado" value={new Date(restaurant.reviewedAt).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })} />
                  )}
                </div>
              )}
            </div>
          </FadeIn>

          {/* Stats + Plan */}
          <div className="space-y-6">
            <FadeIn>
              <div className="bg-white rounded-2xl border border-n-100 p-6">
                <h2 className="font-display font-bold text-lg text-n-900 mb-4">Estadísticas</h2>
                <div className="grid grid-cols-2 gap-4">
                  <StatCard icon={FolderOpen} label="Categorías" value={restaurant._stats?.totalCategories || 0} color="text-blue-500 bg-blue-50" />
                  <StatCard icon={ChefHat} label="Items" value={restaurant._stats?.totalItems || 0} color="text-primary bg-primary/10" />
                  <StatCard icon={Eye} label="Visitas" value={restaurant.pageViews || 0} color="text-[#B088C9] bg-[#B088C9]/10" />
                  <StatCard icon={ShoppingBag} label="WhatsApp clicks" value={restaurant.whatsappClicks || 0} color="text-emerald-500 bg-emerald-50" />
                </div>
              </div>
            </FadeIn>

            <FadeIn>
              <div className="bg-white rounded-2xl border border-n-100 p-6">
                <h2 className="font-display font-bold text-lg text-n-900 mb-4">Plan</h2>
                <div className="flex items-center gap-3">
                  <Crown className={`w-6 h-6 ${restaurant.plan === 'PRO' ? 'text-[#B088C9]' : 'text-n-400'}`} />
                  <span className="font-bold text-n-900">{restaurant.plan}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => planMutation.mutate({ id, plan: restaurant.plan === 'PRO' ? 'GRATIS' : 'PRO' })}
                    disabled={planMutation.isPending}
                  >
                    Cambiar a {restaurant.plan === 'PRO' ? 'Gratis' : 'Pro'}
                  </Button>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>

        {/* Logs */}
        {restaurant.logs && restaurant.logs.length > 0 && (
          <FadeIn>
            <div className="bg-white rounded-2xl border border-n-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-n-100">
                <h2 className="font-display font-bold text-lg text-n-900">Historial de actividad</h2>
              </div>
              <div className="divide-y divide-n-50">
                {restaurant.logs.map((log: Record<string, unknown>) => {
                  const meta = log.metadata as Record<string, unknown> | null;
                  return (
                    <div key={log.id as string} className="px-6 py-3 flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-n-700">{String(log.action)}</span>
                        {meta && typeof meta.from === 'string' && typeof meta.to === 'string' && (
                          <span className="text-xs text-n-400 ml-2">
                            {meta.from} → {meta.to}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-n-400">
                        {new Date(log.createdAt as string).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </FadeIn>
        )}

        {/* Modals */}
        <AnimatePresence>
          {showReject && (
            <Modal onClose={() => { setShowReject(false); setRejectNote(''); }}>
              <h3 className="font-display font-bold text-lg text-n-900 mb-4">Rechazar restaurante</h3>
              <textarea
                value={rejectNote}
                onChange={(e) => setRejectNote(e.target.value)}
                placeholder="Motivo del rechazo (opcional)..."
                className="w-full border border-n-200 rounded-xl px-4 py-3 text-sm resize-none h-28 focus:outline-none focus:ring-2 focus:ring-red-200"
              />
              <div className="flex gap-3 mt-4">
                <Button variant="outline" className="flex-1" onClick={() => setShowReject(false)}>Cancelar</Button>
                <Button className="flex-1 bg-red-500 hover:bg-red-600" onClick={handleReject} isLoading={statusMutation.isPending}>Confirmar rechazo</Button>
              </div>
            </Modal>
          )}

          {showSuspend && (
            <Modal onClose={() => setShowSuspend(false)}>
              <div className="text-center space-y-4">
                <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
                <h3 className="font-display font-bold text-lg text-n-900">¿Suspender restaurante?</h3>
                <p className="text-sm text-n-500">El restaurante dejará de aparecer en el feed y no podrá acceder a su dashboard.</p>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => setShowSuspend(false)}>Cancelar</Button>
                  <Button className="flex-1 bg-amber-500 hover:bg-amber-600" onClick={handleSuspend} isLoading={statusMutation.isPending}>Suspender</Button>
                </div>
              </div>
            </Modal>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: typeof Mail; label: string; value?: string | null }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="w-4 h-4 text-n-400 mt-0.5 shrink-0" />
      <div>
        <p className="text-xs text-n-400 font-bold uppercase tracking-widest">{label}</p>
        <p className="text-sm text-n-700">{value || '—'}</p>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: typeof Eye; label: string; value: number; color: string }) {
  return (
    <div className="bg-n-50 rounded-xl p-4">
      <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center mb-2`}>
        <Icon className="w-4 h-4" />
      </div>
      <p className="text-xl font-display font-bold text-n-900">{value}</p>
      <p className="text-xs text-n-400">{label}</p>
    </div>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
