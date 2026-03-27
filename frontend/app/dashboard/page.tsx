'use client';

import { useMyRestaurant } from '@/hooks/useMyRestaurant';
import { UtensilsCrossed, Eye, QrCode, Star, FolderOpen, ChefHat, CircleDot, Link2 } from 'lucide-react';
import Link from 'next/link';
import { PageTransition, StaggerContainer, StaggerItem, AnimatedNumber, FadeIn } from '@/components/motion';
import { motion } from 'framer-motion';
import { cardHover } from '@/components/motion/variants';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toast';

export default function DashboardPage() {
  const { data: restaurant, isLoading } = useMyRestaurant();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
        </div>
      </div>
    );
  }

  const totalItems = restaurant?.categories?.reduce((sum: number, c: any) => sum + c.items.length, 0) || 0;
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

  const stats = [
    { label: 'Plan', value: restaurant?.plan || 'GRATIS', icon: Star, color: 'text-amber-500 bg-amber-50' },
    { label: 'Categorías', value: totalCategories, icon: FolderOpen, color: 'text-blue-500 bg-blue-50' },
    { label: 'Items', value: totalItems, maxValue: restaurant?.plan === 'GRATIS' ? 10 : undefined, icon: ChefHat, color: 'text-primary bg-primary/10' },
    { label: 'Estado', value: restaurant?.isClosed ? 'Cerrado' : 'Abierto', icon: CircleDot, color: restaurant?.isClosed ? 'text-red-500 bg-red-50' : 'text-emerald-500 bg-emerald-50' },
  ];

  return (
    <PageTransition>
      <div className="space-y-8">
        <FadeIn>
          <h1 className="text-3xl font-display font-bold text-n-900">
            ¡Hola, {restaurant?.name}!
          </h1>
          <p className="text-n-500 mt-1">Administra tu restaurante desde aquí</p>
        </FadeIn>

        {/* Stats */}
        <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <StaggerItem key={stat.label}>
              <div className="bg-white rounded-2xl p-5 border border-n-100">
                <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <p className="text-2xl font-display font-bold text-n-900">
                  {typeof stat.value === 'number' ? (
                    <>
                      <AnimatedNumber value={stat.value} />
                      {stat.maxValue && <span className="text-n-400 text-base font-normal">/{stat.maxValue}</span>}
                    </>
                  ) : stat.value}
                </p>
                <p className="text-sm text-n-400 mt-0.5">{stat.label}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Profile completeness */}
        <FadeIn>
          <div className="bg-white rounded-2xl p-5 border border-n-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm text-n-700">Completitud del perfil</h3>
              <span className="text-sm font-bold text-primary">{completeness}%</span>
            </div>
            <div className="h-2 bg-n-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${completeness}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
              />
            </div>
            {completeness < 100 && (
              <p className="text-xs text-n-400 mt-2">
                Completa tu perfil para atraer más clientes
              </p>
            )}
          </div>
        </FadeIn>

        {/* Quick actions */}
        <StaggerContainer className="grid md:grid-cols-3 gap-4">
          {[
            { href: '/dashboard/menu', icon: UtensilsCrossed, title: 'Gestionar menú', desc: 'Agrega categorías e items a tu menú' },
            { href: '/dashboard/perfil', icon: Eye, title: 'Editar perfil', desc: 'Actualiza la info de tu restaurante' },
            { href: '/dashboard/qr', icon: QrCode, title: 'Tu link y QR', desc: 'Comparte tu página con clientes' },
          ].map((action) => (
            <StaggerItem key={action.href}>
              <Link href={action.href}>
                <motion.div
                  whileHover={cardHover}
                  className="bg-white rounded-2xl p-6 border border-n-100 group cursor-pointer h-full"
                >
                  <action.icon className="w-8 h-8 text-primary mb-3" />
                  <h3 className="font-display font-bold text-lg group-hover:text-primary transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-sm text-n-400 mt-1">{action.desc}</p>
                </motion.div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Link público */}
        {restaurant?.slug && (
          <FadeIn>
            <div className="bg-primary/5 rounded-2xl p-6 border border-primary/20">
              <p className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
                <Link2 className="w-4 h-4" />
                Tu página pública
              </p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <code className="bg-white px-4 py-2.5 rounded-xl border text-sm flex-1 truncate">
                  {typeof window !== 'undefined' ? window.location.origin : 'nami.app'}/{restaurant.slug}
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
      </div>
    </PageTransition>
  );
}
