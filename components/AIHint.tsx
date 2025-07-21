import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface AIHintProps {
  type: 'personality' | 'conversation' | 'compatibility';
  title: string;
  description: string;
  score?: number;
}

export default function AIHint({ type, title, description, score }: AIHintProps) {
  const getIcon = () => {
    switch (type) {
      case 'personality': return <MaterialIcons name="psychology" size={20} color="#8B5FBF" />;
      case 'conversation': return <MaterialIcons name="lightbulb-outline" size={20} color="#F59E0B" />;
      case 'compatibility': return <MaterialIcons name="psychology" size={20} color="#E91E63" />;
      default: return <MaterialIcons name="psychology" size={20} color="#8B5FBF" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'personality': return '#F8F4FF';
      case 'conversation': return '#FFFBEB';
      case 'compatibility': return '#FEF2F2';
      default: return '#F8F4FF';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: getBackgroundColor() }]}>
      <View style={styles.header}>
        {getIcon()}
        <Text style={styles.title}>{title}</Text>
        {score && (
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreText}>{score}%</Text>
          </View>
        )}
      </View>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#8B5FBF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  scoreBadge: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  scoreText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#8B5FBF',
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});