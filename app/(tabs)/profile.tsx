import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Switch } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNotifications } from '../../context/NotificationContext';

export default function ProfileScreen() {
  const { hasPermission, requestPermission, sendTestNotification, scheduleDailyReminder, cancelAllNotifications } = useNotifications();
  const [aiInsightsEnabled, setAiInsightsEnabled] = useState(true);

  const user = {
    name: 'You',
    age: 28,
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Looking for genuine connections and meaningful conversations. Love hiking, reading, and deep discussions about life.',
    personalityType: 'Empathetic Communicator',
    compatibilityScore: 92,
    interests: ['Reading', 'Hiking', 'Photography', 'Cooking', 'Travel', 'Music'],
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#8B5FBF', '#E91E63']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
            <TouchableOpacity style={styles.cameraButton}>
              <FontAwesome name="camera" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{user.name}, {user.age}</Text>
          <TouchableOpacity style={styles.editButton}>
            <MaterialIcons name="edit" size={16} color="#FFFFFF" />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About Me</Text>
          <Text style={styles.bioText}>{user.bio}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI Personality Analysis</Text>
          <View style={styles.personalityCard}>
            <View style={styles.personalityHeader}>
              <MaterialIcons name="psychology" size={24} color="#8B5FBF" />
              <View>
                <Text style={styles.personalityType}>{user.personalityType}</Text>
                <Text style={styles.compatibilityText}>
                  {user.compatibilityScore}% Average Compatibility
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.viewInsightsButton}>
              <Text style={styles.viewInsightsText}>View Full Analysis</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Interests</Text>
          <View style={styles.interestsContainer}>
            {user.interests.map((interest, index) => (
              <View key={index} style={styles.interestTag}>
                <Text style={styles.interestText}>{interest}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Birth Data</Text>
          <TouchableOpacity 
            style={styles.birthDataCard}
            onPress={() => router.push('/birth-data')}>
            <View style={styles.birthDataContent}>
              <MaterialIcons name="cake" size={24} color="#8B5FBF" />
              <View style={styles.birthDataInfo}>
                <Text style={styles.birthDataTitle}>Astrological Profile</Text>
                <Text style={styles.birthDataSubtitle}>Add your birth data for zodiac matching</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#8B5FBF" />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <View style={styles.preferenceItem}>
            <View style={styles.preferenceLeft}>
              <Ionicons name="notifications" size={20} color="#E91E63" />
              <Text style={styles.preferenceText}>Push Notifications</Text>
            </View>
            <Switch
              value={hasPermission}
              onValueChange={requestPermission}
              trackColor={{ false: '#F3F4F6', true: '#8B5FBF' }}
              thumbColor="#FFFFFF"
            />
          </View>

          {hasPermission && (
            <>
              <TouchableOpacity style={styles.preferenceButton} onPress={sendTestNotification}>
                <Ionicons name="flash" size={20} color="#8B5FBF" />
                <Text style={styles.preferenceButtonText}>Send Test Notification</Text>
                <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.preferenceButton} onPress={scheduleDailyReminder}>
                <Ionicons name="time" size={20} color="#8B5FBF" />
                <Text style={styles.preferenceButtonText}>Schedule Daily Reminder</Text>
                <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.preferenceButton} onPress={cancelAllNotifications}>
                <Ionicons name="close-circle" size={20} color="#EF4444" />
                <Text style={styles.preferenceButtonText}>Cancel All Notifications</Text>
                <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
              </TouchableOpacity>
            </>
          )}

          <View style={styles.preferenceItem}>
            <View style={styles.preferenceLeft}>
              <MaterialIcons name="psychology" size={20} color="#8B5FBF" />
              <Text style={styles.preferenceText}>AI Insights</Text>
            </View>
            <Switch
              value={aiInsightsEnabled}
              onValueChange={setAiInsightsEnabled}
              trackColor={{ false: '#F3F4F6', true: '#8B5FBF' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <TouchableOpacity style={styles.preferenceButton}>
            <Feather name="settings" size={20} color="#6B7280" />
            <Text style={styles.preferenceButtonText}>Advanced Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.preferenceButton}
            onPress={() => {
              // In a real app, you'd clear user data/tokens here
              router.replace('/login');
            }}>
            <MaterialIcons name="logout" size={20} color="#DC2626" />
            <Text style={[styles.preferenceButtonText, { color: '#DC2626' }]}>
              Sign Out
            </Text>
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
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 40,
  },
  profileHeader: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#8B5FBF',
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  bioText: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
  },
  personalityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  personalityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  personalityType: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  compatibilityText: {
    fontSize: 14,
    color: '#8B5FBF',
    marginTop: 2,
  },
  viewInsightsButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  viewInsightsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B5FBF',
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestTag: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  interestText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  preferenceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  preferenceText: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  preferenceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    gap: 12,
  },
  preferenceButtonText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  birthDataCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  birthDataContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  birthDataInfo: {
    flex: 1,
  },
  birthDataTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  birthDataSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
});