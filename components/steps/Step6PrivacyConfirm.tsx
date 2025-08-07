import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacings';

interface Step6PrivacyConfirmProps {
  formData: {
    showOrientation: boolean;
    showGender: boolean;
    incognitoMode: boolean;
    acceptTerms: boolean;
    acceptPrivacy: boolean;
  };
  updateFormData: (field: any, value: any) => void;
}

export default function Step6PrivacyConfirm({
  formData,
  updateFormData,
}: Step6PrivacyConfirmProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Privacy Settings</Text>

      {/* Privacy toggles */}
      <View style={styles.inputGroup}>
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Show my sexual orientation</Text>
          <TouchableOpacity
            style={[
              styles.toggleSwitch,
              formData.showOrientation && styles.toggleSwitchActive,
            ]}
            onPress={useCallback(() => updateFormData('showOrientation', !formData.showOrientation), [updateFormData, formData.showOrientation])}
          >
            <View style={[
              styles.toggleThumb,
              formData.showOrientation && styles.toggleThumbActive,
            ]} />
          </TouchableOpacity>
        </View>

        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Show my gender identity</Text>
          <TouchableOpacity
            style={[
              styles.toggleSwitch,
              formData.showGender && styles.toggleSwitchActive,
            ]}
            onPress={useCallback(() => updateFormData('showGender', !formData.showGender), [updateFormData, formData.showGender])}
          >
            <View style={[
              styles.toggleThumb,
              formData.showGender && styles.toggleThumbActive,
            ]} />
          </TouchableOpacity>
        </View>

        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Incognito mode: Only show when I like someone</Text>
          <TouchableOpacity
            style={[
              styles.toggleSwitch,
              formData.incognitoMode && styles.toggleSwitchActive,
            ]}
            onPress={useCallback(() => updateFormData('incognitoMode', !formData.incognitoMode), [updateFormData, formData.incognitoMode])}
          >
            <View style={[
              styles.toggleThumb,
              formData.incognitoMode && styles.toggleThumbActive,
            ]} />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Consent</Text>

      {/* Consent checkboxes */}
      <View style={styles.inputGroup}>
        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={useCallback(() => updateFormData('acceptTerms', !formData.acceptTerms), [updateFormData, formData.acceptTerms])}
        >
          <View style={[
            styles.checkbox,
            formData.acceptTerms && styles.checkboxChecked,
          ]}>
            {formData.acceptTerms && (
              <Ionicons name="checkmark" size={16} color={colors.text.white} />
            )}
          </View>
          <Text style={styles.checkboxLabel}>
            I accept the community guidelines and terms of service
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={useCallback(() => updateFormData('acceptPrivacy', !formData.acceptPrivacy), [updateFormData, formData.acceptPrivacy])}
        >
          <View style={[
            styles.checkbox,
            formData.acceptPrivacy && styles.checkboxChecked,
          ]}>
            {formData.acceptPrivacy && (
              <Ionicons name="checkmark" size={16} color={colors.text.white} />
            )}
          </View>
          <Text style={styles.checkboxLabel}>
            I accept the privacy policy and data processing
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>What happens next?</Text>
        <View style={styles.infoItem}>
          <Ionicons name="shield-checkmark" size={16} color={colors.accent.success} />
          <Text style={styles.infoText}>Your profile will be reviewed for safety</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="people" size={16} color={colors.primary[500]} />
          <Text style={styles.infoText}>Start matching with compatible people</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="heart" size={16} color={colors.secondary[500]} />
          <Text style={styles.infoText}>Build meaningful connections</Text>
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
  inputGroup: {
    marginBottom: spacing.lg,
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
    flex: 1,
    marginRight: spacing.md,
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
    marginBottom: spacing.md,
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.border.secondary,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
    flexShrink: 0,
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
    fontWeight: typography.weights.medium,
  },
  infoSection: {
    marginTop: spacing.xl,
    padding: spacing.md,
    backgroundColor: colors.background.secondary,
    borderRadius: spacing.card.borderRadius,
  },
  infoTitle: {
    ...typography.styles.h4,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  infoText: {
    ...typography.styles.body,
    color: colors.text.secondary,
    flex: 1,
  },
});
