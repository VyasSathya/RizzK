/**
 * RizzK Supabase Client
 * Connection to backend database
 *
 * Project: Everything Studio v2 (ID: uhgiaartjabgmjolksmb)
 */

import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Supabase credentials - using Everything Studio v2 project
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://uhgiaartjabgmjolksmb.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVoZ2lhYXJ0amFiZ21qb2xrc21iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNzA2NzQsImV4cCI6MjA2Mzk0NjY3NH0.HOQqneQ6ldmpcvfCwiGxGDCzPxLwutmyd1D5-v-c714';

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

