import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacings';
import Button from './Button';
import { BioEditModalProps } from '../types/profile';
import { BIO_MAX_LENGTH } from '../constants/interests';

export default function BioEditModal({
  visible,
  bio,
  onSave,
  onClose,
}: BioEditModalProps) {
  const [bioText, setBioText] = useState(bio);
  const [isValid, setIsValid] = useState(true);
  const modalOpacity = useSharedValue(0);
  const modalScale = useSharedValue(0.8);

  useEffect(() => {
    if (visible) {
      setBioText(bio);
      modalOpacity.value = withTiming(1, { duration: 300 });
      modalScale.value = withSpring(1, { damping: 15 });
    } else {
      modalOpacity.value = withTiming(0, { duration: 200 });
      modalScale.value = withSpring(0.8, { damping: 15 });
    }
  }, [visible]);

  const handleTextChange = (text: string) => {
    setBioText(text);
    setIsValid(text.length <= BIO_MAX_LENGTH);
  };

  const handleSave = () => {
    if (!isValid) {
      Alert.alert('Error', `Bio cannot exceed ${BIO_MAX_LENGTH} characters.`);
      return;
    }
    
    if (bioText.trim() === '') {
      Alert.alert('Error', 'Bio cannot be empty.');
      return;
    }

    onSave(bioText.trim());
  };

  const handleClose = () => {
    modalOpacity.value = withTiming(0, { duration: 200 }, () => {
      runOnJS(onClose)();
    });
    modalScale.value = withSpring(0.8, { damping: 15 });
  };

  const animatedModalStyle = useAnimatedStyle(() => ({
    opacity: modalOpacity.value,
    transform: [{ scale: modalScale.value }],
  }));

  const animatedOverlayStyle = useAnimatedStyle(() => ({
    opacity: modalOpacity.value,
  }));

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <Animated.View style={[styles.overlay, animatedOverlayStyle]}>
          <Animated.View style={[styles.modalContent, animatedModalStyle]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Bio</Text>
              <TouchableOpacity
                onPress={handleClose}
                accessibilityLabel="Close modal"
                accessibilityRole="button"
              >
                <Ionicons name="close" size={24} color={colors.text.primary} />
              </TouchableOpacity>
            </View>
            
            <ScrollView 
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <TextInput
                style={[
                  styles.bioInput,
                  !isValid && styles.bioInputError,
                ]}
                value={bioText}
                onChangeText={handleTextChange}
                placeholder="Tell us about yourself..."
                placeholderTextColor={colors.text.tertiary}
                multiline
                maxLength={BIO_MAX_LENGTH}
                textAlignVertical="top"
                accessibilityLabel="Bio text input"
                accessibilityHint="Enter your bio description"
                autoFocus={true}
              />
            </ScrollView>
            
            <View style={styles.modalFooter}>
              <Text style={[
                styles.charCount,
                !isValid && styles.charCountError,
              ]}>
                {bioText.length}/{BIO_MAX_LENGTH}
              </Text>
              <Button
                title="Save"
                onPress={handleSave}
                size="small"
                disabled={!isValid || bioText.trim() === ''}
              />
            </View>
          </Animated.View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: colors.background.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background.secondary,
    borderTopLeftRadius: spacing.card.borderRadius,
    borderTopRightRadius: spacing.card.borderRadius,
    padding: spacing.lg,
    maxHeight: '80%',
    minHeight: 300,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  modalTitle: {
    ...typography.styles.h4,
    color: colors.text.primary,
  },
  bioInput: {
    ...typography.styles.body,
    color: colors.text.primary,
    backgroundColor: colors.background.tertiary,
    borderRadius: spacing.input.borderRadius,
    padding: spacing.md,
    minHeight: 150,
    maxHeight: 200,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.primary,
    textAlignVertical: 'top',
  },
  bioInputError: {
    borderColor: colors.accent.error,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  charCount: {
    ...typography.styles.caption,
    color: colors.text.tertiary,
  },
  charCountError: {
    color: colors.accent.error,
  },
}); 