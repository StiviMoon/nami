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
      <div className="w-full h-full flex items-center justify-center opacity-10 bg-gray-100">
        <Utensils size={48} />
      </div>
    );
  }
  return (
    <div className="relative h-full w-full overflow-hidden group">
      <img
        src={photos[currentIndex]}
        alt={itemName}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
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
