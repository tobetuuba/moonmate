import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacings';
import { uploadGalleryPhoto } from '../../services/StorageService';

interface Step5PhotoUploadProps {
  formData: {
    photos: string[];
    profilePhotoUrl: string;
  };
  updateFormData: (field: any, value: any) => void;
}

export default function Step5PhotoUpload({
  formData,
  updateFormData,
}: Step5PhotoUploadProps) {
  const [uploadingPhotos, setUploadingPhotos] = useState<Set<number>>(new Set());

  const handlePhotoUpload = async (index: number) => {
    Alert.alert(
      'Photo Upload', 
      'Photo upload is temporarily disabled in Expo Go. This feature will be available in the production app.',
      [{ text: 'OK' }]
    );
  };

  const removePhoto = (index: number) => {
    const newPhotos = formData.photos.filter((_, i) => i !== index);
    updateFormData('photos', newPhotos);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Photos</Text>
      <Text style={styles.sectionSubtitle}>
        Upload photos (optional for now)
      </Text>

      <View style={styles.photoGrid}>
        {Array.from({ length: 9 }, (_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.photoSlot,
              formData.photos[index] && styles.photoSlotFilled,
            ]}
            onPress={() => handlePhotoUpload(index)}
          >
            {uploadingPhotos.has(index) ? (
              <View style={styles.photoContainer}>
                <ActivityIndicator size="large" color={colors.primary[500]} />
                <Text style={styles.uploadingText}>Uploading...</Text>
              </View>
            ) : formData.photos[index] ? (
              <View style={styles.photoContainer}>
                <Image source={{ uri: formData.photos[index] }} style={styles.photoImage} />
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removePhoto(index)}
                >
                  <Ionicons name="close-circle" size={20} color={colors.accent.error} />
                </TouchableOpacity>
              </View>
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

      <View style={styles.photoRequirements}>
        <Text style={styles.requirementsTitle}>Photo Requirements (Optional):</Text>
        <View style={styles.requirementItem}>
          <Ionicons name="checkmark-circle" size={16} color={colors.accent.success} />
          <Text style={styles.requirementText}>Clear, well-lit photos</Text>
        </View>
        <View style={styles.requirementItem}>
          <Ionicons name="checkmark-circle" size={16} color={colors.accent.success} />
          <Text style={styles.requirementText}>Show your face clearly</Text>
        </View>
        <View style={styles.requirementItem}>
          <Ionicons name="checkmark-circle" size={16} color={colors.accent.success} />
          <Text style={styles.requirementText}>No group photos as main photo</Text>
        </View>
        <View style={styles.requirementItem}>
          <Ionicons name="checkmark-circle" size={16} color={colors.accent.success} />
          <Text style={styles.requirementText}>No sunglasses or hats covering face</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  photoContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  photoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  removeButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: colors.background.primary,
    borderRadius: 10,
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
  photoRequirements: {
    marginTop: spacing.lg,
  },
  requirementsTitle: {
    ...typography.styles.body,
    color: colors.text.primary,
    fontWeight: typography.weights.semibold,
    marginBottom: spacing.sm,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
    gap: spacing.xs,
  },
  requirementText: {
    ...typography.styles.bodySmall,
    color: colors.text.secondary,
  },
  uploadingText: {
    ...typography.styles.caption,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
});
