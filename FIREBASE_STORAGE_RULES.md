# Firebase Storage Rules

## Current Issue
The error `Firebase Storage: An unknown error occurred` usually indicates a problem with Firebase Storage rules or configuration.

## Recommended Storage Rules

Add these rules to your Firebase Console > Storage > Rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow authenticated users to upload profile photos
    match /profile-photos/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow authenticated users to upload gallery photos
    match /gallery-photos/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Default rule - deny all other access
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

## Alternative Development Rules (Less Secure)

For development/testing only, you can use these more permissive rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Steps to Fix

1. **Go to Firebase Console**
   - Navigate to Storage > Rules
   - Replace existing rules with the recommended rules above

2. **Check Firebase Configuration**
   - Ensure your `firebase.ts` file has the correct project ID
   - Verify that Storage is enabled in your Firebase project

3. **Test Upload**
   - Try uploading an image again
   - Check console logs for more detailed error information

## Common Issues

1. **Storage Not Enabled**: Make sure Firebase Storage is enabled in your project
2. **Incorrect Rules**: The rules above should allow authenticated users to upload
3. **Network Issues**: Check your internet connection
4. **File Size**: Ensure images aren't too large (recommend < 10MB)

## Debug Steps

1. Check the console logs for detailed error messages
2. Verify that the user is authenticated before upload
3. Test with a smaller image file
4. Check Firebase Console > Storage > Files to see if uploads are appearing 