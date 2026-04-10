import type { Metadata } from 'next';
import { RestaurantContent } from './restaurant-content';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ñami.app';

async function getRestaurant(slug: string) {
  try {
    const res = await fetch(`${API_URL}/api/restaurants/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const restaurant = await getRestaurant(slug);

  if (!restaurant) {
    return { title: 'Restaurante no encontrado — ÑAMI' };
  }

  const title = `${restaurant.name} — Menú y pedidos | ÑAMI`;
  const description = restaurant.description
    ? `${restaurant.description.slice(0, 150)} — Pide directo por WhatsApp sin comisiones.`
    : `Descubre el menú de ${restaurant.name} en Yumbo. Pide directo por WhatsApp.`;
  const url = `${SITE_URL}/${slug}`;
  const image = restaurant.coverUrl || restaurant.logoUrl || `${SITE_URL}/og-default.png`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: restaurant.name,
      description,
      url,
      siteName: 'ÑAMI',
      type: 'website',
      images: [{ url: image, width: 1200, height: 630, alt: restaurant.name }],
      locale: 'es_CO',
    },
    twitter: {
      card: 'summary_large_image',
      title: restaurant.name,
      description,
      images: [image],
    },
  };
}

export default async function RestaurantPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <RestaurantContent slug={slug} />;
}
