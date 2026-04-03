'use client';

import Link from 'next/link';
import { fadeInUp } from '@/components/motion/variants';
import { motion } from 'framer-motion';
import { FavoriteButton } from './FavoriteButton';
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
  bannerText?: string | null;
  primaryColor?: string | null;
  plan?: string;
  isClosed: boolean;
  schedule?: string | null;
  distance?: number | null;
}

function isHexColor(v: string | null | undefined): v is string {
  return !!v && /^#[0-9A-Fa-f]{6}$/.test(v.trim());
}

export function RestaurantCard({ restaurant: r }: { restaurant: Restaurant }) {
  const cart = useCart();
  const hasPendingOrder = cart.restaurantId === r.id && cart.items.length > 0;
  const open = isOpenNow(r.schedule, r.isClosed);
  const todayHours = getHoursFromRaw(r.schedule);
  const accent = isHexColor(r.primaryColor) ? r.primaryColor.trim() : null;

  return (
    <motion.div variants={fadeInUp} whileHover={{ y: -4 }} transition={{ duration: 0.22 }}>
      <Link
        href={`/${r.slug}`}
        className={`cursor-pointer group block bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-shadow ${
          !open ? 'grayscale opacity-70' : ''
        }`}
      >
        <div className="relative w-full aspect-4/3 overflow-hidden bg-stone-900">
          {r.coverUrl ? (
            <img
              src={r.coverUrl}
              alt={r.name}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 size-full object-cover object-center select-none will-change-transform scale-[1.02] transition-transform duration-700 ease-out group-hover:scale-[1.06]"
            />
          ) : r.logoUrl ? (
            <img
              src={r.logoUrl}
              alt={r.name}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 size-full object-cover object-center select-none will-change-transform scale-[1.02] transition-transform duration-700 ease-out group-hover:scale-[1.06]"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-stone-800 to-stone-950">
              <span className="text-6xl opacity-30 select-none">🍽</span>
            </div>
          )}
          {r.logoUrl && r.coverUrl && (
            <div
              className="absolute bottom-2.5 left-2.5 z-10 size-[4.25rem] overflow-hidden rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.35)] ring-2 ring-white/30 sm:bottom-3 sm:left-3 sm:size-20 sm:rounded-[1.35rem]"
              aria-hidden
            >
              <img
                src={r.logoUrl}
                alt=""
                className="size-full object-cover object-center"
              />
            </div>
          )}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2" onClick={(e) => e.preventDefault()}>
            <FavoriteButton restaurantId={r.id} />
          </div>
          <div className="absolute top-4 right-4 z-10 bg-black/45 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 ring-1 ring-white/15">
            <div className={`w-1.5 h-1.5 rounded-full ${open ? 'bg-green-400 animate-pulse' : 'bg-white/50'}`} />
            <span className="text-[8px] font-black uppercase tracking-widest text-white">
              {open ? 'Abierto' : 'Cerrado'}
            </span>
          </div>
          {hasPendingOrder && (
            <div className="absolute bottom-2.5 right-2.5 z-10 bg-[#E85D04] text-white px-2 py-1 rounded-lg text-[8px] font-black uppercase shadow-lg ring-1 ring-white/25 sm:bottom-3 sm:right-3">
              Pedido pendiente
            </div>
          )}
        </div>
        <div className="p-8">
          <span className="px-2 py-0.5 bg-orange-50 text-[#E85D04] text-[9px] font-black uppercase rounded-full">
            {r.category}
          </span>
          <div className="flex items-center justify-between gap-2 mt-2">
            <h3 className="text-2xl font-black leading-none text-gray-900 transition-colors group-hover:text-[#E85D04]">
              {r.name}
            </h3>
              
          </div>
          
          {r.bannerText?.trim() && (
            <p
              className="mt-3 rounded-xl "
              style={{ borderLeftColor: accent || '#E85D04' }}
            >
              {r.bannerText.trim()}
            </p>
          )}
          {r.distance != null && (
                <span className="text-[#E85D04] font-black text-[11px] bg-orange-50 px-2 rounded-full shrink-0">
                  {r.distance < 1
                    ? `${Math.round(r.distance * 1000)} m`
                    : `${r.distance.toFixed(1)} km`}
                </span>
            )}
          {r.plan === 'PRO' && (
            <p className="mt-2 text-[9px] font-black uppercase tracking-widest text-amber-700/90">
              Destacado
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
