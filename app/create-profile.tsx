import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  Platform,
  KeyboardAvoidingView,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ProfileService } from '../services/api/ProfileService';
import { UserProfile } from '../types/profile';
import PersonalitySlider from '../components/PersonalitySlider';
import { auth } from '../services/firebase';
import { uploadProfilePhoto, uploadGalleryPhoto } from '../services/StorageService';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacings';
import { texts } from '../constants/texts';
import Button from '../components/Button';
import Card from '../components/Card';

interface FormData {
  displayName: string;
  birthDate: string;
  birthTime: string;
  birthPlace: {
    city: string;
    country: string;
    latitude: number;
    longitude: number;
  };
  gender: string;
  seeking: string[];
  bio: string;
  relationshipGoals: string[];
  personality: {
    empathy: number;
    openness: number;
  };
  profilePhotoUrl: string;
  photos: string[];
  location: {
    city: string;
    country: string;
    latitude: number;
    longitude: number;
  };
}

const GENDER_OPTIONS = [
  { label: 'Woman', value: 'woman' },
  { label: 'Man', value: 'man' },
  { label: 'Non-binary', value: 'nonbinary' },
  { label: 'Gender fluid', value: 'genderfluid' },
  { label: 'Other', value: 'other' },
];

const SEEKING_OPTIONS = [
  { label: 'Men', value: 'men' },
  { label: 'Women', value: 'women' },
  { label: 'Everyone', value: 'everyone' },
  { label: 'Non-binary', value: 'nonbinary' },
];

const RELATIONSHIP_GOALS = [
  { label: 'Long-term relationship', value: 'Long-term relationship' },
  { label: 'Short-term', value: 'Short-term' },
  { label: 'Friendship', value: 'Friendship' },
  { label: 'Open to explore', value: 'Open to explore' },
  { label: 'Casual dating', value: 'Casual dating' },
];

const COUNTRIES = [
  { name: 'United States', cities: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'] },
  { name: 'Canada', cities: ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Edmonton'] },
  { name: 'United Kingdom', cities: ['London', 'Manchester', 'Birmingham', 'Leeds', 'Liverpool'] },
  { name: 'Germany', cities: ['Berlin', 'Hamburg', 'Munich', 'Cologne', 'Frankfurt'] },
  { name: 'France', cities: ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice'] },
];

export default function CreateProfileScreen() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    displayName: '',
    birthDate: '',
    birthTime: '',
    birthPlace: {
      city: '',
      country: '',
      latitude: 0,
      longitude: 0,
    },
    gender: '',
    seeking: [],
    bio: '',
    relationshipGoals: [],
    personality: {
      empathy: 50,
      openness: 50,
    },
    profilePhotoUrl: '',
    photos: [],
    location: {
      city: '',
      country: '',
      latitude: 0,
      longitude: 0,
    },
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [tempSelectedDate, setTempSelectedDate] = useState(new Date());
  const [tempSelectedTime, setTempSelectedTime] = useState(new Date());
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Load existing profile data if available
    loadExistingProfile();
  }, []);

  const loadExistingProfile = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const existingProfile = await ProfileService.getUserProfile(user.uid);
      if (existingProfile) {
        console.log('Loading existing profile:', existingProfile);
        setIsEditMode(true);
        setFormData({
          displayName: existingProfile.displayName || '',
          birthDate: existingProfile.birthDate || '',
          birthTime: existingProfile.birthTime || '',
          birthPlace: existingProfile.birthPlace || {
            city: '',
            country: '',
            latitude: 0,
            longitude: 0,
          },
          gender: existingProfile.gender || '',
          seeking: existingProfile.seeking || [],
          bio: existingProfile.bio || '',
          relationshipGoals: existingProfile.relationshipGoals || [],
          personality: existingProfile.personality || {
            empathy: 50,
            openness: 50,
          },
          profilePhotoUrl: existingProfile.profilePhotoUrl || '',
          photos: existingProfile.photos || [],
          location: existingProfile.location || {
            city: '',
            country: '',
            latitude: 0,
            longitude: 0,
          },
        });
      }
    } catch (error) {
      console.error('Error loading existing profile:', error);
    }
  };

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateNestedField = (parentField: keyof FormData, childField: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parentField]: {
        ...(prev[parentField] as any),
        [childField]: value,
      },
    }));
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setTempSelectedDate(selectedDate);
    }
  };

  const handleDateConfirm = () => {
    setSelectedDate(tempSelectedDate);
    // Fix timezone issue by using local date formatting
    const year = tempSelectedDate.getFullYear();
    const month = (tempSelectedDate.getMonth() + 1).toString().padStart(2, '0');
    const day = tempSelectedDate.getDate().toString().padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    updateFormData('birthDate', formattedDate);
    setShowDatePicker(false);
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    if (selectedTime) {
      setTempSelectedTime(selectedTime);
    }
  };

  const handleTimeConfirm = () => {
    setSelectedTime(tempSelectedTime);
    const hours = tempSelectedTime.getHours().toString().padStart(2, '0');
    const minutes = tempSelectedTime.getMinutes().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}`;
    updateFormData('birthTime', timeString);
    setShowTimePicker(false);
  };

  const handleImagePicker = async (isProfilePhoto: boolean = false) => {
    try {
      // Request permissions first
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Please allow access to your photo library to upload images.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8, // Slightly higher quality
        allowsMultipleSelection: false,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        console.log('Selected image URI:', imageUri);
        console.log('Image type:', result.assets[0].type);
        console.log('Image size:', result.assets[0].fileSize, 'bytes');
        
        // Show loading indicator
        Alert.alert('Uploading...', 'Please wait while we upload your image.');
        
        try {
          if (isProfilePhoto) {
            console.log('Uploading profile photo...');
            const downloadURL = await uploadProfilePhoto(imageUri);
            console.log('Profile photo upload successful:', downloadURL);
            updateFormData('profilePhotoUrl', downloadURL);
            Alert.alert('Success', 'Profile photo uploaded successfully!');
          } else {
            if (formData.photos.length >= 5) {
              Alert.alert('Maximum photos reached', 'You can only upload up to 5 photos.');
              return;
            }
            console.log('Uploading gallery photo...');
            const downloadURL = await uploadGalleryPhoto(imageUri);
            console.log('Gallery photo upload successful:', downloadURL);
            updateFormData('photos', [...formData.photos, downloadURL]);
            Alert.alert('Success', 'Gallery photo uploaded successfully!');
          }
        } catch (uploadError) {
          console.error('Upload error:', uploadError);
          Alert.alert(
            'Upload Failed', 
            uploadError instanceof Error ? uploadError.message : 'Failed to upload image. Please try again.'
          );
        }
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };

  const removePhoto = (index: number) => {
    const newPhotos = formData.photos.filter((_, i) => i !== index);
    updateFormData('photos', newPhotos);
  };

  const toggleSeeking = (value: string) => {
    const newSeeking = formData.seeking.includes(value)
      ? formData.seeking.filter(item => item !== value)
      : [...formData.seeking, value];
    updateFormData('seeking', newSeeking);
  };

  const toggleRelationshipGoal = (value: string) => {
    const newGoals = formData.relationshipGoals.includes(value)
      ? formData.relationshipGoals.filter(item => item !== value)
      : [...formData.relationshipGoals, value];
    updateFormData('relationshipGoals', newGoals);
  };

  const validateForm = (): boolean => {
    console.log('🔍 Validating form...');
    console.log('📝 Form data for validation:', {
      displayName: formData.displayName,
      birthDate: formData.birthDate,
      gender: formData.gender,
      seeking: formData.seeking,
      relationshipGoals: formData.relationshipGoals,
      birthPlace: formData.birthPlace,
    });

    if (!formData.displayName.trim()) {
      console.log('❌ Validation failed: Display name is empty');
      Alert.alert('Error', 'Display name is required');
      return false;
    }
    if (!formData.birthDate) {
      console.log('❌ Validation failed: Birth date is empty');
      Alert.alert('Error', 'Birth date is required');
      return false;
    }
    if (!formData.gender) {
      console.log('❌ Validation failed: Gender is empty');
      Alert.alert('Error', 'Gender is required');
      return false;
    }
    if (formData.seeking.length === 0) {
      console.log('❌ Validation failed: Seeking is empty');
      Alert.alert('Error', 'Please select who you are seeking');
      return false;
    }
    if (formData.relationshipGoals.length === 0) {
      console.log('❌ Validation failed: Relationship goals is empty');
      Alert.alert('Error', 'Please select your relationship goals');
      return false;
    }
    if (!formData.birthPlace.city || !formData.birthPlace.country) {
      console.log('❌ Validation failed: Birth place is incomplete');
      Alert.alert('Error', 'Please select your birth place');
      return false;
    }
    
    console.log('✅ Form validation passed');
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      console.log('❌ Form validation failed');
      return;
    }

    setIsSubmitting(true);
    console.log('🚀 Starting profile submission...');
    console.log('📝 Form data:', JSON.stringify(formData, null, 2));

    try {
      // Calculate age from birth date
      const birthDate = new Date(formData.birthDate);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      const finalAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) ? age - 1 : age;

      console.log('👤 Calculated age:', finalAge);
      console.log('📅 Birth date:', formData.birthDate);

      // Use birth place as default location if location is not set
      const finalLocation = formData.location.city 
        ? formData.location 
        : formData.birthPlace;

      console.log('📍 Final location:', finalLocation);

      const profileData = {
        ...formData,
        age: finalAge,
        location: finalLocation,
      };

      console.log('🎯 Final profile data:', JSON.stringify(profileData, null, 2));

      if (isEditMode) {
        console.log('✏️ Updating existing profile...');
        const userId = auth.currentUser?.uid;
        console.log('👤 Current user ID:', userId);
        
        if (!userId) {
          throw new Error('User not authenticated');
        }

        await ProfileService.updateUserProfile(userId, profileData);
        console.log('✅ Profile updated successfully');
        Alert.alert('Success', 'Profile updated successfully!', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      } else {
        console.log('🆕 Creating new profile...');
        const userId = auth.currentUser?.uid;
        console.log('👤 Current user ID:', userId);
        
        if (!userId) {
          throw new Error('User not authenticated');
        }

        await ProfileService.createUserProfile(profileData);
        console.log('✅ Profile created successfully');
        Alert.alert('Success', 'Profile created successfully!', [
          { text: 'OK', onPress: () => router.replace('/(tabs)/index') }
        ]);
      }
    } catch (error) {
      console.error('❌ Profile submission error:', error);
      console.error('❌ Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        formData: formData,
        isEditMode: isEditMode,
        userId: auth.currentUser?.uid,
      });
      Alert.alert('Error', `Failed to ${isEditMode ? 'update' : 'create'} profile. Please try again.`);
    } finally {
      setIsSubmitting(false);
      console.log('🏁 Profile submission completed');
    }
  };

  const getMockCoordinates = (city: string, country: string) => {
    // Mock coordinates for demo purposes
    const mockCoords: { [key: string]: { lat: number; lng: number } } = {
      'New York': { lat: 40.7128, lng: -74.0060 },
      'Los Angeles': { lat: 34.0522, lng: -118.2437 },
      'London': { lat: 51.5074, lng: -0.1278 },
      'Paris': { lat: 48.8566, lng: 2.3522 },
      'Berlin': { lat: 52.5200, lng: 13.4050 },
    };
    
    return mockCoords[city] || { lat: 0, lng: 0 };
  };

  const handleSliderChange = (trait: 'empathy' | 'openness', value: number) => {
    updateFormData('personality', {
      ...formData.personality,
      [trait]: Math.max(0, Math.min(100, value)),
    });
  };



  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ flex: 1 }}>
          <LinearGradient
            colors={colors.gradients.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerGradient}
          >
            <View style={styles.header}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => router.back()}
              >
                <Ionicons name="arrow-back" size={24} color={colors.text.white} />
              </TouchableOpacity>
              <View style={styles.headerContent}>
                <Text style={styles.title}>
                  {isEditMode ? texts.profile.editTitle : texts.profile.createTitle}
                </Text>
                <Text style={styles.subtitle}>
                  {isEditMode ? texts.profile.editSubtitle : texts.profile.createSubtitle}
                </Text>
              </View>
            </View>
          </LinearGradient>

          <Animated.View
            style={[
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Display Name */}
            <Card variant="elevated" padding="medium" style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="person-circle" size={24} color={colors.primary[500]} />
                <Text style={styles.sectionTitle}>Display Name *</Text>
              </View>
              <TextInput
                style={styles.textInput}
                value={formData.displayName}
                onChangeText={(text) => updateFormData('displayName', text)}
                placeholder="✨ What should we call you?"
                maxLength={50}
                placeholderTextColor={colors.text.tertiary}
              />
            </Card>

            {/* Birth Date */}
            <Card variant="elevated" padding="medium" style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="calendar" size={24} color={colors.secondary[500]} />
                <Text style={styles.sectionTitle}>Birth Date *</Text>
              </View>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => {
                  // If we have a birth date, parse it and set as selected date
                  if (formData.birthDate) {
                    const [year, month, day] = formData.birthDate.split('-').map(Number);
                    // Create date in local timezone to avoid timezone issues
                    const date = new Date(year, month - 1, day, 12, 0, 0); // Use noon to avoid timezone edge cases
                    setSelectedDate(date);
                    setTempSelectedDate(date);
                  } else {
                    setTempSelectedDate(selectedDate);
                  }
                  setShowDatePicker(true);
                }}
              >
                <Text style={styles.dateButtonText}>
                  {formData.birthDate || '🎂 When were you born?'}
                </Text>
                <Ionicons name="calendar-outline" size={20} color={colors.primary[500]} />
              </TouchableOpacity>
            </Card>

            {/* Birth Time */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="time" size={24} color="#8B5FBF" />
                <Text style={styles.sectionTitle}>Birth Time (Optional)</Text>
              </View>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => {
                  // Always start with a fresh time
                  const freshTime = new Date();
                  freshTime.setHours(12, 30, 0, 0); // Default to 12:30 PM
                  setSelectedTime(freshTime);
                  setTempSelectedTime(freshTime);
                  setShowTimePicker(true);
                }}
              >
                <Text style={styles.dateButtonText}>
                  {formData.birthTime || '⏰ What time were you born?'}
                </Text>
                <Ionicons name="time-outline" size={20} color="#8B5FBF" />
              </TouchableOpacity>
            </View>

            {/* Birth Place */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="globe" size={24} color="#FF6B9D" />
                <Text style={styles.sectionTitle}>Birth Place</Text>
              </View>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowCountryPicker(true)}
              >
                <Text style={styles.dateButtonText}>
                  {formData.birthPlace.country || '🌍 Where were you born?'}
                </Text>
                <Ionicons name="globe-outline" size={20} color="#8B5FBF" />
              </TouchableOpacity>
              {formData.birthPlace.country && (
                <TouchableOpacity
                  style={[styles.dateButton, styles.cityButton]}
                  onPress={() => setShowCityPicker(true)}
                >
                  <Text style={styles.dateButtonText}>
                    {formData.birthPlace.city || '🏙️ Which city?'}
                  </Text>
                  <Ionicons name="location-outline" size={20} color="#8B5FBF" />
                </TouchableOpacity>
              )}
            </View>

            {/* Gender */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="heart" size={24} color="#C44569" />
                <Text style={styles.sectionTitle}>Gender *</Text>
              </View>
              <View style={styles.optionsContainer}>
                {GENDER_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.optionButton,
                      formData.gender === option.value && styles.optionButtonSelected,
                    ]}
                    onPress={() => updateFormData('gender', option.value)}
                  >
                    <Text style={[
                      styles.optionButtonText,
                      formData.gender === option.value && styles.optionButtonTextSelected,
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Seeking */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="search" size={24} color="#8B5FBF" />
                <Text style={styles.sectionTitle}>Seeking *</Text>
              </View>
              <View style={styles.optionsContainer}>
                {SEEKING_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.optionButton,
                      formData.seeking.includes(option.value) && styles.optionButtonSelected,
                    ]}
                    onPress={() => toggleSeeking(option.value)}
                  >
                    <Text style={[
                      styles.optionButtonText,
                      formData.seeking.includes(option.value) && styles.optionButtonTextSelected,
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Bio */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="chatbubble-ellipses" size={24} color="#FF6B9D" />
                <Text style={styles.sectionTitle}>Bio (Optional)</Text>
              </View>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={formData.bio}
                onChangeText={(text) => updateFormData('bio', text)}
                placeholder="💬 Tell us your story... What makes you unique?"
                multiline
                numberOfLines={4}
                maxLength={500}
              />
            </View>

            {/* Relationship Goals */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="star" size={24} color="#C44569" />
                <Text style={styles.sectionTitle}>Relationship Goals</Text>
              </View>
              <View style={styles.optionsContainer}>
                {RELATIONSHIP_GOALS.map((goal) => (
                  <TouchableOpacity
                    key={goal.value}
                    style={[
                      styles.optionButton,
                      formData.relationshipGoals.includes(goal.value) && styles.optionButtonSelected,
                    ]}
                    onPress={() => toggleRelationshipGoal(goal.value)}
                  >
                    <Text style={[
                      styles.optionButtonText,
                      formData.relationshipGoals.includes(goal.value) && styles.optionButtonTextSelected,
                    ]}>
                      {goal.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Personality */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="bulb" size={24} color="#8B5FBF" />
                <Text style={styles.sectionTitle}>Personality</Text>
              </View>
              
              <PersonalitySlider
                label="Empathy"
                value={formData.personality.empathy}
                onValueChange={(value) => handleSliderChange('empathy', value)}
              />

              <PersonalitySlider
                label="Openness"
                value={formData.personality.openness}
                onValueChange={(value) => handleSliderChange('openness', value)}
              />
            </View>

            {/* Profile Photo */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="camera" size={24} color="#FF6B9D" />
                <Text style={styles.sectionTitle}>Profile Photo (Optional)</Text>
              </View>
              <TouchableOpacity
                style={styles.photoUploadButton}
                onPress={() => handleImagePicker(true)}
              >
                {formData.profilePhotoUrl ? (
                  <Image source={{ uri: formData.profilePhotoUrl }} style={styles.profilePhoto} />
                ) : (
                  <View style={styles.photoPlaceholder}>
                    <Ionicons name="camera-outline" size={40} color="#8B5FBF" />
                    <Text style={styles.photoPlaceholderText}>📸 Add Your Best Photo!</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* Gallery Photos */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="images" size={24} color="#C44569" />
                <Text style={styles.sectionTitle}>Gallery Photos (Max 5)</Text>
              </View>
              <View style={styles.galleryContainer}>
                {formData.photos.map((photo, index) => (
                  <View key={index} style={styles.galleryPhotoContainer}>
                    <Image source={{ uri: photo }} style={styles.galleryPhoto} />
                    <TouchableOpacity
                      style={styles.removePhotoButton}
                      onPress={() => removePhoto(index)}
                    >
                      <Ionicons name="close-circle" size={24} color="#ff4444" />
                    </TouchableOpacity>
                  </View>
                ))}
                {formData.photos.length < 5 && (
                  <TouchableOpacity
                    style={styles.addPhotoButton}
                    onPress={() => handleImagePicker(false)}
                  >
                    <Ionicons name="add" size={30} color="#8B5FBF" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Location */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="location" size={24} color="#8B5FBF" />
                <Text style={styles.sectionTitle}>Current Location (Optional)</Text>
              </View>
              <Text style={styles.locationNote}>
                🌍 Will default to birth place if not specified
              </Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => {
                  // For demo, copy birth place to location
                  updateFormData('location', { ...formData.birthPlace });
                  Alert.alert('Location Set', 'Using birth place as current location');
                }}
              >
                <Text style={styles.dateButtonText}>
                  📍 Use Birth Place as Location
                </Text>
                <Ionicons name="location-outline" size={20} color="#8B5FBF" />
              </TouchableOpacity>
            </View>


          </Animated.View>
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.submitContainer}>
        <Button
          variant="primary"
          title={
            isSubmitting 
              ? (isEditMode ? '✨ Updating Profile...' : '✨ Creating Profile...')
              : (isEditMode ? '🚀 Update Profile' : '🚀 Create Profile')
          }
          onPress={handleSubmit}
          disabled={isSubmitting}
          loading={isSubmitting}
          style={styles.submitButton}
        />
      </View>

      {/* Date Picker */}
      {showDatePicker && (
        <>
          {Platform.OS === 'ios' ? (
            <View style={styles.pickerOverlay}>
              <View style={styles.pickerContainer}>
                <View style={styles.pickerHeader}>
                  <Text style={styles.pickerTitle}>Select Birth Date</Text>
                  <TouchableOpacity
                    style={styles.pickerCloseButton}
                    onPress={() => setShowDatePicker(false)}
                  >
                    <Ionicons name="close" size={24} color="#FF6B9D" />
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  value={tempSelectedDate}
                  mode="date"
                  display="spinner"
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                  style={styles.dateTimePicker}
                />
                <View style={styles.pickerButtonContainer}>
                  <TouchableOpacity
                    style={styles.pickerCancelButton}
                    onPress={() => setShowDatePicker(false)}
                  >
                    <Text style={styles.pickerCancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.pickerConfirmButton}
                    onPress={handleDateConfirm}
                  >
                    <Text style={styles.pickerConfirmButtonText}>OK</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ) : (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  setSelectedDate(selectedDate);
                  // Fix timezone issue by using local date formatting
                  const year = selectedDate.getFullYear();
                  const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
                  const day = selectedDate.getDate().toString().padStart(2, '0');
                  const formattedDate = `${year}-${month}-${day}`;
                  updateFormData('birthDate', formattedDate);
                }
              }}
              maximumDate={new Date()}
            />
          )}
        </>
      )}

      {/* Time Picker */}
      {showTimePicker && (
        <>
          {Platform.OS === 'ios' ? (
            <View style={styles.pickerOverlay}>
              <View style={styles.pickerContainer}>
                <View style={styles.pickerHeader}>
                  <Text style={styles.pickerTitle}>Select Birth Time</Text>
                  <TouchableOpacity
                    style={styles.pickerCloseButton}
                    onPress={() => setShowTimePicker(false)}
                  >
                    <Ionicons name="close" size={24} color="#FF6B9D" />
                  </TouchableOpacity>
                </View>
                <View style={styles.timePickerContainer}>
                  <Text style={styles.timePickerLabel}>Select Time:</Text>
                  <View style={styles.timeInputRow}>
                    <TouchableOpacity
                      style={styles.timeButton}
                      onPress={() => {
                        const hours = (tempSelectedTime.getHours() + 1) % 24;
                        const newTime = new Date(tempSelectedTime);
                        newTime.setHours(hours);
                        setTempSelectedTime(newTime);
                      }}
                    >
                      <Text style={styles.timeButtonText}>+</Text>
                    </TouchableOpacity>
                    <Text style={styles.timeDisplay}>
                      {tempSelectedTime.getHours().toString().padStart(2, '0')}:{tempSelectedTime.getMinutes().toString().padStart(2, '0')}
                    </Text>
                    <TouchableOpacity
                      style={styles.timeButton}
                      onPress={() => {
                        const hours = (tempSelectedTime.getHours() - 1 + 24) % 24;
                        const newTime = new Date(tempSelectedTime);
                        newTime.setHours(hours);
                        setTempSelectedTime(newTime);
                      }}
                    >
                      <Text style={styles.timeButtonText}>-</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.timeInputRow}>
                    <TouchableOpacity
                      style={styles.timeButton}
                      onPress={() => {
                        const minutes = (tempSelectedTime.getMinutes() + 15) % 60;
                        const newTime = new Date(tempSelectedTime);
                        newTime.setMinutes(minutes);
                        setTempSelectedTime(newTime);
                      }}
                    >
                      <Text style={styles.timeButtonText}>+15min</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.timeButton}
                      onPress={() => {
                        const minutes = (tempSelectedTime.getMinutes() - 15 + 60) % 60;
                        const newTime = new Date(tempSelectedTime);
                        newTime.setMinutes(minutes);
                        setTempSelectedTime(newTime);
                      }}
                    >
                      <Text style={styles.timeButtonText}>-15min</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.pickerButtonContainer}>
                  <TouchableOpacity
                    style={styles.pickerCancelButton}
                    onPress={() => setShowTimePicker(false)}
                  >
                    <Text style={styles.pickerCancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.pickerConfirmButton}
                    onPress={handleTimeConfirm}
                  >
                    <Text style={styles.pickerConfirmButtonText}>OK</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ) : (
            <DateTimePicker
              value={tempSelectedTime}
              mode="time"
              display="default"
              onChange={(event, selectedTime) => {
                setShowTimePicker(false);
                if (selectedTime) {
                  setSelectedTime(selectedTime);
                  setTempSelectedTime(selectedTime);
                  const hours = selectedTime.getHours().toString().padStart(2, '0');
                  const minutes = selectedTime.getMinutes().toString().padStart(2, '0');
                  const timeString = `${hours}:${minutes}`;
                  updateFormData('birthTime', timeString);
                }
              }}
            />
          )}
        </>
      )}

      {/* Country Picker Modal */}
      {showCountryPicker && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Country</Text>
            <ScrollView style={styles.modalScrollView}>
              {COUNTRIES.map((country) => (
                <TouchableOpacity
                  key={country.name}
                  style={styles.modalOption}
                  onPress={() => {
                    updateNestedField('birthPlace', 'country', country.name);
                    updateNestedField('birthPlace', 'city', '');
                    setShowCountryPicker(false);
                  }}
                >
                  <Text style={styles.modalOptionText}>{country.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowCountryPicker(false)}
            >
              <Text style={styles.modalCloseButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* City Picker Modal */}
      {showCityPicker && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select City</Text>
            <ScrollView style={styles.modalScrollView}>
              {COUNTRIES.find(c => c.name === formData.birthPlace.country)?.cities.map((city) => (
                <TouchableOpacity
                  key={city}
                  style={styles.modalOption}
                  onPress={() => {
                    updateNestedField('birthPlace', 'city', city);
                    const coords = getMockCoordinates(city, formData.birthPlace.country);
                    updateNestedField('birthPlace', 'latitude', coords.lat);
                    updateNestedField('birthPlace', 'longitude', coords.lng);
                    setShowCityPicker(false);
                  }}
                >
                  <Text style={styles.modalOptionText}>{city}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowCityPicker(false)}
            >
              <Text style={styles.modalCloseButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },

  keyboardAvoidingView: {
    flex: 1,
  },
  headerGradient: {
    width: '100%',
    paddingTop: 50,
    paddingBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 8,
    zIndex: 10,
  },
  headerContent: {
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    minHeight: '100%',
    paddingBottom: 100,
  },
  section: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    ...typography.styles.h3,
    color: colors.text.primary,
    marginLeft: spacing.sm,
  },
  textInput: {
    borderWidth: 2,
    borderColor: colors.border.secondary,
    borderRadius: spacing.md,
    padding: spacing.md,
    ...typography.styles.body,
    backgroundColor: colors.background.secondary,
    color: colors.text.primary,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  dateButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F3F4F6',
    borderRadius: 16,
    padding: 16,
    backgroundColor: '#fff',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  cityButton: {
    marginTop: 12,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#F3F4F6',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  optionButtonSelected: {
    backgroundColor: '#FF6B9D',
    borderColor: '#FF6B9D',
    shadowColor: '#FF6B9D',
    shadowOpacity: 0.3,
  },
  optionButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  optionButtonTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  photoUploadButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoPlaceholder: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FF6B9D',
    borderStyle: 'dashed',
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  photoPlaceholderText: {
    marginTop: 12,
    fontSize: 14,
    color: '#8B5FBF',
    textAlign: 'center',
    fontWeight: '600',
  },
  profilePhoto: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: '#FF6B9D',
  },
  galleryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  galleryPhotoContainer: {
    position: 'relative',
  },
  galleryPhoto: {
    width: 90,
    height: 90,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FF6B9D',
  },
  removePhotoButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  addPhotoButton: {
    width: 90,
    height: 90,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    borderWidth: 3,
    borderColor: '#FF6B9D',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  locationNote: {
    fontSize: 14,
    color: '#8B5FBF',
    marginBottom: 12,
    fontStyle: 'italic',
    fontWeight: '500',
  },
  submitContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border.primary,
    shadowColor: colors.text.inverse,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  submitButton: {
    borderRadius: spacing.button.borderRadius,
    overflow: 'hidden',
    shadowColor: colors.primary[500],
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  submitButtonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '85%',
    maxHeight: '70%',
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalScrollView: {
    maxHeight: 300,
  },
  modalOption: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  modalCloseButton: {
    marginTop: 20,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
  },
  modalCloseButtonText: {
    fontSize: 16,
    color: '#FF6B9D',
    fontWeight: 'bold',
  },
  pickerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  pickerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  pickerCloseButton: {
    padding: 5,
  },
  dateTimePicker: {
    height: 200,
    width: '100%',
  },
  timePickerContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  timePickerLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 15,
  },
  timeInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeInput: {
    borderWidth: 2,
    borderColor: '#FF6B9D',
    borderRadius: 12,
    padding: 15,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    width: 80,
    backgroundColor: '#fff',
    color: '#1a1a1a',
  },
  timeSeparator: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginHorizontal: 10,
  },
  timeButton: {
    backgroundColor: '#FF6B9D',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 10,
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  timeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  timeDisplay: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginHorizontal: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FF6B9D',
  },
  pickerButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 12,
  },
  pickerCancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  pickerCancelButtonText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
  },
  pickerConfirmButton: {
    flex: 1,
    backgroundColor: '#FF6B9D',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  pickerConfirmButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
}); 