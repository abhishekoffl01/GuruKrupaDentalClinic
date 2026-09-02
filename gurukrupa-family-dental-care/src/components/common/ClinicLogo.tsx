import React, { useState, useEffect } from 'react';

interface ClinicLogoProps {
  customLogo?: string | null;
  onOpenLogoModal?: () => void;
  size?: 'sm' | 'md' | 'lg';
  showUploadTrigger?: boolean;
  className?: string;
}

export const ClinicLogo: React.FC<ClinicLogoProps> = ({
  customLogo,
  size = 'md',
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);
  const activeLogoSrc = customLogo !== undefined && customLogo !== null ? customLogo : '/assets/logo/logo.png';

  // Reset error if logo changes
  useEffect(() => {
    setImgError(false);
  }, [activeLogoSrc]);

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 sm:w-11 sm:h-11',
    lg: 'w-14 h-14 sm:w-16 sm:h-16',
  };

  const hasValidLogo = !!activeLogoSrc && !imgError;

  return (
    <div className={`relative group/logo inline-flex items-center justify-center shrink-0 ${className}`}>
      {hasValidLogo ? (
        <div className={`${sizeClasses[size]} rounded-xl overflow-hidden bg-white flex items-center justify-center shadow-sm border border-slate-200/80 p-0.5`}>
          <img
            src={activeLogoSrc}
            alt="Gurukrupa Family Dental Care Logo"
            onError={() => setImgError(true)}
            className="w-full h-full object-contain"
          />
        </div>
      ) : (
        <div className={`${sizeClasses[size]} rounded-xl bg-gradient-to-br from-sky-600 to-sky-800 flex items-center justify-center text-white shadow-md shadow-sky-600/20 group-hover:scale-105 transition-transform duration-200`}>
          <svg className="w-5 h-5 sm:w-6 sm:h-6 fill-current" viewBox="0 0 24 24">
            <path d="M12 2C7.58 2 4 4.79 4 8.25c0 2.22 1.34 4.18 3.38 5.37.52.3.87.82.97 1.41l.8 4.77c.12.72.74 1.25 1.47 1.25.79 0 1.45-.6 1.54-1.39l.44-3.79c.07-.63.6-1.12 1.24-1.12.63 0 1.17.49 1.24 1.12l.44 3.79c.09.79.75 1.39 1.54 1.39.73 0 1.35-.53 1.47-1.25l.8-4.77c.1-.59.45-1.11.97-1.41C20.66 12.43 22 10.47 22 8.25 22 4.79 18.42 2 12 2zm0 2c5.29 0 8 2.06 8 4.25 0 1.63-1.02 3.1-2.6 3.99-.92.52-1.52 1.46-1.68 2.5l-.75 4.47-.41-3.52c-.22-1.92-1.85-3.39-3.78-3.39-1.93 0-3.56 1.47-3.78 3.39l-.41 3.52-.75-4.47c-.16-1.04-.76-1.98-1.68-2.5C4.02 11.35 3 9.88 3 8.25 3 6.06 6.71 4 12 4z" />
          </svg>
        </div>
      )}
    </div>
  );
};
