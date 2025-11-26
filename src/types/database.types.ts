/**
 * RizzK Database Types
 * Matches Supabase schema from old project
 */

export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  age?: number;
  gender?: 'male' | 'female' | 'non-binary' | 'other';
  city?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

export interface QuizResponse {
  id: string;
  user_id: string;
  question_id: string;
  answer: string;
  created_at: string;
}

export interface PersonalityScore {
  id: string;
  user_id: string;
  outgoing_score: number; // 1-5
  competitive_score: number; // 1-5
  humor_style: 'sarcastic' | 'goofy' | 'dry' | 'witty';
  group_size_pref: 'intimate' | 'medium' | 'large';
  budget_tier: '15' | '20' | '25';
  age_range_pref: '21-25' | '25-30' | '30-35' | '35+';
  looking_for: 'dating' | 'friends' | 'both';
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  date: string;
  venue_name: string;
  venue_address: string;
  city: string;
  capacity: number;
  price: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface EventAttendee {
  id: string;
  event_id: string;
  user_id: string;
  status: 'registered' | 'confirmed' | 'attended' | 'no-show';
  payment_status: 'pending' | 'paid' | 'refunded';
  payment_amount: number;
  table_number?: number;
  created_at: string;
}

export interface GameSession {
  id: string;
  event_id: string;
  game_type: 'spark' | 'dare' | 'hottake' | 'never' | 'battle' | 'whosaid' | 'twotruths';
  host_user_id: string;
  status: 'waiting' | 'ready' | 'active' | 'completed' | 'cancelled';
  current_round: number;
  total_rounds: number;
  round_duration_seconds: number;
  round_started_at?: string;
  created_at: string;
  completed_at?: string;
}

export interface GameParticipant {
  id: string;
  session_id: string;
  user_id: string;
  is_ready: boolean;
  score: number;
  joined_at: string;
}

export interface GameResult {
  id: string;
  session_id: string;
  user_id: string;
  final_score: number;
  placement?: number; // 1st, 2nd, 3rd
  chips_earned: number;
  created_at: string;
}

export interface Match {
  id: string;
  event_id: string;
  user1_id: string;
  user2_id: string;
  user1_selected: boolean;
  user2_selected: boolean;
  compatibility_score?: number;
  is_mutual: boolean;
  created_at: string;
}

export interface Message {
  id: string;
  match_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read_at?: string;
}

export interface ChipBalance {
  id: string;
  user_id: string;
  total_chips: number;
  created_at: string;
  updated_at: string;
}

export interface ChipTransaction {
  id: string;
  user_id: string;
  event_id?: string;
  amount: number;
  reason: string;
  created_at: string;
}

export interface Feedback {
  id: string;
  event_id: string;
  user_id: string;
  rating: number; // 1-5
  comment?: string;
  would_return: boolean;
  created_at: string;
}

