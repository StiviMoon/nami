"use client";

import { motion } from "framer-motion";
import { ArrowRight, Instagram, MessageCircle, Send } from "lucide-react";

export default function Footer() {
  const go = (id: string) =>
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <footer>
      {/* CTA Banner */}
      <section className="py-24 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-n-900 dark:bg-n-950" />
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-nami-orange/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-nami-purple/8 rounded-full blur-[80px]" />
        </div>

        <div className="relative max-w-2xl mx-auto px-5 md:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="font-display font-800 text-3xl md:text-[2.8rem] leading-[1.1] tracking-[-0.02em] text-n-0 mb-5"
          >
            Listo para que te{" "}
            <span className="bg-gradient-to-r from-nami-orange to-nami-purple bg-clip-text text-transparent">
              encuentren
            </span>
            ?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="text-n-400 text-[16px] mb-10 max-w-md mx-auto"
          >
            Registra tu negocio hoy y sé de los primeros en recibir pedidos por WhatsApp sin pagar comisión a ÑAMI.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.14 }}
            onClick={() => go("#contacto")}
            className="group inline-flex items-center gap-2 px-7 py-4 rounded-2xl bg-nami-orange hover:bg-nami-orange-dark text-white font-semibold text-[15px] transition-all duration-300 hover:shadow-[0_8px_40px_-4px_rgba(255,122,0,0.45)] active:scale-[0.98]"
          >
            Empezar ahora
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            />
          </motion.button>
        </div>
      </section>

      {/* Footer links */}
      <div className="bg-n-950 border-t border-n-0/[0.04]">
        <div className="max-w-6xl mx-auto px-5 md:px-8 py-14">
          <div className="grid md:grid-cols-3 gap-10 md:gap-8">
            {/* Brand */}
            <div>
              <span className="font-display font-800 text-lg text-n-0 tracking-tight">
                <span className="text-nami-orange">N</span>AMI
              </span>
              <p className="mt-4 text-[13px] text-n-500 leading-relaxed max-w-xs">
                Para restaurantes y comerciantes de comida: que te encuentren y te pidan directo. Hecho en Colombia.
              </p>
            </div>

            {/* Nav */}
            <div>
              <h4 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-n-600 mb-5">
                Navegacion
              </h4>
              <div className="space-y-2.5">
                {[
                  { label: "Features", href: "#features" },
                  { label: "Planes", href: "#planes" },
                  { label: "FAQ", href: "#faq" },
                  { label: "Contacto", href: "#contacto" },
                ].map((l) => (
                  <button
                    key={l.href}
                    onClick={() => go(l.href)}
                    className="block text-[13px] text-n-500 hover:text-nami-orange transition-colors duration-200"
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Social */}
            <div>
              <h4 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-n-600 mb-5">
                Siguenos
              </h4>
              <div className="flex gap-2.5">
                {[
                  {
                    icon: Instagram,
                    label: "Instagram",
                    hover: "hover:bg-nami-orange/15 hover:text-nami-orange hover:border-nami-orange/20",
                  },
                  {
                    icon: MessageCircle,
                    label: "WhatsApp",
                    hover: "hover:bg-green-500/15 hover:text-green-400 hover:border-green-500/20",
                  },
                  {
                    icon: Send,
                    label: "TikTok",
                    hover: "hover:bg-nami-purple/15 hover:text-nami-purple hover:border-nami-purple/20",
                  },
                ].map((s) => (
                  <a
                    key={s.label}
                    href="#"
                    aria-label={s.label}
                    className={`w-9 h-9 rounded-xl border border-n-800 bg-n-900/50 flex items-center justify-center text-n-500 transition-all duration-200 active:scale-95 ${s.hover}`}
                  >
                    <s.icon size={15} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-12 pt-8 border-t border-n-0/[0.04] flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[12px] text-n-600">
              &copy; {new Date().getFullYear()} NAMI. Todos los derechos
              reservados.
            </p>
            <div className="flex gap-6">
              <a
                href="#"
                className="text-[12px] text-n-600 hover:text-n-400 transition-colors"
              >
                Privacidad
              </a>
              <a
                href="#"
                className="text-[12px] text-n-600 hover:text-n-400 transition-colors"
              >
                Terminos
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
