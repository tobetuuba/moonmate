import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { auth } from '../services/firebase';
import { createUserWithEmailAndPassword, signInAnonymously } from 'firebase/auth';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacings';
import { texts } from '../constants/texts';
import Button from '../components/Button';
import Card from '../components/Card';

// Simple country codes for phone input
const COUNTRY_CODES = [
  { code: 'TR', dialCode: '+90', flag: '🇹🇷' },
  { code: 'US', dialCode: '+1', flag: '🇺🇸' },
  { code: 'GB', dialCode: '+44', flag: '🇬🇧' },
  { code: 'DE', dialCode: '+49', flag: '🇩🇪' },
  { code: 'FR', dialCode: '+33', flag: '🇫🇷' },
  { code: 'IT', dialCode: '+39', flag: '🇮🇹' },
  { code: 'ES', dialCode: '+34', flag: '🇪🇸' },
  { code: 'NL', dialCode: '+31', flag: '🇳🇱' },
  { code: 'CA', dialCode: '+1', flag: '🇨🇦' },
  { code: 'AU', dialCode: '+61', flag: '🇦🇺' },
];

export default function SignUpScreen() {
  const [mode, setMode] = useState<'email' | 'phone'>('email');
  const [countryCode, setCountryCode] = useState('TR');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  const phoneInputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (mode === 'phone') {
      phoneInputRef.current?.focus();
    }
  }, [mode]);

  const onSelectCountry = (selectedCountry: string) => {
    setCountryCode(selectedCountry);
    setPhone('');
    setError('');
    setShowCountryPicker(false);
  };

  const getSelectedCountry = () => {
    return COUNTRY_CODES.find(c => c.code === countryCode) || COUNTRY_CODES[0];
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const validatePhone = (phone: string) => {
    return phone.length >= 10;
  };

  const handlePhoneSignUp = async () => {
    try {
      setError('');
      setIsLoading(true);

      if (!validatePhone(phone)) {
        setError('Please enter a valid phone number');
        return;
      }

      // For phone signup, we'll use anonymous authentication for now
      const userCredential = await signInAnonymously(auth);
      console.log('Anonymous signup successful:', userCredential.user.uid);
      
      Alert.alert('Success', 'Account created successfully!', [
        { text: 'OK', onPress: () => router.push('/create-profile-new') }
      ]);
    } catch (error: any) {
      console.error('Phone signup error:', error);
      setError(error.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleEmailSignUp = async () => {
    try {
      setError('');
      setIsLoading(true);

      if (!validateEmail(email)) {
        setError('Please enter a valid email address');
        return;
      }

      if (!validatePassword(password)) {
        setError('Password must be at least 6 characters long');
        return;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Email signup successful:', userCredential.user.uid);
      
      Alert.alert('Success', 'Account created successfully!', [
        { text: 'OK', onPress: () => router.push('/create-profile-new') }
      ]);
    } catch (error: any) {
      console.error('Email signup error:', error);
      
      let errorMessage = 'Failed to create account. Please try again.';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'An account with this email already exists. Please sign in instead.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please choose a stronger password.';
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => router.replace('/login');

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={colors.gradients.primary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <MaterialCommunityIcons name="star-four-points" size={48} color={colors.text.primary} />
          <Text style={styles.title}>{texts.app.name}</Text>
          <Text style={styles.subtitle}>{texts.auth.signup.subtitle}</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card variant="elevated" style={styles.formContainer}>
          {/* Mode Toggle */}
          <View style={styles.modeToggle}>
            <TouchableOpacity
              style={[styles.modeButton, mode === 'email' && styles.activeModeButton]}
              onPress={() => setMode('email')}
            >
              <Ionicons 
                name="mail" 
                size={20} 
                color={mode === 'email' ? colors.text.primary : colors.text.tertiary} 
              />
              <Text style={[styles.modeText, mode === 'email' && styles.activeModeText]}>
                Email
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.modeButton, mode === 'phone' && styles.activeModeButton]}
              onPress={() => setMode('phone')}
            >
              <Ionicons 
                name="call" 
                size={20} 
                color={mode === 'phone' ? colors.text.primary : colors.text.tertiary} 
              />
              <Text style={[styles.modeText, mode === 'phone' && styles.activeModeText]}>
                Phone
              </Text>
            </TouchableOpacity>
          </View>

          {error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={16} color={colors.accent.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {mode === 'email' ? (
            // Email Signup Form
            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Ionicons name="mail" size={20} color={colors.text.tertiary} style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder={texts.auth.signup.email}
                  placeholderTextColor={colors.text.tertiary}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed" size={20} color={colors.text.tertiary} style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder={texts.auth.signup.password}
                  placeholderTextColor={colors.text.tertiary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.passwordToggle}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color={colors.text.tertiary}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed" size={20} color={colors.text.tertiary} style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder={texts.auth.signup.confirmPassword}
                  placeholderTextColor={colors.text.tertiary}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.passwordToggle}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Ionicons
                    name={showConfirmPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color={colors.text.tertiary}
                  />
                </TouchableOpacity>
              </View>

              <Button
                title={texts.auth.signup.createAccount}
                onPress={handleEmailSignUp}
                loading={isLoading}
                style={styles.signUpButton}
              />
            </View>
          ) : (
            // Phone Signup Form
            <View style={styles.form}>
              <View style={styles.phoneContainer}>
                <TouchableOpacity
                  style={styles.countryCodeButton}
                  onPress={() => setShowCountryPicker(true)}
                >
                  <Text style={styles.countryCodeText}>
                    {getSelectedCountry().flag} {getSelectedCountry().dialCode}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color={colors.text.tertiary} />
                </TouchableOpacity>
                <TextInput
                  ref={phoneInputRef}
                  style={styles.phoneInput}
                  placeholder="Phone number"
                  placeholderTextColor={colors.text.tertiary}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  autoComplete="tel"
                />
              </View>

                {/* Country Picker Modal */}
                <Modal
                  visible={showCountryPicker}
                  transparent
                  animationType="slide"
                  onRequestClose={() => setShowCountryPicker(false)}
                >
                  <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                      <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Select Country</Text>
                        <TouchableOpacity
                          onPress={() => setShowCountryPicker(false)}
                          style={styles.closeButton}
                        >
                          <Ionicons name="close" size={24} color={colors.text.primary} />
                        </TouchableOpacity>
                      </View>
                      <ScrollView style={styles.countryList}>
                        {COUNTRY_CODES.map((country) => (
                          <TouchableOpacity
                            key={country.code}
                            style={[
                              styles.countryItem,
                              countryCode === country.code && styles.countryItemSelected,
                            ]}
                            onPress={() => onSelectCountry(country.code)}
                          >
                            <Text style={styles.countryFlag}>{country.flag}</Text>
                            <Text style={[
                              styles.countryText,
                              countryCode === country.code && styles.countryTextSelected,
                            ]}>
                              {country.dialCode}
                            </Text>
                            {countryCode === country.code && (
                              <Ionicons name="checkmark" size={20} color={colors.primary[500]} />
                            )}
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  </View>
                </Modal>

              <Button
                title="Create Account"
                onPress={handlePhoneSignUp}
                loading={isLoading}
                style={styles.signUpButton}
              />
            </View>
          )}

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <Button
            title={texts.auth.signup.signIn}
            onPress={handleBackToLogin}
            variant="outline"
            style={styles.loginButton}
          />
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
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
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.styles.body,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  formContainer: {
    padding: spacing.lg,
  },
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: colors.background.tertiary,
    borderRadius: spacing.button.borderRadius,
    padding: spacing.xs,
    marginBottom: spacing.md,
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    borderRadius: spacing.button.borderRadius - 2,
  },
  activeModeButton: {
    backgroundColor: colors.primary[500],
  },
  modeText: {
    ...typography.styles.buttonSmall,
    color: colors.text.tertiary,
    marginLeft: spacing.xs,
  },
  activeModeText: {
    color: colors.text.primary,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent.error + '20',
    padding: spacing.sm,
    borderRadius: spacing.xs,
    marginBottom: spacing.md,
  },
  errorText: {
    ...typography.styles.bodySmall,
    color: colors.accent.error,
    marginLeft: spacing.xs,
  },
  form: {
    gap: spacing.md,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.tertiary,
    borderRadius: spacing.input.borderRadius,
    paddingHorizontal: spacing.input.paddingHorizontal,
    paddingVertical: spacing.input.paddingVertical,
  },
  inputIcon: {
    marginRight: spacing.sm,
  },
  textInput: {
    flex: 1,
    ...typography.styles.input,
    color: colors.text.primary,
  },
  passwordToggle: {
    padding: spacing.xs,
  },
  signUpButton: {
    marginTop: spacing.sm,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.tertiary,
    borderRadius: spacing.input.borderRadius,
    paddingHorizontal: spacing.input.paddingHorizontal,
    paddingVertical: spacing.input.paddingVertical,
  },
  countryCodeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: spacing.button.borderRadius - 2,
    backgroundColor: colors.primary[50],
    marginRight: spacing.sm,
  },
  countryCodeText: {
    ...typography.styles.buttonSmall,
    color: colors.text.primary,
    marginRight: spacing.xs,
  },
  phoneInput: {
    flex: 1,
    ...typography.styles.input,
    color: colors.text.primary,
    marginLeft: spacing.sm,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border.primary,
  },
  dividerText: {
    ...typography.styles.bodySmall,
    color: colors.text.tertiary,
    marginHorizontal: spacing.md,
  },
  loginButton: {
    marginTop: spacing.sm,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: colors.background.primary,
    borderRadius: spacing.lg,
    width: '80%',
    maxHeight: '70%',
    padding: spacing.md,
    alignItems: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: spacing.md,
  },
  modalTitle: {
    ...typography.styles.h2,
    color: colors.text.primary,
  },
  closeButton: {
    padding: spacing.xs,
  },
  countryList: {
    width: '100%',
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: spacing.xs,
    marginBottom: spacing.xs,
  },
  countryItemSelected: {
    backgroundColor: colors.primary[100],
  },
  countryFlag: {
    fontSize: 24,
    marginRight: spacing.sm,
  },
  countryText: {
    ...typography.styles.buttonSmall,
    color: colors.text.primary,
    flex: 1,
  },
  countryTextSelected: {
    color: colors.primary[500],
  },
});
