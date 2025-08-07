import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacings';
import OptionGrid from '../OptionGrid';
import FormError from '../FormError';
import DatePickerModal from '../DatePickerModal';
import CityPickerModal from '../CityPickerModal';

// Gender options
const GENDER_OPTIONS = [
  { label: 'Woman', value: 'woman' },
  { label: 'Man', value: 'man' },
  { label: 'Non-binary', value: 'nonbinary' },
  { label: 'Gender fluid', value: 'genderfluid' },
  { label: 'Agender', value: 'agender' },
  { label: 'Bigender', value: 'bigender' },
  { label: 'Demiboy', value: 'demiboy' },
  { label: 'Demigirl', value: 'demigirl' },
  { label: 'Genderqueer', value: 'genderqueer' },
  { label: 'Neutrois', value: 'neutrois' },
  { label: 'Pangender', value: 'pangender' },
  { label: 'Polygender', value: 'polygender' },
  { label: 'Two-spirit', value: 'two-spirit' },
  { label: 'Other', value: 'other' },
  { label: 'Custom', value: 'custom' },
];

// Pronoun options
const PRONOUN_OPTIONS = [
  { label: 'He/Him', value: 'he/him' },
  { label: 'She/Her', value: 'she/her' },
  { label: 'They/Them', value: 'they/them' },
  { label: 'Ze/Hir', value: 'ze/hir' },
  { label: 'Xe/Xem', value: 'xe/xem' },
  { label: 'Ey/Em', value: 'ey/em' },
  { label: 'Custom', value: 'custom' },
];

// Sexual orientation options
const ORIENTATION_OPTIONS = [
  { label: 'Heterosexual', value: 'heterosexual' },
  { label: 'Homosexual', value: 'homosexual' },
  { label: 'Bisexual', value: 'bisexual' },
  { label: 'Pansexual', value: 'pansexual' },
  { label: 'Asexual', value: 'asexual' },
  { label: 'Demisexual', value: 'demisexual' },
  { label: 'Grey-asexual', value: 'grey-asexual' },
  { label: 'Polysexual', value: 'polysexual' },
  { label: 'Omnisexual', value: 'omnisexual' },
  { label: 'Sapiosexual', value: 'sapiosexual' },
  { label: 'Custom', value: 'custom' },
];

interface Step1BasicInfoProps {
  formData: {
    displayName: string;
    birthDate: string;
    birthTime: string;
    location: {
      city: string;
      country: string;
      latitude: number;
      longitude: number;
    };
    gender: string;
    customGender?: string;
    pronouns: string;
    customPronouns?: string;
    sexualOrientation: string[];
    customOrientation?: string;
  };
  updateFormData: (field: any, value: any) => void;
  updateNestedField: (parentField: any, childField: string, value: any) => void;
  errors?: any;
  touched?: Record<string, boolean>;
}

export default function Step1BasicInfo({
  formData,
  updateFormData,
  updateNestedField,
  errors = {},
  touched = {},
}: Step1BasicInfoProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCityPicker, setShowCityPicker] = useState(false);

  const handleDateConfirm = useCallback((date: Date) => {
    updateFormData('birthDate', date.toISOString().split('T')[0]);
  }, [updateFormData]);

  const handleCityConfirm = useCallback((city: string) => {
    updateNestedField('location', 'city', city);
  }, [updateNestedField]);
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Personal Information</Text>
      
      {/* Display Name */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Full Name *</Text>
        <TextInput
          style={[
            styles.textInput,
            errors.displayName && touched.displayName && styles.textInputError,
          ]}
          value={formData.displayName}
          onChangeText={useCallback((text: string) => updateFormData('displayName', text), [updateFormData])}
          placeholder="Enter your full name"
          placeholderTextColor={colors.text.tertiary}
        />
        <FormError 
          error={errors.displayName?.message} 
          touched={touched.displayName} 
        />
      </View>

      {/* Birth Date */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Birth Date *</Text>
        <TouchableOpacity 
          style={[
            styles.dateButton,
            errors.birthDate && touched.birthDate && styles.textInputError,
          ]}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateButtonText}>
            {formData.birthDate || 'Select birth date'}
          </Text>
          <Ionicons name="calendar-outline" size={20} color={colors.primary[500]} />
        </TouchableOpacity>
        <FormError 
          error={errors.birthDate?.message} 
          touched={touched.birthDate} 
        />
      </View>

      {/* Location */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>City *</Text>
        <TouchableOpacity 
          style={[
            styles.dateButton,
            errors.location?.city && (touched.location as any)?.city && styles.textInputError,
          ]}
          onPress={() => setShowCityPicker(true)}
        >
          <Text style={styles.dateButtonText}>
            {formData.location.city || 'Select city'}
          </Text>
          <Ionicons name="location-outline" size={20} color={colors.primary[500]} />
        </TouchableOpacity>
        <FormError 
          error={errors.location?.city?.message} 
          touched={touched.location as any} 
        />
      </View>

      <Text style={styles.sectionTitle}>Identity</Text>

      {/* Gender */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Gender Identity *</Text>
        <OptionGrid
          options={GENDER_OPTIONS}
          selectedValues={formData.gender}
          onSelectionChange={(value) => updateFormData('gender', value)}
        />
      </View>

      {/* Pronouns */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Pronouns</Text>
        <OptionGrid
          options={PRONOUN_OPTIONS}
          selectedValues={formData.pronouns}
          onSelectionChange={(value) => updateFormData('pronouns', value)}
        />
      </View>

      {/* Sexual Orientation */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Sexual Orientation</Text>
        <OptionGrid
          options={ORIENTATION_OPTIONS}
          selectedValues={formData.sexualOrientation}
          onSelectionChange={(value) => updateFormData('sexualOrientation', value)}
          multiSelect={true}
        />
      </View>

      {/* Modals */}
      <DatePickerModal
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onConfirm={handleDateConfirm}
        currentDate={formData.birthDate ? new Date(formData.birthDate) : new Date()}
        title="Select Birth Date"
      />

      <CityPickerModal
        visible={showCityPicker}
        onClose={() => setShowCityPicker(false)}
        onConfirm={handleCityConfirm}
        currentCity={formData.location.city}
        title="Select City"
      />
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
  textInput: {
    borderWidth: 1,
    borderColor: colors.border.secondary,
    borderRadius: spacing.input.borderRadius,
    padding: spacing.input.paddingHorizontal,
    backgroundColor: colors.background.secondary,
    color: colors.text.primary,
    ...typography.styles.input,
  },
  textInputError: {
    borderColor: colors.accent.error,
  },
  dateButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.secondary,
    borderRadius: spacing.input.borderRadius,
    padding: spacing.input.paddingHorizontal,
    backgroundColor: colors.background.secondary,
  },
  dateButtonText: {
    ...typography.styles.input,
    color: colors.text.primary,
  },
});
