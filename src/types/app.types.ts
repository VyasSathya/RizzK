/**
 * RizzK App Types
 * UI and application-level types
 */

import { Profile, PersonalityScore, ChipBalance } from './database.types';

// Quiz types
export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  category: 'personality' | 'preferences' | 'demographics';
}

export interface QuizOption {
  value: string;
  label: string;
  score?: number;
}

// App state
export interface AppState {
  user: Profile | null;
  personalityScore: PersonalityScore | null;
  chipBalance: ChipBalance | null;
  isLoading: boolean;
}

// Navigation types
export type RootStackParamList = {
  Landing: undefined;
  Onboarding: undefined;
  Auth: undefined;
  PersonalityQuiz: undefined;
  PhotoUpload: undefined;
  Main: undefined;
};

export type MainTabParamList = {
  Events: undefined;
  MyEvents: undefined;
  Matches: undefined;
  Profile: undefined;
};

// Game types
export type GameType = 'spark' | 'dare' | 'hottake' | 'never' | 'battle' | 'whosaid' | 'twotruths';

export interface GameConfig {
  id: GameType;
  name: string;
  description: string;
  icon: string;
  minPlayers: number;
  maxPlayers: number;
  rounds: number;
  roundDuration: number; // seconds
}

export interface Player {
  id: string;
  name: string;
  gender: 'male' | 'female' | 'non-binary' | 'other';
  isReady: boolean;
  score: number;
}

// Multiplayer coordination
export interface LobbyState {
  sessionId: string;
  gameType: GameType;
  players: Player[];
  hostId: string;
  status: 'waiting' | 'ready' | 'active' | 'completed';
  currentRound: number;
  totalRounds: number;
}

// Haptic feedback types
export type HapticType = 'light' | 'medium' | 'heavy' | 'success' | 'error' | 'notification' | 'selection';

