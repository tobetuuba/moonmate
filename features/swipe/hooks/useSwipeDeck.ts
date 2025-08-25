import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../auth/hooks/useAuth';
import { swipeRepo, userRepo } from '../../../services/firebase/index';
import type { CandidateProfile } from '../../../entities/swipe/swipe.entity';

export interface SwipeDeckViewModel {
  cards: CandidateProfile[];
  onLike: (userId: string) => Promise<void>;
  onPass: (userId: string) => Promise<void>;
  onSuperlike: (userId: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  refresh: () => Promise<void>;
}

function calcAge(birthDate: any): number {
  try {
    const d = birthDate instanceof Date ? birthDate : new Date(birthDate);
    const now = new Date();
    let age = now.getFullYear() - d.getFullYear();
    const m = now.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
    return Math.max(18, Math.min(100, age || 18));
  } catch {
    return 18;
  }
}

function toCandidate(u: any): CandidateProfile {
  return {
    id: u.id,
    displayName: u.displayName ?? '',
    age: calcAge(u.birthDate),
    photos: Array.isArray(u.photos) ? u.photos : [],
    profilePhotoUrl: u.profilePhotoUrl ?? (Array.isArray(u.photos) ? u.photos[0] : ''),
    location: {
      city: u.location?.city ?? '',
      country: u.location?.country ?? '',
      latitude: u.location?.latitude,
      longitude: u.location?.longitude,
    },
    bio: u.bio,
    interests: Array.isArray(u.interests) ? u.interests : [],
    compatibility: typeof u.compatibility === 'number' ? u.compatibility : undefined,
  };
}

export function useSwipeDeck(): SwipeDeckViewModel {
  const { user } = useAuth() as any; // minimal typing for now
  const [cards, setCards] = useState<CandidateProfile[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDeck = useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      setError(null);
      const deckRes = await swipeRepo.streamDeck(user.id);
      if ('value' in deckRes) {
        setCards(deckRes.value.candidates);
        setHasMore(deckRes.value.hasMore);
      } else {
        throw deckRes.error;
      }
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load deck');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const loadMore = useCallback(async () => {
    if (!user?.id || !hasMore) return;
    try {
      setLoading(true);
      const res = await userRepo.findCandidates({
        userId: user.id,
        ageRange: user.preferences?.match?.ageRange ?? { min: 18, max: 99 },
        distanceKm: user.preferences?.match?.distanceKm ?? 100,
        location: user.location ?? { latitude: 0, longitude: 0 },
        excludeIds: cards.map(c => c.id),
        limit: 10,
      });
      if ('value' in res) {
        const mapped = res.value.candidates.map(toCandidate);
        setCards(prev => [...prev, ...mapped]);
        setHasMore(res.value.hasMore);
      } else {
        throw res.error;
      }
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load more');
    } finally {
      setLoading(false);
    }
  }, [user?.id, hasMore, cards]);

  const onLike = useCallback(async (targetId: string) => {
    if (!user?.id) return;
    const r = await swipeRepo.like(user.id, targetId);
    if ('value' in r) setCards(prev => prev.filter(c => c.id !== targetId));
  }, [user?.id]);

  const onPass = useCallback(async (targetId: string) => {
    if (!user?.id) return;
    const r = await swipeRepo.pass(user.id, targetId);
    if ('value' in r) setCards(prev => prev.filter(c => c.id !== targetId));
  }, [user?.id]);

  const onSuperlike = useCallback(async (targetId: string) => {
    if (!user?.id) return;
    const r = await swipeRepo.superlike(user.id, targetId);
    if ('value' in r) setCards(prev => prev.filter(c => c.id !== targetId));
  }, [user?.id]);

  const refresh = useCallback(async () => {
    await fetchDeck();
  }, [fetchDeck]);

  useEffect(() => {
    fetchDeck();
  }, [fetchDeck]);

  return { cards, onLike, onPass, onSuperlike, isLoading, error, hasMore, refresh };
}
