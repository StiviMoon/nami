'use client';

import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useFavorites } from '@/hooks/useFavorites';

interface FavoriteButtonProps {
  restaurantId: string;
  className?: string;
  size?: 'sm' | 'md';
}

export function FavoriteButton({ restaurantId, className, size = 'sm' }: FavoriteButtonProps) {
  const { toggle, isFavorite } = useFavorites();
  const active = isFavorite(restaurantId);
  const iconSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';

  return (
    <motion.button
      whileTap={{ scale: 0.8 }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(restaurantId);
      }}
      className={`p-2 rounded-full transition-colors ${
        active ? 'bg-red-50 text-red-500' : 'bg-white/90 backdrop-blur-sm text-n-400 hover:text-red-400 hover:bg-red-50'
      } shadow-sm ${className || ''}`}
      title={active ? 'Quitar de favoritos' : 'Agregar a favoritos'}
    >
      <Heart
        className={`${iconSize} transition-all ${active ? 'fill-red-500' : ''}`}
      />
    </motion.button>
  );
}
