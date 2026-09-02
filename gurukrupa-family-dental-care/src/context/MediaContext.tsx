import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { GalleryItem, DoctorMember } from '../types';
import { GALLERY_ITEMS } from '../data/dentalData';
import { compressImageFile, formatImageTitle } from '../utils/imageUtils';
import { setItemInDB, getItemFromDB, clearAllDB } from '../utils/indexedDbUtils';

export interface MediaStore {
  logo: string | null;
  heroBanner: string | null;
  doctorLead: string | null;
  clinic1: string | null;
  clinic2: string | null;
  clinic3: string | null;
  services: Record<string, string>;
  certificates: Record<string, string>;
  gallery: GalleryItem[];
}

interface MediaContextType {
  media: MediaStore;
  isMediaCenterOpen: boolean;
  activeMediaCenterTab: string;
  openMediaCenter: (tab?: string) => void;
  closeMediaCenter: () => void;
  updateMediaSlot: (slotKey: keyof Omit<MediaStore, 'services' | 'certificates' | 'gallery'>, dataUrl: string | null) => void;
  updateServiceImage: (serviceId: string, dataUrl: string | null) => void;
  updateCertificateImage: (certId: string, dataUrl: string | null) => void;
  addGalleryPhoto: (item: GalleryItem) => void;
  addGalleryItem: (item: GalleryItem) => void;
  addMultipleGalleryPhotos: (items: GalleryItem[]) => void;
  addMultipleGalleryItems: (items: GalleryItem[]) => void;
  removeGalleryPhoto: (id: string) => void;
  removeGalleryItem: (id: string) => void;
  batchUploadFiles: (files: File[]) => Promise<{ matchedCount: number; galleryCount: number }>;
  resetAllMedia: () => void;
}

const STORAGE_KEY = 'gurukrupa_media_store_v6';
const DB_STORE_KEY = 'app_media_state_v6';

const defaultMediaStore: MediaStore = {
  logo: '/assets/logo/logo.png',
  heroBanner: '/assets/hero/hero.jpg',
  doctorLead: '/assets/doctor/doctor.jpg',
  clinic1: '/assets/clinic/clinic-01.jpg',
  clinic2: '/assets/clinic/clinic-02.jpg',
  clinic3: '/assets/clinic/clinic-03.jpg',
  services: {},
  certificates: {},
  gallery: GALLERY_ITEMS,
};

const mergeWithStaticGallery = (customGallery?: GalleryItem[]): GalleryItem[] => {
  if (!customGallery || customGallery.length === 0) {
    return GALLERY_ITEMS;
  }
  const userUploaded = customGallery.filter(
    (g: GalleryItem) => g.isUserUploaded || g.image?.startsWith('data:') || g.image?.startsWith('blob:')
  );
  if (userUploaded.length === 0) {
    return GALLERY_ITEMS;
  }
  const userUploadedIds = new Set(userUploaded.map((u) => u.id));
  const remainingStatic = GALLERY_ITEMS.filter((s) => !userUploadedIds.has(s.id));
  return [...userUploaded, ...remainingStatic];
};

const MediaContext = createContext<MediaContextType | undefined>(undefined);

export const MediaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMediaCenterOpen, setIsMediaCenterOpen] = useState(false);
  const [activeMediaCenterTab, setActiveMediaCenterTab] = useState('batch');

  const [media, setMedia] = useState<MediaStore>(() => {
    try {
      // 1. Try local storage sync cache first for instant initial paint
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const mergedGallery = mergeWithStaticGallery(parsed.gallery);
        return {
          ...defaultMediaStore,
          ...parsed,
          logo: parsed.logo || defaultMediaStore.logo,
          doctorLead: parsed.doctorLead || defaultMediaStore.doctorLead,
          clinic1: parsed.clinic1 || defaultMediaStore.clinic1,
          clinic2: parsed.clinic2 || defaultMediaStore.clinic2,
          services: { ...defaultMediaStore.services, ...(parsed.services || {}) },
          certificates: { ...defaultMediaStore.certificates, ...(parsed.certificates || {}) },
          gallery: mergedGallery,
        };
      }

      return defaultMediaStore;
    } catch (err) {
      return defaultMediaStore;
    }
  });

  const [isHydrated, setIsHydrated] = useState(false);

  // Asynchronously hydrate from IndexedDB (stores full high-res uncompressed gallery items safely)
  useEffect(() => {
    let isMounted = true;
    getItemFromDB<MediaStore>(DB_STORE_KEY)
      .then((stored) => {
        if (isMounted) {
          if (stored) {
            setMedia((prev) => {
              const mergedGallery = mergeWithStaticGallery(stored.gallery || prev.gallery);

              return {
                ...prev,
                ...stored,
                logo: stored.logo || prev.logo || defaultMediaStore.logo,
                doctorLead: stored.doctorLead || prev.doctorLead || defaultMediaStore.doctorLead,
                clinic1: stored.clinic1 || prev.clinic1 || defaultMediaStore.clinic1,
                clinic2: stored.clinic2 || prev.clinic2 || defaultMediaStore.clinic2,
                gallery: mergedGallery,
                services: { ...prev.services, ...(stored.services || {}) },
                certificates: { ...prev.certificates, ...(stored.certificates || {}) },
              };
            });
          }
          setIsHydrated(true);
        }
      })
      .catch((err) => {
        console.warn('IndexedDB hydration error', err);
        if (isMounted) setIsHydrated(true);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Save changes to IndexedDB and LocalStorage ONLY when hydrated!
  useEffect(() => {
    if (!isHydrated) return;

    // 1. Save full state to IndexedDB (virtually unlimited quota)
    setItemInDB(DB_STORE_KEY, media).catch((err) => {
      console.warn('IndexedDB save warning', err);
    });

    // 2. Save metadata to LocalStorage safely (with quota guard)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(media));
      if (media.logo) localStorage.setItem('gurukrupa_custom_logo', media.logo);
      if (media.gallery && media.gallery.length > 0) {
        localStorage.setItem('gurukrupa_custom_gallery', JSON.stringify(media.gallery));
      }
    } catch (err) {
      // Quota limit is expected for large data URLs; IndexedDB takes over smoothly
    }
  }, [media, isHydrated]);

  const openMediaCenter = useCallback((tab = 'all') => {
    setActiveMediaCenterTab(tab);
    setIsMediaCenterOpen(true);
  }, []);

  const closeMediaCenter = useCallback(() => {
    setIsMediaCenterOpen(false);
  }, []);

  const updateMediaSlot = useCallback(
    (slotKey: keyof Omit<MediaStore, 'services' | 'certificates' | 'gallery'>, dataUrl: string | null) => {
      setMedia((prev) => ({
        ...prev,
        [slotKey]: dataUrl,
      }));
    },
    []
  );

  const updateServiceImage = useCallback((serviceId: string, dataUrl: string | null) => {
    setMedia((prev) => {
      const nextServices = { ...prev.services };
      if (dataUrl) {
        nextServices[serviceId] = dataUrl;
      } else {
        delete nextServices[serviceId];
      }
      return {
        ...prev,
        services: nextServices,
      };
    });
  }, []);

  const updateCertificateImage = useCallback((certId: string, dataUrl: string | null) => {
    setMedia((prev) => {
      const nextCerts = { ...prev.certificates };
      if (dataUrl) {
        nextCerts[certId] = dataUrl;
      } else {
        delete nextCerts[certId];
      }
      return {
        ...prev,
        certificates: nextCerts,
      };
    });
  }, []);

  const addGalleryPhoto = useCallback((item: GalleryItem) => {
    setMedia((prev) => {
      const isFirstReal = !prev.gallery.some(
        (g) => g.isUserUploaded || g.image?.startsWith('data:') || g.image?.startsWith('blob:')
      );
      const existing = isFirstReal ? [] : prev.gallery.filter((g) => g.id !== item.id);
      return {
        ...prev,
        gallery: [{ ...item, isUserUploaded: true }, ...existing],
      };
    });
  }, []);

  const addMultipleGalleryPhotos = useCallback((items: GalleryItem[]) => {
    setMedia((prev) => {
      const flagged = items.map((i) => ({ ...i, isUserUploaded: true }));
      const newIds = new Set(flagged.map((i) => i.id));
      const isFirstReal = !prev.gallery.some(
        (g) => g.isUserUploaded || g.image?.startsWith('data:') || g.image?.startsWith('blob:')
      );
      const existing = isFirstReal ? [] : prev.gallery.filter((g) => !newIds.has(g.id));
      return {
        ...prev,
        gallery: [...flagged, ...existing],
      };
    });
  }, []);

  const removeGalleryPhoto = useCallback((id: string) => {
    setMedia((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((g) => g.id !== id),
    }));
  }, []);

  /**
   * Batch uploader that assigns to specific slots AND ALWAYS creates gallery items!
   */
  const batchUploadFiles = useCallback(
    async (files: File[]) => {
      let matchedCount = 0;
      let galleryCount = 0;

      const newServices: Record<string, string> = { ...media.services };
      const newCerts: Record<string, string> = { ...media.certificates };
      let newLogo = media.logo;
      let newHero = media.heroBanner;
      let newDoctor = media.doctorLead;
      let newClinic1 = media.clinic1;
      let newClinic2 = media.clinic2;
      let newClinic3 = media.clinic3;
      const newGalleryItems: GalleryItem[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const lowerName = file.name.toLowerCase();
        const compressed = await compressImageFile(file, 1280, 0.80);
        const title = formatImageTitle(file.name, `Clinic Photo ${i + 1}`);

        let detectedCategory: 'clinic' | 'smiles' | 'equipment' | 'sterilization' = 'clinic';
        let detectedCategoryLabel = 'Clinic & Operatory';

        // Check matching slots
        if (lowerName.includes('logo')) {
          newLogo = compressed;
          matchedCount++;
        }
        if (lowerName.includes('hero') || lowerName.includes('banner') || lowerName.includes('front') || lowerName.includes('entrance') || lowerName.includes('facade')) {
          newHero = compressed;
          matchedCount++;
        }
        if (lowerName.includes('dinesh') || lowerName.includes('doctor') || lowerName.includes('doc') || lowerName.includes('profile') || lowerName.includes('surgeon')) {
          newDoctor = compressed;
          matchedCount++;
        }
        if (lowerName.includes('rct') || lowerName.includes('root') || lowerName.includes('canal') || lowerName.includes('endo')) {
          newServices['root-canal-treatment'] = compressed;
          matchedCount++;
        }
        if (lowerName.includes('implant') || lowerName.includes('fixture')) {
          newServices['dental-implants'] = compressed;
          matchedCount++;
        }
        if (lowerName.includes('brace') || lowerName.includes('align') || lowerName.includes('ortho') || lowerName.includes('invisalign')) {
          newServices['orthodontics-braces-aligners'] = compressed;
          matchedCount++;
        }
        if (lowerName.includes('crown') || lowerName.includes('bridge') || lowerName.includes('cap') || lowerName.includes('zirconia')) {
          newServices['crowns-and-bridges'] = compressed;
          matchedCount++;
        }
        if (lowerName.includes('kid') || lowerName.includes('pediatric') || lowerName.includes('child')) {
          newServices['pediatric-dentistry'] = compressed;
          matchedCount++;
        }
        if (lowerName.includes('whiten') || lowerName.includes('bleach') || lowerName.includes('cosmetic') || lowerName.includes('smile')) {
          newServices['teeth-whitening-cosmetic'] = compressed;
          detectedCategory = 'smiles';
          detectedCategoryLabel = 'Smile Transformations';
          matchedCount++;
        }
        if (lowerName.includes('scal') || lowerName.includes('clean') || lowerName.includes('gum') || lowerName.includes('periodont')) {
          newServices['gum-care-periodontics'] = compressed;
          matchedCount++;
        }
        if (lowerName.includes('extract') || lowerName.includes('wisdom') || lowerName.includes('surg')) {
          newServices['wisdom-tooth-extractions'] = compressed;
          matchedCount++;
        }
        if (lowerName.includes('ksdc') || lowerName.includes('reg') || lowerName.includes('council')) {
          newCerts['ksdc-reg'] = compressed;
          matchedCount++;
        }
        if (lowerName.includes('mds') || lowerName.includes('master') || lowerName.includes('ramaiah')) {
          newCerts['mds-degree'] = compressed;
          matchedCount++;
        }
        if (lowerName.includes('bds') || lowerName.includes('degree') || lowerName.includes('bachelor')) {
          newCerts['bds-degree'] = compressed;
          matchedCount++;
        }
        if (lowerName.includes('clinic-1') || lowerName.includes('operatory-1') || lowerName.includes('chair-1')) {
          newClinic1 = compressed;
          matchedCount++;
        }
        if (lowerName.includes('clinic-2') || lowerName.includes('operatory-2') || lowerName.includes('chair-2')) {
          newClinic2 = compressed;
          matchedCount++;
        }
        if (lowerName.includes('steril') || lowerName.includes('autoclave')) {
          newClinic3 = compressed;
          detectedCategory = 'sterilization';
          detectedCategoryLabel = 'Sterilization & Safety';
          matchedCount++;
        }
        if (lowerName.includes('sensor') || lowerName.includes('rvg') || lowerName.includes('xray') || lowerName.includes('motor') || lowerName.includes('equip')) {
          detectedCategory = 'equipment';
          detectedCategoryLabel = 'Modern Equipment';
        }

        // ALWAYS create a gallery item for EVERY uploaded image
        newGalleryItems.push({
          id: `real-img-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 7)}`,
          title,
          category: detectedCategory,
          categoryLabel: detectedCategoryLabel,
          image: compressed,
          description: `Authentic photograph from Gurukrupa Family Dental Care, Laggere, Bengaluru.`,
          isUserUploaded: true,
        });
        galleryCount++;
      }

      setMedia((prev) => {
        // Keep uploaded items at the front of the gallery
        const existingRealItems = prev.gallery.filter((g) => g.isUserUploaded || g.image?.startsWith('data:'));
        const combinedGallery = [...newGalleryItems, ...existingRealItems];

        return {
          ...prev,
          logo: newLogo,
          heroBanner: newHero,
          doctorLead: newDoctor,
          clinic1: newClinic1,
          clinic2: newClinic2,
          clinic3: newClinic3,
          services: newServices,
          certificates: newCerts,
          gallery: combinedGallery.length > 0 ? combinedGallery : [...newGalleryItems, ...prev.gallery],
        };
      });

      return { matchedCount, galleryCount };
    },
    [media]
  );

  const resetAllMedia = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('gurukrupa_custom_logo');
    localStorage.removeItem('gurukrupa_custom_gallery');
    localStorage.removeItem('gurukrupa_custom_doctors');
    clearAllDB();
    setMedia(defaultMediaStore);
  }, []);

  return (
    <MediaContext.Provider
      value={{
        media,
        isMediaCenterOpen,
        activeMediaCenterTab,
        openMediaCenter,
        closeMediaCenter,
        updateMediaSlot,
        updateServiceImage,
        updateCertificateImage,
        addGalleryPhoto,
        addGalleryItem: addGalleryPhoto,
        addMultipleGalleryPhotos,
        addMultipleGalleryItems: addMultipleGalleryPhotos,
        removeGalleryPhoto,
        removeGalleryItem: removeGalleryPhoto,
        batchUploadFiles,
        resetAllMedia,
      }}
    >
      {children}
    </MediaContext.Provider>
  );
};

export const useMedia = () => {
  const context = useContext(MediaContext);
  if (!context) {
    throw new Error('useMedia must be used within a MediaProvider');
  }
  return context;
};
