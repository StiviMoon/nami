'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { cardHover, tapScale } from '@/components/motion/variants';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  as?: 'div' | 'article';
}

export function Card({ children, className, hover = false, onClick, as = 'div' }: CardProps) {
  if (hover) {
    return (
      <motion.div
        className={cn(
          'rounded-2xl border border-n-100 bg-white overflow-hidden',
          onClick && 'cursor-pointer',
          className
        )}
        whileHover={cardHover}
        whileTap={onClick ? tapScale : undefined}
        onClick={onClick}
      >
        {children}
      </motion.div>
    );
  }

  const Tag = as;
  return (
    <Tag
      className={cn(
        'rounded-2xl border border-n-100 bg-white overflow-hidden',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </Tag>
  );
}

export function CardHeader({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('px-5 pt-5 pb-3', className)}>{children}</div>;
}

export function CardContent({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('px-5 pb-5', className)}>{children}</div>;
}
