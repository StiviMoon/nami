'use client';

import Link from 'next/link';
import { fadeInUp } from '@/components/motion/variants';
import { motion } from 'framer-motion';
import { FavoriteButton } from './FavoriteButton';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/useCart';
import { Clock } from 'lucide-react';
import { isOpenNow, getHoursFromRaw } from '@/lib/uix-schedule';

interface Restaurant {
  id: string;
  slug: string;
  name: string;
  description?: string;
  category: string;
  address: string;
  coverUrl?: string;
  logoUrl?: string;
  themePreset?: string;
  plan: string;
  isClosed: boolean;
  schedule?: string | null;
  distance?: number | null;
}

export function RestaurantCard({ restaurant: r }: { restaurant: Restaurant }) {
  const cart = useCart();
  const hasPendingOrder = cart.restaurantId === r.id && cart.items.length > 0;
  const open = isOpenNow(r.schedule, r.isClosed);
  const todayHours = getHoursFromRaw(r.schedule);

  return (
    <motion.div variants={fadeInUp} whileHover={{ y: -4 }} transition={{ duration: 0.22 }}>
      <Link
        href={`/${r.slug}`}
        className={`cursor-pointer group block bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-shadow ${
          !open ? 'grayscale opacity-70' : ''
        }`}
      >
        {/* cover + leve scale evita líneas por subpíxeles; si la foto trae bandas negras en el archivo, conviene recortarla al subir */}
        <div className="relative w-full aspect-4/3 overflow-hidden bg-stone-200">
          {r.coverUrl || r.logoUrl ? (
            <img
              src={r.coverUrl || r.logoUrl}
              alt={r.name}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 size-full object-cover object-center select-none will-change-transform scale-[1.03] transition-transform duration-700 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-stone-100 to-stone-200">
              <span className="text-6xl opacity-25 select-none">🍽</span>
            </div>
          )}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2" onClick={(e) => e.preventDefault()}>
            <FavoriteButton restaurantId={r.id} />
            {r.plan === 'PRO' && <Badge variant="pro" icon size="xs">Pro</Badge>}
          </div>
          <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${open ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            <span className="text-[8px] font-black uppercase tracking-widest text-gray-800">
              {open ? 'Abierto' : 'Cerrado'}
            </span>
          </div>
          {hasPendingOrder && (
            <div className="absolute bottom-4 left-4 bg-[#E85D04] text-white px-2 py-1 rounded-lg text-[8px] font-black uppercase shadow-lg border border-white/20">
              Pedido pendiente
            </div>
          )}
        </div>
        <div className="p-8">
          <span className="px-2 py-0.5 bg-orange-50 text-[#E85D04] text-[9px] font-black uppercase rounded-full">
            {r.category}
          </span>
          <div className="flex items-start justify-between gap-2 mt-2">
            <h3 className="text-2xl font-black leading-none text-gray-900 transition-colors group-hover:text-[#E85D04]">
              {r.name}
            </h3>
            {r.distance != null && (
              <span className="text-[#E85D04] font-black text-[11px] bg-orange-50 px-2 py-0.5 rounded-full shrink-0">
                {r.distance < 1
                  ? `${Math.round(r.distance * 1000)} m`
                  : `${r.distance.toFixed(1)} km`}
              </span>
            )}
          </div>
          {r.description && (
            <p className="text-gray-400 text-xs mt-3 italic line-clamp-2 leading-relaxed">
              &quot;{r.description}&quot;
            </p>
          )}
          {todayHours && (
            <div className="mt-3 flex items-center gap-1.5 text-[10px] font-bold text-gray-400">
              <Clock size={12} className="shrink-0" />
              <span>{todayHours}</span>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
