import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacings';

interface DatePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (date: Date) => void;
  currentDate?: Date;
  title?: string;
}

export default function DatePickerModal({
  visible,
  onClose,
  onConfirm,
  currentDate = new Date(),
  title = 'Select Date',
}: DatePickerModalProps) {
  const [selectedDate, setSelectedDate] = useState(currentDate);

  const handleConfirm = () => {
    onConfirm(selectedDate);
    onClose();
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={colors.text.primary} />
            </TouchableOpacity>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={handleConfirm} style={styles.confirmButton}>
              <Text style={styles.confirmText}>Done</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.pickerContainer}>
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="spinner"
              onChange={(event, date) => {
                if (date) {
                  setSelectedDate(date);
                }
              }}
              maximumDate={new Date()}
              minimumDate={new Date(1900, 0, 1)}
              textColor={colors.text.primary}
              style={styles.picker}
            />
          </View>

          <View style={styles.preview}>
            <Text style={styles.previewLabel}>Selected Date:</Text>
            <Text style={styles.previewDate}>{formatDate(selectedDate)}</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.background.overlay,
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: colors.background.secondary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.secondary,
  },
  closeButton: {
    padding: spacing.sm,
  },
  title: {
    ...typography.styles.h4,
    color: colors.text.primary,
    fontWeight: typography.weights.semibold,
  },
  confirmButton: {
    padding: spacing.sm,
  },
  confirmText: {
    ...typography.styles.body,
    color: colors.primary[500],
    fontWeight: typography.weights.semibold,
  },
  pickerContainer: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  picker: {
    width: 300,
    height: 200,
  },
  preview: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    alignItems: 'center',
  },
  previewLabel: {
    ...typography.styles.body,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  previewDate: {
    ...typography.styles.h4,
    color: colors.text.primary,
    fontWeight: typography.weights.semibold,
  },
});
