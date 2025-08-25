import {
  doc, getDoc, updateDoc, collection, where, orderBy,
  limit as fsLimit, getDocs, query as fsQuery, documentId, Timestamp
} from 'firebase/firestore';
import { db } from './client';
import { Result, ok, err } from '../../shared/lib/result';

// Helper functions for mapping Firestore DTO to domain
const asDate = (v: any) => (v?.toDate?.() ? v.toDate() : v);
const mapUser = (dto: any, id: string) => ({
  id,
  ...dto,
  birthDate: asDate(dto.birthDate),
  birthTime: asDate(dto.birthTime),
  createdAt: asDate(dto.createdAt),
  updatedAt: asDate(dto.updatedAt),
  lastActiveAt: asDate(dto.lastActiveAt),
}) as User;

export interface UserRepository {
  getById(userId: string): Promise<Result<User, Error>>;
  getCurrent(): Promise<Result<User, Error>>;
  upsertProfile(userId: string, profile: Partial<User>): Promise<Result<User, Error>>;
  findCandidates(params: CandidateQuery): Promise<Result<CandidateResult, Error>>;
  updateLastActive(userId: string): Promise<Result<void, Error>>;
}

export interface CandidateQuery {
  userId: string;
  ageRange: { min: number; max: number };
  distanceKm: number;
  location: { latitude: number; longitude: number };
  excludeIds: string[];
  limit: number;
}

export interface CandidateResult {
  candidates: User[];
  hasMore: boolean;
  lastFetched: Date;
}

// Placeholder User interface - replace with your actual User type
interface User {
  id: string;
  location: { latitude: number; longitude: number };
  // ... other user properties
}

export class FirebaseUserRepository implements UserRepository {
  private readonly collection = 'users';

  async getById(userId: string): Promise<Result<User, Error>> {
    try {
      const ref = doc(db, this.collection, userId);
      const snap = await getDoc(ref);
      if (!snap.exists()) return err(new Error('User not found'));
      const dto = snap.data() as any;
      const user = mapUser(dto, snap.id);
      return ok(user);
    } catch (e) {
      return err(e instanceof Error ? e : new Error('Failed to fetch user'));
    }
  }

  async getCurrent(): Promise<Result<User, Error>> {
    // This would get the current user ID from auth context
    // For now, we'll require it to be passed in
    throw new Error('getCurrent requires auth context - use getById instead');
  }

  async upsertProfile(userId: string, profile: Partial<User>): Promise<Result<User, Error>> {
    try {
      const docRef = doc(db, this.collection, userId);
      const now = new Date();
      
      const updateData = {
        ...profile,
        updatedAt: now,
        lastActiveAt: now,
      };

      await updateDoc(docRef, updateData);
      
      // Fetch updated profile
      return this.getById(userId);
    } catch (error) {
      return err(error instanceof Error ? error : new Error('Failed to update profile'));
    }
  }

  async findCandidates(params: CandidateQuery): Promise<Result<CandidateResult, Error>> {
    try {
      const { userId, ageRange, distanceKm, location, excludeIds, limit: take } = params;

      const now = new Date();
      const minDate = new Date(now.getFullYear() - ageRange.max, now.getMonth(), now.getDate());
      const maxDate = new Date(now.getFullYear() - ageRange.min, now.getMonth(), now.getDate());

      const col = collection(db, this.collection);
      const parts: any[] = [
        where('birthDate', '>=', Timestamp.fromDate(minDate)),
        where('birthDate', '<=', Timestamp.fromDate(maxDate)),
        orderBy('birthDate', 'desc'),
        fsLimit(take),
      ];

      const idsToExclude = [userId, ...excludeIds].slice(0, 10);
      if (idsToExclude.length > 0 && idsToExclude.length <= 10) {
        parts.unshift(where(documentId(), 'not-in', idsToExclude));
      }

      const q = fsQuery(col, ...parts);
      const snap = await getDocs(q);

      const out: User[] = [];
      snap.forEach(d => {
        const dto = d.data() as any;
        const user = mapUser(dto, d.id);
        // client-side distance filter
        const dist = this.calculateDistance(
          location.latitude, location.longitude,
          user.location.latitude, user.location.longitude
        );
        if (dist <= distanceKm && !excludeIds.includes(user.id) && user.id !== userId) {
          out.push(user);
        }
      });

      return ok({ candidates: out, hasMore: out.length === take, lastFetched: new Date() });
    } catch (e) {
      return err(e instanceof Error ? e : new Error('Failed to find candidates'));
    }
  }

  async updateLastActive(userId: string): Promise<Result<void, Error>> {
    try {
      await updateDoc(doc(db, this.collection, userId), { lastActiveAt: new Date() });
      return ok(undefined);
    } catch (e) {
      return err(e instanceof Error ? e : new Error('Failed to update last active'));
    }
  }

  private toRad(d: number) { return d * Math.PI / 180; }
  private calculateDistance(aLat: number, aLon: number, bLat: number, bLon: number) {
    const R = 6371;
    const dLat = this.toRad(bLat - aLat);
    const dLon = this.toRad(bLon - aLon);
    const s = Math.sin(dLat/2)**2 + Math.cos(this.toRad(aLat))*Math.cos(this.toRad(bLat))*Math.sin(dLon/2)**2;
    return 2 * R * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
  }
}


