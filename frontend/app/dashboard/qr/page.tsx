'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { queryKeys } from '@/lib/queryKeys';
import {
  Copy,
  ExternalLink,
  Download,
  Printer,
  QrCode,
  Link2,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { useRef, useCallback, useMemo } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/toast';
import { PageTransition, FadeIn } from '@/components/motion';

type LogoDataResponse = { success: boolean; data: { dataUrl: string | null } };

function inlineLogoInSvg(svg: SVGSVGElement, dataUrl: string | null) {
  if (!dataUrl) return;
  svg.querySelectorAll('image').forEach((node) => {
    node.setAttribute('href', dataUrl);
    node.removeAttributeNS('http://www.w3.org/1999/xlink', 'href');
  });
}

export default function QRPage() {
  const qrRef = useRef<HTMLDivElement>(null);
  const printRef = useRef<HTMLDivElement>(null);
  const qc = useQueryClient();

  const { data: res, isLoading } = useQuery({
    queryKey: queryKeys.dashboard.restaurant,
    queryFn: () => api.get<{ success: boolean; data: Record<string, unknown> }>('/api/dashboard/restaurant'),
  });

  const restaurant = res?.data as
    | {
        slug?: string;
        name?: string;
        primaryColor?: string | null;
        logoUrl?: string | null;
        plan?: string;
      }
    | undefined;

  const { data: logoDataUrl, isLoading: logoLoading } = useQuery({
    queryKey: [...queryKeys.dashboard.restaurant, 'logo-data'] as const,
    queryFn: async () => {
      const json = await api.get<LogoDataResponse>('/api/dashboard/restaurant/logo-data');
      return json.data?.dataUrl ?? null;
    },
    enabled: !!restaurant?.logoUrl?.trim(),
    staleTime: 5 * 60 * 1000,
  });

  const url = useMemo(() => {
    if (typeof window === 'undefined' || !restaurant?.slug) return '';
    return `${window.location.origin}/${restaurant.slug}`;
  }, [restaurant?.slug]);

  const qrColor = restaurant?.primaryColor?.trim() || '#FF7A00';
  const isPro = restaurant?.plan === 'PRO';

  /** Para el QR en pantalla: data URL evita CORS al exportar; si aún carga, URL pública como respaldo visual. */
  const qrLogoSrc = logoDataUrl ?? restaurant?.logoUrl?.trim() ?? undefined;

  const copyLink = () => {
    if (!url) return;
    void navigator.clipboard.writeText(url);
    toast('Link copiado', 'success');
  };

  const downloadQR = useCallback(async () => {
    const svgEl = qrRef.current?.querySelector('svg');
    if (!svgEl || !restaurant?.slug) return;

    let inline = logoDataUrl;
    if (restaurant.logoUrl?.trim() && !inline) {
      try {
        inline = await qc.fetchQuery({
          queryKey: [...queryKeys.dashboard.restaurant, 'logo-data'] as const,
          queryFn: async () => {
            const json = await api.get<LogoDataResponse>('/api/dashboard/restaurant/logo-data');
            return json.data?.dataUrl ?? null;
          },
        });
      } catch {
        inline = null;
      }
    }

    const svg = svgEl.cloneNode(true) as SVGSVGElement;
    inlineLogoInSvg(svg, inline ?? null);

    const qrSize = isPro ? 512 : 280;
    const padding = 72;
    const headerHeight = 96;
    const footerHeight = 72;
    const totalWidth = qrSize + padding * 2;
    const totalHeight = qrSize + padding * 2 + headerHeight + footerHeight;

    const serializer = new XMLSerializer();
    const svgData = serializer.serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const objectUrl = URL.createObjectURL(svgBlob);

    const canvas = document.createElement('canvas');
    const scale = 2;
    canvas.width = totalWidth * scale;
    canvas.height = totalHeight * scale;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      URL.revokeObjectURL(objectUrl);
      toast('No se pudo crear el canvas', 'error');
      return;
    }

    ctx.scale(scale, scale);

    const img = new window.Image();
    img.decoding = 'async';

    const cleanup = () => URL.revokeObjectURL(objectUrl);

    img.onload = () => {
      try {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, totalWidth, totalHeight);

        ctx.fillStyle = qrColor;
        ctx.fillRect(0, 0, totalWidth, 5);

        ctx.fillStyle = '#0F172A';
        ctx.textAlign = 'center';
        ctx.font = `bold ${isPro ? 28 : 22}px system-ui, -apple-system, "Segoe UI", sans-serif`;
        ctx.fillText(restaurant.name?.trim() || 'Mi restaurante', totalWidth / 2, headerHeight * 0.45);

        ctx.fillStyle = '#64748B';
        ctx.font = `${isPro ? 16 : 13}px system-ui, -apple-system, sans-serif`;
        ctx.fillText('Escanea para ver el menú', totalWidth / 2, headerHeight * 0.72);

        const qrY = headerHeight + padding * 0.35;
        ctx.drawImage(img, padding, qrY, qrSize, qrSize);

        const footerY = qrY + qrSize + 18;
        ctx.fillStyle = '#94A3B8';
        ctx.font = `600 ${isPro ? 13 : 11}px system-ui, sans-serif`;
        const urlShort = url.replace(/^https?:\/\//, '');
        ctx.fillText(urlShort, totalWidth / 2, footerY);

        ctx.fillStyle = qrColor;
        ctx.font = `800 ${isPro ? 15 : 12}px system-ui, sans-serif`;
        ctx.fillText('nami', totalWidth / 2, footerY + 26);

        ctx.strokeStyle = '#E2E8F0';
        ctx.lineWidth = 2;
        ctx.strokeRect(1, 1, totalWidth - 2, totalHeight - 2);

        const link = document.createElement('a');
        link.download = `${restaurant.slug}-nami-qr.png`;
        link.href = canvas.toDataURL('image/png', 1);
        link.click();
        toast('QR descargado con buena calidad', 'success');
      } catch {
        toast('No se pudo exportar el PNG (¿logo o red?)', 'error');
      } finally {
        cleanup();
      }
    };

    img.onerror = () => {
      cleanup();
      toast('No se pudo rasterizar el QR. Recarga e inténtalo de nuevo.', 'error');
    };

    img.src = objectUrl;
  }, [restaurant, qrColor, url, isPro, logoDataUrl, qc]);

  const handlePrint = useCallback(() => {
    const el = printRef.current;
    if (!el || !restaurant) return;
    const w = window.open('', '_blank');
    if (!w) {
      toast('Permite ventanas emergentes para imprimir', 'error');
      return;
    }
    w.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>QR ${restaurant.name || ''}</title>
        <meta charset="utf-8" />
        <style>
          body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; font-family: system-ui, sans-serif; background: #f8fafc; }
          .card { text-align: center; padding: 48px 40px; border: 2px solid #E2E8F0; border-radius: 28px; max-width: 420px; background: #fff; box-shadow: 0 20px 50px -12px rgba(15,23,42,0.12); }
          .brand-line { height: 5px; background: ${qrColor}; border-radius: 3px; margin-bottom: 28px; }
          h2 { margin: 0 0 8px; font-size: 26px; color: #0F172A; font-weight: 800; letter-spacing: -0.02em; }
          .sub { color: #64748B; font-size: 14px; margin-bottom: 28px; }
          .qr { display: inline-block; line-height: 0; }
          .qr svg { display: block; }
          .url { color: #94A3B8; font-size: 11px; margin-top: 20px; font-weight: 600; word-break: break-all; }
          .nami { color: ${qrColor}; font-size: 14px; font-weight: 800; margin-top: 14px; letter-spacing: 0.08em; }
          @media print { body { background: #fff; } .card { box-shadow: none; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="brand-line"></div>
          <h2>${(restaurant.name || '').replace(/</g, '')}</h2>
          <p class="sub">Escanea para ver el menú</p>
          <div class="qr">${el.innerHTML}</div>
          <p class="url">${url.replace(/^https?:\/\//, '')}</p>
          <p class="nami">nami</p>
        </div>
        <script>window.onload=function(){window.print();setTimeout(function(){window.close();},250);}<\/script>
      </body>
      </html>
    `);
    w.document.close();
  }, [restaurant, qrColor, url]);

  if (isLoading || !restaurant) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-36 w-full rounded-3xl" />
        <Skeleton className="h-64 w-full rounded-3xl" />
        <Skeleton className="h-96 w-full rounded-3xl" />
      </div>
    );
  }

  if (!restaurant.slug) {
    return (
      <PageTransition>
        <div className="rounded-3xl border-2 border-amber-200/80 bg-amber-50/90 p-8 text-center">
          <AlertCircle className="mx-auto mb-3 h-10 w-10 text-amber-600" />
          <p className="font-display text-lg font-bold text-n-900">Falta la URL de tu restaurante</p>
          <p className="mt-2 text-sm text-n-600">Guarda el perfil con un nombre válido para generar el enlace público.</p>
          <Link
            href="/dashboard/perfil"
            className="mt-6 inline-flex h-10 items-center justify-center rounded-xl border border-n-200 bg-primary px-4 text-sm font-medium text-white shadow-sm transition-all hover:bg-primary-dark"
          >
            Ir a perfil
          </Link>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-8 pb-6">
        <FadeIn>
          <div className="relative overflow-hidden rounded-3xl border-2 border-n-200/90 bg-linear-to-br from-primary/12 via-white to-n-50/90 p-6 shadow-sm sm:p-8">
            <div className="pointer-events-none absolute -right-8 -top-12 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
            <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Comparte tu menú</p>
                <h1 className="mt-1 font-display text-2xl font-black tracking-tight text-n-900 sm:text-3xl">
                  Link y código QR
                </h1>
                <p className="mt-2 max-w-xl text-sm text-n-500">
                  Descarga un PNG listo para imprimir; el logo va incrustado para que no falle por CORS.
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2">
                <Link
                  href="/dashboard/perfil"
                  className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-n-200 px-3 text-sm font-medium text-n-700 transition-all hover:border-n-300 hover:bg-n-50"
                >
                  Editar perfil
                </Link>
                <Link
                  href="/dashboard/menu"
                  className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-n-200 px-3 text-sm font-medium text-n-700 transition-all hover:border-n-300 hover:bg-n-50"
                >
                  Editar menú
                </Link>
              </div>
            </div>
          </div>
        </FadeIn>

        <FadeIn>
          <div className="overflow-hidden rounded-3xl border-2 border-n-200/85 bg-white shadow-[0_2px_14px_rgba(15,23,42,0.045)]">
            <div className="border-b border-n-100 bg-linear-to-r from-n-50/80 to-white px-5 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/12 text-primary">
                  <Link2 className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <h2 className="font-display text-base font-black text-n-900 sm:text-lg">Tu página pública</h2>
                  <p className="text-xs text-n-500">Mismo enlace que abren tus clientes desde el feed</p>
                </div>
              </div>
            </div>
            <div className="space-y-4 p-5 sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
                <code className="flex min-h-[52px] flex-1 items-center truncate rounded-2xl border-2 border-n-200/90 bg-n-50/80 px-4 py-3 text-sm font-medium text-n-800">
                  {url}
                </code>
                <div className="flex shrink-0 gap-2">
                  <Button type="button" onClick={copyLink} icon={<Copy className="h-4 w-4" />}>
                    Copiar
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => window.open(url, '_blank')}
                    icon={<ExternalLink className="h-4 w-4" />}
                  >
                    Abrir
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        <FadeIn>
          <div className="overflow-hidden rounded-3xl border-2 border-n-200/85 bg-white shadow-[0_2px_14px_rgba(15,23,42,0.045)]">
            <div className="border-b border-n-100 bg-linear-to-r from-n-50/80 to-white px-5 py-4 sm:px-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/12 text-primary">
                    <QrCode className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <h2 className="font-display text-base font-black text-n-900 sm:text-lg">Código QR</h2>
                    <p className="text-xs text-n-500">
                      {restaurant.logoUrl
                        ? logoLoading
                          ? 'Incrustando logo para descarga…'
                          : logoDataUrl
                            ? 'Logo listo para PNG e impresión'
                            : 'Sin logo en data URL; revisa que la imagen sea accesible'
                        : 'Sin logo en el centro (súbelo en perfil)'}
                    </p>
                  </div>
                </div>
                {isPro && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary">
                    <Sparkles className="h-3.5 w-3.5" />
                    Alta resolución
                  </span>
                )}
              </div>
            </div>

            <div className="p-5 sm:p-8">
              <div className="mx-auto max-w-md rounded-3xl border-2 border-n-200/80 bg-linear-to-b from-n-50/90 to-white p-6 text-center shadow-inner sm:p-8">
                <motion.div
                  className="inline-block rounded-3xl border-2 border-white bg-white p-6 shadow-md shadow-n-900/5 sm:p-8"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  <div className="mb-4 h-1.5 rounded-full" style={{ backgroundColor: qrColor }} />
                  <p className="font-display text-lg font-black text-n-900">{restaurant.name}</p>
                  <p className="mb-5 text-xs text-n-400">Escanea para ver el menú</p>

                  <div ref={qrRef} className="flex justify-center">
                    <div ref={printRef}>
                      <QRCodeSVG
                        value={url}
                        size={isPro ? 220 : 200}
                        fgColor={qrColor}
                        bgColor="#FFFFFF"
                        level="H"
                        includeMargin={false}
                        imageSettings={
                          qrLogoSrc
                            ? {
                                src: qrLogoSrc,
                                height: isPro ? 48 : 42,
                                width: isPro ? 48 : 42,
                                excavate: true,
                              }
                            : undefined
                        }
                      />
                    </div>
                  </div>

                  <p className="mt-5 text-[10px] font-semibold tracking-wide text-n-300">
                    {url.replace(/^https?:\/\//, '')}
                  </p>
                  <p className="mt-2 text-xs font-black tracking-widest" style={{ color: qrColor }}>
                    nami
                  </p>
                </motion.div>

                <p className="mt-6 text-sm text-n-500">
                  Imprime o descarga y úsalo en mesas, caja o volantes.
                </p>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <Button
                    type="button"
                    onClick={() => void downloadQR()}
                    disabled={!!restaurant.logoUrl?.trim() && logoLoading}
                    icon={<Download className="h-4 w-4" />}
                  >
                    {logoLoading ? 'Preparando logo…' : `Descargar PNG (${isPro ? 'HD' : 'estándar'})`}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrint}
                    icon={<Printer className="h-4 w-4" />}
                  >
                    Imprimir
                  </Button>
                </div>
                {!isPro && (
                  <p className="mt-4 text-xs text-n-400">
                    Con <span className="font-semibold text-n-600">Plan Pro</span> el PNG sale más grande y nítido para carteles.
                  </p>
                )}
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </PageTransition>
  );
}
