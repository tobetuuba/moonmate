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
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../services/firebase';

export default function VerifyScreen() {
  const { phone } = useLocalSearchParams();
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // TODO: Store confirmationResult globally or pass it via navigation
  // For now, this is a placeholder for the actual confirmation logic

  const handleVerify = async () => {
    if (!code) {
      Alert.alert('Error', 'Please enter the verification code');
      return;
    }
    setIsLoading(true);
    try {
      // You need to get the confirmationResult from the signup screen
      // const result = await confirmationResult.confirm(code);
      // For now, simulate success
      setTimeout(() => {
        setIsLoading(false);
        router.replace('/(tabs)');
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      const message = (error instanceof Error && error.message) ? error.message : 'Invalid code';
      Alert.alert('Error', message);
    }
  };

  const handleBack = () => {
    router.replace('/signup');
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
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Ionicons name="shield-checkmark" size={40} color="#FFFFFF" style={styles.logoIcon} />
            <Text style={styles.title}>Verify Phone</Text>
            <Text style={styles.subtitle}>Enter the code sent to {phone}</Text>
          </View>
        </LinearGradient>

        <View style={styles.formContainer}>
          <Text style={styles.welcomeText}>Verification Code</Text>
          <TextInput
            style={styles.input}
            placeholder="123456"
            placeholderTextColor="#9CA3AF"
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
            maxLength={6}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TouchableOpacity
            style={[styles.verifyButton, isLoading && styles.verifyButtonDisabled]}
            onPress={handleVerify}
            disabled={isLoading}>
            <LinearGradient
              colors={['#8B5FBF', '#E91E63']}
              style={styles.verifyButtonGradient}>
              <Text style={styles.verifyButtonText}>
                {isLoading ? 'Verifying...' : 'Verify'}
              </Text>
            </LinearGradient>
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
  logoIcon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    fontSize: 24,
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    textAlign: 'center',
    marginBottom: 32,
  },
  verifyButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
    elevation: 4,
    shadowColor: '#8B5FBF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  verifyButtonDisabled: {
    opacity: 0.7,
  },
  verifyButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  verifyButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
}); 