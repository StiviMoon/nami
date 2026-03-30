'use client';

import { useCart } from '@/hooks/useCart';
import { useOrderHistory } from '@/hooks/useOrderHistory';
import { formatPrice } from '@/lib/utils';
import { Drawer } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, MessageCircle, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  restaurantSlug?: string;
  themeAccent?: string;
  themeAccentBg?: string;
  themeAccentHover?: string;
}

export function CartDrawer({ open, onClose, restaurantSlug, themeAccent, themeAccentBg, themeAccentHover }: CartDrawerProps) {
  const cart = useCart();
  const orderHistory = useOrderHistory();
  const [paymentMethod, setPaymentMethod] = useState('Nequi');
  const [deliveryMode, setDeliveryMode] = useState('delivery');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryPhone, setDeliveryPhone] = useState('');

  const needsDeliveryData = deliveryMode === 'delivery';
  const isDeliveryFormValid =
    !needsDeliveryData ||
    (deliveryAddress.trim().length >= 6 && /^\+?\d{10,15}$/.test(deliveryPhone.replace(/\s+/g, '')));

  const handleSend = () => {
    // Save to order history
    if (cart.restaurantName) {
      orderHistory.addOrder({
        restaurantName: cart.restaurantName,
        restaurantSlug: restaurantSlug || '',
        items: [...cart.items],
        total: cart.total(),
        paymentMethod,
        deliveryMode,
      });
    }

    const url = cart.buildWhatsAppUrl(paymentMethod, deliveryMode, deliveryAddress, deliveryPhone);
    window.open(url, '_blank');
    onClose();
    cart.clear();
    setDeliveryAddress('');
    setDeliveryPhone('');
  };

  return (
    <Drawer open={open} onClose={onClose} title="Tu pedido">
      <div className="p-4 sm:p-5 space-y-4 flex flex-col h-full">
        {/* Items */}
        <div className="flex-1 space-y-1">
          <AnimatePresence mode="popLayout">
            {cart.items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20, height: 0 }}
                className="flex justify-between items-center py-3 border-b border-n-100 last:border-0"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-n-800 truncate">{item.name}</p>
                  <p className="text-xs text-n-400 mt-0.5">
                    {formatPrice(item.price)} × {item.quantity}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <button
                    onClick={() => cart.decrease(item.id)}
                    className="w-9 h-9 rounded-full bg-n-100 flex items-center justify-center hover:bg-n-200 transition-colors"
                  >
                    {item.quantity === 1 ? (
                      <Trash2 className="w-3.5 h-3.5 text-red-400" />
                    ) : (
                      <Minus className="w-4 h-4" />
                    )}
                  </button>
                  <span className="font-bold w-6 text-center text-sm">{item.quantity}</span>
                  <button
                    onClick={() => cart.increase(item.id)}
                    className={`w-9 h-9 rounded-full ${themeAccentBg || 'bg-primary'} text-white flex items-center justify-center ${themeAccentHover || 'hover:bg-primary-dark'} transition-colors`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Payment method */}
        <div>
          <label className="block text-xs font-bold text-n-500 uppercase tracking-widest mb-2">Método de pago</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full border border-n-200 rounded-xl px-4 py-3 bg-n-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          >
            <option>Nequi</option>
            <option>Efectivo</option>
            <option>Transferencia</option>
            <option>Daviplata</option>
          </select>
        </div>

        {/* Delivery mode */}
        <div>
          <label className="block text-xs font-bold text-n-500 uppercase tracking-widest mb-2">Modalidad</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: 'delivery', label: '🛵 A domicilio' },
              { value: 'recoger', label: '🏪 Para recoger' },
            ].map((mode) => (
              <button
                key={mode.value}
                onClick={() => setDeliveryMode(mode.value)}
                className={`py-3 rounded-xl font-medium text-sm transition-all ${
                  deliveryMode === mode.value
                    ? `${themeAccentBg || 'bg-primary'} text-white`
                    : 'bg-n-100 text-n-600 hover:bg-n-200'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>

        {needsDeliveryData && (
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 space-y-3">
            <p className="text-xs text-n-600 font-medium">
              Para entrega a domicilio, necesitamos estos datos:
            </p>
            <div>
              <label className="block text-sm font-semibold text-n-700 mb-1.5">Dirección de entrega</label>
              <input
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Ej: Cra 4 #45-23, apto 201"
                className="w-full border border-n-200 rounded-xl px-3 py-2.5 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-n-700 mb-1.5">Teléfono de contacto</label>
              <input
                value={deliveryPhone}
                onChange={(e) => setDeliveryPhone(e.target.value)}
                placeholder="Ej: +573001112233"
                className="w-full border border-n-200 rounded-xl px-3 py-2.5 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>
        )}

        {/* Total */}
        <div className="bg-n-50 rounded-2xl p-4 flex justify-between items-center border border-n-100">
          <span className="font-display font-bold text-base text-n-700 uppercase tracking-wide">Total</span>
          <span className={`font-display font-black text-2xl ${themeAccent || 'text-primary'}`}>
            {formatPrice(cart.total())}
          </span>
        </div>

        {/* WhatsApp button */}
        <Button
          variant="whatsapp"
          size="lg"
          onClick={handleSend}
          disabled={!isDeliveryFormValid}
          icon={<MessageCircle className="w-5 h-5" />}
          className="w-full text-base py-4 rounded-2xl animate-pulse hover:animate-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Enviar pedido por WhatsApp
        </Button>
      </div>
    </Drawer>
  );
}
