import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { MessageCircle, Heart, Search } from 'lucide-react-native';

interface ChatPreview {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
  aiInsight?: string;
}

const mockChats: ChatPreview[] = [
  {
    id: '1',
    name: 'Emma',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    lastMessage: 'That sounds like a perfect evening! I love stargazing too 🌟',
    lastMessageTime: '2m ago',
    unreadCount: 2,
    isOnline: true,
    aiInsight: 'Emma shows high emotional openness in conversations',
  },
  {
    id: '2',
    name: 'Alex',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
    lastMessage: 'Would you like to grab coffee this weekend?',
    lastMessageTime: '1h ago',
    unreadCount: 1,
    isOnline: true,
    aiInsight: 'Alex demonstrates thoughtful communication patterns',
  },
  {
    id: '3',
    name: 'Sarah',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    lastMessage: 'I love that book recommendation! Adding it to my list',
    lastMessageTime: '3h ago',
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: '4',
    name: 'Maya',
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400',
    lastMessage: 'Your personality test results are so interesting!',
    lastMessageTime: '1d ago',
    unreadCount: 0,
    isOnline: false,
    aiInsight: 'Maya shows strong intellectual curiosity',
  },
];

export default function ChatScreen() {
  const [chats] = useState<ChatPreview[]>(mockChats);

  const openChat = (chat: ChatPreview) => {
    router.push({
      pathname: '/chat/[id]',
      params: { id: chat.id, name: chat.name }
    });
  };

  const renderChat = ({ item }: { item: ChatPreview }) => (
    <TouchableOpacity style={styles.chatCard} onPress={() => openChat(item)}>
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        {item.isOnline && <View style={styles.onlineIndicator} />}
      </View>
      
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatName}>{item.name}</Text>
          <Text style={styles.timeText}>{item.lastMessageTime}</Text>
        </View>
        
        <Text style={[
          styles.lastMessage,
          item.unreadCount > 0 && styles.unreadMessage
        ]} numberOfLines={1}>
          {item.lastMessage}
        </Text>
        
        {item.aiInsight && (
          <View style={styles.aiInsightContainer}>
            <Heart size={12} color="#8B5FBF" />
            <Text style={styles.aiInsightText} numberOfLines={1}>
              {item.aiInsight}
            </Text>
          </View>
        )}
      </View>
      
      {item.unreadCount > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadBadgeText}>{item.unreadCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Search size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={chats}
        renderItem={renderChat}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  },
  searchButton: {
    padding: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
  },
  listContainer: {
    padding: 16,
  },
  chatCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  timeText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  lastMessage: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  unreadMessage: {
    fontWeight: '600',
    color: '#1F2937',
  },
  aiInsightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  aiInsightText: {
    fontSize: 12,
    color: '#8B5FBF',
    fontStyle: 'italic',
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: '#E91E63',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  unreadBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});