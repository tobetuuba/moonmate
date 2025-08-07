import React, { useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacings';
import OptionGrid from '../OptionGrid';

// Interest options
const INTEREST_OPTIONS = [
  { value: 'music', label: 'Music', icon: 'musical-notes' },
  { value: 'travel', label: 'Travel', icon: 'airplane' },
  { value: 'sports', label: 'Sports', icon: 'football' },
  { value: 'food', label: 'Food', icon: 'restaurant' },
  { value: 'art', label: 'Art', icon: 'color-palette' },
  { value: 'reading', label: 'Reading', icon: 'book' },
  { value: 'gaming', label: 'Gaming', icon: 'game-controller' },
  { value: 'photography', label: 'Photography', icon: 'camera' },
  { value: 'dancing', label: 'Dancing', icon: 'body' },
  { value: 'hiking', label: 'Hiking', icon: 'leaf' },
  { value: 'cooking', label: 'Cooking', icon: 'restaurant' },
  { value: 'movies', label: 'Movies', icon: 'film' },
  { value: 'fitness', label: 'Fitness', icon: 'fitness' },
  { value: 'writing', label: 'Writing', icon: 'create' },
  { value: 'technology', label: 'Technology', icon: 'laptop' },
];

// Lifestyle options
const SMOKING_OPTIONS = [
  { label: 'Never', value: 'never' },
  { label: 'Occasionally', value: 'occasionally' },
  { label: 'Regularly', value: 'regularly' },
];

const DRINKING_OPTIONS = [
  { label: 'Never', value: 'never' },
  { label: 'Socially', value: 'socially' },
  { label: 'Regularly', value: 'regularly' },
];

const DIET_OPTIONS = [
  { label: 'No restrictions', value: 'none' },
  { label: 'Vegetarian', value: 'vegetarian' },
  { label: 'Vegan', value: 'vegan' },
  { label: 'Gluten-free', value: 'gluten-free' },
  { label: 'Keto', value: 'keto' },
  { label: 'Paleo', value: 'paleo' },
];

const EXERCISE_OPTIONS = [
  { label: 'Never', value: 'never' },
  { label: 'Occasionally', value: 'occasionally' },
  { label: 'Regularly', value: 'regularly' },
  { label: 'Daily', value: 'daily' },
];

import { InterestsLifestyle } from '../../types/profile';

interface Step4InterestsLifestyleProps {
  formData: InterestsLifestyle;
  updateFormData: (field: keyof InterestsLifestyle, value: any) => void;
}

export default function Step4InterestsLifestyle({
  formData,
  updateFormData,
}: Step4InterestsLifestyleProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Interests</Text>

      {/* Interests */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Hobbies and Interests *</Text>
        <OptionGrid
          options={INTEREST_OPTIONS}
          selectedValues={formData.interests}
          onSelectionChange={useCallback((value) => updateFormData('interests', value), [updateFormData])}
          multiSelect={true}
        />
      </View>

      <Text style={styles.sectionTitle}>Lifestyle</Text>

      {/* Smoking */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Smoking</Text>
        <OptionGrid
          options={SMOKING_OPTIONS}
          selectedValues={formData.smoking}
          onSelectionChange={useCallback((value) => updateFormData('smoking', value), [updateFormData])}
        />
      </View>

      {/* Drinking */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Drinking</Text>
        <OptionGrid
          options={DRINKING_OPTIONS}
          selectedValues={formData.drinking}
          onSelectionChange={useCallback((value) => updateFormData('drinking', value), [updateFormData])}
        />
      </View>

      {/* Diet */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Diet</Text>
        <OptionGrid
          options={DIET_OPTIONS}
          selectedValues={formData.diet}
          onSelectionChange={useCallback((value) => updateFormData('diet', value), [updateFormData])}
        />
      </View>

      {/* Exercise */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Exercise</Text>
        <OptionGrid
          options={EXERCISE_OPTIONS}
          selectedValues={formData.exercise}
          onSelectionChange={useCallback((value) => updateFormData('exercise', value), [updateFormData])}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
  },
  sectionTitle: {
    ...typography.styles.h4,
    color: colors.text.primary,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  inputLabel: {
    ...typography.styles.body,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    fontWeight: typography.weights.medium,
  },
});
