import createOrGetChat, { getChatIdFromMatch, createChatFromMatch } from './createOrGetChat';

// Example usage of createOrGetChat utility function
export async function exampleUsage() {
  try {
    // Example 1: Create or get chat between two users
    const userA = 'user123';
    const userB = 'user456';
    
    const chatId = await createOrGetChat(userA, userB);
    console.log('Chat ID:', chatId);
    
    // Example 2: Try to get the same chat again (should return existing chat)
    const sameChatId = await createOrGetChat(userA, userB);
    console.log('Same Chat ID:', sameChatId); // Should be the same as chatId
    
    // Example 3: Create chat with different user order (should return same chat)
    const reverseChatId = await createOrGetChat(userB, userA);
    console.log('Reverse Chat ID:', reverseChatId); // Should be the same as chatId
    
  } catch (error) {
    console.error('Error in example:', error);
  }
}

// Example integration with match system
export async function createChatFromMatchExample() {
  try {
    // Simulate match data from Firestore
    const matchData = {
      userA: 'user123',
      userB: 'user456',
      visualMatch: true,
      timestamp: new Date(),
    };
    
    // Create chat from match
    const chatId = await createChatFromMatch(matchData);
    console.log('Chat created from match:', chatId);
    
    // The match document will be automatically updated with:
    // - chatStarted: true
    // - chatId: chatId
    
    return chatId;
  } catch (error) {
    console.error('Error creating chat from match:', error);
    throw error;
  }
}

// Example integration with MatchModal
export async function handleStartChat(userA: string, userB: string) {
  try {
    console.log('Starting chat between:', userA, 'and', userB);
    
    // Create or get chat
    const chatId = await createOrGetChat(userA, userB);
    
    console.log('✅ Chat ready:', chatId);
    
    // Navigate to chat screen
    // router.push(`/chat/${chatId}`);
    
    return chatId;
  } catch (error) {
    console.error('❌ Error starting chat:', error);
    throw error;
  }
}

// Example of how the updated Firestore structure looks:
export const firestoreStructureExample = {
  // Match document (updated when chat is created)
  matches: {
    'user123_user456': {
      userA: 'user123',
      userB: 'user456',
      visualMatch: true,
      timestamp: 'serverTimestamp()',
      chatStarted: true,        // NEW: Added when chat is created
      chatId: 'chat_abc123',    // NEW: Added when chat is created
    }
  },
  
  // Chat document (updated with lastMessage when messages are sent)
  chats: {
    'chat_abc123': {
      participants: ['user123', 'user456'],
      createdAt: 'serverTimestamp()',
      lastMessage: {            // NEW: Added when message is sent
        text: 'Hello!',
        senderId: 'user123',
        timestamp: 'serverTimestamp()',
      },
      lastMessageTimestamp: 'serverTimestamp()', // NEW: Added when message is sent
    }
  },
  
  // Messages subcollection
  'chats/chat_abc123/messages': {
    'msg_1': {
      senderId: 'user123',
      text: 'Hello!',
      timestamp: 'serverTimestamp()',
    },
    'msg_2': {
      senderId: 'user456',
      text: 'Hi there!',
      timestamp: 'serverTimestamp()',
    }
  }
};

// Example usage in MatchModal onStartChat callback:
/*
import createOrGetChat from '../utils/createOrGetChat';

const handleStartChat = async () => {
  try {
    const currentUserId = auth.currentUser?.uid;
    const matchedUserId = matchedUser.id;
    
    if (currentUserId && matchedUserId) {
      const chatId = await createOrGetChat(currentUserId, matchedUserId);
      
      // The match document will be automatically updated with chat info
      // The chat document will be updated with lastMessage when messages are sent
      
      // Navigate to chat screen
      router.push(`/chat/${chatId}`);
    }
  } catch (error) {
    console.error('Failed to start chat:', error);
    // Show error toast or alert
  }
};
*/ 