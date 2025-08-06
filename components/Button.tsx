import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacings';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: spacing.button.borderRadius,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    };

    const sizeStyles = {
      small: {
        paddingHorizontal: spacing.button.paddingHorizontal - 4,
        paddingVertical: spacing.button.paddingVertical - 4,
      },
      medium: {
        paddingHorizontal: spacing.button.paddingHorizontal,
        paddingVertical: spacing.button.paddingVertical,
      },
      large: {
        paddingHorizontal: spacing.button.paddingHorizontal + 4,
        paddingVertical: spacing.button.paddingVertical + 4,
      },
    };

    const variantStyles = {
      primary: {
        backgroundColor: isDisabled ? colors.text.disabled : colors.primary[500],
      },
      secondary: {
        backgroundColor: isDisabled ? colors.text.disabled : colors.secondary[500],
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: isDisabled ? colors.text.disabled : colors.primary[500],
      },
      ghost: {
        backgroundColor: 'transparent',
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
    };
  };

  const getTextStyle = (): TextStyle => {
    const baseTextStyle: TextStyle = {
      ...typography.styles.button,
      fontWeight: typography.weights.semibold,
    };

    const sizeTextStyles = {
      small: {
        fontSize: typography.sizes.sm,
      },
      medium: {
        fontSize: typography.sizes.base,
      },
      large: {
        fontSize: typography.sizes.lg,
      },
    };

    const variantTextStyles = {
      primary: {
        color: colors.text.primary,
      },
      secondary: {
        color: colors.text.primary,
      },
      outline: {
        color: isDisabled ? colors.text.disabled : colors.primary[500],
      },
      ghost: {
        color: isDisabled ? colors.text.disabled : colors.primary[500],
      },
    };

    return {
      ...baseTextStyle,
      ...sizeTextStyles[size],
      ...variantTextStyles[variant],
    };
  };

  const renderButtonContent = () => {
    if (loading) {
      return (
        <>
          <ActivityIndicator
            size="small"
            color={variant === 'outline' || variant === 'ghost' ? colors.primary[500] : colors.text.primary}
            style={{ marginRight: spacing.xs }}
          />
          <Text style={[getTextStyle(), textStyle]}>{title}</Text>
        </>
      );
    }

    return <Text style={[getTextStyle(), textStyle]}>{title}</Text>;
  };

  if (variant === 'primary' && !isDisabled) {
    return (
      <TouchableOpacity
        style={[getButtonStyle(), style]}
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={colors.gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFillObject}
        />
        {renderButtonContent()}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      {renderButtonContent()}
    </TouchableOpacity>
  );
} 