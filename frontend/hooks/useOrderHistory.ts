'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from './useCart';

export interface OrderRecord {
  id: string;
  restaurantName: string;
  restaurantSlug: string;
  items: CartItem[];
  total: number;
  paymentMethod: string;
  deliveryMode: string;
  date: string;
}

interface OrderHistoryStore {
  orders: OrderRecord[];
  addOrder: (order: Omit<OrderRecord, 'id' | 'date'>) => void;
  clear: () => void;
}

const MAX_ORDERS = 20;

export const useOrderHistory = create<OrderHistoryStore>()(
  persist(
    (set) => ({
      orders: [],
      addOrder: (order) =>
        set((s) => ({
          orders: [
            { ...order, id: crypto.randomUUID(), date: new Date().toISOString() },
            ...s.orders,
          ].slice(0, MAX_ORDERS),
        })),
      clear: () => set({ orders: [] }),
    }),
    { name: 'ñami-order-history' }
  )
);
