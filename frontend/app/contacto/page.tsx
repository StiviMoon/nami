import type { Metadata } from 'next';
import { ContactContent } from './contact-content';

export const metadata: Metadata = {
  title: 'Contacto — ÑAMI',
  description: 'Contáctanos para actualizar a Pro o resolver dudas. ÑAMI, menú digital para restaurantes en Yumbo.',
};

export default async function ContactoPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string; from?: string }>;
}) {
  const params = await searchParams;
  return <ContactContent plan={params.plan} source={params.from} />;
}
