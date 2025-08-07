import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacings';

interface FormErrorProps {
  error?: string;
  touched?: boolean;
}

export default function FormError({ error, touched }: FormErrorProps) {
  if (!error || !touched) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Ionicons name="alert-circle" size={14} color={colors.accent.error} />
      <Text style={styles.errorText}>{error}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    gap: spacing.xs,
  },
  errorText: {
    ...typography.styles.caption,
    color: colors.accent.error,
    flex: 1,
  },
});
