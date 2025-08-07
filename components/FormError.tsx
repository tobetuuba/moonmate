import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacings';

interface FormErrorProps {
  error?: string | { message?: string };
  touched?: boolean;
}

export default function FormError({ error, touched }: FormErrorProps) {
  // Handle both string and object error types
  const errorMessage = typeof error === 'string' ? error : error?.message;
  
  if (!errorMessage || !touched) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Ionicons name="alert-circle" size={14} color={colors.accent.error} />
      <Text style={styles.errorText}>{errorMessage}</Text>
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
