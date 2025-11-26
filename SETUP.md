# RizzK Mobile - Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd rizzk-mobile
npm install
```

### 2. Configure Supabase
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Get your Supabase anon key:
   - Go to: https://supabase.com/dashboard/project/yezejvxcvihumlnvxaoa/settings/api
   - Copy the `anon` `public` key
   - Paste it in `.env` as `EXPO_PUBLIC_SUPABASE_ANON_KEY`

3. The URL is already set to: `https://yezejvxcvihumlnvxaoa.supabase.co`

### 3. Run the App
```bash
npx expo start
```

Then:
- Press `i` for iOS simulator (Mac only)
- Press `a` for Android emulator
- Press `w` for web browser
- Scan QR code with Expo Go app on your phone

---

## 📁 Project Structure

```
rizzk-mobile/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── common/       # Buttons, cards, inputs
│   │   ├── games/        # Game-specific components
│   │   ├── lobby/        # Multiplayer lobby components
│   │   └── matching/     # Match selection components
│   ├── screens/          # App screens
│   ├── navigation/       # Navigation setup
│   ├── services/         # Backend services
│   │   ├── supabase.ts   ✅ Supabase client
│   │   ├── haptics.ts    ✅ Haptic feedback
│   │   └── animations.ts ✅ Animation helpers
│   ├── hooks/            # Custom React hooks
│   ├── theme/            # Design system
│   │   ├── colors.ts     ✅ Color palette
│   │   ├── fonts.ts      ✅ Typography
│   │   ├── spacing.ts    ✅ Spacing system
│   │   └── index.ts      ✅ Theme exports
│   ├── types/            # TypeScript types
│   │   ├── database.types.ts ✅ Database types
│   │   ├── app.types.ts      ✅ App types
│   │   └── index.ts          ✅ Type exports
│   ├── utils/            # Helper functions
│   └── constants/        # App constants
│       └── games.ts      ✅ Game configurations
├── assets/               # Fonts, images
├── App.tsx               ✅ Entry point
├── package.json          ✅ Dependencies
└── README.md             ✅ Documentation
```

---

## 🎨 Design System

### Colors (Neon Pink Theme)
- **Background**: `#000000` (black)
- **Primary**: `#ff1493` (hot pink)
- **Primary Light**: `#ff69b4`
- **Female Gradient**: `#ff1493` → `#ff69b4`
- **Male Gradient**: `#00d4ff` → `#0096ff`

### Fonts
- **Headings**: Cinzel Bold (TODO: Add font files)
- **Body**: Raleway Regular (TODO: Add font files)
- **Fallback**: System fonts (currently active)

### Haptic Patterns
- **Light**: Button taps, transitions
- **Medium**: Votes, confirmations
- **Heavy**: Errors, warnings
- **Success**: Correct answers, matches
- **Error**: Wrong answers, failures
- **Notification**: New messages, player ready

---

## 📚 Reference Files

Located in `../Players/`:
- `rizzk-complete-prototype.html` - Complete UI/UX reference
- `RIZZK-REACT-NATIVE-IMPLEMENTATION-GUIDE.md` - Implementation guide
- `players-app/supabase-schema.sql` - Database schema

---

## ✅ What's Done

- [x] Project initialized with Expo + TypeScript
- [x] All dependencies installed
- [x] Folder structure created
- [x] Theme system configured (colors, fonts, spacing)
- [x] Haptic feedback service
- [x] Animation service
- [x] Supabase client configured
- [x] TypeScript types defined
- [x] Game configurations
- [x] App.tsx with loading state

---

## 🚧 Next Steps

### Phase 1: Core UI Components (Next)
1. Create Button component with haptic feedback
2. Create Card component with glass effect
3. Create Input component
4. Create GradientBackground component

### Phase 2: Navigation
1. Set up React Navigation
2. Create stack navigator
3. Create tab navigator
4. Add screen transitions

### Phase 3: Authentication
1. Landing screen
2. Onboarding screens (3 slides)
3. Auth screen (login/signup)
4. Personality quiz (10-15 questions)
5. Photo upload screen

### Phase 4: Main App
1. Events list screen
2. Event detail screen
3. My events screen
4. Profile screen

### Phase 5: Games
1. Game lobby screen
2. Implement 7 games
3. Real-time multiplayer
4. Results screen

### Phase 6: Matching
1. Match selection screen
2. Matches list screen
3. Chat screen

---

## 🔧 Troubleshooting

### Fonts not loading?
- Add font files to `assets/fonts/`
- Uncomment font loading code in `App.tsx`
- Download fonts:
  - Cinzel Bold: https://fonts.google.com/specimen/Cinzel
  - Raleway Regular: https://fonts.google.com/specimen/Raleway

### Supabase connection issues?
- Check `.env` file exists
- Verify anon key is correct
- Make sure Supabase project is restored

### App won't start?
```bash
# Clear cache
npx expo start -c

# Reinstall dependencies
rm -rf node_modules
npm install
```

---

## 📱 Testing

### On Physical Device
1. Install Expo Go app from App Store / Play Store
2. Run `npx expo start`
3. Scan QR code with camera (iOS) or Expo Go app (Android)

### On Simulator/Emulator
- **iOS**: Requires Mac with Xcode installed
- **Android**: Requires Android Studio with emulator set up

---

## 🎯 Current Status

**Phase**: Initial Setup ✅ COMPLETE

**Ready for**: Core UI Components implementation

**Blocked by**: None - ready to continue!

---

**Let's build! 🚀**

