/**
 * Game Session Service - Real-time multiplayer game management
 */

import { supabase } from './supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

export type GameType =
  | 'two_truths'
  | 'hot_take'
  | 'never_have_i_ever'
  | 'spark'
  | 'dare_or_drink'
  | 'battle_of_sexes'
  | 'who_said_it';

export interface GameSession {
  id: string;
  event_id: string;
  game_type: GameType;
  host_id: string;
  status: 'waiting' | 'playing' | 'finished';
  current_round: number;
  total_rounds: number;
  config: Record<string, any>;
  created_at: string;
  started_at?: string;
  finished_at?: string;
}

export interface GamePlayer {
  id: string;
  session_id: string;
  user_id: string;
  team?: 'men' | 'women' | null;
  score: number;
  chips_earned: number;
  status: 'joined' | 'ready' | 'playing' | 'finished';
  joined_at: string;
  // Joined from profiles
  profile?: {
    id: string;
    first_name: string;
    gender: string;
    avatar_url?: string;
  };
}

export interface GameAction {
  id: string;
  session_id: string;
  user_id: string;
  round: number;
  action_type: 'answer' | 'vote' | 'choice' | 'guess' | 'confession';
  action_data: Record<string, any>;
  created_at: string;
}

// Create a new game session
export async function createGameSession(
  eventId: string,
  gameType: GameType,
  hostId: string,
  totalRounds: number = 5
): Promise<GameSession | null> {
  const { data, error } = await supabase
    .from('game_sessions')
    .insert({
      event_id: eventId,
      game_type: gameType,
      host_id: hostId,
      total_rounds: totalRounds,
      status: 'waiting',
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating game session:', error);
    return null;
  }
  return data;
}

// Join a game session
export async function joinGameSession(
  sessionId: string,
  userId: string,
  team?: 'men' | 'women'
): Promise<GamePlayer | null> {
  const { data, error } = await supabase
    .from('game_players')
    .insert({
      session_id: sessionId,
      user_id: userId,
      team,
      status: 'joined',
    })
    .select()
    .single();

  if (error) {
    console.error('Error joining game:', error);
    return null;
  }
  return data;
}

// Get players in a session with profiles
export async function getGamePlayers(sessionId: string): Promise<GamePlayer[]> {
  const { data, error } = await supabase
    .from('game_players')
    .select(`
      *,
      profile:profiles(id, first_name, gender, avatar_url)
    `)
    .eq('session_id', sessionId);

  if (error) {
    console.error('Error getting players:', error);
    return [];
  }
  return data || [];
}

// Get active session for an event
export async function getActiveSession(eventId: string, gameType?: GameType): Promise<GameSession | null> {
  let query = supabase
    .from('game_sessions')
    .select('*')
    .eq('event_id', eventId)
    .in('status', ['waiting', 'playing'])
    .order('created_at', { ascending: false })
    .limit(1);

  if (gameType) {
    query = query.eq('game_type', gameType);
  }

  const { data, error } = await query.single();
  if (error) return null;
  return data;
}

// Start the game (host only)
export async function startGame(sessionId: string): Promise<boolean> {
  const { error } = await supabase
    .from('game_sessions')
    .update({ status: 'playing', started_at: new Date().toISOString() })
    .eq('id', sessionId);

  return !error;
}

// Advance to next round
export async function advanceRound(sessionId: string, currentRound: number): Promise<boolean> {
  const { error } = await supabase
    .from('game_sessions')
    .update({ current_round: currentRound + 1 })
    .eq('id', sessionId);

  return !error;
}

// End the game
export async function endGame(sessionId: string): Promise<boolean> {
  const { error } = await supabase
    .from('game_sessions')
    .update({ status: 'finished', finished_at: new Date().toISOString() })
    .eq('id', sessionId);

  return !error;
}

// Submit a game action
export async function submitAction(
  sessionId: string,
  userId: string,
  round: number,
  actionType: GameAction['action_type'],
  actionData: Record<string, any>
): Promise<GameAction | null> {
  const { data, error } = await supabase
    .from('game_actions')
    .insert({
      session_id: sessionId,
      user_id: userId,
      round,
      action_type: actionType,
      action_data: actionData,
    })
    .select()
    .single();

  if (error) {
    console.error('Error submitting action:', error);
    return null;
  }
  return data;
}

// Get actions for a round
export async function getRoundActions(sessionId: string, round: number): Promise<GameAction[]> {
  const { data, error } = await supabase
    .from('game_actions')
    .select('*')
    .eq('session_id', sessionId)
    .eq('round', round);

  if (error) return [];
  return data || [];
}

// Update player score
export async function updatePlayerScore(
  sessionId: string,
  userId: string,
  scoreToAdd: number,
  chipsToAdd: number
): Promise<boolean> {
  // Get current values
  const { data: current } = await supabase
    .from('game_players')
    .select('score, chips_earned')
    .eq('session_id', sessionId)
    .eq('user_id', userId)
    .single();

  if (!current) return false;

  const { error } = await supabase
    .from('game_players')
    .update({
      score: current.score + scoreToAdd,
      chips_earned: current.chips_earned + chipsToAdd,
    })
    .eq('session_id', sessionId)
    .eq('user_id', userId);

  return !error;
}

// Get game prompts from DB
export async function getGamePrompts(gameType: GameType, limit: number = 5): Promise<any[]> {
  const { data, error } = await supabase
    .from('game_prompts')
    .select('*')
    .eq('game_type', gameType)
    .eq('is_active', true)
    .limit(limit);

  if (error) return [];
  return data || [];
}

// ============ REALTIME SUBSCRIPTIONS ============

// Subscribe to session changes
export function subscribeToSession(
  sessionId: string,
  onSessionUpdate: (session: GameSession) => void
): RealtimeChannel {
  return supabase
    .channel(`session:${sessionId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'game_sessions',
        filter: `id=eq.${sessionId}`,
      },
      (payload) => {
        if (payload.new) {
          onSessionUpdate(payload.new as GameSession);
        }
      }
    )
    .subscribe();
}

// Subscribe to players joining/leaving
export function subscribeToPlayers(
  sessionId: string,
  onPlayersUpdate: (players: GamePlayer[]) => void
): RealtimeChannel {
  // Initial fetch + subscribe to changes
  const fetchPlayers = async () => {
    const players = await getGamePlayers(sessionId);
    onPlayersUpdate(players);
  };

  fetchPlayers();

  return supabase
    .channel(`players:${sessionId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'game_players',
        filter: `session_id=eq.${sessionId}`,
      },
      () => {
        // Refetch all players on any change
        fetchPlayers();
      }
    )
    .subscribe();
}

// Subscribe to actions (for real-time answer reveals)
export function subscribeToActions(
  sessionId: string,
  round: number,
  onNewAction: (action: GameAction) => void
): RealtimeChannel {
  return supabase
    .channel(`actions:${sessionId}:${round}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'game_actions',
        filter: `session_id=eq.${sessionId}`,
      },
      (payload) => {
        const action = payload.new as GameAction;
        if (action.round === round) {
          onNewAction(action);
        }
      }
    )
    .subscribe();
}

// Unsubscribe helper
export function unsubscribe(channel: RealtimeChannel) {
  supabase.removeChannel(channel);
}

// ============ TEAM ASSIGNMENT ============

// Auto-assign teams based on gender
export async function assignTeamsByGender(sessionId: string): Promise<void> {
  const players = await getGamePlayers(sessionId);

  for (const player of players) {
    const gender = player.profile?.gender;
    const team = gender === 'male' ? 'men' : gender === 'female' ? 'women' : null;

    if (team) {
      await supabase
        .from('game_players')
        .update({ team })
        .eq('id', player.id);
    }
  }
}

// Get players by team
export async function getPlayersByTeam(sessionId: string): Promise<{ men: GamePlayer[]; women: GamePlayer[] }> {
  const players = await getGamePlayers(sessionId);
  return {
    men: players.filter(p => p.team === 'men'),
    women: players.filter(p => p.team === 'women'),
  };
}
