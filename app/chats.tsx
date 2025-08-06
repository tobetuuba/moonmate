import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  collection,
  query,
  where,
  onSnapshot,
  getDoc,
  doc,
} from 'firebase/firestore';
import { db, auth } from '../services/firebase';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

interface Chat {
  id: string;
  participants: string[];
  createdAt: any;
  lastMessage?: {
    text: string;
    timestamp: any;
    senderId: string;
  };
  otherUser?: {
    id: string;
    displayName: string;
    profilePhotoUrl?: string;
  };
}

export default function ChatsScreen() {
  const router = useRouter();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Error', 'You must be logged in to view chats');
      router.back();
      return;
    }
    setCurrentUserId(user.uid);

    console.log('📱 Loading chats for user:', user.uid);

    // Listen to chats where current user is a participant
    const chatsRef = collection(db, 'chats');
    const q = query(
      chatsRef,
      where('participants', 'array-contains', user.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        const chatList: Chat[] = [];
        
        for (const chatDoc of snapshot.docs) {
          const chatData = chatDoc.data();
          const chat: Chat = {
            id: chatDoc.id,
            participants: chatData.participants,
            createdAt: chatData.createdAt,
          };

          // Get the other user's ID
          const otherUserId = chatData.participants.find(
            (id: string) => id !== user.uid
          );

          if (otherUserId) {
            try {
              // Get other user's profile
              const userDoc = await getDoc(doc(db, 'users', otherUserId));
              if (userDoc.exists()) {
                const userData = userDoc.data();
                chat.otherUser = {
                  id: otherUserId,
                  displayName: userData.displayName || 'Unknown User',
                  profilePhotoUrl: userData.profilePhotoUrl,
                };
              }
            } catch (error) {
              console.error('Error fetching user data:', error);
            }
          }

          // Get last message from chat document
          if (chatData.lastMessage) {
            chat.lastMessage = chatData.lastMessage;
          }

          chatList.push(chat);
        }

        console.log('📨 Loaded chats:', chatList.length);
        setChats(chatList);
        setLoading(false);
      },
      (error) => {
        console.error('❌ Error loading chats:', error);
        Alert.alert('Error', 'Failed to load chats');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [router]);

  const navigateToChat = (chatId: string) => {
    router.push(`/chat/${chatId}`);
  };

  const renderChatItem = ({ item }: { item: Chat }) => {
    const otherUser = item.otherUser;
    
    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() => navigateToChat(item.id)}
      >
        <View style={styles.avatarContainer}>
          {otherUser?.profilePhotoUrl ? (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {otherUser.displayName.charAt(0).toUpperCase()}
              </Text>
            </View>
          ) : (
            <View style={[styles.avatar, styles.defaultAvatar]}>
              <Text style={styles.avatarText}>
                {otherUser?.displayName.charAt(0).toUpperCase() || '?'}
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.chatInfo}>
          <Text style={styles.chatName}>
            {otherUser?.displayName || 'Unknown User'}
          </Text>
          <Text style={styles.chatPreview} numberOfLines={1}>
            {item.lastMessage?.text || 'No messages yet'}
          </Text>
        </View>
        
        <View style={styles.chatMeta}>
          {item.lastMessage?.timestamp && (
            <Text style={styles.timestamp}>
              {item.lastMessage.timestamp.toDate().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Loading chats...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#6366f1', '#8b5cf6']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Chats</Text>
      </LinearGradient>

      {/* Chat List */}
      {chats.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No chats yet</Text>
          <Text style={styles.emptySubtext}>
            Start matching to begin conversations!
          </Text>
        </View>
      ) : (
        <FlatList
          data={chats}
          renderItem={renderChatItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.chatList}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 20,
    color: '#6b7280',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
  },
  chatList: {
    paddingVertical: 8,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultAvatar: {
    backgroundColor: '#9ca3af',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  chatInfo: {
    flex: 1,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  chatPreview: {
    fontSize: 14,
    color: '#6b7280',
  },
  chatMeta: {
    alignItems: 'flex-end',
  },
  timestamp: {
    fontSize: 12,
    color: '#9ca3af',
  },
}); 