import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacings';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  animated?: boolean;
}

export default function ProgressBar({ currentStep, totalSteps, animated = true }: ProgressBarProps) {
  const progress = (currentStep - 1) / (totalSteps - 1);
  
  const progressAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (animated) {
      Animated.timing(progressAnim, {
        toValue: progress,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      progressAnim.setValue(progress);
    }
  }, [progress, animated]);

  return (
    <View style={styles.container}>
      <View style={styles.track}>
        <Animated.View 
          style={[
            styles.fill,
            {
              width: progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: spacing.md,
  },
  track: {
    height: 4,
    backgroundColor: colors.background.tertiary,
    borderRadius: 2,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.primary[500],
    borderRadius: 2,
  },
});
