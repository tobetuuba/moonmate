import * as yup from 'yup';

// Step 1: Basic Info validation
export const step1Schema = yup.object({
  displayName: yup
    .string()
    .required('Full name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  birthDate: yup
    .string()
    .required('Birth date is required'),
  height: yup
    .number()
    .min(100, 'Height must be at least 100 cm')
    .max(250, 'Height must be less than 250 cm')
    .optional(),
  location: yup.object({
    city: yup
      .string()
      .required('Please get your current location'),
    country: yup
      .string()
      .required('Country is required'),
  }),
  profession: yup
    .string()
    .max(50, 'Profession must be less than 50 characters')
    .optional(),
  gender: yup
    .string()
    .required('Please select your gender identity'),
  pronouns: yup
    .string()
    .optional(),
  seeking: yup
    .array()
    .of(yup.string())
    .min(1, 'Please select what you are looking for')
    .required('Please select what you are looking for'),
  ageRange: yup.object({
    min: yup
      .number()
      .min(18, 'Minimum age must be at least 18')
      .max(100, 'Minimum age must be less than 100')
      .required('Age range is required'),
    max: yup
      .number()
      .min(18, 'Maximum age must be at least 18')
      .max(100, 'Maximum age must be less than 100')
      .required('Age range is required'),
  }).test('age-range', 'Maximum age must be greater than minimum age', function(value) {
    if (value?.min && value?.max) {
      return value.max > value.min;
    }
    return true;
  }),
  maxDistance: yup
    .number()
    .min(1, 'Distance must be at least 1 km')
    .max(100, 'Distance must be less than 100 km')
    .required('Maximum distance is required'),
});

// Step 2: Relationship Goals validation
export const step2Schema = yup.object({
  relationshipType: yup
    .array()
    .of(yup.string())
    .min(1, 'Please select at least one relationship type')
    .required('Relationship type is required'),
  monogamy: yup
    .boolean()
    .required(),
  childrenPlan: yup
    .array()
    .of(yup.string())
    .optional(),
});

// Step 3: About & Prompts validation
export const step3Schema = yup.object({
  bio: yup
    .string()
    .optional()
    .min(10, 'Bio must be at least 10 characters if provided')
    .max(500, 'Bio must be less than 500 characters'),
  prompts: yup
    .object()
    .optional(),
});

// Step 4: Interests & Lifestyle validation
export const step4Schema = yup.object({
  interests: yup
    .array()
    .of(yup.string())
    .optional(),
  smoking: yup
    .string()
    .optional(),
  drinking: yup
    .string()
    .optional(),
  diet: yup
    .string()
    .optional(),
  exercise: yup
    .string()
    .optional(),
});

// Step 5: Photo Upload validation
export const step5Schema = yup.object({
  photos: yup
    .array()
    .of(yup.string())
    .min(0, 'Photos are optional for now')
    .max(9, 'Maximum 9 photos allowed')
    .optional(),
});

// Step 6: Privacy & Confirm validation
export const step6Schema = yup.object({
  showOrientation: yup
    .boolean()
    .required(),
  showGender: yup
    .boolean()
    .required(),
  incognitoMode: yup
    .boolean()
    .required(),
  acceptTerms: yup
    .boolean()
    .oneOf([true], 'You must accept the terms of service')
    .required(),
  acceptPrivacy: yup
    .boolean()
    .oneOf([true], 'You must accept the privacy policy')
    .required(),
});

// Complete form validation schema
export const completeFormSchema = yup.object({
  // Step 1
  displayName: step1Schema.fields.displayName,
  birthDate: step1Schema.fields.birthDate,
  location: step1Schema.fields.location,
  gender: step1Schema.fields.gender,
  pronouns: step1Schema.fields.pronouns,
  seeking: step1Schema.fields.seeking,
  
  // Step 2
  relationshipType: step2Schema.fields.relationshipType,
  monogamy: step2Schema.fields.monogamy,
  childrenPlan: step2Schema.fields.childrenPlan,
  
  // Step 3
  bio: step3Schema.fields.bio,
  prompts: step3Schema.fields.prompts,
  
  // Step 4
  interests: step4Schema.fields.interests,
  smoking: step4Schema.fields.smoking,
  drinking: step4Schema.fields.drinking,
  diet: step4Schema.fields.diet,
  exercise: step4Schema.fields.exercise,
  
  // Step 5
  photos: step5Schema.fields.photos,
  
  // Step 6
  showOrientation: step6Schema.fields.showOrientation,
  showGender: step6Schema.fields.showGender,
  incognitoMode: step6Schema.fields.incognitoMode,
  acceptTerms: step6Schema.fields.acceptTerms,
  acceptPrivacy: step6Schema.fields.acceptPrivacy,
});

// Step validation functions
export const validateStep = (step: number, data: any) => {
  try {
    switch (step) {
      case 1:
        step1Schema.validateSync(data, { abortEarly: false });
        return { isValid: true, errors: {} };
      case 2:
        step2Schema.validateSync(data, { abortEarly: false });
        return { isValid: true, errors: {} };
      case 3:
        step3Schema.validateSync(data, { abortEarly: false });
        return { isValid: true, errors: {} };
      case 4:
        step4Schema.validateSync(data, { abortEarly: false });
        return { isValid: true, errors: {} };
      case 5:
        step5Schema.validateSync(data, { abortEarly: false });
        return { isValid: true, errors: {} };
      case 6:
        step6Schema.validateSync(data, { abortEarly: false });
        return { isValid: true, errors: {} };
      default:
        return { isValid: true, errors: {} };
    }
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      const errors: Record<string, string> = {};
      error.inner.forEach((err) => {
        if (err.path) {
          errors[err.path] = err.message;
        }
      });
      return { isValid: false, errors };
    }
    return { isValid: false, errors: { general: 'Validation error occurred' } };
  }
};
