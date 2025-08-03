import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth } from './firebase';

export async function uploadImageAsync(uri: string, storagePath: string): Promise<string> {
  try {
    console.log('StorageService: Starting upload for:', uri);
    console.log('StorageService: Storage path:', storagePath);
    
    // Check if user is authenticated
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Convert local URI to Blob
    const response = await fetch(uri);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }
    
    const blob = await response.blob();
    console.log('StorageService: Blob created, size:', blob.size, 'bytes');

    if (!blob || blob.size === 0) {
      throw new Error('Invalid image blob');
    }

    // Create a reference and upload
    const imageRef = ref(storage, storagePath);
    console.log('StorageService: Uploading to Firebase Storage...');
    
    const uploadResult = await uploadBytes(imageRef, blob, {
      contentType: blob.type || 'image/jpeg',
      cacheControl: 'public, max-age=31536000',
    });
    
    console.log('StorageService: Upload successful');

    // Return the download URL
    const downloadURL = await getDownloadURL(uploadResult.ref);
    console.log('StorageService: Download URL obtained:', downloadURL);
    
    return downloadURL;
  } catch (error) {
    console.error('StorageService: Upload failed:', error);
    throw error;
  }
}

export async function uploadProfilePhoto(uri: string): Promise<string> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('User not authenticated');
  }

  const timestamp = Date.now();
  const path = `profile-photos/${user.uid}/profile_${timestamp}.jpg`;
  return uploadImageAsync(uri, path);
}

export async function uploadGalleryPhoto(uri: string): Promise<string> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('User not authenticated');
  }

  const timestamp = Date.now();
  const path = `gallery-photos/${user.uid}/gallery_${timestamp}.jpg`;
  return uploadImageAsync(uri, path);
} 