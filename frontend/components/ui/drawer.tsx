'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { drawerSlide, backdropFade } from '@/components/motion/variants';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  className?: string;
  side?: 'right' | 'left';
}

export function Drawer({ open, onClose, children, title, className, side = 'right' }: DrawerProps) {
  const slideVariants = {
    hidden: { x: side === 'right' ? '100%' : '-100%', opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: 'spring' as const, damping: 28, stiffness: 300 } },
    exit: { x: side === 'right' ? '100%' : '-100%', opacity: 0, transition: { duration: 0.25, ease: 'easeIn' as const } },
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            variants={backdropFade}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            variants={slideVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              'fixed top-0 z-50 h-full w-full max-w-md bg-white shadow-2xl flex flex-col',
              side === 'right' ? 'right-0' : 'left-0',
              className
            )}
          >
            {title && (
              <div className="flex items-center justify-between border-b border-n-100 px-5 py-4">
                <h2 className="text-lg font-display font-semibold text-n-900">{title}</h2>
                <button
                  onClick={onClose}
                  className="rounded-xl p-2 text-n-400 transition-colors hover:bg-n-50 hover:text-n-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}
            <div className="flex-1 overflow-y-auto">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
