import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacings';
import { ToastMessage } from '../types/profile';

interface ToastProps {
  message: ToastMessage;
  onDismiss: (id: string) => void;
}

const TOAST_ICONS = {
  success: 'checkmark-circle',
  error: 'close-circle',
  info: 'information-circle',
};

const TOAST_COLORS = {
  success: colors.accent.success,
  error: colors.accent.error,
  info: colors.primary[500],
};

export default function Toast({ message, onDismiss }: ToastProps) {
  const translateY = useSharedValue(-100);
  const opacity = useSharedValue(0);

  useEffect(() => {
    // Slide in
    translateY.value = withSpring(0, { damping: 15 });
    opacity.value = withTiming(1, { duration: 300 });

    // Auto dismiss after duration
    const timer = setTimeout(() => {
      dismissToast();
    }, message.duration || 3000);

    return () => clearTimeout(timer);
  }, []);

  const dismissToast = () => {
    translateY.value = withSpring(-100, { damping: 15 });
    opacity.value = withTiming(0, { duration: 200 }, () => {
      runOnJS(onDismiss)(message.id);
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={[
        styles.toast,
        { borderLeftColor: TOAST_COLORS[message.type] },
      ]}>
        <Ionicons
          name={TOAST_ICONS[message.type] as any}
          size={20}
          color={TOAST_COLORS[message.type]}
        />
        <Text style={styles.message}>{message.message}</Text>
        <TouchableOpacity
          onPress={dismissToast}
          accessibilityLabel="Dismiss toast"
          accessibilityRole="button"
        >
          <Ionicons name="close" size={16} color={colors.text.tertiary} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: spacing.layout.header + spacing.md,
    left: spacing.md,
    right: spacing.md,
    zIndex: 1000,
  },
  toast: {
    backgroundColor: colors.background.secondary,
    borderRadius: spacing.card.borderRadius,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    shadowColor: colors.primary[500],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  message: {
    ...typography.styles.body,
    color: colors.text.primary,
    flex: 1,
    marginHorizontal: spacing.sm,
  },
}); 