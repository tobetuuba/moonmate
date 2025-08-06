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
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { signInWithEmailAndPassword, signInWithPhoneNumber } from 'firebase/auth';
import CountryPicker, { Country, CountryCode } from 'react-native-country-picker-modal';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { auth } from '../services/firebase';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacings';
import { texts } from '../constants/texts';
import Button from '../components/Button';
import Card from '../components/Card';

export default function LoginScreen() {
  const [mode, setMode] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  // Phone login states
  const [countryCode, setCountryCode] = useState<CountryCode>('TR');
  const [country, setCountry] = useState<Country | undefined>(undefined);
  const [withCountryNameButton] = useState(false);
  const [phone, setPhone] = useState('');
  const phoneInputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (mode === 'phone') {
      phoneInputRef.current?.focus();
    }
  }, [mode]);

  const onSelect = (selectedCountry: Country) => {
    setCountryCode(selectedCountry.cca2 as CountryCode);
    setCountry(selectedCountry);
    setPhone('');
    setError('');
  };

  const handlePhoneChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    setPhone(cleaned);
    setError('');
  };

  const getFullNumber = () => {
    const code = country?.callingCode?.[0] ? `+${country.callingCode[0]}` : '';
    return code + phone;
  };

  const validatePhoneNumber = () => {
    if (!country) return false;
    const fullNumber = getFullNumber();
    let parsed;
    try {
      parsed = parsePhoneNumberFromString(fullNumber, countryCode as any);
    } catch {
      return false;
    }
    return parsed?.isValid() || false;
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
                <CountryPicker
                  countryCode={countryCode}
                  withFilter
                  withFlag
                  withCallingCode
                  withEmoji
                  withCountryNameButton={withCountryNameButton}
                  onSelect={onSelect}
                  containerButtonStyle={styles.countryPickerButton}
                />
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
  countryPickerButton: {
    backgroundColor: 'transparent',
    paddingVertical: 0,
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
});