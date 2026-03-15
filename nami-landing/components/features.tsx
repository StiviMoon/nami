"use client";

import { motion } from "framer-motion";
import { Search, MessageSquare, BarChart3, type LucideIcon } from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  iconBg: string;
  iconColor: string;
}

const features: Feature[] = [
  {
    icon: Search,
    title: "Clic para encontrar",
    description:
      "Los clientes buscan tu restaurante en NAMI. Apareces primero, sin esfuerzo extra de tu parte.",
    iconBg: "bg-nami-orange/10 dark:bg-nami-orange/15",
    iconColor: "text-nami-orange",
  },
  {
    icon: MessageSquare,
    title: "Pedidos directos",
    description:
      "Sin plataformas de terceros. Recibe pedidos en tu WhatsApp. Tu controlas todo de principio a fin.",
    iconBg: "bg-nami-purple/10 dark:bg-nami-purple/15",
    iconColor: "text-nami-purple",
  },
  {
    icon: BarChart3,
    title: "Entiende tu negocio",
    description:
      "Mira que piden, cuando, quien ordena. Crece con informacion real, no con suposiciones.",
    iconBg: "bg-nami-lime/10 dark:bg-nami-lime/15",
    iconColor: "text-nami-lime dark:text-nami-lime",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center text-[11px] font-semibold tracking-[0.2em] uppercase text-nami-orange mb-3"
        >
          Como funciona
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="font-display font-800 text-3xl md:text-[2.6rem] leading-[1.1] tracking-[-0.02em] text-center text-n-900 dark:text-n-0 mb-5"
        >
          Todo para{" "}
          <span className="bg-gradient-to-r from-nami-orange to-nami-purple bg-clip-text text-transparent">
            crecer
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center text-n-400 dark:text-n-500 max-w-md mx-auto mb-14 text-[15px]"
        >
          Tres pasos simples para que tus clientes te encuentren y pidan
          directo.
        </motion.p>

        {/* Symmetric grid — all cards same height via grid stretch */}
        <div className="grid md:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.5,
                delay: i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group relative bg-n-0 dark:bg-n-800/30 border border-n-200/60 dark:border-n-700/40 rounded-[1.4rem] p-7 flex flex-col transition-all duration-300 hover:border-nami-orange/30 dark:hover:border-nami-orange/20 hover:shadow-[0_8px_40px_-12px_rgba(255,122,0,0.12)]"
            >
              {/* Step indicator */}
              <span className="absolute top-6 right-7 font-display font-800 text-5xl text-n-100 dark:text-n-800/60 select-none leading-none">
                {i + 1}
              </span>

              <div
                className={`relative w-11 h-11 rounded-xl ${f.iconBg} flex items-center justify-center mb-5`}
              >
                <f.icon size={20} className={f.iconColor} />
              </div>

              <h3 className="relative font-display font-700 text-[17px] text-n-900 dark:text-n-0 mb-2.5">
                {f.title}
              </h3>

              <p className="relative text-[14px] leading-relaxed text-n-500 dark:text-n-400 mt-auto">
                {f.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
