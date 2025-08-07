import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacings';

// US Cities list (unique cities only)
const US_CITIES = [
  'New York, NY',
  'Los Angeles, CA',
  'Chicago, IL',
  'Houston, TX',
  'Phoenix, AZ',
  'Philadelphia, PA',
  'San Antonio, TX',
  'San Diego, CA',
  'Dallas, TX',
  'San Jose, CA',
  'Austin, TX',
  'Jacksonville, FL',
  'Fort Worth, TX',
  'Columbus, OH',
  'Charlotte, NC',
  'San Francisco, CA',
  'Indianapolis, IN',
  'Seattle, WA',
  'Denver, CO',
  'Washington, DC',
  'Boston, MA',
  'El Paso, TX',
  'Nashville, TN',
  'Detroit, MI',
  'Oklahoma City, OK',
  'Portland, OR',
  'Las Vegas, NV',
  'Memphis, TN',
  'Louisville, KY',
  'Baltimore, MD',
  'Milwaukee, WI',
  'Albuquerque, NM',
  'Tucson, AZ',
  'Fresno, CA',
  'Sacramento, CA',
  'Mesa, AZ',
  'Kansas City, MO',
  'Atlanta, GA',
  'Long Beach, CA',
  'Colorado Springs, CO',
  'Raleigh, NC',
  'Miami, FL',
  'Virginia Beach, VA',
  'Omaha, NE',
  'Oakland, CA',
  'Minneapolis, MN',
  'Tulsa, OK',
  'Arlington, TX',
  'Tampa, FL',
  'New Orleans, LA',
  'Wichita, KS',
  'Cleveland, OH',
  'Bakersfield, CA',
  'Aurora, CO',
  'Anaheim, CA',
  'Honolulu, HI',
  'Santa Ana, CA',
  'Corpus Christi, TX',
  'Riverside, CA',
  'Lexington, KY',
  'Stockton, CA',
  'Henderson, NV',
  'Saint Paul, MN',
  'St. Louis, MO',
  'Fort Wayne, IN',
  'Jersey City, NJ',
  'Chandler, AZ',
  'Madison, WI',
  'Lubbock, TX',
  'Scottsdale, AZ',
  'Reno, NV',
  'Buffalo, NY',
  'Gilbert, AZ',
  'Glendale, AZ',
  'North Las Vegas, NV',
  'Winston-Salem, NC',
  'Chesapeake, VA',
  'Norfolk, VA',
  'Fremont, CA',
  'Garland, TX',
  'Irving, TX',
  'Hialeah, FL',
  'Richmond, VA',
  'Boise, ID',
  'Spokane, WA',
  'Baton Rouge, LA',
  'Tacoma, WA',
  'San Bernardino, CA',
  'Grand Rapids, MI',
  'Huntsville, AL',
  'Salt Lake City, UT',
  'Fayetteville, NC',
  'Worcester, MA',
  'Yonkers, NY',
  'Amarillo, TX',
  'Glendale, CA',
  'McKinney, TX',
  'Aurora, IL',
  'Montgomery, AL',
  'Shreveport, LA',
  'Akron, OH',
  'Des Moines, IA',
  'Rochester, NY',
  'Modesto, CA',
  'Oxnard, CA',
  'Yuma, AZ',
  'Augusta, GA',
  'Mobile, AL',
  'Little Rock, AR',
  'Moreno Valley, CA',
  'Columbus, GA',
  'Fontana, CA',
  'Knoxville, TN',
  'Fort Lauderdale, FL',
  'Fargo, ND',
  'Birmingham, AL',
  'Vancouver, WA',
  'Sioux Falls, SD',
  'Arlington, VA',
  'Plano, TX',
  'Cape Coral, FL',
  'Rochester, MN',
  'Fayetteville, AR',
  'Tempe, AZ',
  'Overland Park, KS',
  'Salem, OR',
  'Springfield, MO',
  'Tallahassee, FL',
  'Newport News, VA',
  'Brownsville, TX',
  'Santa Clarita, CA',
  'Fort Collins, CO',
  'Ann Arbor, MI',
  'Lansing, MI',
  'Springfield, IL',
  'Jackson, MS',
  'Pembroke Pines, FL',
  'Hayward, CA',
  'Sunnyvale, CA',
  'Macon, GA',
  'Pomona, CA',
  'Escondido, CA',
  'Pasadena, TX',
  'New Bedford, MA',
  'Concord, NC',
  'Fairfield, CA',
  'Lakeland, FL',
  'Corona, CA',
  'Champaign, IL',
  'Springfield, MA',
  'Murfreesboro, TN',
  'Beaumont, TX',
  'Odessa, TX',
  'Gresham, OR',
  'Frisco, TX',
  'Cary, NC',
  'Santa Rosa, CA',
  'Garden Grove, CA',
  'Deerfield Beach, FL',
  'Peoria, AZ',
  'Rockford, IL',
  'Independence, MO',
  'Killeen, TX',
];

interface CityPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (city: string) => void;
  currentCity?: string;
  title?: string;
}

export default function CityPickerModal({
  visible,
  onClose,
  onConfirm,
  currentCity = '',
  title = 'Select City',
}: CityPickerModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState(currentCity);

  const filteredCities = useMemo(() => {
    if (!searchQuery.trim()) {
      return US_CITIES;
    }
    return US_CITIES.filter(city =>
      city.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleConfirm = () => {
    if (selectedCity) {
      onConfirm(selectedCity);
      onClose();
    }
  };

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
  };

  const renderCityItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[
        styles.cityItem,
        selectedCity === item && styles.cityItemSelected,
      ]}
      onPress={() => handleCitySelect(item)}
    >
      <Text style={[
        styles.cityText,
        selectedCity === item && styles.cityTextSelected,
      ]}>
        {item}
      </Text>
      {selectedCity === item && (
        <Ionicons name="checkmark" size={20} color={colors.text.white} />
      )}
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={colors.text.primary} />
            </TouchableOpacity>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity 
              onPress={handleConfirm} 
              style={[
                styles.confirmButton,
                !selectedCity && styles.confirmButtonDisabled,
              ]}
              disabled={!selectedCity}
            >
              <Text style={[
                styles.confirmText,
                !selectedCity && styles.confirmTextDisabled,
              ]}>
                Done
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color={colors.text.tertiary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search cities..."
              placeholderTextColor={colors.text.tertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <FlatList
            data={filteredCities}
            renderItem={renderCityItem}
            keyExtractor={(item) => item}
            style={styles.cityList}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.background.overlay,
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: colors.background.secondary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.secondary,
  },
  closeButton: {
    padding: spacing.sm,
  },
  title: {
    ...typography.styles.h4,
    color: colors.text.primary,
    fontWeight: typography.weights.semibold,
  },
  confirmButton: {
    padding: spacing.sm,
  },
  confirmButtonDisabled: {
    opacity: 0.5,
  },
  confirmText: {
    ...typography.styles.body,
    color: colors.primary[500],
    fontWeight: typography.weights.semibold,
  },
  confirmTextDisabled: {
    color: colors.text.tertiary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.secondary,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.sm,
    ...typography.styles.body,
    color: colors.text.primary,
  },
  cityList: {
    maxHeight: 400,
  },
  cityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.secondary,
  },
  cityItemSelected: {
    backgroundColor: colors.primary[500],
  },
  cityText: {
    ...typography.styles.body,
    color: colors.text.primary,
  },
  cityTextSelected: {
    color: colors.text.white,
    fontWeight: typography.weights.semibold,
  },
});
