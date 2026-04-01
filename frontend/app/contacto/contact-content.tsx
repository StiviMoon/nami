'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition, FadeIn, StaggerContainer, StaggerItem } from '@/components/motion';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft, Check, Star, Zap, BarChart3,
  QrCode, MessageCircle, Crown,
} from 'lucide-react';

const PRO_FEATURES = [
  { icon: Zap, title: 'Items ilimitados', desc: 'Sin límite de 10 items en tu menú' },
  { icon: Star, title: 'Destacado en feed', desc: 'Tu restaurante aparece primero' },
  { icon: QrCode, title: 'QR en alta resolución', desc: 'Descarga a 512px para impresión profesional' },
  { icon: BarChart3, title: 'Métricas', desc: 'Visitas, items populares, horarios pico' },
];

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_SALES || '573001234567';

interface ContactContentProps {
  plan?: string;
  source?: string;
}

export function ContactContent({ plan: initialPlan, source: initialSource }: ContactContentProps) {
  const plan = (initialPlan || 'pro').toLowerCase();
  const source = initialSource || 'web';

  const initialMessage = useMemo(() => {
    if (plan === 'business') {
      return 'Quiero conocer una propuesta Business para mi restaurante.';
    }
    return 'Quiero activar el plan Pro para aparecer destacado y desbloquear más funcionalidades.';
  }, [plan]);

  const [form, setForm] = useState({
    name: '',
    restaurant: '',
    email: '',
    message: initialMessage,
  });
  const [sent, setSent] = useState(false);

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = [
      'Hola, equipo ÑAMI.',
      '',
      `Soy ${form.name} de *${form.restaurant}*.`,
      `Me interesa el plan: *${plan.toUpperCase()}*.`,
      `Origen del contacto: ${source}.`,
      '',
      form.message,
      '',
      `Email: ${form.email}`,
    ].join('\n');
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    setSent(true);
  };

  const inputClass =
    'w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E85D04]/20 focus:border-[#E85D04] transition-all';

  return (
    <PageTransition>
      <main className="min-h-screen bg-gray-50 font-sans text-gray-900 antialiased">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 py-5 px-6">
          <div className="max-w-4xl mx-auto flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <Link href="/" className="text-2xl font-black italic tracking-tighter text-gray-900">
              ÑAMI <span className="text-[#E85D04]">!</span>
            </Link>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-6 py-12 space-y-16">
          {/* Pro Banner */}
          <FadeIn>
            <div className="relative bg-gray-900 rounded-[2.5rem] p-10 sm:p-14 overflow-hidden">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `radial-gradient(circle at 20% 80%, rgba(255,122,0,0.2) 0%, transparent 50%),
                    radial-gradient(circle at 80% 20%, rgba(176,136,201,0.15) 0%, transparent 50%)`,
                }}
              />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <Crown className="w-6 h-6 text-[#E85D04]" />
                  <span className="text-xs font-black uppercase tracking-widest text-[#E85D04]">
                    Plan Pro
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-3">
                  Lleva tu restaurante<br />
                  <span className="text-[#E85D04]">al siguiente nivel.</span>
                </h1>
                <p className="text-gray-400 text-sm max-w-lg">
                  Activa {plan === 'business' ? 'Business' : 'Pro'} para crecer con mas visibilidad,
                  mejor presencia y herramientas reales para vender.
                </p>
              </div>
            </div>
          </FadeIn>

          {/* Features */}
          <StaggerContainer className="grid sm:grid-cols-2 gap-6">
            {PRO_FEATURES.map((feat) => (
              <StaggerItem key={feat.title}>
                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#E85D04] flex items-center justify-center mb-3">
                    <feat.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-black text-lg mb-1">{feat.title}</h3>
                  <p className="text-sm text-gray-500">{feat.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {/* Contact Form */}
          <FadeIn>
            <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 border border-gray-100">
              <h2 className="text-2xl font-black mb-2">Contáctanos</h2>
              <p className="text-sm text-gray-500 mb-8">
                Escríbenos para activar Pro o resolver cualquier duda. Te respondemos por WhatsApp.
              </p>

              <AnimatePresence mode="wait">
                {sent ? (
                  <motion.div
                    key="sent"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-10"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                      <Check className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-black mb-2">¡Mensaje enviado!</h3>
                    <p className="text-sm text-gray-500 mb-6">
                      Se abrió WhatsApp con tu mensaje. Te responderemos pronto.
                    </p>
                    <Button variant="outline" onClick={() => setSent(false)}>
                      Enviar otro mensaje
                    </Button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onSubmit={handleSubmit}
                    className="space-y-5"
                  >
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2">Tu nombre</label>
                        <input
                          value={form.name}
                          onChange={(e) => update('name', e.target.value)}
                          required
                          className={inputClass}
                          placeholder="Juan Pérez"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Restaurante</label>
                        <input
                          value={form.restaurant}
                          onChange={(e) => update('restaurant', e.target.value)}
                          required
                          className={inputClass}
                          placeholder="El Rincón Paisa"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Email</label>
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
                      <label className="block text-sm font-semibold mb-2">Mensaje</label>
                      <textarea
                        value={form.message}
                        onChange={(e) => update('message', e.target.value)}
                        required
                        rows={4}
                        className={inputClass}
                        placeholder="Quiero activar el plan Pro / Tengo una pregunta..."
                      />
                    </div>
                    <Button type="submit" className="w-full py-3.5" size="lg">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Enviar por WhatsApp
                    </Button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </FadeIn>
        </div>
      </main>
    </PageTransition>
  );
}

export default ContactContent;
