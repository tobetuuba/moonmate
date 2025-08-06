// MoonMate Theme Colors
export const colors = {
  // Primary Colors
  primary: {
    50: '#F3E8FF',
    100: '#E9D5FF',
    200: '#D8B4FE',
    300: '#C084FC',
    400: '#A855F7',
    500: '#8B5CF6', // Main primary
    600: '#7C3AED',
    700: '#6D28D9',
    800: '#5B21B6',
    900: '#4C1D95',
  },

  // Secondary Colors
  secondary: {
    50: '#FDF2F8',
    100: '#FCE7F3',
    200: '#FBCFE8',
    300: '#F9A8D4',
    400: '#F472B6',
    500: '#EC4899', // Main secondary
    600: '#DB2777',
    700: '#BE185D',
    800: '#9D174D',
    900: '#831843',
  },

  // Accent Colors
  accent: {
    gold: '#F59E0B', // Premium features
    silver: '#9CA3AF', // Disabled features
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
  },

  // Background Colors
  background: {
    primary: '#0F0F23', // Dark space
    secondary: '#1A1A2E', // Dark cards
    tertiary: '#2D2D44', // Slightly lighter
    overlay: 'rgba(0, 0, 0, 0.7)',
  },

  // Text Colors
  text: {
    primary: '#FFFFFF',
    secondary: '#E5E7EB',
    tertiary: '#9CA3AF',
    disabled: '#6B7280',
    inverse: '#1F2937',
    white: '#FFFFFF',
  },

  // Border Colors
  border: {
    primary: '#374151',
    secondary: '#4B5563',
    accent: '#8B5CF6',
  },

  // Gradient Colors
  gradients: {
    primary: ['#8B5CF6', '#A855F7'],
    secondary: ['#EC4899', '#F472B6'],
    background: ['#0F0F23', '#1A1A2E'],
    card: ['#1A1A2E', '#2D2D44'],
  },
} as const;

export type ColorScheme = typeof colors; 