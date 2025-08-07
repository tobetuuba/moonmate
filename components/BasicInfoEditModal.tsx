import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacings';
import OptionGrid from './OptionGrid';

interface BasicInfoEditModalProps {
  visible: boolean;
  currentData: {
    height?: number;
    profession?: string;
    pronouns?: string;
  };
  onSave: (data: { height?: number; profession?: string; pronouns?: string }) => void;
  onClose: () => void;
}

const PRONOUN_OPTIONS = [
  { label: 'He/Him', value: 'he/him' },
  { label: 'She/Her', value: 'she/her' },
  { label: 'They/Them', value: 'they/them' },
  { label: 'Ze/Hir', value: 'ze/hir' },
  { label: 'Xe/Xem', value: 'xe/xem' },
  { label: 'Ey/Em', value: 'ey/em' },
  { label: 'Custom', value: 'custom' },
];

export default function BasicInfoEditModal({
  visible,
  currentData,
  onSave,
  onClose,
}: BasicInfoEditModalProps) {
  const [height, setHeight] = useState(currentData.height?.toString() || '');
  const [profession, setProfession] = useState(currentData.profession || '');
  const [pronouns, setPronouns] = useState(currentData.pronouns || '');

  const handleSave = () => {
    const updatedData = {
      height: height ? parseInt(height, 10) : undefined,
      profession: profession.trim() || undefined,
      pronouns: pronouns || undefined,
    };
    onSave(updatedData);
  };

  const handleClose = () => {
    // Reset to current data
    setHeight(currentData.height?.toString() || '');
    setProfession(currentData.profession || '');
    setPronouns(currentData.pronouns || '');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.cancelButton}>
            <Ionicons name="close" size={24} color={colors.text.secondary} />
          </TouchableOpacity>
          <Text style={styles.title}>Edit Basic Info</Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Height */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Height (cm)</Text>
            <TextInput
              style={styles.textInput}
              value={height}
              onChangeText={setHeight}
              placeholder="Enter your height in cm"
              placeholderTextColor={colors.text.tertiary}
              keyboardType="numeric"
              maxLength={3}
            />
          </View>

          {/* Profession */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Profession</Text>
            <TextInput
              style={styles.textInput}
              value={profession}
              onChangeText={setProfession}
              placeholder="What do you do for work?"
              placeholderTextColor={colors.text.tertiary}
              maxLength={50}
            />
          </View>

          {/* Pronouns */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pronouns</Text>
            <OptionGrid
              options={PRONOUN_OPTIONS}
              selectedValues={pronouns}
              onSelectionChange={setPronouns}
              multiSelect={false}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.styles.h4,
    color: colors.text.primary,
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
});
