# Social Authentication Setup Guide for RizzK (December 2025)

Complete setup for Apple Sign In + Google Sign In with Supabase.

---

## 📋 Prerequisites

- Apple Developer Account ($99/year): https://developer.apple.com
- Google Cloud Console Account (free): https://console.cloud.google.com
- Supabase Project: https://supabase.com/dashboard/project/yezejvxcvihumlnvxaoa

---

## 🍎 PART 1: Apple Sign In Setup

### Step 1: Apple Developer Portal

1. Go to https://developer.apple.com/account/resources/identifiers/list
2. Click **+** to create new App ID (or find existing)
3. Bundle ID: `com.rizzk.app`
4. Scroll to **Capabilities**
5. ✅ Check **Sign In with Apple**
6. Click **Save**

### Step 2: Create Services ID (for Supabase callback)

1. Go to https://developer.apple.com/account/resources/identifiers/list
2. Click the **+** button
3. Select **Services IDs** → Continue
4. Fill in:
   - Description: `RizzK Web Auth`
   - Identifier: `com.rizzk.app.web` (must be different from app ID!)
5. Click **Register**

### Step 3: Configure Services ID

1. Click on your new Services ID
2. ✅ Check **Sign In with Apple**
3. Click **Configure**
4. Set:
   - Primary App ID: `com.rizzk.app`
   - Domains: `yezejvxcvihumlnvxaoa.supabase.co`
   - Return URLs: `https://yezejvxcvihumlnvxaoa.supabase.co/auth/v1/callback`
5. Click **Save** → **Continue** → **Save**

### Step 4: Create Private Key

1. Go to https://developer.apple.com/account/resources/authkeys/list
2. Click **+** to create a new key
3. Name it: `RizzK Auth Key`
4. ✅ Check **Sign In with Apple**
5. Click **Configure** → Select your primary App ID
6. Click **Register**
7. **DOWNLOAD THE KEY FILE** (.p8) - you can only download once!
8. Note the **Key ID** shown

### Step 5: Get Your Team ID

1. Go to https://developer.apple.com/account
2. Look at top right - your Team ID is shown (10 characters like `ABCD123456`)

### Step 6: Configure Supabase

1. Go to https://supabase.com/dashboard/project/yezejvxcvihumlnvxaoa/auth/providers
2. Find **Apple** and enable it
3. Fill in:
   - **Secret Key**: Open your .p8 file in a text editor, copy everything
   - **Client ID (Services ID)**: `com.rizzk.app.web`
   - **Key ID**: The Key ID from Step 4
   - **Team ID**: Your 10-character Team ID
4. Click **Save**

---

## 🔵 PART 2: Google Sign In Setup

### Step 1: Create Google Cloud Project

1. Go to https://console.cloud.google.com
2. Click the project dropdown → **New Project**
3. Name: `RizzK`
4. Click **Create**

### Step 2: Configure OAuth Consent Screen

1. Go to **APIs & Services** → **OAuth consent screen**
2. Select **External** → Create
3. Fill in:
   - App name: `RizzK`
   - User support email: Your email
   - Developer contact: Your email
4. Click **Save and Continue** through all steps
5. Add test users (your email) while in testing mode

### Step 3: Create OAuth Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **+ Create Credentials** → **OAuth client ID**

#### 3a. Create Web Client (for Supabase)
- Application type: **Web application**
- Name: `RizzK Web`
- Authorized redirect URIs:
  - `https://yezejvxcvihumlnvxaoa.supabase.co/auth/v1/callback`
- Click **Create**
- **COPY the Client ID and Client Secret**

#### 3b. Create iOS Client
- Application type: **iOS**
- Name: `RizzK iOS`
- Bundle ID: `com.rizzk.app`
- Click **Create**
- **COPY the Client ID**

#### 3c. Create Android Client
- Application type: **Android**
- Name: `RizzK Android`
- Package name: `com.vyas.sathya.rizzkmobile`
- SHA-1: Get from `eas credentials` or Google Play Console

---

## 🔧 PART 3: Configure Supabase Google Provider

1. Go to https://supabase.com/dashboard/project/yezejvxcvihumlnvxaoa/auth/providers
2. Find **Google** and enable it
3. Fill in:
   - **Client ID**: Your Web Client ID from Step 3a
   - **Client Secret**: Your Web Client Secret from Step 3a
4. Click **Save**

---

## 🔧 PART 4: EAS Build Configuration

### Update eas.json

Add the environment variables to each build profile:

```json
{
  "build": {
    "development": {
      "env": {
        "EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID": "xxx.apps.googleusercontent.com",
        "EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID": "xxx.apps.googleusercontent.com"
      }
    },
    "preview": {
      "env": {
        "EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID": "xxx.apps.googleusercontent.com",
        "EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID": "xxx.apps.googleusercontent.com"
      }
    }
  }
}
```

### Rebuild the App

After all configuration:
```bash
# iOS
eas build --platform ios --profile development

# Android
eas build --platform android --profile preview
```

---

## ✅ Verification Checklist

- [ ] Apple Sign In works on iOS device
- [ ] Google Sign In works on iOS device
- [ ] Google Sign In works on Android device
- [ ] User appears in Supabase Auth → Users after sign in
- [ ] User record created in `users` table

---

## 🚨 Common Issues

### Apple: "Invalid client_id"
- Services ID must match exactly in Supabase (`com.rizzk.app.web`)

### Apple: "Redirect URI mismatch"
- Add exact callback: `https://yezejvxcvihumlnvxaoa.supabase.co/auth/v1/callback`

### Google: "Developer Error"
- SHA-1 fingerprint mismatch - regenerate for release builds
- Package name must be exactly `com.vyas.sathya.rizzkmobile`

### Google: "Sign in cancelled"
- User cancelled - not an error

---

## 🔗 Quick Links

- Apple Developer: https://developer.apple.com
- Google Cloud Console: https://console.cloud.google.com
- Supabase Auth Providers: https://supabase.com/dashboard/project/yezejvxcvihumlnvxaoa/auth/providers
- Supabase Users: https://supabase.com/dashboard/project/yezejvxcvihumlnvxaoa/auth/users

