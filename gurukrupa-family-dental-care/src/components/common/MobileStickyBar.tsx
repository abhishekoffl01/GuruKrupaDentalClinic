import React from 'react';
import { Phone, MessageCircle, Calendar } from 'lucide-react';
import { CLINIC_INFO } from '../../data/dentalData';

interface MobileStickyBarProps {
  onOpenAppointment: () => void;
}

export const MobileStickyBar: React.FC<MobileStickyBarProps> = ({ onOpenAppointment }) => {
  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-2 px-3 shadow-lg flex items-center justify-between gap-2">
      <a
        id="mobile-sticky-call-btn"
        href={`tel:${CLINIC_INFO.phoneClean}`}
        className="flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors"
      >
        <Phone className="w-4 h-4 text-sky-600 mb-0.5" />
        <span>Call</span>
      </a>

      <a
        id="mobile-sticky-whatsapp-btn"
        href={CLINIC_INFO.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold transition-colors"
      >
        <MessageCircle className="w-4 h-4 text-emerald-600 mb-0.5" />
        <span>WhatsApp</span>
      </a>

      <button
        id="mobile-sticky-book-btn"
        onClick={onOpenAppointment}
        className="flex-1.5 flex flex-col items-center justify-center py-1.5 px-3 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-sm transition-all"
      >
        <Calendar className="w-4 h-4 text-white mb-0.5" />
        <span>Book Slot</span>
      </button>
    </div>
  );
};
