import Link from 'next/link';

const links = {
  Producto: [
    { label: 'Ver restaurantes', href: '/feed' },
    { label: 'Registrar negocio', href: '/register' },
    { label: 'Planes', href: '#planes' },
  ],
  Legal: [
    { label: 'Términos de uso', href: '#' },
    { label: 'Privacidad', href: '#' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-n-900 text-n-400 pt-12 sm:pt-14 md:pt-16 pb-8 sm:pb-10 px-4 sm:px-5 md:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 mb-10 md:mb-12">
          {/* Brand */}
          <div>
            <Link href="/" className="font-display font-bold text-white text-2xl">nami</Link>
            <p className="text-sm mt-3 leading-relaxed text-n-500 max-w-xs">
              La forma más fácil de descubrir y pedir comida en Yumbo, Colombia.
            </p>
          </div>

          {/* Links */}
          {Object.entries(links).map(([section, items]) => (
            <div key={section}>
              <h4 className="text-white font-semibold text-sm mb-4">{section}</h4>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="text-sm text-n-500 hover:text-white transition-colors cursor-pointer">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-n-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-n-600">© 2026 nami. Hecho con amor en Yumbo, Colombia.</p>
          <p className="text-xs text-n-600">Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
