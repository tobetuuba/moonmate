import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { auth } from '../services/firebase';
import { ProfileService } from '../services/api/ProfileService';

export function useProfileCheck() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    checkProfile();
  }, []);

  const checkProfile = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        setIsLoading(false);
        return;
      }

      const profile = await ProfileService.getUserProfile(user.uid);
      const profileExists = !!profile;
      
      setHasProfile(profileExists);
      
      if (!profileExists) {
        // Redirect to create profile if no profile exists
        router.replace('/create-profile-new');
      }
    } catch (error) {
      console.error('Error checking profile:', error);
      // If there's an error, assume no profile and redirect
      setHasProfile(false);
      router.replace('/create-profile-new');
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, hasProfile, checkProfile };
}
