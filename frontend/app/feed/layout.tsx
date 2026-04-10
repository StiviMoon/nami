import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Restaurantes en Yumbo — nami',
  description: 'Descubre los mejores restaurantes de Yumbo. Menú digital, pedidos por WhatsApp, sin comisiones.',
  openGraph: {
    title: 'Restaurantes en Yumbo — nami',
    description: 'Descubre los mejores restaurantes de Yumbo. Menú digital, pedidos por WhatsApp.',
    type: 'website',
    locale: 'es_CO',
  },
};

export default function FeedLayout({ children }: { children: React.ReactNode }) {
  return children;
}
