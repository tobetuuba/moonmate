import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface Question {
  id: string;
  question: string;
  options: string[];
  category: 'emotional' | 'lifestyle' | 'values' | 'communication';
}

const questions: Question[] = [
  {
    id: '1',
    question: 'When you\'re feeling overwhelmed, what do you need most from a partner?',
    options: [
      'Someone to listen without trying to fix everything',
      'Practical advice and solutions',
      'Space to process my feelings alone first',
      'Physical comfort and reassurance'
    ],
    category: 'emotional'
  },
  {
    id: '2',
    question: 'How do you prefer to spend a perfect evening together?',
    options: [
      'Deep conversation over dinner',
      'Trying a new adventure or activity',
      'Cozy night in watching movies',
      'Going out with friends and socializing'
    ],
    category: 'lifestyle'
  },
  {
    id: '3',
    question: 'What\'s most important to you in a relationship?',
    options: [
      'Emotional intimacy and understanding',
      'Shared goals and ambitions',
      'Fun and spontaneity',
      'Stability and security'
    ],
    category: 'values'
  },
  {
    id: '4',
    question: 'When you disagree with someone, how do you handle it?',
    options: [
      'Talk it through immediately',
      'Take time to think before discussing',
      'Try to find a compromise quickly',
      'Focus on understanding their perspective first'
    ],
    category: 'communication'
  },
  {
    id: '5',
    question: 'What makes you feel most loved and appreciated?',
    options: [
      'Words of affirmation and appreciation',
      'Quality time and undivided attention',
      'Physical touch and closeness',
      'Acts of service and thoughtful gestures'
    ],
    category: 'emotional'
  }
];

export default function TestMatchScreen() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = (currentQuestionIndex + 1) / questions.length;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };

  const handleNext = () => {
    if (selectedOption) {
      const newAnswers = {
        ...answers,
        [currentQuestion.id]: selectedOption
      };
      setAnswers(newAnswers);
      
      if (isLastQuestion) {
        // AI INTEGRATION HERE: Process answers and generate personality profile
        router.push('/test-result');
      } else {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedOption(null);
      }
    }
  };

  const getCategoryColor = (category: Question['category']) => {
    switch (category) {
      case 'emotional': return '#E91E63';
      case 'lifestyle': return '#8B5FBF';
      case 'values': return '#2196F3';
      case 'communication': return '#FF9800';
      default: return '#8B5FBF';
    }
  };

  const getCategoryIcon = (category: Question['category']) => {
    switch (category) {
      case 'emotional': return <Ionicons name="heart" size={20} color="#FFFFFF" />;
      case 'lifestyle': return <MaterialIcons name="psychology" size={20} color="#FFFFFF" />;
      case 'values': return <MaterialIcons name="check-circle" size={20} color="#FFFFFF" />;
      case 'communication': return <MaterialIcons name="psychology" size={20} color="#FFFFFF" />;
      default: return <MaterialIcons name="psychology" size={20} color="#FFFFFF" />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#1F2937" />
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {currentQuestionIndex + 1} of {questions.length}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.categoryBadge}>
          <View style={[styles.categoryIcon, { backgroundColor: getCategoryColor(currentQuestion.category) }]}>
            {getCategoryIcon(currentQuestion.category)}
          </View>
          <Text style={styles.categoryText}>
            {currentQuestion.category.charAt(0).toUpperCase() + currentQuestion.category.slice(1)}
          </Text>
        </View>

        <Text style={styles.questionText}>{currentQuestion.question}</Text>

        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionCard,
                selectedOption === option && styles.selectedOption
              ]}
              onPress={() => handleOptionSelect(option)}>
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
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.nextButton, !selectedOption && styles.disabledButton]}
          onPress={handleNext}
          disabled={!selectedOption}>
          <LinearGradient
            colors={selectedOption ? ['#8B5FBF', '#E91E63'] : ['#9CA3AF', '#9CA3AF']}
            style={styles.nextButtonGradient}>
            <Text style={styles.nextButtonText}>
              {isLastQuestion ? 'Complete Test' : 'Next Question'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
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
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    gap: 16,
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  progressContainer: {
    flex: 1,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8B5FBF',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  questionText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 32,
    lineHeight: 32,
  },
  optionsContainer: {
    gap: 12,
  },
  optionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  selectedOption: {
    borderColor: '#8B5FBF',
    backgroundColor: '#F3F4F6',
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
    top: 16,
    right: 16,
  },
  footer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  nextButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  disabledButton: {
    opacity: 0.6,
  },
  nextButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});