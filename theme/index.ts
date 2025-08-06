export { colors } from './colors';
export { typography } from './typography';
export { spacing } from './spacings';

// Theme object that combines all theme properties
export const theme = {
  colors,
  typography,
  spacing,
} as const;

export type Theme = typeof theme; 