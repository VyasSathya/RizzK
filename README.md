# RizzK Mobile

**The dating app based on personality-matched game nights.**

> Take the Rizk. Meet through games, not swipes.

---

## 🎯 Project Overview

RizzK is a React Native mobile app built with Expo that reimagines dating through interactive multiplayer games. Users take a personality quiz, register for events, get matched with 5-7 compatible people, and meet at a venue to play 7 games together before selecting who they want to match with.

### **Key Features**
- 🎮 7 interactive multiplayer games
- 🎨 Neon Pink theme with sleek design
- 📳 Haptic feedback (no sound effects)
- 🔄 Real-time multiplayer coordination
- 💬 In-app chat with matches
- 🎯 Personality-based matching

---

## 📁 Project Structure

```
rizzk-mobile/
├── src/
│   ├── components/       # Reusable UI components
│   ├── screens/          # App screens
│   ├── navigation/       # Navigation setup
│   ├── services/         # Supabase, haptics, etc.
│   ├── hooks/            # Custom React hooks
│   ├── theme/            # Colors, fonts, spacing
│   ├── types/            # TypeScript types
│   ├── utils/            # Helper functions
│   └── constants/        # App constants
├── assets/               # Fonts, images
└── App.tsx               # Entry point
```

---

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

### **Installation**

```bash
# Install dependencies
npm install

# Start development server
npx expo start

# Run on iOS
npx expo start --ios

# Run on Android
npx expo start --android

# Run on web
npx expo start --web
```

---

## 🎨 Design System

### **Colors**
- Background: `#000000` (black)
- Primary: `#ff1493` (hot pink)
- Female gradient: `#ff1493` → `#ff69b4`
- Male gradient: `#00d4ff` → `#0096ff`

### **Fonts**
- Headings: Cinzel Bold
- Body: Raleway Regular

### **Haptic Patterns**
- **Light**: Button taps, transitions
- **Medium**: Votes, confirmations
- **Heavy**: Errors, warnings
- **Success**: Correct answers, matches
- **Error**: Wrong answers, failures

---

## 📚 Reference Files

Located in `../Players/`:
- `rizzk-complete-prototype.html` - Complete UI/UX reference
- `RIZZK-REACT-NATIVE-IMPLEMENTATION-GUIDE.md` - Implementation guide
- `RIZZK-PROJECT-PLAN.md` - Project plan

---

## 🔧 Configuration

### **Environment Variables**
Create a `.env` file:

```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 🎮 The 7 Games

1. **Spark** - Vote on who you'd want to be stranded with
2. **Dare or Drink** - Choose dare or drink for spicy prompts
3. **Hot Take** - Vote on controversial opinions
4. **Never Have I Ever** - Reveal your experiences
5. **Battle of the Sexes** - Team trivia competition
6. **Who Said It?** - Match quotes to players
7. **Two Truths and a Lie** - Guess the lie

---

## 📱 Tech Stack

- **Framework**: React Native + Expo
- **Language**: TypeScript
- **Navigation**: React Navigation
- **Backend**: Supabase
- **Haptics**: expo-haptics
- **Animations**: react-native-reanimated
- **UI**: Custom components with LinearGradient

---

## 🚧 Development Status

**Current Phase**: Initial Setup ✅
- [x] Project created
- [x] Dependencies installed
- [x] Folder structure created
- [x] Theme configured
- [x] Haptics service created
- [ ] Navigation setup
- [ ] Screens implementation
- [ ] Games implementation
- [ ] Supabase integration

---

## 📝 License

Proprietary - All rights reserved

---

**Built with ❤️ for modern dating**

