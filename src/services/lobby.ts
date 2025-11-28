/**
 * Lobby Service
 * Handles game lobby and attendee data
 */

import { supabase } from './supabase';

export interface Attendee {
  id: string;
  user_id: string;
  event_id: string;
  status: 'registered' | 'checked_in' | 'cancelled';
  created_at: string;
  // Joined profile data
  profile?: {
    id: string;
    full_name: string;
    avatar_url?: string;
    gender?: string;
  };
}

/**
 * Get attendees for an event
 */
export async function getEventAttendees(eventId: string): Promise<Attendee[]> {
  const { data, error } = await supabase
    .from('event_attendees')
    .select(`
      *,
      profile:user_id (id, full_name, avatar_url, gender)
    `)
    .eq('event_id', eventId)
    .in('status', ['registered', 'checked_in']);

  if (error) throw error;
  return data || [];
}

/**
 * Get other players (excluding current user)
 */
export async function getOtherPlayers(eventId: string): Promise<Attendee[]> {
  const { data: { user } } = await supabase.auth.getUser();
  
  const attendees = await getEventAttendees(eventId);
  
  if (!user) return attendees;
  return attendees.filter(a => a.user_id !== user.id);
}

/**
 * Check in to an event
 */
export async function checkInToEvent(eventId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Must be logged in');

  const { error } = await supabase
    .from('event_attendees')
    .update({ status: 'checked_in' })
    .eq('event_id', eventId)
    .eq('user_id', user.id);

  if (error) throw error;
}

