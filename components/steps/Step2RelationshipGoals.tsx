import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacings';
import OptionGrid from '../OptionGrid';

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
  errors?: any;
  touched?: any;
  setFieldTouched?: (field: string, touched: boolean) => void;
}

export default function Step2RelationshipGoals({
  formData,
  updateFormData,
  errors,
  touched,
  setFieldTouched,
}: Step2RelationshipGoalsProps) {
  // Debug: Check if formData is undefined
  console.log('🔍 Step2RelationshipGoals - formData:', formData);
  console.log('🔍 Step2RelationshipGoals - relationshipType:', formData?.relationshipType);
  console.log('🔍 Step2RelationshipGoals - childrenPlan:', formData?.childrenPlan);
  
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
        <OptionGrid
          options={RELATIONSHIP_TYPE_OPTIONS}
          selectedValues={Array.isArray(formData?.relationshipType) ? formData.relationshipType : []}
          onSelectionChange={(value) => {
            updateFormData('relationshipType', value);
            setFieldTouched?.('relationshipType', true);
          }}
          multiSelect={true}
          hasError={touched?.relationshipType && errors?.relationshipType}
        />
        {touched?.relationshipType && errors?.relationshipType && (
          <Text style={styles.errorText}>
            {typeof errors.relationshipType === 'string' ? errors.relationshipType : 'Please select at least one relationship type'}
          </Text>
        )}
      </View>

      {/* Monogamy Toggle */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Relationship Preference</Text>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleOption,
              formData?.monogamy === true && styles.toggleOptionSelected,
            ]}
            onPress={() => updateFormData('monogamy', true)}
          >
            <Text style={[
              styles.toggleOptionText,
              formData?.monogamy === true && styles.toggleOptionTextSelected,
            ]}>
              Monogamy
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleOption,
              formData?.monogamy === false && styles.toggleOptionSelected,
            ]}
            onPress={() => updateFormData('monogamy', false)}
          >
            <Text style={[
              styles.toggleOptionText,
              formData?.monogamy === false && styles.toggleOptionTextSelected,
            ]}>
              Polyamory
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Children Plan */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Children plans</Text>
        <OptionGrid
          options={CHILDREN_PLAN_OPTIONS}
          selectedValues={Array.isArray(formData?.childrenPlan) ? formData.childrenPlan : []}
          onSelectionChange={(value) => updateFormData('childrenPlan', value)}
          multiSelect={true}
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
});
