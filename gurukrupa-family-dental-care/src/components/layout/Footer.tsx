import React from 'react';
import { Phone, MessageCircle, Mail, MapPin, Clock, ShieldCheck, ChevronRight, Heart, Calendar } from 'lucide-react';
import { PageId } from '../../types';
import { CLINIC_INFO, DENTAL_SERVICES } from '../../data/dentalData';

import { ClinicLogo } from '../common/ClinicLogo';

interface FooterProps {
  onNavigate: (page: PageId) => void;
  onOpenAppointment: (serviceId?: string) => void;
  onSelectService: (serviceId: string) => void;
  customLogo?: string | null;
  onOpenLogoModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenAppointment,
  onSelectService,
  customLogo,
  onOpenLogoModal,
}) => {
  const handleNav = (page: PageId) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0B1523] text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Emergency & Booking Banner */}
        <div className="bg-gradient-to-r from-sky-900/60 via-slate-900 to-sky-950/80 rounded-2xl p-6 sm:p-8 border border-sky-800/40 mb-14 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-sky-500/20 text-sky-300 text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Prompt Dental Assistance</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white font-heading">
              Experiencing tooth pain or need a routine checkup?
            </h3>
            <p className="text-sm text-slate-300 max-w-xl">
              Our clinical team at Laggere, Bengaluru is ready to assist you. Walk-ins welcome for urgent dental care.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <a
              id="footer-banner-call-btn"
              href={`tel:${CLINIC_INFO.phoneClean}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold rounded-xl border border-slate-700 transition-colors"
            >
              <Phone className="w-4 h-4 text-sky-400" />
              <span>Call {CLINIC_INFO.phone}</span>
            </a>
            <button
              id="footer-banner-book-btn"
              onClick={() => onOpenAppointment()}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold rounded-xl shadow-md shadow-sky-600/30 transition-all hover:scale-[1.02]"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>
          </div>
        </div>

        {/* 4 Column Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-slate-800/80">
          {/* Col 1: Brand & Ethos (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <ClinicLogo
                customLogo={customLogo}
                showUploadTrigger={false}
                size="md"
              />
              <div>
                <span className="font-heading font-extrabold text-xl text-white tracking-tight">
                  GURUKRUPA
                </span>
                <span className="block text-xs font-semibold tracking-wider uppercase text-sky-400">
                  Family Dental Care
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed">
              Comprehensive, patient-first dental hospital serving families across Bengaluru. Combining modern painless endodontics, implants, digital aligners, and rigorous Class-B sterilization protocols.
            </p>

            <div className="pt-2 flex flex-col space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Accepting New Patients & Emergency Cases</span>
              </div>
              <div>
                Official Hospital Domain: <span className="text-slate-200 font-mono">{CLINIC_INFO.domain}</span>
              </div>
            </div>
          </div>

          {/* Col 2: Treatments & Procedures (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white font-heading">
              Key Treatments
            </h4>
            <ul className="space-y-2 text-sm">
              {DENTAL_SERVICES.slice(0, 6).map((service) => (
                <li key={service.id}>
                  <button
                    id={`footer-service-${service.id}`}
                    onClick={() => {
                      if (onSelectService) {
                        onSelectService(service.id);
                      } else {
                        onOpenAppointment(service.id);
                      }
                    }}
                    className="text-slate-400 hover:text-sky-300 transition-colors flex items-center gap-1.5 text-left group"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-sky-400 transition-colors" />
                    <span>{service.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Navigation & Quick Links (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white font-heading">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => handleNav('home')}
                  className="text-slate-400 hover:text-sky-300 transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                  <span>Home</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('about')}
                  className="text-slate-400 hover:text-sky-300 transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                  <span>About Hospital</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('gallery')}
                  className="text-slate-400 hover:text-sky-300 transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                  <span>Clinic Gallery</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('contact')}
                  className="text-slate-400 hover:text-sky-300 transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                  <span>Contact & Map</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Location & Timings (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white font-heading">
              Hospital Location
            </h4>
            <div className="space-y-3 text-sm text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-1" />
                <span>{CLINIC_INFO.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                <a
                  href={`tel:${CLINIC_INFO.phoneClean}`}
                  className="text-white hover:text-sky-300 font-medium transition-colors"
                >
                  {CLINIC_INFO.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href={CLINIC_INFO.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-300 hover:text-emerald-200 font-medium transition-colors"
                >
                  +{CLINIC_INFO.whatsapp} (WhatsApp)
                </a>
              </div>
              <div className="pt-1 flex items-start gap-2.5 text-xs text-slate-400">
                <Clock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-300">Consultation Timings:</p>
                  <p>Mon – Sat: 9:30 AM – 8:30 PM</p>
                  <p>Sunday: 10:00 AM – 2:00 PM (By Appt)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Gurukrupa Family Dental Care. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Bengaluru, Karnataka</span>
            <span>•</span>
            <button onClick={() => handleNav('contact')} className="hover:text-slate-300">
              Appointments & Directions
            </button>
            <span>•</span>
            <button onClick={() => handleNav('about')} className="hover:text-slate-300">
              Sterilization Standards
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
