import { doc, getDoc, setDoc, updateDoc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { UserProfile } from '../../types/profile';

// Add new types for preferences
type MatchPrefs = {
  seeking: string[];
  ageRange: { min: number; max: number };
  distanceKm: number;
  intent: string[];  // Changed to array to match Firestore structure
  monogamy: boolean;
  childrenPlan: string[];  // Changed to array to match Firestore structure
  version?: number;
  updatedAt?: any;
};

// Remove RelationshipPrefs type since we're merging it into MatchPrefs

export class ProfileService {
  private static COLLECTION = 'users';

  /**
   * Fetch user profile from Firestore
   */
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const userDoc = doc(db, this.COLLECTION, userId);
      const userDocSnap = await getDoc(userDoc);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        console.log('📄 Firestore user data:', userData);
        
        // Also fetch match preferences from users/{uid}/preferences/match
        const matchPrefsDoc = doc(db, this.COLLECTION, userId, 'preferences', 'match');
        const matchPrefsSnap = await getDoc(matchPrefsDoc);
        
        let matchPrefs = null;
        if (matchPrefsSnap.exists()) {
          matchPrefs = matchPrefsSnap.data();
          console.log('📊 Firestore match preferences:', matchPrefs);
        } else {
          console.log('📊 No match preferences found, using defaults');
          matchPrefs = {
            seeking: [],
            ageRange: { min: 25, max: 35 },
            distanceKm: 50,
            intent: [],
            monogamy: true,
            childrenPlan: [],
          };
        }
        
        // Calculate age from birthDate if available
        let age = userData.age || 0;
        if (userData.birthDate) {
          const birthDate = new Date(userData.birthDate);
          const today = new Date();
          age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
          }
        }
        
        return {
          id: userId,
          displayName: userData.displayName || '',
          age: age,
          birthDate: userData.birthDate,
          birthTime: userData.birthTime,
          height: userData.height,
          profession: userData.profession,
          birthPlace: userData.birthPlace,
          location: userData.location,
          gender: userData.gender,
          pronouns: userData.pronouns,
  
                  // Match preferences from users/{uid}/preferences/match
        seeking: matchPrefs.seeking || [],
        ageRange: matchPrefs.ageRange || { min: 25, max: 35 },
        maxDistance: matchPrefs.distanceKm || 50,
        monogamy: matchPrefs.monogamy,

          relationshipGoals: userData.relationshipGoals || [],
          bio: userData.bio || '',
          prompts: userData.prompts || {},
          photos: userData.photos || [],
          profilePhotoUrl: userData.profilePhotoUrl,
          personality: userData.personality,
          interests: userData.interests || [],

          smoking: userData.smoking,
          drinking: userData.drinking,
          diet: userData.diet,
          exercise: userData.exercise,
          socialLinks: {
            instagram: userData.socialLinks?.instagram || '',
            spotify: userData.socialLinks?.spotify || '',
            twitter: userData.socialLinks?.twitter || '',
            linkedin: userData.socialLinks?.linkedin || '',
          },
          showOrientation: userData.showOrientation,
          showGender: userData.showGender,
          incognitoMode: userData.incognitoMode,
          acceptTerms: userData.acceptTerms,
          acceptPrivacy: userData.acceptPrivacy,
          createdAt: userData.createdAt?.toDate(),
          updatedAt: userData.updatedAt?.toDate(),
        };
      }

      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }

  /**
   * Create or update user profile
   */
  static async updateUserProfile(userId: string, profileData: Partial<UserProfile>): Promise<void> {
    console.log('🔥 ProfileService.updateUserProfile called');
    console.log('👤 User ID:', userId);
    console.log('📝 Profile data:', JSON.stringify(profileData, null, 2));
    
    try {
      const userDoc = doc(db, this.COLLECTION, userId);
      console.log('📄 Firestore document path:', `${this.COLLECTION}/${userId}`);
      
      const updateData = {
        ...profileData,
        updatedAt: serverTimestamp(),
      };

      console.log('💾 Data to update:', JSON.stringify(updateData, null, 2));

      await setDoc(userDoc, updateData, { merge: true });
      console.log('✅ Profile updated successfully in Firestore');
    } catch (error) {
      console.error('❌ Error updating user profile:', error);
      console.error('❌ Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        code: (error as any)?.code,
        userId: userId,
        profileData: profileData,
      });
      throw error;
    }
  }

  /**
   * Update specific profile fields
   */
  static async updateProfileFields(userId: string, fields: Partial<UserProfile>): Promise<void> {
    try {
      const userDoc = doc(db, this.COLLECTION, userId);
      
      const updateData = {
        ...fields,
        updatedAt: serverTimestamp(),
      };

      await updateDoc(userDoc, updateData);
      console.log('✅ Profile fields updated successfully');
    } catch (error) {
      console.error('Error updating profile fields:', error);
      throw error;
    }
  }

  /**
   * Update bio
   */
  static async updateBio(userId: string, bio: string): Promise<void> {
    await this.updateProfileFields(userId, { bio });
  }

  /**
   * Update interests
   */
  static async updateInterests(userId: string, interests: string[]): Promise<void> {
    await this.updateProfileFields(userId, { interests });
  }

  /**
   * Update photos
   */
  static async updatePhotos(userId: string, photos: string[]): Promise<void> {
    await this.updateProfileFields(userId, { photos });
  }

  /**
   * Update social links
   */
  static async updateSocialLinks(userId: string, socialLinks: UserProfile['socialLinks']): Promise<void> {
    await this.updateProfileFields(userId, { socialLinks });
  }

  /**
   * Create new user profile
   */
  static async createUserProfile(profileData: Partial<UserProfile>): Promise<void> {
    console.log('🔥 ProfileService.createUserProfile called');
    console.log('📝 Profile data:', JSON.stringify(profileData, null, 2));
    
    const userId = auth.currentUser?.uid;
    console.log('👤 User ID:', userId);
    
    if (!userId) {
      console.error('❌ User not authenticated');
      throw new Error('User not authenticated');
    }

    try {
      const userRef = doc(db, 'users', userId);
      console.log('📄 Firestore document path:', `users/${userId}`);
      
      const dataToSave = {
        ...profileData,
        id: userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      
      console.log('💾 Data to save:', JSON.stringify(dataToSave, null, 2));
      
      await setDoc(userRef, dataToSave);
      console.log('✅ Profile created successfully in Firestore');
    } catch (error) {
      console.error('❌ Error creating profile:', error);
      console.error('❌ Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        code: (error as any)?.code,
        userId: userId,
        profileData: profileData,
      });
      throw error;
    }
  }

  /**
   * Create user profile and preferences atomically using Firestore batch
   */
  static async createUserProfileAndPrefs(data: any): Promise<void> {
    console.log('🔥 ProfileService.createUserProfileAndPrefs called');
    console.log('📝 Profile data:', JSON.stringify(data, null, 2));
    
    const uid = auth.currentUser?.uid;
    if (!uid) {
      console.error('❌ User not authenticated');
      throw new Error('User not authenticated');
    }

    const {
      // preferences to be split out:
      preferences,
      // everything else stays in the profile doc:
      ...profileDoc
    } = data;

    // Extract match preferences
    const matchPrefsData = preferences?.match || {};
    const {
      seeking = [],
      ageRange = { min: 25, max: 35 },
      distanceKm = 50,
      intent = [],
      monogamy = true,
      childrenPlan = [],
    } = matchPrefsData;

    const now = serverTimestamp();

    // Root profile (users/{uid})
    // TIP: do not store "age" if present; compute it from birthDate when reading.
    const userRef = doc(db, 'users', uid);

    // Match preferences (users/{uid}/preferences/match) - now includes relationship prefs
    const matchRef = doc(db, 'users', uid, 'preferences', 'match');
    const matchPrefs: MatchPrefs = {
      seeking: seeking,
      ageRange: ageRange,
      distanceKm: distanceKm,
      intent: intent,
      monogamy: monogamy,
      childrenPlan: childrenPlan,
      version: 1,
      updatedAt: now,
    };

    console.log('📊 Split data:', {
      profileDoc,
      matchPrefs,
    });

    const batch = writeBatch(db);

    batch.set(
      userRef,
      {
        ...profileDoc,
        id: uid,
        createdAt: (profileDoc as any)?.createdAt ?? now,
        updatedAt: now,
      },
      { merge: true }
    );

    batch.set(matchRef, matchPrefs, { merge: true });

    console.log('💾 Committing batch write...');
    await batch.commit();
    console.log('✅ Profile and match preferences created successfully in Firestore');
  }
} 