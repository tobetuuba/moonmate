declare module 'firebase/auth/react-native' {
  import type { Persistence } from 'firebase/auth';
  // Minimal type for RN persistence helper
  export function getReactNativePersistence(storage: any): Persistence;
}
