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
import { signInWithEmailAndPassword, signInWithPhoneNumber } from 'firebase/auth';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { auth } from '../services/firebase';
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

export default function LoginScreen() {
  const [mode, setMode] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  // Phone login states
  const [countryCode, setCountryCode] = useState('TR');
  const [phone, setPhone] = useState('');
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

  const handlePhoneChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    setPhone(cleaned);
    setError('');
  };

  const getFullNumber = () => {
    const country = getSelectedCountry();
    return country.dialCode + phone;
  };

  const validatePhoneNumber = () => {
    const fullNumber = getFullNumber();
    return phone.length >= 10;
  };

  const handleEmailLogin = async () => {
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }
    setIsLoading(true);
    setError('');
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsLoading(false);
      router.replace('/(tabs)');
    } catch (error: any) {
      setIsLoading(false);
      console.error('Login error:', error);
      
      // Handle specific Firebase auth errors
      let errorMessage = 'Failed to sign in. Please try again.';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address. Please sign up first.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please check your password and try again.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address. Please enter a valid email.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later.';
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = 'This account has been disabled. Please contact support.';
      }
      
      setError(errorMessage);
    }
  };

  const handlePhoneLogin = async () => {
    if (!validatePhoneNumber()) {
      setError('Please enter a valid phone number');
      return;
    }
    setIsLoading(true);
    setError('');
    
    try {
      const fullNumber = getFullNumber();
      await signInWithPhoneNumber(auth, fullNumber);
      setIsLoading(false);
      router.replace('/(tabs)');
    } catch (error: any) {
      setIsLoading(false);
      console.error('Phone login error:', error);
      setError('Failed to send verification code. Please try again.');
    }
  };

  const handleSignUp = () => {
    router.push('/signup');
  };

  const handleForgotPassword = () => {
    // TODO: Implement forgot password
    Alert.alert('Coming Soon', 'Password reset feature will be available soon.');
  };

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
          <Text style={styles.subtitle}>{texts.auth.login.subtitle}</Text>
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
            // Email Login Form
            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Ionicons name="mail" size={20} color={colors.text.tertiary} style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder={texts.auth.login.email}
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
                  placeholder={texts.auth.login.password}
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

              <TouchableOpacity style={styles.forgotPassword} onPress={handleForgotPassword}>
                <Text style={styles.forgotPasswordText}>{texts.auth.login.forgotPassword}</Text>
              </TouchableOpacity>

              <Button
                title={texts.auth.login.signIn}
                onPress={handleEmailLogin}
                loading={isLoading}
                style={styles.loginButton}
              />
            </View>
          ) : (
            // Phone Login Form
            <View style={styles.form}>
              <View style={styles.phoneContainer}>
                <TouchableOpacity
                  style={styles.countryCodeButton}
                  onPress={() => setShowCountryPicker(true)}
                >
                  <Text style={styles.countryCodeText}>
                    {getSelectedCountry().flag} {getSelectedCountry().dialCode}
                  </Text>
                </TouchableOpacity>
                <TextInput
                  ref={phoneInputRef}
                  style={styles.phoneInput}
                  placeholder="Enter phone number"
                  placeholderTextColor={colors.text.tertiary}
                  value={phone}
                  onChangeText={handlePhoneChange}
                  keyboardType="phone-pad"
                />
              </View>

              <Button
                title="Send Code"
                onPress={handlePhoneLogin}
                loading={isLoading}
                style={styles.loginButton}
              />
            </View>
          )}

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <Button
            title={texts.auth.login.signUp}
            onPress={handleSignUp}
            variant="outline"
            style={styles.signUpButton}
          />
        </Card>
      </ScrollView>

      <Modal
        visible={showCountryPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCountryPicker(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowCountryPicker(false)}
        >
          <View style={styles.countryPickerModal}>
            <Text style={styles.modalTitle}>Select Country</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {COUNTRY_CODES.map((country) => (
                <TouchableOpacity
                  key={country.code}
                  style={styles.countryPickerItem}
                  onPress={() => onSelectCountry(country.code)}
                >
                  <Text style={styles.countryPickerItemText}>
                    {country.flag} {country.dialCode}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
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
  forgotPassword: {
    alignSelf: 'flex-end',
  },
  forgotPasswordText: {
    ...typography.styles.bodySmall,
    color: colors.primary[500],
  },
  loginButton: {
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
    backgroundColor: colors.primary[100],
    borderRadius: spacing.button.borderRadius,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginRight: spacing.sm,
  },
  countryCodeText: {
    ...typography.styles.buttonSmall,
    color: colors.text.primary,
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
  signUpButton: {
    marginTop: spacing.sm,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  countryPickerModal: {
    backgroundColor: colors.background.primary,
    borderRadius: spacing.md,
    width: '80%',
    padding: spacing.lg,
    alignItems: 'center',
  },
  modalTitle: {
    ...typography.styles.h2,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  countryPickerItem: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    width: '100%',
    alignItems: 'center',
  },
  countryPickerItemText: {
    ...typography.styles.body,
    color: colors.text.primary,
  },
});