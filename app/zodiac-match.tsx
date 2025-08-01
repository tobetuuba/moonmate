import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface ZodiacMatch {
  id: string;
  name: string;
  avatar: string;
  zodiacSign: string;
  compatibility: number;
  compatibilityType: 'soulmate' | 'harmonious' | 'challenging' | 'neutral';
  astroInsights: string[];
  birthData: {
    date: string;
    time: string;
    place: string;
  };
}

const mockZodiacMatches: ZodiacMatch[] = [
  {
    id: '1',
    name: 'Emma',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    zodiacSign: 'Libra',
    compatibility: 95,
    compatibilityType: 'soulmate',
    astroInsights: [
      'Your Venus in Libra creates perfect harmony with her Venus in Taurus',
      'Both share a love for beauty, art, and meaningful conversations',
      'Your Moon signs suggest deep emotional understanding',
      'Mars compatibility indicates passionate yet balanced dynamics'
    ],
    birthData: {
      date: 'October 15, 1995',
      time: '2:30 PM',
      place: 'New York, NY'
    }
  },
  {
    id: '2',
    name: 'Alex',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
    zodiacSign: 'Aquarius',
    compatibility: 78,
    compatibilityType: 'harmonious',
    astroInsights: [
      'Your intellectual connection is strengthened by Mercury placements',
      'Both value independence while maintaining deep bonds',
      'Saturn aspects suggest long-term potential',
      'Uranus influence brings exciting, unconventional energy'
    ],
    birthData: {
      date: 'February 8, 1993',
      time: '11:45 AM',
      place: 'Los Angeles, CA'
    }
  },
  {
    id: '3',
    name: 'Maya',
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400',
    zodiacSign: 'Pisces',
    compatibility: 82,
    compatibilityType: 'harmonious',
    astroInsights: [
      'Your emotional depth resonates with her intuitive nature',
      'Neptune aspects create spiritual and creative harmony',
      'Both share a compassionate approach to relationships',
      'Jupiter influence suggests growth and expansion together'
    ],
    birthData: {
      date: 'March 12, 1997',
      time: '8:15 PM',
      place: 'Miami, FL'
    }
  }
];

export default function ZodiacMatchScreen() {
  const [selectedMatch, setSelectedMatch] = useState<ZodiacMatch | null>(null);

  const getCompatibilityColor = (type: ZodiacMatch['compatibilityType']) => {
    switch (type) {
      case 'soulmate': return '#E91E63';
      case 'harmonious': return '#8B5FBF';
      case 'challenging': return '#F59E0B';
      case 'neutral': return '#6B7280';
    }
  };

  const getCompatibilityIcon = (type: ZodiacMatch['compatibilityType']) => {
    switch (type) {
      case 'soulmate': return 'heart';
      case 'harmonious': return 'star';
      case 'challenging': return 'flash';
      case 'neutral': return 'help-circle';
    }
  };

  const openMatchDetails = (match: ZodiacMatch) => {
    setSelectedMatch(match);
  };

  const startChat = (match: ZodiacMatch) => {
    router.push({
      pathname: '/chat/[id]',
      params: { id: match.id, name: match.name }
    });
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#8B5FBF', '#E91E63']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.title}>Zodiac Matches</Text>
          <View style={styles.placeholder} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.introSection}>
          <MaterialIcons name="psychology" size={32} color="#8B5FBF" />
          <Text style={styles.introTitle}>Astrological Compatibility</Text>
          <Text style={styles.introText}>
            Discover cosmic connections based on your birth chart and zodiac compatibility
          </Text>
        </View>

        <View style={styles.matchesContainer}>
          {mockZodiacMatches.map((match) => (
            <TouchableOpacity
              key={match.id}
              style={styles.matchCard}
              onPress={() => openMatchDetails(match)}>
              <View style={styles.matchHeader}>
                <Image source={{ uri: match.avatar }} style={styles.avatar} />
                <View style={styles.matchInfo}>
                  <Text style={styles.matchName}>{match.name}</Text>
                  <Text style={styles.zodiacSign}>{match.zodiacSign}</Text>
                </View>
                <View style={styles.compatibilityBadge}>
                  <Ionicons 
                    name={getCompatibilityIcon(match.compatibilityType) as any} 
                    size={16} 
                    color="#FFFFFF" 
                  />
                  <Text style={styles.compatibilityText}>
                    {match.compatibility}%
                  </Text>
                </View>
              </View>

              <View style={styles.astroInsights}>
                <Text style={styles.insightsTitle}>Key Insights:</Text>
                {match.astroInsights.slice(0, 2).map((insight, index) => (
                  <View key={index} style={styles.insightItem}>
                    <Ionicons name="star" size={12} color="#8B5FBF" />
                    <Text style={styles.insightText} numberOfLines={2}>
                      {insight}
                    </Text>
                  </View>
                ))}
              </View>

              <View style={styles.matchActions}>
                <TouchableOpacity 
                  style={styles.chatButton}
                  onPress={() => startChat(match)}>
                  <Ionicons name="chatbubble" size={16} color="#FFFFFF" />
                  <Text style={styles.chatButtonText}>Start Chat</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.detailsButton}>
                  <Text style={styles.detailsButtonText}>View Details</Text>
                  <Ionicons name="chevron-forward" size={16} color="#8B5FBF" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
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
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  introSection: {
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  introTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 12,
    marginBottom: 8,
  },
  introText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  matchesContainer: {
    gap: 16,
  },
  matchCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  matchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  matchInfo: {
    flex: 1,
  },
  matchName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  zodiacSign: {
    fontSize: 14,
    color: '#8B5FBF',
    fontWeight: '600',
  },
  compatibilityBadge: {
    backgroundColor: '#8B5FBF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  compatibilityText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  astroInsights: {
    marginBottom: 16,
  },
  insightsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
    gap: 8,
  },
  insightText: {
    fontSize: 12,
    color: '#6B7280',
    flex: 1,
    lineHeight: 16,
  },
  matchActions: {
    flexDirection: 'row',
    gap: 12,
  },
  chatButton: {
    backgroundColor: '#8B5FBF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    flex: 1,
    justifyContent: 'center',
    gap: 6,
  },
  chatButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 6,
  },
  detailsButtonText: {
    color: '#8B5FBF',
    fontSize: 14,
    fontWeight: '600',
  },
}); 