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
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CountryPicker, { Country, CountryCode } from 'react-native-country-picker-modal';
import { auth } from '../services/firebase';
import { createUserWithEmailAndPassword, signInAnonymously } from 'firebase/auth';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Basit bir font scaling fonksiyonu
const scaleFont = (size: number) => size * (screenWidth / 375); // 375 referans iPhone 11 Pro

export default function SignUpScreen() {
  const [mode, setMode] = useState('email');
  const [countryCode, setCountryCode] = useState('TR');
  const [country, setCountry] = useState<Country | undefined>(undefined);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const phoneInputRef = useRef<TextInput>(null);

  useEffect(() => {
    phoneInputRef.current?.focus();
  }, []);

  const onSelect = (selectedCountry: Country) => {
    setCountryCode(selectedCountry.cca2);
    setCountry(selectedCountry);
    setPhone('');
    setError('');
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

  const handleSignUp = async () => {
    try {
      setError('');
      setIsLoading(true);

      // Validate phone number
      if (!validatePhone(phone)) {
        setError('Please enter a valid phone number');
        return;
      }

      // For phone signup, we'll use anonymous authentication for now
      // In a real app, you'd implement phone verification
      const userCredential = await signInAnonymously(auth);
      console.log('Anonymous signup successful:', userCredential.user.uid);
      
      Alert.alert('Success', 'Account created successfully!', [
        { text: 'OK', onPress: () => router.push('/create-profile') }
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

      // Validate email
      if (!validateEmail(email)) {
        setError('Please enter a valid email address');
        return;
      }

      // Validate password
      if (!validatePassword(password)) {
        setError('Password must be at least 6 characters long');
        return;
      }

      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Email signup successful:', userCredential.user.uid);
      
      Alert.alert('Success', 'Account created successfully!', [
        { text: 'OK', onPress: () => router.push('/create-profile') }
      ]);
    } catch (error: any) {
      console.error('Email signup error:', error);
      
      // Handle specific Firebase auth errors
      if (error.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists');
      } else if (error.code === 'auth/invalid-email') {
        setError('Invalid email address');
      } else if (error.code === 'auth/weak-password') {
        setError('Password is too weak');
      } else {
        setError(error.message || 'Failed to create account');
      }
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
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <LinearGradient
          colors={['#8B5FBF', '#E91E63']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBackToLogin} style={styles.backButton}>
              <Feather name="arrow-left" size={scaleFont(22)} color="#fff" />
            </TouchableOpacity>
            <View style={styles.logoContainer}>
              <Ionicons name="heart" size={scaleFont(36)} color="#fff" />
              <MaterialCommunityIcons
                name="star-four-points"
                size={scaleFont(20)}
                color="#fff"
                style={styles.sparkleIcon}
              />
            </View>
            <Text style={styles.title}>MoonMate</Text>
            <Text style={styles.subtitle}>Create your account</Text>
          </View>
        </LinearGradient>

        <View style={styles.toggleRow}>
          <TouchableOpacity
            onPress={() => setMode('email')}
            style={[styles.toggleButton, mode === 'email' && styles.toggleActive]}
          >
            <Text style={styles.toggleText}>Email</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setMode('phone')}
            style={[styles.toggleButton, mode === 'phone' && styles.toggleActive]}
          >
            <Text style={styles.toggleText}>Phone</Text>
          </TouchableOpacity>
        </View>

        {mode === 'email' ? (
          <View style={styles.formContainer}>
            <Text style={styles.welcomeText}>Create Account</Text>
            <Text style={styles.descriptionText}>Sign up with your email address</Text>
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
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <TouchableOpacity
              style={[styles.signUpButton, isLoading && styles.signUpButtonDisabled]}
              onPress={handleEmailSignUp}
              disabled={isLoading}
            >
              <LinearGradient
                colors={['#8B5FBF', '#E91E63']}
                style={styles.signUpButtonGradient}
              >
                <Text style={styles.signUpButtonText}>
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.formContainer}>
            <View style={styles.countryPhoneRow}>
              <CountryPicker
                countryCode={countryCode as CountryCode}
                withFilter
                withFlag
                withCallingCode
                withEmoji
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
                placeholder="Phone number"
                placeholderTextColor="#9CA3AF"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={15}
                returnKeyType="done"
              />
            </View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <TouchableOpacity
              style={[styles.signUpButton, isLoading && styles.signUpButtonDisabled]}
              onPress={handleSignUp}
              disabled={isLoading}
            >
              <LinearGradient
                colors={['#8B5FBF', '#E91E63']}
                style={styles.signUpButtonGradient}
              >
                <Text style={styles.signUpButtonText}>
                  {isLoading ? 'Creating Account...' : 'Create Account'}
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
    minHeight: screenHeight,
    paddingBottom: screenHeight * 0.04,
  },
  headerGradient: {
    paddingTop: screenHeight * 0.09,
    paddingBottom: screenHeight * 0.06,
    paddingHorizontal: screenWidth * 0.06,
  },
  header: {
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    padding: screenWidth * 0.02,
  },
  logoContainer: {
    position: 'relative',
    marginBottom: screenHeight * 0.015,
  },
  sparkleIcon: {
    position: 'absolute',
    top: -scaleFont(6),
    right: -scaleFont(6),
  },
  title: {
    fontSize: scaleFont(32),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: scaleFont(6),
  },
  subtitle: {
    fontSize: scaleFont(14),
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
  },
  formContainer: {
    width: '92%',
    alignSelf: 'center',
    paddingVertical: screenHeight * 0.03,
    paddingHorizontal: screenWidth * 0.02,
    marginVertical: screenHeight * 0.02,
    backgroundColor: '#fff',
    borderRadius: 18,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
  },
  welcomeText: {
    fontSize: scaleFont(22),
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: scaleFont(4),
    textAlign: 'center',
  },
  descriptionText: {
    fontSize: scaleFont(13),
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: screenHeight * 0.04,
    lineHeight: scaleFont(20),
  },
  input: {
    flex: 1,
    fontSize: scaleFont(18),
    color: '#1F2937',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: screenWidth * 0.04,
    paddingVertical: screenHeight * 0.018,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: screenHeight * 0.015,
    alignSelf: 'center',
    width: '100%',
    maxWidth: 320,
  },
  signUpButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: screenHeight * 0.03,
    elevation: 4,
    shadowColor: '#8B5FBF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  signUpButtonDisabled: {
    opacity: 0.6,
  },
  signUpButtonGradient: {
    paddingVertical: screenHeight * 0.018,
    alignItems: 'center',
  },
  signUpButtonText: {
    fontSize: scaleFont(16),
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: screenHeight * 0.022,
    marginTop: screenHeight * 0.005,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    marginHorizontal: screenWidth * 0.04,
    fontSize: scaleFont(12),
    color: '#9CA3AF',
  },
  loginButton: {
    alignItems: 'center',
    marginBottom: screenHeight * 0.03,
  },
  loginButtonText: {
    fontSize: scaleFont(14),
    color: '#6B7280',
  },
  loginLink: {
    color: '#8B5FBF',
    fontWeight: 'bold',
  },
  countryPhoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: screenHeight * 0.012,
  },
  countryPicker: {
    marginRight: screenWidth * 0.016,
  },
  callingCodeBox: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: screenWidth * 0.022,
    paddingVertical: screenHeight * 0.012,
    marginRight: screenWidth * 0.02,
    minWidth: 44,
    alignItems: 'center',
  },
  callingCodeText: {
    fontSize: scaleFont(15),
    color: '#1F2937',
    fontWeight: 'bold',
  },
  errorText: {
    color: '#DC2626',
    fontSize: scaleFont(12),
    marginTop: 4,
    marginBottom: 4,
    textAlign: 'center',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: screenHeight * 0.026,
  },
  toggleButton: {
    padding: screenWidth * 0.033,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  toggleActive: {
    borderBottomColor: '#8B5FBF',
  },
  toggleText: {
    fontSize: scaleFont(14),
    color: '#8B5FBF',
    fontWeight: 'bold',
  },
});
