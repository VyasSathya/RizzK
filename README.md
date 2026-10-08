# RizzK

An Expo and React Native dating-app prototype centered on personality quizzes and shared game nights. The source includes account/onboarding screens, event and lobby flows, seven game-screen implementations, match selection, and chat UI.

## Explore the source

| Area | Source |
| --- | --- |
| Application entry | [App.tsx](App.tsx) |
| Screens | [src/screens/](src/screens/) |
| Seven game screens | [src/screens/games/](src/screens/games/) |
| Game-session coordination | [useGameSession](src/hooks/useGameSession.ts), [gameSession service](src/services/gameSession.ts) |
| Accounts and backend calls | [AuthContext](src/contexts/AuthContext.tsx), [services](src/services/) |
| Types and visual system | [types](src/types/), [theme](src/theme/) |
| Multiplayer schema change | [004_game_multiplayer.sql](supabase/migrations/004_game_multiplayer.sql) |

The game screens cover Spark, Dare or Drink, Hot Take, Never Have I Ever, Battle of the Sexes, Who Said It?, and Two Truths and a Lie. Their presence describes the implementation surface; it does not establish that a live multiplayer event, matching algorithm, or chat service is operating.

## Development setup

Install Node.js and npm, then install the declared dependencies:

```sh
npm install
```

Use the included [.env.example](.env.example) as a reference and configure your own compatible Supabase project through an untracked `.env` file:

```text
EXPO_PUBLIC_SUPABASE_URL=your_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_public_anon_key
```

[src/services/supabase.ts](src/services/supabase.ts) reads these variables and has historical fallback project identifiers. The public anon key is a client identifier, not a server credential. The checkout includes a multiplayer migration; it is not documented as a complete fresh-backend bootstrap. Matching tables, storage, realtime subscriptions, and authentication still need provisioning and validation for a fresh environment.

Start the Expo development server on the package's configured port, **5555**:

```sh
npm start
# Platform-specific script declarations
npm run android
npm run ios
npm run web
```

Use a compatible Android device/emulator or an iOS simulator on macOS. The project includes a custom development-client dependency; platform compatibility and the choice of Expo Go versus a development build have not been verified in this documentation review.

## Prototype status

The repository goes beyond its original initial-setup checklist: navigation-related application code, screens, services, and game-session source are present. End-to-end backend behavior, matching quality, deployed event operation, and current device builds remain unverified here. No passing tests, app-store release, or genuine gameplay screenshots are claimed.

The visual source uses a dark/pink theme, Cinzel/Raleway font packages, and Expo haptics. Preserve the actual source and asset provenance when preparing a demo.

## License

Proprietary — all rights reserved. This preserves the repository's existing licensing statement; public visibility does not change it into a permissively licensed project.
