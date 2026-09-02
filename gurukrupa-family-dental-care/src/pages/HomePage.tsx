import React, { useState } from 'react';
import {
  Calendar,
  Phone,
  MessageCircle,
  ShieldCheck,
  Clock,
  MapPin,
  Sparkles,
  CheckCircle2,
  Heart,
  Star,
  Activity,
  ArrowRight,
  Smile,
  Stethoscope,
} from 'lucide-react';
import { PageId, GalleryItem } from '../types';
import {
  CLINIC_INFO,
  DENTAL_SERVICES,
  PATIENT_TESTIMONIALS,
  CLINICAL_HIGHLIGHTS,
} from '../data/dentalData';
import { useMedia } from '../context/MediaContext';
import { SmartImage } from '../components/common/SmartImage';

interface HomePageProps {
  onNavigate: (page: PageId) => void;
  onOpenAppointment: (serviceId?: string) => void;
  onSelectService: (serviceId: string) => void;
  onOpenLightbox: (index: number) => void;
  galleryItems?: GalleryItem[];
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenAppointment,
  onSelectService: _onSelectService,
  onOpenLightbox,
  galleryItems,
}) => {
  const { media } = useMedia();
  const activeGallery = galleryItems && galleryItems.length > 0 ? galleryItems : media.gallery;

  // Inline Appointment Form State
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateStr = tomorrow.toISOString().split('T')[0];

  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formService, setFormService] = useState('general-consultation');
  const [formDate, setFormDate] = useState(minDateStr);
  const [formTime, setFormTime] = useState('Morning (9:30 AM – 1:00 PM)');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);

  const handleInlineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPhone.trim()) return;

    setFormSubmitting(true);
    try {
      await fetch('/api/submit-enquiry.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          fullName: formName.trim(),
          phone: formPhone.trim(),
          serviceId: formService,
          preferredDate: formDate,
          preferredTime: formTime,
          preferredContact: 'phone',
        }),
      });
      setFormSubmitted(true);
    } catch {
      setFormSubmitted(true);
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleInlineWhatsApp = () => {
    const selectedService =
      DENTAL_SERVICES.find((s) => s.id === formService)?.title || 'General Consultation';
    const text = encodeURIComponent(
      `Hello Gurukrupa Family Dental Care,\n\nI want to book an appointment.\n• Name: ${formName || 'Patient'}\n• Phone: ${formPhone || 'Not provided'}\n• Treatment: ${selectedService}\n• Date: ${formDate}\n• Slot: ${formTime}\n\nPlease confirm availability. Thank you!`
    );
    window.open(`https://wa.me/${CLINIC_INFO.whatsapp}?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-12">
      {/* 1. Large Image-based Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white min-h-[580px] lg:min-h-[640px] flex items-center">
        {/* Background Image with Crisp Lighting & Overlay */}
        <div className="absolute inset-0 z-0">
          {media.heroBanner && (
            <img
              src={media.heroBanner}
              alt="Gurukrupa Family Dental Care"
              className="w-full h-full object-cover object-center opacity-25"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-[#071322] via-[#071322]/95 to-[#071322]/85" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-900/20 via-transparent to-[#071322]" />
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Narrative (7 cols) */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Badge */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/15 border border-sky-400/30 backdrop-blur-md text-sky-300 text-xs font-semibold tracking-wide">
                  <ShieldCheck className="w-4 h-4 text-sky-400" />
                  <span>Premier Dental Hospital in Laggere, Bengaluru</span>
                </div>
              </div>

              {/* Main Headline */}
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white font-heading tracking-tight leading-[1.1]">
                  Precision Dentistry with a{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-sky-200 to-teal-300">
                    Gentle, Caring Touch.
                  </span>
                </h1>
                <p className="text-base sm:text-lg text-slate-300 max-w-xl font-normal leading-relaxed pt-2">
                  Welcome to <strong>Gurukrupa Family Dental Care</strong>. From painless single-visit root canals to modern clear aligners and permanent implants, we provide complete, hygienic oral healthcare for your entire family.
                </p>
              </div>

              {/* CTAs: Book Appointment, Call Now, WhatsApp */}
              <div className="pt-2 flex flex-wrap items-center gap-3.5">
                <button
                  id="hero-book-btn"
                  onClick={() => onOpenAppointment()}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-sky-600/30 transition-all hover:shadow-xl hover:-translate-y-0.5"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Appointment Online</span>
                </button>

                <a
                  id="hero-call-btn"
                  href={`tel:${CLINIC_INFO.phoneClean}`}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-xl transition-colors border border-white/20 backdrop-blur-sm"
                >
                  <Phone className="w-4 h-4 text-sky-400" />
                  <span>096117 11884</span>
                </a>

                <a
                  id="hero-whatsapp-btn"
                  href={CLINIC_INFO.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-3.5 bg-emerald-600/90 hover:bg-emerald-500 text-white font-semibold text-sm rounded-xl transition-colors shadow-md"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Chat</span>
                </a>
              </div>

              {/* Doctor Quick Badge */}
              <div className="pt-4 border-t border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-sky-500/20 border border-sky-400/40 text-sky-300 flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
                  {media.doctorLead ? (
                    <img src={media.doctorLead} alt="Dr. Dinesh K" className="w-full h-full object-cover" />
                  ) : (
                    <Stethoscope className="w-5 h-5 text-sky-400" />
                  )}
                </div>
                <div className="text-xs">
                  <span className="font-bold text-white block">Dr. Dinesh K, BDS, MDS</span>
                  <span className="text-slate-400">Conservative Dentistry & Endodontics Specialist | KSDC Reg. 22378 A</span>
                </div>
              </div>
            </div>

            {/* Right Card: Instant Quick Booking Form (5 cols) */}
            <div className="lg:col-span-5">
              <div className="bg-white text-slate-900 rounded-2xl p-6 sm:p-7 shadow-2xl border border-slate-100 max-w-md mx-auto lg:ml-auto">
                <div className="mb-4">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 uppercase tracking-wider mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                    <span>Quick Consultation</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold font-heading text-slate-900">
                    Schedule Dental Visit
                  </h3>
                  <p className="text-xs text-slate-500">
                    Same-day relief appointments available for tooth pain.
                  </p>
                </div>

                {formSubmitted ? (
                  <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-3">
                    <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm text-emerald-900">Request Sent Successfully!</h4>
                      <p className="text-xs text-emerald-700">
                        Our reception desk will call you promptly at {formPhone} to confirm your slot.
                      </p>
                    </div>
                    <button
                      onClick={handleInlineWhatsApp}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors w-full justify-center"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Confirm Faster on WhatsApp</span>
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleInlineSubmit} className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Patient Full Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ramesh Kumar"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="e.g. 096117 11884"
                          value={formPhone}
                          onChange={(e) => setFormPhone(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Treatment
                        </label>
                        <select
                          value={formService}
                          onChange={(e) => setFormService(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
                        >
                          <option value="general-consultation">General Consultation</option>
                          <option value="root-canal-treatment">Root Canal (RCT)</option>
                          <option value="dental-implants">Dental Implants</option>
                          <option value="orthodontics-braces-aligners">Braces & Aligners</option>
                          <option value="teeth-whitening-cosmetic">Teeth Whitening</option>
                          <option value="pediatric-dentistry">Kids Dentistry</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Date
                        </label>
                        <input
                          type="date"
                          min={minDateStr}
                          value={formDate}
                          onChange={(e) => setFormDate(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Time Slot
                        </label>
                        <select
                          value={formTime}
                          onChange={(e) => setFormTime(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
                        >
                          <option value="Morning (9:30 AM – 1:00 PM)">Morning (9:30 AM – 1:00 PM)</option>
                          <option value="Afternoon (1:00 PM – 5:00 PM)">Afternoon (1:00 PM – 5:00 PM)</option>
                          <option value="Evening (5:00 PM – 8:30 PM)">Evening (5:00 PM – 8:30 PM)</option>
                        </select>
                      </div>
                    </div>

                    <button
                      id="hero-inline-submit-btn"
                      type="submit"
                      disabled={formSubmitting}
                      className="w-full py-2.5 mt-2 bg-sky-600 hover:bg-sky-700 disabled:bg-sky-400 text-white font-bold text-xs rounded-lg shadow-sm transition-all cursor-pointer disabled:cursor-not-allowed"
                    >
                      {formSubmitting ? 'Requesting...' : 'Request Appointment'}
                    </button>
                  </form>
                )}

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Mon-Sat: 9:30 AM - 8:30 PM</span>
                  </div>
                  <a
                    href={`tel:${CLINIC_INFO.phoneClean}`}
                    className="text-sky-700 hover:underline font-semibold"
                  >
                    096117 11884
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Trust & Clinical Assurance Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CLINICAL_HIGHLIGHTS.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl p-5 shadow-md border border-slate-200/80 hover:border-sky-300 transition-all group"
            >
              <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center mb-3 group-hover:bg-sky-600 group-hover:text-white transition-colors">
                {idx === 0 && <ShieldCheck className="w-5 h-5" />}
                {idx === 1 && <Sparkles className="w-5 h-5" />}
                {idx === 2 && <Activity className="w-5 h-5" />}
                {idx === 3 && <Heart className="w-5 h-5" />}
              </div>
              <h3 className="font-bold text-sm text-slate-900 font-heading mb-1">{item.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Why Choose Us */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-[#0C1B2E] to-slate-950 rounded-3xl p-8 sm:p-12 lg:p-14 text-white relative overflow-hidden border border-slate-800 shadow-xl">
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Header (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-400 font-heading">
                The Gurukrupa Difference
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-heading tracking-tight">
                Why Families Across Bengaluru Trust Us
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                We believe dental healthcare should be transparent, gentle, and strictly hygienic. We never recommend unnecessary procedures and ensure every patient is thoroughly informed.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <a
                  href={`tel:${CLINIC_INFO.phoneClean}`}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-sky-600/30"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call 096117 11884</span>
                </a>
                <button
                  onClick={() => onNavigate('about')}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm rounded-xl transition-colors border border-white/10"
                >
                  <span>Learn About Safety Protocols</span>
                </button>
              </div>
            </div>

            {/* Right Feature Matrix (7 cols) */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-2">
                <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-xs">
                  01
                </div>
                <h4 className="text-sm font-bold text-white font-heading">Multi-Stage Class-B Sterilization</h4>
                <p className="text-xs text-slate-300">
                  Individual instrument pouches opened right in front of you. Hospital-grade autoclave cycles eliminate cross-infection risks.
                </p>
              </div>

              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-2">
                <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-xs">
                  02
                </div>
                <h4 className="text-sm font-bold text-white font-heading">Painless & Gentle Approach</h4>
                <p className="text-xs text-slate-300">
                  Using high-efficiency local numbing and computerized rotary systems, our procedures are designed to maximize patient comfort.
                </p>
              </div>

              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-2">
                <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-xs">
                  03
                </div>
                <h4 className="text-sm font-bold text-white font-heading">Low-Radiation Digital RVG</h4>
                <p className="text-xs text-slate-300">
                  Instant digital X-rays displayed on chair-side screens for transparent diagnosis and clear treatment roadmaps.
                </p>
              </div>

              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-2">
                <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-xs">
                  04
                </div>
                <h4 className="text-sm font-bold text-white font-heading">Transparent Pricing & Estimates</h4>
                <p className="text-xs text-slate-300">
                  Clear upfront cost breakdowns with zero hidden fees. Ethical advice focused on preserving your natural teeth.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Gallery Preview Section with Lightbox */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-700 font-heading">
              Our Clinic & Care
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
              Inside Gurukrupa Family Dental Care
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Photographs of Gurukrupa Family Dental Care in Laggere, Bengaluru.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="gallery-view-all-btn"
              onClick={() => onNavigate('gallery')}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-sky-700 hover:text-sky-800 transition-colors shrink-0"
            >
              <span>{activeGallery.length > 0 ? `View Full Gallery (${activeGallery.length} Photos)` : 'Open Clinic Gallery'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Real Photos Strip */}
        {activeGallery.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {activeGallery.slice(0, 8).map((item, idx) => (
              <div
                key={item.id}
                onClick={() => onOpenLightbox(idx)}
                className="group relative rounded-2xl overflow-hidden bg-slate-900 aspect-[4/3] cursor-pointer shadow-sm hover:shadow-xl transition-all border border-slate-200"
              >
                <img
                  src={item.image}
                  alt={item.title || 'Clinic Photo'}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 text-center space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto border border-sky-100">
              <Smile className="w-6 h-6" />
            </div>
            <div className="space-y-1 max-w-md mx-auto">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 font-heading">
                Clinic Photo Gallery
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                Visit our Gallery to explore our sterilization protocols and treatment facilities.
              </p>
            </div>
            <button
              onClick={() => onNavigate('gallery')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm transition-all"
            >
              <span>Open Clinic Gallery</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </section>

      {/* 7. Patient Testimonials & Google Reviews Section */}
      <section className="bg-slate-100/60 py-16 sm:py-20 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>Google Patient Feedback</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 font-heading">
              What Our Patients Say
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Real experiences from families treated at Gurukrupa Family Dental Care, Laggere.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PATIENT_TESTIMONIALS.map((test) => (
              <div
                key={test.id}
                className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex text-amber-400">
                      {[...Array(test.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-[11px] text-slate-400">{test.date}</span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                    &quot;{test.review}&quot;
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-800 font-bold text-xs flex items-center justify-center shrink-0">
                    {test.avatarPlaceholder}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{test.patientName}</h4>
                    <p className="text-[10px] text-sky-700 font-medium">{test.treatment}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Dedicated Appointment Booking Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-sky-700 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-200 font-heading">
                Prompt Consultations
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-heading">
                Ready to Experience Painless Dental Care?
              </h2>
              <p className="text-sm sm:text-base text-sky-100 leading-relaxed">
                Contact Dr. Dinesh K at Gurukrupa Family Dental Care in Laggere. We provide same-day emergency tooth pain relief, computerized diagnostics, and transparent cost estimates.
              </p>
              <div className="pt-2 flex flex-wrap gap-4">
                <button
                  id="cta-bottom-book-btn"
                  onClick={() => onOpenAppointment()}
                  className="px-6 py-3.5 bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm rounded-xl shadow-lg transition-all"
                >
                  Book Appointment Now
                </button>
                <a
                  href={`tel:${CLINIC_INFO.phoneClean}`}
                  className="px-5 py-3.5 bg-sky-800/80 hover:bg-sky-800 text-white font-semibold text-sm rounded-xl border border-sky-600 transition-colors flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call {CLINIC_INFO.phone}</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-6 bg-slate-900/40 backdrop-blur-md rounded-2xl p-6 border border-white/15 space-y-4">
              <div className="space-y-1">
                <h4 className="text-base font-bold text-white">Clinic Location & Timings</h4>
                <p className="text-xs text-slate-300">
                  {CLINIC_INFO.address}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-200">
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Weekdays (Mon-Sat)</span>
                  <span className="font-semibold text-white">9:30 AM – 8:30 PM</span>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Sundays</span>
                  <span className="font-semibold text-white">10:00 AM – 2:00 PM</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-300 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-sky-300 shrink-0" />
                <span>Landmark: Near Kempegowda Layout Ring Road / Outer Ring Road Junction, Laggere</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
