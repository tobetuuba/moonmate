import type { SwipeAction, SwipeDeck } from '../../entities/swipe/swipe.entity';
import { db } from './client';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { Result, ok, err } from '../../shared/lib/result';

export interface SwipeRepository {
  like(userId: string, targetUserId: string, metadata?: SwipeAction['metadata']): Promise<Result<SwipeAction, Error>>;
  pass(userId: string, targetUserId: string, metadata?: SwipeAction['metadata']): Promise<Result<SwipeAction, Error>>;
  superlike(userId: string, targetUserId: string, metadata?: SwipeAction['metadata']): Promise<Result<SwipeAction, Error>>;
  undo(userId: string): Promise<Result<void, Error>>;
  getSwipeHistory(userId: string, take?: number): Promise<Result<SwipeAction[], Error>>;
  streamDeck(userId: string): Promise<Result<SwipeDeck, Error>>;
}

export class FirebaseSwipeRepository implements SwipeRepository {
  private readonly colName = 'swipes';

  async like(userId: string, targetUserId: string, metadata?: SwipeAction['metadata']): Promise<Result<SwipeAction, Error>> {
    return this.recordSwipe(userId, targetUserId, 'like', metadata);
  }

  async pass(userId: string, targetUserId: string, metadata?: SwipeAction['metadata']): Promise<Result<SwipeAction, Error>> {
    return this.recordSwipe(userId, targetUserId, 'pass', metadata);
  }

  async superlike(userId: string, targetUserId: string, metadata?: SwipeAction['metadata']): Promise<Result<SwipeAction, Error>> {
    return this.recordSwipe(userId, targetUserId, 'superlike', metadata);
  }

  async undo(userId: string): Promise<Result<void, Error>> {
    try {
      // Find the most recent non-deleted swipe of this user and delete it
      const q = query(
        collection(db, this.colName),
        where('userId', '==', userId),
        where('deleted', '==', false),
        orderBy('timestamp', 'desc'),
        limit(1)
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        await deleteDoc(doc(db, this.colName, snap.docs[0].id));
      }
      return ok(undefined);
    } catch (e) {
      return err(e instanceof Error ? e : new Error('Failed to undo swipe'));
    }
  }

  async getSwipeHistory(userId: string, take = 50): Promise<Result<SwipeAction[], Error>> {
    try {
      const q = query(
        collection(db, this.colName),
        where('userId', '==', userId),
        where('deleted', '==', false),
        orderBy('timestamp', 'desc'),
        limit(take)
      );
      const snap = await getDocs(q);
      const swipes: SwipeAction[] = snap.docs.map(d => {
        const data = d.data() as any;
        return {
          id: d.id,
          userId: data.userId,
          targetUserId: data.targetUserId,
          action: data.action,
          timestamp: data.timestamp?.toDate?.() ?? data.timestamp,
          metadata: data.metadata,
        } as SwipeAction;
      });
      return ok(swipes);
    } catch (e) {
      return err(e instanceof Error ? e : new Error('Failed to get swipe history'));
    }
  }

  async streamDeck(userId: string): Promise<Result<SwipeDeck, Error>> {
    try {
      // Minimal placeholder; real candidates are loaded via UserRepository in the feature hook.
      const deck: SwipeDeck = {
        userId,
        candidates: [],
        lastFetched: new Date(),
        hasMore: false,
      };
      return ok(deck);
    } catch (e) {
      return err(e instanceof Error ? e : new Error('Failed to get swipe deck'));
    }
  }

  private async recordSwipe(
    userId: string,
    targetUserId: string,
    action: SwipeAction['action'],
    metadata?: SwipeAction['metadata']
  ): Promise<Result<SwipeAction, Error>> {
    try {
      const data = {
        userId,
        targetUserId,
        pairKey: `${userId}__${targetUserId}`, // directional key (keeps action direction)
        action,
        timestamp: new Date(),
        metadata,
        deleted: false,
      };
      const ref = await addDoc(collection(db, this.colName), data);
      return ok({ id: ref.id, ...data });
    } catch (e) {
      return err(e instanceof Error ? e : new Error(`Failed to record ${action}`));
    }
  }
}
