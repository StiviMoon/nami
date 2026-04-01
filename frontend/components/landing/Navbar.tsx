'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const links = [
  { href: '#features', label: 'Características' },
  { href: '#planes', label: 'Planes' },
  { href: '#faq', label: 'FAQ' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Desktop: floating pill */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 hidden lg:flex items-center gap-2 xl:gap-4 px-2 xl:px-3 py-2 rounded-full transition-all duration-500 max-w-[min(100vw-1.5rem,56rem)] ${
          scrolled
            ? 'bg-white/90 backdrop-blur-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-n-200/60'
            : 'bg-white/60 backdrop-blur-xl border border-n-200/40'
        }`}
      >
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="cursor-pointer px-3 xl:px-4 py-2.5 font-display font-bold text-sm xl:text-base tracking-tight text-n-900 rounded-full hover:bg-n-100/50 transition-colors duration-300 active:scale-[0.98] shrink-0"
        >
          <span className="text-primary">Ñ</span>AMI
        </button>

        <div className="w-px h-5 bg-n-200/80" />

        {links.map((l) => (
          <button
            key={l.href}
            onClick={() => go(l.href)}
            className="cursor-pointer px-3 xl:px-5 py-2.5 text-[12px] xl:text-[13px] font-medium text-n-500 hover:text-n-900 rounded-full hover:bg-n-100/60 transition-all duration-300 active:scale-[0.98] shrink-0"
          >
            {l.label}
          </button>
        ))}

        <div className="w-px h-5 bg-n-200/80" />

        <Link
          href="/login"
          className="cursor-pointer px-3 xl:px-5 py-2.5 text-[12px] xl:text-[13px] font-medium text-n-500 hover:text-n-900 rounded-full hover:bg-n-100/60 transition-all duration-300 active:scale-[0.98] shrink-0"
        >
          Acceder
        </Link>

        <Link
          href="/feed"
          className="cursor-pointer px-4 xl:px-6 py-2.5 text-[12px] xl:text-[13px] font-semibold text-white bg-primary hover:bg-primary-dark rounded-full transition-all duration-300 hover:shadow-[0_4px_20px_rgba(255,122,0,0.35)] active:scale-[0.98] shrink-0 whitespace-nowrap"
        >
          Ver restaurantes
        </Link>
      </motion.nav>

      {/* Mobile: floating pill */}
      <motion.nav
        initial={{ y: -12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-3 left-1/2 -translate-x-1/2 z-50 lg:hidden flex items-center gap-3 px-3 py-1.5 rounded-full transition-all duration-500 max-w-[calc(100vw-2rem)] ${
          scrolled
            ? 'bg-white/90 backdrop-blur-2xl shadow-[0_2px_16px_rgba(0,0,0,0.08)] border border-n-200/60'
            : 'bg-white/60 backdrop-blur-xl border border-n-200/40'
        }`}
      >
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="cursor-pointer py-1.5 font-display font-bold text-sm tracking-tight text-n-900 shrink-0"
        >
          <span className="text-primary">Ñ</span>AMI
        </button>
        <div className="w-px h-4 bg-n-200/80 shrink-0" />
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setOpen(!open)}
            className={`cursor-pointer w-8 h-8 flex items-center justify-center rounded-full shrink-0 transition-colors ${
              open ? 'bg-primary text-white' : 'bg-n-100/60 text-n-900'
            }`}
            aria-label="Menú"
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
          <Link
            href="/feed"
            className="cursor-pointer px-3 py-1.5 text-[12px] font-semibold text-white bg-primary hover:bg-primary-dark rounded-full transition-colors shrink-0 whitespace-nowrap"
          >
            Ver restaurantes
          </Link>
        </div>
      </motion.nav>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px] lg:hidden cursor-pointer"
              onClick={() => setOpen(false)}
              aria-label="Cerrar menú"
            />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="fixed left-1/2 -translate-x-1/2 top-14 z-50 w-[min(calc(100vw-2rem),280px)] lg:hidden rounded-2xl overflow-hidden bg-white/95 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-n-200/60 py-2 px-3"
            >
              {links.map((l) => (
                <button
                  key={l.href}
                  onClick={() => go(l.href)}
                  className="cursor-pointer w-full text-left px-3 py-2.5 text-[14px] font-medium text-n-700 hover:bg-n-100/80 hover:text-primary transition-colors rounded-lg"
                >
                  {l.label}
                </button>
              ))}
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="cursor-pointer block w-full text-left px-3 py-2.5 text-[14px] font-medium text-n-700 hover:bg-n-100/80 hover:text-primary transition-colors rounded-lg"
              >
                Acceder
              </Link>
              <div className="border-t border-n-100 my-2" />
              <Link
                href="/feed"
                onClick={() => setOpen(false)}
                className="cursor-pointer block w-full py-2.5 rounded-xl bg-primary text-white font-semibold text-[13px] text-center hover:bg-primary-dark transition-colors"
              >
                Ver restaurantes
              </Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
