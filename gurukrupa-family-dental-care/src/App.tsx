import React, { useState } from 'react';
import { PageId, GalleryItem, DoctorMember } from './types';
import { DENTAL_SERVICES } from './data/dentalData';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { GalleryPage } from './pages/GalleryPage';
import { ContactPage } from './pages/ContactPage';
import { AppointmentModal } from './components/common/AppointmentModal';
import { ServiceDetailModal } from './components/common/ServiceDetailModal';
import { GalleryLightbox } from './components/common/GalleryLightbox';
import { WhatsAppFloatingButton } from './components/common/WhatsAppFloatingButton';
import { MobileStickyBar } from './components/common/MobileStickyBar';
import { MediaProvider, useMedia } from './context/MediaContext';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);
  const [selectedAppointmentServiceId, setSelectedAppointmentServiceId] = useState<string | undefined>(undefined);
  const [detailServiceId, setDetailServiceId] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const { media } = useMedia();

  // Doctors / Clinical Team state
  const [doctors, setDoctors] = useState<DoctorMember[]>(() => {
    const saved = localStorage.getItem('gurukrupa_custom_doctors');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        // ignore
      }
    }
    return [
      {
        id: 'dr-dinesh-k',
        name: 'Dr. Dinesh K',
        role: 'Lead Dental Surgeon & Founder',
        degrees: 'B.D.S., M.D.S. (Conservative Dentistry & Endodontics)',
        speciality: 'Specialist Endodontist & Implantologist',
        registrationNo: 'KSDC Reg. 22378 A',
        experience: '12+ Years Clinical Excellence',
        image: media.doctorLead || '/assets/doctor/doctor.jpg',
        experienceSummary:
          'Specialist in microscopic rotary endodontics, pain-free single-sitting root canals, esthetic restorations, and surgical implant placements.',
        focusAreas: [
          'Single-Sitting Root Canals',
          'Dental Implants',
          'Cosmetic Smile Design',
          'Full Mouth Rehabilitation',
        ],
        availability: 'Mon – Sat: 9:30 AM – 1:30 PM & 5:00 PM – 8:30 PM',
        consultationFee: '₹300',
        education: [
          'M.D.S. - Conservative Dentistry & Endodontics (RGUHS)',
          'B.D.S. - M.S. Ramaiah Dental College & Hospital, Bangalore',
          'Registered with Karnataka State Dental Council (Reg. No. 22378-A)',
        ],
      },
    ];
  });

  const handleUpdateDoctor = (updatedDoc: DoctorMember) => {
    const updated = doctors.map((d) => (d.id === updatedDoc.id ? updatedDoc : d));
    setDoctors(updated);
    localStorage.setItem('gurukrupa_custom_doctors', JSON.stringify(updated));
  };

  const handleNavigate = (page: PageId, serviceId?: string) => {
    setCurrentPage(page);
    if (serviceId) {
      setDetailServiceId(serviceId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAppointment = (serviceId?: string) => {
    setSelectedAppointmentServiceId(serviceId);
    setIsAppointmentOpen(true);
  };

  const handleSelectService = (serviceId: string) => {
    setDetailServiceId(serviceId);
  };

  const handleOpenLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const activeService = detailServiceId
    ? DENTAL_SERVICES.find((s) => s.id === detailServiceId) || null
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A] font-sans antialiased selection:bg-sky-600 selection:text-white">
      {/* Header Navigation */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenAppointment={handleOpenAppointment}
        customLogo={media.logo}
      />

      {/* Main Page Content */}
      <main className="flex-1 w-full">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onOpenAppointment={handleOpenAppointment}
            onSelectService={handleSelectService}
            onOpenLightbox={handleOpenLightbox}
            galleryItems={media.gallery}
          />
        )}

        {currentPage === 'about' && (
          <AboutPage
            onNavigate={handleNavigate}
            onOpenAppointment={() => handleOpenAppointment()}
            doctors={doctors}
            onUpdateDoctor={handleUpdateDoctor}
          />
        )}

        {currentPage === 'gallery' && (
          <GalleryPage
            onNavigate={handleNavigate}
            onOpenLightbox={handleOpenLightbox}
            onOpenAppointment={() => handleOpenAppointment()}
            galleryItems={media.gallery}
          />
        )}

        {currentPage === 'contact' && (
          <ContactPage
            onNavigate={handleNavigate}
            onOpenAppointment={handleOpenAppointment}
          />
        )}
      </main>

      {/* Hospital Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenAppointment={handleOpenAppointment}
        onSelectService={handleSelectService}
        customLogo={media.logo}
      />

      {/* Floating Action Components */}
      <WhatsAppFloatingButton />
      <MobileStickyBar onOpenAppointment={() => handleOpenAppointment()} />

      {/* Modals & Lightbox Overlays */}
      <AppointmentModal
        isOpen={isAppointmentOpen}
        onClose={() => setIsAppointmentOpen(false)}
        initialServiceId={selectedAppointmentServiceId}
      />

      <ServiceDetailModal
        service={activeService}
        onClose={() => setDetailServiceId(null)}
        onBookAppointment={(serviceId) => {
          setDetailServiceId(null);
          handleOpenAppointment(serviceId);
        }}
      />

      <GalleryLightbox
        items={media.gallery}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={(newIdx) => setLightboxIndex(newIdx)}
      />
    </div>
  );
}

export default function App() {
  return (
    <MediaProvider>
      <AppContent />
    </MediaProvider>
  );
}
