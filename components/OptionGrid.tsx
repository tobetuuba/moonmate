import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacings';

interface Option {
  label: string;
  value: string;
  icon?: string;
}

interface OptionGridProps {
  options: Option[];
  selectedValues: string | string[];
  onSelectionChange: (value: string | string[]) => void;
  multiSelect?: boolean;
  maxSelections?: number;
}

export default function OptionGrid({
  options,
  selectedValues,
  onSelectionChange,
  multiSelect = false,
  maxSelections,
}: OptionGridProps) {
  const isSelected = (value: string) => {
    if (multiSelect) {
      return Array.isArray(selectedValues) && selectedValues.includes(value);
    }
    return selectedValues === value;
  };

  const handleOptionPress = (value: string) => {
    if (multiSelect) {
      const currentValues = Array.isArray(selectedValues) ? selectedValues : [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : maxSelections && currentValues.length >= maxSelections
        ? currentValues
        : [...currentValues, value];
      onSelectionChange(newValues);
    } else {
      onSelectionChange(value);
    }
  };

  return (
    <View style={styles.container}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={[
            styles.optionChip,
            isSelected(option.value) && styles.optionChipSelected,
          ]}
          onPress={() => handleOptionPress(option.value)}
        >
          {option.icon && (
            <Ionicons
              name={option.icon as any}
              size={16}
              color={isSelected(option.value) ? colors.text.white : colors.primary[500]}
              style={styles.optionIcon}
            />
          )}
          <Text style={[
            styles.optionChipText,
            isSelected(option.value) && styles.optionChipTextSelected,
          ]}>
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  optionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.button.borderRadius,
    borderWidth: 1,
    borderColor: colors.border.secondary,
    backgroundColor: colors.background.secondary,
    gap: spacing.xs,
  },
  optionChipSelected: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
  },
  optionChipText: {
    ...typography.styles.body,
    color: colors.text.primary,
  },
  optionChipTextSelected: {
    color: colors.text.white,
    fontWeight: typography.weights.semibold,
  },
  optionIcon: {
    marginRight: spacing.xs,
  },
});
