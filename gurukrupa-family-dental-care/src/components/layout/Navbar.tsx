import React, { useState, useEffect } from 'react';
import { Phone, MessageCircle, Clock, MapPin, Calendar, Menu, X, ChevronRight, Sparkles } from 'lucide-react';
import { PageId } from '../../types';
import { CLINIC_INFO } from '../../data/dentalData';
import { ClinicLogo } from '../common/ClinicLogo';
import { useMedia } from '../../context/MediaContext';

interface NavbarProps {
  currentPage: PageId;
  onNavigate: (page: PageId, serviceId?: string) => void;
  onOpenAppointment: (serviceId?: string) => void;
  customLogo?: string | null;
  onOpenLogoModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onOpenAppointment,
  customLogo,
  onOpenLogoModal: _onOpenLogoModal,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { media } = useMedia();

  const activeLogo = media.logo || customLogo;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: { id: PageId; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'gallery', label: 'Clinic Gallery' },
    { id: 'contact', label: 'Contact & Location' },
  ];

  const handleNavClick = (page: PageId) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-200">
      {/* Top Utility Bar */}
      <div className="bg-[#0B192C] text-slate-200 text-xs sm:text-[13px] border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
            <div className="flex items-center gap-1.5 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span className="hidden sm:inline">Laggere, Kempegowda Layout, Bengaluru 560057</span>
              <span className="sm:hidden">Laggere, Bengaluru</span>
            </div>
            <div className="hidden md:flex items-center gap-1.5 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Mon – Sat: 9:30 AM – 8:30 PM | Sun: 10 AM – 2 PM</span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 ml-auto">
            <a
              id="top-nav-phone-link"
              href={`tel:${CLINIC_INFO.phoneClean}`}
              className="flex items-center gap-1.5 text-sky-300 hover:text-white font-medium transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span className="font-semibold">{CLINIC_INFO.phone}</span>
            </a>

            <a
              id="top-nav-whatsapp-link"
              href={CLINIC_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-emerald-300 hover:text-emerald-200 font-medium transition-colors pl-3 border-l border-slate-700"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80 py-3'
            : 'bg-white border-b border-slate-100 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div
              id="brand-logo-container"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleNavClick('home');
                }
              }}
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-3 text-left group cursor-pointer focus:outline-none"
            >
              <ClinicLogo
                customLogo={activeLogo}
                showUploadTrigger={false}
                size="md"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-heading font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 leading-none">
                    GURUKRUPA
                  </span>
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-sky-600"></span>
                </div>
                <span className="block text-[11px] sm:text-xs font-semibold tracking-wider uppercase text-sky-700 font-sans">
                  Family Dental Care
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  id={`nav-link-${link.id}`}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${
                    isActive
                      ? 'text-sky-700 bg-sky-50 font-semibold'
                      : 'text-slate-700 hover:text-sky-600 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          {/* Desktop Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              id="nav-call-btn"
              href={`tel:${CLINIC_INFO.phoneClean}`}
              className="inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs xl:text-sm font-semibold text-slate-700 hover:text-sky-700 bg-slate-100 hover:bg-sky-50 rounded-lg transition-all border border-slate-200/80"
              title="Call Dental Reception"
            >
              <Phone className="w-3.5 h-3.5 text-sky-600" />
              <span>Call Now</span>
            </a>

            <button
              id="nav-book-appointment-btn"
              onClick={() => onOpenAppointment()}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs xl:text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 active:bg-sky-800 rounded-lg shadow-sm shadow-sky-600/25 transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              id="mobile-book-header-btn"
              onClick={() => onOpenAppointment()}
              className="sm:hidden px-3 py-1.5 text-xs font-semibold text-white bg-sky-600 rounded-lg shadow-sm"
            >
              Book
            </button>

            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-out Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200/80 bg-white px-4 pt-3 pb-6 mt-3 shadow-xl">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => {
                const isActive = currentPage === link.id;
                return (
                  <button
                    key={link.id}
                    id={`mobile-nav-link-${link.id}`}
                    onClick={() => handleNavClick(link.id)}
                    className={`flex items-center justify-between w-full px-4 py-3 text-sm font-medium rounded-lg text-left transition-colors ${
                      isActive
                        ? 'bg-sky-50 text-sky-700 font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                );
              })}
            </div>

            {/* Mobile Contact Quick Card */}
            <div className="mt-4 pt-4 border-t border-slate-100 space-y-2.5">
              <button
                id="mobile-menu-book-btn"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAppointment();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 bg-sky-600 text-white font-semibold text-sm rounded-lg shadow-sm shadow-sky-600/30"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Clinic Appointment</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <a
                  id="mobile-menu-call-btn"
                  href={`tel:${CLINIC_INFO.phoneClean}`}
                  className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  <Phone className="w-3.5 h-3.5 text-sky-600" />
                  <span>Call {CLINIC_INFO.phone}</span>
                </a>
                <a
                  id="mobile-menu-whatsapp-btn"
                  href={CLINIC_INFO.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp Chat</span>
                </a>
              </div>
            </div>

            {/* Timings snippet */}
            <div className="mt-4 p-3 bg-slate-50 rounded-lg text-xs text-slate-600 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                <Clock className="w-3.5 h-3.5 text-sky-600" />
                <span>Consultation Timings</span>
              </div>
              <p>Mon – Sat: 9:30 AM – 8:30 PM</p>
              <p>Sunday: 10:00 AM – 2:00 PM</p>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
