import { useState } from 'react';
import { Alert } from 'react-native';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { router } from 'expo-router';
import { ProfileService } from '../services/api/ProfileService';
import { UserProfile } from '../types/profile';
import { auth } from '../services/firebase';
import { completeFormSchema, validateStep } from '../utils/validationSchemas';

interface FormData {
  // Step 1: Basic Info
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

  // Step 2: Relationship Goals
  relationshipType: string;
  monogamy: boolean;
  childrenPlan: string;
  childrenPlanDetails?: string;

  // Step 3: About & Prompts
  bio: string;
  prompts: {
    [key: string]: string;
  };

  // Step 4: Interests & Lifestyle
  interests: string[];
  customInterests: string[];
  smoking: string;
  drinking: string;
  diet: string;
  exercise: string;

  // Step 5: Photos
  photos: string[];
  profilePhotoUrl: string;

  // Step 6: Privacy
  showOrientation: boolean;
  showGender: boolean;
  incognitoMode: boolean;
  acceptTerms: boolean;
  acceptPrivacy: boolean;
}

const INITIAL_FORM_DATA: FormData = {
  displayName: '',
  birthDate: '',
  birthTime: '',
  location: {
    city: '',
    country: 'United States',
    latitude: 0,
    longitude: 0,
  },
  gender: '',
  customGender: '',
  pronouns: '',
  customPronouns: '',
  sexualOrientation: [],
  customOrientation: '',

  relationshipType: '',
  monogamy: true,
  childrenPlan: '',
  childrenPlanDetails: '',

  bio: '',
  prompts: {},

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
  });

  const formData = watch();

  const updateFormData = (field: keyof FormData, value: any) => {
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
        return ['displayName', 'birthDate', 'location', 'gender'];
      case 2:
        return ['relationshipType', 'childrenPlan'];
      case 3:
        return ['bio', 'prompts'];
      case 4:
        return ['interests'];
      case 5:
        return []; // Photos are optional for now
      case 6:
        return ['acceptTerms', 'acceptPrivacy'];
      default:
        return [];
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Calculate age
      const birthDate = new Date(data.birthDate);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      const finalAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) ? age - 1 : age;

      const profileData: UserProfile = {
        id: user.uid,
        displayName: data.displayName,
        age: finalAge,
        birthDate: data.birthDate,
        birthTime: data.birthTime,
        location: data.location,
        gender: data.gender,
        seeking: [], // Will be set separately
        relationshipGoals: [data.relationshipType],
        bio: data.bio,
        photos: data.photos,
        profilePhotoUrl: data.profilePhotoUrl,
        interests: data.interests,
        socialLinks: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await ProfileService.createUserProfile(profileData);
      
      Alert.alert('Success!', 'Your profile has been created successfully!', [
        { text: 'OK', onPress: () => router.replace('/(tabs)') }
      ]);
    } catch (error) {
      console.error('Profile creation error:', error);
      Alert.alert('Error', 'An error occurred while creating your profile. Please try again.');
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
  };
}
