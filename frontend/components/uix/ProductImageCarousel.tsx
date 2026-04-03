'use client';

import { useState } from 'react';
import { Utensils, ChevronLeft, ChevronRight } from 'lucide-react';

type Props = {
  photos: string[];
  itemName: string;
};

export function ProductImageCarousel({ photos, itemName }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  if (!photos || photos.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-stone-100/90">
        <Utensils className="opacity-[0.12] text-stone-500" size={40} />
      </div>
    );
  }
  return (
    <div className="group relative h-full w-full overflow-hidden bg-stone-100">
      <img
        src={photos[currentIndex]}
        alt={itemName}
        className="absolute left-1/2 top-1/2 min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 object-cover object-center transition-transform duration-500 ease-out will-change-transform group-hover:scale-[1.04]"
      />
      {photos.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/20 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex((prev) => (prev + 1) % photos.length);
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/20 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight size={16} />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {photos.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all ${idx === currentIndex ? 'w-3 bg-white' : 'w-1.5 bg-white/50'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
