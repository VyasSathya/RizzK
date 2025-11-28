/**
 * Matches Service
 * Handles match data from Supabase
 */

import { supabase } from './supabase';

export interface Match {
  id: string;
  user1_id: string;
  user2_id: string;
  event_id: string;
  status: 'pending' | 'accepted' | 'declined';
  compatibility_score: number;
  created_at: string;
  // Joined data
  other_user?: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
}

/**
 * Get all matches for current user
 */
export async function getMatches(): Promise<Match[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  // Get matches where user is either user1 or user2
  const { data, error } = await supabase
    .from('matches')
    .select(`
      *,
      user1:user1_id (id, full_name, avatar_url),
      user2:user2_id (id, full_name, avatar_url)
    `)
    .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
    .eq('status', 'accepted')
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Transform to include other_user
  return (data || []).map(match => ({
    ...match,
    other_user: match.user1_id === user.id ? match.user2 : match.user1,
  }));
}

/**
 * Create a match (mutual selection)
 */
export async function createMatch(otherUserId: string, eventId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Must be logged in');

  const { error } = await supabase
    .from('matches')
    .insert({
      user1_id: user.id,
      user2_id: otherUserId,
      event_id: eventId,
      status: 'accepted',
      compatibility_score: 0,
    });

  if (error) throw error;
}

/**
 * Update match status
 */
export async function updateMatchStatus(matchId: string, status: 'accepted' | 'declined'): Promise<void> {
  const { error } = await supabase
    .from('matches')
    .update({ status })
    .eq('id', matchId);

  if (error) throw error;
}

/**
 * Check if a match exists between two users
 */
export async function matchExists(otherUserId: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data, error } = await supabase
    .from('matches')
    .select('id')
    .or(`and(user1_id.eq.${user.id},user2_id.eq.${otherUserId}),and(user1_id.eq.${otherUserId},user2_id.eq.${user.id})`)
    .single();

  return !!data && !error;
}

