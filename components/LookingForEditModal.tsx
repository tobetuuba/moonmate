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

interface LookingForEditModalProps {
  visible: boolean;
  currentData: {
    seeking?: string[];
    relationshipGoals?: string[];
    monogamy?: boolean;
    childrenPlan?: string;
  };
  onSave: (data: { 
    seeking?: string[]; 
    relationshipGoals?: string[]; 
    monogamy?: boolean; 
    childrenPlan?: string; 
  }) => void;
  onClose: () => void;
}

const SEEKING_OPTIONS = [
  { label: 'Woman', value: 'woman', icon: 'female' },
  { label: 'Man', value: 'man', icon: 'male' },
  { label: 'Non-binary', value: 'nonbinary', icon: 'person' },
  { label: 'Gender fluid', value: 'genderfluid', icon: 'person' },
  { label: 'Agender', value: 'agender', icon: 'person' },
  { label: 'Bigender', value: 'bigender', icon: 'person' },
  { label: 'Demiboy', value: 'demiboy', icon: 'person' },
  { label: 'Demigirl', value: 'demigirl', icon: 'person' },
  { label: 'Genderqueer', value: 'genderqueer', icon: 'person' },
  { label: 'Neutrois', value: 'neutrois', icon: 'person' },
  { label: 'Pangender', value: 'pangender', icon: 'person' },
  { label: 'Polygender', value: 'polygender', icon: 'person' },
  { label: 'Two-spirit', value: 'two-spirit', icon: 'person' },
  { label: 'Other', value: 'other', icon: 'person' },
  { label: 'Custom', value: 'custom', icon: 'heart' },
  { label: 'Everyone', value: 'everyone', icon: 'people' },
  { label: 'No preference', value: 'no-preference', icon: 'shuffle' },
  { label: 'Prefer not to say', value: 'no-answer', icon: 'help' },
];

const RELATIONSHIP_GOALS = [
  { label: 'Long-term relationship', value: 'long-term' },
  { label: 'Short-term relationship', value: 'short-term' },
  { label: 'Casual dating', value: 'casual' },
  { label: 'Friendship', value: 'friendship' },
  { label: 'Marriage', value: 'marriage' },
  { label: 'Not sure yet', value: 'unsure' },
];

const MONOGAMY_OPTIONS = [
  { label: 'Monogamous', value: true },
  { label: 'Open to non-monogamy', value: false },
];

const CHILDREN_OPTIONS = [
  { label: 'Want someday', value: 'want-someday' },
  { label: 'Want now', value: 'want-now' },
  { label: 'Don\'t want', value: 'dont-want' },
  { label: 'Have and want more', value: 'have-want-more' },
  { label: 'Have and don\'t want more', value: 'have-dont-want-more' },
  { label: 'Not sure', value: 'not-sure' },
];

export default function LookingForEditModal({
  visible,
  currentData,
  onSave,
  onClose,
}: LookingForEditModalProps) {
  const [seeking, setSeeking] = useState<string[]>(currentData.seeking || []);
  const [relationshipGoals, setRelationshipGoals] = useState<string[]>(currentData.relationshipGoals || []);
  const [monogamy, setMonogamy] = useState<boolean | undefined>(currentData.monogamy);
  const [childrenPlan, setChildrenPlan] = useState<string>(currentData.childrenPlan || '');

  const handleSave = () => {
    const updatedData = {
      seeking: seeking.length > 0 ? seeking : undefined,
      relationshipGoals: relationshipGoals.length > 0 ? relationshipGoals : undefined,
      monogamy: monogamy,
      childrenPlan: childrenPlan || undefined,
    };
    onSave(updatedData);
  };

  const handleClose = () => {
    // Reset to current data
    setSeeking(currentData.seeking || []);
    setRelationshipGoals(currentData.relationshipGoals || []);
    setMonogamy(currentData.monogamy);
    setChildrenPlan(currentData.childrenPlan || '');
    onClose();
  };

  const handleMonogamyChange = (value: any) => {
    setMonogamy(value);
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
          <Text style={styles.title}>Edit Looking For</Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Seeking */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Interested in</Text>
            <Text style={styles.sectionSubtitle}>Select all that apply</Text>
            <OptionGrid
              options={SEEKING_OPTIONS}
              selectedValues={seeking}
              onSelectionChange={setSeeking}
              multiSelect={true}
            />
          </View>

          {/* Relationship Goals */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Relationship goals</Text>
            <Text style={styles.sectionSubtitle}>What are you looking for?</Text>
            <OptionGrid
              options={RELATIONSHIP_GOALS}
              selectedValues={relationshipGoals}
              onSelectionChange={setRelationshipGoals}
              multiSelect={true}
            />
          </View>

          {/* Monogamy */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Relationship style</Text>
            <OptionGrid
              options={MONOGAMY_OPTIONS}
              selectedValues={monogamy}
              onSelectionChange={handleMonogamyChange}
              multiSelect={false}
            />
          </View>

          {/* Children Plan */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Children</Text>
            <OptionGrid
              options={CHILDREN_OPTIONS}
              selectedValues={childrenPlan}
              onSelectionChange={setChildrenPlan}
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
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.styles.h4,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    ...typography.styles.caption,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
});
