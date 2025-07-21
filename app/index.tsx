import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';

export default function Index() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
    if (user) {
      router.replace('/(tabs)');
    } else {
        router.replace('/login');
      }
    }, 0);

    return () => clearTimeout(timeout);
  }, [user]);

  return null;
} 