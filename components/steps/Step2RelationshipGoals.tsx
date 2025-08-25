import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacings';

// Relationship type options
const RELATIONSHIP_TYPE_OPTIONS = [
  { label: 'Serious Relationship', value: 'serious' },
  { label: 'Marriage', value: 'marriage' },
  { label: 'Fun', value: 'fun' },
  { label: 'Not Sure', value: 'unsure' },
];

// Children plan options
const CHILDREN_PLAN_OPTIONS = [
  { label: 'Yes, I want them', value: 'yes' },
  { label: 'No, I don\'t want them', value: 'no' },
  { label: 'Maybe', value: 'maybe' },
  { label: 'Already have them', value: 'already-have' },
];

import { RelationshipGoals } from '../../types/profile';

interface Step2RelationshipGoalsProps {
  formData: RelationshipGoals;
  updateFormData: (field: keyof RelationshipGoals, value: any) => void;
  updateNestedField: (parentField: string, childField: string, value: any) => void;
  errors?: any;
  touched?: any;
  setFieldTouched?: (field: string, touched: boolean) => void;
  onValidationError?: (field: string, hasError: boolean) => void;
}

export default function Step2RelationshipGoals({
  formData,
  updateFormData,
  updateNestedField,
  errors,
  touched,
  setFieldTouched,
  onValidationError,
}: Step2RelationshipGoalsProps) {
  
  // Helper function to check if a nested field has errors (same as Step1BasicInfo)
  const hasNestedError = (fieldPath: string) => {
    const parts = fieldPath.split('.');
    let cur: any = errors;

    // flat fallback
    if (errors?.[fieldPath]) cur = errors[fieldPath];

    // nested walk (override flat if exists)
    else {
      for (const p of parts) {
        if (!cur || typeof cur !== 'object' || !(p in cur)) {
          cur = null;
          break;
        }
        cur = cur[p];
      }
    }

    if (!cur) return false;
    if (typeof cur === 'string') return true;
    if (typeof cur === 'object') {
      if (cur.message) return true;
      if (cur.type) return true;
      if (cur.types && Object.keys(cur.types).length) return true;
    }
    return false;
  };

  // Helper function to check if a nested field has been touched (same as Step1BasicInfo)
  const hasNestedTouched = (fieldPath: string) => {
    // 1) flat fallback
    if (touched?.[fieldPath]) return true;

    // 2) nested check
    const parts = fieldPath.split('.');
    let cur = touched;
    for (const p of parts) {
      if (!cur || typeof cur !== 'object' || !(p in cur)) return false;
      cur = cur[p];
    }
    return !!cur;
  };
  
  // Debug: Check if formData is undefined
  console.log('🔍 Step2RelationshipGoals - formData:', JSON.stringify(formData, null, 2));
  console.log('🔍 Step2RelationshipGoals - intent:', JSON.stringify(formData?.preferences?.match?.intent, null, 2));
  console.log('🔍 Step2RelationshipGoals - childrenPlan:', JSON.stringify(formData?.preferences?.match?.childrenPlan, null, 2));
  
  // Debug: Check validation state
  console.log('🔍 Step2RelationshipGoals - errors:', JSON.stringify(errors, null, 2));
  console.log('🔍 Step2RelationshipGoals - touched:', JSON.stringify(touched, null, 2));
  console.log('🔍 Step2RelationshipGoals - hasNestedError(intent):', hasNestedError('preferences.match.intent'));
  console.log('🔍 Step2RelationshipGoals - hasNestedTouched(intent):', hasNestedTouched('preferences.match.intent'));
  
  // Safety check
  if (!formData) {
    console.error('❌ Step2RelationshipGoals - formData is undefined');
    return null;
  }
  
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Relationship Goals</Text>

      {/* Relationship Type */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>What type of relationship are you looking for? *</Text>
        <View style={[
          styles.optionsGrid,
          hasNestedTouched('preferences.match.intent') && hasNestedError('preferences.match.intent') && styles.optionGridError
        ]}>
          {RELATIONSHIP_TYPE_OPTIONS.map(opt => {
            const selected = formData.preferences?.match?.intent?.includes(opt.value);
            return (
              <TouchableOpacity
                key={opt.value}
                style={[styles.optionChip, selected && styles.optionChipSelected]}
                onPress={() => {
                  const cur = formData.preferences?.match?.intent || [];
                  const next = selected ? cur.filter(v => v !== opt.value) : [...cur, opt.value];
                  updateNestedField('preferences.match', 'intent', next);
                }}
              >
                <Text style={[styles.optionChipText, selected && styles.optionChipTextSelected]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {hasNestedTouched('preferences.match.intent') && hasNestedError('preferences.match.intent') && (
          <Text style={styles.errorText}>
            Please select at least one relationship type
          </Text>
        )}
      </View>

      {/* Monogamy Toggle */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Relationship Preference *</Text>
        <View style={[
          styles.toggleContainer,
          hasNestedTouched('preferences.match.monogamy') && hasNestedError('preferences.match.monogamy') && styles.optionGridError
        ]}>
          <TouchableOpacity
            style={[
              styles.toggleOption,
              formData?.preferences?.match?.monogamy === true && styles.toggleOptionSelected,
            ]}
            onPress={() => {
              updateNestedField('preferences.match', 'monogamy', true);
            }}
          >
            <Text style={[
              styles.toggleOptionText,
              formData?.preferences?.match?.monogamy === true && styles.toggleOptionTextSelected,
            ]}>
              Monogamy
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleOption,
              formData?.preferences?.match?.monogamy === false && styles.toggleOptionSelected,
            ]}
            onPress={() => {
              updateNestedField('preferences.match', 'monogamy', false);
            }}
          >
            <Text style={[
              styles.toggleOptionText,
              formData?.preferences?.match?.monogamy === false && styles.toggleOptionTextSelected,
            ]}>
              Polyamory
            </Text>
          </TouchableOpacity>
        </View>
        {hasNestedTouched('preferences.match.monogamy') && hasNestedError('preferences.match.monogamy') && (
          <Text style={styles.errorText}>
            Please select your relationship preference
          </Text>
        )}
        

      </View>

      {/* Children Plan */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Children plans</Text>
        <View style={styles.optionsGrid}>
          {CHILDREN_PLAN_OPTIONS.map(opt => {
            const selected = formData.preferences?.match?.childrenPlan?.includes(opt.value);
            return (
              <TouchableOpacity
                key={opt.value}
                style={[styles.optionChip, selected && styles.optionChipSelected]}
                onPress={() => {
                  const cur = formData.preferences?.match?.childrenPlan || [];
                  const next = selected ? cur.filter(v => v !== opt.value) : [...cur, opt.value];
                  updateNestedField('preferences.match', 'childrenPlan', next);
                }}
              >
                <Text style={[styles.optionChipText, selected && styles.optionChipTextSelected]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
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
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: colors.background.secondary,
    borderRadius: spacing.button.borderRadius,
    padding: 2,
  },
  toggleOption: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: spacing.button.borderRadius - 2,
    alignItems: 'center',
  },
  toggleOptionSelected: {
    backgroundColor: colors.primary[500],
  },
  toggleOptionText: {
    ...typography.styles.body,
    color: colors.text.primary,
  },
  toggleOptionTextSelected: {
    color: colors.text.white,
    fontWeight: typography.weights.semibold,
  },
  errorText: {
    ...typography.styles.caption,
    color: colors.accent.error,
    marginTop: spacing.xs,
    marginLeft: spacing.xs,
  },
  optionsGrid: {
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
  optionGridError: {
    borderWidth: 2,
    borderColor: colors.accent.error,
    borderRadius: spacing.input.borderRadius,
    padding: spacing.sm,
    backgroundColor: colors.accent.error + '10',
  },
  debugText: {
    ...typography.styles.caption,
    color: colors.accent.error,
    marginTop: spacing.xs,
    fontSize: 10,
  },
});
