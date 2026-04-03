'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Copy, ExternalLink, Download, Printer } from 'lucide-react';
import { useRef, useCallback } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/toast';
import { PageTransition, FadeIn } from '@/components/motion';

async function urlToDataUrl(imageUrl: string): Promise<string | null> {
  try {
    const res = await fetch(imageUrl, { mode: 'cors' });
    if (!res.ok) return null;
    const blob = await res.blob();
    return await new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = () => resolve(fr.result as string);
      fr.onerror = () => reject(new Error('read'));
      fr.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

export default function QRPage() {
  const qrRef = useRef<HTMLDivElement>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['my-restaurant'],
    queryFn: () => api.get('/api/dashboard/restaurant'),
  });

  const restaurant = data?.data;

  const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/${restaurant?.slug}`;
  const qrColor = restaurant?.primaryColor || '#FF7A00';

  const copyLink = () => {
    navigator.clipboard.writeText(url);
    toast('Link copiado', 'success');
  };

  const downloadQR = useCallback(async () => {
    const svgEl = qrRef.current?.querySelector('svg');
    if (!svgEl || !restaurant) return;

    const svg = svgEl.cloneNode(true) as SVGSVGElement;
    if (restaurant.logoUrl) {
      const dataUrl = await urlToDataUrl(restaurant.logoUrl);
      if (dataUrl) {
        svg.querySelectorAll('image').forEach((node) => {
          const href =
            node.getAttribute('href') || node.getAttributeNS('http://www.w3.org/1999/xlink', 'href');
          if (href) {
            node.setAttribute('href', dataUrl);
            node.removeAttributeNS('http://www.w3.org/1999/xlink', 'href');
          }
        });
      }
    }

    const isPro = restaurant.plan === 'PRO';
    const qrSize = isPro ? 512 : 256;
    const padding = 80;
    const headerHeight = 100;
    const footerHeight = 80;
    const totalWidth = qrSize + padding * 2;
    const totalHeight = qrSize + padding * 2 + headerHeight + footerHeight;

    const canvas = document.createElement('canvas');
    canvas.width = totalWidth;
    canvas.height = totalHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new window.Image();
    img.onload = () => {
      // Background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, totalWidth, totalHeight);

      // Brand header
      ctx.fillStyle = qrColor;
      ctx.fillRect(0, 0, totalWidth, 6);

      // Restaurant name
      ctx.fillStyle = '#0F172A';
      ctx.textAlign = 'center';
      ctx.font = `bold ${isPro ? 32 : 24}px system-ui, -apple-system, sans-serif`;
      ctx.fillText(
        restaurant.name || 'Mi Restaurante',
        totalWidth / 2,
        padding / 2 + headerHeight / 2,
      );

      // Subtitle
      ctx.fillStyle = '#94A3B8';
      ctx.font = `${isPro ? 18 : 14}px system-ui, -apple-system, sans-serif`;
      ctx.fillText('Escanea para ver el menú', totalWidth / 2, padding / 2 + headerHeight / 2 + 30);

      // QR
      ctx.drawImage(img, padding, headerHeight + padding / 2, qrSize, qrSize);

      // Footer
      const footerY = headerHeight + padding / 2 + qrSize + 20;
      ctx.fillStyle = '#CBD5E1';
      ctx.font = `bold ${isPro ? 14 : 11}px system-ui, -apple-system, sans-serif`;
      ctx.fillText(url.replace(/^https?:\/\//, ''), totalWidth / 2, footerY + 10);

      // ÑAMI branding
      ctx.fillStyle = qrColor;
      ctx.font = `bold ${isPro ? 16 : 12}px system-ui, -apple-system, sans-serif`;
      ctx.fillText('ÑAMI', totalWidth / 2, footerY + 40);

      // Border
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 2;
      ctx.strokeRect(1, 1, totalWidth - 2, totalHeight - 2);

      const link = document.createElement('a');
      link.download = `${restaurant.slug || 'qr'}-nami-printable.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast('QR descargado', 'success');
    };
    img.onerror = () => toast('No se pudo generar el PNG del QR', 'error');
    img.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgData)))}`;
  }, [restaurant, qrColor, url]);

  const handlePrint = useCallback(() => {
    const el = printRef.current;
    if (!el) return;
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>QR ${restaurant?.name || ''}</title>
        <style>
          body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; font-family: system-ui, sans-serif; }
          .card { text-align: center; padding: 60px; border: 2px solid #E2E8F0; border-radius: 24px; max-width: 400px; }
          .brand-line { height: 4px; background: ${qrColor}; border-radius: 2px; margin-bottom: 32px; }
          h2 { margin: 0 0 8px; font-size: 28px; color: #0F172A; }
          .sub { color: #94A3B8; font-size: 14px; margin-bottom: 32px; }
          .qr { display: inline-block; }
          .url { color: #CBD5E1; font-size: 12px; margin-top: 24px; font-weight: 600; }
          .nami { color: ${qrColor}; font-size: 14px; font-weight: 800; margin-top: 16px; }
          @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="brand-line"></div>
          <h2>${restaurant?.name || ''}</h2>
          <p class="sub">Escanea para ver el menú</p>
          <div class="qr">${el.innerHTML}</div>
          <p class="url">${url.replace(/^https?:\/\//, '')}</p>
          <p class="nami">ÑAMI</p>
        </div>
        <script>window.onload=()=>{window.print();window.close();}<\/script>
      </body>
      </html>
    `);
    w.document.close();
  }, [restaurant, qrColor, url]);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  const isPro = restaurant?.plan === 'PRO';

  return (
    <PageTransition>
      <div className="space-y-8">
        <h1 className="text-3xl font-display font-bold">Tu link y QR</h1>

        <FadeIn>
          <div className="bg-white rounded-2xl p-8 border border-n-100 space-y-6">
            {/* Link */}
            <div>
              <label className="block text-sm font-semibold text-n-700 mb-3">Tu página pública</label>
              <div className="flex flex-col sm:flex-row gap-3">
                <code className="flex-1 bg-n-50 px-5 py-3.5 rounded-xl border border-n-200 text-sm truncate">
                  {url}
                </code>
                <div className="flex gap-2">
                  <Button onClick={copyLink} icon={<Copy className="w-4 h-4" />}>
                    Copiar
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.open(url, '_blank')}
                    icon={<ExternalLink className="w-4 h-4" />}
                  >
                    Abrir
                  </Button>
                </div>
              </div>
            </div>

            {/* QR */}
            <div className="border-t border-n-100 pt-6">
              <h3 className="font-display font-semibold text-lg mb-4">Código QR</h3>
              <div className="bg-n-50 rounded-2xl p-8 text-center">
                <div className="inline-block bg-white p-8 rounded-2xl shadow-sm border border-n-100">
                  {/* Brand line */}
                  <div className="h-1 rounded-full mb-5" style={{ backgroundColor: qrColor }} />
                  <p className="font-display font-bold text-lg text-n-900 mb-1">
                    {restaurant?.name}
                  </p>
                  <p className="text-xs text-n-400 mb-5">Escanea para ver el menú</p>

                  <div ref={qrRef}>
                    <div ref={printRef}>
                      <QRCodeSVG
                        value={url}
                        size={200}
                        fgColor={qrColor}
                        bgColor="#FFFFFF"
                        level="H"
                        includeMargin={false}
                        imageSettings={restaurant?.logoUrl ? {
                          src: restaurant.logoUrl,
                          height: 40,
                          width: 40,
                          excavate: true,
                        } : undefined}
                      />
                    </div>
                  </div>

                  <p className="text-[10px] text-n-300 font-semibold mt-4 tracking-wide">
                    {url.replace(/^https?:\/\//, '')}
                  </p>
                  <p className="text-xs font-bold mt-2" style={{ color: qrColor }}>
                    ÑAMI
                  </p>
                </div>

                <p className="text-sm text-n-500 mt-5">
                  Imprime este QR y pégalo en la puerta, mesas o volantes
                </p>

                <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    onClick={() => void downloadQR()}
                    icon={<Download className="w-4 h-4" />}
                  >
                    Descargar PNG ({isPro ? '512' : '256'}px)
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handlePrint}
                    icon={<Printer className="w-4 h-4" />}
                  >
                    Imprimir
                  </Button>
                </div>
                {!isPro && (
                  <p className="text-xs text-n-400 mt-3">
                    Actualiza a Pro para alta resolución (512px) y corrección de errores mejorada
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
