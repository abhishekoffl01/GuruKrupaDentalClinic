import React, { useState, useEffect } from 'react';
import {
  Upload,
  Camera,
  Sparkles,
  ShieldCheck,
  Activity,
  Award,
  HeartHandshake,
  Stethoscope,
  Microscope,
  Zap,
  CheckCircle2,
  FileCheck,
  Building2,
  Smile,
  Check,
} from 'lucide-react';
import { compressImageFile } from '../../utils/imageUtils';

export type DentalImageCategory =
  | 'root-canal'
  | 'implants'
  | 'orthodontics'
  | 'crowns'
  | 'pediatric'
  | 'whitening'
  | 'gum-care'
  | 'surgery'
  | 'clinic'
  | 'doctor'
  | 'sterilization'
  | 'certificate'
  | 'equipment'
  | 'smile'
  | 'general';

interface SmartImageProps {
  src?: string | null;
  category?: DentalImageCategory;
  title?: string;
  subtitle?: string;
  alt?: string;
  className?: string;
  containerClassName?: string;
  aspectRatio?: 'video' | 'square' | 'portrait' | 'auto' | 'hero' | 'card';
  allowUpload?: boolean;
  onUpload?: (dataUrl: string) => void;
  onClick?: () => void;
  badge?: string;
}

export const SmartImage: React.FC<SmartImageProps> = ({
  src,
  category = 'general',
  title,
  subtitle,
  alt = 'Gurukrupa Family Dental Care',
  className = '',
  containerClassName = '',
  aspectRatio = 'auto',
  allowUpload = false,
  onUpload,
  onClick,
  badge,
}) => {
  const [hasError, setHasError] = useState(!src);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    if (!src) {
      setHasError(true);
      setIsLoading(false);
    } else {
      setHasError(false);
      setIsLoading(false);
    }
  }, [src]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressed = await compressImageFile(file, 1600, 0.85);
      if (onUpload) {
        onUpload(compressed);
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 2000);
      }
    } catch (err) {
      console.error('Failed to compress uploaded photo', err);
    } finally {
      e.target.value = '';
    }
  };

  const aspectClasses = {
    video: 'aspect-video',
    square: 'aspect-square',
    portrait: 'aspect-[3/4]',
    hero: 'aspect-[16/9] sm:aspect-[21/9]',
    card: 'aspect-[16/10]',
    auto: '',
  };

  // Render SVG Graphic Illustration based on Category
  const renderFallbackIllustration = () => {
    switch (category) {
      case 'root-canal':
        return (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-slate-900 via-[#0B2447] to-slate-900 text-white relative overflow-hidden select-none">
            {/* Ambient background glow */}
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-sky-500/20 blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-teal-500/15 blur-2xl" />
            
            <div className="relative z-10 flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-sky-500/20 border border-sky-400/40 text-sky-300 flex items-center justify-center shadow-lg shadow-sky-950/50">
                <Activity className="w-8 h-8 text-sky-400" />
              </div>
              <div className="space-y-1">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-sky-400/20 text-sky-300 text-[10px] font-bold uppercase tracking-wider border border-sky-400/30">
                  Rotary Endodontics
                </span>
                <h4 className="text-sm sm:text-base font-bold text-white font-heading">
                  {title || 'Root Canal Treatment (RCT)'}
                </h4>
                <p className="text-[11px] text-slate-300 max-w-xs">
                  {subtitle || 'Motorized rotary files & digital apex locator for painless tooth saving'}
                </p>
              </div>
            </div>
          </div>
        );

      case 'implants':
        return (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-slate-900 via-[#132A4A] to-slate-900 text-white relative overflow-hidden select-none">
            <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-sky-500/20 blur-2xl" />
            <div className="relative z-10 flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-teal-500/20 border border-teal-400/40 text-teal-300 flex items-center justify-center shadow-lg shadow-teal-950/50">
                <ShieldCheck className="w-8 h-8 text-teal-300" />
              </div>
              <div className="space-y-1">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-teal-400/20 text-teal-300 text-[10px] font-bold uppercase tracking-wider border border-teal-400/30">
                  Permanent Restoration
                </span>
                <h4 className="text-sm sm:text-base font-bold text-white font-heading">
                  {title || 'Dental Implants & Fixed Teeth'}
                </h4>
                <p className="text-[11px] text-slate-300 max-w-xs">
                  {subtitle || 'Biocompatible titanium roots with lifelike zirconia crowns'}
                </p>
              </div>
            </div>
          </div>
        );

      case 'orthodontics':
        return (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-slate-900 via-[#1C1F4A] to-slate-900 text-white relative overflow-hidden select-none">
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-indigo-500/20 blur-2xl" />
            <div className="relative z-10 flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 flex items-center justify-center shadow-lg">
                <Smile className="w-8 h-8 text-indigo-300" />
              </div>
              <div className="space-y-1">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-indigo-400/20 text-indigo-300 text-[10px] font-bold uppercase tracking-wider border border-indigo-400/30">
                  Smile Alignment
                </span>
                <h4 className="text-sm sm:text-base font-bold text-white font-heading">
                  {title || 'Clear Aligners & Ceramic Braces'}
                </h4>
                <p className="text-[11px] text-slate-300 max-w-xs">
                  {subtitle || 'Discreet orthodontic correction for children, teens & adults'}
                </p>
              </div>
            </div>
          </div>
        );

      case 'crowns':
        return (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-slate-900 via-[#2A1E3E] to-slate-900 text-white relative overflow-hidden select-none">
            <div className="relative z-10 flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-purple-500/20 border border-purple-400/40 text-purple-300 flex items-center justify-center shadow-lg">
                <Award className="w-8 h-8 text-purple-300" />
              </div>
              <div className="space-y-1">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-purple-400/20 text-purple-300 text-[10px] font-bold uppercase tracking-wider border border-purple-400/30">
                  Aesthetic Crowns
                </span>
                <h4 className="text-sm sm:text-base font-bold text-white font-heading">
                  {title || 'Zirconia & Ceramic Crowns'}
                </h4>
                <p className="text-[11px] text-slate-300 max-w-xs">
                  {subtitle || 'Precision shade-matched tooth caps and full mouth bridges'}
                </p>
              </div>
            </div>
          </div>
        );

      case 'pediatric':
        return (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-slate-900 via-[#1B3022] to-slate-900 text-white relative overflow-hidden select-none">
            <div className="relative z-10 flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center shadow-lg">
                <HeartHandshake className="w-8 h-8 text-emerald-300" />
              </div>
              <div className="space-y-1">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider border border-emerald-400/30">
                  Pediatric Care
                </span>
                <h4 className="text-sm sm:text-base font-bold text-white font-heading">
                  {title || 'Kids & Pediatric Dentistry'}
                </h4>
                <p className="text-[11px] text-slate-300 max-w-xs">
                  {subtitle || 'Gentle fluoride protection & pain-free friendly cavity treatment'}
                </p>
              </div>
            </div>
          </div>
        );

      case 'whitening':
        return (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-slate-900 via-[#362E12] to-slate-900 text-white relative overflow-hidden select-none">
            <div className="relative z-10 flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center shadow-lg">
                <Sparkles className="w-8 h-8 text-amber-300" />
              </div>
              <div className="space-y-1">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider border border-amber-400/30">
                  Smile Illumination
                </span>
                <h4 className="text-sm sm:text-base font-bold text-white font-heading">
                  {title || 'Teeth Whitening & Polish'}
                </h4>
                <p className="text-[11px] text-slate-300 max-w-xs">
                  {subtitle || 'In-office light-activated brightening for a radiant natural smile'}
                </p>
              </div>
            </div>
          </div>
        );

      case 'gum-care':
        return (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-slate-900 via-[#102C38] to-slate-900 text-white relative overflow-hidden select-none">
            <div className="relative z-10 flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 flex items-center justify-center shadow-lg">
                <Sparkles className="w-8 h-8 text-cyan-300" />
              </div>
              <div className="space-y-1">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 text-[10px] font-bold uppercase tracking-wider border border-cyan-400/30">
                  Periodontal Care
                </span>
                <h4 className="text-sm sm:text-base font-bold text-white font-heading">
                  {title || 'Ultrasonic Scaling & Gum Therapy'}
                </h4>
                <p className="text-[11px] text-slate-300 max-w-xs">
                  {subtitle || 'Deep calculus removal & polishing for firm gums and fresh breath'}
                </p>
              </div>
            </div>
          </div>
        );

      case 'surgery':
        return (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-slate-900 via-[#2E1818] to-slate-900 text-white relative overflow-hidden select-none">
            <div className="relative z-10 flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-400/40 text-rose-300 flex items-center justify-center shadow-lg">
                <Zap className="w-8 h-8 text-rose-300" />
              </div>
              <div className="space-y-1">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-rose-400/20 text-rose-300 text-[10px] font-bold uppercase tracking-wider border border-rose-400/30">
                  Minor Oral Surgery
                </span>
                <h4 className="text-sm sm:text-base font-bold text-white font-heading">
                  {title || 'Wisdom Tooth & Surgery'}
                </h4>
                <p className="text-[11px] text-slate-300 max-w-xs">
                  {subtitle || 'Comfortable suture-guided extraction of impacted third molars'}
                </p>
              </div>
            </div>
          </div>
        );

      case 'doctor':
        return (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-slate-900 via-[#0B2038] to-slate-900 text-white relative overflow-hidden select-none">
            <div className="relative z-10 flex flex-col items-center gap-3">
              <div className="w-20 h-20 rounded-full bg-sky-500/20 border-2 border-sky-400/50 text-sky-300 flex items-center justify-center shadow-xl">
                <Stethoscope className="w-10 h-10 text-sky-400" />
              </div>
              <div className="space-y-1">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-sky-400/20 text-sky-300 text-[10px] font-bold uppercase tracking-wider border border-sky-400/30">
                  Consultant Dental Surgeon
                </span>
                <h4 className="text-base sm:text-lg font-bold text-white font-heading">
                  {title || 'Dr. Dinesh K, BDS, MDS'}
                </h4>
                <p className="text-xs text-slate-300">
                  {subtitle || 'Conservative Dentistry & Endodontics | KSDC Reg. 22378 A'}
                </p>
              </div>
            </div>
          </div>
        );

      case 'clinic':
      case 'equipment':
      case 'sterilization':
        return (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-slate-900 via-[#0C1E34] to-slate-900 text-white relative overflow-hidden select-none">
            <div className="relative z-10 flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-sky-500/20 border border-sky-400/40 text-sky-300 flex items-center justify-center shadow-lg">
                {category === 'sterilization' ? (
                  <ShieldCheck className="w-8 h-8 text-emerald-400" />
                ) : category === 'equipment' ? (
                  <Microscope className="w-8 h-8 text-sky-400" />
                ) : (
                  <Building2 className="w-8 h-8 text-sky-400" />
                )}
              </div>
              <div className="space-y-1">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-sky-400/20 text-sky-300 text-[10px] font-bold uppercase tracking-wider border border-sky-400/30">
                  {category === 'sterilization' ? 'Class-B Autoclave' : 'Modern Operatory'}
                </span>
                <h4 className="text-sm sm:text-base font-bold text-white font-heading">
                  {title || 'Gurukrupa Family Dental Care'}
                </h4>
                <p className="text-[11px] text-slate-300 max-w-xs">
                  {subtitle || '72, Service Road, Laggere, Kempegowda Layout, Bengaluru'}
                </p>
              </div>
            </div>
          </div>
        );

      case 'certificate':
        return (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-slate-900 via-[#122438] to-slate-900 text-white relative overflow-hidden select-none">
            <div className="relative z-10 flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center shadow-lg">
                <FileCheck className="w-8 h-8 text-amber-400" />
              </div>
              <div className="space-y-1">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider border border-amber-400/30">
                  Verified Accreditation
                </span>
                <h4 className="text-sm sm:text-base font-bold text-white font-heading">
                  {title || 'Professional Dental Qualification'}
                </h4>
                <p className="text-[11px] text-slate-300 max-w-xs">
                  {subtitle || 'Rajiv Gandhi University of Health Sciences & KSDC'}
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-slate-900 via-[#0B1E34] to-slate-900 text-white relative overflow-hidden select-none">
            <div className="relative z-10 flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-sky-500/20 border border-sky-400/40 text-sky-300 flex items-center justify-center shadow-lg">
                <Building2 className="w-8 h-8 text-sky-400" />
              </div>
              <div className="space-y-1">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-sky-400/20 text-sky-300 text-[10px] font-bold uppercase tracking-wider border border-sky-400/30">
                  Dental Care
                </span>
                <h4 className="text-sm sm:text-base font-bold text-white font-heading">
                  {title || 'Gurukrupa Family Dental Care'}
                </h4>
                <p className="text-[11px] text-slate-300 max-w-xs">
                  {subtitle || 'Laggere, Bengaluru'}
                </p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div
      onClick={onClick}
      className={`relative group/smart-img overflow-hidden select-none ${aspectClasses[aspectRatio]} ${containerClassName} ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      {/* Real Image or Fallback */}
      {!hasError && src ? (
        <>
          <img
            src={src}
            alt={alt}
            referrerPolicy="no-referrer"
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setHasError(true);
              setIsLoading(false);
            }}
            className={`w-full h-full object-cover transition-opacity duration-300 ${className}`}
          />
          {isLoading && (
            <div className="absolute inset-0 bg-slate-900 flex items-center justify-center text-sky-400 animate-pulse">
              <div className="w-8 h-8 rounded-full border-2 border-sky-400 border-t-transparent animate-spin" />
            </div>
          )}
        </>
      ) : (
        renderFallbackIllustration()
      )}

      {/* Optional Badge */}
      {badge && (
        <span className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-sky-600/90 backdrop-blur-md text-white text-[10px] font-bold tracking-wider uppercase border border-sky-400/30 shadow-md z-10">
          {badge}
        </span>
      )}

      {/* Direct Interactive Upload Action on Hover */}
      {allowUpload && (
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/smart-img:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center p-4 z-20">
          <label className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-lg transition-transform hover:scale-105">
            {uploadSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Photo Updated!</span>
              </>
            ) : (
              <>
                <Camera className="w-4 h-4" />
                <span>{hasError ? 'Upload Real Photo' : 'Change Photo'}</span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          <span className="text-[10px] text-slate-300 mt-1.5 font-medium">
            Click to choose from your phone/computer
          </span>
        </div>
      )}
    </div>
  );
};
