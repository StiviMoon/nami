'use client';

import Link from 'next/link';
import { MapPin, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeInUp } from '@/components/motion/variants';
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
    <motion.div variants={fadeInUp} whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
      <Link
        href={`/${r.slug}`}
        className="cursor-pointer group block bg-white rounded-2xl overflow-hidden border border-n-100 hover:border-n-200 hover:shadow-lg hover:shadow-n-900/5 transition-all duration-300"
      >
        {/* Cover */}
        <div className={`h-44 bg-gradient-to-br ${theme.header} relative overflow-hidden`}>
          {r.coverUrl || r.logoUrl ? (
            <img
              src={r.coverUrl || r.logoUrl}
              alt={r.name}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${theme.header}`}>
              <span className="text-5xl opacity-40 select-none">🍽</span>
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />

          {/* Top-right actions */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
            <FavoriteButton restaurantId={r.id} />
            {r.plan === 'PRO' && <Badge variant="pro" icon size="xs">Pro</Badge>}
          </div>

          {/* Status badge */}
          {r.isClosed ? (
            <div className="absolute top-3 left-3 z-10">
              <span className="flex items-center gap-1.5 bg-black/60 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
                <Clock className="w-3 h-3" />
                Cerrado
              </span>
            </div>
          ) : null}

          {/* Logo avatar */}
          {r.logoUrl && (
            <div className="absolute left-4 bottom-3 z-20">
              <img
                src={r.logoUrl}
                alt={`Logo de ${r.name}`}
                className="w-11 h-11 rounded-xl object-cover border-2 border-white/95 shadow-lg bg-white"
              />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className={`font-display font-bold text-base leading-tight ${r.isClosed ? 'text-n-400' : theme.accent}`}>
              {r.name}
            </h3>
            {r.distance != null && (
              <span className="text-primary font-semibold text-[11px] bg-primary/10 px-2 py-0.5 rounded-full shrink-0 mt-0.5">
                {r.distance < 1 ? `${Math.round(r.distance * 1000)}m` : `${r.distance.toFixed(1)} km`}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-n-400">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="text-xs truncate">{r.category}</span>
          </div>
          {r.description && (
            <p className="text-n-400 text-xs mt-2 line-clamp-2 leading-relaxed">{r.description}</p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
