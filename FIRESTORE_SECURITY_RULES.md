# Firestore Security Rules for New Schema

## Overview
After refactoring the profile creation to use a simplified subcollection structure for preferences, you need to update your Firestore security rules to allow access to the new structure.

## New Schema Structure
```
users/{uid} (core profile)
users/{uid}/preferences/match (seeking, ageRange, distanceKm, intent, monogamy, childrenPlan)
```

## Required Security Rules

Copy and paste these rules in your Firebase Console > Firestore Database > Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - core profile
    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
      
      // Match preferences subcollection (includes relationship preferences)
      match /preferences/match {
        allow read, write: if request.auth != null && request.auth.uid == uid;
      }
    }
  }
}
```

## What These Rules Do

1. **Root Profile Access**: Users can only read/write their own profile at `users/{uid}`
2. **Match Preferences Access**: Users can only read/write their own match preferences at `users/{uid}/preferences/match`
3. **Authentication Required**: All operations require valid authentication
4. **UID Matching**: Users can only access documents where the document ID matches their auth UID

## Testing the Rules

After updating the rules:

1. **Test Profile Creation**: Create a new profile through the onboarding flow
2. **Verify Subcollection**: Check that `preferences/match` is created with all preferences
3. **Test Access Control**: Try to access another user's preferences (should be denied)

## Migration Notes

- Existing profiles will continue to work
- New profiles will use the simplified subcollection structure
- Old `seeking`, `ageRange`, `maxDistance` fields in root profile are deprecated
- All match and relationship preferences are now consolidated in one subcollection
- Consider adding a migration script later to move existing data to subcollections

## Troubleshooting

If you get permission errors:

1. **Check Authentication**: Ensure user is properly authenticated
2. **Verify UID**: Ensure the document ID matches the user's auth UID
3. **Check Rules Deployment**: Ensure rules are properly deployed in Firebase Console
4. **Clear Cache**: Clear any cached authentication tokens
