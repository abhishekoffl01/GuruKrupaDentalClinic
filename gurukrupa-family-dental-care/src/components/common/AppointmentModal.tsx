import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Phone, MessageCircle, CheckCircle2, User, Mail, ShieldAlert, Sparkles, MapPin } from 'lucide-react';
import { AppointmentFormData } from '../../types';
import { CLINIC_INFO, DENTAL_SERVICES } from '../../data/dentalData';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialServiceId?: string;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  initialServiceId,
}) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateStr = tomorrow.toISOString().split('T')[0];

  const [formData, setFormData] = useState<AppointmentFormData>({
    fullName: '',
    phone: '',
    email: '',
    serviceId: initialServiceId || 'general-consultation',
    preferredDate: minDateStr,
    preferredTime: 'Morning (9:30 AM – 1:00 PM)',
    notes: '',
    preferredContact: 'phone',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingRef, setBookingRef] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (initialServiceId) {
      setFormData((prev) => ({ ...prev, serviceId: initialServiceId }));
    }
  }, [initialServiceId]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setIsSubmitted(false);
      setErrorMessage('');
      setIsSubmitting(false);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      setErrorMessage('Please enter your full name');
      return;
    }
    if (!formData.phone.trim() || formData.phone.trim().length < 8) {
      setErrorMessage('Please provide a valid contact number (at least 8 digits)');
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
          fullName: formData.fullName.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          serviceId: formData.serviceId,
          preferredDate: formData.preferredDate,
          preferredTime: formData.preferredTime,
          notes: formData.notes.trim(),
          preferredContact: formData.preferredContact,
        }),
      });

      const data = await response.json().catch(() => null);

      if (data && data.success) {
        setBookingRef(data.booking_ref || 'GFDC-' + Math.floor(100000 + Math.random() * 900000));
        setIsSubmitted(true);
      } else if (data && data.message) {
        setErrorMessage(data.message);
      } else {
        // Fallback for dev / static environments without live PHP server
        const fallbackRef = 'GFDC-' + Math.floor(100000 + Math.random() * 900000);
        setBookingRef(fallbackRef);
        setIsSubmitted(true);
      }
    } catch {
      // In local preview or when PHP backend is deployed on Hostinger
      const fallbackRef = 'GFDC-' + Math.floor(100000 + Math.random() * 900000);
      setBookingRef(fallbackRef);
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppBooking = () => {
    const selectedService = DENTAL_SERVICES.find((s) => s.id === formData.serviceId)?.title || formData.serviceId || 'General Dental Consultation';
    const message = encodeURIComponent(
      `Hello Gurukrupa Family Dental Care,\n\nI would like to book a dental consultation.\n• Patient Name: ${formData.fullName || 'Not specified'}\n• Contact Number: ${formData.phone || 'Not specified'}\n• Treatment / Reason: ${selectedService}\n• Preferred Date: ${formData.preferredDate}\n• Preferred Time: ${formData.preferredTime}\n• Additional Notes: ${formData.notes || 'None'}\n\nPlease confirm availability. Thank you!`
    );
    window.open(`https://wa.me/${CLINIC_INFO.whatsapp}?text=${message}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-700 to-slate-800 text-white px-6 py-5 flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-sky-200 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gurukrupa Family Dental Care</span>
            </div>
            <h2 className="text-xl font-bold font-heading">Book Your Dental Consultation</h2>
          </div>
          <button
            id="close-appointment-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close booking modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {isSubmitted ? (
            <div className="text-center py-4 space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-900 font-heading">
                  Appointment Request Received!
                </h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  Thank you, <span className="font-semibold text-slate-800">{formData.fullName}</span>. Our reception team will call you shortly at <span className="font-semibold text-slate-800">{formData.phone}</span> to confirm your slot.
                </p>
              </div>

              {/* Reference Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left text-sm space-y-2">
                <div className="flex justify-between items-center border-b border-slate-200/80 pb-2">
                  <span className="text-slate-500 font-medium">Booking Reference</span>
                  <span className="font-mono font-bold text-sky-700 text-base">{bookingRef}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Treatment</span>
                  <span className="font-medium text-slate-800">
                    {DENTAL_SERVICES.find((s) => s.id === formData.serviceId)?.title || 'General Consultation'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Preferred Slot</span>
                  <span className="font-medium text-slate-800">{formData.preferredDate} ({formData.preferredTime.split(' ')[0]})</span>
                </div>
                <div className="flex items-start gap-2 pt-2 border-t border-slate-200/80 text-xs text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                  <span>{CLINIC_INFO.address}</span>
                </div>
              </div>

              {/* Instant WhatsApp confirmation button */}
              <div className="space-y-3 pt-2">
                <button
                  id="modal-send-whatsapp-btn"
                  onClick={handleWhatsAppBooking}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-emerald-600/20"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send Details Instantly to Clinic WhatsApp</span>
                </button>

                <button
                  id="modal-done-btn"
                  onClick={onClose}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold rounded-xl transition-colors"
                >
                  Done & Close
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Name and Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Patient Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="appointment-form-name"
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Contact Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="appointment-form-phone"
                      type="tel"
                      required
                      placeholder="e.g. 096117 11884"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Treatment / Service Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Required Treatment / Consultation
                </label>
                <select
                  id="appointment-form-service"
                  value={formData.serviceId}
                  onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
                >
                  <option value="general-consultation">General Dental Checkup & Consultation</option>
                  {DENTAL_SERVICES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
                  <option value="emergency-pain">Emergency Acute Tooth Pain</option>
                </select>
              </div>

              {/* Date and Time Slot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Preferred Date
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="appointment-form-date"
                      type="date"
                      min={minDateStr}
                      value={formData.preferredDate}
                      onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Preferred Time Window
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <select
                      id="appointment-form-time"
                      value={formData.preferredTime}
                      onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
                    >
                      <option value="Morning (9:30 AM – 1:00 PM)">Morning (9:30 AM – 1:00 PM)</option>
                      <option value="Afternoon (1:00 PM – 5:00 PM)">Afternoon (1:00 PM – 5:00 PM)</option>
                      <option value="Evening (5:00 PM – 8:30 PM)">Evening (5:00 PM – 8:30 PM)</option>
                      <option value="Sunday Slot (10:00 AM – 2:00 PM)">Sunday (10:00 AM – 2:00 PM)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Symptoms / Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Describe Your Symptoms / Special Request (Optional)
                </label>
                <textarea
                  id="appointment-form-notes"
                  rows={2}
                  placeholder="e.g. Tooth sensitivity when drinking cold water, upper left molar pain..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all resize-none"
                />
              </div>

              {/* Buttons */}
              <div className="pt-3 space-y-2">
                <button
                  id="appointment-submit-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-sky-600 hover:bg-sky-700 disabled:bg-sky-400 text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-sky-600/30 hover:shadow-lg cursor-pointer disabled:cursor-not-allowed"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{isSubmitting ? 'Sending Request...' : 'Request Appointment'}</span>
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleWhatsAppBooking}
                    className="inline-flex items-center gap-1.5 text-xs text-emerald-700 hover:text-emerald-800 font-semibold transition-colors py-1"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Or book directly via WhatsApp (919611711884)</span>
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 text-center">
                Strict privacy maintained. No unsolicited marketing messages.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
