'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition } from '@/components/motion';
import { Button } from '@/components/ui/button';

const CATEGORIES = [
  'Comida Rápida', 'Corrientazo', 'Hamburguesas', 'Pizza',
  'Panadería', 'Postres', 'Asados', 'Comida Saludable',
  'Comida China', 'Heladería', 'Otro',
];

export default function RegisterPage() {
  const [form, setForm] = useState({
    email: '', password: '', restaurantName: '',
    whatsapp: '', address: '', category: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        ...form,
        whatsapp: form.whatsapp.startsWith('+57') ? form.whatsapp : `+57${form.whatsapp}`,
      };
      const res = await api.post('/api/auth/register', payload);
      if (res.success) {
        localStorage.setItem('token', res.data.token);
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'w-full border border-n-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all';

  return (
    <PageTransition>
      <main className="min-h-screen flex items-center justify-center bg-n-50 px-4 py-12 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full -translate-y-1/3 -translate-x-1/3" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-accent/5 rounded-full translate-y-1/4 translate-x-1/4" />

        <div className="w-full max-w-lg relative z-10">
          <div className="text-center mb-8">
            <Link href="/" className="text-3xl font-display font-bold text-primary">ÑAMI</Link>
            <p className="text-n-500 mt-2">Registra tu restaurante en minutos</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-sm border border-n-100 space-y-5">
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-sm font-semibold mb-2 text-n-700">Nombre del restaurante</label>
              <input
                value={form.restaurantName}
                onChange={(e) => update('restaurantName', e.target.value)}
                required
                className={inputClass}
                placeholder="El Rincón Paisa"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-n-700">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  required
                  className={inputClass}
                  placeholder="tu@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-n-700">Contraseña</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => update('password', e.target.value)}
                  required
                  minLength={8}
                  className={inputClass}
                  placeholder="Mín. 8 caracteres"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-n-700">WhatsApp</label>
              <div className="flex">
                <span className="bg-n-50 border border-r-0 border-n-200 rounded-l-xl px-3 py-3 text-n-500 text-sm flex items-center">+57</span>
                <input
                  value={form.whatsapp.replace('+57', '')}
                  onChange={(e) => update('whatsapp', e.target.value.replace(/\D/g, '').slice(0, 10))}
                  required
                  className={`${inputClass} rounded-l-none`}
                  placeholder="3001234567"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-n-700">Dirección</label>
              <input
                value={form.address}
                onChange={(e) => update('address', e.target.value)}
                required
                className={inputClass}
                placeholder="Cra 10 #50-40, Yumbo"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-n-700">Categoría</label>
              <select
                value={form.category}
                onChange={(e) => update('category', e.target.value)}
                required
                className={`${inputClass} bg-white`}
              >
                <option value="">Seleccionar...</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <Button
              type="submit"
              isLoading={loading}
              className="w-full py-3.5"
              size="lg"
            >
              Registrar restaurante
            </Button>

            <p className="text-center text-sm text-n-400">
              ¿Ya tienes cuenta?{' '}
              <Link href="/login" className="text-primary font-semibold hover:underline">
                Inicia sesión
              </Link>
            </p>
          </form>
        </div>
      </main>
    </PageTransition>
  );
}
