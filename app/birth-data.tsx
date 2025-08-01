import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';

interface BirthData {
  date: Date | null;
  time: Date | null;
  place: string;
  city: string;
  country: string;
}

export default function BirthDataInputScreen() {
  const [birthData, setBirthData] = useState<BirthData>({
    date: null,
    time: null,
    place: '',
    city: '',
    country: ''
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setBirthData(prev => ({ ...prev, date: selectedDate }));
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setBirthData(prev => ({ ...prev, time: selectedTime }));
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'Select Date';
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time: Date | null) => {
    if (!time) return 'Select Time';
    return time.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return birthData.date !== null;
      case 2:
        return birthData.time !== null;
      case 3:
        return birthData.city.trim() !== '' && birthData.country.trim() !== '';
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (isStepValid()) {
      if (currentStep < 3) {
        setCurrentStep(prev => prev + 1);
      } else {
        // All data collected, proceed to zodiac match
        router.push('/zodiac-match');
      }
    } else {
      Alert.alert('Missing Information', 'Please fill in all required fields before continuing.');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else {
      router.back();
    }
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <MaterialIcons name="cake" size={32} color="#8B5FBF" />
        <Text style={styles.stepTitle}>When were you born?</Text>
        <Text style={styles.stepDescription}>
          Your birth date helps us calculate your zodiac sign and astrological profile
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.inputField, birthData.date && styles.inputFieldFilled]}
        onPress={() => setShowDatePicker(true)}>
        <Ionicons name="calendar" size={20} color="#8B5FBF" />
        <Text style={[styles.inputText, birthData.date && styles.inputTextFilled]}>
          {formatDate(birthData.date)}
        </Text>
        <Ionicons name="chevron-forward" size={20} color="#8B5FBF" />
      </TouchableOpacity>

      {birthData.date && (
        <View style={styles.zodiacPreview}>
          <Text style={styles.zodiacLabel}>Your Zodiac Sign:</Text>
          <Text style={styles.zodiacSign}>
            {getZodiacSign(birthData.date)}
          </Text>
        </View>
      )}
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <MaterialIcons name="schedule" size={32} color="#8B5FBF" />
        <Text style={styles.stepTitle}>What time were you born?</Text>
        <Text style={styles.stepDescription}>
          Birth time is crucial for accurate astrological calculations and compatibility
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.inputField, birthData.time && styles.inputFieldFilled]}
        onPress={() => setShowTimePicker(true)}>
        <Ionicons name="time" size={20} color="#8B5FBF" />
        <Text style={[styles.inputText, birthData.time && styles.inputTextFilled]}>
          {formatTime(birthData.time)}
        </Text>
        <Ionicons name="chevron-forward" size={20} color="#8B5FBF" />
      </TouchableOpacity>

      <View style={styles.infoCard}>
        <Ionicons name="information-circle" size={20} color="#8B5FBF" />
        <Text style={styles.infoText}>
          Don't know your exact birth time? Ask your parents or check your birth certificate. 
          An approximate time is better than leaving it blank.
        </Text>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <MaterialIcons name="location-on" size={32} color="#8B5FBF" />
        <Text style={styles.stepTitle}>Where were you born?</Text>
        <Text style={styles.stepDescription}>
          Birth location affects your astrological chart and compatibility calculations
        </Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>City</Text>
        <TextInput
          style={[styles.textInput, birthData.city && styles.inputFieldFilled]}
          placeholder="Enter your birth city"
          value={birthData.city}
          onChangeText={(text) => setBirthData(prev => ({ ...prev, city: text }))}
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Country</Text>
        <TextInput
          style={[styles.textInput, birthData.country && styles.inputFieldFilled]}
          placeholder="Enter your birth country"
          value={birthData.country}
          onChangeText={(text) => setBirthData(prev => ({ ...prev, country: text }))}
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <View style={styles.infoCard}>
        <Ionicons name="globe" size={20} color="#8B5FBF" />
        <Text style={styles.infoText}>
          This information helps us calculate your birth chart and find the most compatible matches.
        </Text>
      </View>
    </View>
  );

  const getZodiacSign = (date: Date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries';
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus';
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemini';
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer';
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo';
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo';
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra';
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio';
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius';
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricorn';
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius';
    return 'Pisces';
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#8B5FBF', '#E91E63']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.title}>Birth Data</Text>
          <View style={styles.placeholder} />
        </View>
      </LinearGradient>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${(currentStep / 3) * 100}%` }]} />
        </View>
        <Text style={styles.progressText}>Step {currentStep} of 3</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.nextButton, !isStepValid() && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={!isStepValid()}>
          <Text style={[styles.nextButtonText, !isStepValid() && styles.nextButtonTextDisabled]}>
            {currentStep === 3 ? 'Complete Setup' : 'Continue'}
          </Text>
          <Ionicons 
            name="chevron-forward" 
            size={20} 
            color={isStepValid() ? "#FFFFFF" : "#9CA3AF"} 
          />
        </TouchableOpacity>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={birthData.date || new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={birthData.time || new Date()}
          mode="time"
          display="default"
          onChange={handleTimeChange}
        />
      )}
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
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8B5FBF',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  stepContainer: {
    flex: 1,
  },
  stepHeader: {
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  inputField: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 12,
  },
  inputFieldFilled: {
    borderColor: '#8B5FBF',
    backgroundColor: '#F8F9FF',
  },
  inputText: {
    flex: 1,
    fontSize: 16,
    color: '#9CA3AF',
  },
  inputTextFilled: {
    color: '#1F2937',
    fontWeight: '600',
  },
  zodiacPreview: {
    backgroundColor: '#F8F9FF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  zodiacLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  zodiacSign: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B5FBF',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#0369A1',
    lineHeight: 20,
  },
  footer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  nextButton: {
    backgroundColor: '#8B5FBF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  nextButtonDisabled: {
    backgroundColor: '#F3F4F6',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  nextButtonTextDisabled: {
    color: '#9CA3AF',
  },
}); 