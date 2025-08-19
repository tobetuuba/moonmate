import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Alert,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { PanGestureHandler, State, GestureHandlerRootView } from 'react-native-gesture-handler';
import SwipeCard from '../components/SwipeCard';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  runOnJS,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';

interface User {
  id: string;
  displayName: string;
  birthDate: string;
  photos: string[];
  location?: {
    city?: string;
    country?: string;
  };
  profession?: string;
  pronouns?: string;
  bio?: string;
  interests?: string[];
  smoking?: string;
  drinking?: string;
  exercise?: string;
  relationshipGoals?: string[];
  childrenPlan?: string;
  monogamy?: string;
  prompts?: Record<string, string>;
}

interface VisualMatchScreenProps {
  users: User[];
  onSwipeRight: (userId: string) => void;
  onSwipeLeft: (userId: string) => void;
  isLoading?: boolean;
}

const { width, height } = Dimensions.get('window');
const SWIPE_THRESHOLD = width * 0.4; // Even higher threshold for more intentional swipes

export default function VisualMatchScreen({ 
  users, 
  onSwipeRight, 
  onSwipeLeft, 
  isLoading = false 
}: VisualMatchScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [undoStack, setUndoStack] = useState<number[]>([]);
  const [superLikeCount, setSuperLikeCount] = useState(1); // Günlük 1 super like örnek
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);

  // Animated styles for swipe labels
  const likeLabelStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [0, width * 0.2],
      [0, 1],
      Extrapolate.CLAMP
    ),
    transform: [{
      rotate: `${interpolate(
        translateX.value,
        [0, width * 0.2],
        [0, 15],
        Extrapolate.CLAMP
      )}deg`
    }]
  }));

  const passLabelStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [-width * 0.2, 0],
      [1, 0],
      Extrapolate.CLAMP
    ),
    transform: [{
      rotate: `${interpolate(
        translateX.value,
        [-width * 0.2, 0],
        [-15, 0],
        Extrapolate.CLAMP
      )}deg`
    }]
  }));

  // Reset animated values when currentIndex changes
  React.useEffect(() => {
    translateX.value = 0;
    translateY.value = 0;
    rotate.value = 0;
    scale.value = 1;
  }, [currentIndex]);

  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  // Super Like handler
  const handleSuperLike = () => {
    if (superLikeCount > 0 && currentIndex < users.length) {
      // Super Like işlemi (şimdilik sadece console)
      console.log('Super Like:', users[currentIndex].id);
      setSuperLikeCount(c => c - 1);
      setUndoStack(stack => [...stack, currentIndex]);
      setCurrentIndex(prev => prev + 1);
    }
  };
  // Undo handler
  const handleUndo = () => {
    if (undoStack.length > 0) {
      const lastIndex = undoStack[undoStack.length - 1];
      setCurrentIndex(lastIndex);
      setUndoStack(stack => stack.slice(0, -1));
    }
  };

  const handleSwipeComplete = (direction: 'left' | 'right') => {
    const user = users[currentIndex];
    if (user) {
      if (direction === 'right') {
        onSwipeRight(user.id);
      } else {
        onSwipeLeft(user.id);
      }
      setUndoStack(stack => [...stack, currentIndex]);
    }
    setCurrentIndex(prev => prev + 1);
    
    // Reset animated values for next card
    translateX.value = 0;
    translateY.value = 0;
    rotate.value = 0;
    scale.value = 1;
  };

  const handleProgrammaticSwipe = (direction: 'left' | 'right') => {
    const targetX = direction === 'right' ? width * 1.5 : -width * 1.5;
    
    translateX.value = withSpring(targetX, {
      damping: 12,
      stiffness: 80,
      mass: 1.2,
    });
    
    handleSwipeComplete(direction);
  };

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context: any) => {
      context.startX = translateX.value;
      context.startY = translateY.value;
    },
    onActive: (event, context) => {
      translateX.value = context.startX + event.translationX;
      translateY.value = context.startY + event.translationY;
      
      // Debug: Log translation values
      if (Math.abs(event.translationX) > 50) {
        console.log('Swipe translation:', event.translationX);
      }
      
      // Calculate rotation based on horizontal movement
      rotate.value = interpolate(
        translateX.value,
        [-width / 2, 0, width / 2],
        [-15, 0, 15],
        Extrapolate.CLAMP
      );
      
      // Calculate scale based on vertical movement
      scale.value = interpolate(
        Math.abs(translateY.value),
        [0, height / 4],
        [1, 0.9],
        Extrapolate.CLAMP
      );
    },
    onEnd: (event) => {
      const shouldSwipeRight = translateX.value > SWIPE_THRESHOLD;
      const shouldSwipeLeft = translateX.value < -SWIPE_THRESHOLD;
      
      if (shouldSwipeRight) {
        translateX.value = withSpring(width * 1.5, {
          damping: 12,
          stiffness: 80,
          mass: 1.2,
        });
        runOnJS(handleSwipeComplete)('right');
      } else if (shouldSwipeLeft) {
        translateX.value = withSpring(-width * 1.5, {
          damping: 12,
          stiffness: 80,
          mass: 1.2,
        });
        runOnJS(handleSwipeComplete)('left');
      } else {
        // Reset to center
        translateX.value = withSpring(0, {
          damping: 15,
          stiffness: 120,
          mass: 1,
        });
        translateY.value = withSpring(0, {
          damping: 15,
          stiffness: 120,
          mass: 1,
        });
        rotate.value = withSpring(0, {
          damping: 15,
          stiffness: 120,
          mass: 1,
        });
        scale.value = withSpring(1, {
          damping: 15,
          stiffness: 120,
          mass: 1,
        });
      }
    },
  }, [currentIndex, handleSwipeComplete]);

  const cardStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate.value}deg` },
        { scale: scale.value },
      ],
    };
  });

  const renderCard = (user: User, index: number) => {
    const age = calculateAge(user.birthDate);
    
    // Transform user data to match SwipeCard interface
    const swipeCardUser = {
      id: user.id,
      displayName: user.displayName,
      age: age,
      profession: user.profession,
      location: user.location,
      pronouns: user.pronouns,
      bio: user.bio,
      interests: user.interests,
      lifestyle: {
        smoking: user.smoking,
        drinking: user.drinking,
        exercise: user.exercise,
      },
      relationshipGoals: user.relationshipGoals,
      childrenPlan: user.childrenPlan,
      monogamy: user.monogamy,
      prompts: user.prompts,
      photos: user.photos,
    };
    
    return (
      <Animated.View
        key={user.id}
        style={[
          styles.card,
          cardStyle,
        ]}
      >
        <SwipeCard
          user={swipeCardUser}
          onPassPress={() => handleProgrammaticSwipe('left')}
          onLikePress={() => handleProgrammaticSwipe('right')}
          onSuperLikePress={handleSuperLike}
          onUndoPress={handleUndo}
          swipeProgress={translateX}
        />
      </Animated.View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <LinearGradient
        colors={['#FF6B9D', '#C44569', '#8B5FBF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.emptyGradient}
      >
        <View style={styles.emptyContent}>
          <Ionicons name="heart-outline" size={80} color="#fff" />
          <Text style={styles.emptyTitle}>No More Profiles</Text>
          <Text style={styles.emptySubtitle}>
            Check back later for new matches!
          </Text>
        </View>
      </LinearGradient>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B9D" />
          <Text style={styles.loadingText}>Loading profiles...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (users.length === 0 || currentIndex >= users.length) {
    return (
      <SafeAreaView style={styles.container}>
        {renderEmptyState()}
      </SafeAreaView>
    );
  }

  const currentUser = users[currentIndex];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>✨ Visual Match ✨</Text>
        <Text style={styles.headerSubtitle}>
          Swipe right to like, left to pass
        </Text>
      </View>
      <View style={styles.swiperContainer}>
        <View style={styles.cardStack}>
          {/* Next card preview */}
          {currentIndex + 1 < users.length && (
            <View style={styles.nextCard}>
              {renderCard(users[currentIndex + 1], currentIndex + 1)}
            </View>
          )}
          {/* Current card */}
          <PanGestureHandler onGestureEvent={gestureHandler}>
            <Animated.View style={[styles.currentCard, cardStyle]}>
              {renderCard(currentUser, currentIndex)}
            </Animated.View>
          </PanGestureHandler>
        </View>
      </View>
      {/* Footer and action buttons removed for minimal UI */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 4, // even less
    paddingHorizontal: 20,
    marginBottom: 0,
    paddingBottom: 0,
  },
  headerTitle: {
    fontSize: 18, // reduced from 28
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 2, // less space below
  },
  headerSubtitle: {
    fontSize: 13, // reduced from 16
    color: '#666',
    textAlign: 'center',
    marginBottom: 0,
  },
  swiperContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 0,
    margin: 0,
    width: '100%',
    height: '100%',
    paddingHorizontal: 16, // add side padding
    paddingBottom: 16, // add bottom padding to match sides
  },
  cardStack: {
    position: 'relative',
    width: '100%',
    height: '100%',
    margin: 0,
    padding: 0,
  },
  currentCard: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 2,
  },
  nextCard: {
    position: 'absolute',
    top: 10,
    left: 0,
    width: '100%',
    height: '100%',
    transform: [{ scale: 0.9 }],
    opacity: 0.7,
    zIndex: 1,
  },
  card: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
  },
  fullCardImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  cardGradient: {
    flex: 1,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  displayName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  locationText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 6,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingBottom: 30,
  },
  footerText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
    marginBottom: 20,
  },
  actionButtonBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 30,
  },
  actionButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  passButton: {
    borderWidth: 2,
    borderColor: '#ff4444',
  },
  infoButton: {
    borderWidth: 2,
    borderColor: '#ddd',
  },
  likeButton: {
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyGradient: {
    width: '100%',
    height: 300,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  emptyContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
  },
  swipeLabel: {
    position: 'absolute',
    top: 80,
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 15,
    borderWidth: 4,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 10,
  },
  likeLabel: {
    right: 20,
    backgroundColor: 'rgba(76, 175, 80, 0.15)',
    borderColor: 'rgba(76, 175, 80, 0.6)',
  },
  passLabel: {
    left: 20,
    backgroundColor: 'rgba(255, 68, 68, 0.15)',
    borderColor: 'rgba(255, 68, 68, 0.6)',
  },
  swipeLabelText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
}); 