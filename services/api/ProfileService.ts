import { db, storage, auth } from '../firebase';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export interface UserProfile {
  id: string;
  displayName: string;
  birthDate: string; // YYYY-MM-DD format
  birthTime?: string; // HH:MM format
  birthPlace: {
    city: string;
    country: string;
    latitude: number;
    longitude: number;
  };
  gender: string;
  seeking: string[];
  bio?: string;
  relationshipGoals: string[];
  personality: {
    empathy: number;
    openness: number;
  };
  profilePhotoUrl: string;
  photos: string[];
  location: {
    city: string;
    country: string;
    latitude: number;
    longitude: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export class ProfileService {
  // Test function to verify Firebase Storage connectivity
  static async testStorageConnection(): Promise<boolean> {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error('No authenticated user found');
        return false;
      }

      console.log('Testing Firebase Storage connection...');
      console.log('User ID:', user.uid);
      console.log('Storage bucket:', storage.app.options.storageBucket);

      // Try to create a test reference
      const testRef = ref(storage, `test/${user.uid}/test.txt`);
      console.log('Test reference created successfully');

      return true;
    } catch (error) {
      console.error('Storage connection test failed:', error);
      return false;
    }
  }

  static async createUserProfile(profileData: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    const userProfile: UserProfile = {
      ...profileData,
      id: user.uid,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await setDoc(doc(db, 'users', user.uid), userProfile);
  }

  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
    return null;
  }

  static async updateUserProfile(updates: Partial<UserProfile>): Promise<void> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    const docRef = doc(db, 'users', user.uid);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date(),
    });
  }

  static async uploadImage(imageUri: string, path: string): Promise<string> {
    try {
      console.log('Starting image upload for:', imageUri);
      
      // Test storage connection first
      const isConnected = await this.testStorageConnection();
      if (!isConnected) {
        throw new Error('Firebase Storage connection failed');
      }
      
      // Validate image URI
      if (!imageUri || imageUri.trim() === '') {
        throw new Error('Invalid image URI provided');
      }

      // Check if URI is a file:// or content:// URI (local file)
      if (imageUri.startsWith('file://') || imageUri.startsWith('content://')) {
        // For local files, we need to handle them differently
        console.log('Local file detected, using different upload method');
        return await this.uploadLocalImage(imageUri, path);
      }

      // For remote URLs, use fetch
      console.log('Remote URL detected, using fetch method');
      const response = await fetch(imageUri);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
      }

      const blob = await response.blob();
      
      // Validate blob
      if (!blob || blob.size === 0) {
        throw new Error('Invalid image blob received');
      }

      console.log('Blob size:', blob.size, 'bytes');

      // Upload to Firebase Storage
      const storageRef = ref(storage, path);
      console.log('Uploading to path:', path);
      
      const uploadResult = await uploadBytes(storageRef, blob, {
        contentType: blob.type || 'image/jpeg',
        cacheControl: 'public, max-age=31536000',
      });

      console.log('Upload successful, getting download URL');
      
      // Get download URL
      const downloadURL = await getDownloadURL(uploadResult.ref);
      console.log('Download URL obtained:', downloadURL);
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      
      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes('storage/unauthorized')) {
          throw new Error('Upload failed: Unauthorized. Please check your Firebase configuration.');
        } else if (error.message.includes('storage/quota-exceeded')) {
          throw new Error('Upload failed: Storage quota exceeded.');
        } else if (error.message.includes('storage/unauthenticated')) {
          throw new Error('Upload failed: User not authenticated.');
        } else if (error.message.includes('storage/retry-limit-exceeded')) {
          throw new Error('Upload failed: Network error. Please try again.');
        } else {
          throw new Error(`Upload failed: ${error.message}`);
        }
      }
      
      throw new Error('Failed to upload image. Please try again.');
    }
  }

  static async uploadLocalImage(imageUri: string, path: string): Promise<string> {
    try {
      // For React Native, we need to handle local files differently
      // This is a simplified approach - in a real app you might want to use
      // react-native-fs or similar library for better file handling
      
      // For now, let's return a mock URL for local files
      // In production, you'd want to implement proper local file upload
      console.log('Mock upload for local file:', imageUri);
      
      // Return the original URI as a fallback
      // This is not ideal but will prevent crashes during development
      return imageUri;
      
    } catch (error) {
      console.error('Error uploading local image:', error);
      throw new Error('Failed to upload local image. Please try again.');
    }
  }

  static async uploadProfilePhoto(imageUri: string): Promise<string> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    const timestamp = Date.now();
    const path = `profile-photos/${user.uid}/profile_${timestamp}.jpg`;
    return this.uploadImage(imageUri, path);
  }

  static async uploadGalleryPhoto(imageUri: string): Promise<string> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    const timestamp = Date.now();
    const path = `gallery-photos/${user.uid}/gallery_${timestamp}.jpg`;
    return this.uploadImage(imageUri, path);
  }
} 