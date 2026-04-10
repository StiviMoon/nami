'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { formatTodayHoursLabel } from '@/lib/uix-schedule';

interface Schedule {
  lun?: string;
  mar?: string;
  mie?: string;
  jue?: string;
  vie?: string;
  sab?: string;
  dom?: string;
  [key: string]: string | undefined;
}

interface ClosedStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurantName: string;
  schedule?: Schedule | null;
}

export function ClosedStoreModal({ isOpen, onClose, restaurantName, schedule }: ClosedStoreModalProps) {
  const todayLabel = formatTodayHoursLabel(schedule ?? null);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[150] flex cursor-pointer items-center justify-center bg-black/90 p-6 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-sm rounded-[3rem] p-10 text-center flex flex-col items-center gap-6 shadow-2xl"
          >
            <div className="w-20 h-20 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center">
              <Clock size={40} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-gray-900 leading-tight">Local cerrado</h3>
              <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mt-2">{restaurantName}</p>
            </div>
            <p className="text-gray-500 text-sm italic leading-relaxed">
              Lo sentimos, este restaurante no se encuentra recibiendo pedidos en este momento.
            </p>
            {schedule && (
              <div className="bg-gray-50 w-full p-4 rounded-2xl border border-gray-100">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Horario hoy</p>
                <p className="text-gray-900 font-black text-sm">{todayLabel}</p>
              </div>
            )}
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer w-full py-5 bg-gray-900 text-white font-black rounded-2xl uppercase text-[10px] tracking-[0.2em] shadow-xl hover:bg-black transition-all active:scale-95"
            >
              Entendido, solo quiero ver
            </button>
            <Link
              href="/feed"
              className="cursor-pointer w-full py-3.5 border-2 border-gray-100 text-gray-500 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:border-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Volver al feed
            </Link>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
