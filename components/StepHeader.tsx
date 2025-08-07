import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacings';
import ProgressBar from './ProgressBar';

interface StepHeaderProps {
  currentStep: number;
  totalSteps: number;
  title: string;
  subtitle?: string;
}

export default function StepHeader({ currentStep, totalSteps, title, subtitle }: StepHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.stepText}>
          Step {currentStep}/{totalSteps}
        </Text>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  header: {
    marginBottom: spacing.md,
  },
  stepText: {
    ...typography.styles.caption,
    color: colors.primary[400],
    marginBottom: spacing.xs,
    fontWeight: typography.weights.semibold,
  },
  title: {
    ...typography.styles.h2,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.styles.body,
    color: colors.text.secondary,
    lineHeight: typography.lineHeights.normal,
  },
});
