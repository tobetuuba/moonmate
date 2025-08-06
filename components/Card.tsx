import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  ViewProps,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacings';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'gradient';
  padding?: 'none' | 'small' | 'medium' | 'large';
  style?: ViewStyle;
}

export default function Card({
  children,
  variant = 'default',
  padding = 'medium',
  style,
  ...props
}: CardProps) {
  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: spacing.card.borderRadius,
      overflow: 'hidden',
    };

    const paddingStyles = {
      none: {},
      small: { padding: spacing.sm },
      medium: { padding: spacing.md },
      large: { padding: spacing.lg },
    };

    const variantStyles = {
      default: {
        backgroundColor: colors.background.secondary,
      },
      elevated: {
        backgroundColor: colors.background.secondary,
        shadowColor: colors.primary[500],
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      },
      outlined: {
        backgroundColor: colors.background.secondary,
        borderWidth: 1,
        borderColor: colors.border.primary,
      },
      gradient: {
        backgroundColor: 'transparent',
      },
    };

    return {
      ...baseStyle,
      ...paddingStyles[padding],
      ...variantStyles[variant],
    };
  };

  const renderCardContent = () => {
    if (variant === 'gradient') {
      return (
        <LinearGradient
          colors={colors.gradients.card}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        >
          <View style={[getCardStyle(), style]} {...props}>
            {children}
          </View>
        </LinearGradient>
      );
    }

    return (
      <View style={[getCardStyle(), style]} {...props}>
        {children}
      </View>
    );
  };

  return renderCardContent();
} 