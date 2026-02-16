# Firebase Setup Instructions

To enable Google Authentication and Firestore Database in your CertiHub app, follow these steps:

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard

## 2. Enable Google Authentication

1. In Firebase Console, go to "Authentication" from the left sidebar
2. Click "Get started" if it's your first time
3. Go to the "Sign-in method" tab
4. Click on "Google" in the providers list
5. Toggle "Enable"
6. Add your project support email
7. Click "Save"

## 3. Enable Firestore Database

1. In Firebase Console, go to "Firestore Database" from the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select your preferred location (choose closest to your users)
5. Click "Enable"

### Important: Set Firestore Security Rules

After creating the database, go to the "Rules" tab and replace with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read/write their own data
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

This ensures users can only access their own data.

## 4. Register Your Web App

1. In Firebase Console, go to Project Settings (gear icon)
2. Scroll down to "Your apps" section
3. Click the web icon (</>)
4. Register your app with a nickname (e.g., "CertiHub")
5. Copy the Firebase configuration object

## 5. Your Firebase Config is Already Set

Your `src/firebase.js` already has your configuration:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyBeBYbSh4h340v2EL-eL16zjlhSgTFTz10",
  authDomain: "certi-f1b44.firebaseapp.com",
  projectId: "certi-f1b44",
  storageBucket: "certi-f1b44.firebasestorage.app",
  messagingSenderId: "263800699154",
  appId: "1:263800699154:web:6f5019fe4107ddb3011bcb",
  measurementId: "G-C27QVCYGKX"
};
```

## 6. Add Authorized Domains

1. In Firebase Console, go to Authentication > Settings
2. Scroll to "Authorized domains"
3. Add `localhost` (should be there by default)
4. When deploying, add your production domain

## 7. Test Your Setup

1. Run your app: `npm run dev`
2. Sign in with Google
3. Add a certification or course
4. Check Firebase Console > Firestore Database to see your data

## Database Structure

Your data is organized as:

```
users/
  {userId}/
    certifications/
      {certId}/
        - title
        - issuer
        - month
        - year
        - link
        - certificateImage
        - skills
        - createdAt
    
    courses/
      {courseId}/
        - title
        - platform
        - duration
        - link
        - certificateImage
        - skills
        - createdAt
    
    profile/
      main/
        - fullName
        - college
        - major
        - degree
        - gradYear
        - gpa
        - bio
        - github
        - linkedin
        - avatar
        - semesters[]
```

## Features Included

- Google Sign-In (OAuth)
- Email/Password Sign-In
- Email/Password Sign-Up
- Real-time data sync with Firestore
- User session persistence
- Sign-Out functionality
- User profile with photo upload
- Certifications tracking
- Courses tracking
- CGPA calculator
- All data automatically saved to Firestore

## Security Notes

- Never commit your Firebase config with real values to public repositories
- Consider using environment variables for production
- Enable App Check for additional security in production
- Review and update Firestore security rules before going to production

## Troubleshooting

### Data not saving?
1. Check Firebase Console > Firestore Database is enabled
2. Verify security rules allow authenticated users to write
3. Check browser console for errors

### Authentication not working?
1. Verify Google sign-in is enabled in Firebase Console
2. Check that your domain is in authorized domains list
3. Clear browser cache and try again

### Images not uploading?
- Images are stored as base64 in Firestore (max 800KB)
- For production, consider using Firebase Storage for images

## Quick Links

- Firebase Console: https://console.firebase.google.com/project/certi-f1b44
- Authentication: https://console.firebase.google.com/project/certi-f1b44/authentication
- Firestore Database: https://console.firebase.google.com/project/certi-f1b44/firestore

