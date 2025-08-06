import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacings';
import { LinearGradient } from 'expo-linear-gradient';

interface LockedFeatureProps {
  title: string;
  description: string;
  icon: string;
  onUpgrade?: () => void;
  gradient?: string[];
}

export default function LockedFeature({
  title,
  description,
  icon,
  onUpgrade,
  gradient = colors.gradients.secondary,
}: LockedFeatureProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onUpgrade}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Ionicons name={icon as any} size={24} color={colors.text.primary} />
            <View style={styles.lockIcon}>
              <Ionicons name="lock-closed" size={12} color={colors.accent.gold} />
            </View>
          </View>
          
          <View style={styles.textContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
          </View>
          
          <View style={styles.upgradeContainer}>
            <Text style={styles.upgradeText}>Upgrade</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.text.primary} />
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
    borderRadius: spacing.card.borderRadius,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: colors.primary[500],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  gradient: {
    padding: spacing.md,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    position: 'relative',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  lockIcon: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.accent.gold,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    ...typography.styles.h4,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  description: {
    ...typography.styles.bodySmall,
    color: colors.text.secondary,
    lineHeight: typography.lineHeights.normal,
  },
  upgradeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.button.borderRadius,
  },
  upgradeText: {
    ...typography.styles.buttonSmall,
    color: colors.text.primary,
    fontWeight: typography.weights.semibold,
    marginRight: spacing.xs,
  },
}); 