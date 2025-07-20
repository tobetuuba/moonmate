import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Heart, MessageCircle, MapPin } from 'lucide-react-native';

interface MatchCardProps {
  id: string;
  name: string;
  age: number;
  avatar: string;
  compatibility: number;
  distance: number;
  interests: string[];
  onPress?: () => void;
  onLike?: () => void;
  onMessage?: () => void;
}

export default function MatchCard({ 
  name, 
  age, 
  avatar, 
  compatibility, 
  distance, 
  interests, 
  onPress,
  onLike,
  onMessage 
}: MatchCardProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={{ uri: avatar }} style={styles.avatar} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{name}, {age}</Text>
          <View style={styles.compatibilityBadge}>
            <Heart size={12} color="#E91E63" />
            <Text style={styles.compatibilityText}>{compatibility}%</Text>
          </View>
        </View>
        
        <View style={styles.locationContainer}>
          <MapPin size={14} color="#6B7280" />
          <Text style={styles.distance}>{distance} km away</Text>
        </View>
        
        <View style={styles.interestsContainer}>
          {interests.slice(0, 3).map((interest, index) => (
            <View key={index} style={styles.interestTag}>
              <Text style={styles.interestText}>{interest}</Text>
            </View>
          ))}
          {interests.length > 3 && (
            <Text style={styles.moreInterests}>+{interests.length - 3}</Text>
          )}
        </View>
        
        <View style={styles.actions}>
          <TouchableOpacity style={styles.likeButton} onPress={onLike}>
            <Heart size={16} color="#E91E63" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.messageButton} onPress={onMessage}>
            <MessageCircle size={16} color="#8B5FBF" />
            <Text style={styles.messageButtonText}>Message</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  compatibilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  compatibilityText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#E91E63',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 4,
  },
  distance: {
    fontSize: 14,
    color: '#6B7280',
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 16,
  },
  interestTag: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  interestText: {
    fontSize: 12,
    color: '#6B7280',
  },
  moreInterests: {
    fontSize: 12,
    color: '#8B5FBF',
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  likeButton: {
    backgroundColor: '#FEF2F2',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 6,
  },
  messageButtonText: {
    fontSize: 14,
    color: '#8B5FBF',
    fontWeight: '500',
  },
});