export interface UserProfile {
  id: string;
  displayName: string;
  age: number;
  birthDate?: string; // YYYY-MM-DD format
  birthTime?: string; // HH:MM format
  birthPlace?: {
    city: string;
    country: string;
    latitude: number;
    longitude: number;
  };
  location?: {
    city: string;
    country: string;
    latitude: number;
    longitude: number;
  };
  gender?: string;
  seeking: string[]; // e.g. ["men", "women", "non-binary"]
  relationshipGoals?: string[]; // e.g. ["Long-term relationship", "Friendship"]
  bio: string;
  photos: string[];
  profilePhotoUrl?: string;
  personality?: {
    empathy: number;
    openness: number;
  };
  interests: string[];
  socialLinks: SocialLinks;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SocialLinks {
  instagram?: string;
  spotify?: string;
  twitter?: string;
  linkedin?: string;
}

export interface Interest {
  id: string;
  label: string;
  emoji: string;
  color: string;
}

export type SocialPlatform = 'instagram' | 'spotify' | 'twitter' | 'linkedin';

export interface SocialPlatformConfig {
  icon: string;
  label: string;
  color: string;
  gradient: string[];
}

export interface ProfileSectionProps {
  title: string;
  children: React.ReactNode;
  showEditButton?: boolean;
  onEditPress?: () => void;
  style?: any;
}

export interface BioEditModalProps {
  visible: boolean;
  bio: string;
  onSave: (bio: string) => void;
  onClose: () => void;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  duration?: number;
} 