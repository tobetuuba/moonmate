import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ChatBubbleProps {
  message: string;
  isUser: boolean;
  timestamp: Date;
  aiAnalysis?: {
    tone: 'positive' | 'neutral' | 'negative';
    openness: number;
    engagement: number;
  };
}

export default function ChatBubble({ message, isUser, timestamp, aiAnalysis }: ChatBubbleProps) {
  return (
    <View style={[styles.container, isUser && styles.userContainer]}>
      <View style={[styles.bubble, isUser && styles.userBubble]}>
        <Text style={[styles.messageText, isUser && styles.userMessageText]}>
          {message}
        </Text>
        <Text style={[styles.timestamp, isUser && styles.userTimestamp]}>
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
      
      {aiAnalysis && !isUser && (
        <View style={styles.aiAnalysis}>
          <Ionicons name="heart" size={12} color="#8B5FBF" />
          <Text style={styles.aiAnalysisText}>
            Openness: {aiAnalysis.openness}% • Engagement: {aiAnalysis.engagement}%
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    alignItems: 'flex-start',
    maxWidth: '80%',
  },
  userContainer: {
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
  },
  bubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  userBubble: {
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
  timestamp: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  userTimestamp: {
    color: '#FFFFFF',
    opacity: 0.8,
  },
  aiAnalysis: {
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
});