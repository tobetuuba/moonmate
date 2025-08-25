import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacings';
import { texts } from '../../constants/texts';
import { features } from '../../constants/features';
import ProfilePhotoCarousel from '../../components/ProfilePhotoCarousel';
import InterestChips from '../../components/InterestChips';
import LockedFeature from '../../components/LockedFeature';
import SocialLink from '../../components/SocialLink';
import ProfileSection from '../../components/ProfileSection';
import BioEditModal from '../../components/BioEditModal';
import BasicInfoEditModal from '../../components/BasicInfoEditModal';
import LifestyleEditModal from '../../components/LifestyleEditModal';
import LookingForEditModal from '../../components/LookingForEditModal';
import Toast from '../../components/Toast';
import Button from '../../components/Button';
import Card from '../../components/Card';
import useAuth from '../../hooks/useAuth';
import { UserProfile, ToastMessage } from '../../types/profile';
import { MAX_INTERESTS } from '../../constants/interests';
import { ProfileService } from '../../services/api/ProfileService';
import { useProfileCheck } from '../../hooks/useProfileCheck';

// Helper function to calculate age from birthDate
const calculateAge = (birthDate?: string): number => {
  if (!birthDate) return 25; // Default age
  
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

// Default profile data for fallback
const DEFAULT_PROFILE: UserProfile = {
  id: '',
  displayName: 'Sarah',
  age: 25,
  birthDate: '1998-10-15', // Example birth date
  birthTime: '14:30',
  height: 165,
  profession: 'Software Engineer',
  birthPlace: {
    city: 'Istanbul',
    country: 'Turkey',
    latitude: 41.0082,
    longitude: 28.9784,
  },
  location: {
    city: 'Istanbul',
    country: 'Turkey',
    latitude: 41.0082,
    longitude: 28.9784,
  },
  gender: 'woman',
  pronouns: 'she/her',
  seeking: ['man', 'nonbinary'],
  monogamy: true,
  childrenPlan: 'Want someday',
  relationshipGoals: ['Long-term relationship'],
  bio: 'Love exploring new places and trying different cuisines! 🌍🍕',
  prompts: {
    'ideal-date': 'A cozy coffee shop with great conversation',
    'life-goal': 'To travel to every continent',
    'simple-pleasure': 'Reading a good book on a rainy day',
  },
  photos: [
    'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
    'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
  ],
  interests: ['music', 'travel', 'cooking'],
  customInterests: ['Astronomy', 'Board games'],
  smoking: 'Never',
  drinking: 'Socially',
  diet: 'Vegetarian',
  exercise: 'Regularly',
  socialLinks: {
    instagram: 'sarah_insta',
    spotify: 'sarah_spotify',
  },
};

export default function ProfileScreen() {
  const { user, isAuthenticated } = useAuth();
  const { isLoading: isProfileChecking, hasProfile } = useProfileCheck();
  const [isOwnProfile] = useState(true); // For now, always show own profile
  const [isEditing, setIsEditing] = useState(false);
  const [showBioModal, setShowBioModal] = useState(false);
  const [showBasicInfoModal, setShowBasicInfoModal] = useState(false);
  const [showLifestyleModal, setShowLifestyleModal] = useState(false);
  const [showLookingForModal, setShowLookingForModal] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_PROFILE);

  // Load user profile from Firestore
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!isAuthenticated || !user?.uid) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        console.log('🔄 Loading profile for user:', user.uid);
        
        const profile = await ProfileService.getUserProfile(user.uid);
        
        if (profile) {
          console.log('✅ Profile loaded from Firestore');
          console.log('📍 City:', profile.location?.city);
          console.log('👤 Age:', profile.age);
          console.log('📝 Bio:', profile.bio);
          console.log('📏 Height:', profile.height);
          console.log('💼 Profession:', profile.profession);
          console.log('💬 Pronouns:', profile.pronouns);
          console.log('❤️ Seeking:', profile.seeking);
          console.log('🍃 Lifestyle:', JSON.stringify({ smoking: profile.smoking, drinking: profile.drinking, diet: profile.diet, exercise: profile.exercise }, null, 2));
          console.log('💭 Prompts:', profile.prompts);
          setUserProfile(profile);
        } else {
          console.log('⚠️ No profile found, using default data');
          // Create initial profile with user data
          const initialProfile: UserProfile = {
            ...DEFAULT_PROFILE,
            id: user.uid,
            displayName: user.displayName || DEFAULT_PROFILE.displayName,
            age: calculateAge(DEFAULT_PROFILE.birthDate),
          };
          setUserProfile(initialProfile);
          
          // Save initial profile to Firestore
          try {
            await ProfileService.updateUserProfile(user.uid, initialProfile);
            console.log('✅ Initial profile created in Firestore');
          } catch (error) {
            console.error('❌ Failed to create initial profile:', error);
          }
        }
      } catch (error) {
        console.error('❌ Error loading profile:', error);
        showToast('Failed to load profile', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProfile();
  }, [isAuthenticated, user?.uid]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const newToast: ToastMessage = {
      id: Date.now().toString(),
      type,
      message,
      duration: 3000,
    };
    setToasts(prev => [...prev, newToast]);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const handleAddPhoto = () => {
    Alert.alert('Add Photo', 'Photo picker will be implemented here');
  };

  const handlePhotoPress = (photoUrl: string, index: number) => {
    console.log('Photo pressed:', photoUrl, index);
  };

  const handleInterestToggle = async (interestId: string) => {
    if (!user?.uid) return;

    try {
      const newInterests = userProfile.interests.includes(interestId)
        ? userProfile.interests.filter(id => id !== interestId)
        : [...userProfile.interests, interestId];
      
      // Update local state immediately for better UX
      setUserProfile(prev => ({ ...prev, interests: newInterests }));
      
      // Update Firestore
      await ProfileService.updateInterests(user.uid, newInterests);
      
      showToast('Interests updated successfully');
    } catch (error) {
      console.error('❌ Error updating interests:', error);
      showToast('Failed to update interests', 'error');
      
      // Revert local state on error
      setUserProfile(prev => ({ ...prev, interests: userProfile.interests }));
    }
  };

  const handleBioEdit = () => {
    setShowBioModal(true);
  };

  const handleBioSave = async (newBio: string) => {
    if (!user?.uid) return;

    try {
      // Update local state immediately
      setUserProfile(prev => ({ ...prev, bio: newBio }));
      setShowBioModal(false);
      
      // Update Firestore
      await ProfileService.updateBio(user.uid, newBio);
      
      showToast('Bio updated successfully');
    } catch (error) {
      console.error('❌ Error updating bio:', error);
      showToast('Failed to update bio', 'error');
      
      // Revert local state on error
      setUserProfile(prev => ({ ...prev, bio: userProfile.bio }));
    }
  };

  const handleBasicInfoSave = async (newBasicInfo: { height?: number; profession?: string; pronouns?: string }) => {
    if (!user?.uid) return;

    try {
      // Update local state immediately
      setUserProfile(prev => ({ ...prev, ...newBasicInfo }));
      setShowBasicInfoModal(false);
      
      // Update Firestore
      await ProfileService.updateProfileFields(user.uid, newBasicInfo);
      
      showToast('Basic info updated successfully');
    } catch (error) {
      console.error('❌ Error updating basic info:', error);
      showToast('Failed to update basic info', 'error');
      
      // Revert local state on error
      setUserProfile(prev => ({ 
        ...prev, 
        height: userProfile.height,
        profession: userProfile.profession,
        pronouns: userProfile.pronouns,
      }));
    }
  };

  const handleLifestyleSave = async (newLifestyle: { smoking?: string; drinking?: string; diet?: string; exercise?: string }) => {
    if (!user?.uid) return;

    try {
      // Update local state immediately
      setUserProfile(prev => ({ ...prev, ...newLifestyle }));
      setShowLifestyleModal(false);
      
      // Update Firestore
      await ProfileService.updateProfileFields(user.uid, newLifestyle);
      
      showToast('Lifestyle updated successfully');
    } catch (error) {
      console.error('❌ Error updating lifestyle:', error);
      showToast('Failed to update lifestyle', 'error');
      
      // Revert local state on error
      setUserProfile(prev => ({ 
        ...prev, 
        smoking: userProfile.smoking,
        drinking: userProfile.drinking,
        diet: userProfile.diet,
        exercise: userProfile.exercise,
      }));
    }
  };

  const handleLookingForSave = async (newLookingFor: { 
    seeking?: string[]; 
    relationshipGoals?: string[]; 
    monogamy?: boolean; 
    childrenPlan?: string;
    ageRange?: {
      min: number;
      max: number;
    };
    maxDistance?: number;
  }) => {
    if (!user?.uid) return;

    try {
      // Update local state immediately
      setUserProfile(prev => ({ ...prev, ...newLookingFor }));
      setShowLookingForModal(false);
      
      // Update Firestore
      await ProfileService.updateProfileFields(user.uid, newLookingFor);
      
      showToast('Preferences updated successfully');
    } catch (error) {
      console.error('❌ Error updating preferences:', error);
      showToast('Failed to update preferences', 'error');
      
      // Revert local state on error
      setUserProfile(prev => ({ 
        ...prev, 
        seeking: userProfile.seeking,
        relationshipGoals: userProfile.relationshipGoals,
        monogamy: userProfile.monogamy,
        childrenPlan: userProfile.childrenPlan,
      }));
    }
  };

  const handleUpgrade = () => {
    Alert.alert('Upgrade', 'Premium upgrade flow will be implemented here');
  };

  const handleSocialLinkPress = (platform: string) => {
    Alert.alert(`${platform}`, `Opening ${platform} profile...`);
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <Text style={styles.authMessage}>Please sign in to view your profile</Text>
      </View>
    );
  }

  if (isProfileChecking || isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
        <Text style={styles.loadingText}>Loading your profile...</Text>
      </View>
    );
  }

  if (!hasProfile) {
    return (
      <View style={styles.container}>
        <Text style={styles.authMessage}>Please create your profile first</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          {isOwnProfile && (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditing(!isEditing)}
              accessibilityLabel={isEditing ? "Save profile" : "Edit profile"}
              accessibilityRole="button"
            >
              <Ionicons 
                name={isEditing ? "checkmark" : "create-outline"} 
                size={24} 
                color={colors.primary[500]} 
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Photo Carousel */}
        <ProfilePhotoCarousel
          photos={userProfile.photos}
          isOwnProfile={isOwnProfile}
          onAddPhoto={handleAddPhoto}
          onPhotoPress={handlePhotoPress}
        />

        {/* Basic Info */}
        <ProfileSection 
          title="Basic Info"
          showEditButton={isOwnProfile && isEditing}
          onEditPress={() => setShowBasicInfoModal(true)}
        >
          <View style={styles.basicInfo}>
            <Text style={styles.name}>{userProfile.displayName}</Text>
            <Text style={styles.age}>{userProfile.age}</Text>
            <Text style={styles.gender}>{userProfile.gender}</Text>
          </View>
          
          {userProfile.height && (
            <View style={styles.infoRow}>
              <Ionicons name="resize" size={16} color={colors.text.tertiary} />
              <Text style={styles.infoText}>{userProfile.height} cm</Text>
            </View>
          )}
          
          {userProfile.profession && (
            <View style={styles.infoRow}>
              <Ionicons name="briefcase" size={16} color={colors.text.tertiary} />
              <Text style={styles.infoText}>{userProfile.profession}</Text>
            </View>
          )}
          
          {userProfile.location?.city && (
            <View style={styles.infoRow}>
              <Ionicons name="location" size={16} color={colors.text.tertiary} />
              <Text style={styles.infoText}>{userProfile.location.city}</Text>
            </View>
          )}
          
          {userProfile.pronouns && (
            <View style={styles.infoRow}>
              <Ionicons name="person" size={16} color={colors.text.tertiary} />
              <Text style={styles.infoText}>{userProfile.pronouns}</Text>
            </View>
          )}
        </ProfileSection>

        {/* Bio Section */}
        <ProfileSection 
          title="About Me"
          showEditButton={isOwnProfile && isEditing}
          onEditPress={handleBioEdit}
        >
          <View style={styles.bioContainer}>
            <Text style={styles.bioText}>
              {userProfile.bio ? userProfile.bio : 'Let others know what makes you unique! ✨'}
            </Text>
          </View>
        </ProfileSection>

        {/* Looking For Section */}
        <ProfileSection 
          title="Looking For"
          showEditButton={isOwnProfile && isEditing}
          onEditPress={() => setShowLookingForModal(true)}
        >
          <View style={styles.lookingForContainer}>
            {userProfile.seeking && userProfile.seeking.length > 0 && (
              <View style={styles.lookingForItem}>
                <Ionicons name="people" size={20} color={colors.secondary[500]} />
                <Text style={styles.lookingForText}>Interested in {userProfile.seeking.join(', ')}</Text>
              </View>
            )}
            {userProfile.ageRange && (
              <View style={styles.lookingForItem}>
                <Ionicons name="calendar" size={20} color={colors.primary[500]} />
                <Text style={styles.lookingForText}>Age range: {userProfile.ageRange.min}-{userProfile.ageRange.max} years</Text>
              </View>
            )}
            {userProfile.maxDistance && (
              <View style={styles.lookingForItem}>
                <Ionicons name="location" size={20} color={colors.accent.info} />
                <Text style={styles.lookingForText}>Within {userProfile.maxDistance} km</Text>
              </View>
            )}
            {userProfile.relationshipGoals && userProfile.relationshipGoals.length > 0 && (
              <View style={styles.lookingForItem}>
                <Ionicons name="heart" size={20} color={colors.primary[500]} />
                <Text style={styles.lookingForText}>{userProfile.relationshipGoals.join(', ')}</Text>
              </View>
            )}
            {userProfile.monogamy !== undefined && (
              <View style={styles.lookingForItem}>
                <Ionicons name="checkmark-circle" size={20} color={colors.accent.success} />
                <Text style={styles.lookingForText}>
                  {userProfile.monogamy ? 'Monogamous' : 'Open to non-monogamy'}
                </Text>
              </View>
            )}
            {userProfile.childrenPlan && (
              <View style={styles.lookingForItem}>
                <Ionicons name="people-circle" size={20} color={colors.secondary[500]} />
                <Text style={styles.lookingForText}>Children: {userProfile.childrenPlan}</Text>
              </View>
            )}
          </View>
        </ProfileSection>

        {/* Prompts Section */}
        {userProfile.prompts && Object.keys(userProfile.prompts).some(key => userProfile.prompts?.[key]) && (
          <ProfileSection title="Get to Know Me">
            <View style={styles.promptsContainer}>
              {Object.entries(userProfile.prompts).map(([promptId, answer], index) => {
                if (!answer) return null;
                
                // Convert prompt ID to readable question
                const getPromptQuestion = (id: string) => {
                  const prompts: Record<string, string> = {
                    'ideal-date': 'My ideal date is...',
                    'life-goal': 'My biggest life goal is...',
                    'simple-pleasure': 'A simple pleasure I enjoy is...',
                    'travel-dream': 'My dream travel destination is...',
                    'fun-fact': 'A fun fact about me is...',
                  };
                  return prompts[id] || 'Question';
                };
                
                return (
                  <View key={promptId} style={styles.promptItem}>
                    <Text style={styles.promptQuestion}>{getPromptQuestion(promptId)}</Text>
                    <Text style={styles.promptAnswer}>{answer}</Text>
                  </View>
                );
              })}
            </View>
          </ProfileSection>
        )}

        {/* Lifestyle Section */}
        {(userProfile.smoking || userProfile.drinking || userProfile.diet || userProfile.exercise) && (
          <ProfileSection 
            title="Lifestyle"
            showEditButton={isOwnProfile && isEditing}
            onEditPress={() => setShowLifestyleModal(true)}
          >
            <View style={styles.lifestyleContainer}>
              {userProfile.smoking && (
                <View style={styles.lifestyleItem}>
                  <Ionicons name="fitness" size={20} color={colors.text.tertiary} />
                  <Text style={styles.lifestyleLabel}>Smoking:</Text>
                  <Text style={styles.lifestyleValue}>{userProfile.smoking}</Text>
                </View>
              )}
              {userProfile.drinking && (
                <View style={styles.lifestyleItem}>
                  <Ionicons name="wine" size={20} color={colors.text.tertiary} />
                  <Text style={styles.lifestyleLabel}>Drinking:</Text>
                  <Text style={styles.lifestyleValue}>{userProfile.drinking}</Text>
                </View>
              )}
              {userProfile.diet && (
                <View style={styles.lifestyleItem}>
                  <Ionicons name="restaurant" size={20} color={colors.text.tertiary} />
                  <Text style={styles.lifestyleLabel}>Diet:</Text>
                  <Text style={styles.lifestyleValue}>{userProfile.diet}</Text>
                </View>
              )}
              {userProfile.exercise && (
                <View style={styles.lifestyleItem}>
                  <Ionicons name="barbell" size={20} color={colors.text.tertiary} />
                  <Text style={styles.lifestyleLabel}>Exercise:</Text>
                  <Text style={styles.lifestyleValue}>{userProfile.exercise}</Text>
                </View>
              )}
            </View>
          </ProfileSection>
        )}

        {/* Interests */}
        <ProfileSection title="Interests">
          <InterestChips
            selectedInterests={userProfile.interests}
            isEditable={isOwnProfile && isEditing}
            onInterestToggle={handleInterestToggle}
            maxSelections={MAX_INTERESTS}
          />
          {/* Custom Interests */}
          {userProfile.customInterests && userProfile.customInterests.length > 0 && (
            <View style={styles.customInterestsContainer}>
              <Text style={styles.customInterestsLabel}>Custom interests:</Text>
              <Text style={styles.customInterestsText}>
                {userProfile.customInterests.join(', ')}
              </Text>
            </View>
          )}
        </ProfileSection>

        {/* Social Links */}
        {(userProfile.socialLinks.instagram || userProfile.socialLinks.spotify) && (
          <ProfileSection title="Social">
            <SocialLink
              platform="instagram"
              username={userProfile.socialLinks.instagram}
              isConnected={!!userProfile.socialLinks.instagram}
              onPress={() => handleSocialLinkPress('Instagram')}
            />
            
            <SocialLink
              platform="spotify"
              username={userProfile.socialLinks.spotify}
              isConnected={!!userProfile.socialLinks.spotify}
              onPress={() => handleSocialLinkPress('Spotify')}
            />
          </ProfileSection>
        )}

        {/* Premium Features */}
        <ProfileSection title="Premium Features">
          <LockedFeature
            title="Zodiac Match"
            description="Find your perfect match based on astrological compatibility"
            icon="star"
            onUpgrade={handleUpgrade}
          />
          
          <LockedFeature
            title="Advanced Filters"
            description="Filter by zodiac sign, age range, and more"
            icon="funnel"
            onUpgrade={handleUpgrade}
          />
          
          <LockedFeature
            title="Unlimited Likes"
            description="No daily limit on likes and super likes"
            icon="heart"
            onUpgrade={handleUpgrade}
          />
        </ProfileSection>
      </ScrollView>

      {/* Bio Edit Modal */}
      <BioEditModal
        visible={showBioModal}
        bio={userProfile.bio}
        onSave={handleBioSave}
        onClose={() => setShowBioModal(false)}
      />

      {/* Basic Info Edit Modal */}
      <BasicInfoEditModal
        visible={showBasicInfoModal}
        currentData={{
          height: userProfile.height,
          profession: userProfile.profession,
          pronouns: userProfile.pronouns,
        }}
        onSave={handleBasicInfoSave}
        onClose={() => setShowBasicInfoModal(false)}
      />

      {/* Lifestyle Edit Modal */}
      <LifestyleEditModal
        visible={showLifestyleModal}
        currentData={{
          smoking: userProfile.smoking,
          drinking: userProfile.drinking,
          diet: userProfile.diet,
          exercise: userProfile.exercise,
        }}
        onSave={handleLifestyleSave}
        onClose={() => setShowLifestyleModal(false)}
      />

      {/* Looking For Edit Modal */}
      <LookingForEditModal
        visible={showLookingForModal}
        currentData={{
          seeking: userProfile.seeking,
          relationshipGoals: userProfile.relationshipGoals,
          monogamy: userProfile.monogamy,
          childrenPlan: userProfile.childrenPlan,
          ageRange: userProfile.ageRange,
          maxDistance: userProfile.maxDistance,
        }}
        onSave={handleLookingForSave}
        onClose={() => setShowLookingForModal(false)}
      />

      {/* Toast Messages */}
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast}
          onDismiss={dismissToast}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...typography.styles.body,
    color: colors.text.secondary,
    marginTop: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.layout.header,
    paddingBottom: spacing.md,
  },
  headerTitle: {
    ...typography.styles.h2,
    color: colors.text.primary,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  authMessage: {
    ...typography.styles.body,
    color: colors.text.tertiary,
    textAlign: 'center',
    marginTop: spacing.xl * 2,
  },
  basicInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  name: {
    ...typography.styles.h3,
    color: colors.text.primary,
    marginRight: spacing.sm,
  },
  age: {
    ...typography.styles.body,
    color: colors.text.secondary,
    marginRight: spacing.sm,
  },
  gender: {
    ...typography.styles.body,
    color: colors.primary[500],
    fontWeight: typography.weights.semibold,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  infoText: {
    ...typography.styles.body,
    color: colors.text.secondary,
    marginLeft: spacing.xs,
  },
  professionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profession: {
    ...typography.styles.body,
    color: colors.text.secondary,
    marginLeft: spacing.xs,
  },
  bioContainer: {
    paddingHorizontal: spacing.sm,
  },
  bioText: {
    ...typography.styles.bodyLarge,
    color: colors.text.secondary,
    lineHeight: typography.lineHeights.relaxed,
    paddingVertical: spacing.sm,
  },
  lookingForContainer: {
    paddingVertical: spacing.sm,
  },
  lookingForItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  lookingForText: {
    ...typography.styles.body,
    color: colors.text.secondary,
    marginLeft: spacing.sm,
  },
  promptsContainer: {
    paddingVertical: spacing.sm,
  },
  promptItem: {
    marginBottom: spacing.md,
    padding: spacing.sm,
    backgroundColor: colors.background.secondary,
    borderRadius: spacing.input.borderRadius,
  },
  promptQuestion: {
    ...typography.styles.caption,
    color: colors.text.tertiary,
    marginBottom: spacing.xs,
    fontWeight: typography.weights.medium,
  },
  promptAnswer: {
    ...typography.styles.body,
    color: colors.text.primary,
    lineHeight: typography.lineHeights.relaxed,
  },
  lifestyleContainer: {
    paddingVertical: spacing.sm,
  },
  lifestyleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    paddingVertical: spacing.xs,
  },
  lifestyleLabel: {
    ...typography.styles.body,
    color: colors.text.secondary,
    marginLeft: spacing.sm,
    minWidth: 80,
    fontWeight: typography.weights.medium,
  },
  lifestyleValue: {
    ...typography.styles.body,
    color: colors.text.primary,
    flex: 1,
  },
  customInterestsContainer: {
    marginTop: spacing.md,
    padding: spacing.sm,
    backgroundColor: colors.background.secondary,
    borderRadius: spacing.input.borderRadius,
  },
  customInterestsLabel: {
    ...typography.styles.caption,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
    fontWeight: typography.weights.medium,
  },
  customInterestsText: {
    ...typography.styles.body,
    color: colors.text.primary,
    lineHeight: typography.lineHeights.relaxed,
  },
});