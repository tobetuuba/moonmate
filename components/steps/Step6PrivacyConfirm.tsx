import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacings';
import { useTheme } from '../../context/ThemeContext';

// Fallback colors for debugging
const fallbackColors = {
  text: {
    primary: '#FFFFFF',
    secondary: '#E5E7EB',
  }
};

import { PrivacyConfirm } from '../../types/profile';

interface Step6PrivacyConfirmProps {
  formData: PrivacyConfirm;
  updateFormData: (field: keyof PrivacyConfirm, value: any) => void;
}

export default function Step6PrivacyConfirm({
  formData,
  updateFormData,
}: Step6PrivacyConfirmProps) {
  const { colors: themeColors } = useTheme();
  
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
            accessibilityLabel="Show sexual orientation toggle"
            accessibilityRole="switch"
            accessibilityState={{ checked: formData.showOrientation }}
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
            accessibilityLabel="Show gender toggle"
            accessibilityRole="switch"
            accessibilityState={{ checked: formData.showGender }}
          >
            <View style={[
              styles.toggleThumb,
              formData.showGender && styles.toggleThumbActive,
            ]} />
          </TouchableOpacity>
        </View>

        <View style={styles.toggleRow}>
          <View style={styles.toggleLabelContainer}>
            <View style={styles.premiumLabelContainer}>
              <Text style={styles.toggleLabel}>Incognito mode: Only show when I like someone</Text>
              <View style={styles.premiumBadge}>
                <Ionicons name="diamond" size={12} color={colors.accent.gold} />
                <Text style={styles.premiumText}>PREMIUM</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={[
              styles.toggleSwitch,
              styles.toggleSwitchDisabled,
            ]}
            onPress={() => {
              Alert.alert(
                'Premium Feature',
                'Incognito Mode is a premium feature. Upgrade to MoonMate Premium to use this feature.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Upgrade', onPress: () => {
                    // TODO: Navigate to premium upgrade screen
                    Alert.alert('Coming Soon', 'Premium upgrade will be available soon!');
                  }}
                ]
              );
            }}
            accessibilityLabel="Incognito mode premium toggle"
            accessibilityRole="button"
            accessibilityState={{ disabled: true }}
          >
            <View style={styles.toggleThumb} />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Consent</Text>

      {/* Consent checkboxes */}
      <View style={styles.inputGroup}>
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16, gap: 8, paddingVertical: 4 }}
          onPress={useCallback(() => updateFormData('acceptTerms', !formData.acceptTerms), [updateFormData, formData.acceptTerms])}
          activeOpacity={0.7}
          accessibilityLabel="Accept terms and conditions checkbox"
          accessibilityRole="checkbox"
          accessibilityState={{ checked: formData.acceptTerms }}
        >
          <View style={{
            width: 22,
            height: 22,
            borderRadius: 4,
            borderWidth: 2,
            borderColor: '#4B5563',
            backgroundColor: formData.acceptTerms ? '#8B5CF6' : '#1A1A2E',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 2,
            flexShrink: 0,
          }}>
            {formData.acceptTerms && (
              <Ionicons name="checkmark" size={16} color="#FFFFFF" />
            )}
          </View>
          <Text style={{ color: colors.text.primary, fontSize: 16, flex: 1, lineHeight: 24, fontWeight: '500' }}>
            I accept the community guidelines and terms of service
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16, gap: 8, paddingVertical: 4 }}
          onPress={useCallback(() => updateFormData('acceptPrivacy', !formData.acceptPrivacy), [updateFormData, formData.acceptPrivacy])}
          activeOpacity={0.7}
          accessibilityLabel="Accept privacy policy checkbox"
          accessibilityRole="checkbox"
          accessibilityState={{ checked: formData.acceptPrivacy }}
        >
          <View style={{
            width: 22,
            height: 22,
            borderRadius: 4,
            borderWidth: 2,
            borderColor: '#4B5563',
            backgroundColor: formData.acceptPrivacy ? '#8B5CF6' : '#1A1A2E',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 2,
            flexShrink: 0,
          }}>
            {formData.acceptPrivacy && (
              <Ionicons name="checkmark" size={16} color="#FFFFFF" />
            )}
          </View>
          <Text style={{ color: colors.text.primary, fontSize: 16, flex: 1, lineHeight: 24, fontWeight: '500' }}>
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
  toggleSwitchDisabled: {
    backgroundColor: colors.background.tertiary,
    opacity: 0.6,
  },
  toggleLabelContainer: {
    flex: 1,
    marginRight: spacing.md,
  },
  premiumLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent.gold + '20',
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 2,
  },
  premiumText: {
    ...typography.styles.caption,
    color: colors.accent.gold,
    fontWeight: typography.weights.bold,
    fontSize: 10,
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
    color: '#FFFFFF', // Force white color for visibility
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
