# 🔔 MoonMate Push Notifications Setup

## 📱 Overview

MoonMate now includes a comprehensive push notification system that keeps users engaged with:
- **Match notifications** - When someone likes you back
- **Message notifications** - When you receive new messages
- **Zodiac match notifications** - Astrological compatibility alerts
- **Test result notifications** - Personality analysis completion
- **Daily reminders** - Scheduled notifications to check new profiles

## 🛠 Setup Instructions

### 1. Expo Project Configuration

The notification system is already configured in `app.json`:

```json
{
  "expo": {
    "name": "MoonMate",
    "slug": "moonmate",
    "plugins": [
      [
        "expo-notifications",
        {
          "icon": "./assets/images/icon.png",
          "color": "#8B5FBF"
        }
      ]
    ],
    "notification": {
      "icon": "./assets/images/icon.png",
      "color": "#8B5FBF",
      "iosDisplayInForeground": true,
      "androidMode": "default",
      "androidCollapsedTitle": "New Match!"
    }
  }
}
```

### 2. Dependencies Installed

- ✅ `expo-notifications` - Core notification functionality
- ✅ `expo-device` - Device detection for permissions

### 3. Files Created/Modified

#### New Files:
- `services/NotificationService.ts` - Core notification service
- `context/NotificationContext.tsx` - React context for notification state
- `PUSH_NOTIFICATIONS_README.md` - This documentation

#### Modified Files:
- `app/_layout.tsx` - Added NotificationProvider
- `app/(tabs)/profile.tsx` - Added notification settings UI
- `app/swipe.tsx` - Added match notifications
- `app/chat/[id].tsx` - Added message notifications
- `app/test-result.tsx` - Added test completion notifications
- `app.json` - Updated with notification configuration

## 🚀 How to Use

### For Users:

1. **Enable Notifications**: Go to Profile → Preferences → Push Notifications
2. **Test Notifications**: Tap "Send Test Notification" to verify setup
3. **Daily Reminders**: Enable "Schedule Daily Reminder" for 12 PM notifications
4. **Manage Notifications**: Use "Cancel All Notifications" to clear scheduled ones

### For Developers:

#### Sending Notifications:

```typescript
import { NotificationService } from '../services/NotificationService';

// Send match notification
await NotificationService.sendMatchNotification('Emma', 'match-123');

// Send message notification
await NotificationService.sendMessageNotification('Alex', 'Hey there!', 'chat-456');

// Send zodiac match notification
await NotificationService.sendZodiacMatchNotification('Maya', 95);

// Send test result notification
await NotificationService.sendTestResultNotification();

// Schedule daily reminder
await NotificationService.scheduleDailyReminder();
```

#### Using Notification Context:

```typescript
import { useNotifications } from '../context/NotificationContext';

function MyComponent() {
  const { 
    hasPermission, 
    expoPushToken, 
    badgeCount,
    requestPermission,
    sendTestNotification 
  } = useNotifications();

  // Check if notifications are enabled
  if (!hasPermission) {
    return <Button onPress={requestPermission}>Enable Notifications</Button>;
  }

  return <Text>Badge Count: {badgeCount}</Text>;
}
```

## 📋 Notification Types

### 1. Match Notifications
- **Trigger**: When someone likes you back
- **Title**: "🎉 New Match!"
- **Body**: "You and [Name] liked each other! Start a conversation now."
- **Action**: Navigate to chat screen

### 2. Message Notifications
- **Trigger**: When receiving new messages
- **Title**: "💬 [Sender Name]"
- **Body**: Message preview (truncated to 50 characters)
- **Action**: Navigate to specific chat

### 3. Zodiac Match Notifications
- **Trigger**: When finding astrological compatibility
- **Title**: "⭐ Cosmic Connection!"
- **Body**: "[Name] has [X]% astrological compatibility with you!"
- **Action**: Navigate to zodiac match screen

### 4. Test Result Notifications
- **Trigger**: When personality test is completed
- **Title**: "🧠 Your Personality Analysis is Ready!"
- **Body**: "Discover your unique personality profile and see your best matches."
- **Action**: Navigate to test results

### 5. Daily Reminders
- **Trigger**: Scheduled daily at 12 PM
- **Title**: "🌟 New Matches Await!"
- **Body**: "Check out new profiles that might be perfect for you."
- **Action**: Navigate to home screen

## 🔧 Configuration

### Project ID Setup

To enable push notifications, you need to set your Expo project ID:

1. Go to [Expo Dashboard](https://expo.dev)
2. Create a new project or use existing one
3. Copy the project ID
4. Update `NotificationService.ts`:

```typescript
const token = await Notifications.getExpoPushTokenAsync({
  projectId: 'your-actual-project-id', // Replace this
});
```

### Backend Integration

For production, you'll want to send notifications from your backend:

```typescript
// Send to specific user
await NotificationService.sendPushNotification(
  userExpoPushToken,
  {
    type: 'match',
    title: '🎉 New Match!',
    body: 'You and Emma liked each other!',
    data: { matchId: '123' }
  }
);
```

## 🧪 Testing

### Local Testing:
1. Run the app on a physical device (not simulator)
2. Enable notifications in Profile settings
3. Use "Send Test Notification" button
4. Test different notification types by using the app features

### Production Testing:
1. Build the app with `expo build`
2. Install on test devices
3. Verify notifications work in production environment

## 📱 Platform-Specific Notes

### iOS:
- Notifications work in foreground and background
- Badge count is automatically managed
- Rich notifications supported

### Android:
- Notifications work in foreground and background
- Badge count may need manual management
- Custom notification sounds supported

### Web:
- Notifications work in supported browsers
- Requires HTTPS in production
- Limited functionality compared to mobile

## 🚨 Troubleshooting

### Common Issues:

1. **Notifications not showing**:
   - Check device permissions
   - Verify project ID is correct
   - Ensure app is not in foreground (for some notification types)

2. **Badge count not updating**:
   - iOS: Automatic
   - Android: May need manual badge management

3. **Scheduled notifications not working**:
   - Check device battery optimization settings
   - Verify notification permissions

### Debug Commands:

```typescript
// Check notification settings
const settings = await NotificationService.getNotificationSettings();
console.log('Notification settings:', settings);

// Get current badge count
const badgeCount = await NotificationService.getBadgeCount();
console.log('Badge count:', badgeCount);

// Clear all notifications
await NotificationService.cancelAllNotifications();
```

## 🔮 Future Enhancements

- [ ] Rich notifications with images
- [ ] Custom notification sounds
- [ ] Notification categories
- [ ] Silent notifications for data sync
- [ ] Notification analytics
- [ ] A/B testing for notification content

## 📞 Support

For issues with push notifications:
1. Check Expo documentation
2. Verify device permissions
3. Test on physical device
4. Check console logs for errors

---

**Note**: Push notifications require a physical device for testing. Simulators cannot receive push notifications. 