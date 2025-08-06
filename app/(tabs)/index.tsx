import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacings';
import { texts } from '../../constants/texts';
import { features } from '../../constants/features';
import Button from '../../components/Button';
import Card from '../../components/Card';

export default function HomeScreen() {
  const navigateToVisualMatch = () => {
    router.push('/visual-match');
  };

  const navigateToZodiac = () => {
    // TODO: Implement premium feature check
    console.log('Zodiac Match - Premium feature');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={colors.gradients.primary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}>
        <View style={styles.header}>
          <Text style={styles.title}>{texts.app.name}</Text>
          <Text style={styles.subtitle}>{texts.app.tagline}</Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Ionicons name="star" size={32} color={colors.primary[500]} />
          <Text style={styles.welcomeText}>
            Welcome to a new way of dating. Choose how you'd like to connect:
          </Text>
        </View>

        {/* Options Container */}
        <View style={styles.optionsContainer}>
          {/* Visual Match */}
          <TouchableOpacity style={styles.optionCard} onPress={navigateToVisualMatch}>
            <LinearGradient
              colors={colors.gradients.primary}
              style={styles.optionGradient}>
              <Ionicons name="heart" size={40} color={colors.text.primary} />
              <Text style={styles.optionTitle}>{texts.matching.visual.title}</Text>
              <Text style={styles.optionDescription}>
                {texts.matching.visual.subtitle}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Zodiac Match - Disabled */}
          <TouchableOpacity 
            style={[styles.optionCard, styles.disabledCard]} 
            onPress={navigateToZodiac}
            disabled={!features.premium.zodiacMatch}
          >
            <LinearGradient
              colors={features.premium.zodiacMatch ? colors.gradients.secondary : [colors.accent.silver, colors.accent.silver]}
              style={styles.optionGradient}>
              <MaterialIcons name="stars" size={40} color={colors.text.primary} />
              <Text style={styles.optionTitle}>{texts.matching.zodiac.title}</Text>
              <Text style={styles.optionDescription}>
                {texts.matching.zodiac.subtitle}
              </Text>
              {!features.premium.zodiacMatch && (
                <View style={styles.premiumBadge}>
                  <Text style={styles.premiumText}>{texts.matching.zodiac.comingSoon}</Text>
                </View>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Stats Container */}
        <Card variant="elevated" style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>10K+</Text>
            <Text style={styles.statLabel}>Meaningful Matches</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>85%</Text>
            <Text style={styles.statLabel}>Compatibility Rate</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>24/7</Text>
            <Text style={styles.statLabel}>AI Support</Text>
          </View>
        </Card>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  headerGradient: {
    paddingTop: spacing.layout.header,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  header: {
    alignItems: 'center',
  },
  title: {
    ...typography.styles.h1,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.styles.body,
    color: colors.text.secondary,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  welcomeText: {
    ...typography.styles.body,
    color: colors.text.tertiary,
    textAlign: 'center',
    marginTop: spacing.md,
    lineHeight: typography.lineHeights.normal,
  },
  optionsContainer: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  optionCard: {
    borderRadius: spacing.card.borderRadius,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: colors.primary[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  disabledCard: {
    opacity: 0.6,
  },
  optionGradient: {
    padding: spacing.lg,
    alignItems: 'center',
    minHeight: 160,
    justifyContent: 'center',
    position: 'relative',
  },
  optionTitle: {
    ...typography.styles.h4,
    color: colors.text.primary,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  optionDescription: {
    ...typography.styles.bodySmall,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: typography.lineHeights.normal,
  },
  premiumBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.accent.gold,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.xs,
  },
  premiumText: {
    ...typography.styles.caption,
    color: colors.text.primary,
    fontWeight: typography.weights.semibold,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: spacing.md,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    ...typography.styles.h3,
    color: colors.primary[500],
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...typography.styles.caption,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
});