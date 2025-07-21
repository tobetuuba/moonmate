import { useEffect } from 'react';
import { router } from 'expo-router';

export default function Index() {
  useEffect(() => {
    // Redirect to login page by default
    router.replace('/login');
  }, []);

  return null;
} 