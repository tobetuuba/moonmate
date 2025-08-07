import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { colors } from '../theme/colors';

// Theme types
export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: 'light' | 'dark';
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  colors: typeof colors;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Light theme colors (you can customize these)
const lightColors = {
  // Primary Colors
  primary: {
    50: '#F3E8FF',
    100: '#E9D5FF',
    200: '#D8B4FE',
    300: '#C084FC',
    400: '#A855F7',
    500: '#8B5CF6',
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
    500: '#EC4899',
    600: '#DB2777',
    700: '#BE185D',
    800: '#9D174D',
    900: '#831843',
  },

  // Accent Colors
  accent: {
    gold: '#F59E0B',
    silver: '#9CA3AF',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
  },

  // Background Colors
  background: {
    primary: '#FFFFFF',
    secondary: '#F9FAFB',
    tertiary: '#F3F4F6',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },

  // Text Colors
  text: {
    primary: '#1F2937',
    secondary: '#4B5563',
    tertiary: '#6B7280',
    disabled: '#9CA3AF',
    inverse: '#FFFFFF',
    white: '#FFFFFF',
  },

  // Border Colors
  border: {
    primary: '#D1D5DB',
    secondary: '#E5E7EB',
    accent: '#8B5CF6',
  },

  // Gradient Colors
  gradients: {
    primary: ['#8B5CF6', '#A855F7'],
    secondary: ['#EC4899', '#F472B6'],
    background: ['#FFFFFF', '#F9FAFB'],
    card: ['#F9FAFB', '#F3F4F6'],
  },
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');

  // Determine current theme based on mode and system preference
  const theme = themeMode === 'system' 
    ? (systemColorScheme || 'dark') 
    : themeMode;

  // Get appropriate colors based on theme
  const themeColors = theme === 'light' ? lightColors : colors;

  const value: ThemeContextType = {
    theme,
    themeMode,
    setThemeMode,
    colors: themeColors,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
