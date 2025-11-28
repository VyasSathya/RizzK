/**
 * Games Service
 * Handles game sessions, results, and chip rewards
 */

import { supabase } from './supabase';

export interface GameSession {
  id: string;
  event_id: string;
  game_type: string;
  status: 'waiting' | 'active' | 'completed';
  created_at: string;
}

export interface GameResult {
  id: string;
  session_id: string;
  user_id: string;
  score: number;
  chips_earned: number;
  created_at: string;
}

/**
 * Create a new game session
 */
export async function createGameSession(eventId: string, gameType: string): Promise<GameSession> {
  const { data, error } = await supabase
    .from('game_sessions')
    .insert({
      event_id: eventId,
      game_type: gameType,
      status: 'active',
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Save game result and award chips
 */
export async function saveGameResult(
  sessionId: string,
  score: number,
  chipsEarned: number
): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Must be logged in');

  // Save game result
  const { error: resultError } = await supabase
    .from('game_results')
    .insert({
      session_id: sessionId,
      user_id: user.id,
      score,
      chips_earned: chipsEarned,
    });

  if (resultError) throw resultError;

  // Award chips
  await awardChips(user.id, chipsEarned, `Game reward: ${chipsEarned} chips`);
}

/**
 * Award chips to user
 */
export async function awardChips(
  userId: string,
  amount: number,
  description: string
): Promise<void> {
  // Get current balance
  const { data: balance } = await supabase
    .from('chip_balances')
    .select('balance')
    .eq('user_id', userId)
    .single();

  const currentBalance = balance?.balance || 0;
  const newBalance = currentBalance + amount;

  // Upsert balance
  await supabase
    .from('chip_balances')
    .upsert({
      user_id: userId,
      balance: newBalance,
    }, { onConflict: 'user_id' });

  // Record transaction
  await supabase
    .from('chip_transactions')
    .insert({
      user_id: userId,
      amount,
      type: amount > 0 ? 'earned' : 'spent',
      description,
    });
}

/**
 * Get user's chip balance
 */
export async function getChipBalance(): Promise<number> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 0;

  const { data, error } = await supabase
    .from('chip_balances')
    .select('balance')
    .eq('user_id', user.id)
    .single();

  if (error || !data) return 0;
  return data.balance;
}

/**
 * Complete a game session
 */
export async function completeGameSession(sessionId: string): Promise<void> {
  const { error } = await supabase
    .from('game_sessions')
    .update({ status: 'completed' })
    .eq('id', sessionId);

  if (error) throw error;
}

