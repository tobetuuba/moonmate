import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { UserProfile } from '../../types/profile';

export class ProfileService {
  private static COLLECTION = 'users';

  /**
   * Fetch user profile from Firestore
   */
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const userDoc = doc(db, this.COLLECTION, userId);
      const docSnap = await getDoc(userDoc);

      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log('📄 Firestore data:', data);
        console.log('📝 Bio from Firestore:', data.bio);
        
        // Calculate age from birthDate if available
        let age = data.age || 0;
        if (data.birthDate) {
          const birthDate = new Date(data.birthDate);
          const today = new Date();
          age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
          }
        }
        
        return {
          id: userId,
          displayName: data.displayName || '',
          age: age,
          birthDate: data.birthDate,
          birthTime: data.birthTime,
          birthPlace: data.birthPlace,
          location: data.location,
          gender: data.gender,
          seeking: data.seeking || [],
          relationshipGoals: data.relationshipGoals || [],
          bio: data.bio || '',
          photos: data.photos || [],
          profilePhotoUrl: data.profilePhotoUrl,
          personality: data.personality,
          interests: data.interests || [],
          socialLinks: {
            instagram: data.socialLinks?.instagram || '',
            spotify: data.socialLinks?.spotify || '',
            twitter: data.socialLinks?.twitter || '',
            linkedin: data.socialLinks?.linkedin || '',
          },
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
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
} 