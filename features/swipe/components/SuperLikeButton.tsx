import * as React from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';

type Props = { count?: number; onPress?: () => void };

export function SuperLikeButton({ count = 0, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={styles.btn}>
      <Text style={styles.star}>★</Text>
      <View style={{ width: 6 }} />
      <Text style={styles.label}>Super Like</Text>
      <View style={{ width: 6 }} />
      <Text style={styles.badge}>{count}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0ea5e9',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  star: { color: '#fff', fontSize: 16 },
  label: { color: '#fff', fontWeight: '700' },
  badge: { color: '#fff', fontVariant: ['tabular-nums'] },
});
