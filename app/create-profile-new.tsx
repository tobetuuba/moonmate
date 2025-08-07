import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  Platform,
  KeyboardAvoidingView,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacings';
import StepHeader from '../components/StepHeader';
import StepNavigation from '../components/StepNavigation';
import { useCreateProfileForm } from '../hooks/useCreateProfileForm';
import Step1BasicInfo from '../components/steps/Step1BasicInfo';
import Step2RelationshipGoals from '../components/steps/Step2RelationshipGoals';
import Step3AboutPrompts from '../components/steps/Step3AboutPrompts';
import Step4InterestsLifestyle from '../components/steps/Step4InterestsLifestyle';
import Step5PhotoUpload from '../components/steps/Step5PhotoUpload';
import Step6PrivacyConfirm from '../components/steps/Step6PrivacyConfirm';

// Step configurations
const STEPS = [
  {
    id: 1,
    title: 'Basic Info',
    subtitle: 'Tell us about yourself',
  },
  {
    id: 2,
    title: 'Relationship Goals',
    subtitle: 'What kind of relationship are you looking for?',
  },
  {
    id: 3,
    title: 'About & Prompts',
    subtitle: 'Tell us about yourself and answer our questions',
  },
  {
    id: 4,
    title: 'Interests & Lifestyle',
    subtitle: 'Share your hobbies and lifestyle',
  },
  {
    id: 5,
    title: 'Photo Upload',
    subtitle: 'Share your best photos',
  },
  {
    id: 6,
    title: 'Privacy & Confirm',
    subtitle: 'Final settings and create your profile',
  },
];

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

// Relationship type options
const RELATIONSHIP_TYPE_OPTIONS = [
  { label: 'Serious Relationship', value: 'serious' },
  { label: 'Marriage', value: 'marriage' },
  { label: 'Not Sure', value: 'unsure' },
];

// Children plan options
const CHILDREN_PLAN_OPTIONS = [
  { label: 'Yes, I want them', value: 'yes' },
  { label: 'No, I don\'t want them', value: 'no' },
  { label: 'Maybe', value: 'maybe' },
  { label: 'Already have them', value: 'already-have' },
];

// Prompt options
const PROMPT_OPTIONS = [
  {
    id: 'ideal-date',
    question: 'What would your ideal first date be like?',
    icon: 'heart',
  },
  {
    id: 'life-goal',
    question: 'What\'s your biggest life goal?',
    icon: 'star',
  },
  {
    id: 'simple-pleasure',
    question: 'What simple thing makes you happiest?',
    icon: 'sunny',
  },
  {
    id: 'travel-dream',
    question: 'Where do you most want to travel?',
    icon: 'airplane',
  },
  {
    id: 'fun-fact',
    question: 'What\'s an interesting fact about you that people don\'t know?',
    icon: 'bulb',
  },
];

// Interest options
const INTEREST_OPTIONS = [
  { id: 'music', label: 'Music', icon: 'musical-notes' },
  { id: 'travel', label: 'Travel', icon: 'airplane' },
  { id: 'sports', label: 'Sports', icon: 'football' },
  { id: 'food', label: 'Food', icon: 'restaurant' },
  { id: 'art', label: 'Art', icon: 'color-palette' },
  { id: 'reading', label: 'Reading', icon: 'book' },
  { id: 'gaming', label: 'Gaming', icon: 'game-controller' },
  { id: 'photography', label: 'Photography', icon: 'camera' },
  { id: 'dancing', label: 'Dancing', icon: 'body' },
  { id: 'hiking', label: 'Hiking', icon: 'leaf' },
  { id: 'cooking', label: 'Cooking', icon: 'restaurant' },
  { id: 'movies', label: 'Movies', icon: 'film' },
  { id: 'fitness', label: 'Fitness', icon: 'fitness' },
  { id: 'writing', label: 'Writing', icon: 'create' },
  { id: 'technology', label: 'Technology', icon: 'laptop' },
];

// Cities for United States
const CITIES = [
  'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio',
  'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville', 'Fort Worth', 'Columbus',
  'Charlotte', 'San Francisco', 'Indianapolis', 'Seattle', 'Denver', 'Washington',
  'Boston', 'El Paso', 'Nashville', 'Detroit', 'Oklahoma City', 'Portland', 'Las Vegas',
  'Memphis', 'Louisville', 'Baltimore', 'Milwaukee', 'Albuquerque', 'Tucson', 'Fresno',
  'Sacramento', 'Mesa', 'Kansas City', 'Atlanta', 'Long Beach', 'Colorado Springs',
];

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

export default function CreateProfileNewScreen() {
  const [currentStep, setCurrentStep] = useState(1);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const { 
    formData, 
    updateFormData, 
    updateNestedField, 
    validateCurrentStep, 
    handleSubmit, 
    isSubmitting,
    errors,
  } = useCreateProfileForm();
  
  // Animation values
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const animateStepTransition = useCallback((direction: 'next' | 'prev', onComplete?: () => void) => {
    const toValue = direction === 'next' ? -50 : 50;
    
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0.5,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      slideAnim.setValue(0);
      fadeAnim.setValue(1);
      onComplete?.();
    });
  }, [slideAnim, fadeAnim]);

  const handleNext = useCallback(async () => {
    if (currentStep < 6) {
      const isValid = await validateCurrentStep(currentStep);
      if (isValid) {
        animateStepTransition('next', () => {
          setCurrentStep(prev => prev + 1);
        });
      } else {
        // Trigger validation to show errors and mark all fields as touched
        await validateCurrentStep(currentStep);
        // Mark all fields in current step as touched
        const stepFields = getStepFieldsForTouched(currentStep);
        const newTouched: Record<string, boolean> = {};
        stepFields.forEach((field: string) => {
          // Handle nested fields like 'location.city'
          if (field.includes('.')) {
            const [parent, child] = field.split('.');
            newTouched[field] = true;
          } else {
            newTouched[field] = true;
          }
        });
        setTouched(prev => ({ ...prev, ...newTouched }));
        // Don't proceed to next step, just show errors
      }
    } else {
      handleSubmit();
    }
  }, [currentStep, validateCurrentStep, handleSubmit, animateStepTransition]);

  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      animateStepTransition('prev', () => {
        setCurrentStep(prev => prev - 1);
      });
    }
  }, [currentStep, animateStepTransition]);



  // Get step fields for touched state
  const getStepFieldsForTouched = useCallback((step: number): string[] => {
    switch (step) {
      case 1:
        return ['displayName', 'birthDate', 'location.city', 'gender', 'seeking'];
      case 2:
        return ['relationshipType'];
      case 3:
        return ['bio'];
      case 4:
        return ['interests'];
      case 5:
        return [];
      case 6:
        return ['acceptTerms', 'acceptPrivacy'];
      default:
        return [];
    }
  }, []);









  const renderStep4 = () => (
    <Animated.View style={[styles.stepContainer, { opacity: fadeAnim }]}>
      <Text style={styles.sectionTitle}>Interests</Text>

      {/* Interests */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Hobbies and Interests</Text>
        <View style={styles.optionsGrid}>
          {INTEREST_OPTIONS.map((interest) => (
            <TouchableOpacity
              key={interest.id}
              style={[
                styles.interestChip,
                formData.interests.includes(interest.id) && styles.interestChipSelected,
              ]}
              onPress={() => {
                const newInterests = formData.interests.includes(interest.id)
                  ? formData.interests.filter(i => i !== interest.id)
                  : [...formData.interests, interest.id];
                updateFormData('interests', newInterests);
              }}
            >
              <Ionicons 
                name={interest.icon as any} 
                size={16} 
                color={formData.interests.includes(interest.id) ? colors.text.white : colors.primary[500]} 
              />
              <Text style={[
                styles.interestChipText,
                formData.interests.includes(interest.id) && styles.interestChipTextSelected,
              ]}>
                {interest.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Text style={styles.sectionTitle}>Lifestyle</Text>

      {/* Lifestyle options would go here */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Smoking</Text>
        <View style={styles.optionsGrid}>
          {['Never', 'Occasionally', 'Regularly'].map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.optionChip,
                formData.smoking === option && styles.optionChipSelected,
              ]}
              onPress={() => updateFormData('smoking', option)}
            >
              <Text style={[
                styles.optionChipText,
                formData.smoking === option && styles.optionChipTextSelected,
              ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Animated.View>
  );

  const renderStep5 = () => (
    <Animated.View style={[styles.stepContainer, { opacity: fadeAnim }]}>
      <Text style={styles.sectionTitle}>Photos</Text>
      <Text style={styles.sectionSubtitle}>
        Upload at least 3, maximum 9 photos
      </Text>

      <View style={styles.photoGrid}>
        {Array.from({ length: 9 }, (_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.photoSlot,
              formData.photos[index] && styles.photoSlotFilled,
            ]}
            onPress={() => {
              // Photo picker logic would go here
              Alert.alert('Upload Photo', 'Photo picker will open here');
            }}
          >
            {formData.photos[index] ? (
              <Image source={{ uri: formData.photos[index] }} style={styles.photoImage} />
            ) : (
              <Ionicons name="add" size={32} color={colors.text.tertiary} />
            )}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.photoInfo}>
        <Ionicons name="information-circle" size={16} color={colors.text.secondary} />
        <Text style={styles.photoInfoText}>
          Photo quality increases your match rate
        </Text>
      </View>
    </Animated.View>
  );

  const renderStep6 = () => (
    <Animated.View style={[styles.stepContainer, { opacity: fadeAnim }]}>
      <Step6PrivacyConfirm
        formData={formData}
        updateFormData={updateFormData}
      />
    </Animated.View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1BasicInfo
            formData={formData}
            updateFormData={updateFormData}
            updateNestedField={updateNestedField}
            errors={errors}
            touched={touched}
            setFieldTouched={(field: string, touched: boolean) => {
              setTouched(prev => ({ ...prev, [field]: touched }));
            }}
          />
        );
      case 2:
        return (
          <Step2RelationshipGoals
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 3:
        return (
          <Step3AboutPrompts
            formData={formData}
            updateFormData={updateFormData}
            errors={errors}
            touched={touched}
          />
        );
      case 4:
        return (
          <Step4InterestsLifestyle
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 5:
        return (
          <Step5PhotoUpload
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 6:
        return (
          <Step6PrivacyConfirm
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <StepHeader
          currentStep={currentStep}
          totalSteps={6}
          title={STEPS[currentStep - 1].title}
          subtitle={STEPS[currentStep - 1].subtitle}
        />

        <KeyboardAwareScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          enableOnAndroid={true}
          enableAutomaticScroll={true}
          keyboardShouldPersistTaps="handled"
          extraScrollHeight={100}
          keyboardDismissMode="interactive"
          keyboardOpeningTime={0}
        >
          {renderCurrentStep()}
        </KeyboardAwareScrollView>

        <StepNavigation
          currentStep={currentStep}
          totalSteps={6}
          onBack={handleBack}
          onNext={handleNext}
          nextButtonDisabled={isSubmitting}
          showSkip={false}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.md,
  },
  stepContainer: {
    paddingHorizontal: spacing.md,
  },
  sectionTitle: {
    ...typography.styles.h4,
    color: colors.text.primary,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionSubtitle: {
    ...typography.styles.body,
    color: colors.text.secondary,
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  charCount: {
    ...typography.styles.caption,
    color: colors.text.tertiary,
    textAlign: 'right',
    marginTop: spacing.xs,
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
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  optionChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.button.borderRadius,
    borderWidth: 1,
    borderColor: colors.border.secondary,
    backgroundColor: colors.background.secondary,
  },
  optionChipSelected: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
  },
  optionChipText: {
    ...typography.styles.body,
    color: colors.text.primary,
  },
  optionChipTextSelected: {
    color: colors.text.white,
    fontWeight: typography.weights.semibold,
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
  interestChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.button.borderRadius,
    borderWidth: 1,
    borderColor: colors.border.secondary,
    backgroundColor: colors.background.secondary,
    gap: spacing.xs,
  },
  interestChipSelected: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
  },
  interestChipText: {
    ...typography.styles.body,
    color: colors.text.primary,
  },
  interestChipTextSelected: {
    color: colors.text.white,
    fontWeight: typography.weights.semibold,
  },
  promptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  promptQuestion: {
    ...typography.styles.body,
    color: colors.text.primary,
    fontWeight: typography.weights.medium,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  photoSlot: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: colors.border.secondary,
    borderStyle: 'dashed',
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoSlotFilled: {
    borderStyle: 'solid',
    borderColor: colors.primary[500],
  },
  photoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  photoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  photoInfoText: {
    ...typography.styles.caption,
    color: colors.text.secondary,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  toggleLabel: {
    ...typography.styles.body,
    color: colors.text.primary,
  },
  toggleSwitch: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.background.tertiary,
    padding: 2,
  },
  toggleSwitchActive: {
    backgroundColor: colors.primary[500],
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.text.white,
  },
  toggleThumbActive: {
    transform: [{ translateX: 22 }],
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.border.secondary,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
  },
  checkboxLabel: {
    ...typography.styles.body,
    color: colors.text.primary,
    flex: 1,
    lineHeight: typography.lineHeights.normal,
  },

});
