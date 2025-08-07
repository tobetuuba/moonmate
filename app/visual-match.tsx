import React, { useState } from 'react';
import VisualMatchScreen from './VisualMatchScreen';
import MatchModal from '../components/MatchModal';
import useSwipeActions from '../hooks/useSwipeActions';
import { auth } from '../services/firebase';
import createOrGetChat from '../utils/createOrGetChat';
import { useRouter } from 'expo-router';
import { useProfileCheck } from '../hooks/useProfileCheck';
import { View, Text, ActivityIndicator } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacings';

// Sample user data for demonstration
const sampleUsers = [
  {
    id: '1',
    displayName: 'Sarah',
    birthDate: '1995-03-15',
    photos: ['https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg'],
    location: {
      city: 'New York'
    }
  },
  {
    id: '2',
    displayName: 'Michael',
    birthDate: '1992-07-22',
    photos: ['https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg'],
    location: {
      city: 'Los Angeles'
    }
  },
  {
    id: '3',
    displayName: 'Emma',
    birthDate: '1998-11-08',
    photos: ['https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg'],
    location: {
      city: 'Chicago'
    }
  },
  {
    id: '4',
    displayName: 'David',
    birthDate: '1990-05-12',
    photos: ['https://images.pexels.com/photos/937481/pexels-photo-937481.jpeg'],
    location: {
      city: 'Miami'
    }
  },
  {
    id: '5',
    displayName: 'Sophia',
    birthDate: '1996-09-30',
    photos: ['https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg'],
    location: {
      city: 'Seattle'
    }
  }
];

export default function VisualMatchPage() {
  const router = useRouter();
  const { isLoading: isProfileChecking, hasProfile } = useProfileCheck();
  const [isLoading, setIsLoading] = useState(false);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchedUserPhoto, setMatchedUserPhoto] = useState('');
  const [matchedUserId, setMatchedUserId] = useState('');
  const currentUserId = auth.currentUser?.uid;
  
  // Get current user photo (first photo from sample data for demo)
  const currentUserPhoto = sampleUsers[0]?.photos?.[0] || '';
  
  // Define the match handler
  const handleMatch = (matchedUserId: string) => {
    const matchedUser = sampleUsers.find(u => u.id === matchedUserId);
    if (matchedUser) {
      setMatchedUserPhoto(matchedUser.photos?.[0] || '');
      setMatchedUserId(matchedUserId);
      setShowMatchModal(true);
    }
  };
  
  // Use the Firebase swipe actions hook with match callback
  const { onSwipeRight, onSwipeLeft } = useSwipeActions(currentUserId || '', handleMatch);
  
  const handleSwipeRight = async (userId: string) => {
    try {
      if (!currentUserId) {
        console.log('No current user ID, skipping Firebase write');
        return;
      }
      
      await onSwipeRight(userId);
      console.log('✅ Like stored in Firebase for user:', userId);
    } catch (error) {
      console.error('❌ Failed to store like in Firebase:', error);
    }
  };

  const handleSwipeLeft = async (userId: string) => {
    try {
      if (!currentUserId) {
        console.log('No current user ID, skipping Firebase write');
        return;
      }
      
      await onSwipeLeft(userId);
      console.log('✅ Pass stored in Firebase for user:', userId);
    } catch (error) {
      console.error('❌ Failed to store pass in Firebase:', error);
    }
  };

  if (isProfileChecking) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
        <Text style={{ marginTop: spacing.md, ...typography.styles.body, color: colors.text.secondary }}>
          Loading...
        </Text>
      </View>
    );
  }

  if (!hasProfile) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ ...typography.styles.body, color: colors.text.secondary }}>
          Please create your profile first
        </Text>
      </View>
    );
  }

  return (
    <>
      <VisualMatchScreen
        users={sampleUsers}
        onSwipeRight={handleSwipeRight}
        onSwipeLeft={handleSwipeLeft}
        isLoading={isLoading}
      />
      
      <MatchModal
        isVisible={showMatchModal}
        onClose={() => setShowMatchModal(false)}
        onStartChat={async (chatId) => {
          try {
            if (!currentUserId || !matchedUserId) {
              console.error('Missing user IDs for chat creation');
              return;
            }

            console.log('💬 Creating chat between:', currentUserId, 'and', matchedUserId);
            
            // Create or get chat
            const newChatId = await createOrGetChat(currentUserId, matchedUserId);
            
            console.log('✅ Chat created/retrieved:', newChatId);
            
            // Navigate to chat screen
            router.push(`/chat/${newChatId}`);
            
            // Close the modal
            setShowMatchModal(false);
          } catch (error) {
            console.error('❌ Error creating chat:', error);
            // You could show an alert here if needed
          }
        }}
        currentUserPhoto={currentUserPhoto}
        matchedUserPhoto={matchedUserPhoto}
      />
    </>
  );
} 