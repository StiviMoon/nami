'use client';

import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeInUp, cardHover } from '@/components/motion/variants';
import { getThemeClasses } from '@/lib/restaurant-theme';
import { Badge } from '@/components/ui/badge';
import { FavoriteButton } from './FavoriteButton';

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

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export function RestaurantCard({ restaurant: r }: RestaurantCardProps) {
  const theme = getThemeClasses(r.themePreset);

  return (
    <motion.div variants={fadeInUp} whileHover={cardHover}>
      <Link
        href={`/${r.slug}`}
        className="group block bg-white rounded-2xl overflow-hidden border border-n-100 transition-colors"
      >
        {/* Cover */}
        <div className={`h-40 sm:h-44 bg-linear-to-br ${theme.header} relative overflow-hidden`}>
          {r.coverUrl || r.logoUrl ? (
            <img
              src={r.coverUrl || r.logoUrl}
              alt={r.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-6xl opacity-60">🍽️</span>
            </div>
          )}

          {/* Gradient overlay bottom */}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-black/30 to-transparent" />

          {/* Top actions */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
            <FavoriteButton restaurantId={r.id} />
            {r.plan === 'PRO' && <Badge variant="pro" icon size="xs">Pro</Badge>}
          </div>

          {r.isClosed && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-[1px]">
              <Badge variant="danger" size="sm">Cerrado</Badge>
            </div>
          )}

          {/* Logo avatar (always visible above cover) */}
          {r.logoUrl && (
            <div className="absolute left-3 bottom-3 z-20">
              <img
                src={r.logoUrl}
                alt={`Logo de ${r.name}`}
                className="w-12 h-12 rounded-xl object-cover border-2 border-white/95 shadow-lg bg-white"
              />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4 sm:p-5">
          <h3 className={`font-display font-bold text-base sm:text-lg mb-1 ${theme.accent}`}>
            {r.name}
          </h3>
          <div className="flex items-center gap-3 text-n-400 text-sm">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{r.category}</span>
            </span>
            {r.distance != null && (
              <span className="text-primary font-medium text-[11px] bg-primary/10 px-2 py-0.5 rounded-full">
                {r.distance < 1 ? `${Math.round(r.distance * 1000)}m` : `${r.distance} km`}
              </span>
            )}
          </div>
          {r.description && (
            <p className="text-n-400 text-sm mt-2 line-clamp-2">{r.description}</p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
