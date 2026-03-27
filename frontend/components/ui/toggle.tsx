'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  size?: 'sm' | 'md';
}

export function Toggle({ checked, onChange, label, description, disabled, size = 'md' }: ToggleProps) {
  const trackSize = size === 'sm' ? 'w-9 h-5' : 'w-11 h-6';
  const thumbSize = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4.5 w-4.5';
  const thumbTranslate = size === 'sm' ? 16 : 20;

  return (
    <label className={cn('flex items-center gap-3', disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer')}>
      <button
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative inline-flex shrink-0 rounded-full transition-colors duration-200',
          trackSize,
          checked ? 'bg-primary' : 'bg-n-200'
        )}
      >
        <motion.span
          className={cn(
            'block rounded-full bg-white shadow-sm',
            thumbSize
          )}
          animate={{ x: checked ? thumbTranslate : 3, y: 3 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </button>
      {(label || description) && (
        <div>
          {label && <span className="text-sm font-medium text-n-800">{label}</span>}
          {description && <p className="text-xs text-n-500">{description}</p>}
        </div>
      )}
    </label>
  );
}
