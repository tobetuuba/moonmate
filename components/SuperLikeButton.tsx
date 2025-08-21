import React, { useCallback, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, ViewStyle, AccessibilityRole } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withRepeat,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

let Haptics: typeof import('expo-haptics') | undefined;
try { Haptics = require('expo-haptics'); } catch {}

export interface SuperLikeButtonProps {
  count: number;
  disabled?: boolean;
  onPress: () => void;
  onLongPressPreview?: () => void;
  style?: ViewStyle;
  testID?: string;
}

const BUTTON_SIZE = 56;
const GLOW_SIZE = BUTTON_SIZE * 1.28;
const HALO_SIZE = BUTTON_SIZE * 1.43;
const BADGE_SIZE = 22;
const SHIMMER_WIDTH = 32;
const SHIMMER_DURATION = 2500;
const BREATH_DURATION = 1400;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const SuperLikeButton: React.FC<SuperLikeButtonProps> = React.memo(
({ count, disabled, onPress, onLongPressPreview, style, testID }) => {
  // Animations
  const scale = useSharedValue(1);
  const iconRotate = useSharedValue(0);
  const shimmerX = useSharedValue(-BUTTON_SIZE * 0.5);
  const glowOpacity = useSharedValue(0.18);
  const haloScale = useSharedValue(1);
  const haloOpacity = useSharedValue(0);
  const badgeScale = useSharedValue(1);
  const prevCount = useRef(count);
  const breathing = useRef(true);
  const shimmerLooping = useRef(true);

  // Breathing idle animation
  useEffect(() => {
    if (!disabled) {
      breathing.current = true;
      scale.value = withRepeat(
        withTiming(1.04, { duration: BREATH_DURATION, easing: Easing.inOut(Easing.sin) }),
        -1,
        true
      );
      glowOpacity.value = withRepeat(
        withTiming(0.28, { duration: BREATH_DURATION, easing: Easing.inOut(Easing.sin) }),
        -1,
        true
      );
    } else {
      breathing.current = false;
      scale.value = withTiming(1, { duration: 180 });
      glowOpacity.value = withTiming(0.08, { duration: 180 });
    }
    return () => { breathing.current = false; };
  }, [disabled]);

  // Shimmer loop
  useEffect(() => {
    shimmerLooping.current = true;
    const loop = () => {
      if (!shimmerLooping.current || disabled) return;
      shimmerX.value = -BUTTON_SIZE * 0.5;
      shimmerX.value = withTiming(BUTTON_SIZE * 0.5, { duration: SHIMMER_DURATION, easing: Easing.linear }, () => {
        if (shimmerLooping.current && !disabled) runOnJS(loop)();
      });
    };
    if (!disabled) loop();
    return () => { shimmerLooping.current = false; };
  }, [disabled]);

  // Badge bounce on count change
  useEffect(() => {
    if (prevCount.current !== count) {
      badgeScale.value = 0.9;
      badgeScale.value = withSpring(1, { damping: 4, stiffness: 200 });
      prevCount.current = count;
    }
  }, [count]);

  // Press handlers
  const handlePressIn = useCallback(() => {
    if (disabled) return;
    scale.value = withSpring(0.92, { damping: 6, stiffness: 200 });
    iconRotate.value = withSpring(-18, { damping: 6, stiffness: 200 });
    haloScale.value = 1;
    haloOpacity.value = 0.18;
    haloScale.value = withTiming(1.8, { duration: 420, easing: Easing.out(Easing.exp) });
    haloOpacity.value = withTiming(0, { duration: 420, easing: Easing.out(Easing.exp) });
    if (Haptics?.impactAsync) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    }
  }, [disabled]);

  const handlePressOut = useCallback(() => {
    if (disabled) return;
    scale.value = withSpring(1, { damping: 6, stiffness: 200 });
    iconRotate.value = withSpring(0, { damping: 6, stiffness: 200 });
    setTimeout(() => {
      onPress();
    }, 60);
  }, [disabled, onPress]);

  const handleLongPress = useCallback(() => {
    if (disabled) return;
    if (Haptics?.selectionAsync) {
      Haptics.selectionAsync().catch(() => {});
    }
    onLongPressPreview?.();
  }, [disabled, onLongPressPreview]);

  // Animated styles
  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: disabled ? 0.5 : 1,
  }));
  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${iconRotate.value}deg` }],
    opacity: disabled ? 0.5 : 1,
  }));
  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
    transform: [{ scale: 1.18 }],
  }));
  const haloStyle = useAnimatedStyle(() => ({
    opacity: haloOpacity.value,
    transform: [{ scale: haloScale.value }],
  }));
  const shimmerStyle = useAnimatedStyle(() => ({
    opacity: disabled ? 0.08 : 0.2,
    transform: [
      { rotate: '45deg' },
      { translateX: shimmerX.value },
    ],
  }));
  const badgeAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: badgeScale.value }],
  }));

  // Only merge positioning props from external style. Ignore width/height/background.
  const posStyle = Array.isArray(style) ? Object.assign({}, ...style) : (style ?? {});
  delete posStyle.width; delete posStyle.height; delete posStyle.backgroundColor;

  // Accessibility
  const accessibilityLabel = `Super Like${typeof count === 'number' ? `, ${count} remaining` : ''}`;

  return (
    <View style={[styles.container, posStyle]} pointerEvents="box-none">
      {/* Glow */}
      <Animated.View style={[styles.glow, glowStyle]} pointerEvents="none" />
      {/* Halo ripple */}
      <Animated.View style={[styles.halo, haloStyle]} pointerEvents="none" />
      {/* Button */}
      <AnimatedPressable
        style={[styles.button, buttonStyle]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onLongPress={handleLongPress}
        disabled={disabled}
        accessibilityRole={"button" as AccessibilityRole}
        accessibilityLabel={accessibilityLabel}
        testID={testID}
        android_ripple={{ color: 'rgba(255,107,157,0.18)', borderless: true }}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        {/* Gradient background */}
        <LinearGradient
          colors={['#FF6B9D', '#8B5FBF']}
          start={{ x: 0.1, y: 0.1 }}
          end={{ x: 0.9, y: 0.9 }}
          style={StyleSheet.absoluteFill}
        />
        {/* Shimmer */}
        <Animated.View style={[styles.shimmer, shimmerStyle]} pointerEvents="none" />
        {/* Star icon */}
        <Animated.View style={[iconStyle, styles.iconWrap]}>
          <Ionicons name="star" size={28} color="#fff" />
        </Animated.View>
        {/* Badge */}
        <Animated.View style={[styles.badge, badgeAnimStyle, (disabled || count === 0) && styles.badgeDisabled]}>
          <Text style={styles.badgeText}>{count}</Text>
        </Animated.View>
      </AnimatedPressable>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 24,
    right: 20,
    zIndex: 100,
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible', // allow glow/halo to show
  },
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    overflow: 'hidden', // shimmer stays inside
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 6,
  },
  buttonPressed: {
    opacity: 0.92,
  },
  iconWrap: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  glow: {
    position: 'absolute',
    width: GLOW_SIZE,
    height: GLOW_SIZE,
    borderRadius: GLOW_SIZE / 2,
    backgroundColor: 'rgba(255,107,157,0.25)',
    top: (BUTTON_SIZE - GLOW_SIZE) / 2,
    left: (BUTTON_SIZE - GLOW_SIZE) / 2,
    zIndex: 1,
  },
  halo: {
    position: 'absolute',
    width: HALO_SIZE,
    height: HALO_SIZE,
    borderRadius: HALO_SIZE / 2,
    backgroundColor: '#FF6B9D',
    opacity: 0.18,
    top: (BUTTON_SIZE - HALO_SIZE) / 2,
    left: (BUTTON_SIZE - HALO_SIZE) / 2,
    zIndex: 2,
  },
  shimmer: {
    position: 'absolute',
    width: SHIMMER_WIDTH,
    height: BUTTON_SIZE,
    borderRadius: 12,
    backgroundColor: '#fff',
    opacity: 0.2,
    zIndex: 3,
    left: 0,
    top: 0,
  },
  badge: {
    position: 'absolute',
    top: -BADGE_SIZE / 2 + 8,
    right: -BADGE_SIZE / 2 + 8,
    minWidth: BADGE_SIZE,
    height: BADGE_SIZE,
    borderRadius: BADGE_SIZE / 2,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#FF6B9D',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    zIndex: 10,
    elevation: 2,
  },
  badgeDisabled: {
    backgroundColor: '#eee',
    borderColor: '#bbb',
  },
  badgeText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FF6B9D',
  },
});

export default SuperLikeButton;
