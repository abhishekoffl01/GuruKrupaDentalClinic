import React, { useState } from 'react';
import {
  ShieldCheck,
  Award,
  Heart,
  Sparkles,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Phone,
  MessageCircle,
  Stethoscope,
  Microscope,
  Zap,
  Users,
  UserCheck,
  Building2,
  FileCheck,
  GraduationCap,
  ScrollText,
  BadgeCheck,
} from 'lucide-react';
import { PageId, DoctorMember } from '../types';
import { CLINIC_INFO, CLINICAL_TEAM, CLINICAL_HIGHLIGHTS } from '../data/dentalData';
import { useMedia } from '../context/MediaContext';
import { SmartImage } from '../components/common/SmartImage';

interface AboutPageProps {
  onNavigate: (page: PageId) => void;
  onOpenAppointment: () => void;
  doctors?: DoctorMember[];
  onUpdateDoctor?: (updatedDoctor: DoctorMember) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onNavigate,
  onOpenAppointment,
  doctors: externalDoctors,
  onUpdateDoctor: externalUpdateDoctor,
}) => {
  const { media } = useMedia();

  // Local fallback if not passed from parent
  const [localDoctors, setLocalDoctors] = useState<DoctorMember[]>(() => {
    const saved = localStorage.getItem('gurukrupa_custom_doctors');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return CLINICAL_TEAM;
      }
    }
    return CLINICAL_TEAM;
  });

  const doctorsList = externalDoctors || localDoctors;
  const leadDoctor = doctorsList[0];
  const consultantDoctors = doctorsList.slice(1);

  return (
    <div className="space-y-16 sm:space-y-24 pb-12">
      {/* Page Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-[#0C1B2E] to-slate-950 text-white py-16 sm:py-24 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/15 border border-sky-400/30 text-sky-300 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              <span>Hospital Profile & Medical Standards</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-white tracking-tight">
              About Gurukrupa Family Dental Care
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              Founded on the principles of transparent clinical diagnosis, uncompromising sterilization, and painless family dentistry in Laggere, Bengaluru.
            </p>
          </div>
        </div>
      </section>

      {/* Hospital Philosophy & Facility */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-700 font-heading">
                Our Hospital Philosophy
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
                Patient-Centric Care with Zero Compromise on Hygiene
              </h2>
            </div>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              At Gurukrupa Family Dental Care, we believe visiting the dentist should be a comfortable, transparent, and anxiety-free experience. We strictly prioritize <strong>conservative dentistry</strong>—preserving natural teeth wherever possible through computerized rotary root canals and biomimetic restorative therapies.
            </p>

            <p className="text-sm text-slate-600 leading-relaxed">
              Every procedure is preceded by a thorough digital diagnosis using low-radiation digital radiography, allowing us to explain findings clearly and discuss customized treatment plans tailored to your timeline and budget.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
              <div className="p-4 bg-sky-50/70 rounded-xl border border-sky-100 space-y-1">
                <h4 className="text-xs font-bold text-sky-900 uppercase tracking-wider">Ethical Pricing</h4>
                <p className="text-xs text-slate-600">Transparent upfront treatment estimates with zero hidden fees.</p>
              </div>
              <div className="p-4 bg-teal-50/70 rounded-xl border border-teal-100 space-y-1">
                <h4 className="text-xs font-bold text-teal-900 uppercase tracking-wider">Family Friendly</h4>
                <p className="text-xs text-slate-600">Specialized treatment workflows for children, adults, and seniors.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-slate-900 aspect-[4/3] relative">
              <SmartImage
                src={media.clinic1 || '/assets/clinic/clinic-01.jpg'}
                category="clinic"
                title="Gurukrupa Dental Care Hospital Operatory"
                subtitle="Laggere, Bengaluru"
                className="w-full h-full object-cover"
                containerClassName="w-full h-full"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-slate-900/85 backdrop-blur-md text-white p-3 rounded-xl border border-white/10 flex items-center justify-between text-xs z-10">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-sky-400" />
                  <span>Service Road, Laggere, Bengaluru 560057</span>
                </div>
                <span className="font-semibold text-emerald-400">Class-B Operatory</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Infection Control & 4-Stage Sterilization Protocol */}
      <section className="bg-slate-100/70 py-16 sm:py-20 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-700 font-heading">
              Safety First
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
              Our 4-Stage Hospital Sterilization Protocol
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              We strictly adhere to international dental infection control guidelines to protect every patient.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-sm">
                01
              </div>
              <h3 className="font-bold text-base text-slate-900 font-heading">Ultrasonic Debris Cleaning</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                All surgical and dental instruments undergo enzymatic ultrasonic cleaning to eliminate microscopic residues before thermal processing.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-sm">
                02
              </div>
              <h3 className="font-bold text-base text-slate-900 font-heading">Class-B Vacuum Autoclave</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Instruments are sealed in individual sterilization pouches and processed in high-pressure vacuum autoclaves ensuring 100% spore elimination.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-sm">
                03
              </div>
              <h3 className="font-bold text-base text-slate-900 font-heading">Single-Use Disposables</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Gloves, suction tips, patient drapes, barrier films, and dental cups are strictly single-use and disposed of after every single consultation.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-sm">
                04
              </div>
              <h3 className="font-bold text-base text-slate-900 font-heading">Surface Disinfection</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Between every patient visit, dental chairs and contact surfaces are wiped down with medical-grade hospital disinfectant solutions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Clinical Leadership & Doctor Profile Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-700 font-heading">
              Clinical Leadership & Specialization
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
              Dental Surgeon & Specialist Profile
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Verified clinical qualifications, university degrees, state dental council registration, and specialized practice areas.
            </p>
          </div>
        </div>

        {/* Featured Lead Doctor: Dr. Dinesh K */}
        {leadDoctor && (
          <div
            id="doctor-profile-lead"
            className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Doctor Visual & Credentials */}
              <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 p-8 text-white flex flex-col justify-between relative">
                <div className="space-y-6">
                  {/* Photo Frame */}
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="relative">
                      <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-3xl overflow-hidden border-4 border-sky-400/80 bg-slate-900 shadow-2xl flex items-center justify-center relative">
                        <SmartImage
                          src={leadDoctor.image || media.doctorLead}
                          category="doctor"
                          title={leadDoctor.name || 'Dr. Dinesh K'}
                          subtitle={leadDoctor.speciality}
                          className="w-full h-full object-cover object-top"
                          containerClassName="w-full h-full"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-2xl font-bold font-heading text-white">
                        {leadDoctor.name || 'Dr. Dinesh K'}
                      </h3>
                      <p className="text-sky-300 font-semibold text-sm">
                        {leadDoctor.degrees}
                      </p>
                      <p className="text-xs text-slate-300 font-medium">
                        {leadDoctor.speciality}
                      </p>
                    </div>
                  </div>

                  {/* Dental Council Registration Box */}
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-left">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                      <BadgeCheck className="w-4 h-4" />
                      <span>Professional Council Registration</span>
                    </div>
                    <div className="space-y-1 text-xs text-slate-200">
                      <div>
                        <strong>Council:</strong> Karnataka State Dental Council (KSDC)
                      </div>
                      <div>
                        <strong>Registration Number:</strong>{' '}
                        <span className="font-bold text-white">22378 A</span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Registered as a dentist under the <em>Dentists Act, 1948</em> (7 June 2008).
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
                  <span>Gurukrupa Family Dental Care</span>
                  <span className="text-sky-400 font-semibold">Chief Dental Surgeon</span>
                </div>
              </div>

              {/* Doctor Full Verified Credentials & Scope */}
              <div className="lg:col-span-7 p-8 sm:p-10 space-y-8 flex flex-col justify-between">
                <div className="space-y-6">
                  {/* Overview Bio */}
                  <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-sky-50 text-sky-800 text-xs font-bold border border-sky-200">
                      <Award className="w-3.5 h-3.5 text-sky-600" />
                      <span>Conservative Dentistry & Endodontics</span>
                    </div>
                    <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                      <strong>Dr. Dinesh K</strong> is a dental surgeon with postgraduate training in Conservative Dentistry and Endodontics. He completed his BDS from Rajiv Gandhi University of Health Sciences, Karnataka, followed by an MDS in Conservative Dentistry and Endodontics from Rajiv Gandhi University of Health Sciences through M.S. Ramaiah Dental College, Bangalore.
                    </p>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      His postgraduate specialization focuses on preserving natural teeth, restorative dental care, and endodontic treatment, including root canal therapy. The registered credentials document his BDS qualification, MDS qualification, postgraduate specialization, and registration with the Karnataka State Dental Council.
                    </p>
                  </div>

                  {/* Academic Education & University Degrees */}
                  <div className="space-y-3 pt-4 border-t border-slate-100">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 font-heading">
                      <GraduationCap className="w-4 h-4 text-sky-600" />
                      <span>Academic Degrees & University Education</span>
                    </h4>

                    <div className="space-y-2.5">
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1">
                        <div className="flex items-center justify-between font-bold text-slate-900">
                          <span>BDS (Bachelor of Dental Surgery)</span>
                          <span className="text-sky-700 font-semibold text-[11px]">June 2008</span>
                        </div>
                        <p className="text-slate-600">
                          Rajiv Gandhi University of Health Sciences (RGUHS), Karnataka
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1">
                        <div className="flex items-center justify-between font-bold text-slate-900">
                          <span>MDS (Master of Dental Surgery)</span>
                          <span className="text-sky-700 font-semibold text-[11px]">May 2012 / 15th Convocation March 2013</span>
                        </div>
                        <p className="text-slate-700 font-medium">
                          MDS Specialization: Conservative Dentistry and Endodontics
                        </p>
                        <p className="text-slate-600">
                          University: Rajiv Gandhi University of Health Sciences, Karnataka | University Reg. No: 09ED351
                        </p>
                        <p className="text-slate-600">
                          Postgraduate College: M.S. Ramaiah Dental College & Hospital, Bangalore (14 September 2012)
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Clinical Scope & Specialization Focus */}
                  <div className="space-y-3 pt-4 border-t border-slate-100">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 font-heading">
                      <ShieldCheck className="w-4 h-4 text-sky-600" />
                      <span>Specialization & Clinical Scope of Practice</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {[
                        'Treatment of dental decay',
                        'Restorative dentistry',
                        'Saving damaged natural teeth',
                        'Root canal treatment (RCT)',
                        'Treatment of infected dental pulp',
                        'Restoration of teeth after root canal treatment',
                        'Management of tooth pain related to pulp & root problems',
                        'Biomimetic tooth preservation',
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 p-2 rounded-lg bg-sky-50/50 text-slate-800 border border-sky-100"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                          <span className="font-medium text-[11px] sm:text-xs">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Consultation Availability & Booking */}
                <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{leadDoctor.availability || 'Monday – Saturday: 9:30 AM – 8:30 PM'}</span>
                  </div>

                  <button
                    onClick={onOpenAppointment}
                    className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 hover:bg-sky-600 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Book Consultation with Dr. Dinesh K</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Visiting Specialist Consultants */}
        {consultantDoctors.length > 0 && (
          <div className="space-y-6 pt-6">
            <div className="space-y-1">
              <h3 className="text-lg font-bold font-heading text-slate-900">
                Visiting Specialist Dental Consultants
              </h3>
              <p className="text-xs text-slate-600">
                Specialized orthodontic corrections and oral maxillofacial surgical procedures by appointment.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {consultantDoctors.map((doc) => (
                <div
                  key={doc.id}
                  id={`consultant-card-${doc.id}`}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="p-6 bg-slate-900 text-white flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl bg-sky-500/20 border border-sky-400/30 text-sky-300 flex items-center justify-center shrink-0 overflow-hidden">
                        <SmartImage
                          src={doc.image}
                          category="doctor"
                          title={doc.name || doc.role}
                          subtitle={doc.speciality}
                          allowUpload={false}
                          className="w-full h-full object-cover"
                          containerClassName="w-full h-full"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-sky-300 block">
                          {doc.degrees}
                        </span>
                        <h4 className="text-base font-bold font-heading text-white">
                          {doc.name || doc.role}
                        </h4>
                        <p className="text-xs text-slate-300">{doc.speciality}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {doc.experienceSummary}
                    </p>

                    <div className="space-y-3 pt-3 border-t border-slate-100">
                      <div className="flex flex-wrap gap-1.5">
                        {doc.focusAreas.map((area, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium"
                          >
                            {area}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{doc.availability}</span>
                      </div>

                      <button
                        onClick={onOpenAppointment}
                        className="w-full py-2 bg-slate-900 hover:bg-sky-600 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Request Specialist Slot</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Hospital Infrastructure Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 space-y-8">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400 font-heading">
              Technology & Facility
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
              Advanced Clinical Equipment at Gurukrupa Dental
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-2">
              <Microscope className="w-6 h-6 text-sky-400" />
              <h4 className="text-sm font-bold text-white">Digital RVG Sensor</h4>
              <p className="text-xs text-slate-300">
                Instant intraoral X-rays with 90% less radiation exposure than conventional film.
              </p>
            </div>

            <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-2">
              <Zap className="w-6 h-6 text-sky-400" />
              <h4 className="text-sm font-bold text-white">Rotary Endomotor</h4>
              <p className="text-xs text-slate-300">
                Computer-controlled torque files for smooth, precise root canal shaping in less time.
              </p>
            </div>

            <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-2">
              <Sparkles className="w-6 h-6 text-sky-400" />
              <h4 className="text-sm font-bold text-white">Ultrasonic Piezo Scaler</h4>
              <p className="text-xs text-slate-300">
                Gentle micro-vibration scaling that removes tartar without scratching healthy tooth enamel.
              </p>
            </div>

            <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-2">
              <Heart className="w-6 h-6 text-sky-400" />
              <h4 className="text-sm font-bold text-white">LED Polymerization Unit</h4>
              <p className="text-xs text-slate-300">
                High-intensity light curing that sets composite restorations solidly in under 20 seconds.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
