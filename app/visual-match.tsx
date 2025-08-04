import React, { useState } from 'react';
import VisualMatchScreen from './VisualMatchScreen';

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
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSwipeRight = (userId: string) => {
    // Here you would typically:
    // 1. Send like to your backend
    // 2. Check if it's a mutual match
    // 3. Show match notification if mutual
    console.log('Liked user:', userId);
  };

  const handleSwipeLeft = (userId: string) => {
    // Here you would typically:
    // 1. Send pass to your backend
    // 2. Update user preferences
    console.log('Passed on user:', userId);
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