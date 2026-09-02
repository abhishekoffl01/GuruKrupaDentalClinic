import React, { useState } from 'react';
import { MessageCircle, X, Sparkles, Send } from 'lucide-react';
import { CLINIC_INFO } from '../../data/dentalData';

export const WhatsAppFloatingButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  const quickInquiries = [
    'I want to book an appointment',
    'Root canal treatment inquiry',
    'Dental cleaning & scaling query',
    'Clinic location & timings',
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || customMsg || 'Hello Gurukrupa Family Dental Care, I would like to inquire about dental treatment.';
    window.open(`https://wa.me/${CLINIC_INFO.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40">
      {/* Popover Bubble */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200">
          {/* Header */}
          <div className="bg-[#075E54] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold">Gurukrupa Dental Helpdesk</h4>
                <p className="text-[11px] text-emerald-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
                  <span>Usually responds in minutes</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10"
              aria-label="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 bg-slate-50 space-y-3">
            <div className="bg-white p-3 rounded-xl rounded-tl-none shadow-xs border border-slate-100 text-xs text-slate-800 leading-relaxed">
              👋 Hello! Welcome to <strong>Gurukrupa Family Dental Care</strong>, Laggere Bengaluru. How can we help your smile today?
            </div>

            <div className="space-y-1.5">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Quick Inquiries:</p>
              {quickInquiries.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  className="w-full text-left text-xs p-2 rounded-lg bg-white hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-200 border border-slate-200 text-slate-700 transition-colors flex items-center justify-between"
                >
                  <span>{q}</span>
                  <Send className="w-3 h-3 text-slate-400" />
                </button>
              ))}
            </div>

            <div className="pt-2 flex gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button
                onClick={() => handleSend()}
                className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                aria-label="Send WhatsApp"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Floating Trigger */}
      <button
        id="whatsapp-floating-trigger"
        onClick={() => setIsOpen(!isOpen)}
        className="w-13 h-13 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 hover:scale-105 active:scale-95 transition-all duration-200 relative group"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-7 h-7 fill-current" />
        <span className="sr-only">WhatsApp Chat</span>

        {/* Pulse ring */}
        <span className="absolute -inset-1 rounded-full bg-emerald-400 opacity-30 group-hover:opacity-50 animate-ping -z-10"></span>
      </button>
    </div>
  );
};
