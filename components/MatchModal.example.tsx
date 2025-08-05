import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import MatchModal from './MatchModal';

// Example usage of MatchModal
export default function ExampleMatchModalUsage() {
  const [isMatchModalVisible, setIsMatchModalVisible] = useState(false);
  
  // Example photos
  const currentUserPhoto = 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg';
  const matchedUserPhoto = 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg';

  const handleStartChat = () => {
    console.log('Starting chat with matched user...');
    // Navigate to chat screen or open chat
    // router.push('/chat/matchedUserId');
  };

  const handleCloseModal = () => {
    setIsMatchModalVisible(false);
  };

  const showMatchModal = () => {
    setIsMatchModalVisible(true);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TouchableOpacity
        onPress={showMatchModal}
        style={{
          backgroundColor: '#FF6B9D',
          padding: 16,
          borderRadius: 12,
        }}
      >
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
          Show Match Modal
        </Text>
      </TouchableOpacity>

      <MatchModal
        isVisible={isMatchModalVisible}
        onClose={handleCloseModal}
        onStartChat={handleStartChat}
        currentUserPhoto={currentUserPhoto}
        matchedUserPhoto={matchedUserPhoto}
      />
    </View>
  );
}

// Example integration with VisualMatchScreen:
/*
import React, { useState } from 'react';
import VisualMatchScreen from '../app/VisualMatchScreen';
import MatchModal from './MatchModal';
import useSwipeActions from '../hooks/useSwipeActions';
import { auth } from '../services/firebase';

export default function VisualMatchWithModal() {
  const [isMatchModalVisible, setIsMatchModalVisible] = useState(false);
  const [matchedUser, setMatchedUser] = useState<any>(null);
  const currentUserId = auth.currentUser?.uid;
  
  const { onSwipeRight, onSwipeLeft } = useSwipeActions(currentUserId || '');

  const handleSwipeRight = async (targetUserId: string) => {
    try {
      await onSwipeRight(targetUserId);
      
      // Check if it's a mutual match (you can extend the hook to return this info)
      // For now, we'll simulate a match
      const isMatch = Math.random() > 0.7; // 30% chance of match for demo
      
      if (isMatch) {
        setMatchedUser({
          id: targetUserId,
          photo: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
        });
        setIsMatchModalVisible(true);
      }
    } catch (error) {
      console.error('Error handling swipe right:', error);
    }
  };

  const handleSwipeLeft = async (targetUserId: string) => {
    try {
      await onSwipeLeft(targetUserId);
    } catch (error) {
      console.error('Error handling swipe left:', error);
    }
  };

  const handleStartChat = () => {
    console.log('Starting chat with:', matchedUser?.id);
    // Navigate to chat screen
  };

  const handleCloseModal = () => {
    setIsMatchModalVisible(false);
    setMatchedUser(null);
  };

  return (
    <>
      <VisualMatchScreen
        users={sampleUsers}
        onSwipeRight={handleSwipeRight}
        onSwipeLeft={handleSwipeLeft}
        isLoading={false}
      />
      
      {matchedUser && (
        <MatchModal
          isVisible={isMatchModalVisible}
          onClose={handleCloseModal}
          onStartChat={handleStartChat}
          currentUserPhoto="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg"
          matchedUserPhoto={matchedUser.photo}
        />
      )}
    </>
  );
}
*/ 