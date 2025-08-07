import React, { useState, useCallback, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import * as Location from 'expo-location';
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

// Seeking options
const SEEKING_OPTIONS = [
  { label: 'Men', value: 'men', icon: 'male' },
  { label: 'Women', value: 'women', icon: 'female' },
  { label: 'Non-binary', value: 'non-binary', icon: 'person' },
  { label: 'Everyone', value: 'everyone', icon: 'people' },
  { label: 'Custom', value: 'custom', icon: 'heart' },
];

import { BasicInfo } from '../../types/profile';

interface Step1BasicInfoProps {
  formData: BasicInfo;
  updateFormData: (field: keyof BasicInfo, value: any) => void;
  updateNestedField: (parentField: keyof BasicInfo, childField: string, value: any) => void;
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
  const nameInputRef = useRef<TextInput>(null);

  const handleDateConfirm = useCallback((date: Date) => {
    updateFormData('birthDate', date.toISOString().split('T')[0]);
  }, [updateFormData]);

  const handleCityConfirm = useCallback((city: string) => {
    updateNestedField('location', 'city', city);
  }, [updateNestedField]);

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
        
        Alert.alert('Success', `Location set to ${cityName}`);
      } else {
        Alert.alert('Error', 'Could not determine your city. Please select manually.');
      }
    } catch (error) {
      console.error('Location error:', error);
      Alert.alert('Error', 'Failed to get your current location. Please select manually.');
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
        
        {/* Current Location Button */}
        <TouchableOpacity 
          style={styles.currentLocationButton}
          onPress={getCurrentLocation}
          accessibilityLabel="Use current location"
          accessibilityRole="button"
        >
          <Ionicons name="navigate" size={16} color={colors.primary[500]} />
          <Text style={styles.currentLocationText}>Use Current Location</Text>
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

      {/* Seeking */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Looking for *</Text>
        <OptionGrid
          options={SEEKING_OPTIONS}
          selectedValues={formData.seeking}
          onSelectionChange={(value) => updateFormData('seeking', value)}
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
  currentLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginTop: spacing.sm,
    borderRadius: spacing.button.borderRadius,
    backgroundColor: colors.background.tertiary,
    borderWidth: 1,
    borderColor: colors.border.secondary,
    gap: spacing.xs,
  },
  currentLocationText: {
    ...typography.styles.body,
    color: colors.primary[500],
    fontWeight: typography.weights.medium,
  },
});
