import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacings';
import OptionGrid from './OptionGrid';

interface LifestyleEditModalProps {
  visible: boolean;
  currentData: {
    smoking?: string;
    drinking?: string;
    diet?: string;
    exercise?: string;
  };
  onSave: (data: { smoking?: string; drinking?: string; diet?: string; exercise?: string }) => void;
  onClose: () => void;
}

const SMOKING_OPTIONS = [
  { label: 'Never', value: 'never' },
  { label: 'Socially', value: 'socially' },
  { label: 'Regularly', value: 'regularly' },
  { label: 'Trying to quit', value: 'trying-to-quit' },
];

const DRINKING_OPTIONS = [
  { label: 'Never', value: 'never' },
  { label: 'Rarely', value: 'rarely' },
  { label: 'Socially', value: 'socially' },
  { label: 'Regularly', value: 'regularly' },
];

const DIET_OPTIONS = [
  { label: 'Omnivore', value: 'omnivore' },
  { label: 'Vegetarian', value: 'vegetarian' },
  { label: 'Vegan', value: 'vegan' },
  { label: 'Pescatarian', value: 'pescatarian' },
  { label: 'Keto', value: 'keto' },
  { label: 'Paleo', value: 'paleo' },
  { label: 'Other', value: 'other' },
];

const EXERCISE_OPTIONS = [
  { label: 'Never', value: 'never' },
  { label: 'Rarely', value: 'rarely' },
  { label: 'Sometimes', value: 'sometimes' },
  { label: 'Regularly', value: 'regularly' },
  { label: 'Daily', value: 'daily' },
];

export default function LifestyleEditModal({
  visible,
  currentData,
  onSave,
  onClose,
}: LifestyleEditModalProps) {
  const [smoking, setSmoking] = useState(currentData.smoking || '');
  const [drinking, setDrinking] = useState(currentData.drinking || '');
  const [diet, setDiet] = useState(currentData.diet || '');
  const [exercise, setExercise] = useState(currentData.exercise || '');

  const handleSave = () => {
    const updatedData = {
      smoking: smoking || undefined,
      drinking: drinking || undefined,
      diet: diet || undefined,
      exercise: exercise || undefined,
    };
    onSave(updatedData);
  };

  const handleClose = () => {
    // Reset to current data
    setSmoking(currentData.smoking || '');
    setDrinking(currentData.drinking || '');
    setDiet(currentData.diet || '');
    setExercise(currentData.exercise || '');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.cancelButton}>
            <Ionicons name="close" size={24} color={colors.text.secondary} />
          </TouchableOpacity>
          <Text style={styles.title}>Edit Lifestyle</Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Smoking */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Smoking</Text>
            <OptionGrid
              options={SMOKING_OPTIONS}
              selectedValues={smoking}
              onSelectionChange={setSmoking}
              multiSelect={false}
            />
          </View>

          {/* Drinking */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Drinking</Text>
            <OptionGrid
              options={DRINKING_OPTIONS}
              selectedValues={drinking}
              onSelectionChange={setDrinking}
              multiSelect={false}
            />
          </View>

          {/* Diet */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Diet</Text>
            <OptionGrid
              options={DIET_OPTIONS}
              selectedValues={diet}
              onSelectionChange={setDiet}
              multiSelect={false}
            />
          </View>

          {/* Exercise */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Exercise</Text>
            <OptionGrid
              options={EXERCISE_OPTIONS}
              selectedValues={exercise}
              onSelectionChange={setExercise}
              multiSelect={false}
            />
          </View>
        </ScrollView>
      </View>
    </Modal>
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
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.secondary,
  },
  cancelButton: {
    padding: spacing.xs,
  },
  title: {
    ...typography.styles.h3,
    color: colors.text.primary,
  },
  saveButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.primary[500],
    borderRadius: spacing.input.borderRadius,
  },
  saveButtonText: {
    ...typography.styles.button,
    color: colors.primary.contrast,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.styles.h4,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
});
