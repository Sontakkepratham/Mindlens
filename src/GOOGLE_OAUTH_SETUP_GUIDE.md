# Google OAuth Setup Guide for MindLens

Complete step-by-step instructions to enable Google Sign-In for your MindLens app.

---

## 🎯 Overview

Google OAuth has been implemented in your MindLens app, but it requires configuration in both Google Cloud Console and Supabase Dashboard.

**What's Already Done:**
- ✅ Frontend Google OAuth flow implemented
- ✅ Automatic OAuth callback handling
- ✅ Session management after Google sign-in
- ✅ Both SignIn and SignUp screens support Google

**What You Need to Do:**
- 🔧 Configure Google OAuth in Google Cloud Console
- 🔧 Enable Google provider in Supabase Dashboard
- 🔧 Add OAuth credentials

---

## 📋 Prerequisites

- Google Cloud account
- Supabase project created
- Your MindLens app domain/URL

---

## 🔧 Step 1: Google Cloud Console Setup

### 1.1 Create Google Cloud Project (if not already created)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click the project dropdown at the top
3. Click "New Project"
4. Name it: `mindlens-oauth` (or similar)
5. Click "Create"

### 1.2 Enable Google+ API

1. In Google Cloud Console, go to "APIs & Services" → "Library"
2. Search for "Google+ API"
3. Click on it and click "Enable"

### 1.3 Configure OAuth Consent Screen

1. Go to "APIs & Services" → "OAuth consent screen"
2. Choose "External" (unless you have Google Workspace)
3. Click "Create"

**Fill in the details:**

| Field | Value |
|-------|-------|
| **App name** | MindLens |
| **User support email** | Your email |
| **App logo** | Optional (upload your logo) |
| **App domain** | Your domain (e.g., `mindlens.com`) |
| **Authorized domains** | Your Supabase project domain: `YOUR_PROJECT_ID.supabase.co` |
| **Developer contact** | Your email |

4. Click "Save and Continue"
5. **Scopes**: Click "Add or Remove Scopes"
   - Select: `./auth/userinfo.email`
   - Select: `./auth/userinfo.profile`
   - Select: `openid`
6. Click "Update" → "Save and Continue"
7. **Test users**: Add your email for testing (during development)
8. Click "Save and Continue" → "Back to Dashboard"

### 1.4 Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Choose "Web application"

**Fill in:**

| Field | Value |
|-------|-------|
| **Name** | MindLens Web Client |
| **Authorized JavaScript origins** | Add ALL of these: |
|  | • `http://localhost:8080` |
|  | • `https://YOUR_PROJECT_ID.supabase.co` |
|  | • Your production domain if you have one |
| **Authorized redirect URIs** | Add these: |
|  | • `https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback` |
|  | • `http://localhost:8080` (for dev) |

**⚠️ Important:** Replace `YOUR_PROJECT_ID` with your actual Supabase project ID

4. Click "Create"
5. **Copy and save:**
   - ✅ **Client ID** (looks like: `123456789-abc123.apps.googleusercontent.com`)
   - ✅ **Client Secret** (looks like: `GOCSPX-abcd1234...`)

---

## 🔧 Step 2: Supabase Dashboard Setup

### 2.1 Enable Google Provider

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your MindLens project
3. Click "Authentication" in the left sidebar
4. Click "Providers" tab
5. Scroll down to "Google"
6. Toggle "Enable Sign in with Google"

### 2.2 Configure Google Provider

**Paste the credentials from Google Cloud:**

| Field | Value |
|-------|-------|
| **Client ID (for OAuth)** | Paste your Google Client ID |
| **Client Secret (for OAuth)** | Paste your Google Client Secret |
| **Authorized Client IDs** | (optional - for mobile apps) |

### 2.3 Site URL Configuration

Still in the Supabase Authentication settings:

1. Click "URL Configuration" tab
2. Set **Site URL**: `https://YOUR_PROJECT_ID.supabase.co` (or your domain)
3. Add **Redirect URLs**:
   - `https://YOUR_PROJECT_ID.supabase.co/**`
   - `http://localhost:8080/**` (for development)

### 2.4 Save Settings

1. Click "Save" at the bottom
2. Wait for changes to deploy (usually instant)

---

## ✅ Step 3: Test Google OAuth

### 3.1 Test in Your App

1. **Deploy your latest code** (with the OAuth updates)
2. Open your MindLens app
3. Go to Sign In or Sign Up screen
4. Click "**Sign In with Google**" button

**Expected Flow:**
1. ✅ Redirects to Google sign-in page
2. ✅ Shows Google account picker
3. ✅ Asks for permission (email, profile)
4. ✅ Redirects back to your app
5. ✅ Automatically signs you in
6. ✅ Takes you to the app dashboard

### 3.2 If It Doesn't Work

**Check these common issues:**

#### Error: "redirect_uri_mismatch"
- ✅ Go back to Google Cloud Console → Credentials
- ✅ Make sure redirect URIs EXACTLY match:
  - `https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback`
- ✅ No trailing slashes, exact match

#### Error: "Provider not enabled"
- ✅ Go to Supabase → Authentication → Providers
- ✅ Make sure Google toggle is ON
- ✅ Make sure Client ID and Secret are saved

#### Error: "OAuth consent screen not configured"
- ✅ Go to Google Cloud Console → OAuth consent screen
- ✅ Make sure status is "Published" or "Testing"
- ✅ Add your email to test users if in Testing mode

#### Redirect loops or doesn't complete
- ✅ Check browser console for errors
- ✅ Clear browser cache and cookies
- ✅ Make sure Site URL in Supabase matches your app URL

---

## 🔍 Step 4: Verify in Supabase

After successful Google sign-in:

1. Go to Supabase Dashboard → Authentication → Users
2. You should see your user account
3. **Provider** column should show "google"
4. Click on the user to see details:
   - Email (from Google)
   - User metadata (name, avatar_url)
   - Provider: google

---

## 📊 How It Works (Behind the Scenes)

### Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│  User clicks "Sign In with Google"                      │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  Frontend calls signInWithGoogle()                      │
│  → Uses Supabase client to initiate OAuth               │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  User redirected to Google sign-in page                 │
│  → Authenticates with Google account                    │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  Google redirects back with auth code                   │
│  → To: https://PROJECT.supabase.co/auth/v1/callback    │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  Supabase Auth exchanges code for session               │
│  → Creates or links user account                        │
└─────────────────��──┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  User redirected to your app                            │
│  → With session in URL hash                             │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  handleOAuthCallback() detects session                  │
│  → Stores session in localStorage                       │
│  → Triggers onSigninSuccess()                           │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  User is signed in and sees app dashboard! ✅           │
└─────────────────────────────────────────────────────────┘
```

### Updated Code Files

1. **`/lib/auth.ts`**
   - Added `signInWithGoogle()` - Initiates OAuth flow
   - Added `handleOAuthCallback()` - Handles return from Google

2. **`/components/SigninScreen.tsx`**
   - Added OAuth callback handler in `useEffect`
   - Google button triggers OAuth flow
   - Automatically signs in after redirect

3. **`/components/SignupScreen.tsx`**
   - Same OAuth callback handler
   - Works for both sign-in and sign-up

---

## 🛠️ Troubleshooting

### Issue: "Access blocked: Authorization Error"

**Cause:** OAuth consent screen not published or domain not verified

**Fix:**
1. Google Cloud Console → OAuth consent screen
2. Click "Publish App"
3. Or add your email to "Test users" during development

### Issue: Multiple accounts shown, but sign-in fails

**Cause:** Account linking issue or wrong Client ID

**Fix:**
1. Check Client ID in Supabase matches Google Cloud
2. Try signing in with same email used in test users
3. Check Supabase logs for errors

### Issue: Error 400: redirect_uri_mismatch

**Cause:** Redirect URI not configured correctly

**Fix:**
1. Google Cloud Console → Credentials → Your OAuth Client
2. Add EXACT URI: `https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback`
3. No extra slashes or characters
4. Click Save

### Issue: Sign-in works, but doesn't redirect back to app

**Cause:** Site URL not configured in Supabase

**Fix:**
1. Supabase → Authentication → URL Configuration
2. Set Site URL to your app domain
3. Add redirect URLs with wildcards (`**`)

---

## 📱 Testing Checklist

Before going to production:

- [ ] Google OAuth works in development (localhost)
- [ ] Google OAuth works in production (live URL)
- [ ] First-time users can sign up with Google
- [ ] Existing users can sign in with Google
- [ ] User data (email, name) is correctly stored
- [ ] Session persists after page refresh
- [ ] Sign out works correctly
- [ ] Can switch between Google and email/password auth

---

## 🚀 Production Deployment

### Before Launch:

1. **Publish OAuth Consent Screen**
   - Google Cloud Console → OAuth consent screen
   - Click "Publish App"
   - Submit for verification if needed (for larger user base)

2. **Update Authorized Domains**
   - Add your production domain
   - Remove localhost URIs (or keep for staging)

3. **Update Site URL**
   - Supabase → Authentication → URL Configuration
   - Set to production URL

4. **Test thoroughly**
   - Test on different devices
   - Test with different Google accounts
   - Test account linking (same email, different providers)

---

## 🎉 Success Indicators

You'll know Google OAuth is working when:

✅ "Sign In with Google" button opens Google sign-in  
✅ After authentication, user is redirected back  
✅ User sees their dashboard immediately  
✅ User data appears in Supabase Auth → Users  
✅ Provider shows as "google" in Supabase  
✅ Session persists across page refreshes  

---

## 📞 Need Help?

### Official Documentation

- [Supabase Google OAuth Guide](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)

### Common Resources

- Google Cloud Console: https://console.cloud.google.com/
- Supabase Dashboard: https://supabase.com/dashboard
- Test OAuth: https://developers.google.com/oauthplayground

---

**Setup Time:** ~15-20 minutes  
**Difficulty:** Medium  
**Status:** ✅ Code ready, awaiting configuration

**Once configured, Google Sign-In will work seamlessly for all your users!** 🎉
