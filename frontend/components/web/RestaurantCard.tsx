'use client';

import Link from 'next/link';
import { fadeInUp } from '@/components/motion/variants';
import { motion } from 'framer-motion';
import { FavoriteButton } from './FavoriteButton';
import { useCart } from '@/hooks/useCart';
import { Clock, MapPin } from 'lucide-react';
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
  bannerText?: string | null;
  primaryColor?: string | null;
  plan?: string;
  isClosed: boolean;
  schedule?: string | null;
  distance?: number | null;
}

export function RestaurantCard({ restaurant: r }: { restaurant: Restaurant }) {
  const cart = useCart();
  const hasPendingOrder = cart.restaurantId === r.id && cart.items.length > 0;
  const open = isOpenNow(r.schedule, r.isClosed);
  const todayHours = getHoursFromRaw(r.schedule);
  const isPro = r.plan === 'PRO';

  return (
    <motion.div variants={fadeInUp} whileHover={{ y: -5 }} transition={{ duration: 0.22, ease: 'easeOut' }}>
      <Link
        href={`/${r.slug}`}
        className={`cursor-pointer group flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-n-100 ${
          !open ? 'grayscale opacity-75' : ''
        }`}
      >
        {/* ── Imagen ── */}
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          {r.coverUrl ? (
            <img
              src={r.coverUrl}
              alt={r.name}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : r.logoUrl ? (
            <img
              src={r.logoUrl}
              alt={r.name}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-n-800 to-n-950 flex items-center justify-center">
              <span className="text-7xl opacity-20 select-none">🍽</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />

          {/* PRO badge — top left */}
          {isPro && (
            <span className="absolute top-3 left-3 z-10 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
              ✦ Destacado
            </span>
          )}

          {/* Favorito — top right */}
          <div className="absolute top-3 right-3 z-10" onClick={(e) => e.preventDefault()}>
            <FavoriteButton restaurantId={r.id} />
          </div>

          {/* Logo encima de cover — bottom left */}
          {r.logoUrl && r.coverUrl && (
            <div
              className="absolute bottom-3 left-3 z-10 size-12 overflow-hidden rounded-xl shadow-lg ring-2 ring-white/20"
              aria-hidden
            >
              <img src={r.logoUrl} alt="" className="size-full object-cover" />
            </div>
          )}

          {/* Horario — bottom right */}
          {todayHours && (
            <div className="absolute bottom-3 right-3 z-10 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5">
              <Clock size={13} className="text-n-700" />
              <span className="text-xs font-semibold text-n-800">{todayHours}</span>
            </div>
          )}

          {/* Indicador pedido pendiente */}
          {hasPendingOrder && (
            <div className="absolute inset-0 ring-2 ring-inset ring-primary rounded-3xl z-20 pointer-events-none">
              <span className="absolute top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg whitespace-nowrap">
                Pedido activo
              </span>
            </div>
          )}
        </div>

        {/* ── Info ── */}
        <div className="p-4 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-display text-lg font-bold text-n-900 line-clamp-1 group-hover:text-primary transition-colors">
              {r.name}
            </h3>
            {/* Estado */}
            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg shrink-0 ml-2 ${
              open ? 'bg-green-50' : 'bg-n-100'
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${open ? 'bg-green-500 animate-pulse' : 'bg-n-300'}`} />
              <span className={`text-xs font-bold ${open ? 'text-green-700' : 'text-n-400'}`}>
                {open ? 'Abierto' : 'Cerrado'}
              </span>
            </div>
          </div>

          <p className="text-sm text-n-500 mb-3 line-clamp-1">
            {r.category}
            {r.bannerText?.trim() && (
              <>
                <span className="text-n-200 mx-1.5">•</span>
                <span className="italic">&ldquo;{r.bannerText.trim()}&rdquo;</span>
              </>
            )}
          </p>

          {/* Footer */}
          <div className="mt-auto pt-3 border-t border-n-100 flex items-center justify-between">
            {r.distance != null ? (
              <span className="flex items-center gap-1 text-sm font-semibold text-n-600">
                <MapPin size={13} />
                {r.distance < 1
                  ? `${Math.round(r.distance * 1000)} m`
                  : `${r.distance.toFixed(1)} km`}
              </span>
            ) : (
              <span className="text-[9px] font-black uppercase tracking-widest text-n-300">{r.category}</span>
            )}
            {r.address && (
              <span className="text-xs text-n-400 truncate max-w-[160px]">{r.address}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
