/**
 * Messages Service
 * Handles chat messages with Supabase realtime
 */

import { supabase } from './supabase';

export interface Message {
  id: string;
  match_id: string;
  sender_id: string;
  content: string;
  read_at: string | null;
  created_at: string;
}

/**
 * Get messages for a match
 */
export async function getMessages(matchId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('match_id', matchId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data || [];
}

/**
 * Send a message
 */
export async function sendMessage(matchId: string, content: string): Promise<Message> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Must be logged in');

  const { data, error } = await supabase
    .from('messages')
    .insert({
      match_id: matchId,
      sender_id: user.id,
      content,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Mark messages as read
 */
export async function markMessagesAsRead(matchId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase
    .from('messages')
    .update({ read_at: new Date().toISOString() })
    .eq('match_id', matchId)
    .neq('sender_id', user.id)
    .is('read_at', null);

  if (error) console.warn('Failed to mark messages as read:', error);
}

/**
 * Subscribe to new messages for a match
 */
export function subscribeToMessages(
  matchId: string,
  onMessage: (message: Message) => void
) {
  const channel = supabase
    .channel(`messages:${matchId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `match_id=eq.${matchId}`,
      },
      (payload) => {
        onMessage(payload.new as Message);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

/**
 * Get current user ID
 */
export async function getCurrentUserId(): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id || null;
}

