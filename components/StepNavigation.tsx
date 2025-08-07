import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacings';

interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  nextButtonText?: string;
  nextButtonDisabled?: boolean;
  showSkip?: boolean;
  onSkip?: () => void;
}

export default function StepNavigation({
  currentStep,
  totalSteps,
  onBack,
  onNext,
  nextButtonText = 'Continue',
  nextButtonDisabled = false,
  showSkip = false,
  onSkip,
}: StepNavigationProps) {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        {!isFirstStep && (
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Ionicons name="arrow-back" size={20} color={colors.text.secondary} />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        )}
        
        <View style={styles.rightButtons}>
          {showSkip && onSkip && (
            <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
              <Text style={styles.skipButtonText}>Skip for now</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={[
              styles.nextButton,
              nextButtonDisabled && styles.nextButtonDisabled,
            ]}
            onPress={onNext}
            disabled={nextButtonDisabled}
          >
            <Text style={[
              styles.nextButtonText,
              nextButtonDisabled && styles.nextButtonTextDisabled,
            ]}>
              {isLastStep ? 'Create Profile' : nextButtonText}
            </Text>
            <Ionicons 
              name={isLastStep ? "checkmark" : "arrow-forward"} 
              size={20} 
              color={nextButtonDisabled ? colors.text.disabled : colors.text.white} 
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border.primary,
    backgroundColor: colors.background.secondary,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  backButtonText: {
    ...typography.styles.body,
    color: colors.text.secondary,
    marginLeft: spacing.xs,
  },
  rightButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  skipButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  skipButtonText: {
    ...typography.styles.body,
    color: colors.text.tertiary,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary[500],
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: spacing.button.borderRadius,
    gap: spacing.xs,
  },
  nextButtonDisabled: {
    backgroundColor: colors.background.tertiary,
  },
  nextButtonText: {
    ...typography.styles.button,
    color: colors.text.white,
  },
  nextButtonTextDisabled: {
    color: colors.text.disabled,
  },
});
