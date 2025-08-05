import { useCallback } from 'react';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { runOnJS } from 'react-native-reanimated';
import { db } from '../services/firebase';

interface SwipeActions {
  onSwipeRight: (targetUserId: string) => Promise<void>;
  onSwipeLeft: (targetUserId: string) => Promise<void>;
}

interface MatchData {
  userA: string; // the user with the lexicographically smaller ID
  userB: string; // the user with the larger ID
  visualMatch: boolean;
  timestamp: any; // serverTimestamp()
}

/**
 * Custom hook for handling swipe actions in a dating app
 * @param currentUserId - The ID of the current user performing the swipe
 * @returns Object containing onSwipeRight and onSwipeLeft functions
 */
export default function useSwipeActions(
  currentUserId: string,
  onMatch?: (matchedUserId: string) => void
): SwipeActions {
  
  /**
   * Helper function to check for mutual match and create match document
   */
  const checkForMutualMatch = useCallback(async (currentUserId: string, targetUserId: string): Promise<void> => {
    try {
      console.log('🔍 Checking for mutual match...');
      
      // Check if target user has already liked current user
      const targetUserLikeDoc = doc(db, 'swipes', targetUserId, 'liked', currentUserId);
      const targetUserLikeSnapshot = await getDoc(targetUserLikeDoc);
      
      if (targetUserLikeSnapshot.exists()) {
        console.log('🎉 Mutual match detected!');
        
        // Create match document
        const [userA, userB] = [currentUserId, targetUserId].sort();
        const matchId = `${userA}_${userB}`;
        
        const matchData: MatchData = {
          userA,
          userB,
          visualMatch: true,
          timestamp: serverTimestamp(),
        };
        
        const matchDocRef = doc(db, 'matches', matchId);
        await setDoc(matchDocRef, matchData);
        
        console.log(`🎉 It's a match between ${currentUserId} and ${targetUserId}!`);
        console.log('📄 Match document created:', matchId);
        
        // Trigger the match callback
        if (onMatch) {
          runOnJS(onMatch)(targetUserId);
        }
      } else {
        console.log('💔 No mutual match - target user has not liked current user yet');
      }
    } catch (error) {
      console.error('❌ Error checking for mutual match:', error);
      throw error;
    }
  }, []);
  
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
      
      // Check for mutual match after storing the like
      await checkForMutualMatch(currentUserId, targetUserId);
    } catch (error) {
      console.error('❌ Error storing like swipe:', error);
      throw error;
    }
  }, [currentUserId, checkForMutualMatch]);

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