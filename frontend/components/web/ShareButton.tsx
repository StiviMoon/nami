'use client';

import { Share2 } from 'lucide-react';
import { toast } from '@/components/ui/toast';

interface ShareButtonProps {
  url: string;
  title: string;
  text?: string;
  className?: string;
}

export function ShareButton({ url, title, text, className }: ShareButtonProps) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: text || title, url });
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast('Link copiado al portapapeles', 'success');
    }
  };

  return (
    <button
      onClick={handleShare}
      className={`p-2.5 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-colors shadow-sm ${className || ''}`}
      title="Compartir"
    >
      <Share2 className="w-4 h-4 text-n-600" />
    </button>
  );
}
