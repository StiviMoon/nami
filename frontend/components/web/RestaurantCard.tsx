'use client';

import Link from 'next/link';
import { fadeInUp } from '@/components/motion/variants';
import { motion } from 'framer-motion';
import { FavoriteButton } from './FavoriteButton';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/useCart';

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
  distance?: number | null;
}

export function RestaurantCard({ restaurant: r }: { restaurant: Restaurant }) {
  const cart = useCart();
  const hasPendingOrder = cart.restaurantId === r.id && cart.items.length > 0;
  const open = !r.isClosed;

  return (
    <motion.div variants={fadeInUp} whileHover={{ y: -4 }} transition={{ duration: 0.22 }}>
      <Link
        href={`/${r.slug}`}
        className={`cursor-pointer group block bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all ${
          !open ? 'grayscale opacity-70' : ''
        }`}
      >
        <div className="h-60 relative overflow-hidden">
          {r.coverUrl || r.logoUrl ? (
            <img
              src={r.coverUrl || r.logoUrl}
              alt={r.name}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
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
            <h3 className="text-2xl font-black leading-none text-gray-900 group-hover:text-[#E85D04] transition-colors">
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
        </div>
      </Link>
    </motion.div>
  );
}
