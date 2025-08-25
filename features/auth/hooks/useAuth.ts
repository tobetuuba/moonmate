import { useEffect, useState } from 'react';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { auth } from '../../../services/firebase';

type MatchPrefs = { ageRange: { min: number; max: number }; distanceKm: number };
type AppUser = {
  id: string;
  preferences?: { match: MatchPrefs };
  location?: { latitude: number; longitude: number };
};

export function useAuth() {
  const [user, setUser] = useState<AppUser | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        // You can fetch profile document later and merge prefs/location.
        setUser({ id: fbUser.uid });
      } else {
        setUser(null);
      }
    });
    return unsub;
  }, []);

  return { user };
}
