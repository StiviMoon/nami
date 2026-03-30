'use client';

import Link from 'next/link';
import { useOrderHistory } from '@/hooks/useOrderHistory';
import { useCart } from '@/hooks/useCart';
import { useRouter } from 'next/navigation';
import { formatPrice } from '@/lib/utils';
import { PageTransition, StaggerContainer, StaggerItem } from '@/components/motion';
import { EmptyState } from '@/components/ui/empty-state';
import { Clock, RotateCcw, ArrowLeft, Trash2 } from 'lucide-react';

const ACCENT = '#E85D04';

export default function HistorialPage() {
  const { orders, clear } = useOrderHistory();
  const cart = useCart();
  const router = useRouter();

  const repeatOrder = (order: (typeof orders)[0]) => {
    cart.clear();
    for (const item of order.items) {
      const lineId = item.lineId ?? item.id;
      cart.addItem(
        {
          lineId,
          id: item.id,
          restaurantId: item.restaurantId,
          name: item.name,
          price: item.price,
          chosenExtras: item.chosenExtras,
          chosenExclusions: item.chosenExclusions,
        },
        order.restaurantName,
        ''
      );
      for (let q = 1; q < item.quantity; q++) {
        cart.increase(lineId);
      }
    }
    router.push(`/${order.restaurantSlug}`);
  };

  return (
    <PageTransition>
      <main className="min-h-screen bg-gray-50 font-sans text-gray-900 antialiased">
        <header className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-40">
          <div className="max-w-2xl mx-auto px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/feed"
                className="p-2 rounded-2xl text-gray-400 hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-xl font-black tracking-tight">Mis pedidos</h1>
            </div>
            {orders.length > 0 && (
              <button
                type="button"
                onClick={clear}
                className="cursor-pointer text-[10px] font-black uppercase text-gray-400 hover:text-red-500 flex items-center gap-1.5 px-3 py-2 rounded-xl border border-transparent hover:border-gray-200 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Limpiar
              </button>
            )}
          </div>
        </header>

        <div className="max-w-2xl mx-auto px-6 py-8">
          {orders.length === 0 ? (
            <EmptyState
              icon={Clock}
              title="Sin pedidos aún"
              description="Cuando hagas tu primer pedido, aparecerá aquí."
              action={
                <Link
                  href="/feed"
                  className="inline-flex items-center justify-center py-4 px-8 bg-gray-900 text-white font-black rounded-2xl uppercase text-xs tracking-widest hover:bg-black transition-colors"
                >
                  Explorar restaurantes
                </Link>
              }
            />
          ) : (
            <StaggerContainer className="space-y-5">
              {orders.map((order) => (
                <StaggerItem key={order.id}>
                  <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div>
                        <Link
                          href={`/${order.restaurantSlug}`}
                          className="font-black text-lg hover:opacity-80 transition-opacity"
                          style={{ color: ACCENT }}
                        >
                          {order.restaurantName}
                        </Link>
                        <p className="text-xs text-gray-400 font-bold mt-1">
                          {new Date(order.date).toLocaleDateString('es-CO', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      <span className="font-black text-xl text-gray-900">{formatPrice(order.total)}</span>
                    </div>
                    <div className="text-sm text-gray-500 space-y-1 mb-4">
                      {order.items.map((item) => (
                        <p key={item.id} className="font-medium">
                          {item.quantity}× {item.name}
                        </p>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex gap-2 text-[10px] font-black uppercase tracking-wide text-gray-400">
                        <span className="bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                          {order.paymentMethod}
                        </span>
                        <span className="bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                          {order.deliveryMode === 'delivery' ? 'Domicilio' : 'Recoger'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => repeatOrder(order)}
                        className="cursor-pointer flex items-center gap-2 text-[10px] font-black uppercase px-4 py-2.5 rounded-2xl border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Repetir
                      </button>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </div>
      </main>
    </PageTransition>
  );
}
