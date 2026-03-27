'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface CartFloatingButtonProps {
  visible: boolean;
  totalItems: number;
  total: number;
  onClick: () => void;
  accentBg?: string;
  accentHover?: string;
}

export function CartFloatingButton({ visible, totalItems, total, onClick, accentBg, accentHover }: CartFloatingButtonProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ y: 100, opacity: 0, scale: 0.8 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 100, opacity: 0, scale: 0.8 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClick}
          className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 ${accentBg || 'bg-primary'} text-white px-4 sm:px-6 py-3.5 sm:py-4 rounded-2xl shadow-2xl ${accentHover || 'hover:bg-primary-dark'} transition-colors flex items-center gap-2 sm:gap-3 z-50 max-w-[calc(100vw-2rem)]`}
        >
          <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
          <span className="font-bold text-sm sm:text-base">{totalItems} items</span>
          <span className="font-bold text-sm sm:text-base truncate">— {formatPrice(total)}</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
