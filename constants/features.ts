// Feature Flags - Control which features are enabled
export const features = {
  // Core Features
  core: {
    visualMatch: true,
    chat: true,
    profile: true,
    auth: true,
  },

  // Premium Features (currently disabled)
  premium: {
    zodiacMatch: false,
    advancedFilters: false,
    unlimitedLikes: false,
    seeWhoLikedYou: false,
    priorityProfile: false,
  },

  // Experimental Features
  experimental: {
    aiMatching: false,
    videoChat: false,
    voiceMessages: false,
    groupChats: false,
  },

  // Development Features
  development: {
    debugMode: __DEV__,
    analytics: true,
    crashReporting: true,
  },
} as const;

// Feature Check Helper
export const isFeatureEnabled = (featurePath: string): boolean => {
  const path = featurePath.split('.');
  let current: any = features;
  
  for (const key of path) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return false;
    }
  }
  
  return Boolean(current);
};

// Feature Groups
export const featureGroups = {
  // Check if user has premium access
  isPremium: (): boolean => {
    // TODO: Implement premium user check
    return false;
  },

  // Check if feature is available for current user
  canAccess: (featurePath: string): boolean => {
    const isEnabled = isFeatureEnabled(featurePath);
    
    // Premium features require premium subscription
    if (featurePath.startsWith('premium.')) {
      return isEnabled && featureGroups.isPremium();
    }
    
    return isEnabled;
  },
} as const;

export type Features = typeof features; 