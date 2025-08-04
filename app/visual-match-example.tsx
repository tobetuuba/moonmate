import React, { useState } from 'react';
import { Alert } from 'react-native';
import VisualMatchScreen from './VisualMatchScreen';

// Example usage of VisualMatchScreen
export default function VisualMatchExample() {
  const [isLoading, setIsLoading] = useState(false);
  
  // Sample user data
  const sampleUsers = [
    {
      id: '1',
      displayName: 'Sarah',
      birthDate: '1995-03-15',
      photos: ['https://example.com/sarah-photo.jpg'],
      location: {
        city: 'New York'
      }
    },
    {
      id: '2',
      displayName: 'Michael',
      birthDate: '1992-07-22',
      photos: ['https://example.com/michael-photo.jpg'],
      location: {
        city: 'Los Angeles'
      }
    },
    {
      id: '3',
      displayName: 'Emma',
      birthDate: '1998-11-08',
      photos: [],
      location: {
        city: 'Chicago'
      }
    }
  ];

  const handleSwipeRight = (userId: string) => {
    Alert.alert('Liked!', `You liked user ${userId}`);
    // Here you would typically:
    // 1. Send like to your backend
    // 2. Check if it's a mutual match
    // 3. Show match notification if mutual
  };

  const handleSwipeLeft = (userId: string) => {
    Alert.alert('Passed', `You passed on user ${userId}`);
    // Here you would typically:
    // 1. Send pass to your backend
    // 2. Update user preferences
  };

  return (
    <VisualMatchScreen
      users={sampleUsers}
      onSwipeRight={handleSwipeRight}
      onSwipeLeft={handleSwipeLeft}
      isLoading={isLoading}
    />
  );
} 