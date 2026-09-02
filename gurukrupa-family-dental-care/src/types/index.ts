export type PageId = 'home' | 'about' | 'gallery' | 'contact';

export interface DentalService {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: 'preventive' | 'restorative' | 'orthodontics' | 'cosmetic' | 'pediatric' | 'surgical';
  icon: string;
  image: string;
  fallbackImage?: string;
  indications: string[];
  benefits: string[];
  procedureSteps: { step: string; description: string }[];
  durationEstimate: string;
  recoveryNote: string;
  popular?: boolean;
}

export interface DoctorMember {
  id: string;
  name?: string;
  role: string;
  speciality: string;
  degrees: string;
  experienceSummary: string;
  focusAreas: string[];
  image?: string;
  fallbackImage?: string;
  availability?: string;
  regNumber?: string;
  education?: string[];
  universityRegNo?: string;
  councilInfo?: string;
  verifiedDetails?: string[];
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'clinic' | 'smiles' | 'equipment' | 'sterilization';
  categoryLabel: string;
  image: string;
  fallbackImage?: string;
  description: string;
  isUserUploaded?: boolean;
}

export interface Testimonial {
  id: string;
  patientName: string;
  treatment: string;
  rating: number;
  date: string;
  review: string;
  verified: boolean;
  avatarPlaceholder: string;
}

export interface AppointmentFormData {
  fullName: string;
  phone: string;
  email: string;
  serviceId: string;
  preferredDate: string;
  preferredTime: string;
  notes: string;
  preferredContact: 'phone' | 'whatsapp' | 'email';
}

export interface FaqItem {
  question: string;
  answer: string;
  category?: string;
}
