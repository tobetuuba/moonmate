import * as React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import type { CandidateProfile } from '../../../entities/swipe/swipe.entity';

type Props = {
  profile: CandidateProfile;
  onLike?: () => void;
  onPass?: () => void;
};

export function SwipeCard({ profile, onLike, onPass }: Props) {
  return (
    <View style={styles.card}>
      {profile.profilePhotoUrl ? (
        <Image source={{ uri: profile.profilePhotoUrl }} style={styles.photo} />
      ) : (
        <View style={[styles.photo, styles.photoPlaceholder]}>
          <Text style={styles.photoPlaceholderText}>{profile.displayName?.[0] ?? '🙂'}</Text>
        </View>
      )}
      <Text style={styles.title}>
        {profile.displayName} {profile.age ? `• ${profile.age}` : ''}
      </Text>
      {profile.bio ? <Text style={styles.bio}>{profile.bio}</Text> : null}
      <View style={styles.row}>
        <Pressable onPress={onPass} style={[styles.btn, styles.secondary]}>
          <Text style={styles.btnText}>Pass</Text>
        </Pressable>
        <Pressable onPress={onLike} style={[styles.btn, styles.primary]}>
          <Text style={styles.btnText}>Like</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#111318',
    borderRadius: 16,
    padding: 12,
    gap: 8,
  },
  photo: { width: '100%', height: 380, borderRadius: 12, backgroundColor: '#222' },
  photoPlaceholder: { alignItems: 'center', justifyContent: 'center' },
  photoPlaceholderText: { fontSize: 48, color: '#9CA3AF' },
  title: { color: '#fff', fontSize: 20, fontWeight: '700', marginTop: 6 },
  bio: { color: '#D1D5DB' },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginTop: 10 },
  btn: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 10 },
  primary: { backgroundColor: '#2563eb' },
  secondary: { backgroundColor: '#374151' },
  btnText: { color: '#fff', fontWeight: '600' },
});
