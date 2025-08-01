import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { NotificationService } from '../services/NotificationService';
import * as Notifications from 'expo-notifications';

interface NotificationContextType {
  hasPermission: boolean;
  expoPushToken: string | null;
  badgeCount: number;
  requestPermission: () => Promise<void>;
  sendTestNotification: () => Promise<void>;
  clearBadge: () => Promise<void>;
  scheduleDailyReminder: () => Promise<void>;
  cancelAllNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [hasPermission, setHasPermission] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [badgeCount, setBadgeCount] = useState(0);

  useEffect(() => {
    initializeNotifications();
  }, []);

  const initializeNotifications = async () => {
    try {
      // Check current permission status
      const permissionStatus = await NotificationService.getNotificationSettings();
      setHasPermission(permissionStatus.status === 'granted');

      if (permissionStatus.status === 'granted') {
        // Get push token
        const token = await NotificationService.getExpoPushToken();
        setExpoPushToken(token);

        // Get current badge count
        const count = await NotificationService.getBadgeCount();
        setBadgeCount(count);

        // Set up notification listeners
        setupNotificationListeners();
      }
    } catch (error) {
      console.error('Error initializing notifications:', error);
    }
  };

  const setupNotificationListeners = () => {
    // Listen for incoming notifications
    const notificationListener = NotificationService.addNotificationListener(
      (notification) => {
        console.log('Notification received:', notification);
        // Update badge count
        updateBadgeCount();
      }
    );

    // Listen for notification responses (when user taps notification)
    const responseListener = NotificationService.addNotificationResponseListener(
      (response) => {
        console.log('Notification response:', response);
        
        const data = response.notification.request.content.data;
        
        // Handle different notification types
        switch (data?.type) {
          case 'match':
            // Navigate to match screen
            console.log('Navigate to match:', data.matchId);
            break;
          case 'message':
            // Navigate to chat screen
            console.log('Navigate to chat:', data.matchId);
            break;
          case 'zodiac_match':
            // Navigate to zodiac match screen
            console.log('Navigate to zodiac match');
            break;
          case 'test_result':
            // Navigate to test result screen
            console.log('Navigate to test result');
            break;
          default:
            break;
        }

        // Clear badge count when user interacts with notification
        clearBadge();
      }
    );

    // Cleanup listeners on unmount
    return () => {
      NotificationService.removeNotificationListener(notificationListener);
      NotificationService.removeNotificationListener(responseListener);
    };
  };

  const requestPermission = async () => {
    try {
      const granted = await NotificationService.requestPermissions();
      setHasPermission(granted);

      if (granted) {
        const token = await NotificationService.getExpoPushToken();
        setExpoPushToken(token);
        setupNotificationListeners();
        
        Alert.alert(
          'Notifications Enabled',
          'You\'ll now receive notifications for matches, messages, and other important updates!'
        );
      } else {
        Alert.alert(
          'Permission Denied',
          'You can enable notifications later in your device settings to stay updated with new matches and messages.'
        );
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      Alert.alert('Error', 'Failed to request notification permission. Please try again.');
    }
  };

  const sendTestNotification = async () => {
    try {
      await NotificationService.sendLocalNotification({
        type: 'general',
        title: '🔔 Test Notification',
        body: 'This is a test notification from MoonMate!',
        data: { type: 'test' },
      });
      
      Alert.alert('Success', 'Test notification sent!');
    } catch (error) {
      console.error('Error sending test notification:', error);
      Alert.alert('Error', 'Failed to send test notification.');
    }
  };

  const clearBadge = async () => {
    try {
      await NotificationService.clearBadgeCount();
      setBadgeCount(0);
    } catch (error) {
      console.error('Error clearing badge:', error);
    }
  };

  const updateBadgeCount = async () => {
    try {
      const count = await NotificationService.getBadgeCount();
      setBadgeCount(count);
    } catch (error) {
      console.error('Error updating badge count:', error);
    }
  };

  const scheduleDailyReminder = async () => {
    try {
      await NotificationService.scheduleDailyReminder();
      Alert.alert('Success', 'Daily reminder scheduled for 12 PM!');
    } catch (error) {
      console.error('Error scheduling daily reminder:', error);
      Alert.alert('Error', 'Failed to schedule daily reminder.');
    }
  };

  const cancelAllNotifications = async () => {
    try {
      await NotificationService.cancelAllNotifications();
      Alert.alert('Success', 'All scheduled notifications cancelled!');
    } catch (error) {
      console.error('Error cancelling notifications:', error);
      Alert.alert('Error', 'Failed to cancel notifications.');
    }
  };

  const value: NotificationContextType = {
    hasPermission,
    expoPushToken,
    badgeCount,
    requestPermission,
    sendTestNotification,
    clearBadge,
    scheduleDailyReminder,
    cancelAllNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
} 