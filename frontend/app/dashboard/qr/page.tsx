'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Copy, ExternalLink, Download } from 'lucide-react';
import { useState, useRef, useCallback } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/toast';
import { PageTransition, FadeIn } from '@/components/motion';

export default function QRPage() {
  const qrRef = useRef<HTMLDivElement>(null);

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

  const downloadQR = useCallback(() => {
    const svg = qrRef.current?.querySelector('svg');
    if (!svg) return;

    const size = restaurant?.plan === 'PRO' ? 512 : 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    img.onload = () => {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, size, size);

      const link = document.createElement('a');
      link.download = `${restaurant?.slug || 'qr'}-nami.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    img.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgData)))}`;
  }, [restaurant]);

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
                <div ref={qrRef} className="inline-block bg-white p-6 rounded-2xl shadow-sm border border-n-100">
                  <QRCodeSVG
                    value={url}
                    size={200}
                    fgColor={qrColor}
                    bgColor="#FFFFFF"
                    level="M"
                    includeMargin={false}
                    imageSettings={restaurant?.logoUrl ? {
                      src: restaurant.logoUrl,
                      height: 40,
                      width: 40,
                      excavate: true,
                    } : undefined}
                  />
                </div>

                <p className="text-sm text-n-500 mt-4">
                  Imprime este QR y pégalo en la puerta o mesa de tu restaurante
                </p>

                <div className="mt-4">
                  {isPro ? (
                    <Button
                      onClick={downloadQR}
                      icon={<Download className="w-4 h-4" />}
                    >
                      Descargar QR (512px)
                    </Button>
                  ) : (
                    <div className="relative">
                      <Button
                        onClick={downloadQR}
                        variant="secondary"
                        icon={<Download className="w-4 h-4" />}
                      >
                        Descargar QR (256px)
                      </Button>
                      <p className="text-xs text-n-400 mt-2">
                        Actualiza a Pro para alta resolución (512px)
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </PageTransition>
  );
}
