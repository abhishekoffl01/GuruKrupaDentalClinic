import React, { useEffect } from 'react';
import { X, Calendar, CheckCircle2, Clock, Activity, ShieldCheck, HeartPulse, ArrowRight, MessageCircle } from 'lucide-react';
import { DentalService } from '../../types';
import { CLINIC_INFO } from '../../data/dentalData';

interface ServiceDetailModalProps {
  service: DentalService | null;
  onClose: () => void;
  onBookAppointment: (serviceId: string) => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  onClose,
  onBookAppointment,
}) => {
  useEffect(() => {
    if (service) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [service]);

  if (!service) return null;

  const handleBook = () => {
    onBookAppointment(service.id);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hero Header with Service Image */}
        <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-slate-900">
          <img
            src={service.image}
            alt={service.title}
            onError={(e) => {
              if (service.fallbackImage) {
                e.currentTarget.src = service.fallbackImage;
              }
            }}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Close button */}
          <button
            id="close-service-modal-btn"
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 text-white hover:bg-black/80 flex items-center justify-center border border-white/20 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title & Badge */}
          <div className="absolute bottom-4 left-6 right-6">
            <span className="inline-block px-2.5 py-1 rounded-md bg-sky-500/30 text-sky-200 text-xs font-semibold uppercase tracking-wider mb-2 border border-sky-400/30 backdrop-blur-md">
              Gurukrupa Clinical Care
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
              {service.title}
            </h2>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Overview */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2 font-heading">
              Procedure Overview
            </h3>
            <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
              {service.fullDescription}
            </p>
          </div>

          {/* Key Indications */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2 flex items-center gap-1.5 font-heading">
              <Activity className="w-4 h-4 text-sky-600" />
              <span>When is this treatment recommended?</span>
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-700">
              {service.indications.map((ind, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-2 shrink-0"></span>
                  <span>{ind}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Step-by-step procedure */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3 font-heading">
              Clinical Procedure Stages
            </h3>
            <div className="space-y-3">
              {service.procedureSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-slate-800">{step.step}</h5>
                    <p className="text-xs text-slate-600 mt-0.5">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Metrics (Duration & Recovery) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3 bg-sky-50/70 border border-sky-100 rounded-xl">
              <span className="text-[11px] font-bold text-sky-800 uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Estimated Duration</span>
              </span>
              <p className="text-xs font-medium text-slate-700 mt-1">{service.durationEstimate}</p>
            </div>
            <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl">
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Post-Care Comfort</span>
              </span>
              <p className="text-xs font-medium text-slate-700 mt-1">{service.recoveryNote}</p>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <a
            href={`tel:${CLINIC_INFO.phoneClean}`}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            Questions? Call {CLINIC_INFO.phone}
          </a>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-1/2 sm:w-auto px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors"
            >
              Close
            </button>
            <button
              id="service-modal-book-btn"
              onClick={handleBook}
              className="w-1/2 sm:w-auto px-5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-md shadow-sky-600/30 transition-all flex items-center justify-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Appointment</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
