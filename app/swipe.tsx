import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, Animated, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { NotificationService } from '../services/NotificationService';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_HEIGHT = SCREEN_HEIGHT * 0.7;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

interface Profile {
  id: string;
  name: string;
  age: number;
  photos: string[];
  bio: string;
  compatibility: number;
  distance: number;
  interests: string[];
}

const mockProfiles: Profile[] = [
  {
    id: '1',
    name: 'Emma',
    age: 28,
    photos: [
      'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    bio: 'Adventure seeker who loves deep conversations under the stars. Looking for someone to explore life\'s mysteries with.',
    compatibility: 95,
    distance: 3,
    interests: ['Photography', 'Hiking', 'Astronomy'],
  },
  {
    id: '2',
    name: 'Alex',
    age: 30,
    photos: [
      'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    bio: 'Bookworm and coffee enthusiast. Believes in the power of genuine connections and meaningful conversations.',
    compatibility: 87,
    distance: 7,
    interests: ['Reading', 'Coffee', 'Art'],
  },
  {
    id: '3',
    name: 'Maya',
    age: 26,
    photos: [
      'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    bio: 'Yoga instructor and mindfulness advocate. Seeking someone who values emotional intelligence and growth.',
    compatibility: 92,
    distance: 5,
    interests: ['Yoga', 'Meditation', 'Travel'],
  },
];

export default function SwipeScreen() {
  const [profiles, setProfiles] = useState<Profile[]>(mockProfiles);
  const [currentIndex, setCurrentIndex] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  const currentProfile = profiles[currentIndex];

  const onSwipeLeft = () => {
    animateCard(-SCREEN_WIDTH, () => {
      setCurrentIndex(prev => prev + 1);
      resetCard();
    });
  };

  const onSwipeRight = async () => {
    animateCard(SCREEN_WIDTH, async () => {
      // Handle match logic here
      const isMatch = Math.random() > 0.7; // 30% chance of match
      
      if (isMatch && currentProfile) {
        // Send match notification
        await NotificationService.sendMatchNotification(
          currentProfile.name,
          currentProfile.id
        );
        
        Alert.alert(
          '🎉 It\'s a Match!',
          `You and ${currentProfile.name} liked each other!`,
          [
            { text: 'Start Chat', onPress: () => router.push(`/chat/${currentProfile.id}?name=${currentProfile.name}`) },
            { text: 'Continue Swiping', style: 'cancel' }
          ]
        );
      }
      
      setCurrentIndex(prev => prev + 1);
      resetCard();
    });
  };

  const animateCard = (toValue: number, callback?: () => void) => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(rotate, {
        toValue: toValue > 0 ? 1 : -1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(callback);
  };

  const resetCard = () => {
    translateX.setValue(0);
    translateY.setValue(0);
    rotate.setValue(0);
  };

  if (currentIndex >= profiles.length) {
    return (
      <View style={styles.emptyContainer}>
        <FontAwesome name="star" size={64} color="#8B5FBF" />
        <Text style={styles.emptyTitle}>No more profiles!</Text>
        <Text style={styles.emptySubtitle}>
          Check back later for more potential matches
        </Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!currentProfile) return null;

  const rotateInterpolate = rotate.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-30deg', '0deg', '30deg'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Discover</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Feather name="zap" size={24} color="#8B5FBF" />
        </TouchableOpacity>
      </View>

      <View style={styles.cardContainer}>
        <Animated.View
          style={[
            styles.card,
            {
              transform: [
                { translateX },
                { translateY },
                { rotate: rotateInterpolate },
              ],
            },
          ]}>
          <Image source={{ uri: currentProfile.photos[0] }} style={styles.cardImage} />
          
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.cardGradient}>
            
            <View style={styles.compatibilityBadge}>
              <Ionicons name="heart" size={16} color="#E91E63" />
              <Text style={styles.compatibilityText}>{currentProfile.compatibility}% Match</Text>
            </View>

            <View style={styles.cardInfo}>
              <View style={styles.nameContainer}>
                <Text style={styles.cardName}>
                  {currentProfile.name}, {currentProfile.age}
                </Text>
                <Text style={styles.cardDistance}>{currentProfile.distance} km away</Text>
              </View>
              
              <Text style={styles.cardBio} numberOfLines={3}>
                {currentProfile.bio}
              </Text>
              
              <View style={styles.interestsContainer}>
                {currentProfile.interests.slice(0, 3).map((interest, index) => (
                  <View key={index} style={styles.interestTag}>
                    <Text style={styles.interestText}>{interest}</Text>
                  </View>
                ))}
              </View>
            </View>
          </LinearGradient>
        </Animated.View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.rejectButton} onPress={onSwipeLeft}>
          <Feather name="x" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.likeButton} onPress={onSwipeRight}>
          <Ionicons name="heart" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  headerButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: SCREEN_WIDTH - 40,
    height: CARD_HEIGHT,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    justifyContent: 'flex-end',
    padding: 20,
  },
  compatibilityBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  compatibilityText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#E91E63',
  },
  cardInfo: {
    gap: 12,
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  cardDistance: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  cardBio: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 22,
    opacity: 0.9,
  },
  interestsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  interestTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  interestText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 80,
    paddingVertical: 40,
    gap: 60,
  },
  rejectButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#DC2626',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  likeButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E91E63',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#F8FAFC',
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
  },
  backButton: {
    backgroundColor: '#8B5FBF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 24,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});