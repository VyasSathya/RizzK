/**
 * RizzK Supabase Client
 * Connection to backend database
 *
 * Project: RizzK (ID: yezejvxcvihumlnvxaoa)
 */

import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Supabase credentials
// TODO: Add these to your .env file
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://yezejvxcvihumlnvxaoa.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

/**
 * Database Tables (from old project schema):
 *
 * Core Tables:
 * - profiles (user profiles, extends auth.users)
 * - quiz_responses (personality quiz answers)
 * - personality_scores (calculated traits)
 * - events (game night events)
 * - event_attendees (event registrations)
 *
 * Game Tables:
 * - game_sessions (multiplayer game instances)
 * - game_participants (players in a game)
 * - game_results (final scores and chip rewards)
 *
 * Matching Tables:
 * - matches (post-event connections)
 * - feedback (event ratings)
 *
 * Gamification:
 * - chip_balances (user chip totals)
 * - chip_transactions (chip history)
 *
 * Waitlist:
 * - waitlist (city waitlist signups)
 */

