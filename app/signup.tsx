import React, { useState } from 'react';
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
import { signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth';

export default function SignUpScreen() {
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    if (!phone) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }
    setIsLoading(true);
    try {
      // For web, RecaptchaVerifier is required. For Expo Go, this is not needed.
      // For bare/standalone builds, use expo-firebase-recaptcha (not needed for web or managed workflow)
      const confirmation = await signInWithPhoneNumber(auth, phone);
      setIsLoading(false);
      router.push({ pathname: '/verify', params: { phone } });
      // Pass confirmation to verification screen via navigation or global state
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', error.message || 'Failed to send verification code');
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
              <MaterialCommunityIcons name="sparkles" size={24} color="#FFFFFF" style={styles.sparkleIcon} />
            </View>
            <Text style={styles.title}>MoonMate</Text>
            <Text style={styles.subtitle}>Sign up with your phone number</Text>
          </View>
        </LinearGradient>

        <View style={styles.formContainer}>
          <Text style={styles.welcomeText}>Create Account</Text>
          <Text style={styles.descriptionText}>
            Enter your phone number to get started
          </Text>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Feather name="phone" size={20} color="#8B5FBF" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Phone number (e.g. +1234567890)"
                placeholderTextColor="#9CA3AF"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.signUpButton, isLoading && styles.signUpButtonDisabled]}
            onPress={handleSignUp}
            disabled={isLoading}>
            <LinearGradient
              colors={['#8B5FBF', '#E91E63']}
              style={styles.signUpButtonGradient}>
              <Text style={styles.signUpButtonText}>
                {isLoading ? 'Sending code...' : 'Send Verification Code'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

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
}); 