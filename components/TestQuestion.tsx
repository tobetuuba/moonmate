import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface TestQuestionProps {
  question: string;
  options: string[];
  selectedOption?: string;
  onSelectOption: (option: string) => void;
  category: 'emotional' | 'lifestyle' | 'values' | 'communication';
}

export default function TestQuestion({
  question,
  options,
  selectedOption,
  onSelectOption,
  category
}: TestQuestionProps) {
  const getCategoryColor = () => {
    switch (category) {
      case 'emotional': return '#E91E63';
      case 'lifestyle': return '#8B5FBF';
      case 'values': return '#2196F3';
      case 'communication': return '#FF9800';
      default: return '#8B5FBF';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.categoryBadge}>
        <View style={[styles.categoryDot, { backgroundColor: getCategoryColor() }]} />
        <Text style={styles.categoryText}>
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </Text>
      </View>
      
      <Text style={styles.questionText}>{question}</Text>
      
      <View style={styles.optionsContainer}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              selectedOption === option && styles.selectedOption
            ]}
            onPress={() => onSelectOption(option)}>
            <Text style={[
              styles.optionText,
              selectedOption === option && styles.selectedOptionText
            ]}>
              {option}
            </Text>
            {selectedOption === option && (
              <MaterialIcons name="check-circle" size={20} color="#8B5FBF" style={styles.checkIcon} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 20,
    gap: 8,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  questionText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 24,
    lineHeight: 30,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedOption: {
    borderColor: '#8B5FBF',
    backgroundColor: '#F8F4FF',
  },
  optionText: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 22,
  },
  selectedOptionText: {
    color: '#1F2937',
    fontWeight: '500',
  },
  checkIcon: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
});