import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AuthProvider } from '../context/AuthContext';
import { NotificationProvider } from '../context/NotificationContext';
import { ThemeProvider } from '../context/ThemeContext';
import { useProfileCheck } from '../hooks/useProfileCheck';

export default function RootLayout() {
  useFrameworkReady();
  const { isLoading } = useProfileCheck();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="login" />
              <Stack.Screen name="signup" />
              <Stack.Screen name="create-profile" />
              <Stack.Screen name="create-profile-new" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
