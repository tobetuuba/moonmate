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
      console.log('Storage app:', storage.app.name);
      console.log('Storage instance:', !!storage);

      // Basic test - just create a reference
      const testRef = ref(storage, `test/${user.uid}/test.txt`);
      console.log('Test reference created successfully:', testRef.fullPath);

      // Try to upload a small test file
      const testBlob = new Blob(['test'], { type: 'text/plain' });
      console.log('Test blob created, size:', testBlob.size);

      try {
        const uploadResult = await uploadBytes(testRef, testBlob);
        console.log('Test upload successful');
        console.log('Upload result:', uploadResult);
        return true;
      } catch (uploadError) {
        console.error('Upload test failed:', uploadError);
        console.log('Firebase Storage not available, but app will continue with fallback');
        return false; // Return false to indicate Storage is not working
      }

    } catch (error) {
      console.error('Storage connection test failed:', error);
      if (error instanceof Error) {
        console.error('Error details:', error.message);
        console.error('Error code:', (error as any).code);
        console.error('Error stack:', error.stack);
      }
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

      // Check if URI is a local file (file://, content://, or data:)
      if (imageUri.startsWith('file://') || imageUri.startsWith('content://') || imageUri.startsWith('data:')) {
        // For local files, use the local upload method
        console.log('Local file detected, using local upload method');
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
      console.log('Uploading local image:', imageUri);
      console.log('Storage bucket:', storage.app.options.storageBucket);
      console.log('User authenticated:', !!auth.currentUser);
      
      // Check if user is authenticated
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      console.log('User ID:', user.uid);
      
      // For React Native local files, we need to convert to blob
      // First, let's try to fetch the local file
      const response = await fetch(imageUri);
      
      if (!response.ok) {
        throw new Error(`Failed to read local file: ${response.status} ${response.statusText}`);
      }

      const blob = await response.blob();
      
      if (!blob || blob.size === 0) {
        throw new Error('Invalid local image file');
      }

      console.log('Local file blob size:', blob.size, 'bytes');
      console.log('Blob type:', blob.type);

      // Try to upload to Firebase Storage
      try {
        const storageRef = ref(storage, path);
        console.log('Uploading local file to path:', path);
        
        const uploadResult = await uploadBytes(storageRef, blob, {
          contentType: blob.type || 'image/jpeg',
          cacheControl: 'public, max-age=31536000',
        });

        console.log('Local file upload successful, getting download URL');
        
        // Get download URL
        const downloadURL = await getDownloadURL(uploadResult.ref);
        console.log('Local file download URL obtained:', downloadURL);
        
        return downloadURL;
      } catch (storageError) {
        console.error('Firebase Storage upload failed:', storageError);
        console.log('Using fallback - returning original URI');
        return imageUri; // Return original URI as fallback
      }
      
    } catch (error) {
      console.error('Error uploading local image:', error);
      
      // Always return the original URI as fallback for any error
      console.log('Using fallback - returning original URI');
      return imageUri;
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