import React, { useCallback, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacings';
import FormError from '../FormError';

import { PromptOption } from '../../types/profile';

// Prompt options
const PROMPT_OPTIONS: PromptOption[] = [
  {
    id: 'ideal-date',
    question: 'What would your ideal first date be like?',
    icon: 'heart',
  },
  {
    id: 'life-goal',
    question: 'What\'s your biggest life goal?',
    icon: 'star',
  },
  {
    id: 'simple-pleasure',
    question: 'What simple thing makes you happiest?',
    icon: 'sunny',
  },
  {
    id: 'travel-dream',
    question: 'Where do you most want to travel?',
    icon: 'airplane',
  },
  {
    id: 'fun-fact',
    question: 'What\'s an interesting fact about you that people don\'t know?',
    icon: 'bulb',
  },
];

import { AboutPrompts } from '../../types/profile';

interface Step3AboutPromptsProps {
  formData: AboutPrompts;
  updateFormData: (field: keyof AboutPrompts, value: any) => void;
  errors?: any;
  touched?: Record<string, boolean>;
}

export default function Step3AboutPrompts({
  formData,
  updateFormData,
  errors = {},
  touched = {},
}: Step3AboutPromptsProps) {
  const bioInputRef = useRef<TextInput>(null);
  
  return (
    <KeyboardAvoidingView 
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>About You</Text>

      {/* Bio */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Tell us about yourself</Text>
        <Text style={styles.inputSubtitle}>
          Optional: Share your story, interests, and what you're looking for
        </Text>
        <TextInput
          ref={bioInputRef}
          style={[
            styles.textInput, 
            styles.textArea,
            errors.bio && touched.bio && styles.textInputError,
          ]}
          value={formData.bio}
          onChangeText={useCallback((text: string) => updateFormData('bio', text), [updateFormData])}
          placeholder="Tell us about yourself... (optional)"
          multiline
          numberOfLines={4}
          maxLength={500}
          placeholderTextColor={colors.text.tertiary}
          returnKeyType="next"
          blurOnSubmit={false}
          onSubmitEditing={() => {
            bioInputRef.current?.blur();
          }}
        />
        <Text style={styles.charCount}>{formData.bio.length}/500</Text>
        <FormError 
          error={errors.bio?.message} 
          touched={touched.bio} 
        />
      </View>

      <Text style={styles.sectionTitle}>Questions (Optional)</Text>
      
      {/* Prompts Error - Removed since prompts are now optional */}

      {/* Prompts */}
      {PROMPT_OPTIONS.map((prompt) => (
        <View key={prompt.id} style={styles.inputGroup}>
          <View style={styles.promptHeader}>
            <Ionicons name={prompt.icon as any} size={20} color={colors.primary[500]} />
            <Text style={styles.promptQuestion}>{prompt.question}</Text>
          </View>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            value={formData.prompts[prompt.id] || ''}
            onChangeText={useCallback((text: string) => updateFormData('prompts', {
              ...formData.prompts,
              [prompt.id]: text,
            }), [updateFormData, formData.prompts, prompt.id])}
            placeholder="Write your answer... (optional, max 225 characters)"
            multiline
            numberOfLines={3}
            maxLength={225}
            placeholderTextColor={colors.text.tertiary}
          />
          <Text style={styles.charCount}>
            {(formData.prompts[prompt.id] || '').length}/225
          </Text>
        </View>
      ))}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
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
  inputLabel: {
    ...typography.styles.body,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    fontWeight: typography.weights.medium,
  },
  inputSubtitle: {
    ...typography.styles.caption,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.border.secondary,
    borderRadius: spacing.input.borderRadius,
    padding: spacing.input.paddingHorizontal,
    backgroundColor: colors.background.secondary,
    color: colors.text.primary,
    ...typography.styles.input,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  charCount: {
    ...typography.styles.caption,
    color: colors.text.tertiary,
    textAlign: 'right',
    marginTop: spacing.xs,
  },
  promptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  promptQuestion: {
    ...typography.styles.body,
    color: colors.text.primary,
    fontWeight: typography.weights.medium,
  },
  textInputError: {
    borderColor: colors.accent.error,
  },
});
