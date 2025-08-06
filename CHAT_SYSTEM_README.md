# Chat System Implementation

This document explains the complete chat system implementation for the MoonMate dating app.

## 🏗️ Architecture Overview

The chat system consists of several key components:

### 1. **Firestore Database Structure**
```
matches/
├── {matchId}: {
│   userA: 'user123',
│   userB: 'user456',
│   visualMatch: true,
│   timestamp: serverTimestamp(),
│   chatStarted: true,        // NEW: Added when chat is created
│   chatId: 'chat_abc123'     // NEW: Added when chat is created
│ }

chats/
├── {chatId1}: {
│   participants: ['userA', 'userB'],
│   createdAt: serverTimestamp(),
│   lastMessage: {            // NEW: Added when message is sent
│     text: 'Hello!',
│     senderId: 'userA',
│     timestamp: serverTimestamp()
│   },
│   lastMessageTimestamp: serverTimestamp() // NEW: Added when message is sent
│ }
├── {chatId2}: {
│   participants: ['userC', 'userD'],
│   createdAt: serverTimestamp(),
│   lastMessage: {
│     text: 'Hi there!',
│     senderId: 'userC',
│     timestamp: serverTimestamp()
│   },
│   lastMessageTimestamp: serverTimestamp()
│ }

chats/{chatId}/messages/
├── {messageId1}: {
│   senderId: 'userA',
│   text: 'Hello!',
│   timestamp: serverTimestamp()
│ }
├── {messageId2}: {
│   senderId: 'userB',
│   text: 'Hi there!',
│   timestamp: serverTimestamp()
│ }
```

### 2. **Core Components**

#### **`utils/createOrGetChat.ts`**
- **Purpose**: Creates or retrieves a chat between two users
- **Function**: `createOrGetChat(userA: string, userB: string) => Promise<string>`
- **Features**:
  - Checks for existing chats with either participant order
  - Creates new chat if none exists
  - Updates related match document with `chatStarted: true` and `chatId`
  - Returns chat ID for navigation

#### **`app/chat/[chatId].tsx`**
- **Purpose**: Real-time chat screen
- **Features**:
  - Real-time message updates using `onSnapshot`
  - Message alignment (right for own, left for others)
  - Auto-scroll to bottom
  - Send message functionality
  - Updates chat document with `lastMessage` and `lastMessageTimestamp`
  - Loading and empty states

#### **`app/chats.tsx`**
- **Purpose**: Chat list screen
- **Features**:
  - Lists all chats for current user
  - Shows other user's profile info
  - Displays last message preview from chat document
  - Shows last message timestamp
  - Navigation to individual chats

#### **`app/(tabs)/chat.tsx`**
- **Purpose**: Tab navigation wrapper for chat list

### 3. **Integration Points**

#### **MatchModal Integration**
When users match, the `MatchModal` now:
1. Calls `createOrGetChat()` to create/retrieve chat
2. Navigates to chat screen with the chat ID
3. Provides seamless transition from match to conversation

#### **Visual Match Integration**
The visual match system:
1. Detects mutual likes using `useSwipeActions`
2. Triggers `MatchModal` with matched user info
3. Creates chat when "Start Chat" is pressed

## 🚀 Usage Examples

### **Creating a Chat from Match**
```typescript
import createOrGetChat from '../utils/createOrGetChat';

const handleMatch = async (matchedUserId: string) => {
  try {
    const currentUserId = auth.currentUser?.uid;
    const chatId = await createOrGetChat(currentUserId, matchedUserId);
    router.push(`/chat/${chatId}`);
  } catch (error) {
    console.error('Error creating chat:', error);
  }
};
```

### **Sending a Message**
```typescript
const sendMessage = async () => {
  const messageText = newMessage.trim();
  const messageTimestamp = serverTimestamp();
  
  // Add message to messages subcollection
  const messagesRef = collection(db, 'chats', chatId, 'messages');
  await addDoc(messagesRef, {
    senderId: currentUserId,
    text: messageText,
    timestamp: messageTimestamp,
  });

  // Update chat document with lastMessage info
  const chatRef = doc(db, 'chats', chatId);
  await updateDoc(chatRef, {
    lastMessage: {
      text: messageText,
      senderId: currentUserId,
      timestamp: messageTimestamp,
    },
    lastMessageTimestamp: messageTimestamp,
  });
};
```

### **Listening to Messages**
```typescript
const messagesRef = collection(db, 'chats', chatId, 'messages');
const q = query(messagesRef, orderBy('timestamp', 'asc'));

const unsubscribe = onSnapshot(q, (snapshot) => {
  const messages = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  setMessages(messages);
});
```

## 🎨 UI/UX Features

### **Chat Screen**
- **Message Bubbles**: Different colors for own vs other messages
- **Timestamps**: Formatted time display
- **Auto-scroll**: Automatically scrolls to latest message
- **Loading States**: Shows spinner while loading messages
- **Empty State**: Friendly message when no messages exist

### **Chat List**
- **User Avatars**: Shows profile photos or initials
- **Chat Previews**: Shows last message preview from chat document
- **Timestamps**: Shows when last message was sent
- **Empty State**: Encourages users to start matching

### **MatchModal**
- **Animated Photos**: Rotating and scaling animations
- **Gradient Background**: Beautiful visual design
- **Action Buttons**: "Start Chat" and "Keep Swiping" options

## 🔧 Technical Implementation

### **Real-time Updates**
- Uses Firestore `onSnapshot` for live message updates
- Automatically re-renders when new messages arrive
- Handles connection errors gracefully

### **Message Ordering**
- Messages ordered by `timestamp` ascending
- Ensures chronological display
- Handles server timestamp synchronization
- Chat document updated with `lastMessage` for efficient previews

### **User Authentication**
- Validates current user before allowing chat access
- Uses `auth.currentUser?.uid` for sender identification
- Redirects to login if not authenticated

### **Error Handling**
- Comprehensive try-catch blocks
- User-friendly error messages
- Graceful fallbacks for missing data

## 📱 Navigation Flow

1. **User swipes right** on Visual Match screen
2. **Mutual match detected** → `MatchModal` appears
3. **User clicks "Start Chat"** → `createOrGetChat()` called
4. **Chat created/retrieved** → Match document updated with `chatStarted: true`
5. **Navigate to chat screen** → `/chat/{chatId}`
6. **Real-time messaging** begins → Chat document updated with `lastMessage`

## 🔒 Security Considerations

- **Authentication Required**: All chat operations require valid user
- **Participant Validation**: Only chat participants can access messages
- **Input Sanitization**: Message text is trimmed and validated
- **Rate Limiting**: Consider implementing message rate limits

## 🚀 Future Enhancements

### **Planned Features**
- [ ] Message read receipts
- [ ] Typing indicators
- [ ] Message reactions
- [ ] File/image sharing
- [ ] Push notifications
- [ ] Message search
- [ ] Chat archiving

### **Performance Optimizations**
- [ ] Message pagination
- [ ] Image caching
- [ ] Offline message queuing
- [ ] Message compression

## 🐛 Troubleshooting

### **Common Issues**

1. **Messages not appearing**
   - Check Firestore rules
   - Verify user authentication
   - Check console for errors

2. **Chat not creating**
   - Ensure both user IDs are valid
   - Check Firebase permissions
   - Verify network connection

3. **Real-time updates not working**
   - Check `onSnapshot` listener setup
   - Verify Firestore connection
   - Check for JavaScript errors

### **Debug Commands**
```typescript
// Check current user
console.log('Current user:', auth.currentUser?.uid);

// Check chat creation
console.log('Creating chat between:', userA, userB);

// Check message sending
console.log('Sending message:', messageText);

// Check real-time listener
console.log('Messages received:', messages.length);
```

## 📊 Database Rules

Ensure your Firestore security rules allow:
- Users to read/write their own chat messages
- Users to read chat documents they participate in
- Proper validation of message data

Example rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /chats/{chatId} {
      allow read, write: if request.auth != null && 
        request.auth.uid in resource.data.participants;
      
      match /messages/{messageId} {
        allow read, write: if request.auth != null && 
          get(/databases/$(database)/documents/chats/$(chatId)).data.participants[request.auth.uid] != null;
      }
    }
  }
}
```

This chat system provides a complete, real-time messaging experience integrated seamlessly with the matching system! 🎉 