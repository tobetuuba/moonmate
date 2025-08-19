import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
  Animated as RNAnimated,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9;
const CARD_HEIGHT = height * 0.7;

interface User {
  id: string;
  displayName: string;
  age: number;
  profession?: string;
  location?: {
    city?: string;
    country?: string;
  };
  pronouns?: string;
  bio?: string;
  interests?: string[];
  lifestyle?: {
    smoking?: string;
    drinking?: string;
    exercise?: string;
  };
  relationshipGoals?: string[];
  childrenPlan?: string;
  monogamy?: string;
  prompts?: Record<string, string>;
  photos?: string[];
}

interface SwipeCardProps {
  user: User;
  onPassPress?: () => void;
  onLikePress?: () => void;
  swipeProgress?: import('react-native-reanimated').SharedValue<number>;
}

export default function SwipeCard({ 
  user, 
  onPassPress, 
  onLikePress,
  onSuperLikePress,
  onUndoPress,
  swipeProgress
}: SwipeCardProps & { onSuperLikePress?: () => void; onUndoPress?: () => void; }) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showSuperLikeAnim, setShowSuperLikeAnim] = useState(false);
  const [starAnims] = useState([
    new RNAnimated.Value(0),
    new RNAnimated.Value(0),
    new RNAnimated.Value(0),
    new RNAnimated.Value(0),
    new RNAnimated.Value(0),
  ]);
  const mainPhoto = user.photos?.[0] || null;
  const fallbackGradient = ['#667eea', '#764ba2'] as const;
  const hasMultiplePhotos = user.photos && user.photos.length > 1;

  // Swipe feedback animations
  const likeOpacity = useSharedValue(0);
  const passOpacity = useSharedValue(0);

  const likeStyle = useAnimatedStyle(() => ({
    opacity: swipeProgress ? interpolate(
      swipeProgress.value,
      [0, width * 0.2],
      [0, 1],
      Extrapolate.CLAMP
    ) : likeOpacity.value,
    transform: [{
      rotate: swipeProgress ? `${interpolate(
        swipeProgress.value,
        [0, width * 0.2],
        [0, 15],
        Extrapolate.CLAMP
      )}deg` : '0deg'
    }]
  }));

  const passStyle = useAnimatedStyle(() => ({
    opacity: swipeProgress ? interpolate(
      swipeProgress.value,
      [-width * 0.2, 0],
      [1, 0],
      Extrapolate.CLAMP
    ) : passOpacity.value,
    transform: [{
      rotate: swipeProgress ? `${interpolate(
        swipeProgress.value,
        [-width * 0.2, 0],
        [-15, 0],
        Extrapolate.CLAMP
      )}deg` : '0deg'
    }]
  }));

  const getInterestIcon = (interest: string) => {
    const iconMap: Record<string, string> = {
      'cooking': 'restaurant',
      'photography': 'camera',
      'travel': 'airplane',
      'music': 'musical-notes',
      'reading': 'book',
      'gaming': 'game-controller',
      'sports': 'football',
      'art': 'color-palette',
      'fitness': 'fitness',
      'dancing': 'body',
      'writing': 'create',
      'hiking': 'trail-sign',
      'coffee': 'cafe',
      'wine': 'wine',
      'movies': 'film',
      'yoga': 'leaf',
      'technology': 'laptop',
      'fashion': 'shirt',
      'pets': 'paw',
      'gardening': 'flower',
    };
    return iconMap[interest.toLowerCase()] || 'heart';
  };

  const getLifestyleIcon = (type: string, value: string) => {
    if (type === 'smoking') {
      return value === 'never' ? 'close-circle' : 'cigarette';
    }
    if (type === 'drinking') {
      return value === 'never' ? 'close-circle' : 'wine';
    }
    if (type === 'exercise') {
      return value === 'regularly' ? 'fitness' : 'body';
    }
    return 'heart';
  };

  const getLifestyleText = (type: string, value: string) => {
    if (type === 'smoking') {
      return value === 'never' ? "Doesn't smoke" : "Smokes occasionally";
    }
    if (type === 'drinking') {
      return value === 'never' ? "Doesn't drink" : "Drinks socially";
    }
    if (type === 'exercise') {
      return value === 'regularly' ? "Exercises regularly" : "Light activity";
    }
    return value;
  };

  const handlePhotoPress = () => {
    if (hasMultiplePhotos) {
      // TODO: Implement photo carousel
      Alert.alert('Photo Gallery', 'Photo carousel coming soon!');
    }
  };

  const handleSuperLikePress = () => {
    setShowSuperLikeAnim(true);
    // Animate stars
    starAnims.forEach((anim, i) => {
      anim.setValue(0);
      RNAnimated.timing(anim, {
        toValue: 1,
        duration: 1200,
        delay: i * 100,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }).start();
    });
    setTimeout(() => setShowSuperLikeAnim(false), 1500);
    if (onSuperLikePress) onSuperLikePress();
  };

  return (
    <View style={styles.container}>
      {/* Fotoğraf üstte, detaylar aşağıda scrollable */}
      <View style={styles.photoContainer}>
        {mainPhoto ? (
          <Image
            source={{ uri: mainPhoto }}
            style={styles.photo}
            contentFit="cover"
            cachePolicy="memory-disk"
          />
        ) : (
          <LinearGradient colors={fallbackGradient} style={styles.photo}>
            <View style={styles.placeholderContent}>
              <Ionicons name="person" size={80} color="#fff" />
              <Text style={styles.placeholderText}>No photo available</Text>
            </View>
          </LinearGradient>
        )}
      </View>
      {/* Floating Undo and Super Like buttons at top corners */}
      <TouchableOpacity style={styles.floatingUndo} onPress={onUndoPress} activeOpacity={0.7}>
        <Ionicons name="arrow-undo" size={22} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.floatingSuperLike} onPress={handleSuperLikePress} activeOpacity={0.7}>
        <Ionicons name="star" size={22} color="#fff" />
      </TouchableOpacity>
      {/* Super Like Animation Overlay */}
      {showSuperLikeAnim && (
        <View style={styles.superLikeOverlay} pointerEvents="none">
          <Text style={styles.superLikeText}>Super Like!</Text>
          {/* Flying stars */}
          {starAnims.map((anim, i) => {
            const angle = (i / starAnims.length) * Math.PI * 2;
            const radius = 120;
            const translateX = anim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, Math.cos(angle) * radius],
            });
            const translateY = anim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, Math.sin(angle) * radius],
            });
            return (
              <RNAnimated.View
                key={i}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  marginLeft: -12,
                  marginTop: -12,
                  transform: [
                    { translateX },
                    { translateY },
                    { scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1.2] }) },
                  ],
                  opacity: anim.interpolate({ inputRange: [0, 0.7, 1], outputRange: [0, 1, 0.2] }),
                }}
              >
                <Ionicons name="star" size={24} color="#FF3B30" />
              </RNAnimated.View>
            );
          })}
        </View>
      )}
      <ScrollView style={styles.detailsScroll} contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Basic Info Section (before About) */}
        <View style={styles.basicInfoSection}>
          <View style={styles.basicInfoRow}>
            <Text style={styles.basicInfoName}>{user.displayName}</Text>
            <Text style={styles.basicInfoAge}>, {user.age}</Text>
          </View>
          {user.profession && <Text style={styles.basicInfoProfession}>{user.profession}</Text>}
          {user.location?.city && (
            <View style={styles.basicInfoRow}>
              <Ionicons name="location" size={16} color="#888" />
              <Text style={styles.basicInfoLocation}>{user.location.city}{user.location.country && `, ${user.location.country}`}</Text>
            </View>
          )}
          {user.pronouns && <Text style={styles.basicInfoPronouns}>{user.pronouns}</Text>}
        </View>
        {/* About Section */}
        {(user.bio || user.prompts) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.bioText}>{user.bio || user.prompts?.['simple-pleasure'] || 'Looking for meaningful connections'}</Text>
          </View>
        )}
        {/* Looking for (moved up) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Looking for</Text>
          <View style={styles.intentContainer}>
            {user.relationshipGoals?.map((goal, index) => (
              <View key={index} style={styles.intentChip}>
                <Ionicons name="heart" size={14} color="#e91e63" />
                <Text style={styles.intentText}>{goal}</Text>
              </View>
            ))}
            {user.childrenPlan && (
              <View style={styles.intentChip}>
                <Ionicons name="people" size={14} color="#e91e63" />
                <Text style={styles.intentText}>{user.childrenPlan}</Text>
              </View>
            )}
            {user.monogamy && (
              <View style={styles.intentChip}>
                <Ionicons name="heart-circle" size={14} color="#e91e63" />
                <Text style={styles.intentText}>{user.monogamy}</Text>
              </View>
            )}
          </View>
        </View>
        {/* Interests */}
        {user.interests && user.interests.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Interests</Text>
            <View style={styles.interestsGrid}>
              {user.interests.map((interest, index) => (
                <View key={index} style={styles.interestChip}>
                  <Ionicons name={getInterestIcon(interest) as any} size={14} color="#667eea" />
                  <Text style={styles.interestText}>{interest}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
        {/* Lifestyle */}
        {user.lifestyle && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Lifestyle</Text>
            <View style={styles.lifestyleContainer}>
              {user.lifestyle.smoking && (
                <View style={styles.lifestyleChip}>
                  <Ionicons name={getLifestyleIcon('smoking', user.lifestyle.smoking) as any} size={14} color="#667eea" />
                  <Text style={styles.lifestyleText}>{getLifestyleText('smoking', user.lifestyle.smoking)}</Text>
                </View>
              )}
              {user.lifestyle.drinking && (
                <View style={styles.lifestyleChip}>
                  <Ionicons name={getLifestyleIcon('drinking', user.lifestyle.drinking) as any} size={14} color="#667eea" />
                  <Text style={styles.lifestyleText}>{getLifestyleText('drinking', user.lifestyle.drinking)}</Text>
                </View>
              )}
              {user.lifestyle.exercise && (
                <View style={styles.lifestyleChip}>
                  <Ionicons name={getLifestyleIcon('exercise', user.lifestyle.exercise) as any} size={14} color="#667eea" />
                  <Text style={styles.lifestyleText}>{getLifestyleText('exercise', user.lifestyle.exercise)}</Text>
                </View>
              )}
            </View>
          </View>
        )}
        {/* Fun Fact/Prompt */}
        {user.prompts && Object.keys(user.prompts).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Fun Fact</Text>
            <Text style={styles.quoteText}>
              "{user.prompts['ideal-date'] || user.prompts['travel-dream'] || user.prompts['simple-pleasure'] || 'Looking for someone to share life\'s adventures with'}"
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 0,
    shadowColor: 'transparent',
    overflow: 'hidden',
  },
  photoContainer: {
    width: '100%',
    height: 400, // or use height * 0.5 for more dynamic
    position: 'relative',
  },
  photoWrapper: {
    flex: 1,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  placeholderContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 12,
    opacity: 0.8,
  },
  photoIndicators: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  photoCount: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  photoCountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  userInfoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 30,
  },
  userInfo: {
    gap: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  age: {
    fontSize: 28,
    fontWeight: '600',
    color: '#fff',
  },
  profession: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    fontStyle: 'italic',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  location: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
  },
  pronouns: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.7,
    fontStyle: 'italic',
  },
  swipeFeedback: {
    position: 'absolute',
    top: 60,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
  },
  likeFeedback: {
    right: 20,
    backgroundColor: 'rgba(76, 175, 80, 0.15)',
    borderColor: 'rgba(76, 175, 80, 0.6)',
  },
  passFeedback: {
    left: 20,
    backgroundColor: 'rgba(255, 68, 68, 0.15)',
    borderColor: 'rgba(255, 68, 68, 0.6)',
  },
  swipeFeedbackText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  actionButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoButton: {
    borderWidth: 2,
    borderColor: '#ddd',
  },
  superLikeButton: {
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalSection: {
    marginBottom: 24,
  },
  modalSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  bioText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
    fontStyle: 'italic',
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
    borderWidth: 1,
    borderColor: '#e8ecff',
  },
  interestText: {
    fontSize: 12,
    color: '#667eea',
    fontWeight: '500',
  },
  lifestyleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  lifestyleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff5f5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    borderWidth: 1,
    borderColor: '#ffe8e8',
  },
  lifestyleText: {
    fontSize: 11,
    color: '#e53e3e',
    fontWeight: '500',
  },
  intentContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  intentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fdf2f8',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    borderWidth: 1,
    borderColor: '#fce7f3',
  },
  intentText: {
    fontSize: 11,
    color: '#e91e63',
    fontWeight: '500',
  },
  quoteSection: {
    backgroundColor: '#f8f9ff',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#667eea',
  },
  quoteText: {
    fontSize: 14,
    color: '#4a5568',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  detailsScroll: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  undoButton: {
    borderWidth: 2,
    borderColor: '#888',
  },
  fixedActionBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 24,
    paddingTop: 8,
    backgroundColor: 'rgba(255,255,255,0.95)',
    gap: 32,
    zIndex: 100,
  },
  floatingUndo: {
    position: 'absolute',
    top: 24,
    left: 20,
    zIndex: 100,
    backgroundColor: '#888',
    borderRadius: 24,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  floatingSuperLike: {
    position: 'absolute',
    top: 24,
    right: 20,
    zIndex: 100,
    backgroundColor: '#FF3B30', // vibrant red
    borderRadius: 24,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  superLikeOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 200,
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  superLikeText: {
    fontSize: 36,
    color: '#FF3B30',
    fontWeight: 'bold',
    textShadowColor: '#fff',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    marginBottom: 12,
  },
  basicInfoSection: {
    marginBottom: 12,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
    // Remove background and borderRadius for seamless look
  },
  basicInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  basicInfoName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
  },
  basicInfoAge: {
    fontSize: 22,
    fontWeight: '600',
    color: '#444',
  },
  basicInfoProfession: {
    fontSize: 15,
    color: '#555',
    fontStyle: 'italic',
    marginBottom: 2,
  },
  basicInfoLocation: {
    fontSize: 14,
    color: '#666',
  },
  basicInfoPronouns: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
    marginTop: 2,
  },
});
