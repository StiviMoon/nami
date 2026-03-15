"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";

const links = [
  { label: "Features", href: "#features" },
  { label: "Planes", href: "#planes" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Desktop: floating pill navbar — más espacio y UX refinada */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed top-4 left-1/2 -translate-x-1/2 z-50 hidden md:flex items-center gap-4 px-3 py-2 rounded-full transition-all duration-500",
          scrolled
            ? "bg-white/80 dark:bg-n-900/80 backdrop-blur-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.25)] border border-n-200/50 dark:border-n-700/50"
            : "bg-white/50 dark:bg-n-900/50 backdrop-blur-xl border border-n-200/40 dark:border-n-700/40"
        )}
      >
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="px-4 py-2.5 font-display font-800 text-base tracking-tight text-n-900 dark:text-n-0 rounded-full hover:bg-n-100/50 dark:hover:bg-n-800/40 transition-colors duration-300 active:scale-[0.98]"
        >
          <span className="text-nami-orange">N</span>AMI
        </button>

        {/* Divider */}
        <div className="w-px h-5 bg-n-200/80 dark:bg-n-700/80" />

        {/* Links */}
        {links.map((l) => (
          <button
            key={l.href}
            onClick={() => go(l.href)}
            className="px-5 py-2.5 text-[13px] font-medium text-n-500 dark:text-n-400 hover:text-n-900 dark:hover:text-n-0 rounded-full hover:bg-n-100/60 dark:hover:bg-n-800/50 transition-all duration-300 active:scale-[0.98]"
          >
            {l.label}
          </button>
        ))}

        {/* Divider */}
        <div className="w-px h-5 bg-n-200/80 dark:bg-n-700/80" />

        {/* Toggle modo claro/oscuro */}
        <button
          type="button"
          onClick={toggleTheme}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-n-100/60 dark:bg-n-800/60 text-n-600 dark:text-n-300 hover:bg-n-200/60 dark:hover:bg-n-700/50 transition-all duration-300 active:scale-95"
          aria-label={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* CTA */}
        <button
          onClick={() => go("#contacto")}
          className="px-6 py-2.5 text-[13px] font-semibold text-white bg-nami-orange hover:bg-nami-orange-dark rounded-full transition-all duration-300 hover:shadow-[0_4px_20px_rgba(255,122,0,0.35)] active:scale-[0.98]"
        >
          Unete
        </button>
      </motion.nav>

      {/* Mobile: floating pill — centrada, espacio repartido, botones separados */}
      <motion.nav
        initial={{ y: -12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed top-3 left-1/2 -translate-x-1/2 z-50 md:hidden flex items-center gap-3 px-3 py-1.5 rounded-full transition-all duration-500 overflow-hidden max-w-[calc(100vw-2rem)]",
          scrolled
            ? "bg-white/80 dark:bg-n-900/80 backdrop-blur-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.25)] border border-n-200/50 dark:border-n-700/50"
            : "bg-white/50 dark:bg-n-900/50 backdrop-blur-xl border border-n-200/40 dark:border-n-700/40"
        )}
      >
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="pl-0.5 pr-0 py-1.5 font-display font-800 text-sm tracking-tight text-n-900 dark:text-n-0 shrink-0"
        >
          <span className="text-nami-orange">N</span>AMI
        </button>
        <div className="w-px h-4 bg-n-200/80 dark:bg-n-700/80 shrink-0" />
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={toggleTheme}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-n-100/50 dark:bg-n-800/50 text-n-600 dark:text-n-400 shrink-0"
            aria-label={theme === "dark" ? "Modo claro" : "Modo oscuro"}
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            onClick={() => setOpen(!open)}
            className={cn(
              "w-8 h-8 flex items-center justify-center rounded-full shrink-0 transition-colors",
              open
                ? "bg-nami-orange text-white"
                : "bg-n-100/50 dark:bg-n-800/50 text-n-900 dark:text-n-0"
            )}
            aria-label="Menu"
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
          <button
            onClick={() => go("#contacto")}
            className="pr-2.5 pl-2.5 py-1.5 text-[12px] font-semibold text-white bg-nami-orange hover:bg-nami-orange-dark rounded-full transition-colors shrink-0 whitespace-nowrap"
          >
            Unete
          </button>
        </div>
      </motion.nav>

      {/* Mobile: menú desplegable flotante */}
      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-40 bg-black/20 dark:bg-black/40 backdrop-blur-[2px] md:hidden cursor-pointer"
              onClick={() => setOpen(false)}
              aria-label="Cerrar menú"
            />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="fixed left-1/2 -translate-x-1/2 top-14 z-50 w-[min(calc(100vw-2rem),248px)] md:hidden rounded-2xl overflow-hidden bg-white/95 dark:bg-n-900/95 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-n-200/60 dark:border-n-700/50 py-2 px-3"
            >
              {links.map((l) => (
                <button
                  key={l.href}
                  onClick={() => go(l.href)}
                  className="w-full text-left px-3 py-2.5 text-[14px] font-medium text-n-700 dark:text-n-200 hover:bg-n-100/80 dark:hover:bg-n-800/80 hover:text-nami-orange transition-colors rounded-lg"
                >
                  {l.label}
                </button>
              ))}
              <div className="border-t border-n-100 dark:border-n-800 my-2" />
              <button
                onClick={() => go("#contacto")}
                className="w-full py-2.5 rounded-xl bg-nami-orange text-white font-semibold text-[13px] text-center hover:bg-nami-orange-dark transition-colors"
              >
                Unete ahora
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
