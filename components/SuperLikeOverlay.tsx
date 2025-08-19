import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import type { ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import type { AnimateStyle } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export interface SuperLikeOverlayProps {
  visible: boolean;
  playKey: number;
}

const STAR_COUNT = 5;
const STAR_RADIUS = 120;

export const SuperLikeOverlay: React.FC<SuperLikeOverlayProps> = ({ visible, playKey }) => {
  // Central burst animation
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);
  // Star particles
  const starAnims = Array.from({ length: STAR_COUNT }, () => ({
    progress: useSharedValue(0),
    scale: useSharedValue(0.7),
    opacity: useSharedValue(0),
  }));

  useEffect(() => {
    if (visible) {
      // Animate central burst
      scale.value = 0.8;
      opacity.value = 0;
      scale.value = withSpring(1.2, { damping: 6, stiffness: 120 }, () => {
        scale.value = withSpring(1, { damping: 6, stiffness: 120 });
      });
      opacity.value = withTiming(1, { duration: 180, easing: Easing.out(Easing.exp) }, () => {
        opacity.value = withTiming(0.6, { duration: 400 });
      });
      // Animate stars
      starAnims.forEach((star, i) => {
        star.progress.value = 0;
        star.scale.value = 0.7;
        star.opacity.value = 0;
        const delay = i * 60;
        setTimeout(() => {
          star.progress.value = withTiming(1, { duration: 420, easing: Easing.out(Easing.exp) });
          star.scale.value = withSpring(1.2, { damping: 5, stiffness: 120 }, () => {
            star.scale.value = withSpring(1, { damping: 5, stiffness: 120 });
          });
          star.opacity.value = withTiming(1, { duration: 180 }, () => {
            star.opacity.value = withTiming(0.2, { duration: 300 });
          });
        }, delay);
      });
    } else {
      scale.value = 0.8;
      opacity.value = 0;
      starAnims.forEach(star => {
        star.progress.value = 0;
        star.scale.value = 0.7;
        star.opacity.value = 0;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, playKey]);

  const burstStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  // Precompute starStyles outside of JSX to avoid conditional hooks
  const starStyles: AnimateStyle<ViewStyle>[] = [];
  for (let i = 0; i < STAR_COUNT; i++) {
    const angle = (i / STAR_COUNT) * Math.PI * 2;
    starStyles.push(
      useAnimatedStyle(() => {
        const tx = Math.cos(angle) * STAR_RADIUS * starAnims[i].progress.value;
        const ty = Math.sin(angle) * STAR_RADIUS * starAnims[i].progress.value;
        return {
          position: 'absolute' as const,
          left: width / 2 - 12,
          top: height / 2 - 12,
          transform: [
            { translateX: tx },
            { translateY: ty },
            { scale: starAnims[i].scale.value },
          ],
          opacity: starAnims[i].opacity.value,
        };
      })
    );
  }

  return visible ? (
    <View pointerEvents="none" style={styles.overlay}>
      {/* Central burst */}
      <Animated.View style={[styles.centerBurst, burstStyle]}>
        <Ionicons name="star" size={44} color="#FF3B30" style={{ marginBottom: 8 }} />
        <Text style={styles.text}>Super Like!</Text>
      </Animated.View>
      {/* Star particles */}
      {starAnims.map((star, i) => (
        <Animated.View key={i} style={starStyles[i]} pointerEvents="none">
          <Ionicons name="star" size={24} color="#FF3B30" />
        </Animated.View>
      ))}
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 9999,
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
  },
  centerBurst: {
    position: 'absolute',
    left: width / 2 - 80,
    top: height / 2 - 80,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 8,
  },
  text: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF3B30',
    textAlign: 'center',
    textShadowColor: '#fff',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
});
