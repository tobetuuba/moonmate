import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  const navigateToVisualMatch = () => {
    router.push('/visual-match');
  };

  const navigateToTest = () => {
    router.push('/test-match');
  };

  const navigateToZodiac = () => {
    router.push('/birth-data');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#8B5FBF', '#E91E63']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}>
        <View style={styles.header}>
          <Text style={styles.title}>MoonMate</Text>
          <Text style={styles.subtitle}>Find your emotional connection</Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.welcomeSection}>
          <MaterialCommunityIcons name="star-four-points" size={32} color="#8B5FBF" />
          <Text style={styles.welcomeText}>
            Welcome to a new way of dating. Choose how you'd like to connect:
          </Text>
        </View>

        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.optionCard} onPress={navigateToVisualMatch}>
            <LinearGradient
              colors={['#8B5FBF', '#A855F7']}
              style={styles.optionGradient}>
              <Ionicons name="heart" size={40} color="#FFFFFF" />
              <Text style={styles.optionTitle}>Visual Match</Text>
              <Text style={styles.optionDescription}>
                Swipe through profiles and discover connections through photos
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionCard} onPress={navigateToTest}>
            <LinearGradient
              colors={['#E91E63', '#F59E0B']}
              style={styles.optionGradient}>
              <MaterialIcons name="psychology" size={40} color="#FFFFFF" />
              <Text style={styles.optionTitle}>Soul Match</Text>
              <Text style={styles.optionDescription}>
                Take our AI-powered compatibility test for deeper connections
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionCard} onPress={navigateToZodiac}>
            <LinearGradient
              colors={['#10B981', '#059669']}
              style={styles.optionGradient}>
              <MaterialIcons name="stars" size={40} color="#FFFFFF" />
              <Text style={styles.optionTitle}>Zodiac Match</Text>
              <Text style={styles.optionDescription}>
                Discover cosmic compatibility through astrological insights
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>10K+</Text>
            <Text style={styles.statLabel}>Meaningful Matches</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>85%</Text>
            <Text style={styles.statLabel}>Compatibility Rate</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>24/7</Text>
            <Text style={styles.statLabel}>AI Support</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
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
  },
  content: {
    flex: 1,
    padding: 20,
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 24,
  },
  optionsContainer: {
    gap: 20,
    marginBottom: 40,
  },
  optionCard: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  optionGradient: {
    padding: 24,
    alignItems: 'center',
    minHeight: 160,
    justifyContent: 'center',
  },
  optionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 12,
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B5FBF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
});