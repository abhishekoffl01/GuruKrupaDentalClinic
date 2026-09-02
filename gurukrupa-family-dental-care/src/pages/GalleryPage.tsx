import React from 'react';
import { Camera, ZoomIn, ImageIcon } from 'lucide-react';
import { PageId, GalleryItem } from '../types';
import { useMedia } from '../context/MediaContext';
import { SmartImage } from '../components/common/SmartImage';

interface GalleryPageProps {
  onNavigate?: (page: PageId) => void;
  onOpenLightbox: (index: number) => void;
  onOpenAppointment?: () => void;
  galleryItems?: GalleryItem[];
  onAddGalleryItem?: (item: GalleryItem) => void;
  onAddMultipleGalleryItems?: (items: GalleryItem[]) => void;
  onDeleteGalleryItem?: (id: string) => void;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({
  onOpenLightbox,
  galleryItems: propGalleryItems,
}) => {
  const { media } = useMedia();

  // Source of truth: prop items or media.gallery
  const items = propGalleryItems && propGalleryItems.length > 0 ? propGalleryItems : media.gallery;

  return (
    <div className="space-y-8 sm:space-y-10 pb-16">
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-slate-900 via-[#0C1E34] to-slate-900 text-white py-12 sm:py-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/20 text-sky-300 text-xs font-semibold uppercase tracking-wider border border-sky-400/30 backdrop-blur-md">
            <Camera className="w-3.5 h-3.5" />
            <span>Clinic Tour & Facilities</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-white tracking-tight">
            Clinic Photo Gallery
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            Photographs of Gurukrupa Family Dental Care in Laggere, Bengaluru. Click any photo to view in high-resolution detail.
          </p>
        </div>
      </section>

      {/* Info & Count Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="font-bold text-base sm:text-lg text-slate-900 font-heading">
              All Photos
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 text-xs font-bold">
              {items.length} {items.length === 1 ? 'Photo' : 'Photos'}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-1.5">
            <ZoomIn className="w-4 h-4 text-sky-600 shrink-0" />
            <span>Click any photograph to enlarge</span>
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {items.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-14 text-center space-y-4 max-w-md mx-auto shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto border border-sky-100 shadow-sm">
              <ImageIcon className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold font-heading text-slate-900">
                Clinic Gallery
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Clinic photographs will appear here shortly.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {items.map((item, index) => {
              const isDirectDataUrl = item.image && item.image.startsWith('data:');

              return (
                <div
                  key={item.id}
                  id={`gallery-card-${item.id}`}
                  onClick={() => onOpenLightbox(index)}
                  className="group relative bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer aspect-[4/3] border border-slate-200"
                >
                  <img
                    src={item.image}
                    alt={item.title || 'Clinic Photo'}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Gradient Overlay & Zoom on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-between z-10 pointer-events-none">
                    <div className="self-end">
                      <span className="w-8 h-8 rounded-full bg-white/25 backdrop-blur-md text-white flex items-center justify-center shadow-lg">
                        <ZoomIn className="w-4 h-4" />
                      </span>
                    </div>

                    <div className="space-y-0.5 text-left">
                      <h4 className="text-sm font-bold text-white leading-snug line-clamp-1">
                        {item.title}
                      </h4>
                      {item.description && (
                        <p className="text-[11px] text-slate-200 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
