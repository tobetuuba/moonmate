import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
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
import Button from '../../components/Button';
import Card from '../../components/Card';
import useAuth from '../../hooks/useAuth';

interface UserProfile {
  id: string;
  displayName: string;
  age: number;
  zodiacSign: string;
  city: string;
  profession?: string;
  bio: string;
  photos: string[];
  interests: string[];
  socialLinks: {
    instagram?: string;
    spotify?: string;
  };
}

export default function ProfileScreen() {
  const { user, isAuthenticated } = useAuth();
  const [isOwnProfile] = useState(true); // For now, always show own profile
  const [isEditing, setIsEditing] = useState(false);
  const [showBioModal, setShowBioModal] = useState(false);
  const [bioText, setBioText] = useState('');

  // Mock user data - replace with real data from Firebase
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: user?.uid || '1',
    displayName: user?.displayName || 'Sarah',
    age: 25,
    zodiacSign: 'Libra',
    city: 'Istanbul',
    profession: 'Software Engineer',
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
  });

  const handleAddPhoto = () => {
    Alert.alert('Add Photo', 'Photo picker will be implemented here');
  };

  const handlePhotoPress = (photoUrl: string, index: number) => {
    console.log('Photo pressed:', photoUrl, index);
  };

  const handleInterestToggle = (interestId: string) => {
    setUserProfile(prev => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter(id => id !== interestId)
        : [...prev.interests, interestId],
    }));
  };

  const handleBioEdit = () => {
    setBioText(userProfile.bio);
    setShowBioModal(true);
  };

  const handleBioSave = () => {
    setUserProfile(prev => ({ ...prev, bio: bioText }));
    setShowBioModal(false);
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
        <Card variant="elevated" style={styles.basicInfoCard}>
          <View style={styles.basicInfo}>
            <Text style={styles.name}>{userProfile.displayName}</Text>
            <Text style={styles.age}>{userProfile.age}</Text>
            <Text style={styles.zodiacSign}>{userProfile.zodiacSign}</Text>
          </View>
          
          <View style={styles.locationContainer}>
            <Ionicons name="location" size={16} color={colors.text.tertiary} />
            <Text style={styles.location}>{userProfile.city}</Text>
          </View>
          
          {userProfile.profession && (
            <View style={styles.professionContainer}>
              <Ionicons name="briefcase" size={16} color={colors.text.tertiary} />
              <Text style={styles.profession}>{userProfile.profession}</Text>
            </View>
          )}
        </Card>

        {/* Bio Section */}
        <Card variant="elevated" style={styles.bioCard}>
          <View style={styles.bioHeader}>
            <Text style={styles.sectionTitle}>About Me</Text>
            {isOwnProfile && isEditing && (
              <TouchableOpacity onPress={handleBioEdit}>
                <Ionicons name="create-outline" size={20} color={colors.primary[500]} />
              </TouchableOpacity>
            )}
          </View>
          
          <Text style={styles.bioText}>
            {userProfile.bio || 'No bio yet...'}
          </Text>
        </Card>

        {/* Interests */}
        <Card variant="elevated" style={styles.interestsCard}>
          <InterestChips
            selectedInterests={userProfile.interests}
            isEditable={isOwnProfile && isEditing}
            onInterestToggle={handleInterestToggle}
          />
        </Card>

        {/* Social Links */}
        {(userProfile.socialLinks.instagram || userProfile.socialLinks.spotify) && (
          <Card variant="elevated" style={styles.socialCard}>
            <Text style={styles.sectionTitle}>Social</Text>
            
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
          </Card>
        )}

        {/* Premium Features */}
        <Card variant="elevated" style={styles.premiumCard}>
          <Text style={styles.sectionTitle}>Premium Features</Text>
          
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
        </Card>
      </ScrollView>

      {/* Bio Edit Modal */}
      <Modal
        visible={showBioModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowBioModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Bio</Text>
              <TouchableOpacity onPress={() => setShowBioModal(false)}>
                <Ionicons name="close" size={24} color={colors.text.primary} />
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={styles.bioInput}
              value={bioText}
              onChangeText={setBioText}
              placeholder="Tell us about yourself..."
              placeholderTextColor={colors.text.tertiary}
              multiline
              maxLength={300}
              textAlignVertical="top"
            />
            
            <View style={styles.modalFooter}>
              <Text style={styles.charCount}>{bioText.length}/300</Text>
              <Button
                title="Save"
                onPress={handleBioSave}
                size="small"
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
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
  basicInfoCard: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
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
  zodiacSign: {
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
  bioCard: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  bioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    ...typography.styles.h4,
    color: colors.text.primary,
  },
  bioText: {
    ...typography.styles.body,
    color: colors.text.secondary,
    lineHeight: typography.lineHeights.normal,
  },
  interestsCard: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  socialCard: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  premiumCard: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.xl,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.background.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background.secondary,
    borderTopLeftRadius: spacing.card.borderRadius,
    borderTopRightRadius: spacing.card.borderRadius,
    padding: spacing.lg,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  modalTitle: {
    ...typography.styles.h4,
    color: colors.text.primary,
  },
  bioInput: {
    ...typography.styles.body,
    color: colors.text.primary,
    backgroundColor: colors.background.tertiary,
    borderRadius: spacing.input.borderRadius,
    padding: spacing.md,
    minHeight: 120,
    marginBottom: spacing.md,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  charCount: {
    ...typography.styles.caption,
    color: colors.text.tertiary,
  },
});