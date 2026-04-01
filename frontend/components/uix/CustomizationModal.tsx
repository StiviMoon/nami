'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import type { MenuExtra } from '@/lib/menu-customization';

const ACCENT = '#E85D04';

export type CustomizableMenuItem = {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  extras?: MenuExtra[];
  removables?: string[];
};

type Props = {
  item: CustomizableMenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (item: CustomizableMenuItem, extras: MenuExtra[], removed: string[]) => void;
};

export function CustomizationModal({ item, isOpen, onClose, onConfirm }: Props) {
  const [extras, setExtras] = useState<MenuExtra[]>([]);
  const [removed, setRemoved] = useState<string[]>([]);

  useEffect(() => {
    if (item) {
      setExtras([]);
      setRemoved([]);
    }
  }, [item?.id, isOpen]);

  if (!isOpen || !item) return null;

  const toggleExtra = (e: MenuExtra) =>
    setExtras((prev) => (prev.find((ex) => ex.id === e.id) ? prev.filter((ex) => ex.id !== e.id) : [...prev, e]));

  const toggleRemoved = (ing: string) =>
    setRemoved((prev) => (prev.includes(ing) ? prev.filter((i) => i !== ing) : [...prev, ing]));

  const total = item.price + extras.reduce((sum, e) => sum + e.price, 0);

  return (
    <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4">
      <div className="flex max-h-[min(92dvh,100svh)] w-full max-w-lg flex-col overflow-hidden rounded-t-[2.5rem] bg-white shadow-2xl sm:max-h-[90vh] sm:rounded-[2.5rem]">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0">
          <h3 className="font-black text-xl text-gray-900">Personaliza tu pedido</h3>
          <button type="button" onClick={onClose} className="p-2 bg-gray-100 rounded-full cursor-pointer">
            <X size={20} />
          </button>
        </div>
        <div className="min-h-0 flex-1 space-y-8 overflow-y-auto overscroll-y-contain p-6 sm:p-8">
          <p className="text-sm text-gray-500 font-medium">{item.name}</p>
          {(item.extras?.length ?? 0) > 0 && (
            <section>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">
                Extras / toppings
              </h4>
              <div className="space-y-2">
                {item.extras!.map((e) => (
                  <button
                    key={e.id}
                    type="button"
                    onClick={() => toggleExtra(e)}
                    className={`cursor-pointer w-full p-4 rounded-2xl border-2 flex justify-between items-center transition-all ${
                      extras.find((ex) => ex.id === e.id)
                        ? 'border-[#E85D04] bg-orange-50'
                        : 'border-gray-50'
                    }`}
                  >
                    <span className="font-bold text-sm text-gray-900">{e.name}</span>
                    <span className="text-xs font-black text-gray-400">+{formatPrice(e.price)}</span>
                  </button>
                ))}
              </div>
            </section>
          )}
          {(item.removables?.length ?? 0) > 0 && (
            <section>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">
                ¿Quitar algún ingrediente?
              </h4>
              <div className="flex flex-wrap gap-2">
                {item.removables!.map((ing) => (
                  <button
                    key={ing}
                    type="button"
                    onClick={() => toggleRemoved(ing)}
                    className={`cursor-pointer px-4 py-2 rounded-full text-xs font-bold border-2 transition-all ${
                      removed.includes(ing)
                        ? 'bg-red-50 border-red-100 text-red-600'
                        : 'bg-gray-50 border-transparent text-gray-500'
                    }`}
                  >
                    {removed.includes(ing) ? `Sin ${ing} ✕` : ing}
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>
        <div className="border-t border-gray-100 bg-gray-50 p-6 pb-[max(1.5rem,var(--safe-bottom))] sm:pb-6">
          <button
            type="button"
            onClick={() => {
              onConfirm(item, extras, removed);
              setExtras([]);
              setRemoved([]);
            }}
            className="cursor-pointer w-full py-4 text-white font-black rounded-2xl flex justify-between px-8 items-center shadow-lg"
            style={{ backgroundColor: ACCENT }}
          >
            <span className="text-xs uppercase">Añadir</span>
            <span>{formatPrice(total)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
