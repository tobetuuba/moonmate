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
import SuperLikeButton from '../components/SuperLikeButton';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  withTiming,
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
  const [undoStack, setUndoStack] = useState<{ index: number; direction: 'left' | 'right' }[]>([]);
  const [superLikeCount, setSuperLikeCount] = useState(5); // Günlük 5 super like örnek
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);
  const burstOpacity = useSharedValue(0);
  const burstScale = useSharedValue(0.8);
  const burstRotate = useSharedValue(0);
  const ringScale = useSharedValue(0.6);
  const ringOpacity = useSharedValue(0);
  const glowScale = useSharedValue(0.8);
  const glowOpacity = useSharedValue(0);
  const sparkle1Scale = useSharedValue(0);
  const sparkle1Opacity = useSharedValue(0);
  const sparkle2Scale = useSharedValue(0);
  const sparkle2Opacity = useSharedValue(0);
  const sparkle3Scale = useSharedValue(0);
  const sparkle3Opacity = useSharedValue(0);
  const sparkle4Scale = useSharedValue(0);
  const sparkle4Opacity = useSharedValue(0);
  const scrollRef = useRef(null);

  // Reset animated values when currentIndex changes
  React.useEffect(() => {
    translateX.value = 0;
    translateY.value = 0;
    rotate.value = 0;
    scale.value = 1;
    burstOpacity.value = 0;
    burstScale.value = 0.8;
    burstRotate.value = 0;
    ringScale.value = 0.6;
    ringOpacity.value = 0;
    glowScale.value = 0.8;
    glowOpacity.value = 0;
    sparkle1Scale.value = 0;
    sparkle1Opacity.value = 0;
    sparkle2Scale.value = 0;
    sparkle2Opacity.value = 0;
    sparkle3Scale.value = 0;
    sparkle3Opacity.value = 0;
    sparkle4Scale.value = 0;
    sparkle4Opacity.value = 0;
  }, [currentIndex]);

  // Super like burst overlay animated styles
  const burstStyle = useAnimatedStyle(() => ({
    opacity: burstOpacity.value,
    transform: [
      { scale: burstScale.value },
      { rotate: `${burstRotate.value}deg` }
    ],
  }));

  const ringStyle = useAnimatedStyle(() => ({
    opacity: ringOpacity.value,
    transform: [{ scale: ringScale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
    transform: [{ scale: glowScale.value }],
  }));

  const sparkle1Style = useAnimatedStyle(() => ({
    opacity: sparkle1Opacity.value,
    transform: [{ scale: sparkle1Scale.value }],
  }));

  const sparkle2Style = useAnimatedStyle(() => ({
    opacity: sparkle2Opacity.value,
    transform: [{ scale: sparkle2Scale.value }],
  }));

  const sparkle3Style = useAnimatedStyle(() => ({
    opacity: sparkle3Opacity.value,
    transform: [{ scale: sparkle3Scale.value }],
  }));

  const sparkle4Style = useAnimatedStyle(() => ({
    opacity: sparkle4Opacity.value,
    transform: [{ scale: sparkle4Scale.value }],
  }));

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
      onSwipeRight(users[currentIndex].id); // add this line
      setSuperLikeCount(c => c - 1);
      setUndoStack(stack => [...stack, { index: currentIndex, direction: 'right' }]);
      setCurrentIndex(prev => prev + 1);
    }
  };
  // Undo handler
  const handleUndo = () => {
    if (undoStack.length > 0) {
      const last = undoStack[undoStack.length - 1];
      setCurrentIndex(last.index);
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
      setUndoStack(stack => [...stack, { index: currentIndex, direction }]);
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

  const handleSuperLikeFromChild = () => {
    if (currentIndex >= users.length) return;
    
    // Reset all animation values
    burstOpacity.value = 0;
    burstScale.value = 0.8;
    burstRotate.value = 0;
    ringScale.value = 0.6;
    ringOpacity.value = 0;
    glowScale.value = 0.8;
    glowOpacity.value = 0;
    sparkle1Scale.value = 0;
    sparkle1Opacity.value = 0;
    sparkle2Scale.value = 0;
    sparkle2Opacity.value = 0;
    sparkle3Scale.value = 0;
    sparkle3Opacity.value = 0;
    sparkle4Scale.value = 0;
    sparkle4Opacity.value = 0;
    
    // Animate star burst
    burstOpacity.value = withTiming(1, { duration: 220 }, () => {
      burstOpacity.value = withTiming(0, { duration: 300 });
    });
    burstScale.value = withSpring(1.15, { damping: 8, stiffness: 120 }, () => {
      burstScale.value = withSpring(1, { damping: 8, stiffness: 120 });
    });
    burstRotate.value = withSpring(18, { damping: 6, stiffness: 100 }, () => {
      burstRotate.value = withSpring(0, { damping: 6, stiffness: 100 });
    });
    
    // Animate glow
    glowOpacity.value = withTiming(0.45, { duration: 180 }, () => {
      glowOpacity.value = withTiming(0, { duration: 260 });
    });
    glowScale.value = withSpring(1.25, { damping: 8, stiffness: 120 });
    
    // Animate expanding ring
    ringScale.value = withSpring(1.6, { damping: 6, stiffness: 100 });
    ringOpacity.value = withTiming(0.8, { duration: 220 }, () => {
      ringOpacity.value = withTiming(0, { duration: 300 });
    });
    
    // Animate sparkles in stagger
    setTimeout(() => {
      sparkle1Opacity.value = withTiming(1, { duration: 180 }, () => {
        sparkle1Opacity.value = withTiming(0, { duration: 260 });
      });
      sparkle1Scale.value = withSpring(1.2, { damping: 5, stiffness: 120 }, () => {
        sparkle1Scale.value = withSpring(1, { damping: 5, stiffness: 120 });
      });
    }, 40);
    
    setTimeout(() => {
      sparkle2Opacity.value = withTiming(1, { duration: 180 }, () => {
        sparkle2Opacity.value = withTiming(0, { duration: 260 });
      });
      sparkle2Scale.value = withSpring(1.2, { damping: 5, stiffness: 120 }, () => {
        sparkle2Scale.value = withSpring(1, { damping: 5, stiffness: 120 });
      });
    }, 80);
    
    setTimeout(() => {
      sparkle3Opacity.value = withTiming(1, { duration: 180 }, () => {
        sparkle3Opacity.value = withTiming(0, { duration: 260 });
      });
      sparkle3Scale.value = withSpring(1.2, { damping: 5, stiffness: 120 }, () => {
        sparkle3Scale.value = withSpring(1, { damping: 5, stiffness: 120 });
      });
    }, 120);
    
    setTimeout(() => {
      sparkle4Opacity.value = withTiming(1, { duration: 180 }, () => {
        sparkle4Opacity.value = withTiming(0, { duration: 260 });
      });
      sparkle4Scale.value = withSpring(1.2, { damping: 5, stiffness: 120 }, () => {
        sparkle4Scale.value = withSpring(1, { damping: 5, stiffness: 120 });
      });
    }, 160);
    
    // Delay the actual swipe logic so the animation is visible
    setTimeout(() => {
      onSwipeRight(users[currentIndex].id);
      setUndoStack(stack => [...stack, { index: currentIndex, direction: 'right' }]);
      setCurrentIndex(prev => prev + 1);
      setSuperLikeCount(c => Math.max(0, c - 1));
    }, 220);
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

  const renderCard = (user: User, index: number, isCurrent: boolean, scrollRef?: any) => {
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
        style={styles.card}
      >
        <SwipeCard
          user={swipeCardUser}
          onPassPress={isCurrent ? () => handleProgrammaticSwipe('left') : undefined}
          onLikePress={isCurrent ? () => handleProgrammaticSwipe('right') : undefined}
          onRequestSuperLike={isCurrent ? handleSuperLikeFromChild : undefined}
          onUndoPress={isCurrent ? handleUndo : undefined}
          swipeProgress={isCurrent ? translateX : undefined}
          scrollRef={scrollRef}
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
        <View style={styles.cardStack} pointerEvents="box-none">
          {/* Next card preview */}
          {currentIndex + 1 < users.length && (
            <View style={[styles.nextCard, { pointerEvents: 'none' }]}>
              {renderCard(users[currentIndex + 1], currentIndex + 1, false)}
            </View>
          )}
          {/* Current card */}
          <PanGestureHandler
            onGestureEvent={gestureHandler}
            activeOffsetY={[-10, 10]}
            activeOffsetX={[-20, 20]}
            simultaneousHandlers={scrollRef}
          >
            <Animated.View style={[styles.currentCard, cardStyle]}>
              {renderCard(currentUser, currentIndex, true, scrollRef)}
            </Animated.View>
          </PanGestureHandler>
          
          <SuperLikeButton
            count={superLikeCount}
            disabled={superLikeCount <= 0}
            onPress={handleSuperLikeFromChild}
            onLongPressPreview={() => {}}
            style={styles.floatingSuperLike}
            testID="super-like-button"
          />
          
          {/* Super like count label */}
          <View style={styles.superLikeCountLabel}>
            <Text style={styles.superLikeCountText}>{superLikeCount}</Text>
          </View>
          
          {/* Super like burst overlay */}
          <Animated.View 
            style={[styles.superLikeOverlayContainer, { zIndex: 600 }]}
            pointerEvents="none"
          >
            {/* Animated glow circle */}
            <Animated.View style={[styles.superLikeGlow, glowStyle]} />
            
            {/* Animated expanding ring */}
            <Animated.View style={[styles.superLikeRing, ringStyle]} />
            
            {/* Animated star burst */}
            <Animated.View style={[styles.superLikeBurst, burstStyle]}>
              <Ionicons name="star" size={96} color="#fff" />
            </Animated.View>
            
            {/* Four small white sparkles positioned around the center */}
            <Animated.View style={[styles.sparkle, styles.s1, sparkle1Style]} />
            <Animated.View style={[styles.sparkle, styles.s2, sparkle2Style]} />
            <Animated.View style={[styles.sparkle, styles.s3, sparkle3Style]} />
            <Animated.View style={[styles.sparkle, styles.s4, sparkle4Style]} />
          </Animated.View>
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
  floatingSuperLike: {
    position: 'absolute',
    top: 24,
    right: 20,
    zIndex: 500,
    elevation: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  superLikeBurst: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,107,157,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF6B9D',
    shadowOpacity: 0.35,
    shadowRadius: 22,
    elevation: 12,
  },
  superLikeOverlayContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  superLikeRing: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 3,
    borderColor: 'rgba(255,107,157,0.75)',
  },
  superLikeGlow: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(255,107,157,0.22)',
    shadowColor: '#FF6B9D',
    shadowOpacity: 0.5,
    shadowRadius: 30,
  },
  sparkle: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#fff',
    shadowColor: '#fff',
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  s1: {
    top: '42%',
    left: '52%',
  },
  s2: {
    top: '52%',
    right: '42%',
  },
  s3: {
    bottom: '42%',
    left: '48%',
  },
  s4: {
    bottom: '48%',
    right: '48%',
  },
  superLikeCountLabel: {
    position: 'absolute',
    top: 24,
    right: 84, // Position to the right of the SuperLikeButton (56px button + 8px spacing + 20px right margin)
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 24,
    zIndex: 500,
  },
  superLikeCountText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
}); 