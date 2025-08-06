import { colors } from '../theme/colors';
import { Interest } from '../types/profile';

export const DEFAULT_INTERESTS: Interest[] = [
  { id: 'music', label: 'Music', emoji: '🎵', color: colors.primary[500] },
  { id: 'movies', label: 'Movies', emoji: '🎬', color: colors.secondary[500] },
  { id: 'travel', label: 'Travel', emoji: '✈️', color: colors.accent.gold },
  { id: 'cooking', label: 'Cooking', emoji: '👨‍🍳', color: colors.accent.success },
  { id: 'fitness', label: 'Fitness', emoji: '💪', color: colors.primary[600] },
  { id: 'reading', label: 'Reading', emoji: '📚', color: colors.secondary[600] },
  { id: 'photography', label: 'Photography', emoji: '📸', color: colors.accent.warning },
  { id: 'gaming', label: 'Gaming', emoji: '🎮', color: colors.primary[700] },
  { id: 'art', label: 'Art', emoji: '🎨', color: colors.secondary[700] },
  { id: 'dancing', label: 'Dancing', emoji: '💃', color: colors.accent.error },
  { id: 'hiking', label: 'Hiking', emoji: '🏔️', color: colors.accent.success },
  { id: 'coffee', label: 'Coffee', emoji: '☕', color: colors.accent.gold },
  { id: 'yoga', label: 'Yoga', emoji: '🧘‍♀️', color: colors.primary[400] },
  { id: 'wine', label: 'Wine', emoji: '🍷', color: colors.secondary[400] },
  { id: 'pets', label: 'Pets', emoji: '🐕', color: colors.accent.success },
  { id: 'technology', label: 'Technology', emoji: '💻', color: colors.primary[800] },
];

export const MAX_INTERESTS = 6;
export const BIO_MAX_LENGTH = 300; 