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
  Dimensions,
} from 'react-native';
import { Slider } from '@miblanchard/react-native-slider';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import * as Location from 'expo-location';
import CityPickerModal from '../CityPickerModal';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacings';

export default function Step1BasicInfo({
  formData,
  updateFormData,
  updateNestedField,
  errors,
  touched,
  setFieldTouched,
}: {
  formData: {
    displayName: string;
    birthDate: string | null;
    birthTime: string | null;
    location: { city: string; country: string; latitude: number; longitude: number } | null;
    gender: string;
    pronouns: string[];
    bio: string;
    photos: string[];
    profilePhotoUrl: string;
    interests: string[];
    lifestyle: {
      smoking: string | null;
      drinking: string | null;
      diet: string | null;
      exercise: string | null;
    };
    prompts: Record<string, any>;
    seeking: string[];
    ageRange: { min: number; max: number };
    maxDistance: number;
    relationshipType: string | null;
    monogamy: boolean | null;
    childrenPlan: string | null;
    showOrientation: boolean;
    showGender: boolean;
  };
  updateFormData: (key: string, value: any) => void;
  updateNestedField: (parentKey: string, childKey: string, value: any) => void;
  errors: any;
  touched: any;
  setFieldTouched: (field: string, touched: boolean) => void;
}) {
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

  // Location-related state
  const [isLocating, setIsLocating] = useState(false);
  const [showCityPicker, setShowCityPicker] = useState(false);
  
  // Age slider width state
  const [ageSliderWidth, setAgeSliderWidth] = useState(0);



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
    
    // Create the date and check age
    const newDate = new Date(year, month - 1, day);
    const today = new Date();
    const age = today.getFullYear() - newDate.getFullYear();
    const monthDiff = today.getMonth() - newDate.getMonth();
    const finalAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < newDate.getDate()) ? age - 1 : age;
    
    if (finalAge < 18) {
      Alert.alert('Age Restriction', 'You must be at least 18 years old to use this app.');
      return;
    }
    
    setTempDate(newDate);
    
    const yearStr = String(year);
    const monthStr = String(month).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const formattedDate = `${yearStr}-${monthStr}-${dayStr}`;
    updateFormData('birthDate', formattedDate);
    setFieldTouched('birthDate', true);
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
    setFieldTouched('birthTime', true);
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

  // Location functions
  const requestLocationPermission = async (): Promise<boolean> => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  };

  const getCurrentLocation = async (): Promise<Location.LocationObject | null> => {
    try {
      // First try to get last known position
      const lastKnown = await Location.getLastKnownPositionAsync({
        maxAge: 60000, // 1 minute
      });
      
      if (lastKnown) {
        return lastKnown;
      }
      
      // Fallback to current position with balanced accuracy
      const current = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 10000, // 10 seconds
        distanceInterval: 100, // 100 meters
      });
      
      return current;
    } catch (error) {
      console.error('Error getting location:', error);
      return null;
    }
  };

  const reverseGeocode = async (latitude: number, longitude: number): Promise<{ city: string; region?: string; country?: string } | null> => {
    try {
      const results = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      
      if (results.length > 0) {
        const result = results[0];
        return {
          city: result.city || result.region || 'Unknown City',
          region: result.region || undefined,
          country: result.country || undefined,
        };
      }
      return null;
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      return null;
    }
  };

  const handleLocationPress = async () => {
    if (isLocating) return;
    
    setIsLocating(true);
    
    try {
      const hasPermission = await requestLocationPermission();
      
      if (!hasPermission) {
        Alert.alert(
          'Location Permission Denied',
          'Please enable location access in your device settings or select a city manually.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Select Manually', onPress: () => setShowCityPicker(true) },
          ]
        );
        return;
      }
      
      const location = await getCurrentLocation();
      
      if (!location) {
        Alert.alert(
          'Location Error',
          'Unable to get your current location. Please try again or select a city manually.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Select Manually', onPress: () => setShowCityPicker(true) },
          ]
        );
        return;
      }
      
      // Round coordinates to 3 decimal places (~100m precision)
      const roundedLat = Math.round(location.coords.latitude * 1000) / 1000;
      const roundedLng = Math.round(location.coords.longitude * 1000) / 1000;
      
      // Get city and country info
      const locationInfo = await reverseGeocode(roundedLat, roundedLng);
      
      if (locationInfo) {
        updateFormData('location', {
          city: locationInfo.city,
          country: locationInfo.country || 'Unknown',
          latitude: roundedLat,
          longitude: roundedLng,
        });
      } else {
        // Fallback to coordinates if city not found
        updateFormData('location', {
          city: `Unknown City (${roundedLat.toFixed(3)}, ${roundedLng.toFixed(3)})`,
          country: 'Unknown',
          latitude: roundedLat,
          longitude: roundedLng,
        });
      }
      
      setFieldTouched('location', true);
      
    } catch (error) {
      console.error('Location error:', error);
      Alert.alert(
        'Location Error',
        'An error occurred while getting your location. Please try again or select a city manually.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Select Manually', onPress: () => setShowCityPicker(true) },
        ]
      );
    } finally {
      setIsLocating(false);
    }
  };

  const handleCitySelect = (city: string) => {
    // For manual city selection, we'll use default coordinates
    // In a real app, you might want to geocode the city name to get coordinates
    updateFormData('location', {
      city: city,
      country: 'Unknown', // Default country for manual selection
      latitude: 0, // Default coordinates
      longitude: 0,
    });
    setFieldTouched('location', true);
    setShowCityPicker(false);
  };

  const isLocationValid = (location: any): boolean => {
    return location && 
           location.city && 
           location.city.trim() !== '' && 
           location.country && 
           location.country.trim() !== '' &&
           (location.latitude !== 0 || location.longitude !== 0);
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
            style={[
              styles.textInput,
              touched?.displayName && errors?.displayName && styles.inputError
            ]}
            value={formData.displayName}
            onChangeText={(text) => updateFormData('displayName', text)}
            onBlur={() => setFieldTouched('displayName', true)}
            placeholder="Enter your display name"
            placeholderTextColor={colors.text.tertiary}
          />
          {touched?.displayName && errors?.displayName && (
            <Text style={styles.errorText}>
              {typeof errors.displayName === 'string' ? errors.displayName : 'This field is required'}
            </Text>
          )}
        </View>

        {/* Gender Selection */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Gender *</Text>
          <Text style={styles.inputSubtitle}>
            How do you identify?
          </Text>
          <View style={[
            styles.optionsGrid,
            touched?.gender && errors?.gender && styles.optionGridError
          ]}>
            {['woman', 'man', 'non-binary', 'other'].map((gender) => (
              <TouchableOpacity
                key={gender}
                style={[
                  styles.optionChip,
                  formData.gender === gender && styles.optionChipSelected,
                ]}
                onPress={() => {
                  updateFormData('gender', gender);
                  setFieldTouched('gender', true);
                }}
              >
                <Text style={[
                  styles.optionChipText,
                  formData.gender === gender && styles.optionChipTextSelected,
                ]}>
                  {gender.charAt(0).toUpperCase() + gender.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {touched?.gender && errors?.gender && (
            <Text style={styles.errorText}>
              {typeof errors.gender === 'string' ? errors.gender : 'Please select your gender'}
            </Text>
          )}
        </View>

        {/* Birth Date */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Birth Date *</Text>
          <TouchableOpacity 
            style={[
              styles.dateButton,
              touched?.birthDate && errors?.birthDate && styles.inputError
            ]}
            onPress={() => {
              setFieldTouched('birthDate', true);
              openDatePicker();
            }}
          >
            <Text style={styles.dateButtonText}>
              {formatDate(formData.birthDate)}
            </Text>
          </TouchableOpacity>
          {touched?.birthDate && errors?.birthDate && (
            <Text style={styles.errorText}>
              {typeof errors.birthDate === 'string' ? errors.birthDate : 'Please select your birth date'}
            </Text>
          )}
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
          <TouchableOpacity 
            style={[
              styles.locationButton,
              touched?.location && !isLocationValid(formData.location) && styles.inputError
            ]}
            onPress={() => {
              setFieldTouched('location', true);
              handleLocationPress();
            }}
            disabled={isLocating}
          >
            <Text style={styles.locationButtonText}>
              {isLocating 
                ? 'Locating...' 
                : formData.location && isLocationValid(formData.location)
                  ? `${formData.location.city}, ${formData.location.country} • ${formData.location.latitude.toFixed(3)}, ${formData.location.longitude.toFixed(3)}`
                  : 'Select Location'
              }
            </Text>
          </TouchableOpacity>
          
          {/* Manual city selection option */}
          {!isLocating && (
            <TouchableOpacity 
              style={styles.manualLocationButton}
              onPress={() => {
                setFieldTouched('location', true);
                setShowCityPicker(true);
              }}
            >
              <Text style={styles.manualLocationButtonText}>
                Or select city manually
              </Text>
            </TouchableOpacity>
          )}
          
          {touched?.location && !isLocationValid(formData.location) && (
            <Text style={styles.errorText}>
              Please select a valid location
            </Text>
          )}
        </View>

        {/* Bio */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Bio</Text>
          <Text style={styles.inputSubtitle}>
            Tell potential matches about yourself (optional)
          </Text>
          <TextInput
            style={styles.textInput}
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

          {/* Seeking Selection */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Seeking *</Text>
            <Text style={styles.inputSubtitle}>
              Select who you're interested in meeting
            </Text>
            <View style={[
              styles.optionsGrid,
              touched?.seeking && errors?.seeking && styles.optionGridError
            ]}>
              {['women', 'men', 'non-binary', 'everyone'].map((seeking) => (
                <TouchableOpacity
                  key={seeking}
                  style={[
                    styles.optionChip,
                    formData.seeking.includes(seeking) && styles.optionChipSelected,
                  ]}
                  onPress={() => {
                    const newSeeking = formData.seeking.includes(seeking)
                      ? formData.seeking.filter((s: string) => s !== seeking)
                      : [...formData.seeking, seeking];
                    updateFormData('seeking', newSeeking);
                    setFieldTouched('seeking', true);
                  }}
                >
                  <Text style={[
                    styles.optionChipText,
                    formData.seeking.includes(seeking) && styles.optionChipTextSelected,
                  ]}>
                    {seeking.charAt(0).toUpperCase() + seeking.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {touched?.seeking && errors?.seeking && (
              <Text style={styles.errorText}>
                {typeof errors.seeking === 'string' ? errors.seeking : 'Please select who you are seeking'}
              </Text>
            )}
          </View>

          {/* Age Range Slider */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Age Range</Text>
            <Text style={styles.inputSubtitle}>
              Select your preferred age range for matches
            </Text>
            
            {/* Working Age Range Slider */}
            <View style={styles.ageSliderContainer}>
              <View 
                style={styles.ageSliderWrapper}
                onLayout={(e) => setAgeSliderWidth(e.nativeEvent.layout.width)}
              >
                <MultiSlider
                  values={[formData.ageRange?.min ?? 25, formData.ageRange?.max ?? 35]}
                  min={18}
                  max={60}
                  step={1}
                  sliderLength={ageSliderWidth}
                  allowOverlap={false}
                  minMarkerOverlapDistance={8}
                  onValuesChangeStart={() => setScrollEnabled(false)}
                  onValuesChange={(values) => {
                    const [min, max] = values;
                    updateFormData('ageRange', { min, max });
                  }}
                  onValuesChangeFinish={() => setScrollEnabled(true)}
                  containerStyle={{ 
                    width: '100%', 
                    paddingHorizontal: 0, 
                    marginHorizontal: 0 
                  }}
                  trackStyle={{ height: 4 }}
                  selectedStyle={{ backgroundColor: colors.primary[500] }}
                  unselectedStyle={{ backgroundColor: colors.border.secondary }}
                  markerStyle={{ 
                    width: 20, 
                    height: 20, 
                    borderRadius: 10, 
                    borderWidth: 2, 
                    borderColor: colors.background.primary,
                    backgroundColor: colors.primary[500] 
                  }}
                  pressedMarkerStyle={{ 
                    width: 24, 
                    height: 24, 
                    borderRadius: 12,
                    backgroundColor: colors.primary[600]
                  }}
                />
              </View>
              
              {/* Age range labels positioned at slider ends */}
              <View style={styles.ageSliderLabels}>
                <Text style={styles.ageSliderLabel}>18</Text>
                <Text style={styles.ageSliderLabel}>60</Text>
              </View>
            </View>
            
            <View style={styles.rangeInputs}>
              <View style={styles.rangeInputContainer}>
                <Text style={styles.rangeInputLabel}>Min Age</Text>
                <View style={styles.ageValueBox}>
                  <Text style={styles.ageValueText}>
                    {formData.ageRange?.min || 18}
                  </Text>
                </View>
              </View>
              <View style={styles.rangeInputContainer}>
                <Text style={styles.rangeInputLabel}>Max Age</Text>
                <View style={styles.ageValueBox}>
                  <Text style={styles.ageValueText}>
                    {formData.ageRange?.max || 35}
                  </Text>
                </View>
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
              onValueChange={(v: number | number[]) => {
                const raw = Array.isArray(v) ? v[0] : v;
                setLocalDistance(Math.round(raw));
              }}
              onSlidingComplete={(v: number | number[]) => {
                const raw = Array.isArray(v) ? v[0] : v;
                setScrollEnabled(true);
                setLocalDistance(null);
                updateFormData('maxDistance', Math.round(raw));
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

      {/* City Picker Modal */}
      <CityPickerModal
        visible={showCityPicker}
        onClose={() => setShowCityPicker(false)}
        onConfirm={handleCitySelect}
        currentCity={formData.location?.city || ''}
        title="Select City"
      />
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
  manualLocationButton: {
    marginTop: spacing.sm,
    alignSelf: 'center',
  },
  manualLocationButtonText: {
    ...typography.styles.caption,
    color: colors.primary[500],
    textDecorationLine: 'underline',
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
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: spacing.sm,
    marginTop: spacing.sm,
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
  ageSliderContainer: {
    marginTop: spacing.sm,
    width: '100%',
    alignSelf: 'stretch',
    marginHorizontal: 0,
    paddingHorizontal: 0,
  },
  ageSliderWrapper: {
    width: '100%',
    alignSelf: 'stretch',
  },
  ageSliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: spacing.xs,
    alignSelf: 'stretch',
  },
  ageSliderLabel: {
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
  ageValueBox: {
    borderWidth: 1,
    borderColor: colors.border.secondary,
    borderRadius: spacing.input.borderRadius,
    padding: spacing.input.paddingHorizontal,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ageValueText: {
    ...typography.styles.input,
    color: colors.text.primary,
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
  optionChip: {
    borderWidth: 1,
    borderColor: colors.border.secondary,
    borderRadius: spacing.input.borderRadius,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.background.secondary,
  },
  optionChipSelected: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[50],
  },
  optionChipText: {
    ...typography.styles.input,
    color: colors.text.primary,
  },
  optionChipTextSelected: {
    color: colors.primary[500],
  },
  inputError: {
    borderColor: colors.accent.error,
    borderWidth: 1,
  },
  errorText: {
    color: colors.accent.error,
    fontSize: 12,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
});
