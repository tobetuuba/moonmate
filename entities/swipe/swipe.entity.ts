// Minimal domain types for Swipe feature

export interface SwipeAction {
  id: string;
  userId: string;
  targetUserId: string;
  action: 'like' | 'pass' | 'superlike';
  timestamp: Date;
  metadata?: {
    location?: { latitude: number; longitude: number };
    timeOfDay?: number; // 0-23
  };
}

export interface CandidateProfile {
  id: string;
  displayName: string;
  age: number;
  photos: string[];
  profilePhotoUrl: string;
  location: { city: string; country: string; latitude?: number; longitude?: number };
  bio?: string;
  interests: string[];
  compatibility?: number; // 0-100
}

export interface SwipeDeck {
  userId: string;
  candidates: CandidateProfile[];
  lastFetched: Date;
  hasMore: boolean;
}
