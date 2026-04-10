'use client';

import { create } from 'zustand';

export interface CartExtra {
  id: string;
  name: string;
  price: number;
}

export interface CartItem {
  lineId: string;
  id: string;
  restaurantId: string;
  name: string;
  /** Precio unitario (base + extras seleccionados) */
  price: number;
  quantity: number;
  chosenExtras?: CartExtra[];
  chosenExclusions?: string[];
}

interface CartStore {
  items: CartItem[];
  restaurantId: string | null;
  restaurantName: string | null;
  restaurantWhatsapp: string | null;

  addItem: (item: Omit<CartItem, 'quantity'>, restaurantName: string, whatsapp: string) => void;
  removeItem: (lineId: string) => void;
  increase: (lineId: string) => void;
  decrease: (lineId: string) => void;
  clear: () => void;
  total: () => number;
  buildWhatsAppUrl: (
    paymentMethod: string,
    deliveryMode: string,
    deliveryAddress?: string,
    deliveryPhone?: string,
    customerName?: string,
    deliveryQuote?: { zoneName: string; fee: number } | null
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
      const existing = s.items.find((i) => i.lineId === item.lineId);
      if (existing) {
        return {
          items: s.items.map((i) =>
            i.lineId === item.lineId ? { ...i, quantity: i.quantity + 1 } : i
          ),
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

  removeItem: (lineId) => set((s) => ({ items: s.items.filter((i) => i.lineId !== lineId) })),

  increase: (lineId) =>
    set((s) => ({
      items: s.items.map((i) => (i.lineId === lineId ? { ...i, quantity: i.quantity + 1 } : i)),
    })),

  decrease: (lineId) =>
    set((s) => ({
      items: s.items
        .map((i) => (i.lineId === lineId ? { ...i, quantity: i.quantity - 1 } : i))
        .filter((i) => i.quantity > 0),
    })),

  clear: () => set({ items: [], restaurantId: null, restaurantName: null, restaurantWhatsapp: null }),

  total: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

  buildWhatsAppUrl: (paymentMethod, deliveryMode, deliveryAddress, deliveryPhone, customerName, deliveryQuote) => {
    const s = get();
    const lines = s.items.map((i) => {
      const sub = i.price * i.quantity;
      let block = `- ${i.quantity} x ${sanitizeLine(i.name)}: $${sub.toLocaleString('es-CO')}`;
      const extras = i.chosenExtras?.map((e) => `  + ${sanitizeLine(e.name)} (+$${e.price.toLocaleString('es-CO')})`) ?? [];
      const excl = i.chosenExclusions?.map((x) => `  Sin ${sanitizeLine(x)}`) ?? [];
      if (extras.length || excl.length) {
        block += '\n' + [...extras, ...excl].join('\n');
      }
      return block;
    });
    const itemsList = lines.join('\n');

    const subtotal = s.total();
    const subtotalStr = subtotal.toLocaleString('es-CO');
    const mode = deliveryMode === 'delivery' ? 'A domicilio' : 'Para recoger';

    const totalLines =
      deliveryMode === 'delivery' && deliveryQuote && deliveryQuote.fee >= 0
        ? [
            `SUBTOTAL (productos): $${subtotalStr}`,
            `ENVIO (${sanitizeLine(deliveryQuote.zoneName)}): $${deliveryQuote.fee.toLocaleString('es-CO')}`,
            `TOTAL (productos + envio): $${(subtotal + deliveryQuote.fee).toLocaleString('es-CO')}`,
          ]
        : [`TOTAL (productos): $${subtotalStr}`];

    const msg = [
      'HOLA, QUIERO REALIZAR ESTE PEDIDO:',
      '',
      `RESTAURANTE: ${sanitizeLine(s.restaurantName || '')}`,
      ...(customerName ? ['', `CLIENTE: ${sanitizeLine(customerName)}`] : []),
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
      ...totalLines,
      '',
      'ENVIADO DESDE nami',
    ].join('\n');

    const phone = (s.restaurantWhatsapp || '').replace(/\D/g, '');
    return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  },
}));

function sanitizeLine(value: string): string {
  return value.replace(/[^\p{L}\p{N}\s.,:;()\-$/]/gu, '').trim();
}
