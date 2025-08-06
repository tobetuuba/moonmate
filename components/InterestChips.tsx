import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacings';

interface Interest {
  id: string;
  label: string;
  emoji: string;
  color: string;
}

interface InterestChipsProps {
  interests: Interest[];
  selectedInterests: string[];
  isEditable?: boolean;
  onInterestToggle?: (interestId: string) => void;
  maxSelections?: number;
}

const DEFAULT_INTERESTS: Interest[] = [
  { id: 'music', label: 'Music', emoji: '🎵', color: colors.primary[500] },
  { id: 'movies', label: 'Movies', emoji: '🎬', color: colors.secondary[500] },
  { id: 'travel', label: 'Travel', emoji: '✈️', color: colors.accent.gold },
  { id: 'cooking', label: 'Cooking', emoji: '👨‍🍳', color: colors.accent.success },
  { id: 'fitness', label: 'Fitness', emoji: '💪', color: colors.primary[600] },
  { id: 'reading', label: 'Reading', emoji: '📚', color: colors.secondary[600] },
  { id: 'photography', label: 'Photography', emoji: '📸', color: colors.accent.warning },
  { id: 'gaming', label: 'Gaming', emoji: '🎮', color: colors.primary[700] },
  { id: 'art', label: 'Art', emoji: '🎨', color: colors.secondary[700] },
  { id: 'dancing', label: 'Dancing', emoji: '💃', color: colors.accent.error },
  { id: 'hiking', label: 'Hiking', emoji: '🏔️', color: colors.accent.success },
  { id: 'coffee', label: 'Coffee', emoji: '☕', color: colors.accent.gold },
];

export default function InterestChips({
  interests = DEFAULT_INTERESTS,
  selectedInterests = [],
  isEditable = false,
  onInterestToggle,
  maxSelections = 6,
}: InterestChipsProps) {
  const handleInterestPress = (interestId: string) => {
    if (!isEditable) return;

    const isSelected = selectedInterests.includes(interestId);
    
    if (isSelected) {
      onInterestToggle?.(interestId);
    } else if (selectedInterests.length < maxSelections) {
      onInterestToggle?.(interestId);
    }
  };

  const renderInterestChip = (interest: Interest) => {
    const isSelected = selectedInterests.includes(interest.id);
    const isDisabled = !isSelected && selectedInterests.length >= maxSelections && isEditable;

    return (
      <TouchableOpacity
        key={interest.id}
        style={[
          styles.chip,
          isSelected && { backgroundColor: interest.color },
          isDisabled && styles.chipDisabled,
        ]}
        onPress={() => handleInterestPress(interest.id)}
        disabled={isDisabled}
        activeOpacity={0.7}
      >
        <Text style={styles.emoji}>{interest.emoji}</Text>
        <Text style={[
          styles.label,
          isSelected && styles.labelSelected,
          isDisabled && styles.labelDisabled,
        ]}>
          {interest.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Interests</Text>
        {isEditable && (
          <Text style={styles.counter}>
            {selectedInterests.length}/{maxSelections}
          </Text>
        )}
      </View>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsContainer}
      >
        {interests.map(renderInterestChip)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.styles.h4,
    color: colors.text.primary,
  },
  counter: {
    ...typography.styles.caption,
    color: colors.text.tertiary,
  },
  chipsContainer: {
    paddingHorizontal: spacing.md,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.tertiary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.button.borderRadius,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  chipDisabled: {
    opacity: 0.5,
  },
  emoji: {
    fontSize: 16,
    marginRight: spacing.xs,
  },
  label: {
    ...typography.styles.bodySmall,
    color: colors.text.secondary,
    fontWeight: typography.weights.medium,
  },
  labelSelected: {
    color: colors.text.primary,
    fontWeight: typography.weights.semibold,
  },
  labelDisabled: {
    color: colors.text.disabled,
  },
}); 