'use client';

import Link from 'next/link';
import { useOrderHistory } from '@/hooks/useOrderHistory';
import { useCart } from '@/hooks/useCart';
import { useRouter } from 'next/navigation';
import { formatPrice } from '@/lib/utils';
import { PageTransition, StaggerContainer, StaggerItem } from '@/components/motion';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import { Clock, RotateCcw, ArrowLeft, Trash2 } from 'lucide-react';

export default function HistorialPage() {
  const { orders, clear } = useOrderHistory();
  const cart = useCart();
  const router = useRouter();

  const repeatOrder = (order: typeof orders[0]) => {
    cart.clear();
    for (const item of order.items) {
      for (let i = 0; i < item.quantity; i++) {
        cart.addItem(
          { id: item.id, restaurantId: item.restaurantId, name: item.name, price: item.price },
          order.restaurantName,
          ''
        );
      }
    }
    router.push(`/${order.restaurantSlug}`);
  };

  return (
    <PageTransition>
      <main className="min-h-screen bg-n-50">
        <header className="bg-white border-b border-n-100 sticky top-0 z-40">
          <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/feed" className="p-2 rounded-xl text-n-400 hover:bg-n-50 transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-xl font-display font-bold">Mis pedidos</h1>
            </div>
            {orders.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clear} icon={<Trash2 className="w-3.5 h-3.5" />}>
                Limpiar
              </Button>
            )}
          </div>
        </header>

        <div className="max-w-2xl mx-auto px-4 py-6">
          {orders.length === 0 ? (
            <EmptyState
              icon={Clock}
              title="Sin pedidos aún"
              description="Cuando hagas tu primer pedido, aparecerá aquí."
              action={
                <Link href="/feed">
                  <Button>Explorar restaurantes</Button>
                </Link>
              }
            />
          ) : (
            <StaggerContainer className="space-y-4">
              {orders.map((order) => (
                <StaggerItem key={order.id}>
                  <div className="bg-white rounded-2xl border border-n-100 p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <Link href={`/${order.restaurantSlug}`} className="font-display font-semibold text-primary hover:underline">
                          {order.restaurantName}
                        </Link>
                        <p className="text-xs text-n-400 mt-0.5">
                          {new Date(order.date).toLocaleDateString('es-CO', {
                            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
                          })}
                        </p>
                      </div>
                      <span className="font-display font-bold text-lg text-n-800">
                        {formatPrice(order.total)}
                      </span>
                    </div>
                    <div className="text-sm text-n-500 space-y-1 mb-3">
                      {order.items.map((item) => (
                        <p key={item.id}>{item.quantity}x {item.name}</p>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-n-100">
                      <div className="flex gap-2 text-xs text-n-400">
                        <span className="bg-n-50 px-2 py-1 rounded-lg">{order.paymentMethod}</span>
                        <span className="bg-n-50 px-2 py-1 rounded-lg">
                          {order.deliveryMode === 'delivery' ? 'Domicilio' : 'Recoger'}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => repeatOrder(order)}
                        icon={<RotateCcw className="w-3.5 h-3.5" />}
                      >
                        Repetir
                      </Button>
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
