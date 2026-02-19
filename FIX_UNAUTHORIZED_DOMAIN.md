# 🔧 Fix: Firebase Error (auth/unauthorized-domain)

## What This Error Means

Firebase is blocking authentication because your domain (Vercel URL) is not in the authorized domains list.

---

## ✅ Quick Fix (2 minutes)

### Step 1: Get Your Vercel Domain
Your Vercel URL looks like: `certihub-xyz123.vercel.app`

Find it in:
- Vercel dashboard after deployment
- Or the URL in your browser address bar

**Copy the domain WITHOUT `https://`**
Example: `certihub-xyz123.vercel.app`

### Step 2: Add Domain to Firebase

1. **Go to Firebase Console**
   https://console.firebase.google.com/project/certi-f1b44/authentication/settings

2. **Scroll down to "Authorized domains"**

3. **Click "Add domain"**

4. **Paste your Vercel domain**
   - Example: `certihub-xyz123.vercel.app`
   - **DO NOT include** `https://`
   - **DO NOT include** trailing `/`

5. **Click "Add"**

### Step 3: Wait & Test
1. Wait 2-5 minutes for changes to propagate
2. Clear your browser cache (Ctrl + Shift + Delete)
3. Try signing in again
4. Should work now! ✅

---

## 📋 Detailed Steps with Screenshots

### Finding Your Vercel Domain

**Option 1: From Vercel Dashboard**
1. Go to https://vercel.com/dashboard
2. Click on your `certihub` project
3. Look for "Domains" section
4. Copy the domain (e.g., `certihub-xyz123.vercel.app`)

**Option 2: From Browser**
1. Open your deployed app
2. Look at the address bar
3. Copy everything after `https://` and before the first `/`
4. Example: If URL is `https://certihub-xyz123.vercel.app/`
5. Copy: `certihub-xyz123.vercel.app`

### Adding to Firebase

1. **Open Firebase Console**
   - Direct link: https://console.firebase.google.com/project/certi-f1b44/authentication/settings
   - Or: Firebase Console → Authentication → Settings tab

2. **Find "Authorized domains" section**
   - Scroll down the page
   - You'll see a list of domains
   - `localhost` should already be there

3. **Click "Add domain" button**

4. **Enter your domain**
   ```
   ✅ CORRECT: certihub-xyz123.vercel.app
   ❌ WRONG: https://certihub-xyz123.vercel.app
   ❌ WRONG: certihub-xyz123.vercel.app/
   ❌ WRONG: www.certihub-xyz123.vercel.app
   ```

5. **Click "Add"**

6. **Verify it's in the list**
   - You should now see your domain in the authorized domains list
   - It should show as "Active"

---

## 🧪 Test the Fix

### Step 1: Clear Browser Cache
```
Windows: Ctrl + Shift + Delete
Mac: Cmd + Shift + Delete
```
- Select "Cached images and files"
- Click "Clear data"

### Step 2: Try Signing In
1. Go to your Vercel URL
2. Click "Continue with Google"
3. Should work now!

### Step 3: If Still Not Working
- Wait another 5 minutes (DNS propagation)
- Try in incognito/private mode
- Try a different browser
- Check Firebase Console to confirm domain is listed

---

## 🔍 Verify Your Setup

### Check Current Authorized Domains

1. Go to: https://console.firebase.google.com/project/certi-f1b44/authentication/settings
2. Scroll to "Authorized domains"
3. You should see:
   - ✅ `localhost` (for local development)
   - ✅ `certi-f1b44.firebaseapp.com` (Firebase default)
   - ✅ `your-vercel-domain.vercel.app` (your production site)

### Common Mistakes

❌ **Including https://**
```
Wrong: https://certihub-xyz123.vercel.app
Right: certihub-xyz123.vercel.app
```

❌ **Including trailing slash**
```
Wrong: certihub-xyz123.vercel.app/
Right: certihub-xyz123.vercel.app
```

❌ **Including www**
```
Wrong: www.certihub-xyz123.vercel.app
Right: certihub-xyz123.vercel.app
```

❌ **Including path**
```
Wrong: certihub-xyz123.vercel.app/login
Right: certihub-xyz123.vercel.app
```

---

## 🚨 Still Getting the Error?

### Check 1: Correct Firebase Project
Make sure you're in the right Firebase project:
- Project ID should be: `certi-f1b44`
- Check the URL: `console.firebase.google.com/project/certi-f1b44`

### Check 2: Domain Spelling
- Copy domain directly from Vercel
- Don't type it manually (easy to make typos)
- Check for extra spaces

### Check 3: Wait Longer
- DNS changes can take up to 10 minutes
- Try again after waiting

### Check 4: Browser Cache
- Clear ALL browser data
- Or use incognito mode
- Or try different browser

### Check 5: Vercel Domain Changed
- Vercel might have given you a different domain
- Check Vercel dashboard for current domain
- Update Firebase with new domain

---

## 📊 Expected vs Actual

### What Should Happen:
1. ✅ Add domain to Firebase
2. ✅ Wait 2-5 minutes
3. ✅ Clear browser cache
4. ✅ Sign in works!

### What You're Seeing:
1. ❌ Click "Continue with Google"
2. ❌ Error: "auth/unauthorized-domain"
3. ❌ Can't sign in

### After Fix:
1. ✅ Click "Continue with Google"
2. ✅ Google sign-in popup appears
3. ✅ Successfully signed in
4. ✅ Redirected to app

---

## 🎯 Quick Checklist

- [ ] Found my Vercel domain
- [ ] Copied domain WITHOUT https://
- [ ] Went to Firebase Console
- [ ] Clicked "Add domain"
- [ ] Pasted domain correctly
- [ ] Clicked "Add"
- [ ] Domain appears in authorized list
- [ ] Waited 5 minutes
- [ ] Cleared browser cache
- [ ] Tried signing in again
- [ ] It works! ✅

---

## 💡 Pro Tips

1. **Add domain immediately after deployment**
   - Don't wait until you get the error
   - Add it as soon as you get your Vercel URL

2. **Keep Firebase Console open**
   - While deploying to Vercel
   - Add domain as soon as deployment completes

3. **Test in incognito mode**
   - Avoids cache issues
   - Faster testing

4. **Bookmark Firebase settings**
   - https://console.firebase.google.com/project/certi-f1b44/authentication/settings
   - Quick access for future updates

---

## 🔄 For Future Deployments

Every time you deploy to a new domain:
1. Get the new domain from Vercel
2. Add it to Firebase authorized domains
3. Wait 5 minutes
4. Test!

This includes:
- Preview deployments (different URLs)
- Custom domains
- Branch deployments

---

## 📞 Still Need Help?

### Check These:

1. **Firebase Console**
   - Verify domain is in the list
   - Check for typos
   - Make sure it's "Active"

2. **Vercel Dashboard**
   - Confirm your actual domain
   - Check if domain changed

3. **Browser Console (F12)**
   - Look for other errors
   - Might give more details

### Error Message Details:

```
Firebase: Error (auth/unauthorized-domain)
```

This specifically means:
- Firebase received a sign-in request
- From a domain not in authorized list
- Solution: Add domain to Firebase

---

## ✅ Success Indicators

You'll know it's fixed when:
1. ✅ No error message
2. ✅ Google sign-in popup appears
3. ✅ Successfully signed in
4. ✅ Redirected to your app
5. ✅ Can see your profile

---

## 🎉 After It's Fixed

Once working:
- ✅ Sign in works on production
- ✅ All features work same as local
- ✅ Data saves to Firebase
- ✅ App is fully functional

**Your app is now live and working!** 🚀

---

**Need the direct link?**
👉 https://console.firebase.google.com/project/certi-f1b44/authentication/settings

Scroll to "Authorized domains" → Click "Add domain" → Paste your Vercel URL → Done!
