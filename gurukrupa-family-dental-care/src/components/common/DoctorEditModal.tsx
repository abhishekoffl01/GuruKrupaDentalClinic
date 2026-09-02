import React, { useState, useEffect } from 'react';
import { X, UserCheck, Stethoscope, Save, RotateCcw, Upload, Award, Clock, FileText } from 'lucide-react';
import { DoctorMember } from '../../types';
import { compressImageFile } from '../../utils/imageUtils';

interface DoctorEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: DoctorMember | null;
  onSave: (updatedDoctor: DoctorMember) => void;
}

export const DoctorEditModal: React.FC<DoctorEditModalProps> = ({
  isOpen,
  onClose,
  doctor,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [degrees, setDegrees] = useState('');
  const [speciality, setSpeciality] = useState('');
  const [regNumber, setRegNumber] = useState('');
  const [experienceSummary, setExperienceSummary] = useState('');
  const [focusAreasText, setFocusAreasText] = useState('');
  const [availability, setAvailability] = useState('');
  const [image, setImage] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (doctor) {
      setName(doctor.name || '');
      setRole(doctor.role || '');
      setDegrees(doctor.degrees || '');
      setSpeciality(doctor.speciality || '');
      setRegNumber(doctor.regNumber || '');
      setExperienceSummary(doctor.experienceSummary || '');
      setFocusAreasText(doctor.focusAreas ? doctor.focusAreas.join(', ') : '');
      setAvailability(doctor.availability || '');
      setImage(doctor.image || '');
      setImagePreview(doctor.image || '');
    }
  }, [doctor]);

  if (!isOpen || !doctor) return null;

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImageFile(file, 1000, 0.85);
        setImage(compressed);
        setImagePreview(compressed);
      } catch (err) {
        console.error('Failed to compress doctor photo', err);
      }
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const focusAreas = focusAreasText
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    const updated: DoctorMember = {
      ...doctor,
      name: name.trim() || doctor.name || 'Lead Dental Surgeon',
      role: role.trim() || doctor.role,
      degrees: degrees.trim() || doctor.degrees,
      speciality: speciality.trim() || doctor.speciality,
      regNumber: regNumber.trim(),
      experienceSummary: experienceSummary.trim() || doctor.experienceSummary,
      focusAreas: focusAreas.length > 0 ? focusAreas : doctor.focusAreas,
      availability: availability.trim() || doctor.availability,
      image: image.trim() || undefined,
    };

    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-[#0B1E36] to-slate-900 text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-300 flex items-center justify-center border border-sky-400/30">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-heading text-white">
                Update Doctor Information
              </h3>
              <p className="text-xs text-slate-300">
                Provide the real doctor details & credentials for {doctor.role}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleFormSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                Doctor Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Dr. Name, BDS"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                Degrees & Qualifications <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. BDS, MDS (Conservative Dentistry)"
                value={degrees}
                onChange={(e) => setDegrees(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                Designation / Role in Hospital
              </label>
              <input
                type="text"
                placeholder="e.g. Lead Dental Surgeon & Clinical Director"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                Dental Council Reg. No. (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. KDC Reg No. 12345-A"
                value={regNumber}
                onChange={(e) => setRegNumber(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                Speciality & Department
              </label>
              <input
                type="text"
                placeholder="e.g. General, Restorative & Endodontic Dentistry"
                value={speciality}
                onChange={(e) => setSpeciality(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                Consultation Schedule / Timings
              </label>
              <input
                type="text"
                placeholder="e.g. Monday – Saturday: 9:30 AM – 8:30 PM"
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">
              Clinical Background & Bio
            </label>
            <textarea
              rows={3}
              placeholder="Describe the doctor's clinical philosophy, experience in painless dentistry, patient approach..."
              value={experienceSummary}
              onChange={(e) => setExperienceSummary(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">
              Key Focus Areas (Comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g. Single-Sitting RCT, Zirconia Crowns, Painless Extractions, Pediatric Care"
              value={focusAreasText}
              onChange={(e) => setFocusAreasText(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Doctor Photo Section */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="text-xs font-semibold text-slate-700 block">
              Doctor Photo (Upload from device or enter image URL)
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-20 h-20 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Stethoscope className="w-8 h-8 text-slate-400" />
                )}
              </div>
              <div className="flex-1 w-full space-y-2">
                <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-semibold transition-colors border border-sky-200">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Doctor Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />
                </label>
                <div className="text-[11px] text-slate-500">
                  Or enter photo link:
                </div>
                <input
                  type="url"
                  placeholder="https://example.com/doctor-photo.jpg"
                  value={image.startsWith('data:') ? '' : image}
                  onChange={(e) => {
                    setImage(e.target.value);
                    setImagePreview(e.target.value);
                  }}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-md shadow-sky-600/20 transition-all flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Doctor Details</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
