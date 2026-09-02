import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Tag, ZoomIn } from 'lucide-react';
import { GalleryItem } from '../../types';

interface GalleryLightboxProps {
  items: GalleryItem[];
  currentIndex: number | null;
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
}

export const GalleryLightbox: React.FC<GalleryLightboxProps> = ({
  items,
  currentIndex,
  onClose,
  onNavigate,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (currentIndex === null) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') {
        onNavigate((currentIndex - 1 + items.length) % items.length);
      }
      if (e.key === 'ArrowRight') {
        onNavigate((currentIndex + 1) % items.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, items.length, onClose, onNavigate]);

  if (currentIndex === null || !items[currentIndex]) return null;

  const currentItem = items[currentIndex];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    onNavigate((currentIndex - 1 + items.length) % items.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    onNavigate((currentIndex + 1) % items.length);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 sm:p-6 select-none"
      onClick={onClose}
    >
      {/* Top action bar */}
      <div className="absolute top-4 left-4 right-4 sm:top-6 sm:left-6 sm:right-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-white text-xs font-medium">
          <Tag className="w-3.5 h-3.5 text-sky-400" />
          <span>{currentItem.categoryLabel}</span>
          <span className="text-white/40">•</span>
          <span>{currentIndex + 1} of {items.length}</span>
        </div>

        <button
          id="close-lightbox-btn"
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors focus:outline-none border border-white/10"
          aria-label="Close Lightbox"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Prev / Next buttons */}
      <button
        id="lightbox-prev-btn"
        onClick={handlePrev}
        className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center border border-white/20 transition-transform active:scale-95 z-10"
        aria-label="Previous photo"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        id="lightbox-next-btn"
        onClick={handleNext}
        className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center border border-white/20 transition-transform active:scale-95 z-10"
        aria-label="Next photo"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Image Container */}
      <div
        className="relative max-w-5xl max-h-[90vh] flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black border border-white/10 max-h-[85vh]">
          <img
            src={currentItem.image}
            alt={currentItem.title || "Gurukrupa Dental Care Photo"}
            referrerPolicy="no-referrer"
            onError={(e) => {
              if (currentItem.fallbackImage) {
                e.currentTarget.src = currentItem.fallbackImage;
              }
            }}
            className="w-full h-auto max-h-[85vh] object-contain transition-all duration-300"
          />
        </div>
      </div>
    </div>
  );
};
