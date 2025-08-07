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
        // Only redirect if we're not already on the create-profile page
        const currentPath = router.getCurrentPath();
        if (currentPath !== '/create-profile') {
          router.replace('/create-profile');
        }
      }
    } catch (error) {
      console.error('Error checking profile:', error);
      // If there's an error, assume no profile and redirect
      setHasProfile(false);
      const currentPath = router.getCurrentPath();
      if (currentPath !== '/create-profile') {
        router.replace('/create-profile');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, hasProfile, checkProfile };
}
