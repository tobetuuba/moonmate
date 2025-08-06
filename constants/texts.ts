// App Texts - Static text content
export const texts = {
  // App Info
  app: {
    name: 'MoonMate',
    tagline: 'Find your cosmic connection',
    version: '1.0.0',
  },

  // Auth
  auth: {
    login: {
      title: 'Welcome Back',
      subtitle: 'Sign in to continue your journey',
      email: 'Email',
      password: 'Password',
      forgotPassword: 'Forgot Password?',
      signIn: 'Sign In',
      noAccount: "Don't have an account?",
      signUp: 'Sign Up',
    },
    signup: {
      title: 'Create Account',
      subtitle: 'Join MoonMate today',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      createAccount: 'Create Account',
      haveAccount: 'Already have an account?',
      signIn: 'Sign In',
    },
    verify: {
      title: 'Verify Email',
      subtitle: 'Check your email for verification link',
      resend: 'Resend Email',
      backToLogin: 'Back to Login',
    },
  },

  // Profile
  profile: {
    createTitle: '✨ Create Your Profile ✨',
    createSubtitle: "Let's make your profile shine! 🌟",
    editTitle: '✨ Edit Your Profile ✨',
    editSubtitle: 'Update your profile information! 🌟',
    create: {
      title: 'Create Your Profile',
      subtitle: 'Tell us about yourself',
      displayName: 'Display Name',
      birthDate: 'Birth Date',
      bio: 'Bio',
      location: 'Location',
      photos: 'Photos',
      save: 'Save Profile',
    },
    edit: {
      title: 'Edit Profile',
      save: 'Save Changes',
    },
  },

  // Matching
  matching: {
    visual: {
      title: 'Visual Match',
      subtitle: 'Swipe to find your match',
      noMoreProfiles: 'No more profiles to show',
      loading: 'Loading profiles...',
    },
    zodiac: {
      title: 'Zodiac Match',
      subtitle: 'Find your cosmic connection',
      comingSoon: 'Coming Soon',
      premium: 'Premium Feature',
    },
  },

  // Chat
  chat: {
    list: {
      title: 'Messages',
      empty: 'No conversations yet',
      emptySubtitle: 'Start matching to begin conversations',
    },
    conversation: {
      placeholder: 'Type a message...',
      send: 'Send',
      loading: 'Loading messages...',
      empty: 'No messages yet',
      emptySubtitle: 'Start the conversation!',
    },
  },

  // Common
  common: {
    loading: 'Loading...',
    error: 'Something went wrong',
    retry: 'Retry',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    back: 'Back',
    next: 'Next',
    done: 'Done',
    skip: 'Skip',
    continue: 'Continue',
    yes: 'Yes',
    no: 'No',
    ok: 'OK',
  },

  // Errors
  errors: {
    network: 'Network error. Please check your connection.',
    auth: {
      invalidEmail: 'Invalid email address',
      weakPassword: 'Password is too weak',
      userNotFound: 'User not found',
      wrongPassword: 'Wrong password',
      emailInUse: 'Email already in use',
    },
    validation: {
      required: 'This field is required',
      email: 'Please enter a valid email',
      password: 'Password must be at least 6 characters',
      passwordMatch: 'Passwords do not match',
    },
  },

  // Success Messages
  success: {
    profileCreated: 'Profile created successfully!',
    profileUpdated: 'Profile updated successfully!',
    messageSent: 'Message sent',
    matchFound: 'It\'s a match!',
  },

  // Premium Features
  premium: {
    zodiacMatch: {
      title: 'Zodiac Match',
      description: 'Find your perfect match based on astrological compatibility',
      comingSoon: 'Coming soon to premium users',
    },
    advancedFilters: {
      title: 'Advanced Filters',
      description: 'Filter by zodiac sign, age range, and more',
      comingSoon: 'Coming soon to premium users',
    },
  },
} as const;

export type AppTexts = typeof texts; 