import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { MessageCircle, Heart, Clock } from 'lucide-react-native';

interface Match {
  id: string;
  name: string;
  age: number;
  avatar: string;
  compatibility: number;
  lastMessage?: string;
  lastMessageTime?: string;
  isOnline: boolean;
  newMessages: number;
}

const mockMatches: Match[] = [
  {
    id: '1',
    name: 'Emma',
    age: 28,
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    compatibility: 95,
    lastMessage: 'That sounds like a perfect evening!',
    lastMessageTime: '2m ago',
    isOnline: true,
    newMessages: 2,
  },
  {
    id: '2',
    name: 'Sarah',
    age: 26,
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    compatibility: 89,
    lastMessage: 'I love that book too!',
    lastMessageTime: '1h ago',
    isOnline: false,
    newMessages: 0,
  },
  {
    id: '3',
    name: 'Alex',
    age: 30,
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
    compatibility: 87,
    lastMessage: 'Would you like to grab coffee sometime?',
    lastMessageTime: '3h ago',
    isOnline: true,
    newMessages: 1,
  },
  {
    id: '4',
    name: 'Maya',
    age: 24,
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400',
    compatibility: 92,
    lastMessage: 'Your personality test results are amazing!',
    lastMessageTime: '1d ago',
    isOnline: false,
    newMessages: 0,
  },
];

export default function MatchesScreen() {
  const [matches] = useState<Match[]>(mockMatches);

  const openChat = (match: Match) => {
    router.push({
      pathname: '/chat/[id]',
      params: { id: match.id, name: match.name }
    });
  };

  const renderMatch = ({ item }: { item: Match }) => (
    <TouchableOpacity style={styles.matchCard} onPress={() => openChat(item)}>
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        {item.isOnline && <View style={styles.onlineIndicator} />}
        {item.newMessages > 0 && (
          <View style={styles.messageBadge}>
            <Text style={styles.messageBadgeText}>{item.newMessages}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.matchInfo}>
        <View style={styles.matchHeader}>
          <Text style={styles.matchName}>{item.name}, {item.age}</Text>
          <View style={styles.compatibilityBadge}>
            <Heart size={12} color="#E91E63" />
            <Text style={styles.compatibilityText}>{item.compatibility}%</Text>
          </View>
        </View>
        
        {item.lastMessage && (
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage}
          </Text>
        )}
        
        {item.lastMessageTime && (
          <View style={styles.timeContainer}>
            <Clock size={12} color="#9CA3AF" />
            <Text style={styles.timeText}>{item.lastMessageTime}</Text>
          </View>
        )}
      </View>
      
      <TouchableOpacity style={styles.chatButton} onPress={() => openChat(item)}>
        <MessageCircle size={20} color="#8B5FBF" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Matches</Text>
        <Text style={styles.subtitle}>{matches.length} meaningful connections</Text>
      </View>
      
      <FlatList
        data={matches}
        renderItem={renderMatch}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  listContainer: {
    padding: 20,
  },
  matchCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  messageBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#E91E63',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  matchInfo: {
    flex: 1,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  matchName: {
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
  lastMessage: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  chatButton: {
    padding: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    marginLeft: 12,
  },
});