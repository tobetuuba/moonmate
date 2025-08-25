export interface UserProfile {
  id: string;
  displayName: string;
  age: number;
  birthDate?: string; // YYYY-MM-DD format
  birthTime?: string; // HH:MM format
  height?: number; // cm
  profession?: string;
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
  pronouns?: string;
  seeking: string[]; // e.g. ["men", "women", "nonbinary"]
  ageRange?: {
    min: number;
    max: number;
  };
  maxDistance?: number;
  relationshipGoals?: string[]; // e.g. ["Long-term relationship", "Friendship"]
  monogamy?: boolean;
  bio: string;
  prompts?: { [key: string]: string };
  photos: string[];
  profilePhotoUrl?: string;
  personality?: {
    empathy: number;
    openness: number;
  };
  interests: string[];
  smoking?: string;
  drinking?: string;
  diet?: string;
  exercise?: string;
  socialLinks: SocialLinks;
  showOrientation?: boolean;
  showGender?: boolean;
  incognitoMode?: boolean;
  acceptTerms?: boolean;
  acceptPrivacy?: boolean;
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

// Step-specific types for better type safety
export interface BasicInfo {
  displayName: string;
  birthDate: string;
  birthTime: string;
  height?: number;
  location: {
    city: string;
    country: string;
    latitude: number;
    longitude: number;
  };
  profession?: string;
  gender: string;
  pronouns: string;
  preferences: {
    match: {
      seeking: string[];
      ageRange: {
        min: number;
        max: number;
      };
      distanceKm: number;
    };
  };
}

export interface RelationshipGoals {
  preferences: {
    match: {
      intent: string[];
      childrenPlan: string[];
      monogamy: boolean;
    };
  };
}

export interface AboutPrompts {
  bio: string;
  prompts: Record<PromptOption['id'], string>;
}

export interface InterestsLifestyle {
  interests: string[];
  smoking: string;
  drinking: string;
  diet: string;
  exercise: string;
}

export interface PhotoUpload {
  photos: string[];
  profilePhotoUrl: string;
}

export interface PrivacyConfirm {
  showOrientation: boolean;
  showGender: boolean;
  incognitoMode: boolean;
  acceptTerms: boolean;
  acceptPrivacy: boolean;
}

// Prompt option type
export interface PromptOption {
  id: 'ideal-date' | 'life-goal' | 'simple-pleasure' | 'travel-dream' | 'fun-fact';
  question: string;
  icon: string;
}

// Complete form data type
export interface CreateProfileFormData {
  // Step 1: Basic Info
  displayName: string;
  birthDate: string;
  birthTime: string;
  height?: number;
  location: {
    city: string;
    country: string;
    latitude: number;
    longitude: number;
  };
  profession?: string;
  gender: string;
  pronouns: string;
  preferences: {
    match: {
      seeking: string[];
      ageRange: {
        min: number;
        max: number;
      };
      distanceKm: number;
      childrenPlan: string[];
      intent: string[];
      monogamy: boolean;
    };
  };

  // Step 3: About & Prompts
  bio: string;
  prompts: Record<PromptOption['id'], string>;

  // Step 4: Interests & Lifestyle
  interests: string[];
  smoking: string;
  drinking: string;
  diet: string;
  exercise: string;

  // Step 5: Photos
  photos: string[];
  profilePhotoUrl: string;

  // Step 6: Privacy
  showOrientation: boolean;
  showGender: boolean;
  incognitoMode: boolean;
  acceptTerms: boolean;
  acceptPrivacy: boolean;
} 