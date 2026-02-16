# 🚀 Quick Start Guide - Link Your Database

Your CertiHub app is already configured to use Firebase! Follow these 3 simple steps:

## Step 1: Enable Firestore Database (2 minutes)

1. Go to: https://console.firebase.google.com/project/certi-f1b44/firestore
2. Click **"Create database"**
3. Select **"Start in test mode"**
4. Choose your location (e.g., us-central)
5. Click **"Enable"**

## Step 2: Set Security Rules (1 minute)

After database is created:

1. Click on the **"Rules"** tab
2. Replace the rules with this:

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

3. Click **"Publish"**

## Step 3: Test It! (30 seconds)

1. Your app is already running at http://localhost:5174/
2. Sign in with Google
3. Add a certification or update your profile
4. Go back to Firebase Console > Firestore Database
5. You'll see your data appear in real-time! 🎉

## ✅ That's It!

Your database is now linked. Everything you add will be automatically saved:
- ✓ Profile information
- ✓ Certifications
- ✓ Courses
- ✓ Academic records (CGPA)
- ✓ Profile pictures

## 🔍 View Your Data

Check your data anytime at:
https://console.firebase.google.com/project/certi-f1b44/firestore/data

## 🆘 Need Help?

If data isn't saving:
1. Make sure Firestore is enabled (Step 1)
2. Check security rules are set (Step 2)
3. Make sure you're signed in to the app
4. Check browser console (F12) for errors

## 📊 Database Structure

```
users/
  └── {your-user-id}/
      ├── certifications/
      │   └── {cert-id}/
      │       ├── title: "AWS Solutions Architect"
      │       ├── issuer: "AWS"
      │       ├── skills: "Cloud, AWS, Architecture"
      │       └── ...
      ├── courses/
      │   └── {course-id}/
      │       ├── title: "React Masterclass"
      │       ├── platform: "Udemy"
      │       └── ...
      └── profile/
          └── main/
              ├── fullName: "John Doe"
              ├── college: "MIT"
              ├── gpa: "3.85"
              ├── avatar: "base64..."
              └── ...
```

Your data is private and only accessible by you!
