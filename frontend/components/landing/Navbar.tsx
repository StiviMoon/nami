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
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-xl border-b border-n-100 shadow-sm'
          : 'bg-white/80 backdrop-blur-md'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-display font-bold text-primary">
          ÑAMI
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex gap-8 items-center text-sm font-medium">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-n-600 hover:text-primary transition-colors">
              {l.label}
            </a>
          ))}
          <Link href="/login" className="text-n-600 hover:text-primary transition-colors">
            Acceder
          </Link>
          <Link
            href="/feed"
            className="bg-primary text-white px-5 py-2.5 rounded-full font-semibold hover:bg-primary-dark transition-all hover:shadow-md active:scale-[0.97]"
          >
            Ver restaurantes
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 rounded-xl text-n-600 hover:bg-n-50 transition-colors"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="md:hidden overflow-hidden border-t border-n-100 bg-white"
          >
            <div className="px-4 py-4 space-y-1">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-3 rounded-xl text-n-700 font-medium hover:bg-n-50 transition-colors"
                >
                  {l.label}
                </a>
              ))}
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 rounded-xl text-n-700 font-medium hover:bg-n-50 transition-colors"
              >
                Acceder
              </Link>
              <Link
                href="/feed"
                onClick={() => setMenuOpen(false)}
                className="block mt-2 text-center bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors"
              >
                Ver restaurantes
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
