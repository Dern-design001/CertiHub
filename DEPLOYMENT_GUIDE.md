# 🚀 Deploy CertiHub to Vercel via GitHub

## Step-by-Step Deployment Guide

### Part 1: Prepare Your Project (5 minutes)

#### Step 1: Create .gitignore file
This file tells Git which files NOT to upload to GitHub.

Already exists! But let's verify it has the right content.

#### Step 2: Create a README.md for GitHub
This will be the landing page of your GitHub repository.

#### Step 3: Remove Firebase Keys from Code (IMPORTANT!)
We'll use environment variables instead for security.

---

### Part 2: Upload to GitHub (10 minutes)

#### Step 1: Create a GitHub Account
1. Go to: https://github.com/signup
2. Create an account (if you don't have one)
3. Verify your email

#### Step 2: Create a New Repository
1. Go to: https://github.com/new
2. Repository name: `certihub`
3. Description: `Student Portfolio & Certification Management System`
4. Choose: **Public** (or Private if you prefer)
5. **DO NOT** check "Add a README file"
6. Click "Create repository"

#### Step 3: Initialize Git in Your Project
Open terminal in your project folder and run:

```bash
git init
git add .
git commit -m "Initial commit - CertiHub app"
```

#### Step 4: Connect to GitHub
Replace `YOUR_USERNAME` with your GitHub username:

```bash
git remote add origin https://github.com/YOUR_USERNAME/certihub.git
git branch -M main
git push -u origin main
```

You'll be asked for your GitHub credentials. Enter them.

---

### Part 3: Deploy to Vercel (5 minutes)

#### Step 1: Create Vercel Account
1. Go to: https://vercel.com/signup
2. Click "Continue with GitHub"
3. Authorize Vercel to access your GitHub

#### Step 2: Import Your Project
1. Click "Add New..." → "Project"
2. Find your `certihub` repository
3. Click "Import"

#### Step 3: Configure Build Settings
Vercel will auto-detect Vite. Just verify:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

#### Step 4: Add Environment Variables
Click "Environment Variables" and add:

| Name | Value |
|------|-------|
| `VITE_FIREBASE_API_KEY` | `AIzaSyBeBYbSh4h340v2EL-eL16zjlhSgTFTz10` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `certi-f1b44.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | `certi-f1b44` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `certi-f1b44.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `263800699154` |
| `VITE_FIREBASE_APP_ID` | `1:263800699154:web:6f5019fe4107ddb3011bcb` |

#### Step 5: Deploy!
1. Click "Deploy"
2. Wait 2-3 minutes
3. You'll get a URL like: `https://certihub.vercel.app`

---

### Part 4: Configure Firebase for Production (5 minutes)

#### Step 1: Add Your Vercel Domain to Firebase
1. Go to: https://console.firebase.google.com/project/certi-f1b44/authentication/settings
2. Scroll to "Authorized domains"
3. Click "Add domain"
4. Add your Vercel URL: `certihub.vercel.app` (without https://)
5. Click "Add"

#### Step 2: Test Your Deployed App
1. Visit your Vercel URL
2. Try signing in with Google
3. Add a certification
4. Check if data saves to Firebase

---

## 🎯 Quick Commands Reference

### First Time Setup:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/certihub.git
git branch -M main
git push -u origin main
```

### Future Updates:
```bash
git add .
git commit -m "Update: description of changes"
git push
```

Vercel will automatically redeploy when you push to GitHub!

---

## 🔒 Security Checklist

Before deploying, make sure:
- [ ] Firebase keys are in environment variables (not in code)
- [ ] .gitignore includes node_modules
- [ ] .gitignore includes .env files
- [ ] Firebase authorized domains includes your Vercel URL
- [ ] Firestore security rules are set correctly

---

## 🐛 Common Issues

### Issue 1: "Permission denied" when pushing to GitHub
**Solution:** 
- Use GitHub Personal Access Token instead of password
- Go to: GitHub Settings → Developer settings → Personal access tokens
- Generate new token with "repo" scope
- Use token as password when pushing

### Issue 2: Build fails on Vercel
**Solution:**
- Check build logs in Vercel dashboard
- Make sure all dependencies are in package.json
- Verify environment variables are set correctly

### Issue 3: Google Sign-in doesn't work on deployed site
**Solution:**
- Add your Vercel domain to Firebase authorized domains
- Wait 5 minutes for changes to propagate
- Clear browser cache and try again

### Issue 4: "Firebase not defined" error
**Solution:**
- Make sure environment variables are set in Vercel
- Redeploy after adding environment variables

---

## 📊 Deployment Checklist

- [ ] Code is working locally
- [ ] .gitignore is set up
- [ ] Firebase keys moved to environment variables
- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] Vercel account created
- [ ] Project imported to Vercel
- [ ] Environment variables added in Vercel
- [ ] Deployed successfully
- [ ] Vercel domain added to Firebase
- [ ] Tested sign-in on production
- [ ] Tested data saving on production

---

## 🎉 After Deployment

Your app will be live at: `https://certihub.vercel.app` (or your custom domain)

### Features:
- ✅ Automatic deployments on every GitHub push
- ✅ HTTPS enabled by default
- ✅ Global CDN for fast loading
- ✅ Automatic preview deployments for branches
- ✅ Free hosting for personal projects

### Custom Domain (Optional):
1. Buy a domain (e.g., from Namecheap, GoDaddy)
2. In Vercel: Settings → Domains
3. Add your custom domain
4. Update DNS records as instructed
5. Wait for DNS propagation (up to 48 hours)

---

## 📞 Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **GitHub Docs**: https://docs.github.com
- **Firebase Docs**: https://firebase.google.com/docs

Your CertiHub app will be live and accessible worldwide! 🌍
