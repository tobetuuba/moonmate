import { useState } from 'react';
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
  customGender: '',
  pronouns: '',
  customPronouns: '',
  seeking: [],
  customSeeking: '',
  ageRange: {
    min: 18,
    max: 35,
  },
  maxDistance: 50,

  relationshipType: [],
  monogamy: true,
  childrenPlan: [],
  childrenPlanDetails: '',

  bio: '',
  prompts: {
    'ideal-date': '',
    'life-goal': '',
    'simple-pleasure': '',
    'travel-dream': '',
    'fun-fact': '',
  },

  interests: [],
  customInterests: [],
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
  } = useForm<FormData>({
    resolver: yupResolver(completeFormSchema as any),
    defaultValues: INITIAL_FORM_DATA,
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const formData = watch();
  
  // Debug: Log formData changes
  console.log('🔍 useCreateProfileForm - formData:', formData);
  console.log('🔍 useCreateProfileForm - relationshipType:', formData?.relationshipType);
  console.log('🔍 useCreateProfileForm - childrenPlan:', formData?.childrenPlan);

  const updateFormData = (field: keyof FormData, value: any) => {
    console.log('🔍 updateFormData called with:', field, value);
    setValue(field, value, { shouldValidate: true });
  };

  const updateNestedField = (parentField: keyof FormData, childField: string, value: any) => {
    const currentValue = getValues(parentField) as any;
    setValue(parentField, {
      ...currentValue,
      [childField]: value,
    }, { shouldValidate: true });
  };

  const validateCurrentStep = async (step: number): Promise<boolean> => {
    const stepFields = getStepFields(step);
    const result = await trigger(stepFields);
    return result;
  };

  const getStepFields = (step: number): (keyof FormData)[] => {
    switch (step) {
      case 1:
        return ['displayName', 'birthDate', 'location', 'gender', 'seeking'];
      case 2:
        return ['relationshipType']; // Only relationshipType is required
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
        id: user.uid,
        displayName: data.displayName,
        birthDate: data.birthDate,
        birthTime: data.birthTime,
        location: data.location,
        gender: data.gender,
        pronouns: data.pronouns,
        customGender: data.customGender,
        customPronouns: data.customPronouns,
        customSeeking: data.customSeeking,
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
        customInterests: data.customInterests,
        // preferences (the service will split & map)
        seeking: data.seeking,
        ageRange: data.ageRange,
        maxDistance: data.maxDistance,
        relationshipType: data.relationshipType,
        monogamy: data.monogamy,
        childrenPlan: data.childrenPlan,
        childrenPlanDetails: data.childrenPlanDetails,
        // flags
        showOrientation: data.showOrientation,
        showGender: data.showGender,
        incognitoMode: data.incognitoMode,
        acceptTerms: data.acceptTerms,
        acceptPrivacy: data.acceptPrivacy,
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
    validateCurrentStep,
    handleSubmit,
    isSubmitting,
    errors,
    control,
    setFieldTouched: (field: string, touched: boolean) => {
      // This is a simple implementation - you might want to enhance it
      console.log('🔍 setFieldTouched called with:', field, touched);
    },
  };
}
