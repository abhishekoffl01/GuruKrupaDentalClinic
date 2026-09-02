import React, { useState } from 'react';
import { X, Upload, CheckCircle2, Image as ImageIcon, Trash2, ShieldCheck, Sparkles } from 'lucide-react';
import { CLINIC_INFO } from '../../data/dentalData';

interface LogoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLogo: string | null;
  onSaveLogo: (logoDataUrl: string | null) => void;
}

export const LogoUploadModal: React.FC<LogoUploadModalProps> = ({
  isOpen,
  onClose,
  currentLogo,
  onSaveLogo,
}) => {
  const [logoPreview, setLogoPreview] = useState<string | null>(currentLogo);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg('Image size exceeds 5MB. Please choose a lighter logo file.');
        return;
      }
      setErrorMsg('');
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setLogoPreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveLogo(logoPreview);
    setSuccessMsg('Logo updated successfully!');
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 600);
  };

  const handleRemove = () => {
    setLogoPreview(null);
    onSaveLogo(null);
    setSuccessMsg('Logo reset to default emblem.');
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-[#0C1E34] to-slate-900 text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-300 flex items-center justify-center border border-sky-400/30">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-heading text-white">
                Upload Real Clinic Logo
              </h3>
              <p className="text-xs text-slate-300">
                {CLINIC_INFO.name}
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

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-6">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 text-xs border border-emerald-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Current / New Logo Preview Box */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Logo Preview
            </label>
            <div className="p-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-4 text-center">
              {logoPreview ? (
                <div className="w-36 h-36 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center overflow-hidden">
                  <img
                    src={logoPreview}
                    alt="Clinic Logo Preview"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-sky-600 to-sky-800 flex items-center justify-center text-white shadow-md">
                  <svg className="w-12 h-12 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2C7.58 2 4 4.79 4 8.25c0 2.22 1.34 4.18 3.38 5.37.52.3.87.82.97 1.41l.8 4.77c.12.72.74 1.25 1.47 1.25.79 0 1.45-.6 1.54-1.39l.44-3.79c.07-.63.6-1.12 1.24-1.12.63 0 1.17.49 1.24 1.12l.44 3.79c.09.79.75 1.39 1.54 1.39.73 0 1.35-.53 1.47-1.25l.8-4.77c.1-.59.45-1.11.97-1.41C20.66 12.43 22 10.47 22 8.25 22 4.79 18.42 2 12 2zm0 2c5.29 0 8 2.06 8 4.25 0 1.63-1.02 3.1-2.6 3.99-.92.52-1.52 1.46-1.68 2.5l-.75 4.47-.41-3.52c-.22-1.92-1.85-3.39-3.78-3.39-1.93 0-3.56 1.47-3.78 3.39l-.41 3.52-.75-4.47c-.16-1.04-.76-1.98-1.68-2.5C4.02 11.35 3 9.88 3 8.25 3 6.06 6.71 4 12 4z" />
                  </svg>
                </div>
              )}

              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-800">
                  {logoPreview ? 'Real Logo Loaded' : 'Using Default Dental Emblem'}
                </p>
                <p className="text-[11px] text-slate-500 max-w-xs">
                  Supports PNG with transparent background, SVG, JPG, or WebP (max 5MB).
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl cursor-pointer transition-colors shadow-sm">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{logoPreview ? 'Choose Different File' : 'Select Logo Image File'}</span>
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/svg+xml, image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                {logoPreview && (
                  <button
                    type="button"
                    onClick={handleRemove}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors border border-red-200"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl shadow-md transition-all hover:scale-105"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Apply Logo Everywhere</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
