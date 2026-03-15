"use client";

import { motion } from "framer-motion";
import { ArrowDown, Zap } from "lucide-react";
import PhoneMockup from "@/components/phone-mockup";

const fade = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay: 0.15 + i * 0.12,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export default function Hero() {
  const go = (id: string) =>
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 right-0 w-[500px] h-[500px] rounded-full bg-nami-orange/[0.07] dark:bg-nami-orange/[0.04] blur-[100px]" />
        <div className="absolute top-1/2 -left-40 w-[400px] h-[400px] rounded-full bg-nami-purple/[0.08] dark:bg-nami-purple/[0.04] blur-[100px]" />
        <div className="absolute bottom-0 right-1/3 w-[300px] h-[300px] rounded-full bg-nami-purple/[0.05] dark:bg-nami-purple/[0.03] blur-[80px]" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02] dark:opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(var(--color-n-900) 1px, transparent 1px), linear-gradient(90deg, var(--color-n-900) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-5 md:px-8 pt-28 pb-16 md:pt-36 md:pb-24">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Left: Copy */}
          <div>
            <motion.div
              custom={0}
              variants={fade}
              initial="hidden"
              animate="show"
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-nami-orange-subtle dark:bg-nami-orange/[0.08] border border-nami-orange/20 dark:border-nami-orange/15 mb-8"
            >
              <Zap size={13} className="text-nami-orange" />
              <span className="text-[11px] font-semibold tracking-widest uppercase text-nami-orange">
                Lanzamiento Colombia 2026
              </span>
            </motion.div>

            <motion.h1
              custom={1}
              variants={fade}
              initial="hidden"
              animate="show"
              className="font-display font-800 text-[2.6rem] leading-[1.08] md:text-[3.8rem] md:leading-[1.05] tracking-[-0.02em] text-n-900 dark:text-n-0"
            >
              Que te{" "}
              <span className="bg-gradient-to-r from-nami-orange to-nami-purple bg-clip-text text-transparent">
                encuentren
              </span>{" "}
              y pidan directo por WhatsApp
            </motion.h1>

            <motion.p
              custom={2}
              variants={fade}
              initial="hidden"
              animate="show"
              className="mt-6 text-lg md:text-[1.2rem] text-n-500 dark:text-n-400 leading-relaxed max-w-[480px]"
            >
              ÑAMI no te cobra comisión en planes Gratis y Plus. Los clientes te encuentran, piden por WhatsApp y te pagan a ti. Sin intermediarios que se queden con tu ganancia.
            </motion.p>

            <motion.div
              custom={3}
              variants={fade}
              initial="hidden"
              animate="show"
              className="mt-10 flex flex-col sm:flex-row gap-3"
            >
              <button
                onClick={() => go("#contacto")}
                className="group relative px-7 py-4 rounded-2xl bg-nami-orange text-white font-semibold text-[15px] transition-all duration-300 hover:shadow-[0_8px_30px_-4px_rgba(255,122,0,0.45)] active:scale-[0.98] overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Se uno de los primeros
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-0.5">
                    &rarr;
                  </span>
                </span>
              </button>
              <button
                onClick={() => go("#features")}
                className="px-7 py-4 rounded-2xl border border-n-200 dark:border-n-700 text-n-600 dark:text-n-300 font-medium text-[15px] hover:bg-n-50 dark:hover:bg-n-800/50 transition-all duration-300 active:scale-[0.98]"
              >
                Como funciona
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              custom={4}
              variants={fade}
              initial="hidden"
              animate="show"
              className="mt-12 flex items-center gap-8"
            >
              {[
                { value: "0%", label: "Comisión" },
                { value: "10 min", label: "Setup" },
                { value: "24/7", label: "Pedidos a tu WhatsApp" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="font-display font-700 text-xl text-n-900 dark:text-n-0">
                    {s.value}
                  </p>
                  <p className="text-xs text-n-400 dark:text-n-500 mt-0.5">
                    {s.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Phone mockup completo */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.9,
              delay: 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative hidden lg:flex items-center justify-center"
          >
            <PhoneMockup />
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-n-300 dark:text-n-600"
          >
            <ArrowDown size={18} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
