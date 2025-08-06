export const spacing = {
  // Base spacing units
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
  '4xl': 96,

  // Specific spacing for common use cases
  screen: {
    padding: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },

  // Component spacing
  card: {
    padding: 16,
    margin: 8,
    borderRadius: 12,
  },

  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },

  input: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },

  // Layout spacing
  layout: {
    header: 60,
    tabBar: 80,
    section: 24,
    item: 16,
  },

  // Icon spacing
  icon: {
    small: 16,
    medium: 24,
    large: 32,
  },

  // Avatar spacing
  avatar: {
    small: 32,
    medium: 48,
    large: 64,
    xl: 80,
  },
} as const;

export type Spacing = typeof spacing; 