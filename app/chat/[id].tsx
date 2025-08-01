import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TextInput, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { ConversationAnalyzer, ConversationMetrics, ConversationInsight } from '../../services/ai/ConversationAnalyzer';
import { NotificationService } from '../../services/NotificationService';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'other';
  timestamp: Date;
  aiAnalysis?: {
    tone: 'positive' | 'neutral' | 'negative' | 'mixed';
    openness: number;
    engagement: number;
  };
}

export default function ChatScreen() {
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hi! I loved reading your profile. We seem to have so much in common!',
      sender: 'other',
      timestamp: new Date(Date.now() - 3600000),
      aiAnalysis: {
        tone: 'positive',
        openness: 85,
        engagement: 90
      }
    },
    {
      id: '2',
      text: 'Thank you! I noticed we both love hiking. Do you have a favorite trail?',
      sender: 'user',
      timestamp: new Date(Date.now() - 3000000),
    },
    {
      id: '3',
      text: 'Oh yes! I love the trail up to Eagle Peak. The sunrise view is absolutely magical ✨',
      sender: 'other',
      timestamp: new Date(Date.now() - 2400000),
      aiAnalysis: {
        tone: 'positive',
        openness: 92,
        engagement: 88
      }
    },
    {
      id: '4',
      text: 'That sounds incredible! I\'ve been wanting to try sunrise hikes but never had someone to go with.',
      sender: 'user',
      timestamp: new Date(Date.now() - 1800000),
    },
    {
      id: '5',
      text: 'Maybe we could plan one together sometime? I know all the best spots!',
      sender: 'other',
      timestamp: new Date(Date.now() - 1200000),
      aiAnalysis: {
        tone: 'positive',
        openness: 95,
        engagement: 95
      }
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [aiInsights, setAiInsights] = useState<ConversationInsight | null>(null);
  const [showAiInsights, setShowAiInsights] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (messages.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const analyzeMessage = async (message: string) => {
    try {
      setIsAnalyzing(true);
      const analysis = await ConversationAnalyzer.analyzeMessage(message);
      
      // Check for red flags
      const redFlags = await ConversationAnalyzer.detectRedFlags(message);
      if (redFlags.length > 0) {
        Alert.alert(
          'AI Analysis Alert',
          `Potential concerns detected: ${redFlags.join(', ')}`,
          [{ text: 'OK' }]
        );
      }
      
      return analysis;
    } catch (error) {
      console.error('Error analyzing message:', error);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analyzeConversation = async () => {
    try {
      setIsAnalyzing(true);
      const messageTexts = messages.map(msg => msg.text);
      const insights = await ConversationAnalyzer.analyzeConversation(messageTexts);
      setAiInsights(insights);
      setShowAiInsights(true);
    } catch (error) {
      console.error('Error analyzing conversation:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const sendMessage = async () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        text: newMessage,
        sender: 'user',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, message]);
      setNewMessage('');
      
      // AI Analysis of the sent message
      const analysis = await analyzeMessage(newMessage);
      if (analysis) {
        // Update the message with AI analysis
        setMessages(prev => 
          prev.map(msg => 
            msg.id === message.id 
              ? { ...msg, aiAnalysis: analysis }
              : msg
          )
        );
      }

      // Simulate receiving a response (in real app, this would come from backend)
      setTimeout(async () => {
        const responseMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: `Thanks for your message! I'll get back to you soon. 😊`,
          sender: 'other',
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, responseMessage]);
        
        // Send message notification
        await NotificationService.sendMessageNotification(
          name || 'Match',
          responseMessage.text,
          id || '1'
        );
      }, 2000);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.sender === 'user';
    
    return (
      <View style={[styles.messageContainer, isUser && styles.userMessageContainer]}>
        <View style={[styles.messageBubble, isUser && styles.userMessageBubble]}>
          <Text style={[styles.messageText, isUser && styles.userMessageText]}>
            {item.text}
          </Text>
          <Text style={[styles.messageTime, isUser && styles.userMessageTime]}>
            {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
        {item.aiAnalysis && !isUser && (
          <View style={styles.aiAnalysisContainer}>
            <Ionicons name="heart" size={12} color="#8B5FBF" />
            <Text style={styles.aiAnalysisText}>
              Openness: {item.aiAnalysis.openness}% • Engagement: {item.aiAnalysis.engagement}%
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{name}</Text>
        <TouchableOpacity 
          style={styles.aiButton} 
          onPress={analyzeConversation}
          disabled={isAnalyzing}>
          <MaterialIcons 
            name="psychology" 
            size={24} 
            color={isAnalyzing ? "#9CA3AF" : "#8B5FBF"} 
          />
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Type a message..."
          value={newMessage}
          onChangeText={setNewMessage}
          multiline
          maxLength={500}
        />
        <TouchableOpacity 
          style={[styles.sendButton, !newMessage.trim() && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={!newMessage.trim()}>
          <Feather name="send" size={20} color={newMessage.trim() ? "#FFFFFF" : "#9CA3AF"} />
        </TouchableOpacity>
      </View>

      {/* AI Insights Modal */}
      {showAiInsights && aiInsights && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <MaterialIcons name="psychology" size={24} color="#8B5FBF" />
              <Text style={styles.modalTitle}>AI Conversation Analysis</Text>
              <TouchableOpacity onPress={() => setShowAiInsights(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.insightSection}>
                <Text style={styles.insightSectionTitle}>Summary</Text>
                <Text style={styles.insightText}>{aiInsights.summary}</Text>
              </View>

              <View style={styles.insightSection}>
                <Text style={styles.insightSectionTitle}>Recommendations</Text>
                {aiInsights.recommendations.map((rec, index) => (
                  <View key={index} style={styles.recommendationItem}>
                    <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                    <Text style={styles.recommendationText}>{rec}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.insightSection}>
                <Text style={styles.insightSectionTitle}>Compatibility Indicators</Text>
                {aiInsights.compatibilityIndicators.map((indicator, index) => (
                  <View key={index} style={styles.indicatorItem}>
                    <Ionicons name="star" size={16} color="#8B5FBF" />
                    <Text style={styles.indicatorText}>{indicator}</Text>
                  </View>
                ))}
              </View>

              {aiInsights.warningFlags && aiInsights.warningFlags.length > 0 && (
                <View style={styles.insightSection}>
                  <Text style={styles.insightSectionTitle}>Warning Flags</Text>
                  {aiInsights.warningFlags.map((flag, index) => (
                    <View key={index} style={styles.warningItem}>
                      <Ionicons name="warning" size={16} color="#EF4444" />
                      <Text style={styles.warningText}>{flag}</Text>
                    </View>
                  ))}
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
  },
  aiButton: {
    padding: 8,
  },
  messagesList: {
    flex: 1,
  },
  messagesContainer: {
    padding: 16,
    paddingBottom: 20,
  },
  messageContainer: {
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  userMessageContainer: {
    alignItems: 'flex-end',
  },
  messageBubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxWidth: '80%',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  userMessageBubble: {
    backgroundColor: '#8B5FBF',
  },
  messageText: {
    fontSize: 16,
    color: '#1F2937',
    lineHeight: 22,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  messageTime: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  userMessageTime: {
    color: '#FFFFFF',
    opacity: 0.8,
  },
  aiAnalysisContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  aiAnalysisText: {
    fontSize: 11,
    color: '#8B5FBF',
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    gap: 12,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
    backgroundColor: '#F9FAFB',
  },
  sendButton: {
    backgroundColor: '#8B5FBF',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#F3F4F6',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    margin: 20,
    maxHeight: '80%',
    width: '90%',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
  },
  modalBody: {
    padding: 20,
  },
  insightSection: {
    marginBottom: 24,
  },
  insightSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  insightText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  recommendationText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
    lineHeight: 20,
  },
  indicatorItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  indicatorText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
    lineHeight: 20,
  },
  warningItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  warningText: {
    fontSize: 14,
    color: '#EF4444',
    flex: 1,
    lineHeight: 20,
  },
});