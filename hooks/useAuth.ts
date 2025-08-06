import { useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

interface UseAuthReturn extends AuthState {
  // User properties
  uid: string | null;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  
  // Auth state helpers
  isAuthenticated: boolean;
  isAnonymous: boolean;
  isEmailVerified: boolean;
  
  // User info helpers
  getInitials: () => string;
  getDisplayName: () => string;
}

export default function useAuth(): UseAuthReturn {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setAuthState({
          user,
          loading: false,
          error: null,
        });
      },
      (error) => {
        setAuthState({
          user: null,
          loading: false,
          error: error.message,
        });
      }
    );

    return unsubscribe;
  }, []);

  // Computed properties
  const uid = authState.user?.uid || null;
  const displayName = authState.user?.displayName || null;
  const email = authState.user?.email || null;
  const photoURL = authState.user?.photoURL || null;
  
  const isAuthenticated = !!authState.user;
  const isAnonymous = authState.user?.isAnonymous || false;
  const isEmailVerified = authState.user?.emailVerified || false;

  // Helper functions
  const getInitials = (): string => {
    if (!displayName) return '?';
    
    const names = displayName.split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  const getDisplayName = (): string => {
    return displayName || email || 'Unknown User';
  };

  return {
    // Auth state
    ...authState,
    
    // User properties
    uid,
    displayName,
    email,
    photoURL,
    
    // Auth state helpers
    isAuthenticated,
    isAnonymous,
    isEmailVerified,
    
    // Helper functions
    getInitials,
    getDisplayName,
  };
} 