import React, { useState, useEffect } from 'react';
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
import { PinchGestureHandler, PinchGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
  useAnimatedGestureHandler,
  withSpring,
} from 'react-native-reanimated';
import { useRef } from 'react';

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
  scrollRef?: any;
  onRequestSuperLike?: () => void;
}

// Helper to render a zoomable photo
function ZoomablePhoto({ uri }: { uri: string }) {
  const pinchScale = useSharedValue(1);
  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);
  const containerWidth = width;
  const containerHeight = height * 0.7;
  const pinchHandler = useAnimatedGestureHandler<PinchGestureHandlerGestureEvent>({
    onActive: (event) => {
      pinchScale.value = event.scale;
      focalX.value = event.focalX;
      focalY.value = event.focalY;
    },
    onEnd: () => {
      pinchScale.value = 1;
      focalX.value = 0;
      focalY.value = 0;
    },
  });
  const animatedPhotoStyle = useAnimatedStyle(() => {
    const scale = pinchScale.value;
    const scaledWidth = containerWidth * scale;
    const scaledHeight = containerHeight * scale;
    // Center of the container
    const centerX = containerWidth / 2;
    const centerY = containerHeight / 2;
    // Focal point relative to center
    const dx = focalX.value - centerX;
    const dy = focalY.value - centerY;
    // Raw translation: move the image so the focal point stays under the fingers
    let translateX = -dx * (scale - 1);
    let translateY = -dy * (scale - 1);
    // Clamp logic for X
    if (scaledWidth <= containerWidth) {
      translateX = (containerWidth - scaledWidth) / 2;
    } else {
      const minTranslateX = containerWidth - scaledWidth;
      const maxTranslateX = 0;
      translateX = Math.max(minTranslateX, Math.min(maxTranslateX, translateX));
    }
    // Clamp logic for Y
    if (scaledHeight <= containerHeight) {
      translateY = (containerHeight - scaledHeight) / 2;
    } else {
      const minTranslateY = containerHeight - scaledHeight;
      const maxTranslateY = 0;
      translateY = Math.max(minTranslateY, Math.min(maxTranslateY, translateY));
    }
    return {
      transform: [
        { translateX },
        { translateY },
        { scale },
      ],
    };
  });
  return (
    <View style={styles.photoContainer}>
      <PinchGestureHandler onGestureEvent={pinchHandler}>
        <Animated.View style={{ flex: 1 }}>
          <Animated.Image
            source={{ uri }}
            style={[styles.photo, animatedPhotoStyle]}
            resizeMode="cover"
          />
        </Animated.View>
      </PinchGestureHandler>
    </View>
  );
}

export default function SwipeCard({ 
  user, 
  onPassPress, 
  onLikePress,
  onRequestSuperLike,
  onUndoPress,
  swipeProgress,
  scrollRef
}: SwipeCardProps & { onUndoPress?: () => void; }) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [superLikeAnimKey, setSuperLikeAnimKey] = useState(0);
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

  const pinchScale = useSharedValue(1);
  const pinchHandler = useAnimatedGestureHandler<PinchGestureHandlerGestureEvent>({
    onActive: ({ scale }) => {
      pinchScale.value = scale;
    },
    onEnd: () => {
      pinchScale.value = 1;
    },
  });
  const animatedPhotoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pinchScale.value }],
  }));

  // Add animated styles for swipe feedback overlays
  const likeOverlayStyle = useAnimatedStyle(() => {
    if (!swipeProgress) return { opacity: 0 };
    return {
      opacity: interpolate(swipeProgress.value, [0, width * 0.2], [0, 1], Extrapolate.CLAMP),
      transform: [
        { scale: interpolate(swipeProgress.value, [0, width * 0.2], [0.8, 1.1], Extrapolate.CLAMP) },
        { rotate: '-10deg' },
      ],
    };
  });
  const nopeOverlayStyle = useAnimatedStyle(() => {
    if (!swipeProgress) return { opacity: 0 };
    return {
      opacity: interpolate(swipeProgress.value, [-width * 0.2, 0], [1, 0], Extrapolate.CLAMP),
      transform: [
        { scale: interpolate(swipeProgress.value, [-width * 0.2, 0], [1.1, 0.8], Extrapolate.CLAMP) },
        { rotate: '10deg' },
      ],
    };
  });

  // Animated styles for swipe feedback icons
  const likeIconStyle = useAnimatedStyle(() => {
    if (!swipeProgress) return { opacity: 0 };
    return {
      opacity: interpolate(swipeProgress.value, [0, width * 0.18], [0, 1], Extrapolate.CLAMP),
      transform: [
        { scale: interpolate(swipeProgress.value, [0, width * 0.18], [0.8, 1.2], Extrapolate.CLAMP) },
      ],
    };
  });
  const nopeIconStyle = useAnimatedStyle(() => {
    if (!swipeProgress) return { opacity: 0 };
    return {
      opacity: interpolate(swipeProgress.value, [-width * 0.18, 0], [1, 0], Extrapolate.CLAMP),
      transform: [
        { scale: interpolate(swipeProgress.value, [-width * 0.18, 0], [1.2, 0.8], Extrapolate.CLAMP) },
      ],
    };
  });

  // Animated styles for big swipe feedback overlays
  const bigLikeOverlayStyle = useAnimatedStyle(() => {
    if (!swipeProgress) return { opacity: 0 };
    return {
      opacity: interpolate(swipeProgress.value, [0, width * 0.18, width * 0.4], [0, 0.5, 0.8], Extrapolate.CLAMP),
      zIndex: 210,
    };
  });
  const bigNopeOverlayStyle = useAnimatedStyle(() => {
    if (!swipeProgress) return { opacity: 0 };
    return {
      opacity: interpolate(swipeProgress.value, [-width * 0.4, -width * 0.18, 0], [0.8, 0.5, 0], Extrapolate.CLAMP),
      zIndex: 210,
    };
  });
  const bigLikeIconStyle = useAnimatedStyle(() => {
    if (!swipeProgress) return { opacity: 0, transform: [{ scale: 0.8 }] };
    return {
      opacity: interpolate(swipeProgress.value, [0, width * 0.18, width * 0.4], [0, 0.7, 1], Extrapolate.CLAMP),
      transform: [
        { scale: interpolate(swipeProgress.value, [0, width * 0.4], [0.8, 1.3], Extrapolate.CLAMP) },
      ],
    };
  });
  const bigNopeIconStyle = useAnimatedStyle(() => {
    if (!swipeProgress) return { opacity: 0, transform: [{ scale: 0.8 }] };
    return {
      opacity: interpolate(swipeProgress.value, [-width * 0.4, -width * 0.18, 0], [1, 0.7, 0], Extrapolate.CLAMP),
      transform: [
        { scale: interpolate(swipeProgress.value, [-width * 0.4, 0], [1.3, 0.8], Extrapolate.CLAMP) },
      ],
    };
  });

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
      'hiking': 'walk', // valid Ionicons
      'coffee': 'cafe',
      'wine': 'wine',
      'movies': 'film',
      'yoga': 'leaf',
      'technology': 'laptop',
      'fashion': 'shirt',
      'pets': 'paw',
      'gardening': 'flower',
      'smoking': 'close-circle',
      'drinking': 'wine',
      'exercise': 'fitness',
    };
    return iconMap[interest.toLowerCase()] || 'heart';
  };

  const getLifestyleIcon = (type: string, value: string) => {
    if (type === 'smoking') {
      return value === 'never' ? 'close-circle' : 'warning';
    }
    if (type === 'drinking') {
      return 'wine';
    }
    if (type === 'exercise') {
      return 'fitness';
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
    setSuperLikeAnimKey((k: number) => k + 1);
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
    setTimeout(() => setSuperLikeAnimKey(0), 1500);
    if (onRequestSuperLike) onRequestSuperLike();
  };

  // Super Like and Undo button animations (modern, joyful)
  const superLikeAnim = useSharedValue(1);
  const superLikeRotate = useSharedValue(0);
  const superLikeHalo = useSharedValue(0);
  const undoAnim = useSharedValue(0);
  const undoFlash = useSharedValue(0);
  const superLikeButtonStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: superLikeAnim.value },
      { rotate: `${superLikeRotate.value}deg` },
    ],
  }));
  const superLikeHaloStyle = useAnimatedStyle(() => ({
    opacity: 1 - superLikeHalo.value,
    transform: [
      { scale: 1 + superLikeHalo.value * 2 },
    ],
  }));
  const undoButtonStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: undoAnim.value },
    ],
  }));
  const undoFlashStyle = useAnimatedStyle(() => ({
    opacity: undoFlash.value,
  }));
  const handleSuperLikePressWithAnim = () => {
    setSuperLikeAnimKey((k: number) => k + 1);
    setTimeout(() => {
      superLikeAnim.value = 1;
      superLikeRotate.value = 0;
      superLikeHalo.value = 0;
      superLikeAnim.value = 1.5;
      superLikeRotate.value = -20;
      superLikeHalo.value = 0;
      superLikeHalo.value = withSpring(1, { damping: 5, stiffness: 120 });
      superLikeAnim.value = withSpring(1, { damping: 4, stiffness: 200 });
      superLikeRotate.value = withSpring(0, { damping: 4, stiffness: 200 });
      setTimeout(() => { superLikeHalo.value = 0; }, 400);
    }, 10);
    setTimeout(() => setSuperLikeAnimKey(0), 1500);
    handleSuperLikePress();
  };
  const handleUndoPressWithAnim = () => {
    undoAnim.value = -18;
    undoFlash.value = 1;
    undoAnim.value = withSpring(18, { damping: 2, stiffness: 200 }, () => {
      undoAnim.value = withSpring(0, { damping: 3, stiffness: 200 });
    });
    undoFlash.value = withSpring(0, { damping: 3, stiffness: 120 });
    if (onUndoPress) onUndoPress();
  };

  useEffect(() => {
    // Reset all Super Like and Undo animation states when card changes
    superLikeAnim.value = 1;
    superLikeRotate.value = 0;
    superLikeHalo.value = 0;
    setSuperLikeAnimKey(0); // Reset overlay trigger
    undoAnim.value = 0;
    undoFlash.value = 0;
  }, [user.id]);

  useEffect(() => {
    // On every superLikeAnimKey change, force the animation to play
    superLikeAnim.value = 1;
    superLikeRotate.value = 0;
    superLikeHalo.value = 0;
    setTimeout(() => {
      superLikeAnim.value = 1.5;
      superLikeRotate.value = -20;
      superLikeHalo.value = 0;
      superLikeHalo.value = withSpring(1, { damping: 5, stiffness: 120 });
      superLikeAnim.value = withSpring(1, { damping: 4, stiffness: 200 });
      superLikeRotate.value = withSpring(0, { damping: 4, stiffness: 200 });
      setTimeout(() => { superLikeHalo.value = 0; }, 400);
    }, 20);
  }, [superLikeAnimKey]);

  return (
    <View style={styles.container}>
      {/* Big swipe feedback overlays */}
      <Animated.View style={[styles.bigSwipeOverlay, styles.bigLikeOverlay, bigLikeOverlayStyle]} pointerEvents="none">
        <Animated.View style={bigLikeIconStyle}>
          <Ionicons name="heart" size={72} color="#fff" />
        </Animated.View>
      </Animated.View>
      <Animated.View style={[styles.bigSwipeOverlay, styles.bigNopeOverlay, bigNopeOverlayStyle]} pointerEvents="none">
        <Animated.View style={bigNopeIconStyle}>
          <Ionicons name="close" size={72} color="#fff" />
        </Animated.View>
      </Animated.View>
      {/* Floating Undo and Super Like buttons at top corners (over photo) */}
      {/* Super Like Button with Lottie animation and Halo */}
      <Animated.View style={[styles.superLikeHalo, superLikeHaloStyle]} pointerEvents="none" />
      <TouchableOpacity style={[styles.floatingSuperLike, superLikeButtonStyle]} onPress={onRequestSuperLike} activeOpacity={0.7}>
        <Ionicons name="star" size={22} color="#fff" />
      </TouchableOpacity>
      {/* Undo Button with Flash */}
      <Animated.View style={[styles.undoFlash, undoFlashStyle]} pointerEvents="none" />
      <TouchableOpacity style={[styles.floatingUndo, undoButtonStyle]} onPress={handleUndoPressWithAnim} activeOpacity={0.7}>
        <Ionicons name="arrow-undo" size={22} color="#fff" />
      </TouchableOpacity>
      {/* Super Like Animation Overlay (REAL) */}
      {superLikeAnimKey > 0 && (
        <View style={styles.superLikeOverlay} pointerEvents="none">
          <Text style={styles.superLikeText}>Super Like!</Text>
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
      {/* Unified ScrollView: photo and all details scroll together */}
      <ScrollView ref={scrollRef} style={styles.detailsScroll} contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Profile Photo at the top of the scrollable area with pinch-to-zoom */}
        {user.photos && user.photos[0] ? (
          <ZoomablePhoto uri={user.photos[0]} />
        ) : (
          <View style={styles.photoContainer}>
            <LinearGradient colors={fallbackGradient} style={styles.photo}>
              <View style={styles.placeholderContent}>
                <Ionicons name="person" size={80} color="#fff" />
                <Text style={styles.placeholderText}>No photo available</Text>
              </View>
            </LinearGradient>
          </View>
        )}
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
        {/* 2nd photo */}
        {user.photos && user.photos[1] && <ZoomablePhoto uri={user.photos[1]} />}
        {/* About Section */}
        {(user.bio || user.prompts) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.bioText}>{user.bio || user.prompts?.['simple-pleasure'] || 'Looking for meaningful connections'}</Text>
          </View>
        )}
        {/* 3rd photo */}
        {user.photos && user.photos[2] && <ZoomablePhoto uri={user.photos[2]} />}
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
        {/* 4th photo */}
        {user.photos && user.photos[3] && <ZoomablePhoto uri={user.photos[3]} />}
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
        {/* 5th photo */}
        {user.photos && user.photos[4] && <ZoomablePhoto uri={user.photos[4]} />}
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
        {/* 6th photo */}
        {user.photos && user.photos[5] && <ZoomablePhoto uri={user.photos[5]} />}
        {/* Fun Fact/Prompt */}
        {user.prompts && Object.keys(user.prompts).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Fun Fact</Text>
            <Text style={styles.quoteText}>
              "{user.prompts['ideal-date'] || user.prompts['travel-dream'] || user.prompts['simple-pleasure'] || 'Looking for someone to share life\'s adventures with'}"
            </Text>
          </View>
        )}
        {/* Remaining photos (7, 8, 9) at the end */}
        {user.photos && user.photos[6] && <ZoomablePhoto uri={user.photos[6]} />}
        {user.photos && user.photos[7] && <ZoomablePhoto uri={user.photos[7]} />}
        {user.photos && user.photos[8] && <ZoomablePhoto uri={user.photos[8]} />}
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
    height: height * 0.7,
    position: 'relative',
    overflow: 'hidden', // ensure zoom stays inside
    alignSelf: 'stretch',
    // borderRadius removed
  },
  photoWrapper: {
    flex: 1,
  },
  photo: {
    width: '100%',
    height: '100%',
    alignSelf: 'stretch',
    // No borderRadius here (container handles it)
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
    // paddingHorizontal: 16, // remove horizontal padding
  },
  section: {
    marginBottom: 24,
    marginTop: 16, // add space above each section (after a photo)
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
  swipeFeedbackOverlay: {
    position: 'absolute',
    top: 32,
    left: 32,
    zIndex: 200,
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  likeOverlay: {
    backgroundColor: 'rgba(76, 175, 80, 0.85)',
    borderColor: 'rgba(76, 175, 80, 1)',
  },
  nopeOverlay: {
    right: 32,
    backgroundColor: 'rgba(255, 68, 68, 0.85)',
    borderColor: 'rgba(255, 68, 68, 1)',
  },
  swipeIconOverlay: {
    position: 'absolute',
    top: 36,
    zIndex: 210,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 24,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 6,
    elevation: 4,
  },
  likeIconOverlay: {
    left: 36,
  },
  nopeIconOverlay: {
    right: 36,
  },
  bigSwipeOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  bigLikeOverlay: {
    backgroundColor: 'rgba(76, 175, 80, 0.35)',
  },
  bigNopeOverlay: {
    backgroundColor: 'rgba(255, 68, 68, 0.35)',
  },
  superLikeHalo: {
    position: 'absolute',
    top: 24,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,59,48,0.25)',
    zIndex: 99,
  },
  undoFlash: {
    position: 'absolute',
    top: 24,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(51, 153, 255, 0.18)',
    zIndex: 99,
  },
});
