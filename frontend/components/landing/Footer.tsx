import Link from 'next/link';

export function Footer() {
  return (
    <footer className="py-12 px-4 bg-n-900 text-n-400">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <Link href="/" className="font-display font-bold text-white text-xl">ÑAMI</Link>
        <p className="text-sm">© 2026 ÑAMI. Hecho en Yumbo, Colombia.</p>
      </div>
    </footer>
  );
}
