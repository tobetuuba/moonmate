import * as React from 'react';
import { SafeAreaView, View, Text, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { useSwipeDeck } from '../features/swipe/hooks/useSwipeDeck';
import { SwipeCard } from '../features/swipe/components/SwipeCard';
import { SuperLikeButton } from '../features/swipe/components/SuperLikeButton';

export default function VisualMatchScreen() {
  const { cards, onLike, onPass, onSuperlike, isLoading, error, hasMore, refresh } = useSwipeDeck();

  const currentCard = React.useMemo(() => cards[0], [cards]);

  if (isLoading && cards.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator />
          <Text style={styles.muted}>Loading profiles...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && cards.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.error}>{error}</Text>
          <Pressable onPress={refresh} style={[styles.button, styles.primary]}>
            <Text style={styles.buttonText}>Try Again</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (!currentCard) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.muted}>No more profiles to show</Text>
          <Pressable onPress={refresh} style={[styles.button, styles.secondary]}>
            <Text style={styles.buttonText}>Refresh</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <SwipeCard
          profile={currentCard}
          onLike={() => onLike(currentCard.id)}
          onPass={() => onPass(currentCard.id)}
        />

        <View style={styles.actions}>
          <Pressable onPress={() => onPass(currentCard.id)} style={[styles.button, styles.secondary]}>
            <Text style={styles.buttonText}>Pass</Text>
          </Pressable>

          <SuperLikeButton count={3} onPress={() => onSuperlike(currentCard.id)} />

          <Pressable onPress={() => onLike(currentCard.id)} style={[styles.button, styles.primary]}>
            <Text style={styles.buttonText}>Like</Text>
          </Pressable>
        </View>

        {isLoading && <Text style={styles.mutedSmall}>Loading more...</Text>}
        {!isLoading && hasMore && (
          <Text style={styles.mutedSmall}>Swipe to load more</Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0B0C' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 16 },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
    paddingHorizontal: 12,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    minWidth: 96,
    alignItems: 'center',
  },
  primary: { backgroundColor: '#2563eb' },
  secondary: { backgroundColor: '#374151' },
  buttonText: { color: '#fff', fontWeight: '600' },
  muted: { color: '#A1A1AA', marginTop: 8 },
  mutedSmall: { color: '#9CA3AF', marginTop: 8, fontSize: 12 },
  error: { color: '#ef4444', textAlign: 'center', marginBottom: 12 },
});
