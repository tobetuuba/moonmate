import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacings';
import { Slider } from '@miblanchard/react-native-slider';

export default function Step1BasicInfo() {
  const [formData, setFormData] = useState({
    displayName: '',
    birthDate: null as string | null,
    birthTime: null as string | null,
    location: null as { city: string; latitude: number; longitude: number } | null,
    gender: [] as string[],
    pronouns: [] as string[],
    bio: '',
    photos: [] as string[],
    profilePhotoUrl: '',
    interests: [] as string[],
    lifestyle: {
      smoking: null as string | null,
      drinking: null as string | null,
      diet: null as string | null,
      exercise: null as string | null,
    },
    prompts: {} as Record<string, any>,
    seeking: [] as string[],
    ageRange: { min: 25, max: 35 } as { min: number; max: number },
    maxDistance: 50,
    relationshipType: null as string | null,
    monogamy: null as string | null,
    childrenPlan: null as string | null,
    showOrientation: false,
    showGender: false,
    acceptTerms: false,
    acceptPrivacy: false,
  });

  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [localDistance, setLocalDistance] = useState<number | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());
  const [tempTime, setTempTime] = useState(new Date());
  
  // Separate state for input values to allow editing
  const [dateInputs, setDateInputs] = useState({
    year: new Date().getFullYear().toString(),
    month: (new Date().getMonth() + 1).toString(),
    day: new Date().getDate().toString(),
  });
  
  const [timeInputs, setTimeInputs] = useState({
    hour: new Date().getHours().toString(),
    minute: new Date().getMinutes().toString(),
  });

  const updateFormData = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const updateNestedFormData = (parentKey: string, childKey: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parentKey]: {
        ...(prev[parentKey as keyof typeof prev] as any),
        [childKey]: value,
      },
    }));
  };

  const handleDateConfirm = () => {
    // Parse the input values
    const year = parseInt(dateInputs.year);
    const month = parseInt(dateInputs.month);
    const day = parseInt(dateInputs.day);
    
    // Validate inputs
    if (isNaN(year) || year < 1900 || year > new Date().getFullYear()) {
      Alert.alert('Invalid Year', 'Please enter a valid year between 1900 and current year.');
      return;
    }
    
    if (isNaN(month) || month < 1 || month > 12) {
      Alert.alert('Invalid Month', 'Please enter a valid month between 1 and 12.');
      return;
    }
    
    if (isNaN(day) || day < 1 || day > 31) {
      Alert.alert('Invalid Day', 'Please enter a valid day between 1 and 31.');
      return;
    }
    
    // Create the date and update
    const newDate = new Date(year, month - 1, day);
    setTempDate(newDate);
    
    const yearStr = String(year);
    const monthStr = String(month).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const formattedDate = `${yearStr}-${monthStr}-${dayStr}`;
    updateFormData('birthDate', formattedDate);
    setShowDatePicker(false);
  };

  const handleTimeConfirm = () => {
    // Parse the input values
    const hour = parseInt(timeInputs.hour);
    const minute = parseInt(timeInputs.minute);
    
    // Validate inputs
    if (isNaN(hour) || hour < 0 || hour > 23) {
      Alert.alert('Invalid Hour', 'Please enter a valid hour between 0 and 23.');
      return;
    }
    
    if (isNaN(minute) || minute < 0 || minute > 59) {
      Alert.alert('Invalid Minute', 'Please enter a valid minute between 0 and 59.');
      return;
    }
    
    // Create the time and update
    const newTime = new Date();
    newTime.setHours(hour, minute);
    setTempTime(newTime);
    
    const hourStr = String(hour).padStart(2, '0');
    const minuteStr = String(minute).padStart(2, '0');
    const formattedTime = `${hourStr}:${minuteStr}`;
    updateFormData('birthTime', formattedTime);
    setShowTimePicker(false);
  };

  const openDatePicker = () => {
    // Initialize inputs with current form data or default values
    if (formData.birthDate) {
      const date = new Date(formData.birthDate);
      setDateInputs({
        year: date.getFullYear().toString(),
        month: (date.getMonth() + 1).toString(),
        day: date.getDate().toString(),
      });
    } else {
      const now = new Date();
      setDateInputs({
        year: now.getFullYear().toString(),
        month: (now.getMonth() + 1).toString(),
        day: now.getDate().toString(),
      });
    }
    setShowDatePicker(true);
  };

  const openTimePicker = () => {
    // Initialize inputs with current form data or default values
    if (formData.birthTime) {
      const [hours, minutes] = formData.birthTime.split(':');
      setTimeInputs({
        hour: hours,
        minute: minutes,
      });
    } else {
      const now = new Date();
      setTimeInputs({
        hour: now.getHours().toString(),
        minute: now.getMinutes().toString(),
      });
    }
    setShowTimePicker(true);
  };

  const closeDatePicker = () => {
    setShowDatePicker(false);
    // Reset inputs to current form data
    if (formData.birthDate) {
      const date = new Date(formData.birthDate);
      setDateInputs({
        year: date.getFullYear().toString(),
        month: (date.getMonth() + 1).toString(),
        day: date.getDate().toString(),
      });
    }
  };

  const closeTimePicker = () => {
    setShowTimePicker(false);
    // Reset inputs to current form data
    if (formData.birthTime) {
      const [hours, minutes] = formData.birthTime.split(':');
      setTimeInputs({
        hour: hours,
        minute: minutes,
      });
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Select birth date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeString: string | null) => {
    if (!timeString) return 'Select birth time';
    return timeString;
  };

  return (
    <ScrollView 
      style={styles.container}
      scrollEnabled={scrollEnabled}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Basic Information</Text>
        <Text style={styles.subtitle}>
          Tell us about yourself to help us find your perfect match
        </Text>

        {/* Display Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Display Name *</Text>
          <TextInput
            style={styles.textInput}
            value={formData.displayName}
            onChangeText={(text) => updateFormData('displayName', text)}
            placeholder="Enter your display name"
            placeholderTextColor={colors.text.tertiary}
          />
        </View>

        {/* Birth Date */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Birth Date *</Text>
          <TouchableOpacity 
            style={styles.dateButton}
            onPress={openDatePicker}
          >
            <Text style={styles.dateButtonText}>
              {formatDate(formData.birthDate)}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Birth Time */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Birth Time</Text>
          <Text style={styles.inputSubtitle}>
            Optional: Your birth time for more accurate astrological insights
          </Text>
          <TouchableOpacity 
            style={styles.dateButton}
            onPress={openTimePicker}
          >
            <Text style={styles.dateButtonText}>
              {formatTime(formData.birthTime)}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Location */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Location *</Text>
          <Text style={styles.inputSubtitle}>
            Your city and coordinates for location-based matching
          </Text>
          <TouchableOpacity style={styles.locationButton}>
            <Text style={styles.locationButtonText}>
              {formData.location ? `${formData.location.city}` : 'Select Location'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Bio */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Bio *</Text>
          <Text style={styles.inputSubtitle}>
            Tell potential matches about yourself
          </Text>
          <TextInput
            style={[styles.textInput, styles.bioInput]}
            value={formData.bio}
            onChangeText={(text) => updateFormData('bio', text)}
            placeholder="Share your story, interests, and what you're looking for..."
            placeholderTextColor={colors.text.tertiary}
            multiline={true}
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Looking For Preferences */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Looking For</Text>
          <Text style={styles.inputSubtitle}>
            Who are you interested in meeting?
          </Text>

          {/* Age Range Slider */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Age Range</Text>
            <Text style={styles.inputSubtitle}>
              Select your preferred age range for matches
            </Text>
            
            {/* Custom Range Slider */}
            <View style={styles.rangeSliderContainer}>
              <View style={styles.rangeSliderTrack}>
                <View 
                  style={[
                    styles.rangeSliderFill,
                    {
                      left: `${((formData.ageRange?.min ?? 25) - 18) / 42 * 100}%`,
                      width: `${((formData.ageRange?.max ?? 35) - (formData.ageRange?.min ?? 25)) / 42 * 100}%`,
                    }
                  ]} 
                />
                <TouchableOpacity
                  style={[
                    styles.rangeSliderThumb,
                    { left: `${((formData.ageRange?.min ?? 25) - 18) / 42 * 100}%` }
                  ]}
                  onPressIn={() => setScrollEnabled(false)}
                  onPressOut={() => setScrollEnabled(true)}
                />
                <TouchableOpacity
                  style={[
                    styles.rangeSliderThumb,
                    { left: `${((formData.ageRange?.max ?? 35) - 18) / 42 * 100}%` }
                  ]}
                  onPressIn={() => setScrollEnabled(false)}
                  onPressOut={() => setScrollEnabled(true)}
                />
              </View>
              <View style={styles.rangeSliderLabels}>
                <Text style={styles.rangeSliderLabel}>18</Text>
                <Text style={styles.rangeSliderLabel}>60</Text>
              </View>
            </View>
            
            <View style={styles.rangeInputs}>
              <View style={styles.rangeInputContainer}>
                <Text style={styles.rangeInputLabel}>Min Age</Text>
                <TextInput
                  style={styles.rangeInput}
                  value={formData.ageRange?.min?.toString() || '25'}
                  onChangeText={(text) => {
                    const min = parseInt(text) || 18;
                    const max = formData.ageRange?.max || 35;
                    if (min >= 18 && min <= max) {
                      updateFormData('ageRange', { min, max });
                    }
                  }}
                  keyboardType="numeric"
                  maxLength={2}
                />
              </View>
              <View style={styles.rangeInputContainer}>
                <Text style={styles.rangeInputLabel}>Max Age</Text>
                <TextInput
                  style={styles.rangeInput}
                  value={formData.ageRange?.max?.toString() || '35'}
                  onChangeText={(text) => {
                    const max = parseInt(text) || 35;
                    const min = formData.ageRange?.min || 25;
                    if (max <= 60 && max >= min) {
                      updateFormData('ageRange', { min, max });
                    }
                  }}
                  keyboardType="numeric"
                  maxLength={2}
                />
              </View>
            </View>
          </View>

          {/* Maximum Distance Slider */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Maximum Distance</Text>
            <Text style={styles.inputSubtitle}>
              How far are you willing to travel for a match?
            </Text>
            
            <Slider
              value={(localDistance ?? formData.maxDistance) ?? 50}
              minimumValue={1}
              maximumValue={200}
              step={1}
              animationType="spring"
              onSlidingStart={() => setScrollEnabled(false)}
              onValueChange={(v) => {
                const raw = Array.isArray(v) ? v[0] : v;
                setLocalDistance(Math.round(raw as number));
              }}
              onSlidingComplete={(v) => {
                const raw = Array.isArray(v) ? v[0] : v;
                setScrollEnabled(true);
                setLocalDistance(null);
                updateFormData('maxDistance', Math.round(raw as number));
              }}
              minimumTrackTintColor={colors.primary[500]}
              maximumTrackTintColor={colors.border.secondary}
              thumbTintColor={colors.primary[500]}
              thumbStyle={{ width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: colors.background.primary }}
              thumbTouchSize={{ width: 40, height: 40 }}
              trackStyle={{ height: 4 }}
            />
            
            <View style={styles.distanceLabel}>
              <Text style={styles.distanceValue}>
                {(localDistance ?? formData.maxDistance ?? 50)} km
              </Text>
            </View>
          </View>
        </View>

        {/* Terms and Privacy */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Terms and Privacy</Text>
          <Text style={styles.inputSubtitle}>
            Please read and accept our terms and privacy policy
          </Text>

          {/* Accept Terms */}
          <View style={styles.inputContainer}>
            <TouchableOpacity
              style={[
                styles.checkboxButton,
                formData.acceptTerms && styles.checkboxButtonActive
              ]}
              onPress={() => updateFormData('acceptTerms', !formData.acceptTerms)}
            >
              <Text style={[
                styles.checkboxButtonText,
                formData.acceptTerms && styles.checkboxButtonTextActive
              ]}>
                {formData.acceptTerms ? '✓' : ''} I accept the Terms of Service
              </Text>
            </TouchableOpacity>
          </View>

          {/* Accept Privacy */}
          <View style={styles.inputContainer}>
            <TouchableOpacity
              style={[
                styles.checkboxButton,
                formData.acceptPrivacy && styles.checkboxButtonActive
              ]}
              onPress={() => updateFormData('acceptPrivacy', !formData.acceptPrivacy)}
            >
              <Text style={[
                styles.checkboxButtonText,
                formData.acceptPrivacy && styles.checkboxButtonTextActive
              ]}>
                {formData.acceptPrivacy ? '✓' : ''} I accept the Privacy Policy
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Date Picker Modal */}
      <Modal
        visible={showDatePicker}
        transparent
        animationType="slide"
        onRequestClose={closeDatePicker}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Birth Date</Text>
            
            {/* Simple Date Picker */}
            <View style={styles.datePickerContainer}>
              <View style={styles.datePickerRow}>
                <Text style={styles.datePickerLabel}>Year:</Text>
                <TextInput
                  style={styles.datePickerInput}
                  value={dateInputs.year}
                  onChangeText={(text) => setDateInputs(prev => ({ ...prev, year: text }))}
                  keyboardType="numeric"
                  maxLength={4}
                  placeholder="YYYY"
                  placeholderTextColor={colors.text.tertiary}
                />
              </View>
              
              <View style={styles.datePickerRow}>
                <Text style={styles.datePickerLabel}>Month:</Text>
                <TextInput
                  style={styles.datePickerInput}
                  value={dateInputs.month}
                  onChangeText={(text) => setDateInputs(prev => ({ ...prev, month: text }))}
                  keyboardType="numeric"
                  maxLength={2}
                  placeholder="MM"
                  placeholderTextColor={colors.text.tertiary}
                />
              </View>
              
              <View style={styles.datePickerRow}>
                <Text style={styles.datePickerLabel}>Day:</Text>
                <TextInput
                  style={styles.datePickerInput}
                  value={dateInputs.day}
                  onChangeText={(text) => setDateInputs(prev => ({ ...prev, day: text }))}
                  keyboardType="numeric"
                  maxLength={2}
                  placeholder="DD"
                  placeholderTextColor={colors.text.tertiary}
                />
              </View>
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={closeDatePicker}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={handleDateConfirm}
              >
                <Text style={[styles.modalButtonText, styles.modalButtonTextConfirm]}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Time Picker Modal */}
      <Modal
        visible={showTimePicker}
        transparent
        animationType="slide"
        onRequestClose={closeTimePicker}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Birth Time</Text>
            
            {/* Simple Time Picker */}
            <View style={styles.datePickerContainer}>
              <View style={styles.datePickerRow}>
                <Text style={styles.datePickerLabel}>Hour:</Text>
                <TextInput
                  style={styles.datePickerInput}
                  value={timeInputs.hour}
                  onChangeText={(text) => setTimeInputs(prev => ({ ...prev, hour: text }))}
                  keyboardType="numeric"
                  maxLength={2}
                  placeholder="HH"
                  placeholderTextColor={colors.text.tertiary}
                />
              </View>
              
              <View style={styles.datePickerRow}>
                <Text style={styles.datePickerLabel}>Minute:</Text>
                <TextInput
                  style={styles.datePickerInput}
                  value={timeInputs.minute}
                  onChangeText={(text) => setTimeInputs(prev => ({ ...prev, minute: text }))}
                  keyboardType="numeric"
                  maxLength={2}
                  placeholder="MM"
                  placeholderTextColor={colors.text.tertiary}
                />
              </View>
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={closeTimePicker}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={handleTimeConfirm}
              >
                <Text style={[styles.modalButtonText, styles.modalButtonTextConfirm]}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
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
  content: {
    flexGrow: 1,
  },
  title: {
    ...typography.styles.h4,
    color: colors.text.primary,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  subtitle: {
    ...typography.styles.caption,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
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
  inputSubtitle: {
    ...typography.styles.caption,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
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
  bioInput: {
    minHeight: 80,
    paddingTop: spacing.input.paddingVertical,
  },
  inputContainer: {
    marginTop: spacing.sm,
  },
  locationButton: {
    borderWidth: 1,
    borderColor: colors.border.secondary,
    borderRadius: spacing.input.borderRadius,
    padding: spacing.input.paddingHorizontal,
    backgroundColor: colors.background.secondary,
  },
  locationButtonText: {
    ...typography.styles.input,
    color: colors.text.primary,
  },
  toggleButton: {
    borderWidth: 1,
    borderColor: colors.border.secondary,
    borderRadius: spacing.input.borderRadius,
    padding: spacing.input.paddingHorizontal,
    backgroundColor: colors.background.secondary,
  },
  toggleButtonActive: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[50],
  },
  toggleButtonText: {
    ...typography.styles.input,
    color: colors.text.primary,
  },
  toggleButtonTextActive: {
    color: colors.primary[500],
  },
  checkboxButton: {
    borderWidth: 1,
    borderColor: colors.border.secondary,
    borderRadius: spacing.input.borderRadius,
    padding: spacing.input.paddingHorizontal,
    backgroundColor: colors.background.secondary,
  },
  checkboxButtonActive: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[50],
  },
  checkboxButtonText: {
    ...typography.styles.input,
    color: colors.text.primary,
  },
  checkboxButtonTextActive: {
    color: colors.primary[500],
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
  sliderContainer: {
    marginTop: spacing.sm,
  },
  sliderLabel: {
    ...typography.styles.caption,
    color: colors.text.secondary,
  },
  sliderInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  sliderInput: {
    borderWidth: 1,
    borderColor: colors.border.secondary,
    borderRadius: spacing.input.borderRadius,
    padding: spacing.input.paddingHorizontal,
    backgroundColor: colors.background.secondary,
    color: colors.text.primary,
    textAlign: 'center',
    width: 60,
    ...typography.styles.input,
  },
  sliderSeparator: {
    ...typography.styles.body,
    color: colors.text.secondary,
    marginHorizontal: spacing.sm,
  },
  rangeSliderContainer: {
    marginTop: spacing.sm,
    position: 'relative',
    height: 40,
  },
  rangeSliderTrack: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: colors.border.secondary,
    borderRadius: 2,
  },
  rangeSliderFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 4,
    backgroundColor: colors.primary[500],
    borderRadius: 2,
  },
  rangeSliderThumb: {
    position: 'absolute',
    top: -8,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.primary[500],
    borderWidth: 2,
    borderColor: colors.background.primary,
  },
  rangeSliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  rangeSliderLabel: {
    ...typography.styles.caption,
    color: colors.text.secondary,
  },
  rangeInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  rangeInputContainer: {
    width: '45%',
  },
  rangeInputLabel: {
    ...typography.styles.caption,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  rangeInput: {
    borderWidth: 1,
    borderColor: colors.border.secondary,
    borderRadius: spacing.input.borderRadius,
    padding: spacing.input.paddingHorizontal,
    backgroundColor: colors.background.secondary,
    color: colors.text.primary,
    textAlign: 'center',
    ...typography.styles.input,
  },
  distanceLabel: {
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  distanceValue: {
    ...typography.styles.caption,
    color: colors.text.secondary,
  },
  dateButton: {
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: colors.background.primary,
    borderRadius: spacing.md,
    padding: spacing.lg,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    ...typography.styles.h4,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  datePickerContainer: {
    width: '100%',
    marginBottom: spacing.md,
  },
  datePickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  datePickerLabel: {
    ...typography.styles.body,
    color: colors.text.primary,
  },
  datePickerInput: {
    borderWidth: 1,
    borderColor: colors.border.secondary,
    borderRadius: spacing.input.borderRadius,
    padding: spacing.input.paddingHorizontal,
    backgroundColor: colors.background.secondary,
    color: colors.text.primary,
    textAlign: 'center',
    width: 80,
    ...typography.styles.input,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: spacing.md,
  },
  modalButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: spacing.input.borderRadius,
  },
  modalButtonCancel: {
    backgroundColor: colors.border.secondary,
    borderColor: colors.border.secondary,
  },
  modalButtonConfirm: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
  },
  modalButtonText: {
    ...typography.styles.input,
    color: colors.text.primary,
  },
  modalButtonTextConfirm: {
    color: colors.background.primary,
  },
});
