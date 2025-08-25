import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { initializeAuth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const app = initializeApp({
  apiKey: process.env.EXPO_PUBLIC_FB_API_KEY!,
  authDomain: process.env.EXPO_PUBLIC_FB_AUTH_DOMAIN!,
  projectId: process.env.EXPO_PUBLIC_FB_PROJECT_ID!,
  storageBucket: process.env.EXPO_PUBLIC_FB_STORAGE!,
  messagingSenderId: process.env.EXPO_PUBLIC_FB_SENDER!,
  appId: process.env.EXPO_PUBLIC_FB_APP_ID!,
});

export const db = getFirestore(app);
export const storage = getStorage(app);

// Try to load RN-specific persistence helper if available
let authInitOptions: any | undefined;
try {
  // Some Firebase versions expose this helper at 'firebase/auth/react-native'.
  // If it's not present, we'll gracefully fall back to in-memory persistence.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  // @ts-ignore – TS may not have types for this subpath in older versions
  const { getReactNativePersistence } = require('firebase/auth/react-native');
  authInitOptions = { persistence: getReactNativePersistence(AsyncStorage) };
} catch {
  // fallback: no options → initializeAuth will use default (in-memory) persistence
}

export const auth = initializeAuth(app, authInitOptions);
