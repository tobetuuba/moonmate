# Profile Creation Feature

## Overview

The profile creation screen allows users to create a comprehensive profile with all necessary information for the MoonMate dating app. The screen collects user data and stores it in Firebase Firestore.

## Features

### Required Fields
- **Display Name**: Text input for user's display name
- **Birth Date**: Date picker in YYYY-MM-DD format
- **Gender**: Dropdown selection (Woman, Man, Non-binary, Gender fluid, Other)
- **Seeking**: Multi-select options (Men, Women, Everyone, Non-binary)
- **Profile Photo**: Image upload with Firebase Storage

### Optional Fields
- **Birth Time**: Time picker in HH:MM format
- **Birth Place**: Country and city selection with mock coordinates
- **Bio**: Multiline text input (max 500 characters)
- **Relationship Goals**: Multi-select options
- **Personality**: Interactive sliders for Empathy and Openness (0-100)
- **Gallery Photos**: Up to 5 additional photos
- **Current Location**: Can default to birth place

## Technical Implementation

### Firebase Integration
- **Firestore**: Stores user profile data in `users` collection
- **Storage**: Handles image uploads for profile and gallery photos
- **Authentication**: Uses Firebase Auth user ID as document ID

### Components
- `CreateProfileScreen`: Main profile creation screen
- `PersonalitySlider`: Reusable slider component with drag functionality
- `ProfileService`: Service class for profile operations

### Navigation
- Accessible from signup flow
- Accessible from profile screen "Edit Profile" button
- Routes to main app tabs after successful creation

## Usage

### From Signup
1. Complete signup process
2. Automatically redirected to profile creation
3. Fill required fields
4. Submit to create profile

### From Profile Screen
1. Navigate to Profile tab
2. Tap "Edit Profile" button
3. Update profile information
4. Submit changes

## Validation

The form validates:
- Required fields are filled
- Profile photo is uploaded
- Seeking preferences are selected
- Date format is correct

## File Structure

```
app/
├── create-profile.tsx          # Main profile creation screen
└── (tabs)/
    └── profile.tsx             # Profile screen with edit link

components/
└── PersonalitySlider.tsx       # Reusable slider component

services/
├── firebase.ts                 # Firebase configuration
└── api/
    └── ProfileService.ts       # Profile management service
```

## Dependencies

- `expo-image-picker`: Image selection and upload
- `@react-native-community/datetimepicker`: Date and time selection
- `firebase`: Firestore and Storage operations
- `react-native-gesture-handler`: Slider interactions

## Future Enhancements

- Real location services integration
- Advanced image editing
- Profile completion percentage
- Draft saving functionality
- Profile preview before submission 