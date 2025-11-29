/**
 * Events Service
 * Handles event data from Supabase
 */

import { supabase } from './supabase';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  venue_name: string;
  venue_address: string;
  city: string;
  capacity: number;
  price: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
  // Computed
  attendee_count?: number;
}

export interface EventAttendee {
  id: string;
  event_id: string;
  user_id: string;
  status: 'registered' | 'checked_in' | 'cancelled';
  created_at: string;
}

/**
 * Get all upcoming events
 */
export async function getEvents(): Promise<Event[]> {
  const { data, error } = await supabase
    .from('rizzk_events')
    .select('*')
    .gte('date', new Date().toISOString())
    .order('date', { ascending: true });

  if (error) throw error;
  return data || [];
}

/**
 * Get single event by ID
 */
export async function getEvent(id: string): Promise<Event | null> {
  const { data, error } = await supabase
    .from('rizzk_events')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Register for an event
 * @param eventId - Event ID to register for
 * @param devUserId - Optional user ID for dev mode (when no real auth)
 */
export async function registerForEvent(eventId: string, devUserId?: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id || devUserId;

  if (!userId) throw new Error('Must be logged in to register');

  const { error } = await supabase
    .from('event_attendees')
    .insert({
      event_id: eventId,
      user_id: userId,
      status: 'registered',
    });

  if (error) throw error;
}

/**
 * Cancel event registration
 */
export async function cancelRegistration(eventId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Must be logged in');

  const { error } = await supabase
    .from('event_attendees')
    .update({ status: 'cancelled' })
    .eq('event_id', eventId)
    .eq('user_id', user.id);

  if (error) throw error;
}

/**
 * Check if user is registered for an event
 */
export async function isUserRegistered(eventId: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data, error } = await supabase
    .from('event_attendees')
    .select('id')
    .eq('event_id', eventId)
    .eq('user_id', user.id)
    .eq('status', 'registered')
    .single();

  return !!data && !error;
}

/**
 * Get event attendees
 */
export async function getEventAttendees(eventId: string): Promise<any[]> {
  const { data, error } = await supabase
    .from('event_attendees')
    .select(`
      *,
      profiles:user_id (id, full_name, avatar_url)
    `)
    .eq('event_id', eventId)
    .eq('status', 'registered');

  if (error) throw error;
  return data || [];
}

