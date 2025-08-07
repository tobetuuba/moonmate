import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacings';
import OptionGrid from '../OptionGrid';
import FormError from '../FormError';
import DatePickerModal from '../DatePickerModal';

// Gender options
const GENDER_OPTIONS = [
  { label: 'Woman', value: 'woman', icon: 'female' },
  { label: 'Man', value: 'man', icon: 'male' },
  { label: 'Non-binary', value: 'nonbinary', icon: 'person' },
  { label: 'Gender fluid', value: 'genderfluid', icon: 'person' },
  { label: 'Agender', value: 'agender', icon: 'person' },
  { label: 'Bigender', value: 'bigender', icon: 'person' },
  { label: 'Demiboy', value: 'demiboy', icon: 'person' },
  { label: 'Demigirl', value: 'demigirl', icon: 'person' },
  { label: 'Genderqueer', value: 'genderqueer', icon: 'person' },
  { label: 'Neutrois', value: 'neutrois', icon: 'person' },
  { label: 'Pangender', value: 'pangender', icon: 'person' },
  { label: 'Polygender', value: 'polygender', icon: 'person' },
  { label: 'Two-spirit', value: 'two-spirit', icon: 'person' },
  { label: 'Other', value: 'other', icon: 'person' },
  { label: 'Custom', value: 'custom', icon: 'heart' },
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

// Seeking options
const SEEKING_OPTIONS = [
  { label: 'Woman', value: 'woman', icon: 'female' },
  { label: 'Man', value: 'man', icon: 'male' },
  { label: 'Non-binary', value: 'nonbinary', icon: 'person' },
  { label: 'Gender fluid', value: 'genderfluid', icon: 'person' },
  { label: 'Agender', value: 'agender', icon: 'person' },
  { label: 'Bigender', value: 'bigender', icon: 'person' },
  { label: 'Demiboy', value: 'demiboy', icon: 'person' },
  { label: 'Demigirl', value: 'demigirl', icon: 'person' },
  { label: 'Genderqueer', value: 'genderqueer', icon: 'person' },
  { label: 'Neutrois', value: 'neutrois', icon: 'person' },
  { label: 'Pangender', value: 'pangender', icon: 'person' },
  { label: 'Polygender', value: 'polygender', icon: 'person' },
  { label: 'Two-spirit', value: 'two-spirit', icon: 'person' },
  { label: 'Other', value: 'other', icon: 'person' },
  { label: 'Custom', value: 'custom', icon: 'heart' },
  { label: 'Everyone', value: 'everyone', icon: 'people' },
  { label: 'No preference', value: 'no-preference', icon: 'shuffle' },
  { label: 'Prefer not to say', value: 'no-answer', icon: 'help' },
];

import { BasicInfo } from '../../types/profile';

interface Step1BasicInfoProps {
  formData: BasicInfo;
  updateFormData: (field: keyof BasicInfo, value: any) => void;
  updateNestedField: (parentField: keyof BasicInfo, childField: string, value: any) => void;
  errors?: any;
  touched?: Record<string, boolean>;
  setFieldTouched?: (field: string, touched: boolean) => void;
}

export default function Step1BasicInfo({
  formData,
  updateFormData,
  updateNestedField,
  errors = {},
  touched = {},
  setFieldTouched,
}: Step1BasicInfoProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const nameInputRef = useRef<TextInput>(null);

  // Debug: Check seeking validation
  useEffect(() => {
    console.log('errors.seeking:', errors.seeking, 'touched.seeking:', touched.seeking);
  }, [errors.seeking, touched.seeking]);

  const handleDateConfirm = useCallback((date: Date) => {
    // Format date as YYYY-MM-DD in local timezone
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    updateFormData('birthDate', formattedDate);
  }, [updateFormData]);



  const getCurrentLocation = async () => {
    try {
      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Location Permission',
          'Please grant location permission to use your current location.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Get current location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      // Reverse geocode to get city name
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (reverseGeocode.length > 0) {
        const address = reverseGeocode[0];
        const cityName = address.city || address.subregion || address.region || 'Unknown City';
        
        // Update location data
        updateNestedField('location', 'city', cityName);
        updateNestedField('location', 'latitude', location.coords.latitude);
        updateNestedField('location', 'longitude', location.coords.longitude);
        
        // Mark as touched for validation
        updateFormData('location', { ...formData.location, city: cityName });
      } else {
        Alert.alert('Error', 'Could not determine your city. Please try again.');
      }
    } catch (error) {
      console.error('Location error:', error);
      Alert.alert('Error', 'Failed to get your current location. Please try again.');
    }
  };
  return (
    <KeyboardAvoidingView 
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Personal Information</Text>
      
      {/* Display Name */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Full Name *</Text>
        <TextInput
          ref={nameInputRef}
          style={[
            styles.textInput,
            errors.displayName && touched.displayName && styles.textInputError,
          ]}
          value={formData.displayName}
          onChangeText={useCallback((text: string) => updateFormData('displayName', text), [updateFormData])}
          placeholder="Enter your full name"
          placeholderTextColor={colors.text.tertiary}
          returnKeyType="next"
          blurOnSubmit={false}
          onSubmitEditing={() => {
            nameInputRef.current?.blur();
          }}
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
            errors.birthDate && touched.birthDate && styles.dateButtonError,
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

      {/* Height */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Height (cm) (optional)</Text>
        <TextInput
          style={[
            styles.textInput,
            errors.height && touched.height && styles.textInputError,
          ]}
          value={formData.height ? formData.height.toString() : ''}
          onChangeText={(text: string) => {
            // Only allow digits and limit to 3 characters
            const numericText = text.replace(/[^0-9]/g, '');
            if (numericText.length <= 3) {
              updateFormData('height', numericText ? parseInt(numericText) : undefined);
            }
          }}
          placeholder="e.g., 165"
          placeholderTextColor={colors.text.tertiary}
          keyboardType="numeric"
          maxLength={3}
        />
        <FormError 
          error={errors.height?.message} 
          touched={touched.height} 
        />
      </View>

      {/* Location */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Location *</Text>
        <TouchableOpacity 
          style={[
            styles.dateButton,
            errors.location?.city && touched['location.city'] && styles.dateButtonError,
          ]}
          onPress={getCurrentLocation}
        >
          <Text style={styles.dateButtonText}>
            {formData.location.city || 'Get Current Location'}
          </Text>
          <Ionicons name="locate" size={20} color={colors.primary[500]} />
        </TouchableOpacity>
        
        <FormError 
          error={errors.location?.city?.message} 
          touched={touched['location.city']} 
        />
      </View>

      {/* Profession */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Profession (optional)</Text>
        <TextInput
          style={[
            styles.textInput,
            errors.profession && touched.profession && styles.textInputError,
          ]}
          value={formData.profession || ''}
          onChangeText={(text: string) => updateFormData('profession', text)}
          placeholder="e.g., Software Engineer, Teacher, Doctor"
          placeholderTextColor={colors.text.tertiary}
          maxLength={50}
        />
        <FormError 
          error={errors.profession?.message} 
          touched={touched.profession} 
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
          hasError={!!(errors.gender && touched.gender)}
        />
        <FormError 
          error={errors.gender?.message} 
          touched={touched.gender} 
        />
      </View>

      {/* Pronouns */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Pronouns</Text>
        <View style={[
          styles.optionGridContainer,
          errors.pronouns && touched.pronouns && styles.optionGridError,
        ]}>
          <OptionGrid
            options={PRONOUN_OPTIONS}
            selectedValues={formData.pronouns}
            onSelectionChange={(value) => updateFormData('pronouns', value)}
            hasError={!!(errors.pronouns && touched.pronouns)}
          />
        </View>
        <FormError 
          error={errors.pronouns?.message} 
          touched={touched.pronouns} 
        />
      </View>

      {/* Seeking */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Looking for *</Text>
        <OptionGrid
          options={SEEKING_OPTIONS}
          selectedValues={formData.seeking}
          onSelectionChange={(value) => {
            updateFormData('seeking', value);
            setFieldTouched?.('seeking', true);
          }}
          multiSelect={true}
          hasError={!!(errors.seeking && touched.seeking)}
        />
        <FormError 
          error={errors.seeking} 
          touched={touched.seeking} 
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


      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
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
    borderWidth: 2,
    backgroundColor: colors.accent.error + '10',
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
  dateButtonError: {
    borderColor: colors.accent.error,
    borderWidth: 2,
    backgroundColor: colors.accent.error + '10',
  },

  optionGridContainer: {
    width: '100%',
    borderWidth: 1,
    borderColor: colors.border.secondary,
    borderRadius: spacing.input.borderRadius,
    padding: spacing.sm / 2,
  },
  optionGridError: {
    borderWidth: 2,
    borderColor: colors.accent.error,
    borderRadius: spacing.input.borderRadius,
    padding: spacing.sm,
    backgroundColor: colors.accent.error + '10',
  },
});
