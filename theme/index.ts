export { colors } from './colors';
export { typography } from './typography';
export { spacing } from './spacings';

// Combined theme object
export const theme = {
  colors,
  typography,
  spacing,
} as const; 