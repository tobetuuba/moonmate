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
  gender: 'female',
  seeking: ['men'],
  relationshipGoals: ['Long-term relationship'],
  bio: 'Love exploring new places and trying different cuisines! 🌍🍕',
  photos: [
    'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
    'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
  ],
  interests: ['music', 'travel', 'cooking'],
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
        <ProfileSection title="Basic Info">
          <View style={styles.basicInfo}>
            <Text style={styles.name}>{userProfile.displayName}</Text>
            <Text style={styles.age}>{userProfile.age}</Text>
            <Text style={styles.gender}>{userProfile.gender}</Text>
          </View>
          
          {userProfile.location?.city && (
            <View style={styles.locationContainer}>
              <Ionicons name="location" size={16} color={colors.text.tertiary} />
              <Text style={styles.location}>{userProfile.location.city}</Text>
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
          onEditPress={() => Alert.alert('Edit Looking For', 'This feature will be implemented soon')}
        >
          <View style={styles.lookingForContainer}>
            {userProfile.relationshipGoals?.map((goal, index) => (
              <View key={index} style={styles.lookingForItem}>
                <Ionicons name="heart" size={20} color={colors.primary[500]} />
                <Text style={styles.lookingForText}>{goal}</Text>
              </View>
            ))}
            {userProfile.seeking?.map((preference, index) => (
              <View key={index} style={styles.lookingForItem}>
                <Ionicons name="people" size={20} color={colors.secondary[500]} />
                <Text style={styles.lookingForText}>Interested in {preference}</Text>
              </View>
            ))}
          </View>
        </ProfileSection>

        {/* Interests */}
        <ProfileSection title="Interests">
          <InterestChips
            selectedInterests={userProfile.interests}
            isEditable={isOwnProfile && isEditing}
            onInterestToggle={handleInterestToggle}
            maxSelections={MAX_INTERESTS}
          />
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
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  location: {
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
});