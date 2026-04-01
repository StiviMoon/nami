'use client';

import { useState } from 'react';
import { X, Plus, Minus, CheckCircle2, Truck, Store, AlertCircle, ShoppingBasket } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useOrderHistory } from '@/hooks/useOrderHistory';
import { formatPrice } from '@/lib/utils';

const ACCENT = '#E85D04';

type Step = 'review' | 'checkout' | 'summary' | 'success';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  restaurantName: string;
  restaurantSlug: string;
};

const payLabel: Record<string, string> = {
  nequi: 'Nequi',
  efectivo: 'Efectivo',
  transferencia: 'Transferencia',
};

export function CartModal({ isOpen, onClose, restaurantName, restaurantSlug }: Props) {
  const cart = useCart();
  const orderHistory = useOrderHistory();
  const [step, setStep] = useState<Step>('review');
  const [deliveryType, setDeliveryType] = useState<'domicilio' | 'recoger'>('domicilio');
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    direccion: '',
    barrio: '',
    metodoPago: 'efectivo',
  });

  if (!isOpen) return null;

  const total = cart.total();
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
      return baseValid && formData.direccion.trim().length > 5 && formData.barrio.trim().length > 3;
    }
    return baseValid;
  };

  const handleFinalSubmit = () => {
    const method = payLabel[formData.metodoPago] || formData.metodoPago;
    const modeApi = deliveryType === 'domicilio' ? 'delivery' : 'recoger';
    const address =
      deliveryType === 'domicilio'
        ? `${formData.direccion.trim()}, ${formData.barrio.trim()}`
        : undefined;

    const snapshotItems = [...cart.items];
    const snapshotTotal = cart.total();

    orderHistory.addOrder({
      restaurantName,
      restaurantSlug,
      items: snapshotItems,
      total: snapshotTotal,
      paymentMethod: method,
      deliveryMode: modeApi,
    });

    const url = cart.buildWhatsAppUrl(
      method,
      modeApi,
      address,
      formData.telefono,
      formData.nombre.trim()
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
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-0 sm:p-4">
      <div className="bg-white w-full max-w-lg rounded-t-[2.5rem] sm:rounded-[2.5rem] flex flex-col max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0">
          <h3 className="font-black text-xl text-gray-900">
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
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
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
                  className={`flex-1 py-3 rounded-xl text-xs font-black flex items-center justify-center gap-2 cursor-pointer ${
                    deliveryType === 'domicilio' ? 'bg-white shadow-sm' : 'text-gray-400'
                  }`}
                  style={deliveryType === 'domicilio' ? { color: ACCENT } : undefined}
                >
                  <Truck size={16} /> DOMICILIO
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryType('recoger')}
                  className={`flex-1 py-3 rounded-xl text-xs font-black flex items-center justify-center gap-2 cursor-pointer ${
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
                  className="w-full p-4 bg-gray-50 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-orange-100"
                />
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  placeholder="Teléfono (3xx...) *"
                  className={`w-full p-4 bg-gray-50 rounded-2xl text-sm outline-none ${
                    formData.telefono && !validatePhone(formData.telefono) ? 'ring-2 ring-red-200' : ''
                  }`}
                />
                {deliveryType === 'domicilio' && (
                  <>
                    <input
                      type="text"
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleInputChange}
                      placeholder="Dirección exacta *"
                      className="w-full p-4 bg-gray-50 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-orange-100"
                    />
                    <input
                      type="text"
                      name="barrio"
                      value={formData.barrio}
                      onChange={handleInputChange}
                      placeholder="Barrio *"
                      className="w-full p-4 bg-gray-50 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-orange-100"
                    />
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
                <div className="pt-2 flex justify-between items-center font-black">
                  <span className="text-xs text-gray-800">TOTAL</span>
                  <span className="text-2xl" style={{ color: ACCENT }}>
                    {formatPrice(total)}
                  </span>
                </div>
              </div>
              {deliveryType === 'domicilio' && (
                <div className="p-4 bg-blue-50 rounded-2xl flex gap-2 border border-blue-100 items-start">
                  <AlertCircle size={16} className="text-blue-500 shrink-0" />
                  <p className="text-[10px] font-bold text-blue-700 italic">
                    El costo del domicilio será calculado por el restaurante.
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
          <div className="p-6 bg-gray-50 border-t border-gray-100 flex flex-col gap-3">
            <div className="flex justify-between items-center mb-2 px-2">
              <span className="text-[10px] font-black text-gray-400 uppercase">Subtotal</span>
              <span className="text-xl font-black" style={{ color: ACCENT }}>
                {formatPrice(total)}
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
}: {
  cartCount: number;
  total: number;
  onOpen: () => void;
}) {
  if (cartCount <= 0) return null;
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
