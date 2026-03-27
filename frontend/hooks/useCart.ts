'use client';

import { create } from 'zustand';

export interface CartItem {
  id: string;
  restaurantId: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  restaurantId: string | null;
  restaurantName: string | null;
  restaurantWhatsapp: string | null;

  addItem: (item: Omit<CartItem, 'quantity'>, restaurantName: string, whatsapp: string) => void;
  removeItem: (id: string) => void;
  increase: (id: string) => void;
  decrease: (id: string) => void;
  clear: () => void;
  total: () => number;
  buildWhatsAppUrl: (
    paymentMethod: string,
    deliveryMode: string,
    deliveryAddress?: string,
    deliveryPhone?: string
  ) => string;
}

export const useCart = create<CartStore>((set, get) => ({
  items: [],
  restaurantId: null,
  restaurantName: null,
  restaurantWhatsapp: null,

  addItem: (item, restaurantName, whatsapp) =>
    set((s) => {
      if (s.restaurantId && s.restaurantId !== item.restaurantId) {
        return {
          items: [{ ...item, quantity: 1 }],
          restaurantId: item.restaurantId,
          restaurantName,
          restaurantWhatsapp: whatsapp,
        };
      }
      const existing = s.items.find((i) => i.id === item.id);
      if (existing) {
        return {
          items: s.items.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)),
          restaurantId: item.restaurantId,
          restaurantName,
          restaurantWhatsapp: whatsapp,
        };
      }
      return {
        items: [...s.items, { ...item, quantity: 1 }],
        restaurantId: item.restaurantId,
        restaurantName,
        restaurantWhatsapp: whatsapp,
      };
    }),

  removeItem: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),

  increase: (id) =>
    set((s) => ({
      items: s.items.map((i) => (i.id === id ? { ...i, quantity: i.quantity + 1 } : i)),
    })),

  decrease: (id) =>
    set((s) => ({
      items: s.items
        .map((i) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i))
        .filter((i) => i.quantity > 0),
    })),

  clear: () => set({ items: [], restaurantId: null, restaurantName: null, restaurantWhatsapp: null }),

  total: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

  buildWhatsAppUrl: (paymentMethod, deliveryMode, deliveryAddress, deliveryPhone) => {
    const s = get();
    const itemsList = s.items
      .map((i) => `- ${i.quantity} x ${sanitizeLine(i.name)}: $${(i.price * i.quantity).toLocaleString('es-CO')}`)
      .join('\n');

    const total = s.total().toLocaleString('es-CO');
    const mode = deliveryMode === 'delivery' ? 'A domicilio' : 'Para recoger';

    const msg = [
      'HOLA, QUIERO REALIZAR ESTE PEDIDO:',
      '',
      `RESTAURANTE: ${sanitizeLine(s.restaurantName || '')}`,
      '',
      'DETALLE DEL PEDIDO:',
      itemsList,
      '',
      `METODO DE PAGO: ${sanitizeLine(paymentMethod)}`,
      `MODALIDAD: ${mode}`,
      ...(deliveryMode === 'delivery'
        ? [
            `DIRECCION DE ENTREGA: ${sanitizeLine(deliveryAddress || '')}`,
            `TELEFONO DE CONTACTO: ${sanitizeLine(deliveryPhone || '')}`,
          ]
        : []),
      `TOTAL: $${total}`,
      '',
      'ENVIADO DESDE NAMI',
    ].join('\n');

    const phone = (s.restaurantWhatsapp || '').replace(/\D/g, '');
    return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  },
}));

function sanitizeLine(value: string): string {
  return value.replace(/[^\p{L}\p{N}\s.,:;()\-$/]/gu, '').trim();
}
