import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacings';

interface TabIconProps {
  name: keyof typeof Ionicons.glyphMap;
  focused: boolean;
  size?: number;
}

export default function TabIcon({ name, focused, size = 24 }: TabIconProps) {
  return (
    <View style={styles.container}>
      <Ionicons
        name={name}
        size={size}
        color={focused ? colors.primary[500] : colors.text.tertiary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
  },
}); 