import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  PanResponder,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface PersonalitySliderProps {
  label: string;
  value: number;
  onValueChange: (value: number) => void;
}

export default function PersonalitySlider({ label, value, onValueChange }: PersonalitySliderProps) {
  const [pan] = useState(new Animated.ValueXY());
  const [sliderWidth, setSliderWidth] = useState(0);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      pan.setOffset({
        x: pan.x._value,
        y: 0,
      });
    },
    onPanResponderMove: (event, gestureState) => {
      const newX = Math.max(0, Math.min(sliderWidth - 16, gestureState.moveX - 8));
      const percentage = (newX / (sliderWidth - 16)) * 100;
      onValueChange(Math.max(0, Math.min(100, percentage)));
    },
    onPanResponderRelease: () => {
      pan.flattenOffset();
    },
  });

  const handleSliderPress = (event: any) => {
    const { locationX } = event.nativeEvent;
    const percentage = (locationX / sliderWidth) * 100;
    onValueChange(Math.max(0, Math.min(100, percentage)));
  };

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.valueContainer}>
          <LinearGradient
            colors={['#FF6B9D', '#C44569']}
            style={styles.valueBadge}
          >
            <Text style={styles.valueText}>{Math.round(value)}</Text>
          </LinearGradient>
        </View>
      </View>
      <View
        style={styles.track}
        onLayout={(event) => setSliderWidth(event.nativeEvent.layout.width)}
      >
        <TouchableOpacity
          style={styles.trackTouchable}
          onPress={handleSliderPress}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#FF6B9D', '#C44569', '#8B5FBF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[
              styles.fill, 
              { width: `${value}%` }
            ]}
          />
        </TouchableOpacity>
        <Animated.View
          style={[
            styles.thumb,
            { left: `${value}%` }
          ]}
          {...panResponder.panHandlers}
        >
          <LinearGradient
            colors={['#FF6B9D', '#C44569']}
            style={styles.thumbGradient}
          />
        </Animated.View>
      </View>
      <View style={styles.labels}>
        <Text style={styles.minMaxLabel}>😔 Low</Text>
        <Text style={styles.minMaxLabel}>😊 High</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  valueContainer: {
    alignItems: 'center',
  },
  valueBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    minWidth: 40,
    alignItems: 'center',
  },
  valueText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  track: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    position: 'relative',
  },
  trackTouchable: {
    flex: 1,
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
  thumb: {
    position: 'absolute',
    top: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    transform: [{ translateX: -12 }],
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  thumbGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  minMaxLabel: {
    fontSize: 14,
    color: '#8B5FBF',
    fontWeight: '600',
  },
}); 