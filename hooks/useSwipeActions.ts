import { useCallback } from 'react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';

interface SwipeActions {
  onSwipeRight: (targetUserId: string) => Promise<void>;
  onSwipeLeft: (targetUserId: string) => Promise<void>;
}

/**
 * Custom hook for handling swipe actions in a dating app
 * @param currentUserId - The ID of the current user performing the swipe
 * @returns Object containing onSwipeRight and onSwipeLeft functions
 */
export default function useSwipeActions(currentUserId: string): SwipeActions {
  
  /**
   * Handle right swipe (like)
   * Stores a document at: swipes/{currentUserId}/liked/{targetUserId}
   */
  const onSwipeRight = useCallback(async (targetUserId: string): Promise<void> => {
    try {
      console.log('🔥 Starting onSwipeRight...');
      console.log('Current User ID:', currentUserId);
      console.log('Target User ID:', targetUserId);
      
      if (!currentUserId || !targetUserId) {
        throw new Error('Both currentUserId and targetUserId are required');
      }

      const swipeDocRef = doc(db, 'swipes', currentUserId, 'liked', targetUserId);
      console.log('📄 Document path:', `swipes/${currentUserId}/liked/${targetUserId}`);
      
      const swipeData = {
        timestamp: serverTimestamp(),
      };
      console.log('📝 Swipe data:', swipeData);
      
      await setDoc(swipeDocRef, swipeData);
      console.log('✅ Like stored successfully in Firebase');
    } catch (error) {
      console.error('❌ Error storing like swipe:', error);
      throw error;
    }
  }, [currentUserId]);

  /**
   * Handle left swipe (pass)
   * Stores a document at: swipes/{currentUserId}/passed/{targetUserId}
   */
  const onSwipeLeft = useCallback(async (targetUserId: string): Promise<void> => {
    try {
      console.log('🔥 Starting onSwipeLeft...');
      console.log('Current User ID:', currentUserId);
      console.log('Target User ID:', targetUserId);
      
      if (!currentUserId || !targetUserId) {
        throw new Error('Both currentUserId and targetUserId are required');
      }

      const swipeDocRef = doc(db, 'swipes', currentUserId, 'passed', targetUserId);
      console.log('📄 Document path:', `swipes/${currentUserId}/passed/${targetUserId}`);
      
      const swipeData = {
        timestamp: serverTimestamp(),
      };
      console.log('📝 Swipe data:', swipeData);
      
      await setDoc(swipeDocRef, swipeData);
      console.log('✅ Pass stored successfully in Firebase');
    } catch (error) {
      console.error('❌ Error storing pass swipe:', error);
      throw error;
    }
  }, [currentUserId]);

  return {
    onSwipeRight,
    onSwipeLeft,
  };
} 