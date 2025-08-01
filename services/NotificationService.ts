import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export interface NotificationData {
  type: 'match' | 'message' | 'like' | 'zodiac_match' | 'test_result' | 'general';
  title: string;
  body: string;
  data?: Record<string, any>;
}

export class NotificationService {
  private static expoPushToken: string | null = null;

  // Request notification permissions
  static async requestPermissions(): Promise<boolean> {
    if (!Device.isDevice) {
      console.log('Must use physical device for Push Notifications');
      return false;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return false;
    }

    return true;
  }

  // Get Expo push token
  static async getExpoPushToken(): Promise<string | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return null;

      const token = await Notifications.getExpoPushTokenAsync({
        projectId: 'e3dbc035-a8c1-4451-8e7a-056a3d15c861',
      });

      this.expoPushToken = token.data;
      console.log('Expo push token:', token.data);
      return token.data;
    } catch (error) {
      console.error('Error getting push token:', error);
      return null;
    }
  }

  // Send local notification
  static async sendLocalNotification(notification: NotificationData): Promise<void> {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data || {},
          sound: 'default',
          badge: 1,
        },
        trigger: null, // Send immediately
      });
    } catch (error) {
      console.error('Error sending local notification:', error);
    }
  }

  // Send push notification to specific user
  static async sendPushNotification(
    expoPushToken: string,
    notification: NotificationData
  ): Promise<void> {
    try {
      const message = {
        to: expoPushToken,
        sound: 'default',
        title: notification.title,
        body: notification.body,
        data: notification.data || {},
        badge: 1,
      };

      await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });
    } catch (error) {
      console.error('Error sending push notification:', error);
    }
  }

  // Send match notification
  static async sendMatchNotification(matchName: string, matchId: string): Promise<void> {
    const notification: NotificationData = {
      type: 'match',
      title: '🎉 New Match!',
      body: `You and ${matchName} liked each other! Start a conversation now.`,
      data: { matchId, type: 'match' },
    };

    await this.sendLocalNotification(notification);
  }

  // Send message notification
  static async sendMessageNotification(
    senderName: string,
    message: string,
    matchId: string
  ): Promise<void> {
    const notification: NotificationData = {
      type: 'message',
      title: `💬 ${senderName}`,
      body: message.length > 50 ? `${message.substring(0, 50)}...` : message,
      data: { matchId, type: 'message' },
    };

    await this.sendLocalNotification(notification);
  }

  // Send like notification
  static async sendLikeNotification(likerName: string): Promise<void> {
    const notification: NotificationData = {
      type: 'like',
      title: '❤️ Someone liked you!',
      body: `${likerName} liked your profile. Swipe to see who it might be!`,
      data: { type: 'like' },
    };

    await this.sendLocalNotification(notification);
  }

  // Send zodiac match notification
  static async sendZodiacMatchNotification(
    matchName: string,
    compatibility: number
  ): Promise<void> {
    const notification: NotificationData = {
      type: 'zodiac_match',
      title: '⭐ Cosmic Connection!',
      body: `${matchName} has ${compatibility}% astrological compatibility with you!`,
      data: { type: 'zodiac_match', compatibility },
    };

    await this.sendLocalNotification(notification);
  }

  // Send test result notification
  static async sendTestResultNotification(): Promise<void> {
    const notification: NotificationData = {
      type: 'test_result',
      title: '🧠 Your Personality Analysis is Ready!',
      body: 'Discover your unique personality profile and see your best matches.',
      data: { type: 'test_result' },
    };

    await this.sendLocalNotification(notification);
  }

  // Send daily reminder notification
  static async sendDailyReminder(): Promise<void> {
    const notification: NotificationData = {
      type: 'general',
      title: '🌟 New Matches Await!',
      body: 'Check out new profiles that might be perfect for you.',
      data: { type: 'daily_reminder' },
    };

    await this.sendLocalNotification(notification);
  }

  // Schedule daily reminder
  static async scheduleDailyReminder(): Promise<void> {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🌟 New Matches Await!',
          body: 'Check out new profiles that might be perfect for you.',
          data: { type: 'daily_reminder' },
          sound: 'default',
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
          hour: 12, // 12 PM
          minute: 0,
          repeats: true,
        },
      });
    } catch (error) {
      console.error('Error scheduling daily reminder:', error);
    }
  }

  // Cancel all scheduled notifications
  static async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error canceling notifications:', error);
    }
  }

  // Get notification settings
  static async getNotificationSettings(): Promise<Notifications.NotificationPermissionsStatus> {
    return await Notifications.getPermissionsAsync();
  }

  // Add notification listener
  static addNotificationListener(
    callback: (notification: Notifications.Notification) => void
  ): Notifications.Subscription {
    return Notifications.addNotificationReceivedListener(callback);
  }

  // Add notification response listener (when user taps notification)
  static addNotificationResponseListener(
    callback: (response: Notifications.NotificationResponse) => void
  ): Notifications.Subscription {
    return Notifications.addNotificationResponseReceivedListener(callback);
  }

  // Remove notification listener
  static removeNotificationListener(subscription: Notifications.Subscription): void {
    subscription.remove();
  }

  // Get current badge count
  static async getBadgeCount(): Promise<number> {
    return await Notifications.getBadgeCountAsync();
  }

  // Set badge count
  static async setBadgeCount(count: number): Promise<void> {
    await Notifications.setBadgeCountAsync(count);
  }

  // Clear badge count
  static async clearBadgeCount(): Promise<void> {
    await Notifications.setBadgeCountAsync(0);
  }
} 