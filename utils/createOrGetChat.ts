import {
  getDocs,
  query,
  collection,
  addDoc,
  where,
  serverTimestamp,
  DocumentData,
  updateDoc,
  doc,
} from 'firebase/firestore';
import { db } from '../services/firebase';

interface ChatDocument {
  participants: string[];
  createdAt: any; // serverTimestamp()
}

/**
 * Creates a new chat or retrieves an existing chat between two users
 * @param userA - First user ID
 * @param userB - Second user ID
 * @returns Promise<string> - The chat document ID
 */
export default async function createOrGetChat(
  userA: string,
  userB: string
): Promise<string> {
  try {
    console.log('🔍 Checking for existing chat between:', userA, 'and', userB);
    
    // Validate input parameters
    if (!userA || !userB) {
      throw new Error('Both userA and userB are required');
    }
    
    if (userA === userB) {
      throw new Error('Cannot create chat with yourself');
    }

    // Create the participants arrays to search for
    const participantsArray1 = [userA, userB];
    const participantsArray2 = [userB, userA];

    // Query for existing chat with either participant order
    const chatsRef = collection(db, 'chats');
    const q = query(
      chatsRef,
      where('participants', 'in', [participantsArray1, participantsArray2])
    );

    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      // Chat already exists
      const existingChat = querySnapshot.docs[0];
      const chatId = existingChat.id;
      console.log('✅ Found existing chat:', chatId);
      return chatId;
    }

    // No existing chat found, create a new one
    console.log('📝 Creating new chat between:', userA, 'and', userB);
    
    const newChatData: ChatDocument = {
      participants: [userA, userB],
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'chats'), newChatData);
    const chatId = docRef.id;
    
    console.log('✅ New chat created with ID:', chatId);
    console.log('📄 Chat data:', {
      participants: newChatData.participants,
      createdAt: 'serverTimestamp()',
    });

    // Update the related match document
    try {
      const matchId = [userA, userB].sort().join('_');
      const matchRef = doc(db, 'matches', matchId);
      
      await updateDoc(matchRef, {
        chatStarted: true,
        chatId: chatId,
      });
      
      console.log('✅ Match document updated with chat info:', matchId);
    } catch (error) {
      console.error('⚠️ Warning: Could not update match document:', error);
      // Don't throw error here as chat was created successfully
    }

    return chatId;
  } catch (error) {
    console.error('❌ Error in createOrGetChat:', error);
    throw error;
  }
}

/**
 * Helper function to get chat ID from match data
 * @param userA - First user ID
 * @param userB - Second user ID
 * @returns Promise<string> - The chat document ID
 */
export async function getChatIdFromMatch(userA: string, userB: string): Promise<string> {
  return createOrGetChat(userA, userB);
}

/**
 * Helper function to create chat from match document
 * @param matchData - Match document data
 * @returns Promise<string> - The chat document ID
 */
export async function createChatFromMatch(matchData: {
  userA: string;
  userB: string;
}): Promise<string> {
  return createOrGetChat(matchData.userA, matchData.userB);
} 