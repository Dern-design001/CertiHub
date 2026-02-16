# 📋 Step-by-Step Deployment Checklist

Follow these steps exactly to deploy your CertiHub app to Vercel.

## ✅ Pre-Deployment Checklist

- [ ] App works locally (test at http://localhost:5174)
- [ ] Firebase is configured and working
- [ ] All features tested (sign-in, profile, certifications, courses)
- [ ] No errors in browser console

---

## 📦 Step 1: Prepare for GitHub (5 minutes)

### 1.1 Check .gitignore
✅ Already done! Your .gitignore is set up correctly.

### 1.2 Test Build
Run this command to make sure your app builds correctly:

```bash
npm run build
```

If successful, you'll see a `dist` folder created.

### 1.3 Preview Production Build (Optional)
```bash
npm run preview
```

Visit http://localhost:4173 to see how it will look in production.

---

## 🐙 Step 2: Upload to GitHub (10 minutes)

### 2.1 Create GitHub Account
If you don't have one:
1. Go to https://github.com/signup
2. Enter your email
3. Create password
4. Choose username
5. Verify email

### 2.2 Create New Repository
1. Go to https://github.com/new
2. Fill in:
   - **Repository name**: `certihub`
   - **Description**: `Student Portfolio & Certification Management System`
   - **Visibility**: Public (recommended) or Private
3. **DO NOT** check any boxes (no README, no .gitignore, no license)
4. Click "Create repository"

### 2.3 Initialize Git (First Time Only)
Open terminal in your project folder:

```bash
# Initialize git
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: CertiHub app with Firebase integration"

# Add GitHub as remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/certihub.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

**Note**: Replace `YOUR_USERNAME` with your actual GitHub username!

### 2.4 Enter Credentials
When prompted:
- **Username**: Your GitHub username
- **Password**: Your GitHub password OR Personal Access Token

**If password doesn't work:**
1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate new token (classic)
3. Select "repo" scope
4. Copy the token
5. Use token as password

### 2.5 Verify Upload
1. Go to https://github.com/YOUR_USERNAME/certihub
2. You should see all your files!

---

## 🚀 Step 3: Deploy to Vercel (10 minutes)

### 3.1 Create Vercel Account
1. Go to https://vercel.com/signup
2. Click "Continue with GitHub"
3. Authorize Vercel to access your GitHub
4. Complete signup

### 3.2 Import Project
1. Click "Add New..." button (top right)
2. Select "Project"
3. Find your `certihub` repository in the list
4. Click "Import"

### 3.3 Configure Project
Vercel will auto-detect settings. Verify:

- **Framework Preset**: Vite ✅
- **Root Directory**: ./ ✅
- **Build Command**: `npm run build` ✅
- **Output Directory**: `dist` ✅
- **Install Command**: `npm install` ✅

### 3.4 Add Environment Variables
Click "Environment Variables" tab and add these ONE BY ONE:

| Name | Value |
|------|-------|
| `VITE_FIREBASE_API_KEY` | `AIzaSyBeBYbSh4h340v2EL-eL16zjlhSgTFTz10` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `certi-f1b44.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | `certi-f1b44` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `certi-f1b44.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `263800699154` |
| `VITE_FIREBASE_APP_ID` | `1:263800699154:web:6f5019fe4107ddb3011bcb` |

**Important**: 
- Click "Add" after each variable
- Make sure there are no extra spaces
- All variables should be added to "Production", "Preview", and "Development"

### 3.5 Deploy!
1. Click "Deploy" button
2. Wait 2-3 minutes (watch the build logs)
3. You'll see "Congratulations!" when done
4. Click "Visit" to see your live site!

Your URL will be something like: `https://certihub-xyz123.vercel.app`

---

## 🔧 Step 4: Configure Firebase for Production (5 minutes)

### 4.1 Add Vercel Domain to Firebase
1. Copy your Vercel URL (e.g., `certihub-xyz123.vercel.app`)
2. Go to https://console.firebase.google.com/project/certi-f1b44/authentication/settings
3. Scroll to "Authorized domains"
4. Click "Add domain"
5. Paste your Vercel domain (WITHOUT https://)
6. Click "Add"

### 4.2 Wait for Propagation
Wait 2-5 minutes for changes to take effect.

---

## 🧪 Step 5: Test Your Live App (5 minutes)

### 5.1 Visit Your Site
Go to your Vercel URL

### 5.2 Test Sign-In
1. Click "Continue with Google"
2. Sign in with your Google account
3. Should redirect back to app

### 5.3 Test Features
- [ ] Sign in works
- [ ] Profile section loads
- [ ] Can add name in Professional ID
- [ ] Can add semester in Academics
- [ ] Can add certification
- [ ] Can add course
- [ ] Data persists after refresh

### 5.4 Check Firebase
1. Go to Firebase Console
2. Check Firestore Database
3. Verify data is being saved

---

## 🎉 Success! Your App is Live!

Your CertiHub app is now deployed and accessible worldwide at:
`https://your-app.vercel.app`

---

## 🔄 Future Updates

When you want to update your app:

```bash
# Make your changes to the code

# Add changes
git add .

# Commit with a message
git commit -m "Update: describe what you changed"

# Push to GitHub
git push
```

Vercel will automatically detect the push and redeploy! 🚀

---

## 🐛 Troubleshooting

### Build Failed on Vercel
**Check:**
- Build logs in Vercel dashboard
- All environment variables are set
- No syntax errors in code

**Fix:**
- Review error message in build logs
- Fix the issue locally
- Push again to GitHub

### Google Sign-In Not Working
**Check:**
- Vercel domain added to Firebase authorized domains
- Waited 5 minutes after adding domain
- No typos in domain name

**Fix:**
- Double-check Firebase authorized domains
- Try in incognito mode
- Clear browser cache

### Data Not Saving
**Check:**
- Environment variables in Vercel
- Firestore security rules
- Browser console for errors

**Fix:**
- Verify all environment variables
- Check Firebase Console for errors
- Review Firestore rules

### "Firebase not defined" Error
**Fix:**
- Make sure ALL environment variables are added in Vercel
- Redeploy after adding variables
- Check variable names match exactly (case-sensitive!)

---

## 📞 Need Help?

1. Check build logs in Vercel dashboard
2. Check browser console (F12) for errors
3. Review Firebase Console for issues
4. Check TROUBLESHOOTING.md file

---

## 🎯 Quick Reference

**GitHub Repository**: https://github.com/YOUR_USERNAME/certihub
**Vercel Dashboard**: https://vercel.com/dashboard
**Firebase Console**: https://console.firebase.google.com/project/certi-f1b44

**Commands:**
```bash
# Build locally
npm run build

# Preview build
npm run preview

# Push to GitHub
git add .
git commit -m "message"
git push
```

---

**🌟 Congratulations! You've successfully deployed your app!**
