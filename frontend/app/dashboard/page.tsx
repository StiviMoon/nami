'use client';

import { useMyRestaurant } from '@/hooks/useMyRestaurant';
import { UtensilsCrossed, Eye, QrCode, Star, FolderOpen, ChefHat, CircleDot, Link2, Crown, ArrowRight, TrendingUp, Zap } from 'lucide-react';
import Link from 'next/link';
import { PageTransition, StaggerContainer, StaggerItem, AnimatedNumber, FadeIn } from '@/components/motion';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toast';

export default function DashboardPage() {
  const { data: restaurant, isLoading } = useMyRestaurant();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-36 w-full rounded-2xl" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  const totalItems = restaurant?.categories?.reduce((sum: number, c: { items: unknown[] }) => sum + c.items.length, 0) || 0;
  const totalCategories = restaurant?.categories?.length || 0;

  // Profile completeness
  const fields = [
    !!restaurant?.name,
    !!restaurant?.description,
    !!restaurant?.address,
    !!restaurant?.whatsapp,
    !!restaurant?.logoUrl,
    !!restaurant?.coverUrl,
    !!restaurant?.latitude,
    !!restaurant?.instagram || !!restaurant?.facebook || !!restaurant?.tiktok,
    !!restaurant?.schedule,
  ];
  const completeness = Math.round((fields.filter(Boolean).length / fields.length) * 100);

  const isOpen = !restaurant?.isClosed;
  const isPro = restaurant?.plan === 'PRO';

  return (
    <PageTransition>
      <div className="space-y-6">

        {/* ── Hero card ── */}
        <FadeIn>
          <div className="relative overflow-hidden rounded-3xl bg-n-900 p-7 text-white">
            {/* decorative circles */}
            <div className="pointer-events-none absolute -top-10 -right-10 w-48 h-48 rounded-full bg-primary/10" />
            <div className="pointer-events-none absolute -bottom-12 right-16 w-32 h-32 rounded-full bg-primary/5" />

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-1">
                  {isPro ? '✦ Plan Pro' : 'Plan Gratis'}
                </p>
                <h1 className="font-display text-2xl sm:text-3xl font-black leading-tight tracking-tight">
                  {restaurant?.name || 'Mi restaurante'}
                </h1>
                <p className="text-sm text-n-400 mt-1">{restaurant?.address || 'Sin dirección configurada'}</p>
              </div>

              {/* status badge */}
              <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border shrink-0 w-fit ${
                isOpen ? 'bg-emerald-950 border-emerald-800 text-emerald-400' : 'bg-n-800 border-n-700 text-n-400'
              }`}>
                <div className={`w-2 h-2 rounded-full ${isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-n-500'}`} />
                <span className="text-xs font-black uppercase tracking-widest">
                  {isOpen ? 'Abierto' : 'Cerrado'}
                </span>
              </div>
            </div>

            {/* completeness bar */}
            <div className="relative z-10 mt-5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-black uppercase tracking-widest text-n-500">Perfil completado</span>
                <span className="text-xs font-black text-primary">{completeness}%</span>
              </div>
              <div className="h-1.5 bg-n-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${completeness}%` }}
                  transition={{ duration: 1.2, ease: 'easeOut', delay: 0.4 }}
                />
              </div>
              {completeness < 100 && (
                <p className="text-[10px] text-n-500 mt-1.5">
                  Completa tu perfil para atraer más clientes →{' '}
                  <Link href="/dashboard/perfil" className="text-primary underline">ir a perfil</Link>
                </p>
              )}
            </div>
          </div>
        </FadeIn>

        {/* ── Stats principales ── */}
        <StaggerContainer className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              label: 'Visitas totales',
              value: restaurant?.pageViews || 0,
              icon: Eye,
              accent: 'text-violet-500 bg-violet-50',
            },
            {
              label: 'Clics WhatsApp',
              value: restaurant?.whatsappClicks || 0,
              icon: Link2,
              accent: 'text-emerald-500 bg-emerald-50',
            },
            {
              label: 'Items en menú',
              value: totalItems,
              maxValue: !isPro ? 10 : undefined,
              icon: ChefHat,
              accent: 'text-primary bg-primary/10',
            },
            {
              label: 'Categorías',
              value: totalCategories,
              icon: FolderOpen,
              accent: 'text-blue-500 bg-blue-50',
            },
          ].map((stat) => (
            <StaggerItem key={stat.label}>
              <div className="bg-white rounded-2xl p-5 border border-n-100 hover:border-n-200 transition-colors">
                <div className={`w-9 h-9 rounded-xl ${stat.accent} flex items-center justify-center mb-3`}>
                  <stat.icon className="w-4.5 h-4.5" />
                </div>
                <p className="text-2xl font-display font-black text-n-900 leading-none">
                  <AnimatedNumber value={stat.value} />
                  {stat.maxValue && (
                    <span className="text-n-300 text-sm font-normal">/{stat.maxValue}</span>
                  )}
                </p>
                <p className="text-[11px] font-bold text-n-400 mt-1 uppercase tracking-wide">{stat.label}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* ── Acciones rápidas ── */}
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-n-400 mb-3">Acceso rápido</p>
          <StaggerContainer className="grid md:grid-cols-3 gap-3">
            {[
              {
                href: '/dashboard/menu',
                icon: UtensilsCrossed,
                title: 'Gestionar menú',
                desc: 'Agrega y edita tus platos',
                accent: 'bg-primary/10 text-primary',
              },
              {
                href: '/dashboard/perfil',
                icon: Eye,
                title: 'Editar perfil',
                desc: 'Fotos, horario y más',
                accent: 'bg-violet-50 text-violet-500',
              },
              {
                href: '/dashboard/qr',
                icon: QrCode,
                title: 'Tu link y QR',
                desc: 'Comparte con tus clientes',
                accent: 'bg-emerald-50 text-emerald-500',
              },
            ].map((action) => (
              <StaggerItem key={action.href}>
                <Link href={action.href}>
                  <motion.div
                    whileHover={{ y: -3 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    className="bg-white rounded-2xl p-5 border border-n-100 hover:border-n-200 hover:shadow-md transition-all group cursor-pointer flex items-center gap-4"
                  >
                    <div className={`w-11 h-11 rounded-xl ${action.accent} flex items-center justify-center shrink-0`}>
                      <action.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-bold text-n-900 group-hover:text-primary transition-colors text-sm leading-tight">
                        {action.title}
                      </h3>
                      <p className="text-xs text-n-400 mt-0.5">{action.desc}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-n-300 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                  </motion.div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>

        {/* ── Link público ── */}
        {restaurant?.slug && (
          <FadeIn>
            <div className="bg-white rounded-2xl p-5 border border-n-100">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-n-400">Tu página pública</p>
                <Zap className="w-3.5 h-3.5 text-primary" />
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <code className="bg-n-50 border border-n-100 px-4 py-2.5 rounded-xl text-sm flex-1 truncate text-n-600 font-mono">
                  {typeof window !== 'undefined' ? window.location.origin : 'ñami.app'}/{restaurant.slug}
                </code>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/${restaurant.slug}`);
                      toast('Link copiado', 'success');
                    }}
                  >
                    Copiar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`/${restaurant.slug}`, '_blank')}
                  >
                    Ver
                  </Button>
                </div>
              </div>
            </div>
          </FadeIn>
        )}

        {/* ── Upgrade PRO ── */}
        {!isPro && (
          <FadeIn>
            <div className="relative overflow-hidden bg-gradient-to-br from-n-900 to-n-800 rounded-2xl p-6 border border-n-700 text-white">
              <div className="pointer-events-none absolute -top-8 -right-8 w-40 h-40 rounded-full bg-primary/10" />
              <div className="relative z-10 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Crown className="w-4 h-4 text-primary" />
                    <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-black">Upgrade recomendado</p>
                  </div>
                  <h3 className="text-lg font-display font-black leading-snug">
                    Sube a Pro y aparece<br />primero en el feed
                  </h3>
                  <p className="text-xs text-n-400 mt-1.5 leading-relaxed">
                    Menú ilimitado, QR descargable y badge ✦ Destacado.
                  </p>
                </div>
              </div>
              <div className="relative z-10 mt-4">
                <Link href="/contacto?plan=pro&from=dashboard">
                  <Button size="sm" className="gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Hablar con ventas
                  </Button>
                </Link>
              </div>
            </div>
          </FadeIn>
        )}
      </div>
    </PageTransition>
  );
}
