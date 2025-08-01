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
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsLoading(false);
      router.replace('/(tabs)');
    } catch (error) {
      setIsLoading(false);
      const message = (error instanceof Error && error.message) ? error.message : 'Failed to sign in';
      setError(message);
      Alert.alert('Error', message);
    }
  };

  const handlePhoneLogin = async () => {
    if (!country) {
      setError('Please select a country');
      return;
    }
    if (!phone) {
      setError('Please enter your phone number');
      return;
    }
    if (!validatePhoneNumber()) {
      setError('Please enter a valid phone number');
      return;
    }
    setIsLoading(true);
    try {
      const fullNumber = getFullNumber();
      await signInWithPhoneNumber(auth, fullNumber);
      setIsLoading(false);
      router.push({ pathname: '/verify', params: { phone: fullNumber } });
    } catch (error) {
      setIsLoading(false);
      const message = (error instanceof Error && error.message) ? error.message : 'Failed to send verification code';
      setError(message);
      Alert.alert('Error', message);
    }
  };

  const handleSignUp = () => {
    router.push('/signup');
  };

  const handleForgotPassword = () => {
    Alert.alert('Coming Soon', 'Password reset functionality will be available soon!');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ flex: 1 }}>
          <LinearGradient
            colors={['#8B5FBF', '#E91E63']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerGradient}>
            <View style={styles.header}>
              <TouchableOpacity onPress={handleSignUp} style={styles.backButton}>
                <Feather name="arrow-left" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <View style={styles.logoContainer}>
                <Ionicons name="heart" size={40} color="#FFFFFF" />
                <MaterialCommunityIcons name="star-four-points" size={24} color="#FFFFFF" style={styles.sparkleIcon} />
              </View>
              <Text style={styles.title}>MoonMate</Text>
              <Text style={styles.subtitle}>Sign in to your account</Text>
            </View>
          </LinearGradient>

          <View style={styles.toggleRow}>
            <TouchableOpacity onPress={() => setMode('email')} style={[styles.toggleButton, mode === 'email' && styles.toggleActive]}>
              <Text style={styles.toggleText}>Email</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setMode('phone')} style={[styles.toggleButton, mode === 'phone' && styles.toggleActive]}>
              <Text style={styles.toggleText}>Phone</Text>
            </TouchableOpacity>
          </View>
          {mode === 'email' ? (
            <View style={styles.formContainer}>
              <Text style={styles.welcomeText}>Welcome back!</Text>
              <Text style={styles.descriptionText}>
                Sign in to continue your journey of meaningful connections
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}>
                {showPassword ? (
                  <Feather name="eye-off" size={20} color="#9CA3AF" />
                ) : (
                  <Feather name="eye" size={20} color="#9CA3AF" />
                )}
              </TouchableOpacity>
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
              <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot password?</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                onPress={handleEmailLogin}
                disabled={isLoading}>
                <LinearGradient
                  colors={['#8B5FBF', '#E91E63']}
                  style={styles.loginButtonGradient}>
                  <Text style={styles.loginButtonText}>
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.formContainer}>
              <Text style={styles.welcomeText}>Welcome back!</Text>
              <Text style={styles.descriptionText}>
                Sign in to continue your journey of meaningful connections
              </Text>
              <View style={styles.inputContainer}>
                <View style={styles.countryPhoneRow}>
                  <CountryPicker
                    countryCode={countryCode as CountryCode}
                    withFilter
                    withFlag
                    withCallingCode
                    withEmoji
                    withCountryNameButton={withCountryNameButton}
                    onSelect={onSelect}
                    containerButtonStyle={styles.countryPicker}
                  />
                  <View style={styles.callingCodeBox}>
                    <Text style={styles.callingCodeText}>
                      {country?.callingCode ? `+${country.callingCode[0]}` : '+90'}
                    </Text>
                  </View>
                  <TextInput
                    ref={phoneInputRef}
                    style={[styles.input, { flex: 1, marginBottom: 0 }]}
                    placeholder="Phone number"
                    placeholderTextColor="#9CA3AF"
                    value={phone}
                    onChangeText={handlePhoneChange}
                    keyboardType="phone-pad"
                    autoCapitalize="none"
                    autoCorrect={false}
                    maxLength={15}
                    returnKeyType="done"
                  />
                </View>
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
              </View>
              <TouchableOpacity
                style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                onPress={handlePhoneLogin}
                disabled={isLoading}>
                <LinearGradient
                  colors={['#8B5FBF', '#E91E63']}
                  style={styles.loginButtonGradient}>
                  <Text style={styles.loginButtonText}>
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.divider} />
          </View>
          <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
            <Text style={styles.signUpButtonText}>
              Don't have an account? <Text style={styles.signUpLink}>Sign up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContainer: {
    flexGrow: 1,
    minHeight: '100%',
  },
  headerGradient: {
    width: '100%',
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  header: {
    alignItems: 'center',
    width: '100%',
    gap: 2,
  },
  backButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    padding: 8,
  },
  logoContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  sparkleIcon: {
    position: 'absolute',
    top: -8,
    right: -8,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.85,
    textAlign: 'center',
    marginBottom: 8,
  },
  toggleRow: { flexDirection: 'row', justifyContent: 'center', marginVertical: 24 },
  toggleButton: { padding: 12, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  toggleActive: { borderBottomColor: '#8B5FBF' },
  toggleText: { fontSize: 16, color: '#8B5FBF', fontWeight: 'bold' },
  formContainer: {
    width: '92%',
    backgroundColor: 'transparent',
    alignSelf: 'center',
    marginTop: 12,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  descriptionText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  inputContainer: {
    width: '100%',
    gap: 8,
    marginBottom: 16,
  },
  input: {
    fontSize: 16,
    color: '#1F2937',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
    alignSelf: 'center',
    width: '100%',
    maxWidth: 320,
  },
  eyeIcon: {
    padding: 4,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 2,
    marginBottom: 8,
    marginRight: 4,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#8B5FBF',
    fontWeight: '600',
  },
  loginButton: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 1,
    shadowColor: '#8B5FBF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 3,
    width: '100%',
    maxWidth: 320,
    alignSelf: 'center',
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    width: '100%',
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 14,
    color: '#9CA3AF',
  },
  signUpButton: {
    alignItems: 'center',
    marginVertical: 4,
  },
  signUpButtonText: {
    fontSize: 16,
    color: '#6B7280',
  },
  signUpLink: {
    color: '#8B5FBF',
    fontWeight: 'bold',
  },
  countryPhoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    width: '100%',
    maxWidth: 320,
    alignSelf: 'center',
  },
  countryPicker: {
    marginRight: 8,
  },
  callingCodeBox: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 10,
    marginRight: 8,
    minWidth: 48,
    alignItems: 'center',
  },
  callingCodeText: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: 'bold',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    marginTop: 4,
    marginBottom: 4,
    textAlign: 'center',
  },
});