'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition } from '@/components/motion';
import { Button } from '@/components/ui/button';
import { Mail, Lock, ArrowRight, Star, Utensils, MapPin } from 'lucide-react';

const perks = [
  { icon: Utensils, text: 'Menú digital sin comisiones' },
  { icon: MapPin, text: 'Llega a clientes en Yumbo' },
  { icon: Star, text: 'Dashboard con métricas' },
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/api/auth/login', { email, password });
      if (res.success) {
        localStorage.setItem('token', res.data.token);
        const role = res.data.user?.role;
        const status = res.data.restaurant?.status;

        if (role === 'ADMIN') {
          router.push('/super-admin');
        } else if (status === 'ACTIVE') {
          router.push('/dashboard');
        } else {
          router.push('/pending');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition className="min-w-0 w-full overflow-x-hidden">
      <main className="min-h-screen min-h-[100dvh] flex w-full max-w-full min-w-0 overflow-x-hidden">
        {/* Left: Brand panel (desktop only) */}
        <div className="hidden lg:flex flex-col shrink-0 justify-between w-[45%] min-w-0 bg-n-900 p-12 relative overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 80%, rgba(255,122,0,0.2) 0%, transparent 50%),
                                radial-gradient(circle at 80% 20%, rgba(176,136,201,0.15) 0%, transparent 50%)`
            }}
          />
          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }}
          />

          <div className="relative z-10">
            <Link href="/" className="text-2xl font-display font-bold text-white cursor-pointer">ÑAMI</Link>
          </div>

          <div className="relative z-10">
            <h2 className="text-4xl font-display font-bold text-white leading-tight mb-4">
              Tu restaurante,<br />
              <span className="text-primary">digital y sin límites.</span>
            </h2>
            <p className="text-n-400 leading-relaxed mb-10">
              Gestiona tu menú, recibe pedidos y crece tu negocio desde un solo lugar.
            </p>
            <div className="space-y-4">
              {perks.map((p, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <p.icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-n-300 text-sm font-medium">{p.text}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="relative z-10 text-n-600 text-xs">© 2026 ÑAMI · Yumbo, Colombia</p>
        </div>

        {/* Right: Form — overflow hidden so blur decor never causes horizontal scroll */}
        <div className="flex-1 min-w-0 flex flex-col items-center justify-center px-4 sm:px-6 py-10 sm:py-12 bg-n-50 relative overflow-x-hidden overflow-y-auto">
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
            <div className="absolute -top-20 right-[-3rem] w-72 h-72 rounded-full bg-primary/10 blur-3xl sm:right-[-2rem]" />
          </div>

          <div className="w-full max-w-sm min-w-0 relative z-10">
            {/* Mobile logo */}
            <div className="lg:hidden text-center mb-8">
              <Link href="/" className="text-2xl font-display font-bold text-primary cursor-pointer">ÑAMI</Link>
            </div>

            <div className="mb-8">
              <h1 className="text-2xl font-display font-bold text-n-900 mb-1">Bienvenido de vuelta</h1>
              <p className="text-n-500 text-sm">Accede a tu dashboard de restaurante</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm border border-red-100"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className="block text-xs font-semibold mb-1.5 text-n-700 uppercase tracking-wider">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-n-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-white border border-n-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5 text-n-700 uppercase tracking-wider">Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-n-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-white border border-n-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <Button
                type="submit"
                isLoading={loading}
                className="w-full py-3.5 mt-2"
                size="lg"
              >
                Ingresar <ArrowRight className="w-4 h-4 ml-1" />
              </Button>

              <p className="text-center text-sm text-n-400 pt-2">
                ¿No tienes cuenta?{' '}
                <Link href="/register" className="text-primary font-semibold hover:underline cursor-pointer">
                  Regístrate gratis
                </Link>
              </p>
            </form>
          </div>
        </div>
      </main>
    </PageTransition>
  );
}
