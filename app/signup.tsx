import React, { useState, useEffect, useRef } from 'react';
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
import { auth } from '../services/firebase';
import { signInWithPhoneNumber, RecaptchaVerifier, createUserWithEmailAndPassword } from 'firebase/auth'; // NEW: For email sign up
import CountryPicker, { Country, CountryCode } from 'react-native-country-picker-modal'; // NEW: Country picker
import { parsePhoneNumberFromString } from 'libphonenumber-js'; // NEW: Phone validation

export default function SignUpScreen() {
  const [mode, setMode] = useState<'email' | 'phone'>('email'); // NEW: toggle state
  const [countryCode, setCountryCode] = useState<CountryCode>('TR'); // Default to Turkey
  const [country, setCountry] = useState<Country | undefined>(undefined);
  const [withCountryNameButton] = useState(false);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const phoneInputRef = useRef<TextInput>(null); // For autofocus

  useEffect(() => {
    // Autofocus phone input on mount
    phoneInputRef.current?.focus();
  }, []);

  const onSelect = (selectedCountry: Country) => {
    setCountryCode(selectedCountry.cca2 as CountryCode);
    setCountry(selectedCountry);
    setPhone(''); // Clear phone when country changes
    setError('');
  };

  const handlePhoneChange = (text: string) => {
    // Remove all non-numeric characters
    const cleaned = text.replace(/[^0-9]/g, '');
    setPhone(cleaned);
    setError('');
  };

  const getFullNumber = () => {
    // Always prepend country calling code
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

  const handleSignUp = async () => {
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
      const confirmation = await signInWithPhoneNumber(auth, fullNumber);
      setIsLoading(false);
      router.push({ pathname: '/verify', params: { phone: fullNumber } });
    } catch (error) {
      setIsLoading(false);
      const message = (error instanceof Error && error.message) ? error.message : 'Failed to send verification code';
      setError(message);
      Alert.alert('Error', message);
    }
  };

  const handleEmailSignUp = async () => {
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }
    setIsLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setIsLoading(false);
      router.replace('/(tabs)');
    } catch (error) {
      setIsLoading(false);
      const message = (error instanceof Error && error.message) ? error.message : 'Failed to sign up';
      setError(message);
      Alert.alert('Error', message);
    }
  };

  const handleBackToLogin = () => {
    router.replace('/login');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <LinearGradient
          colors={['#8B5FBF', '#E91E63']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBackToLogin} style={styles.backButton}>
              <Feather name="arrow-left" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.logoContainer}>
              <Ionicons name="heart" size={40} color="#FFFFFF" />
              <MaterialCommunityIcons name="star-four-points" size={24} color="#FFFFFF" style={styles.sparkleIcon} />
            </View>
            <Text style={styles.title}>MoonMate</Text>
            <Text style={styles.subtitle}>Sign up with your phone number</Text>
          </View>
        </LinearGradient>

        <View style={styles.toggleRow}>
          <TouchableOpacity onPress={() => setMode('email')} style={[styles.toggleButton, mode === 'email' && styles.toggleActive]}>
            <Text style={styles.toggleText}>E-posta ile</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setMode('phone')} style={[styles.toggleButton, mode === 'phone' && styles.toggleActive]}>
            <Text style={styles.toggleText}>Telefon ile</Text>
          </TouchableOpacity>
        </View>
        {mode === 'email' ? (
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="E-posta"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Şifre"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <TouchableOpacity style={styles.signUpButton} onPress={handleEmailSignUp} disabled={isLoading}>
              <LinearGradient colors={['#8B5FBF', '#E91E63']} style={styles.signUpButtonGradient}>
                <Text style={styles.signUpButtonText}>{isLoading ? 'Kayıt Olunuyor...' : 'Kayıt Ol'}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <View style={styles.countryPhoneRow}>
                <CountryPicker
                  countryCode={countryCode}
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
                  style={styles.input}
                  placeholder="Telefon numarası"
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
            <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp} disabled={isLoading}>
              <LinearGradient colors={['#8B5FBF', '#E91E63']} style={styles.signUpButtonGradient}>
                <Text style={styles.signUpButtonText}>{isLoading ? 'Kayıt Olunuyor...' : 'Kayıt Ol'}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.divider} />
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleBackToLogin}>
            <Text style={styles.loginButtonText}>
              Already have an account? <Text style={styles.loginLink}>Sign in</Text>
            </Text>
          </TouchableOpacity>
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
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 60,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
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
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
    padding: 24,
    paddingTop: 40,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  descriptionText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  inputContainer: {
    gap: 16,
    marginBottom: 32,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  signUpButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
    elevation: 4,
    shadowColor: '#8B5FBF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  signUpButtonDisabled: {
    opacity: 0.7,
  },
  signUpButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  signUpButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: '#9CA3AF',
  },
  loginButton: {
    alignItems: 'center',
    marginBottom: 24,
  },
  loginButtonText: {
    fontSize: 16,
    color: '#6B7280',
  },
  loginLink: {
    color: '#8B5FBF',
    fontWeight: 'bold',
  },
  countryPhoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
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
  toggleRow: { flexDirection: 'row', justifyContent: 'center', marginVertical: 24 },
  toggleButton: { padding: 12, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  toggleActive: { borderBottomColor: '#8B5FBF' },
  toggleText: { fontSize: 16, color: '#8B5FBF', fontWeight: 'bold' },
}); 