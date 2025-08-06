import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacings';
import Card from './Card';
import { ProfileSectionProps } from '../types/profile';

export default function ProfileSection({
  title,
  children,
  showEditButton = false,
  onEditPress,
  style,
}: ProfileSectionProps) {
  return (
    <Card variant="elevated" style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {showEditButton && (
          <TouchableOpacity
            style={styles.editButton}
            onPress={onEditPress}
            accessibilityLabel={`Edit ${title}`}
            accessibilityRole="button"
          >
            <Ionicons name="create-outline" size={20} color={colors.primary[500]} />
          </TouchableOpacity>
        )}
      </View>
      {children}
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.styles.h4,
    color: colors.text.primary,
  },
  editButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 