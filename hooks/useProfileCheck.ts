import { useEffect, useState } from 'react';
import { router, usePathname } from 'expo-router';
import { auth } from '../services/firebase';
import { ProfileService } from '../services/api/ProfileService';

export function useProfileCheck() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Only check profile if we're on tabs route and not already redirecting
    if (pathname === '/(tabs)' || pathname === '/') {
      checkProfile();
    }
  }, [pathname]);

  const checkProfile = async () => {
    try {
      const user = auth.currentUser;
      console.log('🔍 Checking profile for user:', user?.uid);
      
      if (!user) {
        console.log('❌ No user found');
        setIsLoading(false);
        return;
      }

      // Don't redirect if already on create-profile-new page
      if (pathname === '/create-profile-new') {
        console.log('📍 Already on create-profile-new page');
        setHasProfile(false);
        setIsLoading(false);
        return;
      }

      const profile = await ProfileService.getUserProfile(user.uid);
      const profileExists = !!profile;
      
      console.log('📄 Profile exists:', profileExists);
      setHasProfile(profileExists);
      
      if (!profileExists && !isRedirecting) {
        console.log('🔄 Redirecting to create-profile-new');
        console.log('📍 Current pathname:', pathname);
        console.log('📍 Available routes:', ['login', 'signup', 'create-profile-new', '(tabs)']);
        
        setIsRedirecting(true);
        
        try {
          // Redirect to create profile if no profile exists
          console.log('🔄 Trying router.replace with absolute path...');
          router.replace('/create-profile-new');
          console.log('✅ Redirect successful');
        } catch (error) {
          console.error('❌ Redirect failed:', error);
          // Fallback: try different approaches
          try {
            console.log('🔄 Trying router.push with absolute path...');
            router.push('/create-profile-new');
          } catch (pushError) {
            console.error('❌ Push also failed:', pushError);
            // Last resort: try to navigate to index and let root layout handle it
            router.replace('/');
          }
        }
      }
    } catch (error) {
      console.error('❌ Error checking profile:', error);
      // If there's an error, assume no profile and redirect
      setHasProfile(false);
      
      if (!isRedirecting) {
        setIsRedirecting(true);
        console.log('🔄 Redirecting to create-profile-new due to error');
        
        try {
          console.log('🔄 Trying router.replace with absolute path (error case)...');
          router.replace('/create-profile-new');
          console.log('✅ Redirect successful (error case)');
        } catch (redirectError) {
          console.error('❌ Redirect failed (error case):', redirectError);
          try {
            console.log('🔄 Trying router.push with absolute path (error case)...');
            router.push('/create-profile-new');
          } catch (pushError) {
            console.error('❌ Push also failed (error case):', pushError);
            router.replace('/');
          }
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, hasProfile, checkProfile };
}
