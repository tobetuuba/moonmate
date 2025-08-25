import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { router } from 'expo-router';
import { ProfileService } from '../services/api/ProfileService';
import { UserProfile, CreateProfileFormData, PromptOption } from '../types/profile';
import { auth } from '../services/firebase';
import { completeFormSchema, validateStep } from '../utils/validationSchemas';

type FormData = CreateProfileFormData;

const INITIAL_FORM_DATA: FormData = {
  displayName: '',
  birthDate: '',
  birthTime: '',
  height: undefined,
  location: {
    city: '',
    country: 'United States',
    latitude: 0,
    longitude: 0,
  },
  profession: '',
  gender: '',
  pronouns: '',

  preferences: {
    match: {
      seeking: [],
      ageRange: { min: 18, max: 35 },
      distanceKm: 50,
      childrenPlan: [],
      intent: [],
      monogamy: false,
    },
  },

  bio: '',
  prompts: {
    'ideal-date': '',
    'life-goal': '',
    'simple-pleasure': '',
    'travel-dream': '',
    'fun-fact': '',
  },

  interests: [],

  smoking: '',
  drinking: '',
  diet: '',
  exercise: '',

  photos: [],
  profilePhotoUrl: '',

  showOrientation: true,
  showGender: true,
  incognitoMode: false,
  acceptTerms: false,
  acceptPrivacy: false,
};

export function useCreateProfileForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit: handleFormSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
    trigger,
    getValues,
    register,
    setError,
  } = useForm<FormData>({
    resolver: yupResolver(completeFormSchema as any),
    defaultValues: {
      ...INITIAL_FORM_DATA,
      // Ensure preferences.match has all required fields
      preferences: {
        match: {
          seeking: [],
          ageRange: { min: 18, max: 35 },
          distanceKm: 50,
          childrenPlan: [],
          intent: [],
        },
      },
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
    criteriaMode: 'all',
    shouldFocusError: false,
  });



  // Register nested fields for proper RHF state management
  useEffect(() => {
    // match preferences
    register('preferences.match.seeking' as const);
    register('preferences.match.ageRange.min' as const);
    register('preferences.match.ageRange.max' as const);
    register('preferences.match.distanceKm' as const);
    register('preferences.match.intent' as const);
  }, [register]);

  const formData = watch();
  
  // Debug: Log formData changes
  console.log('🔍 useCreateProfileForm - formData:', JSON.stringify(formData, null, 2));
  console.log('🔍 useCreateProfileForm - intent:', JSON.stringify(formData?.preferences?.match?.intent, null, 2));
  console.log('🔍 useCreateProfileForm - childrenPlan:', JSON.stringify(formData?.preferences?.match?.childrenPlan, null, 2));
  
  // Debug: Log nested preferences fields
  console.log('🔍 preferences.match.seeking:', JSON.stringify(getValues('preferences.match.seeking')));
  console.log('🔍 preferences.match.ageRange:', JSON.stringify(getValues('preferences.match.ageRange')));
  console.log('🔍 preferences.match.distanceKm:', JSON.stringify(getValues('preferences.match.distanceKm')));
  
  // Additional debug for seeking
  const seekingValue = getValues('preferences.match.seeking');
  console.log('🔍 seekingValue type:', typeof seekingValue, Array.isArray(seekingValue));
  console.log('🔍 seekingValue length:', seekingValue?.length);
  console.log('🔍 seekingValue content:', JSON.stringify(seekingValue, null, 2));
  
  // Sanity logs for all nested fields
  console.log('seeking =', JSON.stringify(getValues('preferences.match.seeking'), null, 2));
  console.log('ageRange =', JSON.stringify(getValues('preferences.match.ageRange'), null, 2));
  console.log('distanceKm =', JSON.stringify(getValues('preferences.match.distanceKm'), null, 2));

  const updateFormData = (field: keyof FormData, value: any) => {
    console.log('🔍 updateFormData called with:', field, JSON.stringify(value, null, 2));
    setValue(field, value, { shouldValidate: true });
  };

  const updateNestedField = (parentField: keyof FormData | string, childField: string, value: any) => {
    const path = childField ? `${parentField}.${childField}` : String(parentField);
    console.log('🔍 updateNestedField ->', path, JSON.stringify(value, null, 2));
    setValue(path as any, value, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
  };

  // Sugar functions for common nested field updates
  const setSeeking = (vals: string[]) =>
    setValue('preferences.match.seeking', vals, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
  
  const setAgeRange = (ageRange: { min: number; max: number }) =>
    setValue('preferences.match.ageRange', ageRange, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
  
  const setDistanceKm = (distance: number) =>
    setValue('preferences.match.distanceKm', distance, { shouldValidate: true, shouldDirty: true, shouldTouch: true });

  const validateCurrentStep = async (step: number, onStep2Error?: (hasError: boolean) => void): Promise<boolean> => {
    const stepFields = getStepFields(step);
    console.log('🔍 validateCurrentStep - step:', step, 'stepFields:', stepFields);
    
    if (step === 1) {
      // Step 1: Only validate seeking field, ignore intent and monogamy
      const seeking = getValues('preferences.match.seeking');
      if (!seeking || seeking.length === 0) {
        console.log('❌ Step 1 validation failed: seeking is required');
        return false;
      }
      console.log('✅ Step 1 validation passed');
      return true;
    }
    
    const result = await trigger(stepFields);
    console.log('🔍 validateCurrentStep - trigger result:', result);
    
    return result;
  };

  const getStepFields = (step: number): (keyof FormData)[] => {
    switch (step) {
      case 1:
        return ['displayName', 'birthDate', 'location', 'gender', 'preferences'];
      case 2:
        return ['preferences'];
      case 3:
        return []; // Bio is now optional
      case 4:
        return []; // Interests are optional
      case 5:
        return []; // Photos are optional for now
      case 6:
        return ['acceptTerms', 'acceptPrivacy'];
      default:
        return [];
    }
  };

  // Normalize seeking values to handle legacy data
  const normalizeSeeking = (arr: string[] = []) => arr.map(v => {
    if (v === 'men') return 'man';
    if (v === 'women') return 'woman';
    if (v === 'non-binary') return 'nonbinary';
    return v;
  });

  const onSubmit = async (data: CreateProfileFormData) => {
    try {
      setIsSubmitting(true);
      
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      // Calculate age from birthDate
      const birthDate = new Date(data.birthDate);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      const finalAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) ? age - 1 : age;

      const payload = {
        // Profile data (users/{uid})
        id: user.uid,
        displayName: data.displayName,
        birthDate: data.birthDate,
        birthTime: data.birthTime,
        location: data.location,
        gender: data.gender,
        pronouns: data.pronouns,
        bio: data.bio,
        photos: data.photos,
        profilePhotoUrl: data.profilePhotoUrl,
        interests: data.interests,
        height: data.height,
        profession: data.profession,
        lifestyle: {
          smoking: data.smoking,
          drinking: data.drinking,
          diet: data.diet,
          exercise: data.exercise,
        },
        prompts: data.prompts,
        
        // Privacy flags
        showOrientation: data.showOrientation,
        showGender: data.showGender,
        incognitoMode: data.incognitoMode,
        acceptTerms: data.acceptTerms,
        acceptPrivacy: data.acceptPrivacy,

        // Match preferences (users/{uid}/preferences/match)
        preferences: {
          match: {
            seeking: normalizeSeeking(data.preferences.match.seeking),
            ageRange: data.preferences.match.ageRange,
            distanceKm: data.preferences.match.distanceKm,
            intent: data.preferences.match.intent,
            monogamy: data.preferences.match.monogamy,
            childrenPlan: data.preferences.match.childrenPlan,
          }
        }
      };

      // Use the new atomic writer instead of the old single-writer
      await ProfileService.createUserProfileAndPrefs(payload);
      
      Alert.alert('Success!', 'Your profile has been created successfully!', [
        { text: 'OK', onPress: () => router.replace('/(tabs)') }
      ]);
    } catch (error: any) {
      console.error('Profile creation error:', error);
      
      let errorMessage = 'An error occurred while creating your profile.';
      let retryAction = 'Please try again.';
      
      // Handle specific error types
      if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network connection failed.';
        retryAction = 'Please check your internet connection and try again.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many requests.';
        retryAction = 'Please wait a moment and try again.';
      } else if (error.code === 'permission-denied') {
        errorMessage = 'Permission denied.';
        retryAction = 'Please check your account permissions.';
      } else if (error.message?.includes('timeout')) {
        errorMessage = 'Request timed out.';
        retryAction = 'Please try again.';
      } else if (error.message?.includes('photo')) {
        errorMessage = 'Photo upload failed.';
        retryAction = 'Please try uploading photos again.';
      }
      
      Alert.alert(
        'Error', 
        `${errorMessage} ${retryAction}`, 
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Retry', onPress: () => onSubmit(data) }
        ]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = handleFormSubmit(onSubmit);

  return {
    formData,
    updateFormData,
    updateNestedField,
    setValue,
    setSeeking,
    setAgeRange,
    setDistanceKm,
    validateCurrentStep,
    handleSubmit,
    isSubmitting,
    errors,
    control,
    setFieldTouched: (field: string, touched: boolean) => {
      // This is a simple implementation - you might want to enhance it
      console.log('🔍 setFieldTouched called with:', field, JSON.stringify(touched, null, 2));
    },
  };
}
