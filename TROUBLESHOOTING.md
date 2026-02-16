# 🔧 Troubleshooting Guide

## Data Not Showing in Website

If data is uploading to Firebase but not showing in your website, follow these steps:

### 1. Check Browser Console (F12)

Open your browser console and look for:
- ✓ "Setting up Firestore listeners for user: [user-id]"
- ✓ "Certifications updated: X items"
- ✓ "Courses updated: X items"
- ✓ "Profile updated: true/false"

If you see errors, they will tell you what's wrong.

### 2. Verify Firestore Security Rules

Go to: https://console.firebase.google.com/project/certi-f1b44/firestore/rules

Make sure your rules look like this:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

Click "Publish" after updating.

### 3. Check Data Structure in Firebase

Go to: https://console.firebase.google.com/project/certi-f1b44/firestore/data

Your data should be organized like:
```
users/
  └── [your-user-id]/
      ├── certifications/
      ├── courses/
      └── profile/
          └── main/
```

If it's in a different structure, the app won't find it.

### 4. Clear Cache and Reload

1. Press Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. Or clear browser cache completely
3. Sign out and sign in again

### 5. Check Network Tab

1. Open DevTools (F12)
2. Go to Network tab
3. Filter by "firestore"
4. Add a certification
5. You should see network requests to Firestore

### 6. Verify Authentication

In console, you should see:
- "Setting up Firestore listeners for user: [some-id]"

If you see "user: undefined" or no user ID, authentication isn't working.

## Success Messages Not Showing

Success messages should appear for 3 seconds after:
- ✓ Adding a certification
- ✓ Adding a course
- ✓ Updating profile
- ✓ Deleting an item

If they don't appear, check browser console for JavaScript errors.

## Common Error Messages

### "Not authenticated or database not initialized"
- Sign out and sign in again
- Check Firebase Authentication is enabled

### "Missing or insufficient permissions"
- Update Firestore security rules (see step 2 above)
- Make sure you're signed in

### "Failed to save: [error]"
- Check browser console for detailed error
- Verify Firestore is enabled in Firebase Console

## Still Having Issues?

1. Open browser console (F12)
2. Copy all error messages
3. Check the error message for clues
4. Make sure you completed all steps in QUICK_START.md

## Quick Checklist

- [ ] Firestore Database is enabled
- [ ] Security rules are set correctly
- [ ] You're signed in to the app
- [ ] Browser console shows no errors
- [ ] Data structure matches expected format
- [ ] Cache is cleared

## Test Data Flow

1. Sign in to app
2. Open browser console (F12)
3. Add a certification
4. You should see:
   - "Adding entry to: users/[id]/certifications"
   - "Entry added with ID: [doc-id]"
   - "Certifications updated: 1 items"
   - Success message appears
   - Certificate appears in the list

If any step fails, check the console error message.
