'use client';

import { useState } from 'react';
import {
  X,
  Plus,
  Minus,
  CheckCircle2,
  Truck,
  Store,
  AlertCircle,
  ShoppingBasket,
  MessageCircle,
} from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useOrderHistory } from '@/hooks/useOrderHistory';
import { formatPrice } from '@/lib/utils';
import type { DeliveryZone } from '@/lib/delivery-zones';

const ACCENT = '#E85D04';

/** iOS Safari hace zoom al enfocar si el texto del campo es menor de 16px; en sm+ volvemos a tamaño compacto */
const checkoutFieldClass =
  'w-full p-4 bg-gray-50 rounded-2xl text-base sm:text-sm outline-none focus:ring-2 focus:ring-orange-100';

type Step = 'review' | 'checkout' | 'summary' | 'success';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  restaurantName: string;
  restaurantSlug: string;
  /** Si hay zonas, el cliente elige una y se suma el envío al total y al mensaje de WhatsApp. */
  deliveryZones?: DeliveryZone[];
};

const payLabel: Record<string, string> = {
  nequi: 'Nequi',
  efectivo: 'Efectivo',
  transferencia: 'Transferencia',
};

export function CartModal({
  isOpen,
  onClose,
  restaurantName,
  restaurantSlug,
  deliveryZones = [],
}: Props) {
  const cart = useCart();
  const orderHistory = useOrderHistory();
  const [step, setStep] = useState<Step>('review');
  const [deliveryType, setDeliveryType] = useState<'domicilio' | 'recoger'>('domicilio');
  const [deliveryZoneKey, setDeliveryZoneKey] = useState('');
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    direccion: '',
    barrio: '',
    metodoPago: 'efectivo',
  });

  const hasDeliveryZones = deliveryZones.length > 0;
  const selectedZone =
    hasDeliveryZones && deliveryZoneKey !== ''
      ? (() => {
          const i = Number(deliveryZoneKey);
          if (!Number.isInteger(i) || i < 0 || i >= deliveryZones.length) return null;
          return deliveryZones[i] ?? null;
        })()
      : null;

  const subtotal = cart.total();
  const grandTotal =
    subtotal + (deliveryType === 'domicilio' && selectedZone ? selectedZone.price : 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validatePhone = (phone: string) => /^3\d{9}$/.test(phone);
  const isFormValid = () => {
    const baseValid =
      formData.nombre.trim().length > 2 &&
      validatePhone(formData.telefono) &&
      !!formData.metodoPago;
    if (deliveryType === 'domicilio') {
      const zoneOk = !hasDeliveryZones || !!selectedZone;
      const barrioOk = hasDeliveryZones || formData.barrio.trim().length > 3;
      return baseValid && formData.direccion.trim().length > 5 && barrioOk && zoneOk;
    }
    return baseValid;
  };

  if (!isOpen) return null;

  const handleFinalSubmit = () => {
    const method = payLabel[formData.metodoPago] || formData.metodoPago;
    const modeApi = deliveryType === 'domicilio' ? 'delivery' : 'recoger';
    const addressParts: string[] = [];
    if (deliveryType === 'domicilio') {
      if (selectedZone) addressParts.push(`Zona: ${selectedZone.name}`);
      addressParts.push(formData.direccion.trim());
      if (!hasDeliveryZones && formData.barrio.trim()) {
        addressParts.push(`Barrio: ${formData.barrio.trim()}`);
      }
    }
    const address = deliveryType === 'domicilio' ? addressParts.join(' · ') : undefined;

    const snapshotItems = [...cart.items];
    const snapshotTotal = grandTotal;

    orderHistory.addOrder({
      restaurantName,
      restaurantSlug,
      items: snapshotItems,
      total: snapshotTotal,
      paymentMethod: method,
      deliveryMode: modeApi,
    });

    const deliveryQuote =
      deliveryType === 'domicilio' && selectedZone
        ? { zoneName: selectedZone.name, fee: selectedZone.price }
        : null;

    const url = cart.buildWhatsAppUrl(
      method,
      modeApi,
      address,
      formData.telefono,
      formData.nombre.trim(),
      deliveryQuote
    );
    window.open(url, '_blank');
    cart.clear();
    setStep('success');
  };

  const resetAndClose = () => {
    onClose();
    setStep('review');
    setFormData({ nombre: '', telefono: '', direccion: '', barrio: '', metodoPago: 'efectivo' });
    setDeliveryType('domicilio');
    setDeliveryZoneKey('');
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-0 sm:p-4">
      <div
        className="bg-white flex w-full max-w-lg flex-col overflow-hidden rounded-t-[2.5rem] sm:rounded-[2.5rem] max-h-[min(92dvh,100svh)] sm:max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-modal-title"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white p-6">
          <h3 id="cart-modal-title" className="font-black text-xl text-gray-900">
            {step === 'review'
              ? 'Tu carrito'
              : step === 'checkout'
                ? 'Información'
                : step === 'summary'
                  ? 'Confirmar'
                  : '¡Éxito!'}
          </h3>
          <button type="button" onClick={resetAndClose} className="p-2 bg-gray-50 rounded-full cursor-pointer">
            <X size={20} />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain p-6 sm:p-8">
          {step === 'review' && (
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div
                  key={item.lineId}
                  className="flex justify-between items-start py-4 border-b border-gray-50 last:border-0"
                >
                  <div className="flex-1 pr-4">
                    <h4 className="font-black text-sm text-gray-900">{item.name}</h4>
                    {item.chosenExtras?.map((e) => (
                      <p key={e.id} className="text-[10px] text-green-600 font-bold mt-0.5">
                        + {e.name}
                      </p>
                    ))}
                    {item.chosenExclusions?.map((ex) => (
                      <p key={ex} className="text-[10px] text-red-500 font-bold italic mt-0.5">
                        Sin {ex}
                      </p>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-1">
                    <button
                      type="button"
                      onClick={() => cart.decrease(item.lineId)}
                      className="w-10 h-10 flex items-center justify-center bg-white rounded-lg cursor-pointer active:scale-95 transition-transform"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="font-black text-sm w-6 text-center">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => cart.increase(item.lineId)}
                      className="w-10 h-10 flex items-center justify-center bg-white rounded-lg cursor-pointer active:scale-95 transition-transform"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              ))}
              {cart.items.length === 0 && (
                <p className="text-center text-gray-400 py-10 font-bold italic uppercase tracking-widest text-xs">
                  Vacío
                </p>
              )}
            </div>
          )}
          {step === 'checkout' && (
            <div className="space-y-6">
              <div className="flex p-1 bg-gray-100 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setDeliveryType('domicilio')}
                  className={`flex min-h-12 flex-1 touch-manipulation items-center justify-center gap-2 rounded-xl py-3 text-xs font-black cursor-pointer ${
                    deliveryType === 'domicilio' ? 'bg-white shadow-sm' : 'text-gray-400'
                  }`}
                  style={deliveryType === 'domicilio' ? { color: ACCENT } : undefined}
                >
                  <Truck size={16} /> DOMICILIO
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryType('recoger')}
                  className={`flex min-h-12 flex-1 touch-manipulation items-center justify-center gap-2 rounded-xl py-3 text-xs font-black cursor-pointer ${
                    deliveryType === 'recoger' ? 'bg-white shadow-sm' : 'text-gray-400'
                  }`}
                  style={deliveryType === 'recoger' ? { color: ACCENT } : undefined}
                >
                  <Store size={16} /> RECOGER
                </button>
              </div>
              <div className="space-y-4">
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  placeholder="Nombre completo *"
                  autoComplete="name"
                  autoCapitalize="words"
                  enterKeyHint="next"
                  className={checkoutFieldClass}
                />
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  placeholder="Teléfono (3xx...) *"
                  autoComplete="tel"
                  inputMode="numeric"
                  enterKeyHint="next"
                  className={`${checkoutFieldClass} ${
                    formData.telefono && !validatePhone(formData.telefono) ? 'ring-2 ring-red-200' : ''
                  }`}
                />
                {deliveryType === 'domicilio' && (
                  <>
                    {hasDeliveryZones && (
                      <div className="space-y-2">
                        <label className="block text-[10px] font-black uppercase tracking-wider text-gray-500">
                          Zona de entrega *
                        </label>
                        <select
                          value={deliveryZoneKey}
                          onChange={(e) => setDeliveryZoneKey(e.target.value)}
                          className={`${checkoutFieldClass} appearance-none cursor-pointer`}
                        >
                          <option value="">Elige tu zona…</option>
                          {deliveryZones.map((z, idx) => (
                            <option key={`${z.name}-${idx}`} value={String(idx)}>
                              {z.name} — {formatPrice(z.price)}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    <input
                      type="text"
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleInputChange}
                      placeholder="Dirección exacta *"
                      autoComplete="street-address"
                      enterKeyHint="next"
                      className={checkoutFieldClass}
                    />
                    {!hasDeliveryZones && (
                      <input
                        type="text"
                        name="barrio"
                        value={formData.barrio}
                        onChange={handleInputChange}
                        placeholder="Barrio *"
                        autoComplete="address-level2"
                        enterKeyHint="done"
                        className={checkoutFieldClass}
                      />
                    )}
                  </>
                )}
                <div className="grid grid-cols-3 gap-2">
                  {(['nequi', 'efectivo', 'transferencia'] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setFormData({ ...formData, metodoPago: m })}
                      className={`py-3 rounded-2xl border-2 text-[10px] font-black uppercase transition-all cursor-pointer ${
                        formData.metodoPago === m
                          ? 'border-[#E85D04] bg-orange-50 text-[#E85D04]'
                          : 'border-gray-50 text-gray-400'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          {step === 'summary' && (
            <div className="space-y-6">
              <div className="bg-orange-50 p-6 rounded-[2rem] space-y-3 border border-orange-100/80">
                {cart.items.map((item) => (
                  <div key={item.lineId} className="flex flex-col border-b border-orange-100 pb-2 last:border-0">
                    <div className="flex justify-between text-sm font-black text-gray-900">
                      <span>
                        {item.quantity}x {item.name}
                      </span>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                    {item.chosenExtras?.map((e) => (
                      <span key={e.id} className="text-[9px] text-green-600 font-bold ml-4">
                        + {e.name}
                      </span>
                    ))}
                    {item.chosenExclusions?.map((ex) => (
                      <span key={ex} className="text-[9px] text-red-500 font-bold italic ml-4">
                        Sin {ex}
                      </span>
                    ))}
                  </div>
                ))}
                <div className="space-y-2 border-t border-orange-100 pt-3">
                  <div className="flex justify-between text-xs font-bold text-gray-700">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  {deliveryType === 'domicilio' && selectedZone ? (
                    <div className="flex justify-between text-xs font-bold text-gray-700">
                      <span>Envío ({selectedZone.name})</span>
                      <span>{formatPrice(selectedZone.price)}</span>
                    </div>
                  ) : null}
                  <div className="flex justify-between items-center font-black pt-1">
                    <span className="text-xs text-gray-800">TOTAL</span>
                    <span className="text-2xl" style={{ color: ACCENT }}>
                      {formatPrice(
                        deliveryType === 'domicilio' && selectedZone ? grandTotal : subtotal
                      )}
                    </span>
                  </div>
                </div>
              </div>
              {deliveryType === 'domicilio' && !hasDeliveryZones && (
                <div className="p-4 bg-blue-50 rounded-2xl flex gap-2 border border-blue-100 items-start">
                  <AlertCircle size={16} className="text-blue-500 shrink-0" />
                  <p className="text-[10px] font-bold text-blue-700 italic">
                    El costo del domicilio lo confirma el restaurante al recibir tu pedido.
                  </p>
                </div>
              )}
              {deliveryType === 'domicilio' && hasDeliveryZones && !selectedZone && (
                <div className="p-4 bg-amber-50 rounded-2xl flex gap-2 border border-amber-100 items-start">
                  <AlertCircle size={16} className="text-amber-600 shrink-0" />
                  <p className="text-[10px] font-bold text-amber-900">
                    Elige una zona en el paso anterior para ver el envío aquí.
                  </p>
                </div>
              )}
            </div>
          )}
          {step === 'success' && (
            <div className="p-12 text-center flex flex-col items-center gap-6">
              <CheckCircle2 size={64} className="text-green-500" />
              <h3 className="text-3xl font-black text-gray-900">¡Pedido enviado!</h3>
              <p className="text-sm text-gray-500">Te abrimos WhatsApp para que el restaurante reciba tu mensaje.</p>
              <button
                type="button"
                onClick={resetAndClose}
                className="w-full py-5 bg-gray-900 text-white font-black rounded-2xl uppercase text-xs cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          )}
        </div>
        {step !== 'success' && (
          <div className="flex flex-col gap-3 border-t border-gray-100 bg-gray-50 p-6 pb-[max(1.5rem,var(--safe-bottom))] sm:pb-6">
            <div className="flex justify-between items-center mb-2 px-2">
              <span className="text-[10px] font-black text-gray-400 uppercase">
                {step === 'summary' && deliveryType === 'domicilio' && selectedZone
                  ? 'Total estimado'
                  : 'Subtotal'}
              </span>
              <span className="text-xl font-black" style={{ color: ACCENT }}>
                {formatPrice(
                  step === 'summary' && deliveryType === 'domicilio' && selectedZone
                    ? grandTotal
                    : subtotal
                )}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {step === 'review' ? (
                <>
                  <button
                    type="button"
                    onClick={() => cart.clear()}
                    className="py-4 border-2 font-black text-xs rounded-2xl uppercase text-gray-400 cursor-pointer"
                  >
                    Limpiar
                  </button>
                  <button
                    type="button"
                    disabled={cart.items.length === 0}
                    onClick={() => setStep('checkout')}
                    className="py-4 text-white font-black text-xs rounded-2xl uppercase shadow-lg disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                    style={{ backgroundColor: ACCENT, boxShadow: '0 10px 15px -3px rgba(232, 93, 4, 0.25)' }}
                  >
                    Siguiente
                  </button>
                </>
              ) : step === 'checkout' ? (
                <>
                  <button
                    type="button"
                    onClick={() => setStep('review')}
                    className="py-4 border-2 font-black text-xs rounded-2xl uppercase text-gray-400 cursor-pointer"
                  >
                    Atrás
                  </button>
                  <button
                    type="button"
                    disabled={!isFormValid()}
                    onClick={() => setStep('summary')}
                    className="py-4 bg-gray-900 text-white font-black text-xs rounded-2xl uppercase shadow-lg disabled:opacity-30 cursor-pointer"
                  >
                    Confirmar
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setStep('checkout')}
                    className="py-4 border-2 font-black text-xs rounded-2xl uppercase text-gray-400 cursor-pointer"
                  >
                    Atrás
                  </button>
                  <button
                    type="button"
                    onClick={handleFinalSubmit}
                    className="py-4 text-white font-black text-xs rounded-2xl uppercase cursor-pointer"
                    style={{ backgroundColor: ACCENT, boxShadow: '0 10px 15px -3px rgba(232, 93, 4, 0.25)' }}
                  >
                    Hacer pedido
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function CartFloatingBarUix({
  cartCount,
  total,
  onOpen,
  variant = 'dark',
}: {
  cartCount: number;
  total: number;
  onOpen: () => void;
  variant?: 'dark' | 'whatsapp';
}) {
  if (cartCount <= 0) return null;

  if (variant === 'whatsapp') {
    return (
      <div
        className="fixed left-0 right-0 z-50 flex justify-center px-4 pointer-events-none"
        style={{ bottom: 'calc(1.5rem + var(--safe-bottom))' }}
      >
        <button
          type="button"
          onClick={onOpen}
          className="pointer-events-auto flex w-full max-w-md items-center justify-between rounded-2xl border border-[#20bd5a] bg-[#25D366] p-4 text-white shadow-[0_8px_30px_rgba(37,211,102,0.3)] transition-transform hover:scale-[1.02] hover:bg-[#20bd5a] active:scale-[0.99] cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-sm font-bold">
              {cartCount}
            </div>
            <span className="flex items-center gap-2 font-bold">
              <MessageCircle size={20} aria-hidden />
              Pedir por WhatsApp
            </span>
          </div>
          <span className="text-lg font-bold tracking-wide">{formatPrice(total)}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed left-0 right-0 flex justify-center z-50 px-6" style={{ bottom: 'calc(1.5rem + var(--safe-bottom))' }}>
      <button
        type="button"
        onClick={onOpen}
        className="w-full max-w-lg bg-gray-900 text-white flex justify-between items-center p-2 pl-6 rounded-[2rem] shadow-2xl transition-all active:scale-95 cursor-pointer group"
      >
        <div className="text-left">
          <span className="text-[9px] uppercase font-black text-gray-500 block group-hover:text-orange-400">
            Ver carrito
          </span>
          <span className="font-black text-lg">
            {cartCount} {cartCount === 1 ? 'plato' : 'platos'}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-black text-xl">{formatPrice(total)}</span>
          <div className="p-4 rounded-full" style={{ backgroundColor: '#E85D04' }}>
            <ShoppingBasket size={24} />
          </div>
        </div>
      </button>
    </div>
  );
}
