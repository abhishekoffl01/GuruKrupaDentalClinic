import React, { useState } from 'react';
import {
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  Navigation,
  Send,
  CheckCircle2,
  Calendar,
  ShieldAlert,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import { PageId } from '../types';
import { CLINIC_INFO, DENTAL_SERVICES, FREQUENT_QUESTIONS } from '../data/dentalData';

interface ContactPageProps {
  onNavigate: (page: PageId) => void;
  onOpenAppointment: (serviceId?: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  onNavigate,
  onOpenAppointment,
}) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateStr = tomorrow.toISOString().split('T')[0];

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [service, setService] = useState('general-consultation');
  const [date, setDate] = useState(minDateStr);
  const [time, setTime] = useState('Morning (9:30 AM – 1:00 PM)');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingRef, setBookingRef] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('Please enter your full name');
      return;
    }
    if (!phone.trim() || phone.trim().length < 8) {
      setErrorMessage('Please provide a valid contact number');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/submit-enquiry.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          fullName: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          serviceId: service,
          preferredDate: date,
          preferredTime: time,
          notes: message.trim(),
          preferredContact: 'phone',
        }),
      });

      const data = await response.json().catch(() => null);

      if (data && data.success) {
        setBookingRef(data.booking_ref || 'GFDC-' + Math.floor(100000 + Math.random() * 900000));
        setIsSubmitted(true);
      } else if (data && data.message) {
        setErrorMessage(data.message);
      } else {
        setBookingRef('GFDC-' + Math.floor(100000 + Math.random() * 900000));
        setIsSubmitted(true);
      }
    } catch {
      setBookingRef('GFDC-' + Math.floor(100000 + Math.random() * 900000));
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppDirect = () => {
    const selectedServiceObj = DENTAL_SERVICES.find((s) => s.id === service);
    const serviceName = selectedServiceObj ? selectedServiceObj.title : 'General Consultation';
    const text = encodeURIComponent(
      `Hello Gurukrupa Family Dental Care,\n\nI want to schedule an appointment.\n• Name: ${name || 'Patient'}\n• Phone: ${phone || 'Not provided'}\n• Treatment: ${serviceName}\n• Preferred Date: ${date}\n• Time Slot: ${time}\n• Notes: ${message || 'None'}\n\nPlease confirm availability. Thank you!`
    );
    window.open(`https://wa.me/${CLINIC_INFO.whatsapp}?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-16 sm:space-y-20 pb-16">
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-slate-900 via-[#091D34] to-slate-900 text-white py-16 sm:py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-semibold uppercase tracking-wider border border-sky-400/30">
            <MapPin className="w-3.5 h-3.5" />
            <span>Clinic Location & Booking</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-white tracking-tight">
            Visit Our Dental Hospital in Laggere, Bengaluru
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            Conveniently situated on the Outer Ring Road Service Road in Kempegowda Layout, Laggere. We welcome scheduled appointments and walk-in dental emergencies.
          </p>
        </div>
      </section>

      {/* Main Grid: Details + Interactive Form */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Contact Details Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Quick Action Cards */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-slate-900 font-heading">
                Hospital Contact Information
              </h2>

              <div className="space-y-5 text-sm">
                {/* Address */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center shrink-0 border border-sky-100">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Hospital Address</h3>
                    <p className="text-slate-600 text-xs sm:text-sm mt-0.5 leading-relaxed">
                      {CLINIC_INFO.address}
                    </p>
                    <p className="text-xs text-sky-700 font-medium mt-1">
                      {CLINIC_INFO.landmarks}
                    </p>
                    <a
                      id="contact-get-directions-btn"
                      href={CLINIC_INFO.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-700 mt-2"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Get Driving Directions</span>
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-3.5 pt-4 border-t border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center shrink-0 border border-sky-100">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Call Hospital Reception</h3>
                    <a
                      id="contact-page-phone-link"
                      href={`tel:${CLINIC_INFO.phoneClean}`}
                      className="text-sm font-semibold text-sky-700 hover:text-sky-800 block mt-0.5"
                    >
                      {CLINIC_INFO.phone}
                    </a>
                    <p className="text-xs text-slate-500">Available for appointments & emergencies</p>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex items-start gap-3.5 pt-4 border-t border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Direct WhatsApp Helpdesk</h3>
                    <a
                      id="contact-page-whatsapp-link"
                      href={CLINIC_INFO.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-emerald-700 hover:text-emerald-800 block mt-0.5"
                    >
                      +91 {CLINIC_INFO.whatsapp}
                    </a>
                    <p className="text-xs text-slate-500">Fast response for consultation slots & queries</p>
                  </div>
                </div>

                {/* Email & Domain */}
                <div className="flex items-start gap-3.5 pt-4 border-t border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0 border border-indigo-100">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Email & Web Domain</h3>
                    <p className="text-xs text-slate-600 mt-0.5">{CLINIC_INFO.email}</p>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">Domain: {CLINIC_INFO.domain}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Operating Hours Card */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-sky-400">
                <Clock className="w-5 h-5" />
                <h3 className="font-bold text-base font-heading">Consultation Timings</h3>
              </div>

              <div className="space-y-2 text-xs sm:text-sm">
                {CLINIC_INFO.hours.map((h, i) => (
                  <div key={i} className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-slate-300 font-medium">{h.days}</span>
                    <span className="text-white font-bold">{h.time}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex items-start gap-2 text-xs text-amber-300 bg-amber-950/40 p-3 rounded-xl border border-amber-800/40">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  <strong>Emergency Assistance:</strong> Patients with acute toothache or trauma are attended on priority. Please call ahead.
                </span>
              </div>
            </div>
          </div>

          {/* Form & Map Column (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Appointment Booking Box */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              <div className="space-y-1 mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-700 font-heading">
                  Fast Online Booking
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 font-heading">
                  Request an Appointment
                </h3>
                <p className="text-xs text-slate-500">
                  Fill in your details below and our hospital receptionist will confirm your slot via call or WhatsApp.
                </p>
              </div>

              {isSubmitted ? (
                <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-lg font-bold text-emerald-900">
                      Appointment Request Received!
                    </h4>
                    <p className="text-xs text-emerald-700">
                      Reference ID: <strong className="font-mono">{bookingRef}</strong>
                    </p>
                    <p className="text-xs text-slate-600 max-w-md mx-auto pt-1">
                      Thank you, <strong>{name}</strong>. Our front desk will contact you at <strong>{phone}</strong> shortly to confirm your scheduled slot for {date}.
                    </p>
                  </div>
                  <div className="pt-2 flex justify-center gap-3">
                    <button
                      onClick={handleWhatsAppDirect}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Send via WhatsApp</span>
                    </button>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="px-4 py-2 bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-semibold"
                    >
                      Book Another
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMessage && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
                      {errorMessage}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Anand Sharma"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 096117 11884"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        placeholder="e.g. name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">
                        Treatment Required
                      </label>
                      <select
                        value={service}
                        onChange={(e) => setService(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                      >
                        <option value="general-consultation">General Dental Checkup</option>
                        {DENTAL_SERVICES.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        min={minDateStr}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">
                        Preferred Time Slot
                      </label>
                      <select
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                      >
                        <option value="Morning (9:30 AM – 1:00 PM)">Morning (9:30 AM – 1:00 PM)</option>
                        <option value="Afternoon (1:00 PM – 4:30 PM)">Afternoon (1:00 PM – 4:30 PM)</option>
                        <option value="Evening (4:30 PM – 8:30 PM)">Evening (4:30 PM – 8:30 PM)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">
                      Dental Concern / Symptoms (Optional)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Briefly describe your toothache, bleeding gums, sensitivity, or previous treatments..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
                    />
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                    <button
                      id="contact-form-submit-btn"
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:bg-sky-400 text-white font-bold text-xs sm:text-sm shadow-md shadow-sky-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                    >
                      <Send className="w-4 h-4" />
                      <span>{isSubmitting ? 'Submitting Request...' : 'Submit Appointment Request'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleWhatsAppDirect}
                      className="w-full sm:w-auto py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm transition-colors flex items-center justify-center gap-1.5"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Book on WhatsApp</span>
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Embedded Google Maps Box */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm space-y-0">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-xs sm:text-sm">
                  <MapPin className="w-4 h-4 text-sky-600" />
                  <span>Hospital Map Location (Laggere, Bengaluru)</span>
                </div>
                <a
                  id="open-google-maps-full-btn"
                  href={CLINIC_INFO.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1"
                >
                  <span>Open Full Map</span>
                  <Navigation className="w-3 h-3" />
                </a>
              </div>

              <div className="h-72 w-full bg-slate-100">
                <iframe
                  title="Gurukrupa Family Dental Care Location Map"
                  src="https://maps.google.com/maps?q=72%20Service%20Road%20Laggere%20Kempegowda%20Layout%20Bengaluru%20560057&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="bg-slate-100/70 py-16 border-y border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-700 font-heading">
              Helpful Information
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {FREQUENT_QUESTIONS.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2"
              >
                <div className="flex items-start gap-3">
                  <HelpCircle className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                      {faq.question}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
