import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function TestResultScreen() {
  // AI INTEGRATION HERE: This would be generated based on user's test answers
  const personalityResult = {
    type: 'Empathetic Communicator',
    description: 'You value deep emotional connections and are naturally gifted at understanding others\' feelings. You seek authentic relationships built on trust and open communication.',
    strengths: [
      'Excellent emotional intelligence',
      'Strong listening skills',
      'Values authenticity',
      'Seeks meaningful connections'
    ],
    compatibility: {
      best: ['Thoughtful Supporter', 'Creative Dreamer', 'Loyal Companion'],
      challenging: ['Practical Analyzer', 'Independent Explorer']
    },
    insights: [
      'You thrive in relationships where both partners feel safe to be vulnerable',
      'Conflict resolution through empathy and understanding works best for you',
      'You appreciate partners who value emotional depth over surface-level interactions'
    ]
  };

  const goToMatches = () => {
    router.push('/(tabs)/matches');
  };

  const goHome = () => {
    router.push('/(tabs)');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#8B5FBF', '#E91E63']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}>
        <View style={styles.headerContent}>
          <MaterialIcons name="psychology" size={48} color="#FFFFFF" />
          <Text style={styles.headerTitle}>Your Personality Profile</Text>
          <Text style={styles.headerSubtitle}>
            AI-powered analysis complete
          </Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.personalityCard}>
          <Text style={styles.personalityType}>{personalityResult.type}</Text>
          <Text style={styles.personalityDescription}>
            {personalityResult.description}
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="heart" size={24} color="#E91E63" />
            <Text style={styles.sectionTitle}>Your Strengths</Text>
          </View>
          {personalityResult.strengths.map((strength, index) => (
            <View key={index} style={styles.strengthItem}>
              <View style={styles.strengthDot} />
              <Text style={styles.strengthText}>{strength}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <FontAwesome name="users" size={24} color="#8B5FBF" />
            <Text style={styles.sectionTitle}>Best Compatibility</Text>
          </View>
          <View style={styles.compatibilityContainer}>
            {personalityResult.compatibility.best.map((type, index) => (
              <View key={index} style={styles.compatibilityTag}>
                <Text style={styles.compatibilityText}>{type}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="chat-bubble-outline" size={24} color="#2196F3" />
            <Text style={styles.sectionTitle}>AI Insights</Text>
          </View>
          {personalityResult.insights.map((insight, index) => (
            <View key={index} style={styles.insightCard}>
              <Text style={styles.insightText}>{insight}</Text>
            </View>
          ))}
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.primaryButton} onPress={goToMatches}>
            <LinearGradient
              colors={['#8B5FBF', '#E91E63']}
              style={styles.primaryButtonGradient}>
              <Text style={styles.primaryButtonText}>Find Your Matches</Text>
              <Feather name="arrow-right" size={20} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={goHome}>
            <Ionicons name="home" size={20} color="#6B7280" />
            <Text style={styles.secondaryButtonText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  content: {
    padding: 20,
  },
  personalityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  personalityType: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  personalityDescription: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
    textAlign: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  strengthItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    gap: 12,
  },
  strengthDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  strengthText: {
    fontSize: 16,
    color: '#1F2937',
    flex: 1,
  },
  compatibilityContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  compatibilityTag: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#8B5FBF',
  },
  compatibilityText: {
    fontSize: 14,
    color: '#8B5FBF',
    fontWeight: '600',
  },
  insightCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  insightText: {
    fontSize: 15,
    color: '#1F2937',
    lineHeight: 22,
  },
  actionsContainer: {
    gap: 16,
    marginTop: 24,
  },
  primaryButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  primaryButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
});